package com.my3dwebshop._dwebshop_backend.service;

import com.my3dwebshop._dwebshop_backend.model.User;
import com.my3dwebshop._dwebshop_backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

/**
 * Service class for user management operations.
 * Handles user registration, authentication, and CRUD operations.
 */
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    /**
     * Registers a new user with validation and password hashing.
     * 
     * @param user User entity to register
     * @return Registered user
     * @throws RuntimeException if username or email already exists, or if trying to create admin when one already exists
     */
    public User register(User user) {
        // Check username uniqueness
        if (userRepository.findByUsername(user.getUsername()).isPresent()) {
            throw new RuntimeException("Username already taken");
        }
        
        // Check email uniqueness
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            throw new RuntimeException("Email already registered");
        }
        
        // Limit admin users to only one
        if ("ADMIN".equalsIgnoreCase(user.getRole()) || "admin".equalsIgnoreCase(user.getRole())) {
            long adminCount = userRepository.findAll().stream()
                    .filter(u -> "ADMIN".equalsIgnoreCase(u.getRole()) || "admin".equalsIgnoreCase(u.getRole()))
                    .count();
            if (adminCount >= 1) {
                throw new RuntimeException("Admin user already exists. Only one admin is allowed.");
            }
        }
        
        // Hash password before saving
        user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        
        // Set default role to USER if not specified
        if (user.getRole() == null || user.getRole().isEmpty()) {
            user.setRole("USER");
        }
        
        return userRepository.save(user);
    }

    /**
     * Retrieves all users.
     * 
     * @return List of all users
     */
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    /**
     * Retrieves a user by ID.
     * 
     * @param id User ID
     * @return Optional containing user if found
     */
    public Optional<User> getById(Long id) {
        return userRepository.findById(id);
    }

    /**
     * Retrieves a user by username.
     * 
     * @param username Username
     * @return Optional containing user if found
     */
    public Optional<User> getByUsername(String username) {
        return userRepository.findByUsername(username);
    }

    /**
     * Retrieves a user by email.
     * 
     * @param email Email address
     * @return Optional containing user if found
     */
    public Optional<User> getByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    /**
     * Updates an existing user.
     * 
     * @param user User entity with updated data
     * @return Updated user
     */
    public User update(User user) {
        return userRepository.save(user);
    }

    /**
     * Deletes a user by ID.
     * 
     * @param id User ID to delete
     */
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    /**
     * Finds a user by username, returns null if not found.
     * 
     * @param username Username to search for
     * @return User entity or null if not found
     */
    public User findByUsername(String username) {
        return userRepository.findByUsername(username).orElse(null);
    }

}
