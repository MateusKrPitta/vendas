import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const atualizarVendas = async (
    id,
    nome,
    quantidade,
    valor,
    forma_pagamento,
    unidade_id,
    categoria_id,
    data_venda
) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    try {
        const response = await https.put(`/vendas/${id}`, {
            nome,
            quantidade,
            valor,
            forma_pagamento,
            unidade_id,
            categoria_id,
            data_venda
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Erro ao atualizar venda";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};