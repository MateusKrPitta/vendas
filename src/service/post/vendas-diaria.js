import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const criarVendasDiaria = async (vendaData) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    if (!token) {
        CustomToast({ type: "error", message: "Autenticação necessária" });
        throw new Error("Autenticação necessária");
    }

    try {
        // Força o envio da data como string no formato ISO
        const payload = {
            ...vendaData,
        };

        const response = await https.post('/vendas-diaria', payload, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        
        CustomToast({ 
            type: "success", 
            message: "Venda cadastrada com sucesso!" 
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           "Erro ao cadastrar venda";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};