package com.my3dwebshop._dwebshop_backend.controller;

import com.my3dwebshop._dwebshop_backend.model.Order;
import com.my3dwebshop._dwebshop_backend.model.User;
import com.my3dwebshop._dwebshop_backend.service.OrderService;
import com.my3dwebshop._dwebshop_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST controller for order management.
 * Handles order creation, retrieval, and status updates.
 */
@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;
    private final UserService userService;

    /**
     * Retrieves all orders for a specific user.
     * 
     * @param userId User ID
     * @return List of orders for the user
     * @throws ResponseStatusException if user not found
     */
    @GetMapping("/{userId}")
    public List<Order> getOrdersByUser(@PathVariable Long userId) {
        User user = userService.getById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return orderService.getByUser(user);
    }

    /**
     * Retrieves all orders with a specific status.
     * 
     * @param status Order status (NEW, PROCESSING, SHIPPED, COMPLETED, CANCELED)
     * @return List of orders with the specified status
     */
    @GetMapping("/status/{status}")
    public List<Order> getByStatus(@PathVariable String status) {
        return orderService.getByStatus(status);
    }

    /**
     * Creates a new order for a user.
     * 
     * @param userId User ID
     * @param order Order entity to create
     * @return Created order
     * @throws ResponseStatusException if user not found
     */
    @PostMapping("/{userId}")
    public Order createOrder(@PathVariable Long userId, @RequestBody Order order) {
        User user = userService.getById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        order.setUser(user);
        return orderService.create(order);
    }

    /**
     * Updates an existing order.
     * 
     * @param orderId Order ID
     * @param order Order entity with updated data
     * @return Updated order
     */
    @PutMapping("/{orderId}")
    public Order update(@PathVariable Long orderId, @RequestBody Order order) {
        order.setId(orderId);
        return orderService.update(order);
    }

    /**
     * Deletes an order by ID.
     * 
     * @param orderId Order ID to delete
     */
    @DeleteMapping("/{orderId}")
    public void delete(@PathVariable Long orderId) {
        orderService.delete(orderId);
    }
}
