import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const atualizarCategoria = async (nome, unidade_id, id) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;

    try {
        const response = await https.put(
            `/categorias/${id}`, // Certifique-se que a rota está correta
            { nome, unidade_id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || error.response?.data?.errors || 'Erro ao atualizar categoria!';
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};