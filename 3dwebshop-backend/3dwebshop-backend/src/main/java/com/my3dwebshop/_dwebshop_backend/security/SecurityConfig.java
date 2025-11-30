package com.my3dwebshop._dwebshop_backend.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import org.springframework.http.HttpMethod;

import java.util.Arrays;

/**
 * Security configuration class for the application.
 * Configures CORS, JWT authentication, and URL access rules.
 */
@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtFilter;

    /**
     * Configures CORS (Cross-Origin Resource Sharing) settings.
     * Allows requests from frontend applications running on localhost:3000 and localhost:3001.
     * 
     * @return CORS configuration source
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:3001"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setExposedHeaders(Arrays.asList("Authorization"));
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Configures the security filter chain with JWT authentication.
     * Sets up URL access rules and applies JWT filter before authentication.
     * 
     * @param http HttpSecurity object to configure
     * @return Configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
                // Disable CSRF for stateless JWT authentication
                .csrf(AbstractHttpConfigurer::disable)
                // Enable CORS with configured settings
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                // Use stateless session management (no session cookies)
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                // Configure URL access rules
                .authorizeHttpRequests(auth -> auth
                        // Allow all OPTIONS requests for CORS preflight
                        .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                        // Public endpoints - no authentication required
                        .requestMatchers(
                                "/api/auth/**",
                                "/api/products/**",
                                "/api/categories/**",
                                "/api/reviews",
                                "/api/reviews/product/**",
                                "/error"
                        ).permitAll()
                        // Allow user registration without authentication
                        .requestMatchers(HttpMethod.POST, "/api/users").permitAll()
                        // Allow authenticated users to access their profile
                        .requestMatchers(HttpMethod.GET, "/api/users/**").authenticated()
                        // Cart operations require authentication
                        .requestMatchers("/api/cart/**").authenticated()
                        // Creating reviews requires authentication
                        .requestMatchers(HttpMethod.POST, "/api/reviews/**").authenticated()
                        // Deleting reviews requires authentication (typically admin only)
                        .requestMatchers(HttpMethod.DELETE, "/api/reviews/**").authenticated()
                        // All other requests require authentication
                        .anyRequest().authenticated()
                )
                // Add JWT filter before the default authentication filter
                .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Creates a BCrypt password encoder bean for hashing passwords.
     * 
     * @return BCryptPasswordEncoder instance
     */
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    /**
     * Creates an AuthenticationManager bean for handling authentication.
     * 
     * @param authConfig AuthenticationConfiguration
     * @return AuthenticationManager instance
     * @throws Exception if configuration fails
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }
}
