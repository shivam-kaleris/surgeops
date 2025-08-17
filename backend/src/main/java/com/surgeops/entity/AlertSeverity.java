package com.surgeops.entity;

/**
 * Severity levels for alerts. These values must match the constraint defined
 * in the database schema (LOW, MEDIUM, HIGH, CRITICAL).
 */
public enum AlertSeverity {
    LOW,
    MEDIUM,
    HIGH,
    CRITICAL
}