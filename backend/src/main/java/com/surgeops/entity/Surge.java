package com.surgeops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing a surge in port operations.
 */
@Entity
@Table(name = "surges")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Surge {

    @Id
    @Column(name = "surge_id", nullable = false, updatable = false)
    private UUID surgeId;

    @Column(name = "detected_at", nullable = false)
    private Instant detectedAt = Instant.now();

    @Column(name = "window_start")
    private Instant windowStart;

    @Column(name = "window_end")
    private Instant windowEnd;

    @Column(name = "reason")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private SurgeStatus status = SurgeStatus.open;

    /**
     * JSON encoded metrics snapshot for this surge. We store as text and cast to jsonb in SQL.
     */
    @Column(name = "metrics", columnDefinition = "jsonb")
    private String metrics;
}