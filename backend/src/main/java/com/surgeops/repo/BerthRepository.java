package com.surgeops.repo;

import com.surgeops.entity.Berth;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;
import java.util.UUID;

@Repository
public interface BerthRepository extends JpaRepository<Berth, UUID> {
    Optional<Berth> findByCode(String code);
}