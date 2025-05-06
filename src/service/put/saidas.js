import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const atualizarSaidas = async (id, descricao, valor, forma_pagamento, unidade_id) => { // Mantenha como forma_pagamento
  const https = httpsInstance();
  const userData = localStorage.getItem('user');
  const token = userData ? JSON.parse(userData).token : null;

  try {
    const response = await https.put(
      `/saidas/${id}`,
      { 
        descricao, 
        valor: Number(valor),
        forma_pagamento: Number(forma_pagamento),
        unidade_id
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data) {
      CustomToast({ type: "success", message: "Saída atualizada com sucesso!" });
    }
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.errors || error.response?.data?.message || 'Erro ao atualizar saída!';
    CustomToast({ type: "error", message: errorMessage });
    throw error;
  }
};