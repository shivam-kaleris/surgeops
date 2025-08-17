package com.surgeops.service;

import com.surgeops.entity.*;
import com.surgeops.repo.*;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service that rebuilds the knowledge base by extracting facts from the database, embedding them
 * and upserting them into the kb_chunks table. This is used for retrieval augmented generation.
 */
@Service
public class FactIngestService {
    private final VesselRepository vesselRepository;
    private final YardBlockRepository yardBlockRepository;
    private final BerthRepository berthRepository;
    private final AlertRepository alertRepository;
    private final WeatherObservationRepository weatherObservationRepository;
    private final KbChunkRepository kbChunkRepository;
    private final AzureOpenAiService azureOpenAiService;
    private final DashboardService dashboardService;

    public FactIngestService(VesselRepository vesselRepository,
                             YardBlockRepository yardBlockRepository,
                             BerthRepository berthRepository,
                             AlertRepository alertRepository,
                             WeatherObservationRepository weatherObservationRepository,
                             KbChunkRepository kbChunkRepository,
                             AzureOpenAiService azureOpenAiService,
                             DashboardService dashboardService) {
        this.vesselRepository = vesselRepository;
        this.yardBlockRepository = yardBlockRepository;
        this.berthRepository = berthRepository;
        this.alertRepository = alertRepository;
        this.weatherObservationRepository = weatherObservationRepository;
        this.kbChunkRepository = kbChunkRepository;
        this.azureOpenAiService = azureOpenAiService;
        this.dashboardService = dashboardService;
    }

    /**
     * Rebuild the entire knowledge base from scratch. This operation removes all existing chunks
     * and ingests fresh facts. Each fact is embedded via Azure OpenAI if configured.
     */
    @Transactional
    public int rebuild() {
        kbChunkRepository.deleteAll();
        List<KbChunk> chunks = new ArrayList<>();
        // Vessels
        for (Vessel v : vesselRepository.findAll()) {
            String content = String.format("Vessel %s (IMO %s) arrives at %s carrying %d TEU. Status: %s.",
                    v.getName(),
                    v.getImo(),
                    v.getEta() != null ? v.getEta().toString() : "unknown",
                    v.getExpectedTeu() != null ? v.getExpectedTeu() : 0,
                    v.getStatus());
            chunks.add(new KbChunk(
                    UUID.randomUUID(),
                    "vessel",
                    v.getVesselId().toString(),
                    v.getName(),
                    content,
                    null,
                    null,
                    null,
                    Instant.now()
            ));
        }
        // Yard blocks
        for (YardBlock b : yardBlockRepository.findAll()) {
            String content = String.format("Yard block %s (category %s) has capacity %d and current count %d (%.1f%% utilisation). Status: %s.",
                    b.getCode(),
                    b.getCategory(),
                    b.getCapacity(),
                    b.getCurrentCount(),
                    b.getUtilization(),
                    b.getStatus());
            chunks.add(new KbChunk(
                    UUID.randomUUID(),
                    "yard_block",
                    b.getCode(),
                    "Yard block " + b.getCode(),
                    content,
                    null,
                    null,
                    null,
                    Instant.now()
            ));
        }
        // Berths
        for (Berth berth : berthRepository.findAll()) {
            String content = String.format("Berth %s is currently %s.", berth.getCode(), berth.getStatus());
            chunks.add(new KbChunk(
                    UUID.randomUUID(),
                    "berth",
                    berth.getCode(),
                    "Berth " + berth.getCode(),
                    content,
                    null,
                    null,
                    null,
                    Instant.now()
            ));
        }
        // Alerts
        for (Alert a : alertRepository.findAll()) {
            String content = String.format("Alert: %s - %s. Suggestion: %s from %s to %s, TEU %s.",
                    a.getSeverity(),
                    a.getMessage(),
                    a.getSuggestionAction(),
                    a.getSuggestionFromBlock(),
                    a.getSuggestionToBlock(),
                    a.getSuggestionTeu());
            chunks.add(new KbChunk(
                    UUID.randomUUID(),
                    "alert",
                    a.getAlertId().toString(),
                    "Alert " + a.getAlertId(),
                    content,
                    null,
                    null,
                    null,
                    Instant.now()
            ));
        }
        // Weather
        List<WeatherObservation> obs = weatherObservationRepository.findAll();
        if (!obs.isEmpty()) {
            WeatherObservation latest = obs.stream()
                    .max(Comparator.comparing(WeatherObservation::getObservedAt))
                    .orElse(obs.get(0));
            String content = String.format("Weather at %s: %s, %.1f°C, wind %.1fm/s, humidity %.1f%%, impact %s.",
                    latest.getLocation(),
                    latest.getCondition(),
                    latest.getTemperature(),
                    latest.getWindSpeed(),
                    latest.getHumidity(),
                    latest.getOperationalImpact());
            chunks.add(new KbChunk(
                    UUID.randomUUID(),
                    "weather",
                    latest.getLocation(),
                    "Weather at " + latest.getLocation(),
                    content,
                    null,
                    null,
                    null,
                    Instant.now()
            ));
        }
        // KPIs
        var dashboard = dashboardService.getDashboard();
        String kpiContent = String.format("Average yard utilisation %.1f%%, waiting vessels %d, active alerts %d, TEU processed 24h %d.",
                dashboard.avgYardUtilization(),
                dashboard.waitingVessels(),
                dashboard.activeAlerts(),
                dashboard.teuProcessed24h());
        chunks.add(new KbChunk(
                UUID.randomUUID(),
                "kpi",
                "dashboard",
                "Dashboard KPIs",
                kpiContent,
                null,
                null,
                null,
                Instant.now()
        ));
        // Embed and persist
        List<String> contents = chunks.stream().map(KbChunk::getContent).collect(Collectors.toList());
        List<float[]> embeddings = azureOpenAiService.isConfigured() ? azureOpenAiService.embed(contents) : Collections.emptyList();
        for (int i = 0; i < chunks.size(); i++) {
            KbChunk chunk = chunks.get(i);
            if (azureOpenAiService.isConfigured() && i < embeddings.size()) {
                float[] vec = embeddings.get(i);
                String literal = toVectorLiteral(vec);
                chunk.setEmbedding(literal);
            } else {
                chunk.setEmbedding(null);
            }
        }
        kbChunkRepository.saveAll(chunks);
        return chunks.size();
    }

    private String toVectorLiteral(float[] vec) {
        StringBuilder sb = new StringBuilder();
        sb.append('[');
        for (int i = 0; i < vec.length; i++) {
            sb.append(Float.toString(vec[i]));
            if (i < vec.length - 1) sb.append(',');
        }
        sb.append(']');
        return sb.toString();
    }
}