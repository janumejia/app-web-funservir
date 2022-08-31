import React from 'react';
import Logo from 'components/UI/Logo/Logo';
import Footers from 'components/Footer/Footer';
import FooterMenu from './FooterMenu';

// DESCRIPCIÓN:
// Uso de los 2 componentes hijos (Componente de logo, y de menu de opciones) que componen el footer de la página
const Footer = () => {
  return (
    <Footers
      logo={
        <Logo
          withLink
          linkTo="/"
          src="/images/logo-funservir.png"
          title="Funservir"
        />
      }
      menu={<FooterMenu />}
      copyright={`Derechos de autor @ Funservir ${new Date().getFullYear()}`}
    />
  );
};

export default Footer;
