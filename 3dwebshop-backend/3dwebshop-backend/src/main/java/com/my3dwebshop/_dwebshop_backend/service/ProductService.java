package com.my3dwebshop._dwebshop_backend.service;

import com.my3dwebshop._dwebshop_backend.model.Category;
import com.my3dwebshop._dwebshop_backend.model.Product;
import com.my3dwebshop._dwebshop_backend.model.ProductImage;
import com.my3dwebshop._dwebshop_backend.model.ProductFile;
import com.my3dwebshop._dwebshop_backend.model.CartItem;
import com.my3dwebshop._dwebshop_backend.model.Review;
import com.my3dwebshop._dwebshop_backend.model.OrderItem;
import com.my3dwebshop._dwebshop_backend.repository.ProductRepository;
import com.my3dwebshop._dwebshop_backend.repository.CategoryRepository;
import com.my3dwebshop._dwebshop_backend.repository.CartItemRepository;
import com.my3dwebshop._dwebshop_backend.repository.OrderItemRepository;
import com.my3dwebshop._dwebshop_backend.repository.ProductImageRepository;
import com.my3dwebshop._dwebshop_backend.repository.ProductFileRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

/**
 * Service class for product management operations.
 * Handles product CRUD operations and product image management.
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProductImageService productImageService;
    private final ProductImageRepository productImageRepository;
    private final ProductFileService productFileService;
    private final ProductFileRepository productFileRepository;
    private final CategoryRepository categoryRepository;
    private final CartItemRepository cartItemRepository;
    private final ReviewService reviewService;
    private final OrderItemRepository orderItemRepository;
    private final EntityManager entityManager;

    /**
     * Creates a new product with associated images.
     * Transactional to ensure data consistency.
     * 
     * @param product Product entity to create
     * @return Created product with saved images
     */
    @Transactional
    public Product create(Product product) {
        // Save product first to get generated ID
        Product savedProduct = productRepository.save(product);
        
        // Save associated images if provided
        if (product.getImages() != null && !product.getImages().isEmpty()) {
            for (ProductImage image : product.getImages()) {
                image.setProduct(savedProduct);
                productImageService.create(image);
            }
        }
        
        return savedProduct;
    }

    /**
     * Retrieves all products.
     * 
     * @return List of all products
     */
    public List<Product> getAll() {
        return productRepository.findAll();
    }

    /**
     * Retrieves a product by ID.
     * 
     * @param id Product ID
     * @return Optional containing product if found
     */
    public Optional<Product> getById(Long id) {
        return productRepository.findById(id);
    }

    /**
     * Retrieves all products in a specific category.
     * 
     * @param category Category entity
     * @return List of products in the category
     */
    public List<Product> getByCategory(Category category) {
        return productRepository.findByCategory(category);
    }

    /**
     * Searches products by title keyword (case-insensitive).
     * 
     * @param keyword Search keyword
     * @return List of products matching the keyword
     */
    public List<Product> searchByTitle(String keyword) {
        return productRepository.findByTitleContainingIgnoreCase(keyword);
    }

    /**
     * Updates an existing product and replaces its images.
     * Transactional to ensure data consistency.
     * 
     * @param product Product entity with updated data
     * @return Updated product
     * @throws RuntimeException if product not found
     */
    @Transactional
    public Product update(Product product) {
        try {
            // Validate product ID
            if (product.getId() == null) {
                throw new RuntimeException("Product ID is required for update");
            }
            
            // Get existing product to access current images
            Product existingProduct = productRepository.findById(product.getId())
                    .orElseThrow(() -> new RuntimeException("Product not found with ID: " + product.getId()));
            
            // Load existing images explicitly to avoid lazy loading issues
            List<ProductImage> existingImages = productImageService.getByProduct(existingProduct);
            
            // Delete existing images before adding new ones
            if (existingImages != null && !existingImages.isEmpty()) {
                for (ProductImage image : existingImages) {
                    if (image.getId() != null) {
                        try {
                            productImageService.delete(image.getId());
                        } catch (Exception e) {
                            // Log but don't fail if image deletion fails
                            System.err.println("Warning: Failed to delete image " + image.getId() + ": " + e.getMessage());
                        }
                    }
                }
            }
            
            // Update product fields while preserving timestamps
            if (product.getTitle() != null && !product.getTitle().trim().isEmpty()) {
                existingProduct.setTitle(product.getTitle().trim());
            }
            if (product.getDescription() != null) {
                existingProduct.setDescription(product.getDescription());
            }
            if (product.getPrice() != null) {
                existingProduct.setPrice(product.getPrice());
            }
            if (product.getCurrency() != null && !product.getCurrency().trim().isEmpty()) {
                existingProduct.setCurrency(product.getCurrency().trim());
            }
            
            // Handle category - load it from repository if ID is provided
            if (product.getCategory() != null && product.getCategory().getId() != null) {
                // Load category from repository to ensure it exists
                Optional<Category> categoryOpt = categoryRepository.findById(product.getCategory().getId());
                if (categoryOpt.isPresent()) {
                    existingProduct.setCategory(categoryOpt.get());
                } else {
                    // Category not found, set to null
                    existingProduct.setCategory(null);
                }
            } else {
                // No category provided, set to null
                existingProduct.setCategory(null);
            }
            
            if (product.getStock() != null) {
                existingProduct.setStock(product.getStock());
            }
            if (product.getMaterial() != null) {
                existingProduct.setMaterial(product.getMaterial());
            }
            if (product.getDimensions() != null) {
                existingProduct.setDimensions(product.getDimensions());
            }
            if (product.getWeight() != null) {
                existingProduct.setWeight(product.getWeight());
            }
            if (product.getMainImageUrl() != null) {
                existingProduct.setMainImageUrl(product.getMainImageUrl());
            }
            
            // Save updated product
            Product savedProduct = productRepository.save(existingProduct);
            
            // Save new images if provided
            // Handle both empty array and null - empty array means clear all images
            if (product.getImages() != null && !product.getImages().isEmpty()) {
                for (ProductImage image : product.getImages()) {
                    // Only create if imageUrl is not empty
                    if (image != null && image.getImageUrl() != null && !image.getImageUrl().trim().isEmpty()) {
                        try {
                            // Create new image entity - always create new, never update existing
                            ProductImage newImage = new ProductImage();
                            newImage.setImageUrl(image.getImageUrl().trim());
                            newImage.setAltText(image.getAltText() != null && !image.getAltText().trim().isEmpty() 
                                ? image.getAltText() 
                                : (savedProduct.getTitle() != null ? savedProduct.getTitle() + " - Image" : "Product Image"));
                            newImage.setOrderIndex(image.getOrderIndex() != null ? image.getOrderIndex() : 0);
                            newImage.setProduct(savedProduct);
                            // Ensure id is null for new image
                            newImage.setId(null);
                            productImageService.create(newImage);
                        } catch (Exception e) {
                            // Log but don't fail if image creation fails
                            System.err.println("Warning: Failed to create image: " + e.getMessage());
                            e.printStackTrace();
                        }
                    }
                }
            }
            
            // Reload product to get updated images
            return productRepository.findById(savedProduct.getId())
                    .orElse(savedProduct);
        } catch (Exception e) {
            System.err.println("Error updating product: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to update product: " + e.getMessage(), e);
        }
    }

    /**
     * Deletes a product by ID.
     * First deletes all related entities (images, files, cart items, reviews, order items)
     * to avoid foreign key constraint violations.
     * Transactional to ensure all deletions succeed or none.
     * 
     * @param id Product ID to delete
     * @throws RuntimeException if product not found
     */
    @Transactional
    public void delete(Long id) {
        // Get product first to ensure it exists
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found with ID: " + id));
        
        try {
            // Force load images and files to avoid lazy loading issues
            if (product.getImages() != null) {
                product.getImages().size(); // Force initialization
            }
            if (product.getFiles() != null) {
                product.getFiles().size(); // Force initialization
            }
            
            // Delete all product images using repository directly for better control
            List<ProductImage> images = productImageRepository.findByProductOrderByOrderIndexAsc(product);
            if (images != null && !images.isEmpty()) {
                // Delete each image individually to ensure proper cascade
                for (ProductImage image : images) {
                    productImageRepository.delete(image);
                }
                // Flush to ensure images are deleted before product deletion
                entityManager.flush();
                entityManager.clear(); // Clear persistence context
            }
            
            // Delete all product files using repository directly
            List<ProductFile> files = productFileRepository.findByProduct(product);
            if (files != null && !files.isEmpty()) {
                // Delete each file individually to ensure proper cascade
                for (ProductFile file : files) {
                    productFileRepository.delete(file);
                }
                // Flush to ensure files are deleted before product deletion
                entityManager.flush();
                entityManager.clear(); // Clear persistence context
            }
            
            // Delete all cart items containing this product
            List<CartItem> cartItems = cartItemRepository.findByProduct(product);
            if (cartItems != null && !cartItems.isEmpty()) {
                cartItemRepository.deleteAll(cartItems);
                entityManager.flush();
            }
            
            // Delete all reviews for this product
            List<Review> reviews = reviewService.getByProduct(product);
            if (reviews != null && !reviews.isEmpty()) {
                for (Review review : reviews) {
                    if (review.getId() != null) {
                        try {
                            reviewService.delete(review.getId());
                        } catch (Exception e) {
                            System.err.println("Warning: Failed to delete review " + review.getId() + ": " + e.getMessage());
                        }
                    }
                }
                entityManager.flush();
            }
            
            // Delete all order items containing this product
            // Note: This will remove the product from order history
            // If you want to preserve order history, you could set product to null instead
            List<OrderItem> orderItems = orderItemRepository.findByProduct(product);
            if (orderItems != null && !orderItems.isEmpty()) {
                orderItemRepository.deleteAll(orderItems);
                entityManager.flush();
            }
            
            // Finally, delete the product itself
            // The cascade and orphanRemoval should handle images and files automatically
            // but we've already deleted them explicitly above for safety
            productRepository.deleteById(id);
            entityManager.flush();
            
        } catch (Exception e) {
            System.err.println("Error deleting product: " + e.getMessage());
            e.printStackTrace();
            throw new RuntimeException("Failed to delete product: " + e.getMessage(), e);
        }
    }
}
