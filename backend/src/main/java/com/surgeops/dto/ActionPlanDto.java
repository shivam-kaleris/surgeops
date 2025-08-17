package com.surgeops.dto;

import java.time.Instant;
import java.time.format.DateTimeFormatter;
import java.util.UUID;

/**
 * DTO representing an action plan returned to the frontend.
 */
public record ActionPlanDto(
        UUID planId,
        UUID surgeId,
        String generatedAt,
        String status,
        String payload
) {
    public static String formatInstant(Instant instant) {
        return DateTimeFormatter.ISO_INSTANT.format(instant);
    }
}