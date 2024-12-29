import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:8000',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add a request interceptor to dynamically include the token
axiosInstance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        // console.log('Token in localStorage:', token); // Debugging
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            // console.log('Authorization Header Set:', config.headers['Authorization']);
        } else {
            // console.log('No token found');
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default axiosInstance;
