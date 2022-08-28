import React, { useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import useOnClickOutside from 'library/hooks/useOnClickOutside';

import { LOGIN_PAGE, REGISTRATION_PAGE, REGISTRATION_SITE_OWNER_PAGE } from 'settings/constant';

const AuthMenu = ({ className, avatar }) => {
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
    <div className="right-side">
      <div className="sign-in-button">
        <Menu className={className}>
          <Menu.Item key="0">
            <NavLink to={LOGIN_PAGE}>Iniciar sesión</NavLink>
          </Menu.Item>
          <Menu.Item onClick={closeDropdown} key="1">
            <NavLink to={REGISTRATION_PAGE}>Registro normal</NavLink>
          </Menu.Item>
          {/* <Menu.Item onClick={closeDropdown} key="2">
          <NavLink to={REGISTRATION_SITE_OWNER_PAGE}>Dueño de sitio</NavLink>
        </Menu.Item> */}
        </Menu>
      </div>
      <div className="sign-up-button">
        <div className="avatar-dropdown" ref={dropdownRef}>
          <div className="dropdown-handler" onClick={handleDropdown}>
            {avatar}
          </div>
          <Menu className={`dropdown-menu ${state ? 'active' : 'hide'}`}>
            <Menu.Item onClick={closeDropdown} key="0">
              <NavLink to={LOGIN_PAGE}>Registro normal</NavLink>
            </Menu.Item>
            {/* <Menu.Item onClick={closeDropdown} key="1">
          <NavLink to={ADD_HOTEL_PAGE}>Add Hotel</NavLink>
        </Menu.Item> */}
            <Menu.Item onClick={closeDropdown} key="2">
              <NavLink to={LOGIN_PAGE}>Dueño de sitio</NavLink>
            </Menu.Item>
          </Menu>
        </div>
      </div>
    </div>
  );
};

export default AuthMenu;
