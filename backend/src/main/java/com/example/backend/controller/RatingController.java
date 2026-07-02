package com.example.backend.controller;

import com.example.backend.dto.RatingDTO;
import com.example.backend.entity.Product;
import com.example.backend.entity.Rating;
import com.example.backend.entity.User;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.RatingRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ratings")
@Transactional(readOnly = true)
public class RatingController {

    @Autowired
    private RatingRepository ratingRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private MapperUtil mapper;

    @PostMapping
    @Transactional
    public ResponseEntity<RatingDTO> createRating(@RequestBody RatingDTO dto) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User buyer = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Product product = productRepository.findById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        Rating rating = Rating.builder()
                .buyer(buyer)
                .product(product)
                .rating(dto.getRating())
                .comment(dto.getComment())
                .build();

        Rating saved = ratingRepository.save(rating);
        
        RatingDTO responseDto = new RatingDTO();
        responseDto.setId(saved.getId());
        responseDto.setBuyerId(buyer.getId());
        responseDto.setUserName(buyer.getName());
        responseDto.setProductId(product.getId());
        responseDto.setProductName(product.getName());
        responseDto.setRating(saved.getRating());
        responseDto.setComment(saved.getComment());
        responseDto.setCreatedAt(saved.getCreatedAt());
        
        return ResponseEntity.ok(responseDto);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<RatingDTO>> getRatingsForProduct(@PathVariable Long productId) {
        List<Rating> ratings = ratingRepository.findByProductId(productId);
        List<RatingDTO> dtos = ratings.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<RatingDTO>> getRatingsForFarmer(@PathVariable Long farmerId) {
        List<Rating> ratings = ratingRepository.findByProductFarmerId(farmerId);
        List<RatingDTO> dtos = ratings.stream().map(this::convertToDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    private RatingDTO convertToDTO(Rating rating) {
        RatingDTO dto = mapper.map(rating, RatingDTO.class);
        if (rating.getBuyer() != null) {
            dto.setBuyerId(rating.getBuyer().getId());
            dto.setUserName(rating.getBuyer().getName());
        }
        if (rating.getProduct() != null) {
            dto.setProductId(rating.getProduct().getId());
            dto.setProductName(rating.getProduct().getName());
        }
        return dto;
    }
}
