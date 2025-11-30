import axios from "axios";

/**
 * Axios instance configuration for API requests.
 * 
 * In development, uses proxy (defined in package.json) to avoid CORS issues.
 * In production, uses REACT_APP_API_URL environment variable or defaults to localhost:8081.
 */
const baseURL = process.env.NODE_ENV === 'production' 
    ? process.env.REACT_APP_API_URL || "http://localhost:8081"
    : ""; // Empty string uses the proxy in development

/**
 * Configured axios instance with base URL and default headers.
 */
const api = axios.create({
    baseURL: baseURL,
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    }
});

/**
 * Request interceptor that adds JWT token to all API requests.
 * Automatically attaches Authorization header with Bearer token if available.
 */
api.interceptors.request.use(
    (config) => {
        // Add JWT token if available
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
            console.log('🔑 JWT Token added to request:', token.substring(0, 20) + '...');
        } else {
            console.warn('⚠️ No JWT token found in localStorage');
        }
        console.log('API Request:', config.method?.toUpperCase(), config.url, 'Headers:', config.headers);
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

/**
 * Response interceptor for error handling and debugging.
 * Handles 401 Unauthorized errors by clearing token and redirecting to login.
 */
api.interceptors.response.use(
    (response) => {
        console.log('API Response:', response.status, response.config.url);
        return response;
    },
    (error) => {
        console.error('API Error:', error.response?.status, error.config?.url, error.message);
        
        // Handle 401 Unauthorized - clear token and redirect to login
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            if (window.location.pathname !== '/login' && window.location.pathname !== '/register') {
                window.location.href = '/login';
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
