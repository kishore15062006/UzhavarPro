package com.example.backend.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "products", indexes = {@Index(columnList = "name,category", name = "idx_product_name_category")})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Product {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "farmer_id")
    private User farmer;

    private String name;

    private String category;

    @Column(length = 2000)
    private String description;

    private Double quantity;

    private Double pricePerKg;

    private String imageUrl;

    @Enumerated(EnumType.STRING)
    private ProductStatus status;

    @CreationTimestamp
    private Instant createdAt;
}
