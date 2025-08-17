package com.surgeops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.util.UUID;

/**
 * Entity representing a yard block with a certain category and capacity.
 */
@Entity
@Table(name = "yard_blocks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class YardBlock {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "code", nullable = false, unique = true)
    private String code;

    @Enumerated(EnumType.STRING)
    @Column(name = "category", nullable = false)
    private YardBlockCategory category;

    @Column(name = "capacity", nullable = false)
    private Integer capacity;

    @Column(name = "current_count", nullable = false)
    private Integer currentCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private YardBlockStatus status;

    /**
     * Compute current utilisation as a percentage of capacity. Not persisted.
     *
     * @return utilisation percentage (0–100)
     */
    @Transient
    public double getUtilization() {
        if (capacity == null || capacity == 0) {
            return 0d;
        }
        return (currentCount * 100.0) / capacity;
    }
}