import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { AuthService } from '../services/AuthService';

/**
 * Authentication context for managing user authentication state.
 * Provides login, logout, registration, and user profile management.
 */
const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the app and provides authentication context.
 * Manages user state, JWT token, and authentication methods.
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child components
 */
export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    /**
     * Logs out the current user by clearing token and user state.
     */
    const logout = useCallback(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
        AuthService.logout().catch(console.error);
    }, []);

    /**
     * Loads user profile from the backend using the stored JWT token.
     * Decodes token to get user ID/username and fetches full user data.
     */
    const loadUser = useCallback(async () => {
        try {
            const response = await AuthService.getProfile();
            if (response && response.data) {
                setUser(response.data);
                console.log('✅ User loaded:', {
                    id: response.data.id,
                    username: response.data.username,
                    role: response.data.role,
                    email: response.data.email
                });
            } else {
                throw new Error('No user data received');
            }
        } catch (error) {
            console.error('❌ Error loading user:', error);
            console.error('Error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            // Clear token and user on error, but don't call logout to avoid recursion
            setToken(null);
            setUser(null);
            localStorage.removeItem('token');
        } finally {
            setLoading(false);
        }
    }, []);

    /**
     * Effect hook to load user profile when component mounts or token changes.
     */
    useEffect(() => {
        // Load user from token on mount
        if (token) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, [token, loadUser]);

    /**
     * Authenticates a user and stores the JWT token.
     * 
     * @param {string} username - Username
     * @param {string} password - Password (plain text, will be hashed by backend)
     * @returns {Promise<Object>} Object with success status and optional error message
     */
    const login = async (username, password) => {
        try {
            const response = await AuthService.login({ username, passwordHash: password });
            const tokenData = typeof response.data === 'string' 
                ? JSON.parse(response.data) 
                : response.data;
            const jwtToken = tokenData.token;
            
            if (jwtToken) {
                setToken(jwtToken);
                localStorage.setItem('token', jwtToken);
                await loadUser();
                return { success: true };
            }
            return { success: false, error: 'No token received' };
        } catch (error) {
            let errorMessage = 'Login failed';
            if (error.response?.data) {
                // Handle different error response formats
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = JSON.stringify(error.response.data);
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            return { success: false, error: errorMessage };
        }
    };

    /**
     * Registers a new user and automatically logs them in.
     * Backend hashes the password, so we use the original password for login.
     * 
     * @param {Object} userData - User registration data (username, email, password, etc.)
     * @returns {Promise<Object>} Object with success status and optional error message
     */
    const register = async (userData) => {
        try {
            const response = await AuthService.register(userData);
            // After registration, automatically login
            // Backend hashes the password, so we use the original password for login
            if (response.data) {
                // Use original password (not hashed) for login
                return await login(userData.username, userData.passwordHash);
            }
            return { success: false, error: 'Registration failed' };
        } catch (error) {
            let errorMessage = 'Registration failed';
            if (error.response?.data) {
                // Handle different error response formats
                if (typeof error.response.data === 'string') {
                    errorMessage = error.response.data;
                } else if (error.response.data.message) {
                    errorMessage = error.response.data.message;
                } else if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else {
                    errorMessage = JSON.stringify(error.response.data);
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            return { success: false, error: errorMessage };
        }
    };

    /**
     * Checks if the current user has admin role.
     * 
     * @returns {boolean} True if user is admin, false otherwise
     */
    const isAdmin = useCallback(() => {
        if (!user) {
            console.log('⚠️ isAdmin: user is null');
            return false;
        }
        const role = user.role;
        const isAdminResult = role === 'ADMIN' || role === 'admin';
        console.log('🔍 isAdmin check:', { role, isAdminResult });
        return isAdminResult;
    }, [user]);

    const value = {
        user,
        token,
        loading,
        login,
        register,
        logout,
        isAdmin,
        isAuthenticated: !!token && !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

/**
 * Custom hook to access authentication context.
 * Must be used within an AuthProvider.
 * 
 * @returns {Object} Authentication context value with user, token, and auth methods
 * @throws {Error} If used outside AuthProvider
 */
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

