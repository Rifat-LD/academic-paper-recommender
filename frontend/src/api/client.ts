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

export default apiClient;