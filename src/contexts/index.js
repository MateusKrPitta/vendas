import { createContext, useContext, useState, useEffect } from "react";
import { buscarUnidades } from "../service/get/unidade";

const UnidadeContext = createContext();

export const UnidadeProvider = ({ children }) => {
    const [unidadeId, setUnidadeId] = useState(() => {
        const unidadeLocal = localStorage.getItem("unidadeId");
        if (unidadeLocal) return unidadeLocal;
        
        const userData = JSON.parse(localStorage.getItem("user"));
        return userData?.unidades?.[0]?.id || null;
    });

    const [unidadeStatus, setUnidadeStatus] = useState(null);

    const buscarStatusUnidade = async (id) => {
        try {
            const response = await buscarUnidades();
            const unidade = response.find(u => u.id === id);
            return unidade?.ativo || false;
        } catch (error) {
            console.error('Erro ao buscar status da unidade:', error);
            return false;
        }
    };

    const atualizarUnidade = async (novoUnidadeId) => {
        const novoStatus = await buscarStatusUnidade(novoUnidadeId);
        
        setUnidadeId(novoUnidadeId);
        setUnidadeStatus(novoStatus);
        
        localStorage.setItem("unidadeId", novoUnidadeId);
        localStorage.setItem("unidadeStatus", novoStatus);
        
        const userData = JSON.parse(localStorage.getItem("user")) || {};
        userData.unidadeId = novoUnidadeId;
        userData.unidadeStatus = novoStatus;
        localStorage.setItem("user", JSON.stringify(userData));
    };
useEffect(() => {
    const loadInitialStatus = async () => {
        const userData = localStorage.getItem('user');
        if (!userData) return; // Se não há usuário logado, não faz a requisição

        if (unidadeId && !unidadeStatus) {
            const status = await buscarStatusUnidade(unidadeId);
            setUnidadeStatus(status);
        }
    };
    loadInitialStatus();
}, [unidadeId]);

    return (
        <UnidadeContext.Provider value={{ unidadeId, unidadeStatus, atualizarUnidade }}>
            {children}
        </UnidadeContext.Provider>
    );
};
export const useUnidade = () => {
    return useContext(UnidadeContext);
};