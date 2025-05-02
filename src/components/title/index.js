import React from 'react';

const Title = ({ conteudo, fontSize, color, fontWeight }) => {
  const estiloTitulo = {
    fontSize: fontSize,
    color: color,
    fontWeight: fontWeight // Certifique-se de que esta propriedade esteja sendo aplicada corretamente no estilo
  };

  return <h1 style={estiloTitulo}>{conteudo}</h1>;
};

export default Title;
