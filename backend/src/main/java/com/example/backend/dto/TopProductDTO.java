package com.example.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class TopProductDTO {
    private Long productId;
    private String productName;
    private Double totalQuantity;
    private Double totalRevenue;
}
