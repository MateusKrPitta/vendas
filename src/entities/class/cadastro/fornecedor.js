export const cadastrosFornecedores = (fornecedores = []) => {
    return fornecedores.map(fornecedor => ({
        id: fornecedor.id,
        nome: fornecedor.nome,
        telefone: fornecedor.telefone,
    }));
};