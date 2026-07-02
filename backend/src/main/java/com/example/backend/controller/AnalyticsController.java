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
import java.util.List;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.stream.Collectors;
import com.example.backend.entity.User;
import org.springframework.transaction.annotation.Transactional;

@RestController
@RequestMapping("/api/analytics")
@Transactional(readOnly = true)
public class AnalyticsController {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ProductService productService;

    @Autowired
    private UserService userService;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private com.example.backend.repository.OrderRepository orderRepository;

    @Autowired
    private com.example.backend.repository.RatingRepository ratingRepository;

    @Autowired
    private com.example.backend.repository.UserRepository userRepository;

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
            
            // Average Rating for this farmer
            Double avgRating = ratingRepository.getAverageRatingForFarmer(currentUserId);
            stats.put("avgRating", avgRating != null ? avgRating : 5.0);
            
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

    @GetMapping("/farmer/sales-summary")
    public ResponseEntity<Map<String, Object>> getFarmerSalesSummary() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User farmer = userService.getByEmail(email) != null ? 
                userRepository.findByEmail(email).orElse(null) : null;

        Map<String, Object> response = new HashMap<>();
        if (farmer == null) {
            return ResponseEntity.badRequest().body(response);
        }

        List<com.example.backend.entity.OrderEntity> allOrders = orderRepository.findByFarmer(farmer);
        List<com.example.backend.entity.OrderEntity> deliveredOrders = allOrders.stream()
                .filter(o -> o.getStatus() == com.example.backend.entity.OrderStatus.DELIVERED)
                .collect(Collectors.toList());

        double totalSales = deliveredOrders.stream()
                .mapToDouble(o -> o.getTotalPrice() != null ? o.getTotalPrice() : 0.0)
                .sum();
        long totalOrders = allOrders.size();
        
        double totalQuantity = 0.0;
        Map<String, Double> categoryRevenue = new HashMap<>();
        
        for (com.example.backend.entity.OrderEntity order : deliveredOrders) {
            if (order.getItems() != null) {
                for (com.example.backend.entity.OrderItem item : order.getItems()) {
                    totalQuantity += item.getQuantity() != null ? item.getQuantity() : 0.0;
                    if (item.getProduct() != null) {
                        String category = item.getProduct().getCategory() != null ? item.getProduct().getCategory() : "Uncategorized";
                        double itemRevenue = (item.getQuantity() != null && item.getPrice() != null) ? (item.getQuantity() * item.getPrice()) : 0.0;
                        categoryRevenue.put(category, categoryRevenue.getOrDefault(category, 0.0) + itemRevenue);
                    }
                }
            }
        }

        List<Map<String, Object>> categoryBreakdown = new ArrayList<>();
        String highestSellingCategory = "None";
        double maxRev = -1.0;
        
        for (Map.Entry<String, Double> entry : categoryRevenue.entrySet()) {
            Map<String, Object> breakItem = new HashMap<>();
            breakItem.put("category", entry.getKey());
            breakItem.put("amount", entry.getValue());
            categoryBreakdown.add(breakItem);
            
            if (entry.getValue() > maxRev) {
                maxRev = entry.getValue();
                highestSellingCategory = entry.getKey();
            }
        }

        response.put("totalSales", totalSales);
        response.put("totalOrders", totalOrders);
        response.put("totalQuantity", totalQuantity);
        response.put("avgOrderValue", deliveredOrders.isEmpty() ? 0.0 : totalSales / deliveredOrders.size());
        response.put("highestSellingCategory", highestSellingCategory);
        response.put("categoryBreakdown", categoryBreakdown);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/farmer/earnings-summary")
    public ResponseEntity<Map<String, Object>> getFarmerEarningsSummary() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User farmer = userService.getByEmail(email) != null ? 
                userRepository.findByEmail(email).orElse(null) : null;

        Map<String, Object> response = new HashMap<>();
        if (farmer == null) {
            return ResponseEntity.badRequest().body(response);
        }

        List<com.example.backend.entity.OrderEntity> deliveredOrders = orderRepository.findByFarmerAndStatus(farmer, com.example.backend.entity.OrderStatus.DELIVERED);
        double grossEarnings = deliveredOrders.stream()
                .mapToDouble(o -> o.getTotalPrice() != null ? o.getTotalPrice() : 0.0)
                .sum();
        double netEarnings = grossEarnings * 0.95;
        double platformCommission = grossEarnings * 0.05;
        double completedPayout = netEarnings * 0.8;
        double pendingPayout = netEarnings * 0.2;

        response.put("grossEarnings", grossEarnings);
        response.put("netEarnings", netEarnings);
        response.put("platformCommission", platformCommission);
        response.put("completedPayout", completedPayout);
        response.put("pendingPayout", pendingPayout);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/farmer/sales-trend")
    public ResponseEntity<List<Map<String, Object>>> getFarmerSalesTrend() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User farmer = userService.getByEmail(email) != null ? 
                userRepository.findByEmail(email).orElse(null) : null;

        List<Map<String, Object>> trendList = new ArrayList<>();
        if (farmer == null) {
            return ResponseEntity.badRequest().body(trendList);
        }

        List<com.example.backend.entity.OrderEntity> deliveredOrders = orderRepository.findByFarmerAndStatus(farmer, com.example.backend.entity.OrderStatus.DELIVERED);
        Map<String, Double> monthlySales = new LinkedHashMap<>();
        
        // Populate standard months as a baseline
        monthlySales.put("Jan 2026", 0.0);
        monthlySales.put("Feb 2026", 0.0);
        monthlySales.put("Mar 2026", 0.0);
        monthlySales.put("Apr 2026", 0.0);
        monthlySales.put("May 2026", 0.0);
        monthlySales.put("Jun 2026", 0.0);

        java.time.format.DateTimeFormatter formatter = java.time.format.DateTimeFormatter.ofPattern("MMM yyyy")
                .withZone(java.time.ZoneId.systemDefault());

        for (com.example.backend.entity.OrderEntity order : deliveredOrders) {
            if (order.getCreatedAt() != null) {
                String period = formatter.format(order.getCreatedAt());
                double price = order.getTotalPrice() != null ? order.getTotalPrice() : 0.0;
                monthlySales.put(period, monthlySales.getOrDefault(period, 0.0) + price);
            }
        }

        for (Map.Entry<String, Double> entry : monthlySales.entrySet()) {
            Map<String, Object> trendItem = new HashMap<>();
            trendItem.put("period", entry.getKey());
            trendItem.put("sales", entry.getValue());
            trendItem.put("earnings", entry.getValue() * 0.95);
            trendList.add(trendItem);
        }

        return ResponseEntity.ok(trendList);
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

