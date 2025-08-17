package com.surgeops.dto;

/**
 * DTO representing key performance indicators for the dashboard. Matches the UI contract.
 */
public record DashboardResponse(
        double avgYardUtilization,
        long waitingVessels,
        long activeAlerts,
        long teuProcessed24h
) {}