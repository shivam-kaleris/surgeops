package com.surgeops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing a factual chunk stored in the vector knowledge base. Each
 * chunk belongs to a particular kind (vessel, yard_block, berth, alert, weather, kpi).
 */
@Entity
@Table(name = "kb_chunks")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class KbChunk {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "kind")
    private String kind;

    @Column(name = "source_key", nullable = false)
    private String sourceKey;

    @Column(name = "title", nullable = false)
    private String title;

    @Lob
    @Column(name = "content", nullable = false)
    private String content;

    @Column(name = "uri")
    private String uri;

    @Column(name = "meta", columnDefinition = "jsonb")
    private String meta;

    /**
     * Embedding vector stored as a comma separated list of floats. When issuing
     * similarity queries we cast the string to a vector on the database side.
     */
    @Column(name = "embedding", columnDefinition = "vector")
    private String embedding;

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();
}