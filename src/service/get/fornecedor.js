import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const buscarFornecedor = async () => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    try {
        const response = await https.get('/fornecedores', {
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