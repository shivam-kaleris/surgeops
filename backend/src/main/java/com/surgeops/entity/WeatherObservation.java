package com.surgeops.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.Instant;
import java.util.UUID;

/**
 * Entity recording a snapshot of observed weather conditions.
 */
@Entity
@Table(name = "weather_observations")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WeatherObservation {

    @Id
    @Column(name = "id", nullable = false, updatable = false)
    private UUID id;

    @Column(name = "location")
    private String location;

    @Column(name = "temperature")
    private Double temperature;

    @Column(name = "wind_speed")
    private Double windSpeed;

    @Column(name = "humidity")
    private Double humidity;

    @Column(name = "condition")
    private String condition;

    @Column(name = "icon")
    private String icon;

    @Enumerated(EnumType.STRING)
    @Column(name = "operational_impact")
    private OperationalImpact operationalImpact;

    @Column(name = "observed_at")
    private Instant observedAt;
}