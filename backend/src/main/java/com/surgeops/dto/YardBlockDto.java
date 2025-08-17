package com.surgeops.dto;

import java.util.UUID;

/**
 * DTO representing a yard block with its current utilisation.
 */
public record YardBlockDto(
        UUID id,
        String code,
        String category,
        int capacity,
        int current,
        double utilization,
        String status
) {}