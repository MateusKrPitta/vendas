import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const criarSaidas = async (saidaData) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    if (!token) {
        CustomToast({ type: "error", message: "Autenticação necessária" });
        throw new Error("Autenticação necessária");
    }

    try {
        const response = await https.post('/saidas', {
            descricao: saidaData.descricao,
            valor: saidaData.valor,
            unidade_id: saidaData.unidade_id,
            forma_pagamento: saidaData.forma_pagamento
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        CustomToast({ 
            type: "success", 
            message: "Saída cadastrada com sucesso!" 
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.success || 
                           "Erro ao cadastrar venda";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};