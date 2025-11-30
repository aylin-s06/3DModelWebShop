package com.my3dwebshop._dwebshop_backend.controller;

import com.my3dwebshop._dwebshop_backend.model.CartItem;
import com.my3dwebshop._dwebshop_backend.model.User;
import com.my3dwebshop._dwebshop_backend.service.CartItemService;
import com.my3dwebshop._dwebshop_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST controller for shopping cart management.
 * Handles adding, removing, and clearing cart items.
 */
@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartItemService cartItemService;
    private final UserService userService;

    /**
     * Retrieves all cart items for a user.
     * 
     * @param userId User ID
     * @return List of cart items
     * @throws ResponseStatusException if user not found
     */
    @GetMapping("/{userId}")
    public List<CartItem> getCart(@PathVariable Long userId) {
        User user = userService.getById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return cartItemService.getByUser(user);
    }

    /**
     * Adds an item to the user's cart.
     * 
     * @param userId User ID
     * @param item Cart item to add
     * @return Created cart item
     * @throws ResponseStatusException if user not found
     */
    @PostMapping("/{userId}")
    public CartItem addToCart(@PathVariable Long userId, @RequestBody CartItem item) {
        User user = userService.getById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        item.setUser(user);
        return cartItemService.addToCart(item);
    }

    /**
     * Removes an item from the cart.
     * 
     * @param userId User ID (for consistency, not used in service)
     * @param itemId Cart item ID to remove
     */
    @DeleteMapping("/{userId}/{itemId}")
    public void removeFromCart(@PathVariable Long userId, @PathVariable Long itemId) {
        cartItemService.remove(itemId);
    }

    /**
     * Clears all items from the user's cart.
     * 
     * @param userId User ID
     * @throws ResponseStatusException if user not found
     */
    @DeleteMapping("/clear/{userId}")
    public void clearCart(@PathVariable Long userId) {
        User user = userService.getById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        cartItemService.clearCart(user);
    }
}
