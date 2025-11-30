package com.my3dwebshop._dwebshop_backend.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

/**
 * JWT token utility class for generating and parsing JWT tokens.
 * Provides methods for token creation, validation, and claims extraction.
 * Note: This class appears to be a duplicate/alternative to JwtTokenProvider.
 */
@Component
public class JwtTokenUtil {

    /** Secret key for signing JWT tokens */
    private final String jwtSecret = "mySecretKey12345mySecretKey12345mySecretKey12345";
    
    /** Token expiration time in milliseconds (1 day) */
    private final long jwtExpirationMs = 86400000;

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
     * Generates a JWT token with user ID, username, and role.
     * 
     * @param userId User ID
     * @param username Username (used as subject)
     * @param role User role
     * @return JWT token string
     */
    public String generateToken(Long userId, String username, String role) {
        return Jwts.builder()
                .subject(username)
                .claim("userId", userId)
                .claim("role", role)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Generates a simplified JWT token with only username.
     * 
     * @param username Username (used as subject)
     * @return JWT token string
     */
    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username)
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Extracts username from a JWT token.
     * 
     * @param token JWT token string
     * @return Username
     */
    public String getUsernameFromToken(String token) {
        return getClaimsFromToken(token).getSubject();
    }

    /**
     * Extracts user ID from a JWT token.
     * 
     * @param token JWT token string
     * @return User ID
     */
    public Long getUserIdFromToken(String token) {
        return getClaimsFromToken(token).get("userId", Long.class);
    }

    /**
     * Extracts role from a JWT token.
     * 
     * @param token JWT token string
     * @return User role
     */
    public String getRoleFromToken(String token) {
        return getClaimsFromToken(token).get("role", String.class);
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
     * Extracts all claims from a JWT token.
     * 
     * @param token JWT token string
     * @return Claims object containing token data
     */
    public Claims getClaimsFromToken(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }
}