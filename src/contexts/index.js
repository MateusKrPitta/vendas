import { createContext, useContext, useState, useEffect } from "react";

const UnidadeContext = createContext();

export const UnidadeProvider = ({ children }) => {
    const [unidadeId, setUnidadeId] = useState(() => {

        const unidadeLocal = localStorage.getItem("unidadeId");
        if (unidadeLocal) return unidadeLocal;
        
        const userData = JSON.parse(localStorage.getItem("user"));
        return userData?.unidadeId || null;
    });

    const atualizarUnidade = (novoUnidadeId) => {
        setUnidadeId(novoUnidadeId);
        
      
        localStorage.setItem("unidadeId", novoUnidadeId);
        
        const userData = JSON.parse(localStorage.getItem("user")) || {};
        userData.unidadeId = novoUnidadeId;
        localStorage.setItem("user", JSON.stringify(userData));
    };

    return (
        <UnidadeContext.Provider value={{ unidadeId, atualizarUnidade }}>
            {children}
        </UnidadeContext.Provider>
    );
};
export const useUnidade = () => {
    return useContext(UnidadeContext);
};