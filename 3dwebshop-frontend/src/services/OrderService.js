import api from "../axios";

/**
 * Order service for managing order operations.
 * Handles creating, retrieving, updating, and deleting orders.
 */
export const OrderService = {
    /**
     * Fetches all orders.
     * Since backend doesn't have a direct getAll, returns empty array if endpoint doesn't exist.
     * Backend should add GET /api/orders endpoint.
     * 
     * @returns {Promise<Object>} Promise resolving to orders data
     */
    getAll: async () => {
        // Since backend doesn't have a direct getAll, we'll need to get all users and their orders
        // For now, return empty array - backend should add GET /api/orders endpoint
        try {
            return await api.get("/api/orders");
        } catch (error) {
            // If endpoint doesn't exist, return empty array
            return { data: [] };
        }
    },
    
    /**
     * Fetches an order by ID.
     * 
     * @param {number|string} orderId - Order ID
     * @returns {Promise} Axios response with order data
     */
    getById: (orderId) => api.get(`/api/orders/${orderId}`),
    
    /**
     * Fetches orders by status.
     * 
     * @param {string} status - Order status (NEW, PROCESSING, SHIPPED, COMPLETED, CANCELED)
     * @returns {Promise} Axios response with orders
     */
    getByStatus: (status) => api.get(`/api/orders/status/${status}`),
    
    /**
     * Creates a new order.
     * Backend expects userId in path, so extracts userId from data.
     * 
     * @param {Object} data - Order data with user information
     * @returns {Promise} Axios response with created order
     */
    create: (data) => {
        // Backend expects userId in path, so we need to handle this differently
        const userId = data.user?.id || data.userId;
        return api.post(`/api/orders/${userId}`, data);
    },
    
    /**
     * Updates an existing order.
     * 
     * @param {number|string} orderId - Order ID
     * @param {Object} data - Updated order data
     * @returns {Promise} Axios response with updated order
     */
    update: (orderId, data) => api.put(`/api/orders/${orderId}`, data),
    
    /**
     * Deletes an order.
     * 
     * @param {number|string} orderId - Order ID
     * @returns {Promise} Axios response
     */
    delete: (orderId) => api.delete(`/api/orders/${orderId}`),
    
    /**
     * Updates the status of an order.
     * Updates the entire order with new status.
     * 
     * @param {number|string} orderId - Order ID
     * @param {string} status - New order status
     * @returns {Promise} Axios response with updated order
     */
    updateStatus: (orderId, status) => {
        // Update the entire order with new status
        return api.put(`/api/orders/${orderId}`, { status });
    },
};
