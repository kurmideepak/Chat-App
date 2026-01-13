import axios from 'axios';

export const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export const httpClient = axios.create({
    baseURL: baseURL,
});

httpClient.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            console.error("Unauthorized access");
        }
        return Promise.reject(error);
    }
);