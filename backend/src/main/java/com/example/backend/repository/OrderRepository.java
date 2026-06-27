package com.example.backend.repository;

import com.example.backend.entity.OrderEntity;
import com.example.backend.entity.OrderStatus;
import com.example.backend.entity.User;
import com.example.backend.entity.DeliveryAgent;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderRepository extends JpaRepository<OrderEntity, Long> {
    Page<OrderEntity> findByBuyer(User buyer, Pageable pageable);
    Page<OrderEntity> findByFarmer(User farmer, Pageable pageable);
    long countByFarmer(User farmer);
    long countByBuyer(User buyer);
    List<OrderEntity> findByFarmerAndStatus(User farmer, OrderStatus status);
    List<OrderEntity> findByFarmer(User farmer);
    List<OrderEntity> findByBuyer(User buyer);
    Page<OrderEntity> findByDeliveryAgent(DeliveryAgent deliveryAgent, Pageable pageable);
    Page<OrderEntity> findByStatusAndDeliveryAgentIsNull(OrderStatus status, Pageable pageable);
    long countByDeliveryAgent(DeliveryAgent deliveryAgent);
    long countByDeliveryAgentAndStatus(DeliveryAgent deliveryAgent, OrderStatus status);
    long countByDeliveryAgentAndStatusIn(DeliveryAgent deliveryAgent, List<OrderStatus> statuses);
}
