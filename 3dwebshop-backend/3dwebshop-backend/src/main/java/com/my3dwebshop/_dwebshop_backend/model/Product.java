package com.my3dwebshop._dwebshop_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Product entity representing a 3D printed product in the shop.
 * Contains product details, pricing, images, files, and tags.
 */
@Entity
@Table(name = "products")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Product title/name */
    private String title;

    /** Product description (supports long text) */
    @Column(columnDefinition = "TEXT")
    private String description;

    /** Product price */
    private BigDecimal price;

    /** Currency code (e.g., BGN, USD, EUR) */
    private String currency;

    /** Product category */
    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    /** Available stock quantity */
    private Integer stock;

    /** Material used for 3D printing */
    private String material;

    /** Product dimensions */
    private String dimensions;

    /** Product weight */
    private BigDecimal weight;

    /** URL to main product image */
    private String mainImageUrl;

    /** Timestamp when product was created */
    private LocalDateTime createdAt;

    /** Timestamp when product was last updated */
    private LocalDateTime updatedAt;

    /** List of product images */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductImage> images;

    /** List of downloadable product files (STL, etc.) */
    @OneToMany(mappedBy = "product", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductFile> files;

    /** Set of tags associated with the product */
    @ManyToMany
    @JoinTable(
            name = "product_tag",
            joinColumns = @JoinColumn(name = "product_id"),
            inverseJoinColumns = @JoinColumn(name = "tag_id")
    )
    @Builder.Default
    @JsonIgnore
    private Set<Tag> tags = new HashSet<>();

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
