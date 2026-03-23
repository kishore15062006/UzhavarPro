package com.example.backend.service.impl;

import com.example.backend.dto.PaymentDTO;
import com.example.backend.entity.OrderEntity;
import com.example.backend.entity.Payment;
import com.example.backend.entity.PaymentStatus;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.OrderRepository;
import com.example.backend.repository.PaymentRepository;
import com.example.backend.service.PaymentService;
import com.example.backend.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentRepository paymentRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private MapperUtil mapper;

    @Override
    @Transactional
    public PaymentDTO initiate(PaymentDTO dto) {
        OrderEntity order = orderRepository.findById(dto.getOrderId()).orElseThrow(() -> new ResourceNotFoundException("Order not found"));
        Payment p = Payment.builder()
                .order(order)
                .transactionId(UUID.randomUUID().toString())
                .paymentStatus(PaymentStatus.PENDING)
                .amount(dto.getAmount() != null ? dto.getAmount() : order.getTotalPrice())
                .build();
        Payment saved = paymentRepository.save(p);
        PaymentDTO res = mapper.map(saved, PaymentDTO.class);
        res.setOrderId(saved.getOrder().getId());
        return res;
    }

    @Override
    @Transactional
    public PaymentDTO updateStatus(Long id, String status) {
        Payment p = paymentRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Payment not found"));
        try { p.setPaymentStatus(PaymentStatus.valueOf(status)); } catch (Exception e) { throw new IllegalArgumentException("Invalid payment status"); }
        paymentRepository.save(p);
        PaymentDTO res = mapper.map(p, PaymentDTO.class);
        res.setOrderId(p.getOrder().getId());
        return res;
    }
}
