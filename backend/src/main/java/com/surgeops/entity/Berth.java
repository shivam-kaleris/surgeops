package com.surgeops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

/**
 * Entity representing a berth in the port.
 */
@Entity
@Table(name = "berths")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Berth {

    @Id
    @Column(name = "berth_id", nullable = false, updatable = false)
    private UUID berthId;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private BerthStatus status;
}