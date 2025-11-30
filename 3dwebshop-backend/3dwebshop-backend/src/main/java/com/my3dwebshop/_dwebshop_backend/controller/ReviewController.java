package com.my3dwebshop._dwebshop_backend.controller;

import com.my3dwebshop._dwebshop_backend.model.Product;
import com.my3dwebshop._dwebshop_backend.model.Review;
import com.my3dwebshop._dwebshop_backend.model.User;
import com.my3dwebshop._dwebshop_backend.service.ProductService;
import com.my3dwebshop._dwebshop_backend.service.ReviewService;
import com.my3dwebshop._dwebshop_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST controller for product review management.
 * Handles creating, retrieving, and deleting product reviews.
 */
@RestController
@RequestMapping("/api/reviews")
@RequiredArgsConstructor
public class ReviewController {

    private final ReviewService reviewService;
    private final UserService userService;
    private final ProductService productService;

    /**
     * Retrieves all reviews.
     * 
     * @return List of all reviews
     */
    @GetMapping
    public List<Review> getAll() {
        return reviewService.getAll();
    }

    /**
     * Retrieves all reviews for a specific product.
     * 
     * @param productId Product ID
     * @return List of reviews for the product
     * @throws ResponseStatusException if product not found
     */
    @GetMapping("/product/{productId}")
    public List<Review> getByProduct(@PathVariable Long productId) {
        Product product = productService.getById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        return reviewService.getByProduct(product);
    }

    /**
     * Retrieves all reviews by a specific user.
     * 
     * @param userId User ID
     * @return List of reviews by the user
     * @throws ResponseStatusException if user not found
     */
    @GetMapping("/user/{userId}")
    public List<Review> getByUser(@PathVariable Long userId) {
        User user = userService.getById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        return reviewService.getByUser(user);
    }

    /**
     * Creates a new review for a product.
     * 
     * @param userId User ID creating the review
     * @param productId Product ID being reviewed
     * @param review Review entity with rating and comment
     * @return Created review
     * @throws ResponseStatusException if user or product not found
     */
    @PostMapping("/{userId}/{productId}")
    public Review createReview(@PathVariable Long userId, @PathVariable Long productId, @RequestBody Review review) {
        User user = userService.getById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));
        Product product = productService.getById(productId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));
        review.setUser(user);
        review.setProduct(product);
        return reviewService.create(review);
    }

    /**
     * Deletes a review by ID.
     * 
     * @param reviewId Review ID to delete
     */
    @DeleteMapping("/{reviewId}")
    public void delete(@PathVariable Long reviewId) {
        reviewService.delete(reviewId);
    }
}
