export const cadastrosUsuarios = (usuarios = []) => {
    return usuarios.map(usuario => ({
      nome: usuario.nome,
      email: usuario.email,
      ativo: usuario.ativo ? 'Ativo' : 'Inativo', 
    }));
  };