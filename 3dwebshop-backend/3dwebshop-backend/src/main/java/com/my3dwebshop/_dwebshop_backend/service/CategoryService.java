package com.my3dwebshop._dwebshop_backend.service;

import com.my3dwebshop._dwebshop_backend.model.Category;
import com.my3dwebshop._dwebshop_backend.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for category management operations.
 * Handles CRUD operations for product categories.
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    /**
     * Creates a new category.
     * 
     * @param category Category entity to create
     * @return Created category
     */
    public Category create(Category category) {
        return categoryRepository.save(category);
    }

    /**
     * Retrieves all categories.
     * 
     * @return List of all categories
     */
    public List<Category> getAll() {
        return categoryRepository.findAll();
    }

    /**
     * Retrieves a category by ID.
     * 
     * @param id Category ID
     * @return Optional containing category if found
     */
    public Optional<Category> getById(Long id) {
        return categoryRepository.findById(id);
    }

    /**
     * Retrieves a category by slug.
     * 
     * @param slug Category slug
     * @return Optional containing category if found
     */
    public Optional<Category> getBySlug(String slug) {
        return categoryRepository.findBySlug(slug);
    }

    /**
     * Updates an existing category.
     * 
     * @param category Category entity with updated data
     * @return Updated category
     */
    public Category update(Category category) {
        return categoryRepository.save(category);
    }

    /**
     * Deletes a category by ID.
     * 
     * @param id Category ID to delete
     */
    public void delete(Long id) {
        categoryRepository.deleteById(id);
    }
}
