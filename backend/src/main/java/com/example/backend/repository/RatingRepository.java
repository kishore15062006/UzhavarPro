package com.example.backend.repository;

import com.example.backend.entity.Rating;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RatingRepository extends JpaRepository<Rating, Long> {
    @Query("SELECT r FROM Rating r JOIN FETCH r.buyer JOIN FETCH r.product WHERE r.product.id = :productId")
    List<Rating> findByProductId(@Param("productId") Long productId);
    
    @Query("SELECT r FROM Rating r JOIN FETCH r.buyer JOIN FETCH r.product WHERE r.product.farmer.id = :farmerId")
    List<Rating> findByProductFarmerId(@Param("farmerId") Long farmerId);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.product.id = :productId")
    Double getAverageRatingForProduct(@Param("productId") Long productId);

    @Query("SELECT AVG(r.rating) FROM Rating r WHERE r.product.farmer.id = :farmerId")
    Double getAverageRatingForFarmer(@Param("farmerId") Long farmerId);
}
