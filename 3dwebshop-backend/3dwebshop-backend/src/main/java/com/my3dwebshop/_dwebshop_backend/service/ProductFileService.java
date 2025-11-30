package com.my3dwebshop._dwebshop_backend.service;

import com.my3dwebshop._dwebshop_backend.model.Product;
import com.my3dwebshop._dwebshop_backend.model.ProductFile;
import com.my3dwebshop._dwebshop_backend.repository.ProductFileRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

/**
 * Service class for product file management operations.
 * Handles creating, retrieving, and deleting downloadable product files (STL, etc.).
 */
@Service
@RequiredArgsConstructor
public class ProductFileService {

    private final ProductFileRepository productFileRepository;

    /**
     * Creates a new product file.
     * 
     * @param file Product file to create
     * @return Created product file
     */
    public ProductFile create(ProductFile file) {
        return productFileRepository.save(file);
    }

    /**
     * Retrieves all files for a product.
     * 
     * @param product Product entity
     * @return List of product files
     */
    public List<ProductFile> getByProduct(Product product) {
        return productFileRepository.findByProduct(product);
    }

    /**
     * Deletes a product file by ID.
     * 
     * @param id Product file ID to delete
     */
    public void delete(Long id) {
        productFileRepository.deleteById(id);
    }
}
