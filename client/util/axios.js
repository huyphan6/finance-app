import axios from 'axios'

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use(config => {
    config.baseURL = 'http://localhost:8080';
    return config;
});

export default axiosInstance;