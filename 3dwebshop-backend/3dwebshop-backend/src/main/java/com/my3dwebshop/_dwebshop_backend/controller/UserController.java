package com.my3dwebshop._dwebshop_backend.controller;

import com.my3dwebshop._dwebshop_backend.model.User;
import com.my3dwebshop._dwebshop_backend.repository.UserRepository;
import com.my3dwebshop._dwebshop_backend.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

/**
 * REST controller for user management.
 * Handles user registration, profile updates, and user CRUD operations.
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepo;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    public UserController(UserRepository userRepo, UserService userService, PasswordEncoder passwordEncoder) {
        this.userRepo = userRepo;
        this.userService = userService;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Retrieves all users.
     * 
     * @return List of all users
     */
    @GetMapping
    public List<User> getAllUsers() {
        return userRepo.findAll();
    }

    /**
     * Retrieves a user by ID.
     * 
     * @param id User ID
     * @return ResponseEntity with user if found, or 404 if not found
     */
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepo.findById(id);
        return user.map(ResponseEntity::ok).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Creates a new user (registration).
     * Uses UserService.register() to hash password and validate uniqueness.
     * 
     * @param user User entity to create
     * @return ResponseEntity with created user or error message
     */
    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody User user) {
        try {
            // Use UserService.register() to hash password and validate uniqueness
            User saved = userService.register(user);
            return ResponseEntity.ok(saved);
        } catch (RuntimeException e) {
            // Return error message as text
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Registration error: " + e.getMessage());
        }
    }

    /**
     * Updates an existing user.
     * Validates username/email uniqueness and enforces admin limit.
     * 
     * @param id User ID
     * @param update User entity with updated data
     * @return ResponseEntity with updated user or error message
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @RequestBody User update) {
        return userRepo.findById(id).map(existing -> {
            try {
                // Check username uniqueness if changed
                if (update.getUsername() != null && !update.getUsername().equals(existing.getUsername())) {
                    if (userRepo.findByUsername(update.getUsername()).isPresent()) {
                        return ResponseEntity.badRequest().body("Username already taken");
                    }
                    existing.setUsername(update.getUsername());
                }
                
                // Check email uniqueness if changed
                if (update.getEmail() != null && !update.getEmail().equals(existing.getEmail())) {
                    if (userRepo.findByEmail(update.getEmail()).isPresent()) {
                        return ResponseEntity.badRequest().body("Email already registered");
                    }
                    existing.setEmail(update.getEmail());
                }
                
                // Enforce admin limit (only one admin allowed)
                if (update.getRole() != null && 
                    ("ADMIN".equalsIgnoreCase(update.getRole()) || "admin".equalsIgnoreCase(update.getRole())) &&
                    !("ADMIN".equalsIgnoreCase(existing.getRole()) || "admin".equalsIgnoreCase(existing.getRole()))) {
                    // If trying to create a new admin
                    long adminCount = userRepo.findAll().stream()
                            .filter(u -> ("ADMIN".equalsIgnoreCase(u.getRole()) || "admin".equalsIgnoreCase(u.getRole())) 
                                    && !u.getId().equals(id))
                            .count();
                    if (adminCount >= 1) {
                        return ResponseEntity.badRequest().body("Admin user already exists. Only one admin is allowed.");
                    }
                }
                
                existing.setName(update.getName());
                existing.setPhone(update.getPhone());
                existing.setRole(update.getRole());

                // Hash password if changed
                if (update.getPasswordHash() != null && !update.getPasswordHash().isEmpty()) {
                    existing.setPasswordHash(passwordEncoder.encode(update.getPasswordHash()));
                }

                User saved = userRepo.save(existing);
                return ResponseEntity.ok(saved);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body("Update error: " + e.getMessage());
            }
        }).orElseGet(() -> ResponseEntity.notFound().build());
    }

    /**
     * Deletes a user by ID.
     * 
     * @param id User ID to delete
     * @return ResponseEntity with 204 No Content if deleted, or 404 if not found
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepo.existsById(id)) {
            userRepo.deleteById(id);
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.notFound().build();
    }
}