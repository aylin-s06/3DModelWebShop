package com.my3dwebshop._dwebshop_backend.service;

import com.my3dwebshop._dwebshop_backend.model.CartItem;
import com.my3dwebshop._dwebshop_backend.model.Product;
import com.my3dwebshop._dwebshop_backend.model.User;
import com.my3dwebshop._dwebshop_backend.repository.CartItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for shopping cart item management.
 * Handles adding, retrieving, and removing items from user carts.
 */
@Service
@RequiredArgsConstructor
public class CartItemService {

    private final CartItemRepository cartItemRepository;

    /**
     * Adds an item to the cart.
     * 
     * @param item Cart item to add
     * @return Saved cart item
     */
    public CartItem addToCart(CartItem item) {
        return cartItemRepository.save(item);
    }

    /**
     * Retrieves all cart items for a user.
     * 
     * @param user User entity
     * @return List of cart items for the user
     */
    public List<CartItem> getByUser(User user) {
        return cartItemRepository.findByUser(user);
    }

    /**
     * Finds a cart item by user and product.
     * 
     * @param user User entity
     * @param product Product entity
     * @return Optional containing cart item if found
     */
    public Optional<CartItem> getByUserAndProduct(User user, Product product) {
        return cartItemRepository.findByUserAndProduct(user, product);
    }

    /**
     * Removes a cart item by ID.
     * 
     * @param id Cart item ID to remove
     */
    public void remove(Long id) {
        cartItemRepository.deleteById(id);
    }

    /**
     * Clears all items from a user's cart.
     * 
     * @param user User entity
     */
    public void clearCart(User user) {
        List<CartItem> items = cartItemRepository.findByUser(user);
        cartItemRepository.deleteAll(items);
    }
}
