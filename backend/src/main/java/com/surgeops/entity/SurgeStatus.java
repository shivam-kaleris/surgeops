package com.surgeops.entity;

/**
 * Status of a surge. Values correspond to DB constraint.
 */
public enum SurgeStatus {
    open,
    accepted,
    closed
}