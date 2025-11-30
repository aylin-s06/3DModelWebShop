import api from "../axios";

/**
 * User service for managing user operations.
 * Handles CRUD operations for users.
 */
export const UserService = {
    /**
     * Fetches all users.
     * 
     * @returns {Promise} Axios response with array of users
     */
    getAll: () => api.get("/api/users"),
    
    /**
     * Fetches a user by ID.
     * 
     * @param {number|string} id - User ID
     * @returns {Promise} Axios response with user data
     */
    getById: (id) => api.get(`/api/users/${id}`),
    
    /**
     * Creates a new user (registration).
     * 
     * @param {Object} user - User data
     * @returns {Promise} Axios response with created user
     */
    create: (user) => api.post("/api/users", user),
    
    /**
     * Updates an existing user.
     * 
     * @param {number|string} id - User ID
     * @param {Object} user - Updated user data
     * @returns {Promise} Axios response with updated user
     */
    update: (id, user) => api.put(`/api/users/${id}`, user),
    
    /**
     * Deletes a user.
     * 
     * @param {number|string} id - User ID
     * @returns {Promise} Axios response
     */
    delete: (id) => api.delete(`/api/users/${id}`)
};

export default UserService;

