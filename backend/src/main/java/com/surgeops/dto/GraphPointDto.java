package com.surgeops.dto;

/**
 * DTO representing a single point in the vessel updates graph.
 */
public record GraphPointDto(
        String time,
        int arrivals,
        int projectedTeu
) {}