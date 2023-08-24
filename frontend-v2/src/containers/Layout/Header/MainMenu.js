import React from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'antd';

import {
  HOME_PAGE,
  LISTING_POSTS_PAGE,
  AGENT_PROFILE_PAGE,
  PRICING_PLAN_PAGE,
  LISTING_KEYPOINTS_PAGE,
} from 'settings/constant';

const MainMenu = ({ className }) => {
  return (
    <>
     <Menu className={className}>
      <Menu.Item key="0">
        <NavLink to={LISTING_POSTS_PAGE}>Sitios inclusivos</NavLink>
      </Menu.Item>
      <Menu.Item key="1">
        <NavLink to={LISTING_KEYPOINTS_PAGE}>Lugares clave</NavLink>
      </Menu.Item>
      {/* <Menu.Item key="2">
        <NavLink to={AGENT_PROFILE_PAGE}>Agent</NavLink>
      </Menu.Item>
      <Menu.Item key="3">
        <NavLink to={PRICING_PLAN_PAGE}>Pricing</NavLink>
      </Menu.Item> */}
    </Menu>
    </>
  );
};

export default MainMenu;
