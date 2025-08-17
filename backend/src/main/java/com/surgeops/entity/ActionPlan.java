package com.surgeops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing an action plan associated with a surge.
 */
@Entity
@Table(name = "action_plans")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ActionPlan {

    @Id
    @Column(name = "plan_id", nullable = false, updatable = false)
    private UUID planId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "surge_id")
    private Surge surge;

    @Column(name = "generated_at", nullable = false)
    private Instant generatedAt = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private ActionPlanStatus status = ActionPlanStatus.ready;

    @Column(name = "payload", columnDefinition = "jsonb", nullable = false)
    private String payload;
}