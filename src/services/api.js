import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});


api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            console.error('401 Unauthorized - Token expired');
            localStorage.removeItem('token');
            window.location.reload();
        }
        return Promise.reject(error);
    }
);

export const login = async (email, password) => {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
};

export const register = async (email, password) => {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
};

// Productsl
export const getProduct = async (id) => {
    const response = await api.get(`/product/${id}`);
    return response.data;
};

export const createProduct = async (categoryId) => {
    const response = await api.post('/product/create', { categoryId });
    return response.data;
};

export const addProductDetails = async (id, details) => {
    const response = await api.post(`/product/${id}/details`, details);
    return response.data;
};

export const activateProduct = async (id) => {
    const response = await api.post(`/product/${id}/activate`);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await api.delete(`/product/${id}`);
    return response.data;
};

// Inventory
export const getInventory = async (productId) => {
    const response = await api.get(`/inventory/product/${productId}`);
    return response.data;
};

export default api;