package com.my3dwebshop._dwebshop_backend.service;

import com.my3dwebshop._dwebshop_backend.model.Product;
import com.my3dwebshop._dwebshop_backend.model.ProductImage;
import com.my3dwebshop._dwebshop_backend.repository.ProductImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for product image management operations.
 * Handles creating, retrieving, and deleting product images.
 */
@Service
@RequiredArgsConstructor
public class ProductImageService {

    private final ProductImageRepository productImageRepository;

    /**
     * Creates a new product image.
     * 
     * @param image Product image to create
     * @return Created product image
     */
    public ProductImage create(ProductImage image) {
        return productImageRepository.save(image);
    }

    /**
     * Retrieves all images for a product, ordered by order index.
     * 
     * @param product Product entity
     * @return List of product images sorted by order index
     */
    public List<ProductImage> getByProduct(Product product) {
        return productImageRepository.findByProductOrderByOrderIndexAsc(product);
    }

    /**
     * Deletes a product image by ID.
     * 
     * @param id Product image ID to delete
     */
    public void delete(Long id) {
        productImageRepository.deleteById(id);
    }
}
