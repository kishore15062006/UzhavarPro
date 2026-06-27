package com.example.backend.service.impl;

import com.example.backend.dto.AuthRequest;
import com.example.backend.dto.AuthResponse;
import com.example.backend.dto.UserDTO;
import com.example.backend.entity.User;
import com.example.backend.entity.DeliveryAgent;
import com.example.backend.exception.InvalidRequestException;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.DeliveryAgentRepository;
import com.example.backend.security.JwtUtil;
import com.example.backend.service.AuthService;
import com.example.backend.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeliveryAgentRepository deliveryAgentRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private MapperUtil mapper;

    @Override
    public AuthResponse login(AuthRequest req) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(req.getEmail(), req.getPassword())
            );
        } catch (BadCredentialsException ex) {
            throw new InvalidRequestException("Invalid credentials");
        }

        User u = userRepository.findByEmail(req.getEmail()).orElseThrow(() -> new InvalidRequestException("User not found"));

        String token = jwtUtil.generateToken(u.getEmail(), u.getRole().name());
        String refreshToken = jwtUtil.generateToken(u.getEmail(), u.getRole().name());
        
        UserDTO userDto = mapper.map(u, UserDTO.class);
        
        return new AuthResponse(token, refreshToken, userDto);
    }

    @Override
    @Transactional
    public void register(UserDTO userDTO, String rawPassword) {
        if (userRepository.existsByEmail(userDTO.getEmail())) {
            throw new InvalidRequestException("Email already in use");
        }

        User u = mapper.map(userDTO, User.class);
        u.setPassword(passwordEncoder.encode(rawPassword));
        User savedUser = userRepository.save(u);

        if (savedUser.getRole() == com.example.backend.entity.Role.DELIVERY_AGENT) {
            DeliveryAgent agent = DeliveryAgent.builder()
                    .user(savedUser)
                    .availability(true)
                    .vehicleType("MOTORCYCLE")
                    .build();
            deliveryAgentRepository.save(agent);
        }
    }
}
