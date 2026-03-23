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
        return mapper.map(order, OrderDTO.class);
    }

    @Override
    @Transactional
    public OrderDTO updateDeliveryStatus(Long orderId, String status) {
        OrderEntity order = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        try { order.setStatus(OrderStatus.valueOf(status)); } catch (Exception e) { throw new IllegalArgumentException("Invalid status"); }
        orderRepository.save(order);
        return mapper.map(order, OrderDTO.class);
    }
}
