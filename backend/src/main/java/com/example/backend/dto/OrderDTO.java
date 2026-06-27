package com.example.backend.dto;

import com.example.backend.entity.OrderStatus;
import lombok.Data;

import java.time.Instant;
import java.util.List;

@Data
public class OrderDTO {
    private Long id;
    private Long buyerId;
    private Long userId;
    private Long farmerId;
    private Long agentId;
    private Double totalPrice;
    private Double totalAmount;
    private Double deliveryLat;
    private Double deliveryLng;
    private String deliveryAddress;
    private String farmAddress;
    private Double farmLat;
    private Double farmLng;
    private OrderStatus status;
    private OrderStatus orderStatus;
    private Instant createdAt;
    private List<OrderItemDTO> items;
}
