import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const criarListaCompra = async (produto, quantidade, unidadeId) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    if (!token) {
        console.error("Token não encontrado");
        throw new Error("Autenticação necessária");
    }

    try {
        const response = await https.post('/lista-compras', {
            produto, 
            quantidade,
            unidadeId
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Erro ao cadastrar item na lista";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};