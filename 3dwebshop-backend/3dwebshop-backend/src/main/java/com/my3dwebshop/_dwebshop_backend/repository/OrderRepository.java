package com.my3dwebshop._dwebshop_backend.repository;

import com.my3dwebshop._dwebshop_backend.model.Order;
import com.my3dwebshop._dwebshop_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByStatus(String status);
}
