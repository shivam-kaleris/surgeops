package com.surgeops.repo;

import com.surgeops.entity.Surge;
import com.surgeops.entity.SurgeStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface SurgeRepository extends JpaRepository<Surge, UUID> {
    List<Surge> findByStatusOrderByDetectedAtDesc(SurgeStatus status);
    List<Surge> findAllByOrderByDetectedAtDesc();
}