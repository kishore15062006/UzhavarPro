package com.example.backend.service.impl;

import com.example.backend.dto.OrderDTO;
import com.example.backend.dto.OrderItemDTO;
import com.example.backend.entity.*;
import com.example.backend.exception.InvalidRequestException;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.*;
import com.example.backend.service.OrderService;
import com.example.backend.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class OrderServiceImpl implements OrderService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private DeliveryAgentRepository deliveryAgentRepository;

    @Autowired
    private MapperUtil mapper;

    @Override
    @Transactional
    public OrderDTO create(OrderDTO dto) {
        User buyer = userRepository.findById(dto.getBuyerId()).orElseThrow(() -> new ResourceNotFoundException("Buyer not found"));
        List<OrderItem> items = dto.getItems().stream().map(i -> {
            Product p = productRepository.findById(i.getProductId()).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
            if (p.getQuantity() < i.getQuantity()) {
                throw new InvalidRequestException("Insufficient quantity for product: " + p.getName());
            }
            p.setQuantity(p.getQuantity() - i.getQuantity());
            if (p.getQuantity() <= 0) p.setStatus(ProductStatus.SOLD_OUT);
            productRepository.save(p);

            OrderItem oi = OrderItem.builder()
                    .product(p)
                    .quantity(i.getQuantity())
                    .price(i.getPrice())
                    .build();
            return oi;
        }).collect(Collectors.toList());

        if (items.isEmpty()) throw new InvalidRequestException("Order must contain items");

        // Use farmer of first product (simplified: all items must be from same farmer in this design)
        User farmer = items.get(0).getProduct().getFarmer();

        double total = items.stream().mapToDouble(it -> it.getPrice() * it.getQuantity()).sum();

        OrderEntity order = OrderEntity.builder()
                .buyer(buyer)
                .farmer(farmer)
                .totalPrice(total)
                .deliveryLat(dto.getDeliveryLat())
                .deliveryLng(dto.getDeliveryLng())
                .deliveryAddress(dto.getDeliveryAddress())
                .status(OrderStatus.PENDING)
                .build();

        OrderEntity saved = orderRepository.save(order);
        items.forEach(i -> i.setOrder(saved));
        orderItemRepository.saveAll(items);
        saved.setItems(items);

        return toOrderDTO(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public OrderDTO getById(Long id) {
        OrderEntity o = orderRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        return toOrderDTO(o);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> listForUser(Long userId, Pageable pageable) {
        User user = userRepository.findById(userId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
        Page<OrderEntity> page = orderRepository.findByBuyer(user, pageable);
        List<OrderDTO> list = page.getContent().stream().map(this::toOrderDTO).collect(Collectors.toList());
        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> listForFarmer(Long farmerId, Pageable pageable) {
        User farmer = userRepository.findById(farmerId).orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));
        Page<OrderEntity> page = orderRepository.findByFarmer(farmer, pageable);
        List<OrderDTO> list = page.getContent().stream().map(this::toOrderDTO).collect(Collectors.toList());
        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    @Override
    @Transactional
    public OrderDTO updateStatus(Long orderId, String statusStr) {
        OrderEntity o = orderRepository.findById(orderId).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        OrderStatus s;
        try { s = OrderStatus.valueOf(statusStr); } catch (Exception e) { throw new InvalidRequestException("Invalid status"); }
        o.setStatus(s);
        orderRepository.save(o);
        return toOrderDTO(o);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> list(Pageable pageable) {
        Page<OrderEntity> page = orderRepository.findAll(pageable);
        List<OrderDTO> list = page.getContent().stream().map(this::toOrderDTO).collect(Collectors.toList());
        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> listForDeliveryAgent(Long deliveryUserId, Pageable pageable) {
        Optional<DeliveryAgent> deliveryAgent = deliveryAgentRepository.findByUserId(deliveryUserId);
        if (deliveryAgent.isEmpty()) {
            // Check if user exists and has DELIVERY_AGENT role, then dynamically create DeliveryAgent entity
            User user = userRepository.findById(deliveryUserId).orElseThrow(() -> new ResourceNotFoundException("User not found"));
            if (user.getRole() == Role.DELIVERY_AGENT) {
                DeliveryAgent agent = DeliveryAgent.builder()
                        .user(user)
                        .availability(true)
                        .vehicleType("MOTORCYCLE")
                        .build();
                deliveryAgent = Optional.of(deliveryAgentRepository.save(agent));
            } else {
                return new PageImpl<>(List.of(), pageable, 0);
            }
        }

        Page<OrderEntity> page = orderRepository.findByDeliveryAgent(deliveryAgent.get(), pageable);
        List<OrderDTO> list = page.getContent().stream().map(this::toOrderDTO).collect(Collectors.toList());
        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    @Override
    @Transactional(readOnly = true)
    public Page<OrderDTO> listUpcomingOrders(Pageable pageable) {
        Page<OrderEntity> page = orderRepository.findByStatusAndDeliveryAgentIsNull(OrderStatus.PENDING, pageable);
        List<OrderDTO> list = page.getContent().stream().map(this::toOrderDTO).collect(Collectors.toList());
        return new PageImpl<>(list, pageable, page.getTotalElements());
    }

    @Override
    public long countOrders() {
        return orderRepository.count();
    }

    @Override
    public double getTotalRevenue() {
        List<OrderEntity> orders = orderRepository.findAll();
        return orders.stream().mapToDouble(OrderEntity::getTotalPrice).sum();
    }

    @Override
    public long countOrdersByFarmer(Long farmerId) {
        User farmer = userRepository.findById(farmerId).orElseThrow();
        return orderRepository.countByFarmer(farmer);
    }

    @Override
    public double getTotalSalesByFarmer(Long farmerId) {
        User farmer = userRepository.findById(farmerId).orElseThrow();
        List<OrderEntity> orders = orderRepository.findByFarmerAndStatus(farmer, OrderStatus.DELIVERED);
        return orders.stream().mapToDouble(OrderEntity::getTotalPrice).sum();
    }

    // Delivery methods - assume delivery agent updates orders or separate entity
    @Override
    public long countDeliveriesByAgent(Long agentId) {
        return deliveryAgentRepository.findByUserId(agentId)
                .map(orderRepository::countByDeliveryAgent)
                .orElse(0L);
    }

    @Override
    public long countCompletedDeliveriesByAgent(Long agentId) {
        return deliveryAgentRepository.findByUserId(agentId)
                .map(agent -> orderRepository.countByDeliveryAgentAndStatus(agent, OrderStatus.DELIVERED))
                .orElse(0L);
    }

    @Override
    public long countPendingDeliveriesByAgent(Long agentId) {
        return deliveryAgentRepository.findByUserId(agentId)
                .map(agent -> orderRepository.countByDeliveryAgentAndStatusIn(
                        agent,
                        List.of(OrderStatus.ASSIGNED, OrderStatus.PICKED, OrderStatus.OUT_FOR_DELIVERY)
                ))
                .orElse(0L);
    }

    private OrderDTO toOrderDTO(OrderEntity order) {
        OrderDTO dto = new OrderDTO();
        dto.setId(order.getId());
        dto.setBuyerId(order.getBuyer() != null ? order.getBuyer().getId() : null);
        dto.setUserId(order.getBuyer() != null ? order.getBuyer().getId() : null);
        dto.setFarmerId(order.getFarmer() != null ? order.getFarmer().getId() : null);
        dto.setAgentId(order.getDeliveryAgent() != null ? order.getDeliveryAgent().getId() : null);
        dto.setTotalPrice(order.getTotalPrice());
        dto.setTotalAmount(order.getTotalPrice());
        dto.setStatus(order.getStatus());
        dto.setOrderStatus(order.getStatus());
        dto.setCreatedAt(order.getCreatedAt());

        // Add farmer location info
        if (order.getFarmer() != null) {
            dto.setFarmLat(order.getFarmer().getFarmLat());
            dto.setFarmLng(order.getFarmer().getFarmLng());
            dto.setFarmAddress(order.getFarmer().getFarmAddress());
        }

        // Add delivery location info
        dto.setDeliveryLat(order.getDeliveryLat());
        dto.setDeliveryLng(order.getDeliveryLng());
        dto.setDeliveryAddress(order.getDeliveryAddress());

        if (order.getItems() != null) {
            dto.setItems(order.getItems().stream().map(it -> {
                OrderItemDTO d = new OrderItemDTO();
                d.setProductId(it.getProduct().getId());
                d.setQuantity(it.getQuantity());
                d.setPrice(it.getPrice());
                return d;
            }).collect(Collectors.toList()));
        }

        return dto;
    }
}

