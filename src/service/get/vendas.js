import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const buscarVendas = async (data, unidadeId) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    try {
        const response = await https.get(`/vendas/dia?data=${data}&unidadeId=${unidadeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; 
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Erro ao buscar vendas";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};