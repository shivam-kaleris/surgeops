package com.surgeops.repo;

import com.surgeops.entity.ActionPlan;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Repository
public interface ActionPlanRepository extends JpaRepository<ActionPlan, UUID> {
    Optional<ActionPlan> findTopBySurge_SurgeIdOrderByGeneratedAtDesc(UUID surgeId);
    List<ActionPlan> findBySurge_SurgeIdOrderByGeneratedAtDesc(UUID surgeId);
}