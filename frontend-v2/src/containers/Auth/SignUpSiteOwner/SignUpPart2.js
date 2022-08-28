import React from 'react';
import { Link } from 'react-router-dom';
import { Divider } from 'antd';
import Logo from 'components/UI/Logo/Logo';
import { LOGIN_PAGE, REGISTRATION_PAGE } from 'settings/constant';
import SignUpForm from '../SignUpSiteOwner/SignUpFormPart2';
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
          title="Funservir"
        />
        <Title>Registro de dueño de sitio</Title>
        <TitleInfo>Ingresa tus datos para registrarte</TitleInfo>
        <SignUpForm />
        {/* Descomentar para habilitar los botones de registrarse con Facebook, Github, Firebase o Google+ */}
        {/* <Divider>O regístrate con</Divider>
        <SocialLogin /> */}
        <Text>
          ¿Ya tienes cuenta?&nbsp;
          <Link to={LOGIN_PAGE}>Inicia sesión</Link>
          <br/>
          ¿Quieres registrarte normal?&nbsp;
          <Link to={REGISTRATION_PAGE}>Registro normal</Link>
        </Text>
        <Text>
        </Text>
      </FormWrapper>
      <BannerWrapper>
        <img src="/images/register-page-site-owner-bg.jpg" alt="Imagen registro dueño de sitio" />
      </BannerWrapper>
    </Wrapper>
  );
};

export default SignUp;
