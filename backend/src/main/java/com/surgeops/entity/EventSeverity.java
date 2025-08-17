package com.surgeops.entity;

/**
 * Severity for events. Values are lowercase to match DB check constraint (info, warning, error).
 */
public enum EventSeverity {
    info,
    warning,
    error
}