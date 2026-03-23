package com.example.backend.dto;

import com.example.backend.entity.PaymentStatus;
import lombok.Data;

@Data
public class PaymentDTO {
    private Long id;
    private Long orderId;
    private String transactionId;
    private PaymentStatus paymentStatus;
    private Double amount;
}
