package com.surgeops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity recording container movements between yard blocks.
 */
@Entity
@Table(name = "container_moves")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ContainerMove {

    @Id
    @Column(name = "move_id", nullable = false, updatable = false)
    private UUID moveId;

    @Column(name = "from_block")
    private String fromBlock;

    @Column(name = "to_block")
    private String toBlock;

    @Column(name = "teu")
    private Integer teu;

    @Column(name = "ts")
    private Instant ts = Instant.now();
}