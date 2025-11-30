import api from "../axios";

/**
 * Category service for managing product categories.
 * Handles fetching categories from the backend API.
 */
const CategoryService = {
    /**
     * Fetches all categories from the backend.
     * 
     * @returns {Promise<Array>} Promise resolving to array of categories
     */
    getCategories: async () => {
        try {
            const response = await api.get("/api/categories");
            if (Array.isArray(response.data)) {
                return response.data;
            }
            return [];
        } catch (error) {
            console.error("Error fetching categories:", error);
            return [];
        }
    },
    
    /**
     * Fetches a single category by ID.
     * 
     * @param {number|string} id - Category ID
     * @returns {Promise<Object>} Promise resolving to category data
     * @throws {Error} If request fails
     */
    getById: async (id) => {
        try {
            const response = await api.get(`/api/categories/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching category ${id}:`, error);
            throw error;
        }
    }
};

export default CategoryService;

