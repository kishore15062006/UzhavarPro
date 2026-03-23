package com.example.backend.repository;

import com.example.backend.dto.TopProductDTO;
import com.example.backend.entity.OrderItem;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    @Query("SELECT new com.example.backend.dto.TopProductDTO(oi.product.id, oi.product.name, SUM(oi.quantity), SUM(oi.quantity * oi.price)) " +
           "FROM OrderItem oi WHERE oi.order.farmer.id = :farmerId " +
           "GROUP BY oi.product.id, oi.product.name ORDER BY SUM(oi.quantity) DESC")
    Page<TopProductDTO> findTopProductsByFarmer(@Param("farmerId") Long farmerId, Pageable pageable);
}
