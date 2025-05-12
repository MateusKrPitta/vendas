import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const buscarUnidades = async () => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    try {
        const response = await https.get('/unidades', {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        if (error.response) {
            const errorMessage = error.response.data.message;
            if (errorMessage === "Sua sessão expirou. Por favor, faça login novamente.") {
                // Limpa o localStorage antes de redirecionar
                localStorage.removeItem('user');
                localStorage.removeItem('unidadeId');
                localStorage.removeItem('unidadeStatus');
                
                CustomToast({ type: "error", message: errorMessage });
                
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