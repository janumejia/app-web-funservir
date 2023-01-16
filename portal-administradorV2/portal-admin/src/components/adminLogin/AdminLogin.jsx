import { Layout, Form, Input, Button, Checkbox, Avatar, Card, message } from "antd";
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate } from "react-router-dom";
import axios from "axios";
import './adminL.css';
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
            await axios
                .post("http://localhost:4000/adminLogin", Usuario)
                .then((res) => {
                    const { data } = res;
                    
                    if (Object.values(data.user).length !== 0) {
                        setTimeout(() => {
                            localStorage.setItem("token", data?.user.token);
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
                </Card>
            </Content>
        </Layout>

    );
}

export default AdminLogin;