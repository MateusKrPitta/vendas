import CustomToast from "../../components/toast";
import httpsInstance from "../url";

export const atualizarUsuario = async (id, fullName, email, unidadeId, tipo, password = null) => {
  const https = httpsInstance();
  const userData = localStorage.getItem('user');
  const token = userData ? JSON.parse(userData).token : null;


  const requestData = { 
    fullName, 
    email, 
    unidadeId, 
    tipo 
  };


  if (password) {
    requestData.password = password;
  }

  try {
    const response = await https.put(
      `/usuarios/${id}`,
      requestData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    CustomToast({ type: "success", message: "Usuário atualizado com sucesso!" });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 
                        error.response?.data?.errors || 
                        'Erro ao atualizar usuário!';
    CustomToast({ type: "error", message: errorMessage });
    throw error;
  }
};