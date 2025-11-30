package com.my3dwebshop._dwebshop_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

/**
 * Tag entity for categorizing and labeling products.
 * Supports many-to-many relationship with products.
 */
@Entity
@Table(name = "tags")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Tag name */
    private String name;

    /** URL-friendly tag identifier */
    private String slug;

    /** Products associated with this tag */
    @ManyToMany(mappedBy = "tags")
    @JsonIgnore
    private Set<Product> products;
}
