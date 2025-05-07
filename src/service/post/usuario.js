import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const criarUsuario = async (fullName, email, password, unidadesIds, tipo) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    if (!token) {
        console.error("Token não encontrado");
        throw new Error("Autenticação necessária");
    }

    try {
        const response = await https.post('/usuarios', {
            fullName, 
            email, 
            password, 
            unidadesIds, 
            tipo,
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.message || "Erro ao cadastrar usuário";
        CustomToast({ type: "error", message: errorMessage });
        throw error;
    }
};