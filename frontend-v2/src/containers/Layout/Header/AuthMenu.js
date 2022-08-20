import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import useOnClickOutside from 'library/hooks/useOnClickOutside';

import { LOGIN_PAGE, REGISTRATION_PAGE, REGISTRATION_SITE_OWNER_PAGE } from 'settings/constant';

const AuthMenu = ({ className }) => {
  // Para aparecer y ocultar las opciones del botón de registrarse
  const [state, setState] = useState(false);

  // Aparecer
  const handleDropdown = () => {
    setState(!state);
  };

  //Desaparecer
  const closeDropdown = () => {
    setState(false);
  };
  const dropdownRef = useRef(null); // El useRef es para acceder al valor de alguna etiqueta/componente de react. Es como si en el HTML tuviera un elemento con un id y quiera acceder a su valor por medio de él. 
  useOnClickOutside(dropdownRef, () => setState(false)); // Incluyendo cuando clickea por fuera

  // Lo de abajo también lo modificó Julián
  return (
    <Menu className={className}>
      <Menu.Item key="0">
        <NavLink to={LOGIN_PAGE}>Iniciar sesión</NavLink>
      </Menu.Item>
      <Menu.Item onClick={closeDropdown} key="1">
        <NavLink to={REGISTRATION_PAGE}>Registrato normal</NavLink>
      </Menu.Item>
      <Menu.Item onClick={closeDropdown} key="2">
        <NavLink to={REGISTRATION_SITE_OWNER_PAGE}>Dueño de sitio</NavLink>
      </Menu.Item>
    </Menu>
  );
};

export default AuthMenu;
