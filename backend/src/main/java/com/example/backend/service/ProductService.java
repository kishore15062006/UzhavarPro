package com.example.backend.service;

import com.example.backend.dto.ProductDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ProductService {
    ProductDTO create(ProductDTO dto);
    ProductDTO update(Long id, ProductDTO dto);
    void delete(Long id);
    ProductDTO getById(Long id);
    Page<ProductDTO> list(String category, Pageable pageable);
    Page<ProductDTO> list(Pageable pageable);
    long countProducts();
    Page<ProductDTO> getMyProducts(Long farmerId, Pageable pageable);
    
    // Analytics methods
    long countProductsByFarmer(Long farmerId);
}

