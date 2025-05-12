import axios from "axios";

const API_URL = `https://api-vendas-4wre.onrender.com/`

const httpsInstance = () => {
    const httpsAuthenticated = axios.create({
        baseURL: API_URL,
        headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
        },
    });

    httpsAuthenticated.interceptors.request.use(
        (config) => {
            const storedUser = sessionStorage.getItem('user');
            if (storedUser) {
                const { token } = JSON.parse(storedUser);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            }
            return config;
        },
        (error) => {
            return Promise.reject(error);
        }
    );

    return httpsAuthenticated;
};

export default httpsInstance;