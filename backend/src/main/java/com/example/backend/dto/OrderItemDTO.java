package com.example.backend.dto;

import lombok.Data;

@Data
public class OrderItemDTO {
    private Long productId;
    private Double quantity;
    private Double price;
}
