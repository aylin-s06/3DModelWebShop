package com.my3dwebshop._dwebshop_backend.service;

import com.my3dwebshop._dwebshop_backend.model.OrderItem;
import com.my3dwebshop._dwebshop_backend.model.Order;
import com.my3dwebshop._dwebshop_backend.model.Product;
import com.my3dwebshop._dwebshop_backend.repository.OrderItemRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for order item management operations.
 * Handles creating, retrieving, and deleting order items.
 */
@Service
@RequiredArgsConstructor
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    /**
     * Creates a new order item.
     * 
     * @param item Order item to create
     * @return Created order item
     */
    public OrderItem create(OrderItem item) {
        return orderItemRepository.save(item);
    }

    /**
     * Retrieves all order items for a specific order.
     * 
     * @param order Order entity
     * @return List of order items for the order
     */
    public List<OrderItem> getByOrder(Order order) {
        return orderItemRepository.findByOrder(order);
    }

    /**
     * Retrieves all order items containing a specific product.
     * 
     * @param product Product entity
     * @return List of order items containing the product
     */
    public List<OrderItem> getByProduct(Product product) {
        return orderItemRepository.findByProduct(product);
    }

    /**
     * Deletes an order item by ID.
     * 
     * @param id Order item ID to delete
     */
    public void delete(Long id) {
        orderItemRepository.deleteById(id);
    }
}
