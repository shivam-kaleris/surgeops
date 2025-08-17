package com.surgeops.repo;

import com.surgeops.entity.Alert;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface AlertRepository extends JpaRepository<Alert, UUID> {

    /**
     * Returns all alerts with createdAt after the supplied timestamp, ordered descending by createdAt.
     *
     * @param since timestamp to filter on
     * @return list of alerts
     */
    List<Alert> findByCreatedAtAfterOrderByCreatedAtDesc(Instant since);

    /**
     * Returns all alerts ordered descending by createdAt.
     */
    List<Alert> findAllByOrderByCreatedAtDesc();
}