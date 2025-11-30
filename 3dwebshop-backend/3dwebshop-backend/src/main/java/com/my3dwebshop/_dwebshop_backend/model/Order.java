package com.my3dwebshop._dwebshop_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Order entity representing a customer order.
 * Tracks order status, payment, shipping address, and order items.
 */
@Entity
@Table(name = "orders")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Order {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Order status: NEW, PROCESSING, SHIPPED, COMPLETED, CANCELED */
    private String status;

    /** Total order amount */
    private BigDecimal totalAmount;

    /** Shipping address (supports long text) */
    @Column(columnDefinition = "TEXT")
    private String address;

    /** Payment method used */
    private String paymentMethod;

    /** Timestamp when order was created */
    private LocalDateTime createdAt;

    /** Timestamp when order was last updated */
    private LocalDateTime updatedAt;

    /** User who placed the order */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /** List of items in the order */
    @OneToMany(mappedBy = "order")
    private List<OrderItem> items;

    /**
     * Sets creation timestamp before persisting.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Sets update timestamp before updating.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
