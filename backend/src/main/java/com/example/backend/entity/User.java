package com.example.backend.entity;

import lombok.*;
import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "users", indexes = {@Index(columnList = "email", name = "idx_user_email")})
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(nullable = false, unique = true)
    private String email;

    private String phone;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    private Role role;

    private String address;

    private Double farmSize;

    private Double latitude;

    private Double longitude;

    @Column(name = "farm_lat")
    private Double farmLat;

    @Column(name = "farm_lng")
    private Double farmLng;

    @Column(name = "farm_address")
    private String farmAddress;

    @Builder.Default
    private boolean active = true;

    @CreationTimestamp
    private Instant createdAt;
}
