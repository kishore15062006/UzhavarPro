package com.example.backend.dto;

import com.example.backend.entity.Role;
import lombok.Data;

import java.time.Instant;

@Data
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String password;
    private String phone;
    private Role role;
    private String address;
    private Double farmSize;
    private Double latitude;
    private Double longitude;
    private Double farmLat;
    private Double farmLng;
    private String farmAddress;
    private String vehicleType;
    private Boolean availability;
    private Instant createdAt;
}
