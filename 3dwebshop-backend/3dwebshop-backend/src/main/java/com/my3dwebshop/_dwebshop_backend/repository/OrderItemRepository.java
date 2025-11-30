package com.my3dwebshop._dwebshop_backend.repository;

import com.my3dwebshop._dwebshop_backend.model.Order;
import com.my3dwebshop._dwebshop_backend.model.OrderItem;
import com.my3dwebshop._dwebshop_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {

    List<OrderItem> findByOrder(Order order);

    List<OrderItem> findByProduct(Product product);
}