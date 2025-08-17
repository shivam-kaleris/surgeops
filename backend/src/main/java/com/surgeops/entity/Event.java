package com.surgeops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity representing a system event such as surge detection, weather updates or other notifications.
 */
@Entity
@Table(name = "events")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Event {

    @Id
    @Column(name = "event_id", nullable = false, updatable = false)
    private UUID eventId;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt = Instant.now();

    @Enumerated(EnumType.STRING)
    @Column(name = "type")
    private EventType type;

    @Enumerated(EnumType.STRING)
    @Column(name = "severity")
    private EventSeverity severity;

    @Column(name = "message")
    private String message;

    /**
     * Additional JSON payload associated with this event. Stored as a JSON string.
     */
    @Column(name = "payload", columnDefinition = "jsonb")
    private String payload;
}