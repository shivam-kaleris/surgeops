package com.surgeops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing the assignment of a vessel to a berth.
 */
@Entity
@Table(name = "berth_assignments")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BerthAssignment {

    @Id
    @Column(name = "assignment_id", nullable = false, updatable = false)
    private UUID assignmentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "berth_code", referencedColumnName = "code")
    private Berth berth;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "vessel_id", referencedColumnName = "vessel_id")
    private Vessel vessel;

    @Column(name = "planned_start")
    private Instant plannedStart;

    @Column(name = "planned_end")
    private Instant plannedEnd;

    @Column(name = "actual_start")
    private Instant actualStart;

    @Column(name = "actual_end")
    private Instant actualEnd;
}