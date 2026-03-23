package com.example.backend.service.impl;

import com.example.backend.dto.ProductDTO;
import com.example.backend.entity.Product;
import com.example.backend.entity.ProductStatus;
import com.example.backend.entity.User;
import com.example.backend.exception.ResourceNotFoundException;
import com.example.backend.repository.ProductRepository;
import com.example.backend.repository.UserRepository;
import com.example.backend.service.ProductService;
import com.example.backend.util.MapperUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private MapperUtil mapper;

    @Override
    @Transactional
    public ProductDTO create(ProductDTO dto) {
        // Get current authenticated user as the farmer (subject contains email)
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        String email = auth.getName();
        User farmer = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Product p = mapper.map(dto, Product.class);
        p.setFarmer(farmer);
        if (p.getStatus() == null) p.setStatus(ProductStatus.AVAILABLE);
        Product saved = productRepository.save(p);
        ProductDTO out = mapper.map(saved, ProductDTO.class);
        out.setFarmerId(saved.getFarmer().getId());
        return out;
    }

    @Override
    @Transactional
    public ProductDTO update(Long id, ProductDTO dto) {
        Product p = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        if (dto.getName() != null) p.setName(dto.getName());
        if (dto.getCategory() != null) p.setCategory(dto.getCategory());
        if (dto.getDescription() != null) p.setDescription(dto.getDescription());
        if (dto.getImageUrl() != null) p.setImageUrl(dto.getImageUrl());
        if (dto.getPricePerKg() != null) p.setPricePerKg(dto.getPricePerKg());
        if (dto.getQuantity() != null) p.setQuantity(dto.getQuantity());
        if (dto.getStatus() != null) p.setStatus(dto.getStatus());
        Product saved = productRepository.save(p);
        ProductDTO out = mapper.map(saved, ProductDTO.class);
        out.setFarmerId(saved.getFarmer().getId());
        return out;
    }

    @Override
    public void delete(Long id) {
        productRepository.deleteById(id);
    }

    @Override
    public ProductDTO getById(Long id) {
        Product p = productRepository.findById(id).orElseThrow(() -> new ResourceNotFoundException("Product not found"));
        ProductDTO out = mapper.map(p, ProductDTO.class);
        out.setFarmerId(p.getFarmer().getId());
        return out;
    }

    @Override
    public Page<ProductDTO> list(String category, Pageable pageable) {
        Page<Product> page = (category == null || category.isBlank()) ? productRepository.findAll(pageable) : productRepository.findByCategoryContainingIgnoreCase(category, pageable);
        return new PageImpl<>(page.getContent().stream().map(p -> {
            ProductDTO d = mapper.map(p, ProductDTO.class);
            d.setFarmerId(p.getFarmer().getId());
            return d;
        }).collect(Collectors.toList()), pageable, page.getTotalElements());
    }

    @Override
    public Page<ProductDTO> list(Pageable pageable) {
        Page<Product> page = productRepository.findAll(pageable);
        return new PageImpl<>(page.getContent().stream().map(p -> {
            ProductDTO d = mapper.map(p, ProductDTO.class);
            d.setFarmerId(p.getFarmer().getId());
            return d;
        }).collect(Collectors.toList()), pageable, page.getTotalElements());
    }

    @Override
    public long countProducts() {
        return productRepository.count();
    }

    @Override
    public Page<ProductDTO> getMyProducts(Long farmerId, Pageable pageable) {
        User farmer = userRepository.findById(farmerId).orElseThrow(() -> new ResourceNotFoundException("Farmer not found"));
        Page<Product> page = productRepository.findByFarmer(farmer, pageable);
        return new PageImpl<>(page.getContent().stream().map(p -> {
            ProductDTO d = mapper.map(p, ProductDTO.class);
            d.setFarmerId(p.getFarmer().getId());
            return d;
        }).collect(Collectors.toList()), pageable, page.getTotalElements());
    }

    @Override
    public long countProductsByFarmer(Long farmerId) {
        User farmer = userRepository.findById(farmerId).orElseThrow();
        return productRepository.countByFarmer(farmer);
    }
}

