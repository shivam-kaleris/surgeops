package com.surgeops.dto;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * DTO representing a vessel including ETA and TEU capacity.
 */
public record VesselDto(
        UUID id,
        String name,
        String imo,
        Integer expectedTeu,
        String eta,
        String status
) {
    public static String formatInstant(Instant instant) {
        return DateTimeFormatter.ISO_INSTANT.format(instant);
    }
}