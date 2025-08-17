package com.surgeops.service;

import com.surgeops.entity.*;
import com.surgeops.repo.*;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Service that collects factual information from the database to ground LLM responses. It returns
 * a human readable text summary covering alerts, vessels, yard blocks, weather, berths and TEU processed.
 */
@Service
public class DbGroundingService {
    private final AlertRepository alertRepository;
    private final VesselRepository vesselRepository;
    private final YardBlockRepository yardBlockRepository;
    private final WeatherObservationRepository weatherObservationRepository;
    private final BerthRepository berthRepository;
    private final ContainerMoveRepository containerMoveRepository;

    public DbGroundingService(AlertRepository alertRepository,
                              VesselRepository vesselRepository,
                              YardBlockRepository yardBlockRepository,
                              WeatherObservationRepository weatherObservationRepository,
                              BerthRepository berthRepository,
                              ContainerMoveRepository containerMoveRepository) {
        this.alertRepository = alertRepository;
        this.vesselRepository = vesselRepository;
        this.yardBlockRepository = yardBlockRepository;
        this.weatherObservationRepository = weatherObservationRepository;
        this.berthRepository = berthRepository;
        this.containerMoveRepository = containerMoveRepository;
    }

    /**
     * Build a multi‑line factual summary of the current operational state.
     */
    public String buildFacts() {
        StringBuilder sb = new StringBuilder();
        // Alerts
        List<Alert> alerts = alertRepository.findAllByOrderByCreatedAtDesc();
        long active = alerts.stream().filter(a -> !Boolean.TRUE.equals(a.getAcknowledged())).count();
        sb.append(String.format("Active alerts: %d\n", active));
        if (!alerts.isEmpty()) {
            sb.append("Recent alerts:\n");
            alerts.stream().limit(3).forEach(alert -> sb.append("- ")
                    .append(alert.getSeverity()).append(": ")
                    .append(alert.getMessage()).append("\n"));
        }
        // Vessels
        List<Vessel> vessels = vesselRepository.findAll();
        List<Vessel> upcoming = vessels.stream()
                .filter(v -> v.getEta() != null && v.getEta().isAfter(Instant.now()))
                .sorted(Comparator.comparing(Vessel::getEta))
                .limit(5)
                .collect(Collectors.toList());
        if (!upcoming.isEmpty()) {
            sb.append("Upcoming/Waiting vessels:\n");
            for (Vessel v : upcoming) {
                sb.append(String.format("- %s (IMO %s) ETA %s carrying %d TEU status %s\n",
                        v.getName(),
                        v.getImo(),
                        v.getEta() != null ? v.getEta().toString() : "unknown",
                        v.getExpectedTeu() != null ? v.getExpectedTeu() : 0,
                        v.getStatus() != null ? v.getStatus().name() : "unknown"));
            }
        }
        // Yard blocks utilisation
        List<YardBlock> blocks = yardBlockRepository.findAll();
        List<YardBlock> topBlocks = blocks.stream()
                .sorted(Comparator.comparingDouble(YardBlock::getUtilization).reversed())
                .limit(3)
                .collect(Collectors.toList());
        sb.append("Top yard blocks by utilisation:\n");
        for (YardBlock b : topBlocks) {
            sb.append(String.format("- %s: %.1f%% (%s)\n", b.getCode(), b.getUtilization(), b.getStatus()))
            ;
        }
        // Latest weather
        List<WeatherObservation> weather = weatherObservationRepository.findAll();
        if (!weather.isEmpty()) {
            WeatherObservation latest = weather.stream()
                    .max(Comparator.comparing(WeatherObservation::getObservedAt))
                    .orElse(weather.get(0));
            sb.append(String.format("Latest weather (%s): %s, %.1f°C, wind %.1fm/s, humidity %.1f%% (impact %s)\n",
                    latest.getLocation(),
                    latest.getCondition(),
                    latest.getTemperature(),
                    latest.getWindSpeed(),
                    latest.getHumidity(),
                    latest.getOperationalImpact()));
        }
        // Berths status
        List<Berth> berths = berthRepository.findAll();
        if (!berths.isEmpty()) {
            sb.append("Berth status:\n");
            for (Berth b : berths) {
                sb.append(String.format("- %s: %s\n", b.getCode(), b.getStatus()));
            }
        }
        // TEU processed last 24h
        Instant since = Instant.now().minus(24, ChronoUnit.HOURS);
        int teu = containerMoveRepository.findByTsAfter(since).stream()
                .mapToInt(m -> m.getTeu() != null ? m.getTeu() : 0)
                .sum();
        sb.append(String.format("TEU processed in last 24h: %d\n", teu));
        return sb.toString();
    }
}