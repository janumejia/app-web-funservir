import { useRef, useState, useEffect } from 'react';
import { Layout, Form, Input, Button, Checkbox, Avatar, Card, message } from "antd";
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate, useLocation } from "react-router-dom";
import './adminL.css';
import axios from '../../api/axios';
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
// import AuthContext from "../../context/AuthProvider";
import useAuth from '../../hooks/useAuth';
import jwt_decode from 'jwt-decode'


// import Cookies from 'js-cookie'
// import { Cookies } from 'react-cookie'; // Para ajustar el token de sesión en una cookie
// const dotenv = require('dotenv'); // Para traer las variables de entorno
const { Header, Content } = Layout;
const { Meta } = Card;



const AdminLogin = () => {

    const { setAuth } = useAuth();

    const navigate = useNavigate();
    const location = useLocation();
    // const from = location.state?.from?.pathname || "/";

    const onSubmit = async (e) => {
        if (e.password !== "" && e.email !== "") {
            const Usuario = {
                email: e.email,
                password: e.password
            };

            await axios
                .post("/adminLogin", Usuario)
                .then((res) => {
                    const { data } = res;
                    // Cookies.set('token', data?.user.token); // Pero no se le puede agregar http only (no permite la ejecución de js)
                    
                    if (Object.values(data.user).length !== 0) {
                        setTimeout(() => {
                    
                            localStorage.setItem("token", data?.user.token);
                            let decodedToken = jwt_decode(data?.user.token);
                            setAuth(decodedToken); // Lo asignamos a la variable global Auth, usando Context
                            // setJwt(data.token);
                            navigate(`/dashboard`, { replace: true }); // replace para reemplazar la anterior página del historial con esta
                        }, 1500);
                    } else {
                        message.error('Credenciales erroneas');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    message.error('Error en la autenticación');
                });
        } else { // No están todos los campos llenos
            message.error('No están todos los campos llenos');
        }
    };

    const googleSuccess = async (resAuth) => {
       
        await axios
            .post("/adminLoginWithGoogle", resAuth)
            .then((res) => {
                // console.log(res);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    const googleFailure = (error) => {
        console.log("Inicio de sesión con Google no fue exitoso. Inténtalo más tarde");
        console.log(error)
    }

    const login = useGoogleLogin({
        onSuccess: codeResponse => console.log(codeResponse),
        flow: 'auth-code',
    });


    return (
        <Layout>
            <Header className="header">
                <div className="logo"><img src="/funservirLogo.jpg" alt="Funservir Logo" /></div>
            </Header>
            <Content
                className="site-layout-background"
                style={{
                    width: '100%',
                    height: '100vh',
                    display: 'grid',
                    placeItems: 'center'
                }}
            >
                <Card>
                    <Meta
                        avatar={<Avatar size={{
                            xs: 24,
                            sm: 32,
                            md: 40,
                            lg: 64,
                            xl: 80,
                            xxl: 100,
                        }} src="https://raw.githubusercontent.com/Jauny/joeschmoe.io/0a268f6dacc319620d7df1e85ef08a417b9f6f24/assets/static/images/avatars/originals/males/jia.svg" />}
                        title="Inicio de Sesión del Administrador"
                        style={{
                            display: 'grid',
                            gridTemplateColumnscolumns: 'fit-content(150px)'
                        }}
                    />
                    <Form
                        name="normal_login"
                        className="login-form"
                        initialValues={{
                            remember: true,
                        }}
                        onFinish={(e) => onSubmit(e)}
                        autocomplete= "none"
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: '¡Por favor introduce tu correo!',
                                    autocomplete: "none"
                                },
                            ]}
                        >
                            <Input autocomplete="off" prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Correo electrónico" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '¡Por favor introduce tu contraseña!',
                                    autocomplete: "none"
                                },
                            ]}
                        >
                            <Input
                                autocomplete="off"
                                prefix={<LockOutlined className="site-form-item-icon" />}
                                type="password"
                                placeholder="Contraseña"

                            />
                        </Form.Item>
                        <Form.Item>
                            <Form.Item name="remember" valuePropName="checked" noStyle>
                                <Checkbox>Recordarme</Checkbox>
                            </Form.Item>

                            <a className="login-form-forgot" href="/">
                                ¿Olvidaste tu contraseña?
                            </a>
                        </Form.Item>

                        <Form.Item>
                            <Button type="primary" htmlType="submit" className="login-form-button">
                                Iniciar Sesión
                            </Button>
                        </Form.Item>
                    </Form>
                    <div className="googleloginbutton">
                        <GoogleLogin
                            onSuccess={googleSuccess}
                            onError={googleFailure}
                            shape="rectangular"
                            width={301}
                        // theme="filled_blue"
                        />
                    </div>
                    {/* <Button
                        // className={classes.googleButton}
                        color="primary"
                        // fullWidth
                        onClick={() => login()}
                        // startIcon={<Icon />}
                        variant="contained">
                        Iniciar sesión con Google 🚀
                    </Button> */}
                </Card>
            </Content>
        </Layout>

    );
}

export default AdminLogin;