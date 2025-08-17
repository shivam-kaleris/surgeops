package com.surgeops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing a vessel calling at the port.
 */
@Entity
@Table(name = "vessels")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vessel {

    @Id
    @Column(name = "vessel_id", nullable = false, updatable = false)
    private UUID vesselId;

    @Column(name = "name")
    private String name;

    @Column(name = "imo")
    private String imo;

    @Column(name = "expected_teu")
    private Integer expectedTeu;

    @Column(name = "eta")
    private Instant eta;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private VesselStatus status;
}