package com.example.backend.controller;

import com.example.backend.dto.OrderDTO;
import com.example.backend.service.DeliveryService;
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

import java.util.Map;

@RestController
@RequestMapping("/api/delivery")
public class DeliveryController {

    @Autowired
    private DeliveryService deliveryService;

    @Autowired
    private OrderService orderService;

    @Autowired
    private UserService userService;

    @PostMapping("/assign")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> assign(@RequestParam Long orderId, @RequestParam Long agentId) {
        return ResponseEntity.ok(deliveryService.assignAgent(orderId, agentId));
    }

    @PostMapping(value = "/assign", consumes = "application/json")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDTO> assignFromBody(@RequestBody Map<String, Long> request) {
        Long orderId = request.get("orderId");
        Long agentId = request.get("agentId");
        return ResponseEntity.ok(deliveryService.assignAgent(orderId, agentId));
    }

    @PutMapping("/status")
    @PreAuthorize("hasRole('DELIVERY_AGENT')")
    public ResponseEntity<OrderDTO> updateStatus(@RequestParam Long orderId, @RequestParam String status) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(orderId, status));
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('DELIVERY_AGENT')")
    public ResponseEntity<OrderDTO> updateStatusByPath(@PathVariable Long id, @RequestBody Map<String, String> request) {
        return ResponseEntity.ok(deliveryService.updateDeliveryStatus(id, request.get("status")));
    }

    @GetMapping("/order/{orderId}")
    @PreAuthorize("hasAnyRole('ADMIN','DELIVERY_AGENT')")
    public ResponseEntity<OrderDTO> getDeliveryByOrder(@PathVariable Long orderId) {
        return ResponseEntity.ok(orderService.getById(orderId));
    }

    @GetMapping("/agent/my-deliveries")
    @PreAuthorize("hasRole('DELIVERY_AGENT')")
    public ResponseEntity<Page<OrderDTO>> getMyDeliveries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = userService.getByEmail(auth.getName()).getId();
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.listForDeliveryAgent(userId, pageable));
    }

    @GetMapping("/upcoming")
    @PreAuthorize("hasRole('DELIVERY_AGENT')")
    public ResponseEntity<Page<OrderDTO>> getUpcomingDeliveries(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "20") int size
    ) {
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(orderService.listUpcomingOrders(pageable));
    }

    @PostMapping("/pick")
    @PreAuthorize("hasRole('DELIVERY_AGENT')")
    public ResponseEntity<OrderDTO> pickOrder(@RequestParam Long orderId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long userId = userService.getByEmail(auth.getName()).getId();
        return ResponseEntity.ok(deliveryService.pickOrder(orderId, userId));
    }
}
