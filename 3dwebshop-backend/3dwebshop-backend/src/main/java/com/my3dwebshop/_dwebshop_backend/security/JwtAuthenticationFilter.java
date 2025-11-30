package com.my3dwebshop._dwebshop_backend.security;

import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

/**
 * JWT authentication filter that intercepts HTTP requests and validates JWT tokens.
 * Extracts user information from tokens and sets up Spring Security authentication context.
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider tokenProvider;

    /**
     * Filters incoming requests to extract and validate JWT tokens.
     * If a valid token is found, sets up authentication in Spring Security context.
     * 
     * @param request HTTP servlet request
     * @param response HTTP servlet response
     * @param filterChain Filter chain to continue processing
     * @throws ServletException if servlet error occurs
     * @throws IOException if I/O error occurs
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        // Extract Authorization header
        String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            // Extract token from "Bearer <token>" format
            String token = header.substring(7);
            if (tokenProvider.validateToken(token)) {
                try {
                    // Extract claims from token
                    Claims claims = tokenProvider.getClaims(token);
                    String username = claims.getSubject();
                    String role = claims.get("role", String.class);

                    if (username != null) {
                        // Default role to USER if not specified in token
                        if (role == null) {
                            role = "USER";
                        }
                        // Create authentication token with user details
                        UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                                username,
                                null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + role.toUpperCase()))
                        );
                        // Set authentication in Spring Security context
                        SecurityContextHolder.getContext().setAuthentication(auth);
                        System.out.println("✅ JWT Authentication successful for user: " + username + " with role: " + role);
                    }
                } catch (Exception e) {
                    System.err.println("❌ JWT Token validation error: " + e.getMessage());
                    e.printStackTrace();
                }
            } else {
                System.err.println("❌ JWT Token validation failed");
            }
        } else {
            System.out.println("⚠️ No Authorization header found for: " + request.getRequestURI());
        }

        // Continue with the filter chain
        filterChain.doFilter(request, response);
    }
}
