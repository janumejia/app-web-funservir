import React from 'react';
import { Link } from 'react-router-dom'; // Importa el componente "Link" del módulo "react-router-dom" para crear enlaces en la aplicación
import { Divider } from 'antd'; // Importa el componente "Divider" del módulo "antd" para crear una línea divisoria en la página
import Logo from 'components/UI/Logo/Logo';
import { REGISTRATION_PAGE } from 'settings/constant';
import SignInForm from './SignInForm';
import SocialLogin from '../SocialLogin';
import Wrapper, {
  Title,
  TitleInfo,
  Text,
  FormWrapper,
  BannerWrapper,
} from '../Auth.style';

// DESCRIPCIÓN:
// Componente para la página de inicio de sesión. 

const SignIn = () => {
  return (
    <Wrapper>
      <FormWrapper> {/* Contenedor del formulario de inicio de sesión y otros elementos */}
        <Logo
          withLink
          linkTo="/"
          src="/images/logo-funservir.png"
          title="Funservir"
        />
        <Title>Inicio de sesión</Title>
        <TitleInfo>Por favor, ingrese a su cuenta</TitleInfo>
        <SignInForm />
        
        {/* Descomentar para habilitar los botones de iniciar sesión con Facebook, Github, Firebase o Google+ */}
        {/* <Divider>O inicia sesión con</Divider>
        <SocialLogin /> */}
        
        <Text>
          ¿Aún no eres miembro?&nbsp;
          <Link to={REGISTRATION_PAGE}>Regístrate</Link>
        </Text>
      </FormWrapper>
      <BannerWrapper> {/* Contenedor de la imagen de fondo de la página de inicio de sesión */}
        <img src="/images/login-page-bg.jpg" alt="" />
      </BannerWrapper>
    </Wrapper>
  );
};

export default SignIn;
