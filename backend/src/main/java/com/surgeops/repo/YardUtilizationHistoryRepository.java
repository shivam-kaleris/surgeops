package com.surgeops.repo;

import com.surgeops.entity.YardUtilizationHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface YardUtilizationHistoryRepository extends JpaRepository<YardUtilizationHistory, UUID> {
    List<YardUtilizationHistory> findByTimeAfterOrderByTimeAsc(Instant since);
    List<YardUtilizationHistory> findAllByOrderByTimeAsc();
}