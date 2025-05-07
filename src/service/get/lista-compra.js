import httpsInstance from "../url";

export const buscarListaCompra = async (unidadeId) => {
    const https = httpsInstance();
    const userData = localStorage.getItem('user');
    const token = userData ? JSON.parse(userData).token : null;
    
    if (!token) {
        throw new Error("Autenticação necessária");
    }

    try {
        const response = await https.get(`/lista-compras?unidadeId=${unidadeId}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};