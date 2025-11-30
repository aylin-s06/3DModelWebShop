package com.my3dwebshop._dwebshop_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Review entity representing a user's review and rating for a product.
 */
@Entity
@Table(name = "reviews")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Rating value (typically 1-5) */
    private Integer rating;

    /** Review comment text (supports long text) */
    @Column(columnDefinition = "TEXT")
    private String comment;

    /** Timestamp when review was created */
    private LocalDateTime createdAt;

    /** User who wrote the review */
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    /** Product being reviewed */
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
