package com.example.backend.controller;

import com.example.backend.dto.PaymentDTO;
import com.example.backend.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping("/initiate")
    public ResponseEntity<PaymentDTO> initiate(@RequestBody PaymentDTO dto) {
        return ResponseEntity.ok(paymentService.initiate(dto));
    }

    @PutMapping("/update-status")
    public ResponseEntity<PaymentDTO> update(@RequestParam Long id, @RequestParam String status) {
        return ResponseEntity.ok(paymentService.updateStatus(id, status));
    }
}
