import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const atualizarUnidade = async (nome, id) => {
  const https = httpsInstance();
  const userData = localStorage.getItem('user');
  const token = userData ? JSON.parse(userData).token : null;

  try {
    const response = await https.put(
      `/unidades/${id}`,
      { nome },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.errors || error.response?.data?.success || 'Erro ao atualizar unidade!';
    CustomToast({ type: "error", message: errorMessage });
    throw error;
  }
};