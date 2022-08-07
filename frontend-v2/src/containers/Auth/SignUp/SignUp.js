import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import Logo from 'components/UI/Logo/Logo';
import { LOGIN_PAGE } from 'settings/constant';
import SignUpForm from './SignUpForm';
import SocialLogin from '../SocialLogin';
import Wrapper, {
  Title,
  TitleInfo,
  Text,
  FormWrapper,
  BannerWrapper,
} from '../Auth.style';

const SignUp = () => {
  return (
    <Wrapper>
      <FormWrapper>
        <Logo
          withLink
          linkTo="/"
          src="/images/logo-alt.svg"
          title="TripFinder."
        />
        <Title>Registro de usuario</Title>
        <TitleInfo>Ingresa tus datos para registrarte</TitleInfo>
        <SignUpForm />
        {/* Descomentar para habilitar los botones de registrarse con Facebook, Github, Firebase o Google+ */}
        {/* <Divider>O regístrate con</Divider>
        <SocialLogin /> */}
        <Text>
          ¿Ya tienes cuenta?&nbsp;
          <Link to={LOGIN_PAGE}>Inicia sesión</Link>
          <br/>
          ¿Eres dueño de un sitio?&nbsp;
          <Link to={LOGIN_PAGE}>Registro dueño de sitio</Link>
        </Text>
        <Text>
        </Text>
      </FormWrapper>
      <BannerWrapper>
        <img src="/images/login-page-bg.jpg" alt="Auth page banner" />
      </BannerWrapper>
    </Wrapper>
  );
};

export default SignUp;
