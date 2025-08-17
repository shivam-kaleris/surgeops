package com.surgeops.repo;

import com.surgeops.entity.ContainerMove;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Repository
public interface ContainerMoveRepository extends JpaRepository<ContainerMove, UUID> {
    List<ContainerMove> findByTsAfter(Instant since);
}