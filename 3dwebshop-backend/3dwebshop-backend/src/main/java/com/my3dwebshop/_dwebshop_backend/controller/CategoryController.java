package com.my3dwebshop._dwebshop_backend.controller;

import com.my3dwebshop._dwebshop_backend.model.Category;
import com.my3dwebshop._dwebshop_backend.service.CategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

/**
 * REST controller for category management.
 * Handles CRUD operations for product categories.
 */
@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    /**
     * Retrieves all categories.
     * 
     * @return List of all categories
     */
    @GetMapping
    public List<Category> getAll() {
        return categoryService.getAll();
    }

    /**
     * Retrieves a category by ID.
     * 
     * @param id Category ID
     * @return Category entity
     * @throws ResponseStatusException if category not found
     */
    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        return categoryService.getById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));
    }

    /**
     * Creates a new category.
     * 
     * @param category Category entity to create
     * @return Created category
     */
    @PostMapping
    public Category create(@RequestBody Category category) {
        return categoryService.create(category);
    }

    /**
     * Updates an existing category.
     * 
     * @param id Category ID
     * @param category Category entity with updated data
     * @return Updated category
     */
    @PutMapping("/{id}")
    public Category update(@PathVariable Long id, @RequestBody Category category) {
        category.setId(id);
        return categoryService.update(category);
    }

    /**
     * Deletes a category by ID.
     * 
     * @param id Category ID to delete
     */
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        categoryService.delete(id);
    }
}
