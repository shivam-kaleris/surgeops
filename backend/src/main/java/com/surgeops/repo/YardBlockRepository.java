package com.surgeops.repo;

import com.surgeops.entity.YardBlock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface YardBlockRepository extends JpaRepository<YardBlock, UUID> {
    Optional<YardBlock> findByCode(String code);
}