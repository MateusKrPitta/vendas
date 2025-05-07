
import httpsInstance from "../url";
import CustomToast from "../../components/toast";

export const deletarItemListaCompra = async (id) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    if (!token) {
        throw new Error("Autenticação necessária");
    }

    try {
        const response = await https.delete(`/lista-compras/${id}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Erro ao remover item";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};