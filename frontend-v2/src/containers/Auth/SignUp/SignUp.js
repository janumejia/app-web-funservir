import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import Logo from 'components/UI/Logo/Logo';
import { LOGIN_PAGE, REGISTRATION_SITE_OWNER_PAGE } from 'settings/constant';
import SignUpForm from './SignUpForm';
import AgentCreateOrUpdateForm from '../SignUpPart2/AgentCreateOrUpdateForm';
import AgentAccountSettingsPage from '../SignUpPart2/AgentAccountSettingsPage'
import SocialLogin from '../SocialLogin';
import Wrapper, {
  Title,
  TitleInfo,
  Text,
  FormWrapper,
  BannerWrapper,
} from '../Auth.style';

const SignUp = () => {

  // Para cambiar a la segunda página de registro
  const [isPart2, setIsPart2] = useState(false);

  // La información que diligencia el usuario
  const [dataUser, setDataUser] = useState();

  if (!isPart2) {
    return (
      <Wrapper>
        <FormWrapper>
          <Logo
            withLink
            linkTo="/"
            src="/images/logo-alt.svg"
            title="Funservir"
          />
          <Title>Registro de usuario</Title>
          <TitleInfo>Ingresa tus datos para registrarte</TitleInfo>
          <SignUpForm setIsPart2={setIsPart2} setDataUser={setDataUser} />
          {/* Descomentar para habilitar los botones de registrarse con Facebook, Github, Firebase o Google+ */}
          {/* <Divider>O regístrate con</Divider>
          <SocialLogin /> */}
          <Text>
            ¿Ya tienes cuenta?&nbsp;
            <Link to={LOGIN_PAGE}>Inicia sesión</Link>
            <br />
            ¿Eres dueño de un sitio?&nbsp;
            <Link to={REGISTRATION_SITE_OWNER_PAGE}>Registro dueño de sitio</Link>
          </Text>
          <Text>
          </Text>
        </FormWrapper>
        <BannerWrapper>
          <img src="/images/login-page-bg.jpg" alt="Imagen página autenticación" />
        </BannerWrapper>
      </Wrapper>
    );
  } else {
    return (
        <AgentCreateOrUpdateForm dataUser={dataUser} />
    )
  }
};

export default SignUp;
