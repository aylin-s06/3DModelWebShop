import api from "../axios";

/**
 * Review service for managing product reviews.
 * Handles creating, retrieving, and deleting reviews.
 */
const ReviewService = {
    /**
     * Fetches all reviews (for homepage).
     * 
     * @returns {Promise<Array>} Promise resolving to array of reviews
     * @throws {Error} If request fails
     */
    getAllReviews: async () => {
        try {
            const response = await api.get("/api/reviews");
            return response.data;
        } catch (error) {
            console.error("Error fetching all reviews:", error);
            throw error;
        }
    },

    /**
     * Fetches reviews for a specific product.
     * 
     * @param {number|string} productId - Product ID
     * @returns {Promise<Array>} Promise resolving to array of reviews
     * @throws {Error} If request fails
     */
    getByProduct: async (productId) => {
        try {
            const response = await api.get(`/api/reviews/product/${productId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching product reviews:", error);
            throw error;
        }
    },

    /**
     * Fetches reviews by a specific user.
     * 
     * @param {number|string} userId - User ID
     * @returns {Promise<Array>} Promise resolving to array of reviews
     * @throws {Error} If request fails
     */
    getByUser: async (userId) => {
        try {
            const response = await api.get(`/api/reviews/user/${userId}`);
            return response.data;
        } catch (error) {
            console.error("Error fetching user reviews:", error);
            throw error;
        }
    },

    /**
     * Creates a new review for a product.
     * 
     * @param {number|string} userId - User ID creating the review
     * @param {number|string} productId - Product ID being reviewed
     * @param {Object} reviewData - Review data (rating, comment)
     * @returns {Promise<Object>} Promise resolving to created review
     * @throws {Error} If request fails
     */
    createReview: async (userId, productId, reviewData) => {
        try {
            const response = await api.post(`/api/reviews/${userId}/${productId}`, reviewData);
            return response.data;
        } catch (error) {
            console.error("Error creating review:", error);
            throw error;
        }
    },

    /**
     * Deletes a review.
     * 
     * @param {number|string} reviewId - Review ID
     * @returns {Promise} Axios response
     * @throws {Error} If request fails
     */
    deleteReview: async (reviewId) => {
        try {
            await api.delete(`/api/reviews/${reviewId}`);
        } catch (error) {
            console.error("Error deleting review:", error);
            throw error;
        }
    }
};

export default ReviewService;

