import api from "../axios";

/**
 * Product service for managing product operations.
 * Handles fetching, creating, updating, and deleting products.
 */
const ProductService = {
    /**
     * Fetches all products from the backend.
     * 
     * @returns {Promise<Array>} Promise resolving to array of products
     * @throws {Error} If request fails
     */
    getProducts: async () => {
        try {
            console.log("Fetching products from /api/products");
            const response = await api.get("/api/products");
            
            // Backend returns array of products directly
            if (Array.isArray(response.data)) {
                console.log(`Successfully fetched ${response.data.length} products`);
                return response.data;
            }
            
            // Handle other response formats if needed
            if (response.data?.products) {
                return response.data.products;
            }
            
            if (response.data?.data) {
                return response.data.data;
            }
            
            console.warn("Unexpected response format:", response.data);
            return [];
        } catch (error) {
            console.error("Error fetching products:", error);
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            }
            throw error;
        }
    },
    
    /**
     * Fetches a single product by ID.
     * 
     * @param {number|string} id - Product ID
     * @returns {Promise<Object>} Promise resolving to product data
     * @throws {Error} If request fails
     */
    getById: async (id) => {
        try {
            const response = await api.get(`/api/products/${id}`);
            return response.data;
        } catch (error) {
            console.error(`Error fetching product ${id}:`, error);
            throw error;
        }
    },
    
    /**
     * Fetches all products in a specific category.
     * 
     * @param {number|string} categoryId - Category ID
     * @returns {Promise<Array>} Promise resolving to array of products
     * @throws {Error} If request fails
     */
    getByCategory: async (categoryId) => {
        try {
            console.log(`Fetching products for category ${categoryId}`);
            const response = await api.get(`/api/products/category/${categoryId}`);
            
            if (Array.isArray(response.data)) {
                console.log(`Successfully fetched ${response.data.length} products for category ${categoryId}`);
                return response.data;
            }
            
            console.warn("Unexpected response format:", response.data);
            return [];
        } catch (error) {
            console.error(`Error fetching products for category ${categoryId}:`, error);
            if (error.response) {
                console.error("Status:", error.response.status);
                console.error("Data:", error.response.data);
            }
            throw error;
        }
    },
    
    /**
     * Creates a new product.
     * 
     * @param {Object} product - Product data
     * @returns {Promise} Axios response with created product
     */
    create: (product) => api.post("/api/products", product),
    
    /**
     * Updates an existing product.
     * 
     * @param {number|string} id - Product ID
     * @param {Object} product - Updated product data
     * @returns {Promise} Axios response with updated product
     */
    update: (id, product) => api.put(`/api/products/${id}`, product),
    
    /**
     * Deletes a product.
     * 
     * @param {number|string} id - Product ID
     * @returns {Promise} Axios response
     */
    delete: (id) => api.delete(`/api/products/${id}`)
};

export default ProductService;