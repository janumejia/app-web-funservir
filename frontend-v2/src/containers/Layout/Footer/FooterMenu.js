import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';

import {
  HOME_PAGE,
  LISTING_POSTS_PAGE,
  PRIVACY_PAGE,
  PRICING_PLAN_PAGE,
  AGENT_PROFILE_PAGE,
} from 'settings/constant';

const FooterMenu = () => {
  return (
    <Menu>
      {/* <Menu.Item key="0">
        <NavLink to={`${PRIVACY_PAGE}`}>Ver sitios</NavLink>
      </Menu.Item> */}
      <Menu.Item key="1">
        <NavLink to={`${PRIVACY_PAGE}`}>Quiénes somos</NavLink>
      </Menu.Item>
      <Menu.Item key="2">
        <NavLink to={`${PRIVACY_PAGE}`}>Privacidad</NavLink>
      </Menu.Item>
      <Menu.Item key="3">
        <NavLink to={`${PRIVACY_PAGE}`}>Contáctenos</NavLink>
      </Menu.Item>
    </Menu>
  );
};

export default FooterMenu;
