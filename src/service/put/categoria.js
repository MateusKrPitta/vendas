import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const atualizarCategoria = async (nome, unidade_id, id) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;

    try {
        const response = await https.put(
            `/categorias/${id}`, 
            { nome, unidade_id },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );
        CustomToast({ 
            type: "success", 
            message: response.data.message 
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message ;
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};