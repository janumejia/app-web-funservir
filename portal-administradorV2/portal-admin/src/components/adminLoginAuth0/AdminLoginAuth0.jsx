import { Button, Space } from 'antd';
import { useAuth0 } from "@auth0/auth0-react";

const AdminLoginAuth0 = () => {

    const { loginWithPopup, loginWithRedirect, logout, user, isAuthenticated } = useAuth0()

    return (
        <>
            <h1>Bienvenido al portal administrador</h1>
            <h3>Inicia sesión para continuar</h3>
            <Space wrap>
                <Button onClick={loginWithRedirect} type="primary">Iniciar sesión</Button>
                <Button onClick={() => loginWithRedirect({ screen_hint: 'signup' })} type="primary">Regístrate</Button>
            </Space>
            <h3>El usuario {isAuthenticated ? "está autenticado" : "no está autenticado"}</h3>
            {isAuthenticated && (
                <pre style={{ textAlign: 'start' }}>
                    {JSON.stringify(user, null, 2)}
                </pre>
            )}
        </>
    );
}

export default AdminLoginAuth0;