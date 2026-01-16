import axios from 'axios';

// Phase 1.4.2: Real API Integration
// We use a robust client setup with timeouts and error handling
const apiClient = axios.create({
    // Fallback to localhost if env var is missing
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    timeout: 10000, // 10s timeout (AI can be slow on CPU)
    headers: {
        'Content-Type': 'application/json',
    },
});
// REQUEST INTERCEPTOR (The Courier)
apiClient.interceptors.request.use(
    (config) => {
        // dynamically import store to avoid circular dependencies or initialization issues
        // We access localStorage directly for speed and simplicity in the interceptor
        // (Zustand persists to 'auth-storage' in localStorage)
        const storageData = localStorage.getItem('auth-storage');

        if (storageData) {
            const parsed = JSON.parse(storageData);
            const token = parsed.state?.token;

            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR (Optional: Handle 401s automatically)
apiClient.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid -> Force logout logic could go here
            console.warn("Unauthorized! Token might be expired.");
        }
        return Promise.reject(error);
    }
);
export default apiClient;