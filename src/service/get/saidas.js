import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const buscarSaidas = async () => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    try {
        const response = await https.get(`/saidas`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; 
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Erro ao buscar saídas";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};