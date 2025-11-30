package com.my3dwebshop._dwebshop_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT token provider for generating and validating JWT tokens.
 * Handles token creation, validation, and claims extraction.
 */
@Component
public class JwtTokenProvider {

    /** Secret key for signing JWT tokens (default: 45 characters minimum for HS256) */
    @Value("${app.jwtSecret:mySecretKey12345mySecretKey12345mySecretKey12345}")
    private String jwtSecret;

    /** Token expiration time in milliseconds (default: 1 day = 86400000 ms) */
    @Value("${app.jwtExpirationMs:86400000}")
    private int jwtExpirationMs;

    /**
     * Generates a signing key from the secret string.
     * 
     * @return SecretKey for signing JWT tokens
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = jwtSecret.getBytes(StandardCharsets.UTF_8);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Generates a JWT token for a user with the specified claims.
     * 
     * @param userId User ID to include in token
     * @param username Username (used as subject)
     * @param role User role (USER or ADMIN)
     * @return JWT token string
     */
    public String generateToken(Long userId, String username, String role) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);

        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Validates a JWT token by checking its signature and expiration.
     * 
     * @param token JWT token string to validate
     * @return true if token is valid, false otherwise
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    /**
     * Extracts claims from a JWT token.
     * 
     * @param token JWT token string
     * @return Claims object containing token data (userId, username, role, etc.)
     */
    public Claims getClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}