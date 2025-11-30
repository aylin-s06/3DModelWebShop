package com.my3dwebshop._dwebshop_backend.service;

import com.my3dwebshop._dwebshop_backend.model.Order;
import com.my3dwebshop._dwebshop_backend.model.User;
import com.my3dwebshop._dwebshop_backend.repository.OrderRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for order management operations.
 * Handles order creation, retrieval, and status management.
 */
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;

    /**
     * Creates a new order.
     * 
     * @param order Order entity to create
     * @return Created order
     */
    public Order create(Order order) {
        return orderRepository.save(order);
    }

    /**
     * Retrieves all orders for a specific user.
     * 
     * @param user User entity
     * @return List of orders for the user
     */
    public List<Order> getByUser(User user) {
        return orderRepository.findByUser(user);
    }

    /**
     * Retrieves an order by ID.
     * 
     * @param id Order ID
     * @return Optional containing order if found
     */
    public Optional<Order> getById(Long id) {
        return orderRepository.findById(id);
    }

    /**
     * Retrieves all orders with a specific status.
     * 
     * @param status Order status (NEW, PROCESSING, SHIPPED, COMPLETED, CANCELED)
     * @return List of orders with the specified status
     */
    public List<Order> getByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    /**
     * Updates an existing order.
     * 
     * @param order Order entity with updated data
     * @return Updated order
     */
    public Order update(Order order) {
        return orderRepository.save(order);
    }

    /**
     * Deletes an order by ID.
     * 
     * @param id Order ID to delete
     */
    public void delete(Long id) {
        orderRepository.deleteById(id);
    }
}
