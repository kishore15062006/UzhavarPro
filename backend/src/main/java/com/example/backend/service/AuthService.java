package com.example.backend.service;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;

public interface AuthService {
    AuthResponse login(AuthRequest req);
    void register(com.example.backend.dto.UserDTO userDTO, String rawPassword);
}
