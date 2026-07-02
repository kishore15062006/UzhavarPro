package com.example.backend.dto;

import lombok.Data;
import java.time.Instant;

@Data
public class RatingDTO {
    private Long id;
    private Long buyerId;
    private String userName; // matches rating.userName in frontend
    private Long productId;
    private String productName;
    private Integer rating;
    private String comment;
    private Instant createdAt;
}
