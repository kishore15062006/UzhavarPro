package com.example.backend.service.impl;

import com.example.backend.dto.LocationDTO;
import com.example.backend.dto.UserDTO;
import com.example.backend.entity.User;
import com.example.backend.entity.Role;
// import com.example.backend.entity.OrderEntity;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.UserRepository;
import com.example.backend.repository.DeliveryAgentRepository;
import com.example.backend.entity.DeliveryAgent;
// import com.example.backend.repository.OrderRepository;
import com.example.backend.service.UserService;
import com.example.backend.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private DeliveryAgentRepository deliveryAgentRepository;

    // @Autowired
    // private OrderRepository orderRepository;

    @Autowired
    private MapperUtil mapper;

    private UserDTO mapToUserDTO(User u) {
        if (u == null) return null;
        UserDTO dto = mapper.map(u, UserDTO.class);
        if (u.getRole() == Role.DELIVERY_AGENT) {
            deliveryAgentRepository.findByUserId(u.getId()).ifPresent(agent -> {
                dto.setVehicleType(agent.getVehicleType());
                dto.setAvailability(agent.getAvailability());
            });
        }
        return dto;
    }

    @Override
    public Page<UserDTO> list(Pageable pageable) {
        Page<User> page = userRepository.findAll(pageable);
        return new PageImpl<>(page.getContent().stream().map(this::mapToUserDTO).collect(Collectors.toList()), pageable, page.getTotalElements());
    }

    @Override
    public UserDTO getById(Long id) {
        User u = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserDTO(u);
    }

    @Override
    public void delete(Long id) {
        if (!userRepository.existsById(id)) throw new ResourceNotFoundException("User not found");
        userRepository.deleteById(id);
    }

    @Override
    public long countUsers() {
        return userRepository.count();
    }

    @Override
    public long countByRole(Role role) {
        return userRepository.countByRole(role);
    }

    @Override
    public UserDTO updateRole(Long id, Role role) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setRole(role);
        User updated = userRepository.save(user);
        return mapToUserDTO(updated);
    }

    @Override
    public void suspendUser(Long id) {
        User user = userRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        user.setActive(false);
        userRepository.save(user);
    }

    @Override
    public UserDTO getByEmail(String email) {
        User u = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        return mapToUserDTO(u);
    }

    @Override
    public UserDTO updateProfile(Long userId, UserDTO dto) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (dto.getName() != null) user.setName(dto.getName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getPhone() != null) user.setPhone(dto.getPhone());
        if (dto.getAddress() != null) {
            user.setAddress(dto.getAddress());
            if (user.getRole() == Role.FARMER) {
                user.setFarmAddress(dto.getAddress());
            }
        }
        if (dto.getFarmSize() != null) user.setFarmSize(dto.getFarmSize());

        User updated = userRepository.save(user);

        if (user.getRole() == Role.DELIVERY_AGENT) {
            deliveryAgentRepository.findByUserId(userId).ifPresent(agent -> {
                if (dto.getVehicleType() != null) agent.setVehicleType(dto.getVehicleType());
                if (dto.getAvailability() != null) agent.setAvailability(dto.getAvailability());
                deliveryAgentRepository.save(agent);
            });
        }

        return mapToUserDTO(updated);
    }

    @Override
    public UserDTO updateLocation(Long userId, LocationDTO locationDTO) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        if (user.getRole() == Role.FARMER) {
            if (locationDTO.getLat() != null) user.setFarmLat(locationDTO.getLat());
            if (locationDTO.getLng() != null) user.setFarmLng(locationDTO.getLng());
            if (locationDTO.getAddress() != null) {
                user.setFarmAddress(locationDTO.getAddress());
                user.setAddress(locationDTO.getAddress());
            }
        } else {
            if (locationDTO.getLat() != null) user.setLatitude(locationDTO.getLat());
            if (locationDTO.getLng() != null) user.setLongitude(locationDTO.getLng());
            if (locationDTO.getAddress() != null) user.setAddress(locationDTO.getAddress());
        }

        User updated = userRepository.save(user);
        return mapToUserDTO(updated);
    }
}
