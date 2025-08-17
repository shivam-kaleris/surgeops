package com.surgeops.dto;

import java.time.Instant;
import java.time.format.DateTimeFormatter;

/**
 * DTO representing a weather observation.
 */
public record WeatherDto(
        String location,
        Double temperature,
        Double windSpeed,
        Double humidity,
        String condition,
        String icon,
        String operationalImpact,
        String observedAt
) {
    public static String formatInstant(Instant instant) {
        return DateTimeFormatter.ISO_INSTANT.format(instant);
    }
}