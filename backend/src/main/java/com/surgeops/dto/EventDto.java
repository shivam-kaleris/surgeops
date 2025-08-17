package com.surgeops.dto;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * DTO for events returned to the frontend.
 */
public record EventDto(
        UUID id,
        String type,
        String message,
        String timestamp,
        String severity
) {
    public static String formatInstant(Instant instant) {
        return DateTimeFormatter.ISO_INSTANT.format(instant);
    }
}