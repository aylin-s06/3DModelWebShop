import api from "../axios";

/**
 * Authentication service for handling login, registration, and user profile operations.
 */
export const AuthService = {
    /**
     * Authenticates a user and returns a JWT token.
     * 
     * @param {Object} data - Login credentials (username, passwordHash)
     * @returns {Promise} Axios response with JWT token
     */
    login: (data) => api.post("/api/auth/login", data),
    
    /**
     * Registers a new user.
     * Uses UserController endpoint for registration.
     * 
     * @param {Object} data - User registration data
     * @returns {Promise} Axios response with created user
     */
    register: (data) => api.post("/api/users", data),
    
    /**
     * Gets the current user's profile by decoding JWT token.
     * Since there's no /api/auth/profile endpoint, decodes token to get user info.
     * 
     * @returns {Promise<Object>} Promise resolving to user data
     * @throws {Error} If token is missing or user not found
     */
    getProfile: async () => {
        // Since there's no /api/auth/profile, we'll get user from token
        // Decode JWT token to get user info
        try {
            const token = localStorage.getItem('token');
            if (!token) throw new Error('No token');
            
            // Decode token to get username and userId
            const payload = JSON.parse(atob(token.split('.')[1]));
            const username = payload.sub || payload.username;
            const userId = payload.userId;
            
            // Try to get user by ID first (more reliable)
            if (userId) {
                try {
                    const response = await api.get(`/api/users/${userId}`);
                    if (response.data) {
                        return { data: response.data };
                    }
                } catch (e) {
                    console.warn('Could not get user by ID, trying by username');
                }
            }
            
            // Fallback: get all users and find the one matching
            const usersResponse = await api.get("/api/users");
            const users = Array.isArray(usersResponse.data) ? usersResponse.data : [];
            
            // Find user by username (take the first match if multiple)
            const user = users.find(u => u.username === username);
            if (!user) throw new Error('User not found');
            
            return { data: user };
        } catch (error) {
            throw error;
        }
    },
    
    /**
     * Logs out the user (client-side only, no backend call needed).
     * 
     * @returns {Promise} Resolved promise
     */
    logout: () => Promise.resolve()
};
