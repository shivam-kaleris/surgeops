package com.surgeops.repo;

import com.surgeops.entity.Vessel;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface VesselRepository extends JpaRepository<Vessel, UUID> {
    Optional<Vessel> findByName(String name);
    Optional<Vessel> findByImo(String imo);
    List<Vessel> findByEtaBetweenOrderByEtaAsc(Instant start, Instant end);
    List<Vessel> findByEtaAfterOrderByEtaAsc(Instant start);
}