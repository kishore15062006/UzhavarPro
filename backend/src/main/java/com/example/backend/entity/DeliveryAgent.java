package com.example.backend.entity;

import lombok.*;

import jakarta.persistence.*;

@Entity
@Table(name = "delivery_agents")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DeliveryAgent {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String vehicleType;

    private Boolean availability;
}
