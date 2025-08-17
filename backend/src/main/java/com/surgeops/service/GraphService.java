package com.surgeops.service;

import com.surgeops.dto.GraphPointDto;
import com.surgeops.entity.Vessel;
import com.surgeops.repo.VesselRepository;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.ZoneOffset;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Service for computing graph data used to display vessel arrivals and projected TEU over time.
 */
@Service
public class GraphService {

    private final VesselRepository vesselRepository;

    public GraphService(VesselRepository vesselRepository) {
        this.vesselRepository = vesselRepository;
    }

    /**
     * Generate hourly buckets between from and to (inclusive of start, exclusive of end) summarising
     * number of arrivals and projected TEU in each bucket.
     */
    public List<GraphPointDto> getGraphData(Instant from, Instant to) {
        if (from == null || to == null || !from.isBefore(to)) {
            return List.of();
        }
        // Find all vessels whose ETA falls within the window
        List<Vessel> vessels = vesselRepository.findByEtaBetweenOrderByEtaAsc(from, to);
        // Group by hour bucket (UTC)
        Map<Instant, List<Vessel>> bucketed = vessels.stream().collect(Collectors.groupingBy(v -> v.getEta().truncatedTo(ChronoUnit.HOURS)));
        List<GraphPointDto> result = new ArrayList<>();
        Instant cursor = from.truncatedTo(ChronoUnit.HOURS);
        while (!cursor.isAfter(to)) {
            Instant next = cursor.plus(1, ChronoUnit.HOURS);
            List<Vessel> bucket = bucketed.getOrDefault(cursor, List.of());
            int arrivals = bucket.size();
            int projectedTeu = bucket.stream().mapToInt(v -> v.getExpectedTeu() != null ? v.getExpectedTeu() : 0).sum();
            String label = DateTimeFormatter.ISO_INSTANT.withZone(ZoneOffset.UTC).format(cursor);
            result.add(new GraphPointDto(label, arrivals, projectedTeu));
            cursor = next;
        }
        return result;
    }
}