import axios from "axios";

const API_URL = process.env.REACT_APP_BASE_API;

const httpsInstance = () => {
  const httpsAuthenticated = axios.create({
    baseURL: API_URL,
  });

  httpsAuthenticated.interceptors.request.use(
    (config) => {
      const storedUser = sessionStorage.getItem("user");
      if (storedUser) {
        try {
          const { token } = JSON.parse(storedUser);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        } catch (error) {
          console.error("Error parsing user data:", error);
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
