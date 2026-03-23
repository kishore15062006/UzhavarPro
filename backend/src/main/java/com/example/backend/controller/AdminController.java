package com.example.backend.controller;

import com.example.backend.dto.UserDTO;
import com.example.backend.entity.Role;
import com.example.backend.service.UserService;
import com.example.backend.service.OrderService;
import com.example.backend.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    // ==================== USER MANAGEMENT ====================

    @GetMapping("/api/admin/users")
    public ResponseEntity<Page<UserDTO>> getAllUsers(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<UserDTO> users = userService.list(pageable);
        return ResponseEntity.ok(users);
    }

    @GetMapping("/api/admin/users/{id}")
    public ResponseEntity<UserDTO> getUserById(@PathVariable Long id) {
        UserDTO user = userService.getById(id);
        return ResponseEntity.ok(user);
    }

    @PutMapping("/api/admin/users/{id}/role")
    public ResponseEntity<UserDTO> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String role = request.get("role");
        UserDTO updatedUser = userService.updateRole(id, Role.valueOf(role));
        return ResponseEntity.ok(updatedUser);
    }

    @PutMapping("/api/admin/users/{id}/suspend")
    public ResponseEntity<Map<String, Object>> suspendUser(@PathVariable Long id) {
        userService.suspendUser(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User suspended successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/api/admin/users/{id}")
    public ResponseEntity<Map<String, Object>> deleteUser(@PathVariable Long id) {
        userService.delete(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "User deleted successfully");
        return ResponseEntity.ok(response);
    }

    // ==================== PRODUCT MANAGEMENT ====================

    @GetMapping("/api/admin/products")
    public ResponseEntity<?> getAllProducts(
            @RequestParam(required = false) String category,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<?> products = productService.list(pageable);
        return ResponseEntity.ok(products);
    }

    @DeleteMapping("/api/admin/products/{id}")
    public ResponseEntity<Map<String, Object>> removeProduct(@PathVariable Long id) {
        productService.delete(id);
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", "Product removed successfully");
        return ResponseEntity.ok(response);
    }

    // ==================== ORDER MANAGEMENT ====================

    @GetMapping("/api/admin/orders")
    public ResponseEntity<?> getAllOrders(
            @RequestParam(required = false) String status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<?> orders = orderService.list(pageable);
        return ResponseEntity.ok(orders);
    }

    @GetMapping("/api/admin/orders/{id}")
    public ResponseEntity<?> getOrderDetails(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    // ==================== ANALYTICS ENDPOINTS ====================

    @GetMapping("/api/analytics/admin/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDashboardStats() {
        Map<String, Object> stats = new HashMap<>();
        try {
            stats.put("totalUsers", userService.countUsers());
            stats.put("totalOrders", orderService.countOrders());
            stats.put("totalProducts", productService.countProducts());
            stats.put("totalRevenue", orderService.getTotalRevenue());
            stats.put("success", true);
        } catch (Exception e) {
            stats.put("success", false);
            stats.put("error", e.getMessage());
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/api/analytics/admin/revenue-summary")
    public ResponseEntity<Map<String, Object>> getRevenueStats() {
        Map<String, Object> stats = new HashMap<>();
        try {
            stats.put("totalRevenue", orderService.getTotalRevenue());
            stats.put("revenues", new java.util.ArrayList<>()); // Placeholder for revenue breakdown
            stats.put("success", true);
        } catch (Exception e) {
            stats.put("success", false);
            stats.put("error", e.getMessage());
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/api/analytics/admin/user-stats")
    public ResponseEntity<Map<String, Object>> getUserStats() {
        Map<String, Object> stats = new HashMap<>();
        try {
            Map<String, Object> byRole = new HashMap<>();
            byRole.put("FARMER", userService.countByRole(Role.FARMER));
            byRole.put("PUBLIC", userService.countByRole(Role.PUBLIC));
            byRole.put("DELIVERY_AGENT", userService.countByRole(Role.DELIVERY_AGENT));
            
            stats.put("totalUsers", userService.countUsers());
            stats.put("byRole", byRole);
            stats.put("success", true);
        } catch (Exception e) {
            stats.put("success", false);
            stats.put("error", e.getMessage());
        }
        return ResponseEntity.ok(stats);
    }
}
