package com.surgeops.service;

import com.surgeops.dto.DashboardResponse;
import com.surgeops.entity.Alert;
import com.surgeops.entity.Vessel;
import com.surgeops.entity.YardBlock;
import com.surgeops.repo.AlertRepository;
import com.surgeops.repo.ContainerMoveRepository;
import com.surgeops.repo.VesselRepository;
import com.surgeops.repo.YardBlockRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;

/**
 * Service that computes the dashboard key performance indicators. It aggregates
 * data from several repositories to produce average yard utilisation, number
 * of waiting vessels, count of active alerts and TEU processed in the last
 * 24 hours.
 */
@Service
public class DashboardService {

    private final YardBlockRepository yardBlockRepository;
    private final VesselRepository vesselRepository;
    private final AlertRepository alertRepository;
    private final ContainerMoveRepository containerMoveRepository;

    public DashboardService(YardBlockRepository yardBlockRepository,
                            VesselRepository vesselRepository,
                            AlertRepository alertRepository,
                            ContainerMoveRepository containerMoveRepository) {
        this.yardBlockRepository = yardBlockRepository;
        this.vesselRepository = vesselRepository;
        this.alertRepository = alertRepository;
        this.containerMoveRepository = containerMoveRepository;
    }

    /**
     * Build a {@link DashboardResponse} by aggregating several metrics.
     *
     * @return a snapshot of dashboard KPIs
     */
    public DashboardResponse getDashboard() {
        List<YardBlock> blocks = yardBlockRepository.findAll();
        double avgUtil = blocks.stream()
                .mapToDouble(b -> b.getUtilization())
                .average()
                .orElse(0.0);

        // Waiting vessels include those waiting or berthing
        List<Vessel> vessels = vesselRepository.findAll();
        long waiting = vessels.stream()
                .filter(v -> v.getStatus() != null && (v.getStatus().name().equalsIgnoreCase("Waiting") || v.getStatus().name().equalsIgnoreCase("Berthing")))
                .count();

        long activeAlerts = alertRepository.findAll().stream()
                .filter(a -> !Boolean.TRUE.equals(a.getAcknowledged()))
                .count();

        // TEU processed in last 24h from container moves
        Instant since = Instant.now().minus(24, ChronoUnit.HOURS);
        int teuProcessed = containerMoveRepository.findByTsAfter(since).stream()
                .mapToInt(m -> m.getTeu() != null ? m.getTeu() : 0)
                .sum();

        return new DashboardResponse(
                Math.round(avgUtil * 10.0) / 10.0,
                waiting,
                activeAlerts,
                teuProcessed
        );
    }
}