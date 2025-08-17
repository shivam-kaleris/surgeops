package com.surgeops.repo;

import com.surgeops.entity.BerthAssignment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface BerthAssignmentRepository extends JpaRepository<BerthAssignment, UUID> {
    List<BerthAssignment> findByBerth_Code(String code);
    List<BerthAssignment> findByVessel_VesselId(UUID vesselId);
}