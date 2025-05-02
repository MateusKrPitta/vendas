import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const login = async (email, senha) => {
    const https = httpsInstance();
    try {
        const response = await https.post('/login', {
            email,
            password: senha 
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.errors
            ? (typeof error.response.data.errors === 'string' 
                ? error.response.data.errors 
                : Object.values(error.response.data.errors).join(', '))
            : error.response?.data?.message || 'Erro desconhecido';
        
        CustomToast.error(errorMessage);
        throw error; 
    }
};