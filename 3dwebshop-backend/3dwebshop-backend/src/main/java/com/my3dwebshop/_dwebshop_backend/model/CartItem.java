package com.my3dwebshop._dwebshop_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * Cart item entity representing a product in a user's shopping cart.
 * Stores quantity and price at the time of adding to cart.
 */
@Entity
@Table(name = "cart_items")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Quantity of the product in cart */
    private Integer qty;

    /** Price of the product when added to cart (for price stability) */
    private BigDecimal priceAtAdd;

    /** Timestamp when item was added to cart */
    private LocalDateTime createdAt;

    /** User who owns this cart item */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /** Product in the cart */
    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    /**
     * Sets creation timestamp before persisting.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
