package com.my3dwebshop._dwebshop_backend.service;

import com.my3dwebshop._dwebshop_backend.model.Tag;
import com.my3dwebshop._dwebshop_backend.repository.TagRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for tag management operations.
 * Handles CRUD operations for product tags.
 */
@Service
@RequiredArgsConstructor
public class TagService {

    private final TagRepository tagRepository;

    /**
     * Creates a new tag.
     * 
     * @param tag Tag entity to create
     * @return Created tag
     */
    public Tag create(Tag tag) {
        return tagRepository.save(tag);
    }

    /**
     * Retrieves all tags.
     * 
     * @return List of all tags
     */
    public List<Tag> getAll() {
        return tagRepository.findAll();
    }

    /**
     * Retrieves a tag by ID.
     * 
     * @param id Tag ID
     * @return Optional containing tag if found
     */
    public Optional<Tag> getById(Long id) {
        return tagRepository.findById(id);
    }

    /**
     * Retrieves a tag by slug.
     * 
     * @param slug Tag slug
     * @return Optional containing tag if found
     */
    public Optional<Tag> getBySlug(String slug) {
        return tagRepository.findBySlug(slug);
    }

    /**
     * Updates an existing tag.
     * 
     * @param tag Tag entity with updated data
     * @return Updated tag
     */
    public Tag update(Tag tag) {
        return tagRepository.save(tag);
    }

    /**
     * Deletes a tag by ID.
     * 
     * @param id Tag ID to delete
     */
    public void delete(Long id) {
        tagRepository.deleteById(id);
    }
}
