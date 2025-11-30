package com.my3dwebshop._dwebshop_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

/**
 * Order item entity representing a product in an order.
 * Stores quantity and price for each product in an order.
 */
@Entity
@Table(name = "order_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class OrderItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Quantity of the product in the order */
    private Integer qty;

    /** Price of the product at the time of order */
    private BigDecimal price;

    /** Order this item belongs to */
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    /** Product in this order item */
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;
}
