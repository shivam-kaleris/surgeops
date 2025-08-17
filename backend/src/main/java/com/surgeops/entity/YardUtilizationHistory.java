package com.surgeops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Historical record of yard utilisation for charting and analysis.
 */
@Entity
@Table(name = "yard_utilization_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YardUtilizationHistory {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "time", nullable = false)
    private Instant time;

    @Column(name = "utilization", nullable = false)
    private Double utilization;

    @Column(name = "threshold", nullable = false)
    private Double threshold;
}