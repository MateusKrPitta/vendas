import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const criarVendas = async (vendaData, limparCampos) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    if (!token) {
        CustomToast({ type: "error", message: "Autenticação necessária" });
        throw new Error("Autenticação necessária");
    }

    try {
        const response = await https.post('/vendas', vendaData, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        CustomToast({ 
            type: "success", 
            message: "Venda cadastrada com sucesso!" 
        });


        if (limparCampos && typeof limparCampos === 'function') {
            limparCampos();
        }

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || 
                           error.response?.data?.success || 
                           "Erro ao cadastrar venda";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};