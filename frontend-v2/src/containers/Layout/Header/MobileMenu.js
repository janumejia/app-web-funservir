import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';
import { AuthContext } from 'context/AuthProvider';
import {
  HOME_PAGE,
  LISTING_POSTS_PAGE,
  PRICING_PLAN_PAGE,
  AGENT_ACCOUNT_SETTINGS_PAGE,
  ADD_KEY_POINT_PAGE,
  ADD_SITE_PAGE,
} from 'settings/constant';

const MobileMenu = ({ className }) => {
  // auth context
  const { loggedIn, logOut } = useContext(AuthContext);

  return (
    <Menu className={className}>
      <Menu.Item key="0">
        <NavLink to={HOME_PAGE}>Principal</NavLink>
      </Menu.Item>
      <Menu.Item key="1">
        <NavLink to={LISTING_POSTS_PAGE}>Ver sitios</NavLink>
      </Menu.Item>
      {loggedIn && (
        <>
          <Menu.Item key="2">
            <NavLink to={ADD_KEY_POINT_PAGE}>Crear lugar clave</NavLink>
          </Menu.Item>
          <Menu.Item key="3">
            <NavLink to={ADD_SITE_PAGE}>Crear sitio inclusivo</NavLink>
          </Menu.Item>
          <Menu.Item key="4">
            <NavLink to={AGENT_ACCOUNT_SETTINGS_PAGE}>Ajustes</NavLink>
          </Menu.Item>
        </>
      )}
      {loggedIn && (
        <Menu.Item key="5">
          <button onClick={logOut}>Cerrar sesión</button>
        </Menu.Item>
      )}
    </Menu>
  );
};

export default MobileMenu;
