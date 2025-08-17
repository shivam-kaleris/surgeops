package com.surgeops.dto;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * DTO for alerts returned to the frontend. Includes optional suggestion fields.
 */
public record AlertDto(
        UUID id,
        String severity,
        String message,
        String timestamp,
        boolean acknowledged,
        Suggestion suggestion
) {
    /**
     * Nested DTO for suggestions associated with an alert.
     */
    public record Suggestion(
            String action,
            String from,
            String to,
            Integer teu
    ) {}

    public static String formatInstant(Instant instant) {
        return DateTimeFormatter.ISO_INSTANT.format(instant);
    }
}