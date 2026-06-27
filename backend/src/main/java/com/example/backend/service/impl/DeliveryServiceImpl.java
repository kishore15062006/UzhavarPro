package com.example.backend.service.impl;

import com.example.backend.dto.OrderDTO;
import com.example.backend.entity.DeliveryAgent;
import com.example.backend.entity.OrderEntity;
import com.example.backend.entity.OrderStatus;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.DeliveryAgentRepository;
import com.example.backend.repository.OrderRepository;
import com.example.backend.service.DeliveryService;
import com.example.backend.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class DeliveryServiceImpl implements DeliveryService {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private DeliveryAgentRepository agentRepository;

    @Autowired
    private MapperUtil mapper;

    @Override
    @Transactional
    public OrderDTO assignAgent(Long orderId, Long agentId) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        DeliveryAgent agent = agentRepository.findById(agentId).orElseThrow(() -> new ResourceNotFoundException("Agent not found"));
        order.setDeliveryAgent(agent);
        order.setStatus(OrderStatus.ASSIGNED);
        orderRepository.save(order);
        return mapToOrderDTO(order);
    }

    @Override
    @Transactional
    public OrderDTO updateDeliveryStatus(Long orderId, String status) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        try { order.setStatus(OrderStatus.valueOf(status)); } catch (Exception e) { throw new IllegalArgumentException("Invalid status"); }
        orderRepository.save(order);
        return mapToOrderDTO(order);
    }

    @Override
    @Transactional
    public OrderDTO pickOrder(Long orderId, Long userId) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        
        if (order.getDeliveryAgent() != null) {
            throw new IllegalArgumentException("Order already assigned to another agent");
        }
        
        DeliveryAgent agent = agentRepository.findByUserId(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Delivery agent not found"));
                
        order.setDeliveryAgent(agent);
        order.setStatus(OrderStatus.ASSIGNED);
        OrderEntity saved = orderRepository.save(order);
        return mapToOrderDTO(saved);
    }

    private OrderDTO mapToOrderDTO(OrderEntity order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setBuyerId(order.getBuyer() != null ? order.getBuyer().getId() : null);
        dto.setUserId(order.getBuyer() != null ? order.getBuyer().getId() : null);
        dto.setFarmerId(order.getFarmer() != null ? order.getFarmer().getId() : null);
        dto.setAgentId(order.getDeliveryAgent() != null ? order.getDeliveryAgent().getId() : null);
        dto.setTotalPrice(order.getTotalPrice());
        dto.setTotalAmount(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setOrderStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());
        
        if (order.getFarmer() != null) {
            dto.setFarmLat(order.getFarmer().getFarmLat());
            dto.setFarmLng(order.getFarmer().getFarmLng());
            dto.setFarmAddress(order.getFarmer().getFarmAddress());
        }
        
        dto.setDeliveryLat(order.getDeliveryLat());
        dto.setDeliveryLng(order.getDeliveryLng());
        dto.setDeliveryAddress(order.getDeliveryAddress());
        
        return dto;
    }
}
