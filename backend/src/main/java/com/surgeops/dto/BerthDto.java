package com.surgeops.dto;

import java.util.List;
import java.util.UUID;

/**
 * DTO representing a berth and its current assignments.
 */
public record BerthDto(
        UUID id,
        String code,
        String status,
        List<BerthAssignmentDto> assignments
) {}