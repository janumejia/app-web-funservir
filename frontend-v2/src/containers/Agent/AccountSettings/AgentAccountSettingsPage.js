import React, { useContext } from 'react';
import { Outlet, NavLink, Link } from 'react-router-dom';
import { Row, Col, Menu, Avatar, message } from 'antd';
import Container from 'components/UI/Container/Container.style';
import {
  AGENT_PROFILE_PAGE,
  AGENT_IMAGE_EDIT_PAGE,
  AGENT_PASSWORD_CHANGE_PAGE,
  AGENT_ACCOUNT_SETTINGS_PAGE,
} from 'settings/constant';
import AccountSettingWrapper, {
  AccountSidebar,
  AgentAvatar,
  SidebarMenuWrapper,
  ContentWrapper,
  AgentName,
  FromWrapper,
} from './AccountSettings.style';
import { AuthContext } from 'context/AuthProvider';

function AccountSettingNavLink() {
  
  return (
    <SidebarMenuWrapper>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
      >
        <Menu.Item key="1">
          <NavLink to={AGENT_ACCOUNT_SETTINGS_PAGE}>Editar Perfil</NavLink>
        </Menu.Item>
        <Menu.Item key="2">
          <NavLink to={AGENT_IMAGE_EDIT_PAGE}>Cambiar Fotos</NavLink>
        </Menu.Item>
        <Menu.Item key="3">
          <NavLink to={AGENT_PASSWORD_CHANGE_PAGE}>Cambiar Contraseña</NavLink>
        </Menu.Item>
      </Menu>
    </SidebarMenuWrapper>
  );
}

export default function AgentAccountSettingsPage() {

  const { user } = useContext(AuthContext);

  return (
    <AccountSettingWrapper>
      <Container fullWidth={true}>
        <Row gutter={30}>
          <Col md={9} lg={6}>
            <AccountSidebar>
              <AgentAvatar>
                <Avatar
                  src={user && user.profilePicture}
                  alt="avatar"
                />
                <ContentWrapper>
                  <AgentName>{user && user.name} {user && user.lastName}</AgentName>
                  <Link to={AGENT_PROFILE_PAGE}>Ver perfil</Link>
                </ContentWrapper>
              </AgentAvatar>
              <AccountSettingNavLink />
            </AccountSidebar>
          </Col>
          <Col md={15} lg={18}>
            <FromWrapper>
              <Outlet />
            </FromWrapper>
          </Col>
        </Row>
      </Container>
    </AccountSettingWrapper>
  );
}
