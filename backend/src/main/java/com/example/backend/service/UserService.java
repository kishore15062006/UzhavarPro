package com.example.backend.service;

import com.example.backend.dto.UserDTO;
import com.example.backend.entity.Role;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    Page<UserDTO> list(Pageable pageable);
    UserDTO getById(Long id);
    void delete(Long id);
    long countUsers();
    long countByRole(Role role);
    UserDTO updateRole(Long id, Role role);
    void suspendUser(Long id);

    /**
     * Retrieve a user record by email address.
     * Used by controllers/services when the JWT subject contains the email.
     */
    UserDTO getByEmail(String email);

    UserDTO updateProfile(Long userId, UserDTO dto);
}
