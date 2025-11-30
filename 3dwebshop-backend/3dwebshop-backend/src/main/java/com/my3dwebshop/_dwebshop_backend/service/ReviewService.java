package com.my3dwebshop._dwebshop_backend.service;

import com.my3dwebshop._dwebshop_backend.model.Product;
import com.my3dwebshop._dwebshop_backend.model.Review;
import com.my3dwebshop._dwebshop_backend.model.User;
import com.my3dwebshop._dwebshop_backend.repository.ReviewRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for review management operations.
 * Handles creating, retrieving, and deleting product reviews.
 */
@Service
@RequiredArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;

    /**
     * Retrieves all reviews.
     * 
     * @return List of all reviews
     */
    public List<Review> getAll() {
        return reviewRepository.findAll();
    }

    /**
     * Creates a new review.
     * 
     * @param review Review entity to create
     * @return Created review
     */
    public Review create(Review review) {
        return reviewRepository.save(review);
    }

    /**
     * Retrieves all reviews for a specific product.
     * 
     * @param product Product entity
     * @return List of reviews for the product
     */
    public List<Review> getByProduct(Product product) {
        return reviewRepository.findByProduct(product);
    }

    /**
     * Retrieves all reviews by a specific user.
     * 
     * @param user User entity
     * @return List of reviews by the user
     */
    public List<Review> getByUser(User user) {
        return reviewRepository.findByUser(user);
    }

    /**
     * Finds a review by user and product.
     * 
     * @param user User entity
     * @param product Product entity
     * @return Optional containing review if found
     */
    public Optional<Review> getByUserAndProduct(User user, Product product) {
        return reviewRepository.findByUserAndProduct(user, product);
    }

    /**
     * Deletes a review by ID.
     * 
     * @param id Review ID to delete
     */
    public void delete(Long id) {
        reviewRepository.deleteById(id);
    }
}
