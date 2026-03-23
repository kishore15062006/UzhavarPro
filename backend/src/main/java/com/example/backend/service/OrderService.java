package com.example.backend.service;

import com.example.backend.dto.OrderDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderService {
    OrderDTO create(OrderDTO dto);
    OrderDTO getById(Long id);
    Page<OrderDTO> listForUser(Long userId, Pageable pageable);
    Page<OrderDTO> list(Pageable pageable);
    OrderDTO updateStatus(Long orderId, String status);
    long countOrders();
    double getTotalRevenue();
    
    // Farmer specific methods
    Page<OrderDTO> listForFarmer(Long farmerId, Pageable pageable);

    // Analytics methods
    long countOrdersByFarmer(Long farmerId);
    double getTotalSalesByFarmer(Long farmerId);
    
    // Delivery methods  
    Page<OrderDTO> listForDeliveryAgent(Long deliveryUserId, Pageable pageable);
    long countDeliveriesByAgent(Long agentId);
    long countCompletedDeliveriesByAgent(Long agentId);
    long countPendingDeliveriesByAgent(Long agentId);
}

