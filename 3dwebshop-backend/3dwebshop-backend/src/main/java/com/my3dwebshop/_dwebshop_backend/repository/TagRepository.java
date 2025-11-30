package com.my3dwebshop._dwebshop_backend.repository;

import com.my3dwebshop._dwebshop_backend.model.Tag;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TagRepository extends JpaRepository<Tag, Long> {
    Optional<Tag> findBySlug(String slug);
    Optional<Tag> findByName(String name);
}
