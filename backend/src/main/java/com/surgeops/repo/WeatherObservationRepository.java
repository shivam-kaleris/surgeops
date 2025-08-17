package com.surgeops.repo;

import com.surgeops.entity.WeatherObservation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface WeatherObservationRepository extends JpaRepository<WeatherObservation, UUID> {
    List<WeatherObservation> findByLocationOrderByObservedAtDesc(String location);
    List<WeatherObservation> findByLocationAndObservedAtAfterOrderByObservedAtDesc(String location, Instant since);
}