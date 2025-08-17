package com.surgeops.dto;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * DTO representing the assignment of a vessel to a berth.
 */
public record BerthAssignmentDto(
        UUID id,
        String berthCode,
        VesselDto vessel,
        String plannedStart,
        String plannedEnd,
        String actualStart,
        String actualEnd
) {
    public static String formatInstant(Instant instant) {
        return instant != null ? DateTimeFormatter.ISO_INSTANT.format(instant) : null;
    }
}