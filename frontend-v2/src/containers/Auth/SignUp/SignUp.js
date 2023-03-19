import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from 'components/UI/Logo/Logo';
import { LOGIN_PAGE, REGISTRATION_SITE_OWNER_PAGE } from 'settings/constant';
import { Button } from 'antd';
import { RightOutlined } from "@ant-design/icons";
import Icon from '@ant-design/icons';
import { Label } from '../Auth.style';
import Wrapper, {
  Title,
  TitleInfo,
  Text,
  FormWrapper,
  BannerWrapper,
} from '../Auth.style';
const SignUp = () => {

  // La información que diligencia el usuario
  const [dataUser, setDataUser] = useState();

  return (
    <Wrapper>
      <FormWrapper>
        <Logo
          withLink
          linkTo="/"
          src="/images/logo-funservir.png"
          title="Funservir"
        />
        <Title>Quiero registrarme como:</Title>
        <TitleInfo>Selecciona una opción para empezar a registrarte</TitleInfo>
        <Button type="default" style={{ height: '50px', marginBottom: '30px', display: "grid", gridTemplateColumns: "auto auto 1fr", alignItems: "center", boxShadow: "2px 3px 5px gray" }} block>
          <Icon component={() => (<img src="/images/user.png" alt='x' style={{ height: '30px', with: "10px" }} />)} />
          <Label>Usuario</Label>
          <RightOutlined style={{ justifySelf: "end" }} />
        </Button>
        <Link to={REGISTRATION_SITE_OWNER_PAGE}>
          <Button type="default" style={{ height: '50px', display: "grid", gridTemplateColumns: "auto auto 1fr", alignItems: "center", boxShadow: "2px 3px 5px gray" }} block>
            <Icon component={() => (<img src="/images/owner.png" alt='x' style={{ height: '30px', with: "10px" }} />)} />
            <Label>Dueño de sitio</Label>
            <RightOutlined style={{ justifySelf: "end" }} />
          </Button>
        </Link>
        <Text>
          ¿Ya tienes cuenta?&nbsp;
          <Link to={LOGIN_PAGE}>Inicia sesión</Link>
        </Text>
        <Text>
        </Text>
      </FormWrapper>
      <BannerWrapper>
        <img src="/images/login-page-bg.jpg" alt="Imagen página autenticación" />
      </BannerWrapper>
    </Wrapper>
  )
};

export default SignUp;
