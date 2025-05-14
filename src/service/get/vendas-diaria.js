import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const buscarVendasPorUnidade = async (unidadeId) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    try {
        const response = await https.get(`/vendas/por-unidade`, {
            params: {  // Parâmetros GET (query string)
                unidadeId: unidadeId
            },
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; 
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Erro ao buscar vendas por unidade";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};