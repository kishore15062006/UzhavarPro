package com.example.backend.service;

import com.example.backend.dto.OrderDTO;

public interface DeliveryService {
    OrderDTO assignAgent(Long orderId, Long agentId);
    OrderDTO updateDeliveryStatus(Long orderId, String status);
    OrderDTO pickOrder(Long orderId, Long userId);
}
