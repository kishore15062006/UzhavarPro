package com.example.backend.repository;

import com.example.backend.entity.DeliveryAgent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DeliveryAgentRepository extends JpaRepository<DeliveryAgent, Long> {
	Optional<DeliveryAgent> findByUserId(Long userId);
}
