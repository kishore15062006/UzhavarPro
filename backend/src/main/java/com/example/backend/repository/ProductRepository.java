package com.example.backend.repository;

import com.example.backend.entity.Product;
import com.example.backend.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    Page<Product> findByCategoryContainingIgnoreCase(String category, Pageable pageable);
    Page<Product> findByFarmer(User farmer, Pageable pageable);
    long countByFarmer(User farmer);
}
