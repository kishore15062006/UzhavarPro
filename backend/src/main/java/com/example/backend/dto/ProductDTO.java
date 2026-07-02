package com.example.backend.dto;

import com.example.backend.entity.ProductStatus;
import lombok.Data;

import java.time.Instant;

@Data
public class ProductDTO {
    private Long id;
    private Long farmerId;
    private String name;
    private String category;
    private String description;
    private Double quantity;
    private Double pricePerKg;
    private String imageUrl;
    private String farmerName;
    private String farmerLocation;
    private ProductStatus status;
    private Instant createdAt;
}
