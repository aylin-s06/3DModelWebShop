import api from "../axios";

/**
 * Cart service for managing shopping cart operations.
 * Handles adding, removing, updating, and clearing cart items.
 */
export const CartService = {
    /**
     * Retrieves all items in a user's cart.
     * 
     * @param {number|string} userId - User ID
     * @returns {Promise} Axios response with cart items
     */
    getCart: (userId) => api.get(`/api/cart/${userId}`),
    
    /**
     * Adds an item to the cart.
     * 
     * @param {number|string} userId - User ID
     * @param {Object} item - Cart item data
     * @returns {Promise} Axios response with created cart item
     */
    addToCart: (userId, item) => api.post(`/api/cart/${userId}`, item),
    
    /**
     * Removes an item from the cart.
     * 
     * @param {number|string} userId - User ID
     * @param {number|string} itemId - Cart item ID
     * @returns {Promise} Axios response
     */
    removeFromCart: (userId, itemId) => api.delete(`/api/cart/${userId}/${itemId}`),
    
    /**
     * Clears all items from the cart.
     * 
     * @param {number|string} userId - User ID
     * @returns {Promise} Axios response
     */
    clearCart: (userId) => api.delete(`/api/cart/clear/${userId}`),
    
    /**
     * Updates the quantity of a cart item.
     * Since there's no update endpoint, removes and re-adds the item.
     * This is a workaround - backend should have PUT /api/cart/{userId}/{itemId}
     * 
     * @param {number|string} userId - User ID
     * @param {number|string} itemId - Cart item ID
     * @param {number} quantity - New quantity
     * @returns {Promise} Axios response with updated cart item
     */
    updateQuantity: async (userId, itemId, quantity) => {
        // Since there's no update endpoint, we'll remove and re-add
        // This is a workaround - backend should have PUT /api/cart/{userId}/{itemId}
        const cartResponse = await api.get(`/api/cart/${userId}`);
        const item = cartResponse.data.find(i => i.id === itemId);
        if (!item) throw new Error('Item not found');
        
        await api.delete(`/api/cart/${userId}/${itemId}`);
        return api.post(`/api/cart/${userId}`, {
            ...item,
            qty: quantity,
            id: undefined
        });
    }
};

export default CartService;

