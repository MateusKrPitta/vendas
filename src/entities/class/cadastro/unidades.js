export const cadastrosUnidades = (unidades = []) => {
  return unidades.map(unidade => ({
    id: unidade.id,
    nome: unidade.nome,
    ativo: unidade.ativo ? 'Ativo' : 'Inativo', 
  }));
};