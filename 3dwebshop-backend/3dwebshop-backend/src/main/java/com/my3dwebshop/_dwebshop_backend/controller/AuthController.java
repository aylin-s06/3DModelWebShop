package com.my3dwebshop._dwebshop_backend.controller;

import com.my3dwebshop._dwebshop_backend.model.User;
import com.my3dwebshop._dwebshop_backend.security.JwtTokenProvider;
import com.my3dwebshop._dwebshop_backend.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

/**
 * Authentication controller handling user login.
 * Provides endpoints for user authentication and JWT token generation.
 */
@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenProvider jwtTokenProvider;
    private final UserService userService;
    private final PasswordEncoder passwordEncoder;

    /**
     * Authenticates a user and returns a JWT token.
     * 
     * @param request User object containing username and password
     * @return ResponseEntity with JWT token on success, or error message on failure
     */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody User request) {
        // Check if user exists
        User user = userService.findByUsername(request.getUsername());
        if (user == null) {
            return ResponseEntity.status(401).body("Invalid username");
        }

        // Verify password
        if (!passwordEncoder.matches(request.getPasswordHash(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid password");
        }

        // Generate JWT token with user role
        String role = user.getRole() != null ? user.getRole() : "USER";
        String token = jwtTokenProvider.generateToken(user.getId(), user.getUsername(), role);
        return ResponseEntity.ok().body("{\"token\": \"" + token + "\"}");
    }
}
