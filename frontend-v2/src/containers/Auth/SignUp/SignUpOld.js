import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from 'components/UI/Logo/Logo';
import { LOGIN_PAGE, REGISTRATION_SITE_OWNER_PAGE } from 'settings/constant';
import { Button } from 'antd';
import { RightOutlined, SmileOutlined } from "@ant-design/icons";
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
                <Button type="default" block>
                    <SmileOutlined />
                    Usuario
                    <RightOutlined />
                </Button>
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
