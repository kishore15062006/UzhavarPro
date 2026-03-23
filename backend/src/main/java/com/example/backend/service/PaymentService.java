package com.example.backend.service;

import com.example.backend.dto.PaymentDTO;

public interface PaymentService {
    PaymentDTO initiate(PaymentDTO dto);
    PaymentDTO updateStatus(Long id, String status);
}
