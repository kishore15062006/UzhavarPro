package com.example.backend.controller;

import com.example.backend.dto.TopProductDTO;
import com.example.backend.repository.OrderItemRepository;
import com.example.backend.service.OrderService;
import com.example.backend.service.ProductService;
import com.example.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/analytics")
public class AnalyticsController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderItemRepository orderItemRepository;

    // Farmer Dashboard Stats
    @GetMapping("/farmer/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getFarmerDashboardStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Long currentUserId = userService.getByEmail(email).getId();

        Map<String, Object> stats = new HashMap<>();
        try {
            // Total orders for this farmer (incoming + completed)
            stats.put("totalOrders", orderService.countOrdersByFarmer(currentUserId));
            
            // Total sales from COMPLETED orders
            stats.put("totalSales", orderService.getTotalSalesByFarmer(currentUserId));
            
            // Earnings = 95% of sales (5% platform commission)
            double totalSales = (double) stats.get("totalSales");
            stats.put("totalEarnings", totalSales * 0.95);
            
            // Active products for this farmer
            stats.put("totalProducts", productService.countProductsByFarmer(currentUserId));
            
            stats.put("success", true);
        } catch (Exception e) {
            stats.put("success", false);
            stats.put("error", e.getMessage());
        }
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/farmer/top-products")
    public ResponseEntity<Page<TopProductDTO>> getFarmerTopProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "5") int size
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        Long farmerId = userService.getByEmail(email).getId();
        Pageable pageable = PageRequest.of(page, size);
        Page<TopProductDTO> topProducts = orderItemRepository.findTopProductsByFarmer(farmerId, pageable);
        return ResponseEntity.ok(topProducts);
    }

    // Delivery Agent Dashboard Stats
    @GetMapping("/delivery/dashboard-stats")
    public ResponseEntity<Map<String, Object>> getDeliveryDashboardStats() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        Long currentUserId = userService.getByEmail(auth.getName()).getId();

        Map<String, Object> stats = new HashMap<>();
        try {
            stats.put("totalDeliveries", orderService.countDeliveriesByAgent(currentUserId));
            stats.put("completedDeliveries", orderService.countCompletedDeliveriesByAgent(currentUserId));
            stats.put("totalEarnings", 50.0 * (long) stats.get("completedDeliveries")); // ₹50 per delivery
            stats.put("pendingDeliveries", orderService.countPendingDeliveriesByAgent(currentUserId));
            stats.put("success", true);
        } catch (Exception e) {
            stats.put("success", false);
            stats.put("error", e.getMessage());
        }
        return ResponseEntity.ok(stats);
    }
}

