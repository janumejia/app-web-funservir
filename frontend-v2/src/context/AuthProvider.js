import { message, notification } from 'antd';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../settings/axiosConfig";

// Para usar Context usamos React.createContext() , que retorna un provider y un consumer
export const AuthContext = React.createContext();

const fakeUserData = {
  id: 1,
  name: 'Julián Andrés',
  avatar:
    'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
  roles: ['USER', 'ADMIN'],
};

// Componente provider
const AuthProvider = (props) => {

  let navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [admin, setAdmin] = useState(false);

  // const [api, contextHolder] = notification.useNotification();

  const signIn = async (params) => {
    //console.log(params, 'sign in form Props');
    await axios.post(`${process.env.REACT_APP_HOST_BACK}/loginUser`, params, {
      withCredentials: true
    })
      .then((response) => {
        console.log("response: ", response);
        if (response.status === 200) {
          setUser({
            id: response.data.data._id,
            name: response.data.data.name,
            avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
            roles: response.data.data.userType,
          });
          setLoggedIn(true);
          navigate('/', { replace: true });
        }

      })
      .catch((error) => {
        if (error.response.status === 401) {

          // En forma de notificación:
          notification.error({
            message: error.response.data.message,
            // description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
            placement: 'topLeft',
            duration: 3,
            // No funcionan bien los estilos de la notificación
            // style: {
              // top: '50%', // Centrado verticalmente
              // left: '40%', // Centrado horizontalmente
              // marginLeft: '-6.5em', // Desplazamiento horizontal negativo igual a la mitad del ancho de la notificación
            // }
          });

          // En forma de mensaje:
          message.error(error.response.data.message, 3, undefined, {
            style: {
              marginTop: '10vh',
            },
          },);


        }
      })
  };

  // Aquí recibimos los datos del registro
  const signUp = async (params) => {
    // Solo recibimos nombre, correo y contraseña, el resto son datos quemados con tal de probar el registro
    params = {
      ...params,
      edad: 20,
      sexo: "masculino",
      direccion: "Calle 5 #3-35",
      discapacidad: [
        "Motora",
        "Visual"
      ],
      tutor: false,
      fundacion: "Funservir",
      userType: "R"
    }

    await axios
      .post(`${process.env.REACT_APP_HOST_BACK}/register`, params)
      .then((answer) => {
        const { user } = answer.data;
        // Agregamos a nuestras variables globales la información del usuario logueado (variable user y loggedIn son globales)
        setUser({
          id: user._id,
          name: user.name,
          avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
          roles: ['USER', 'ADMIN'],
        });
        setLoggedIn(true);
        navigate('/', { replace: true }); // El {replace: true} es para que una vez logueados, la página anterior sea igual a la actual, con tal de no poder volver a la página de logueo: https://reach.tech/router/api/navigate
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const logOut = async () => {

    try {
      const ans = await axios.get(`${process.env.REACT_APP_HOST_BACK}/logout`)

      console.log("isLogout: ", ans.data.success)

      if (ans.data.success === "true") {
        setUser(null);
        setLoggedIn(false);
        navigate('/', { replace: true });
      }
    } catch (error) {
      // console.log("Falló: ", error);
    }

  };

  return (
    /* Aquí usamos el provider de nuestro Context (Authcontext), y le pasamos un objeto con las variables que queremos globalizar 
        mediante la propiedad "value" (tener en cuenta que tiene doble llave porque es un objeto)
      
        Para usar esas variables globales desde una componente hija, debemos usar useContext() 
    */

    <AuthContext.Provider
      value={{
        loggedIn,
        logOut,
        signIn,
        signUp,
        user,
        admin,
      }}
    >
      <>{props.children}</>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
