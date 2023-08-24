import React, { useState, useContext } from 'react';
import { useLocation } from 'react-router-dom';
import Sticky from 'react-stickynode';
import { IoIosClose } from 'react-icons/io';
import { Button, Drawer } from 'antd';
import Logo from 'components/UI/Logo/Logo';
import Text from 'components/UI/Text/Text';
import TextLink from 'components/UI/TextLink/TextLink';
import Navbar from 'components/Navbar/Navbar';
import { AuthContext } from 'context/AuthProvider';
import { LayoutContext } from 'context/LayoutProvider';
import useWindowSize from 'library/hooks/useWindowSize';
import { AGENT_PROFILE_PAGE } from 'settings/constant';
import AuthMenu from './AuthMenu';
import MainMenu from './MainMenu';
import MobileMenu from './MobileMenu';
import ProfileMenu from './ProfileMenu';
import NavbarSearch from './NavbarSearch';
import HeaderWrapper, {
  MobileNavbar,
  CloseDrawer,
  AvatarWrapper,
  AvatarImage,
  AvatarInfo,
  LogoArea,
} from './Header.style';

const LogoIcon = () => (
  <svg width="25" height="27.984" viewBox="0 0 25 27.984">
    <g transform="translate(0 0)">
      <path
        d="M25.45,2.767a34.5,34.5,0,0,0-4,1.143,35.262,35.262,0,0,0-3.771,1.545,26.069,26.069,0,0,0-3.179,1.8,26.068,26.068,0,0,0-3.191-1.8A35.262,35.262,0,0,0,7.54,3.909,34.5,34.5,0,0,0,3.55,2.767L2,2.45V17.94a12.5,12.5,0,1,0,25,0V2.45ZM14.5,10.492c2.339,1.96,3.522,4.19,3.512,6.608a3.512,3.512,0,1,1-7.024,0h0C10.98,14.66,12.162,12.442,14.5,10.492Zm9.913,7.448a9.915,9.915,0,0,1-19.831,0V5.69a31.8,31.8,0,0,1,7.748,3.259,13.43,13.43,0,0,0-2.344,2.737A9.929,9.929,0,0,0,8.4,17.095a6.1,6.1,0,1,0,12.2,0,9.932,9.932,0,0,0-1.587-5.412,13.427,13.427,0,0,0-2.346-2.742,29.737,29.737,0,0,1,5.586-2.577c.819-.284,1.559-.51,2.158-.675Z"
        transform="translate(-2 -2.45)"
        fill="#fff"
      />
    </g>
  </svg>
);

export default function Header() {
  let location = useLocation();
  const [{ searchVisibility }] = useContext(LayoutContext);
  const { loggedIn, user } = useContext(AuthContext); // Agregamos si está logueado y la info del usuario
  const { width } = useWindowSize();
  const [state, setState] = useState(false);
  const sidebarHandler = () => {
    setState(!state);
  };
  const headerType = location.pathname === '/' ? 'transparent' : 'default';
  
  let avatarImg = '';
  let userName = '';

  if(user){
    avatarImg = user.profilePicture; // Traemos el link del avatar de usuario de nuestra variable global
    userName = user.name; // Traemos el nombre del usuario de nuestra variable global
  }

  return (
    <HeaderWrapper>
      <Sticky
        top={headerType === 'transparent' ? -1 : 0}
        innerZ={2}
        activeClass="isHeaderSticky"
      >
        {width > 991 ? (
          <Navbar
            logo={
              <>
                {/* {headerType === 'transparent' && <LogoIcon />} */}
                <Logo
                  withLink
                  linkTo="/"
                  src="/images/logo-funservir.png"
                  title="Funservir"
                />
              </>
            }
            navMenu={ <MainMenu />}
            authMenu={<AuthMenu avatar={<Logo src='https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80' />} />}
            isLogin={loggedIn}
            avatar={<Logo src={avatarImg} />}
            profileMenu={<ProfileMenu avatar={<Logo src={avatarImg} />} />}
            headerType={headerType}
            searchComponent={ (location.pathname !== '/sign-up-user' && location.pathname !== '/sign-up-owner' ) && <NavbarSearch />}
            location={location}
            searchVisibility={searchVisibility}
          />
        ) : (
          <MobileNavbar className={headerType}>
            <LogoArea>
              <>
                {/* {headerType === 'transparent' && <LogoIcon />} */}
                <Logo
                  withLink
                  linkTo="/"
                  src="/images/logo-funservir.png"
                  title="Funservir"
                />
              </>
              <NavbarSearch />
            </LogoArea>
            <Button
              className={`hamburg-btn ${state ? 'active' : ''}`}
              onClick={sidebarHandler}
            >
              <span />
              <span />
              <span />
            </Button>
            <Drawer
              placement="right"
              closable={false}
              onClose={sidebarHandler}
              width="285px"
              className="mobile-header"
              visible={state}
            >
              <CloseDrawer>
                <button onClick={sidebarHandler}>
                  <IoIosClose />
                </button>
              </CloseDrawer>
              {loggedIn ? (
                <AvatarWrapper>
                  <AvatarImage>
                    <Logo src={avatarImg} />
                  </AvatarImage>
                  <AvatarInfo>
                    <Text as="h3" content={userName} />
                    <TextLink
                      link={`profile/${user._id}`}
                      content="Ver perfil"
                    />
                  </AvatarInfo>
                </AvatarWrapper>
              ) : (
                <AuthMenu className="auth-menu" />
              )}
              <MobileMenu className="main-menu" />
            </Drawer>
          </MobileNavbar>
        )}
      </Sticky>
    </HeaderWrapper>
  );
}
