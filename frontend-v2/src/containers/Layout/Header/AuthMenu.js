import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import useOnClickOutside from 'library/hooks/useOnClickOutside';

import { LOGIN_PAGE, REGISTRATION_PAGE } from 'settings/constant';

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
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setState(false)); // Incluyendo cuando clickea por fuera

  return (
    <Menu className={className}>
      <Menu.Item key="0">
        <NavLink to={LOGIN_PAGE}>Iniciar sesión</NavLink>
      </Menu.Item>

      <div className="avatar-dropdown" ref={dropdownRef}>
        <div onClick={handleDropdown}>
          Registrate
        </div>
        <Menu className={`dropdown-menu ${state ? 'active' : 'hide'}`}>
          <Menu.Item onClick={closeDropdown} key="1">
            <NavLink to={REGISTRATION_PAGE}>Usuario normal</NavLink>
          </Menu.Item>
          <Menu.Item onClick={closeDropdown} key="2">
            <NavLink to={REGISTRATION_PAGE}>Dueño de sitio</NavLink>
          </Menu.Item>
        </Menu>
      </div>

    </Menu>
  );
};

export default AuthMenu;
