package com.example.backend.controller;

import com.example.backend.dto.OrderDTO;
import com.example.backend.service.OrderService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping
    public ResponseEntity<OrderDTO> create(@RequestBody OrderDTO dto) {
        return ResponseEntity.ok(orderService.create(dto));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> get(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.getById(id));
    }

    @GetMapping("/user")
    public ResponseEntity<Page<OrderDTO>> listForUser(@RequestParam Long userId, @RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        Pageable p = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.listForUser(userId, p));
    }

    @GetMapping("/user/my-orders")
    public ResponseEntity<Page<OrderDTO>> getMyOrders(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        // Get current authenticated user
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Long userId = userService.getByEmail(email).getId();

        Pageable p = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.listForUser(userId, p));
    }

    @GetMapping("/farmer/incoming")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<Page<OrderDTO>> listForFarmer(@RequestParam(defaultValue = "0") int page, @RequestParam(defaultValue = "10") int size) {
        // Current user is authenticated farmer
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Long farmerId = userService.getByEmail(email).getId();

        Pageable p = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.listForFarmer(farmerId, p));
    }

    @PutMapping("/status")
    @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
    public ResponseEntity<OrderDTO> updateStatus(@RequestParam Long orderId, @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateStatus(orderId, status));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('FARMER','ADMIN')")
    public ResponseEntity<OrderDTO> updateStatusByPath(@PathVariable Long id, @RequestBody java.util.Map<String, String> request) {
        return ResponseEntity.ok(orderService.updateStatus(id, request.get("status")));
    }

    @PostMapping("/{id}/accept")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<OrderDTO> acceptOrder(@PathVariable Long id) {
        OrderDTO order = orderService.getById(id);
        return ResponseEntity.ok(order);
    }

    @PostMapping("/{id}/reject")
    @PreAuthorize("hasRole('FARMER')")
    public ResponseEntity<OrderDTO> rejectOrder(@PathVariable Long id) {
        return ResponseEntity.ok(orderService.updateStatus(id, "CANCELLED"));
    }
}
