import { Layout, Form, Input, Button, Checkbox, Avatar, Card, message } from "antd";
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './adminL.css';
// import { GoogleLogin } from "react-google-login" // Autenticación con Google (dependencia ya no es mantenida)
import { GoogleLogin } from '@react-oauth/google';
import { useGoogleLogin } from '@react-oauth/google';
// import { Avatar, Button, Paper, Grid, Typography, Container, TextField } from "@material-ui/core";
import Icon from "./icon";
// import Cookies from 'js-cookie'
// import { Cookies } from 'react-cookie'; // Para ajustar el token de sesión en una cookie
// const dotenv = require('dotenv'); // Para traer las variables de entorno
const { Header, Content } = Layout;
const { Meta } = Card;



const AdminLogin = () => {

    const navigate = useNavigate();

    const onSubmit = async (e) => {
        if (e.password !== "" && e.email !== "") {
            const Usuario = {
                email: e.email,
                password: e.password
            };
            console.log("Usuario ", Usuario)
            await axios
                .post("http://localhost:4000/adminLogin", Usuario)
                .then((res) => {
                    const { data } = res;
                    // Cookies.set('token', data?.user.token); // Pero no se le puede agregar http only (no permite la ejecución de js)

                    if (Object.values(data.user).length !== 0) {
                        setTimeout(() => {
                            // console.log("ok")
                            localStorage.setItem("token", data?.user.token);
                            // setJwt(data.token);
                            navigate(`/dashboard`);
                        }, 1500);
                    } else {
                        message.error('Credenciales erroneas');
                    }
                })
                .catch((error) => {
                    console.error(error);

                });
        } else { // No están todos los campos llenos
            message.error('No están todos los campos llenos');
        }
    };

    const googleSuccess = async (resAuth) => {
        console.log(resAuth);
        await axios
            .post("http://localhost:4000/adminLoginWithGoogle", resAuth)
            .then((res) => {
                console.log(res);
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
                    >
                        <Form.Item
                            name="email"
                            rules={[
                                {
                                    required: true,
                                    message: '¡Por favor introduce tu correo!',
                                },
                            ]}
                        >
                            <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Correo electrónico" />
                        </Form.Item>
                        <Form.Item
                            name="password"
                            rules={[
                                {
                                    required: true,
                                    message: '¡Por favor introduce tu contraseña!',
                                },
                            ]}
                        >
                            <Input
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
                    <GoogleLogin
                        onSuccess={googleSuccess}
                        onError={googleFailure}
                        shape="rectangular"
                        // theme="filled_blue"
                    />
                    <Button
                        // className={classes.googleButton}
                        color="primary"
                        // fullWidth
                        onClick={() => login()}
                        // startIcon={<Icon />}
                        variant="contained">
                        Iniciar sesión con Google 🚀
                    </Button>
                </Card>
            </Content>
        </Layout>

    );
}

export default AdminLogin;