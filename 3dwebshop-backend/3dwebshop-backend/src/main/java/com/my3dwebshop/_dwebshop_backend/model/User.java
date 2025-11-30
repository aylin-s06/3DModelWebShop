package com.my3dwebshop._dwebshop_backend.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * User entity representing a registered user in the system.
 * Supports both regular users (USER) and administrators (ADMIN).
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** Unique username for login */
    @Column(unique = true, nullable = false)
    private String username;

    /** Unique email address */
    @Column(unique = true, nullable = false)
    private String email;

    /** BCrypt hashed password */
    private String passwordHash;

    /** User role: USER or ADMIN */
    private String role;

    /** User's full name */
    private String name;

    /** User's phone number */
    private String phone;

    /** Timestamp when user was created */
    private LocalDateTime createdAt;

    /** Timestamp when user was last updated */
    private LocalDateTime updatedAt;

    /**
     * Sets creation timestamp before persisting.
     */
    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    /**
     * Sets update timestamp before updating.
     */
    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
