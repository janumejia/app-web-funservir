import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
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

const SignIn = () => {
  return (
    <Wrapper>
      <FormWrapper>
        <Logo
          withLink
          linkTo="/"
          src="/images/logo-alt.svg"
          title="TripFinder."
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
      <BannerWrapper>
        <img src="/images/login-page-bg.jpg" alt="Auth page banner" />
      </BannerWrapper>
    </Wrapper>
  );
};

export default SignIn;
