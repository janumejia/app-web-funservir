import React, { useState, useEffect } from 'react';
import { Collapse } from 'antd';

const { Panel } = Collapse;

const longText = 'Texto muy largo...';

// Descripción:
// Esta componente es para reducir/ampliar el texto que se encuentra en la descripción de un sitio de interés,
// porque, al ser una cadena muy grande, puede cambiar dañar la proporción que se tiene de la tabla en la
// vista del usuario.

const ShortenedText = ({ text, maxLength, setShowFullText }) => {
  if (!text?.length || text.length <= maxLength) {
    return text;
  }
  const shortened = text.substr(0, maxLength) + '...';
  return (
    <div>
      {shortened}
      <br />
      <a onClick={() => setShowFullText(true)} >Mostrar más</a>
    </div>
  );
};

const FullText = ({ text, setShowFullText }) => (
  <div>
    {text}
    <br />
    <a onClick={() => setShowFullText(false)} >Mostrar menos</a>
  </div>
);

const ExpandableText = ({ text, maxLength }) => {
  const [showFullText, setShowFullText] = useState(false);

  return (
    <div>
      {showFullText ?
        <FullText text={text} setShowFullText={setShowFullText} />
        :
        <ShortenedText text={text} maxLength={maxLength} setShowFullText={setShowFullText} />
      }
    </div>
  );
};

export default ExpandableText;