package com.my3dwebshop._dwebshop_backend.controller;

import com.my3dwebshop._dwebshop_backend.model.Category;
import com.my3dwebshop._dwebshop_backend.model.Product;
import com.my3dwebshop._dwebshop_backend.service.CategoryService;
import com.my3dwebshop._dwebshop_backend.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST controller for product management.
 * Handles CRUD operations and product search functionality.
 */
@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;
    private final CategoryService categoryService;

    /**
     * Retrieves all products.
     * 
     * @return List of all products
     */
    @GetMapping
    public List<Product> getAll() {
        return productService.getAll();
    }

    /**
     * Retrieves a product by its ID.
     * 
     * @param id Product ID
     * @return Product entity
     * @throws ResponseStatusException if product not found
     */
    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return productService.getById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
    }

    /**
     * Retrieves all products in a specific category.
     * 
     * @param categoryId Category ID
     * @return List of products in the category
     * @throws ResponseStatusException if category not found
     */
    @GetMapping("/category/{categoryId}")
    public List<Product> getByCategory(@PathVariable Long categoryId) {
        Category category = categoryService.getById(categoryId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
        return productService.getByCategory(category);
    }

    /**
     * Searches products by title keyword.
     * 
     * @param q Search query string
     * @return List of products matching the search query
     */
    @GetMapping("/search")
    public List<Product> search(@RequestParam String q) {
        return productService.searchByTitle(q);
    }

    /**
     * Creates a new product.
     * 
     * @param product Product entity to create
     * @return Created product
     */
    @PostMapping
    public Product create(@RequestBody Product product) {
        return productService.create(product);
    }

    /**
     * Updates an existing product.
     * 
     * @param id Product ID
     * @param product Product entity with updated data
     * @return Updated product
     */
    @PutMapping("/{id}")
    public Product update(@PathVariable Long id, @RequestBody Product product) {
        product.setId(id);
        return productService.update(product);
    }

    /**
     * Deletes a product by ID.
     * 
     * @param id Product ID to delete
     * @throws ResponseStatusException if product not found or deletion fails
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        try {
            productService.delete(id);
        } catch (RuntimeException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, e.getMessage());
        }
    }
}
