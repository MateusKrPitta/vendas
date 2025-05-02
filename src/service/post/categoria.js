import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const criarCategoria = async (nome, unidade_id) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    if (!token) {
        console.error("Token não encontrado");
        throw new Error("Autenticação necessária");
    }

    try {
        const response = await https.post('/categorias', 
            { nome, unidade_id }, // Objeto direto aqui
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "application/json",
                },
            }
        );

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Erro ao cadastrar categoria";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};