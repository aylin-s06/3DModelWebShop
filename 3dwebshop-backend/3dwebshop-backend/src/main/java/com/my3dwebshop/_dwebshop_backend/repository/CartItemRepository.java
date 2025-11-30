package com.my3dwebshop._dwebshop_backend.repository;

import com.my3dwebshop._dwebshop_backend.model.CartItem;
import com.my3dwebshop._dwebshop_backend.model.User;
import com.my3dwebshop._dwebshop_backend.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    List<CartItem> findByProduct(Product product);
}
