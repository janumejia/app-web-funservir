import React, { useContext, Fragment, useEffect } from 'react';
import { Outlet, NavLink, Link, useLocation } from 'react-router-dom';
import isEmpty from 'lodash/isEmpty';
import {
  IoLogoTwitter,
  IoLogoFacebook,
  IoLogoInstagram,
  IoIosAdd,
} from 'react-icons/io';
import { Menu, Popover } from 'antd';
import Container from 'components/UI/Container/Container';
import Image from 'components/UI/Image/Image';
import Heading from 'components/UI/Heading/Heading';
import Text from 'components/UI/Text/Text';
import Loader from 'components/Loader/Loader';
import AuthProvider, { AuthContext } from 'context/AuthProvider';
import useDataApi from 'library/hooks/useDataApi';
import {
  ADD_SITE_PAGE,
  AGENT_PROFILE_PAGE,
  AGENT_PROFILE_FAVORITE,
  AGENT_PROFILE_CONTACT,
} from 'settings/constant';
import NotFoundWrapper, { ContentWrapper } from './NoData.style';

import AgentDetailsPage, {
  BannerSection,
  UserInfoArea,
  ProfileImage,
  CircleProfileImage,
  ProfileInformationArea,
  ProfileInformation,
  SocialAccount,
  NavigationArea,
} from './AgentDetails.style';

import { useParams } from 'react-router-dom';
import axios from 'axios';
import TextLink from 'components/UI/TextLink/TextLink';

const ProfileNavigation = (props) => {
  let location = useLocation();
  const { path, className } = props;
  const { loggedIn, user, profileData } = useContext(AuthContext);

  return (
    <NavigationArea>
      <Container fluid={true}>
        <Menu className={className}>
          <Menu.Item
            className={/^\/profile\/[0-9a-fA-F]{24}$/.test(location.pathname) && 'ant-menu-item-selected'}
            key="0"
          >
            <NavLink to={`/profile/${profileData._id}`}>Sitios inclusivos</NavLink>
          </Menu.Item>
          {props._id === user._id && loggedIn && (
            <Menu.Item
              className={/^\/profile\/[0-9a-fA-F]{24}\/favorites$/.test(location.pathname) && 'ant-menu-item-selected'}
              key="1"
            >
              <NavLink to={AGENT_PROFILE_FAVORITE}>Favoritos</NavLink>
            </Menu.Item>
          )}
          {/* <Menu.Item key="2">
            <NavLink to={AGENT_PROFILE_CONTACT}>Contacto</NavLink>
          </Menu.Item> */}
        </Menu>
        {props._id === user._id && loggedIn && (
          <Link className="add_card" to={ADD_SITE_PAGE}>
            <IoIosAdd /> Crear sitio
          </Link>
        )}
      </Container>
    </NavigationArea>
  );
};

const AgentProfileInfo = (props) => {
  const { data, loading } = useDataApi('/data/agent.json');
  const { user, loggedIn, setProfileData, profileData } = useContext(AuthContext);

  useEffect(() => {

    async function profileData() {
      try {

        const res = await axios.get(`${process.env.REACT_APP_HOST_BACK}/profile/${props._id}`);
        if (res) {
          setProfileData(res.data)
        }
      } catch (e) {
        // setProfileData(res.data)
        // console.log(e)
      }
    }
    profileData();
  }, [setProfileData, props._id])


  if (isEmpty(user) || isEmpty(profileData) || loading) return <Loader />;
  // const {
  //   first_name,
  //   last_name,
  //   content,
  //   profile_pic,
  //   cover_pic,
  //   social_profile,
  // } = data[0];


  const username = `${profileData.name} ${profileData.lastName}`;

  return (
    <Fragment>
      <BannerSection>
        <Image className="absolute" src={profileData.coverPicture} alt="" />
      </BannerSection>
      <UserInfoArea>
        <Container fluid={true}>
          <CircleProfileImage>
            <Image src={profileData.profilePicture} alt="Profile" />
          </CircleProfileImage>
          <ProfileInformationArea>
            <ProfileInformation>
              <Heading content={username} />
              <Text content={(profileData.describeYourself) ? profileData.describeYourself : "¡Hola, estoy usando la plataforma de Funservir!"} />
            </ProfileInformation>
            <SocialAccount>
              {(profileData.socialTwitter) ?
                <Popover content="Ir a Twitter">
                  <a
                    href={profileData.socialTwitter}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoLogoTwitter className="twitter" />
                  </a>
                </Popover> :
                <Popover content="Cuenta de Twitter sin configurar">
                  <IoLogoTwitter className="socialNotDefined" />
                </Popover>
              }
              {(profileData.socialFacebook) ?
                <Popover content="Facebook">
                  <a
                    href={profileData.socialFacebook}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoLogoFacebook className="facebook" />
                  </a>
                </Popover> :
                <Popover content="Cuenta de Facebook sin configurar">
                  <IoLogoFacebook className="socialNotDefined" />
                </Popover>
              }
              {(profileData.socialInstagram) ?
                <Popover content="Instagram">
                  <a
                    href={profileData.socialInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IoLogoInstagram className="instagram" />
                  </a>
                </Popover> :
                <Popover content="Cuenta de Instagram sin configurar">
                  <IoLogoInstagram className="socialNotDefined" />
                </Popover>
              }
            </SocialAccount>
          </ProfileInformationArea>
        </Container>
      </UserInfoArea>
    </Fragment>
  );
};

export default function AgentDetailsViewPage(props) {
  const { userId } = useParams();
  const { loggedIn } = useContext(AuthContext);

  return (
    <AgentDetailsPage>
      {loggedIn ?
        <AuthProvider>
          < AgentProfileInfo _id={userId} />
          <ProfileNavigation path={AGENT_PROFILE_PAGE} _id={userId} {...props} />
          <Container fluid={true}>
            <Outlet />
          </Container>
        </AuthProvider>
        :
        <NotFoundWrapper>
          <ContentWrapper>
            <Image src="/images/403-forbidden.svg" alt="404" />
            <Heading as="h2" content="Debes iniciar sesión primero" />
            <TextLink link="/" content="Volver" />
          </ContentWrapper>
        </NotFoundWrapper>
      }
    </AgentDetailsPage>
  );
}
