import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const buscarRelatorioVendas = async () => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    const unidadeId = userData ? JSON.parse(userData).unidadeId : null;

    if (!unidadeId) {
        throw new Error("ID da unidade não encontrado");
    }

    try {
        const response = await https.get(`/relatorios-mensais/unidade/${unidadeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            if (errorMessage === "Credenciais inválidas") {
                setTimeout(() => {
                    window.location.href = '/';
                }, 3000);
            } else {
                CustomToast({ type: "error", message: errorMessage });
            }
        } 
        throw error;
    }
};