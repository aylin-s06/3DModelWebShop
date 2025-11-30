package com.my3dwebshop._dwebshop_backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

/**
 * Product file entity representing downloadable files associated with a product.
 * Used for STL files and other downloadable content for 3D printed products.
 */
@Entity
@Table(name = "product_files")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductFile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** URL of the file */
    private String fileUrl;

    /** File type (e.g., STL, OBJ, PDF) */
    private String fileType;

    /** Whether the file is downloadable by customers */
    private Boolean downloadable;

    /** Product this file belongs to */
    @ManyToOne
    @JoinColumn(name = "product_id")
    @JsonIgnore
    private Product product;
}
