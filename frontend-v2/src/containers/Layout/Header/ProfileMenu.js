import React, { useContext, useState, useRef } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu } from 'antd';
import useOnClickOutside from 'library/hooks/useOnClickOutside';
import { AuthContext } from 'context/AuthProvider';
import {
  AGENT_PROFILE_PAGE,
  AGENT_ACCOUNT_SETTINGS_PAGE,
  ADD_SITE_PAGE,
} from 'settings/constant';

export default function ProfileMenu({ avatar }) {
  let navigate = useNavigate();
  const { logOut } = useContext(AuthContext);
  const [state, setState] = useState(false);
  const handleDropdown = () => {
    setState(!state);
  };
  const closeDropdown = () => {
    setState(false);
  };
  const dropdownRef = useRef(null);
  useOnClickOutside(dropdownRef, () => setState(false));
  function handleLogout() {
    logOut();
    // navigate('/', { replace: true });
  }

  return (
    <div className="avatar-dropdown" ref={dropdownRef}>
      <div className="dropdown-handler" onClick={handleDropdown}>
        {avatar}
      </div>
      <Menu className={`dropdown-menu ${state ? 'active' : 'hide'}`}>
        <Menu.Item onClick={closeDropdown} key="0">
          <NavLink to={AGENT_PROFILE_PAGE}>Ver perfil</NavLink>
        </Menu.Item>
        <Menu.Item onClick={closeDropdown} key="1">
          <NavLink to={ADD_SITE_PAGE}>Crear sitio</NavLink>
        </Menu.Item> 
        <Menu.Item onClick={closeDropdown} key="2">
          <NavLink to={AGENT_ACCOUNT_SETTINGS_PAGE}>Ajustes</NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <button onClick={handleLogout}>Cerrar sesión</button>
        </Menu.Item>
      </Menu>
    </div>
  );
}
