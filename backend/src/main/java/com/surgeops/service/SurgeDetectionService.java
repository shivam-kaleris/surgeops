package com.surgeops.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.surgeops.entity.*;
import com.surgeops.repo.*;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.stream.Collectors;

/**
 * Service that evaluates current port metrics against surge detection rules. When a surge is detected
 * it creates a Surge entity, generates alerts, writes an event and triggers action plan generation.
 */
@Service
public class SurgeDetectionService {

    private final VesselRepository vesselRepository;
    private final YardBlockRepository yardBlockRepository;
    private final SurgeRepository surgeRepository;
    private final AlertRepository alertRepository;
    private final EventRepository eventRepository;
    private final ActionPlanService actionPlanService;
    private final ObjectMapper objectMapper;

    // Rule thresholds configurable via environment
    private final double arrivalsFactor;
    private final double projectedTeuFactor;
    private final double yardUtilThreshold;
    private final int minWaitingVessels;

    public SurgeDetectionService(VesselRepository vesselRepository,
                                YardBlockRepository yardBlockRepository,
                                SurgeRepository surgeRepository,
                                AlertRepository alertRepository,
                                EventRepository eventRepository,
                                ActionPlanService actionPlanService,
                                @Value("${app.surge.arrivals.factor:1.5}") double arrivalsFactor,
                                @Value("${app.surge.projectedTeu.factor:1.4}") double projectedTeuFactor,
                                @Value("${app.surge.yardUtil.threshold:88.0}") double yardUtilThreshold,
                                @Value("${app.surge.minWaitingVessels:2}") int minWaitingVessels) {
        this.vesselRepository = vesselRepository;
        this.yardBlockRepository = yardBlockRepository;
        this.surgeRepository = surgeRepository;
        this.alertRepository = alertRepository;
        this.eventRepository = eventRepository;
        this.actionPlanService = actionPlanService;
        this.arrivalsFactor = arrivalsFactor;
        this.projectedTeuFactor = projectedTeuFactor;
        this.yardUtilThreshold = yardUtilThreshold;
        this.minWaitingVessels = minWaitingVessels;
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Evaluate current metrics and trigger surge handling if thresholds are exceeded.
     */
    @Transactional
    public Optional<Surge> evaluateAndHandle() {
        Instant now = Instant.now();
        // Compute arrivals in next 6h and baseline past 6h
        Instant sixHoursAhead = now.plus(6, ChronoUnit.HOURS);
        Instant twelveHoursAhead = now.plus(12, ChronoUnit.HOURS);
        Instant sixHoursAgo = now.minus(6, ChronoUnit.HOURS);
        Instant twelveHoursAgo = now.minus(12, ChronoUnit.HOURS);

        List<Vessel> upcoming6 = vesselRepository.findByEtaBetweenOrderByEtaAsc(now, sixHoursAhead);
        List<Vessel> past6 = vesselRepository.findByEtaBetweenOrderByEtaAsc(sixHoursAgo, now);
        int arrivalsNext6h = upcoming6.size();
        int baseline6h = past6.size() > 0 ? past6.size() : 1;

        List<Vessel> upcoming12 = vesselRepository.findByEtaBetweenOrderByEtaAsc(now, twelveHoursAhead);
        List<Vessel> past12 = vesselRepository.findByEtaBetweenOrderByEtaAsc(twelveHoursAgo, now);
        int projectedTeuNext12h = upcoming12.stream().mapToInt(v -> v.getExpectedTeu() != null ? v.getExpectedTeu() : 0).sum();
        int baselineTeu12h = past12.stream().mapToInt(v -> v.getExpectedTeu() != null ? v.getExpectedTeu() : 0).sum();
        if (baselineTeu12h == 0) baselineTeu12h = 1;

        // Yard average utilisation
        double avgYardUtil = yardBlockRepository.findAll().stream()
                .mapToDouble(YardBlock::getUtilization)
                .average().orElse(0.0);
        // Waiting vessels
        long waiting = vesselRepository.findAll().stream()
                .filter(v -> v.getStatus() != null && (v.getStatus().equals(VesselStatus.Waiting) || v.getStatus().equals(VesselStatus.Berthing)))
                .count();

        boolean surge = false;
        String reason = null;
        if (arrivalsNext6h > baseline6h * arrivalsFactor) {
            surge = true;
            reason = "High arrivals in next 6 hours";
        } else if (projectedTeuNext12h > baselineTeu12h * projectedTeuFactor) {
            surge = true;
            reason = "High projected TEU in next 12 hours";
        } else if (avgYardUtil > yardUtilThreshold && waiting >= minWaitingVessels) {
            surge = true;
            reason = "High yard utilisation and waiting vessels";
        }
        if (!surge) {
            return Optional.empty();
        }
        // Compose metrics snapshot
        Map<String, Object> metrics = new LinkedHashMap<>();
        metrics.put("arrivalsNext6h", arrivalsNext6h);
        metrics.put("baseline6h", baseline6h);
        metrics.put("projectedTeuNext12h", projectedTeuNext12h);
        metrics.put("baselineTeu12h", baselineTeu12h);
        metrics.put("avgYardUtil", avgYardUtil);
        metrics.put("waitingVessels", waiting);
        String metricsJson;
        try {
            metricsJson = objectMapper.writeValueAsString(metrics);
        } catch (Exception e) {
            metricsJson = "{}";
        }
        // Create surge entity
        Surge surgeEntity = Surge.builder()
                .surgeId(UUID.randomUUID())
                .detectedAt(now)
                .windowStart(now)
                .windowEnd(sixHoursAhead)
                .reason(reason)
                .status(SurgeStatus.open)
                .metrics(metricsJson)
                .build();
        surgeRepository.save(surgeEntity);
        // Create alert(s)
        // Suggest moving containers from most utilised block to least utilised
        List<YardBlock> blocks = yardBlockRepository.findAll();
        YardBlock fromBlock = blocks.stream().max(Comparator.comparingDouble(YardBlock::getUtilization)).orElse(null);
        YardBlock toBlock = blocks.stream().min(Comparator.comparingDouble(YardBlock::getUtilization)).orElse(null);
        int suggestionTeu = 0;
        if (fromBlock != null && toBlock != null) {
            suggestionTeu = (int) Math.round((fromBlock.getUtilization() - 80) / 100.0 * fromBlock.getCapacity());
            suggestionTeu = Math.max(suggestionTeu, 0);
        }
        Alert alert = Alert.builder()
                .alertId(UUID.randomUUID())
                .surgeId(surgeEntity.getSurgeId())
                .createdAt(now)
                .severity(AlertSeverity.HIGH)
                .message("Surge detected: " + reason)
                .acknowledged(false)
                .suggestionAction("Move containers")
                .suggestionFromBlock(fromBlock != null ? fromBlock.getCode() : null)
                .suggestionToBlock(toBlock != null ? toBlock.getCode() : null)
                .suggestionTeu(suggestionTeu)
                .build();
        alertRepository.save(alert);
        // Create event
        Event event = Event.builder()
                .eventId(UUID.randomUUID())
                .createdAt(now)
                .type(EventType.surge)
                .severity(EventSeverity.warning)
                .message("Surge detected: " + reason)
                .payload(metricsJson)
                .build();
        eventRepository.save(event);
        // Generate and persist action plan
        actionPlanService.generateAndPersistPlan(surgeEntity);
        return Optional.of(surgeEntity);
    }
}