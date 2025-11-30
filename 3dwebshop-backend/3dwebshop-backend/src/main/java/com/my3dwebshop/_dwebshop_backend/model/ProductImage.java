package com.my3dwebshop._dwebshop_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * Product image entity representing an image associated with a product.
 * Supports multiple images per product with ordering.
 */
@Entity
@Table(name = "product_images")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** URL of the image */
    private String imageUrl;

    /** Alt text for accessibility */
    private String altText;

    /** Display order index for sorting images */
    private Integer orderIndex;

    /** Product this image belongs to */
    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;
}
