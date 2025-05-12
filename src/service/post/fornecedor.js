import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const criarFornecedor = async (nome, telefone, observacao) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    if (!token) {
        console.error("Token não encontrado");
        throw new Error("Autenticação necessária");
    }

    try {
        const response = await https.post('/fornecedores', {
            nome, telefone, observacao
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        CustomToast({ 
            type: "success", 
            message: response.data.message 
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data?.success || "Erro ao cadastrar unidade";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};
