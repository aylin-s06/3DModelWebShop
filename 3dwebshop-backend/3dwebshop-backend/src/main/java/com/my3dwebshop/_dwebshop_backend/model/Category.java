package com.my3dwebshop._dwebshop_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.List;

/**
 * Category entity for organizing products.
 * Supports hierarchical categories with parent-child relationships.
 */
@Entity
@Table(name = "categories")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Category name */
    private String name;

    /** URL-friendly category identifier */
    private String slug;

    /** Parent category (for hierarchical structure) */
    @ManyToOne
    @JoinColumn(name = "parent_id")
    @JsonIgnore
    private Category parent;

    /** Subcategories of this category */
    @OneToMany(mappedBy = "parent")
    @JsonIgnore
    private List<Category> subcategories;
}
