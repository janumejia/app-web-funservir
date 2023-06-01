import { message, notification } from 'antd';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "../settings/axiosConfig";

// Para usar Context usamos React.createContext() , que retorna un provider y un consumer
export const AuthContext = React.createContext();

// Componente provider
const AuthProvider = (props) => {

  let navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});
  const [admin, setAdmin] = useState(false);

  useEffect(() => {

    // Para verificar si está logueado en el primer renderizado de la página
    const isLoggedIn = async () => {
      try {
<<<<<<< HEAD
        const res = await axios.get(`${process.env.REACT_APP_HOST_BACK}/status`, { withCredentials: true })
=======
        const res = await axios.get(`${process.env.REACT_APP_HOST_BACK}/status`)
>>>>>>> f87bf2c (rebase)
        
        if (res) {
          if (res.status === 200) {
            setUser(...res.data.data);
            setLoggedIn(true);
  
          } else message.warning("Respuesta del servidor desconocida");
        }
      } catch (error) {
        if(error && error.response && error.response.status && error.response.status === 503) message.error({ content: error.response.data.message, duration: 3 });
        else {
          setUser({});
          setLoggedIn(false);
        }
      }
    }

    isLoggedIn(); // Ejecución de lo anterior
  }, []);

  // const [api, contextHolder] = notification.useNotification();

  const signIn = async (params) => {
    //console.log(params, 'sign in form Props');
    try {
      message.destroy();
      message.loading("Cargando", 0);
      const res = await axios.post(`${process.env.REACT_APP_HOST_BACK}/loginUser`, params, {
        withCredentials: true
      });

      message.destroy();
      if (res) {
        if (res.status === 200) {
          message.success(res.data.message, 3);
          
          setUser( res.data.data );
          setLoggedIn(true);
          navigate('/', { replace: true });

        } else message.warning("Respuesta del servidor desconocida", 3);
      }
    } catch (error) {
      console.log(error)
      message.destroy();
      if (!error.response || (error.response && typeof error.response.status === 'undefined')) {
        message.warning({ content: "Error de conectividad con el servidor", duration: 3 });
      } else {
        if (error.response.status >= 400 && error.response.status <= 499) { // Errores del cliente

          message.warning({ content: error.response.data.message, duration: 3 });
        }
        else if (error.response.status >= 500 && error.response.status <= 599) {

          message.error({ content: error.response.data.message, duration: 3 });
        } // Errores del servidor
        else {
          message.warning({ content: "Error de conectividad con el servidor", duration: 3 });
        }
      }
    }

    // -----
    
    // await axios.post(`${process.env.REACT_APP_HOST_BACK}/loginUser`, params, {
    //   withCredentials: true
    // })
    //   .then((response) => {
    //     console.log("response: ", response);
    //     if (response.status === 200) {
    //       console.log("etoo: ", response.data.data)
    //       setUser( response.data.data );
    //       setLoggedIn(true);
    //       navigate('/', { replace: true });
    //     }

    //   })
    //   .catch((error) => {
    //     console.log(error)
    //     if (error.response && error.response.status && error.response.status === 401) {

    //       // En forma de notificación:
    //       // notification.error({
    //       //   message: error.response.data.message,
    //       //   // description: 'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    //       //   placement: 'topLeft',
    //       //   duration: 3,
    //       //   // No funcionan bien los estilos de la notificación
    //       //   // style: {
    //       //     // top: '50%', // Centrado verticalmente
    //       //     // left: '40%', // Centrado horizontalmente
    //       //     // marginLeft: '-6.5em', // Desplazamiento horizontal negativo igual a la mitad del ancho de la notificación
    //       //   // }
    //       // });

    //       // En forma de mensaje:
    //       message.error(error.response.data.message, 3, undefined, {
    //         style: {
    //           marginTop: '10vh',
    //         },
    //       },);


    //     } else {
    //       message.error("Hubo un error", 3, undefined, {
    //         style: {
    //           marginTop: '10vh',
    //         },
    //       },);
    //     }
    //   })
  };

  // Aquí recibimos los datos del registro
  // const signUp = async (params) => {
  //   // Solo recibimos nombre, correo y contraseña, el resto son datos quemados con tal de probar el registro
  //   params = {
  //     ...params,
  //     edad: 20,
  //     sexo: "masculino",
  //     direccion: "Calle 5 #3-35",
  //     discapacidad: [
  //       "Motora",
  //       "Visual"
  //     ],
  //     tutor: false,
  //     fundacion: "Funservir",
  //     userType: "R"
  //   }

  //   await axios
  //     .post(`${process.env.REACT_APP_HOST_BACK}/register`, params)
  //     .then((answer) => {
  //       const { user } = answer.data;
  //       // Agregamos a nuestras variables globales la información del usuario logueado (variable user y loggedIn son globales)
  //       setUser({
  //         id: user._id,
  //         name: user.name,
  //         avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80',
  //         roles: ['USER', 'ADMIN'],
  //       });
  //       setLoggedIn(true);
  //       navigate('/', { replace: true }); // El {replace: true} es para que una vez logueados, la página anterior sea igual a la actual, con tal de no poder volver a la página de logueo: https://reach.tech/router/api/navigate
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // };

  const logOut = async () => {

    try {
      const res = await axios.get(`${process.env.REACT_APP_HOST_BACK}/logout`)

      if (res) {
        if (res.status === 200) {


          setUser(null);
          setLoggedIn(false);
          message.success(res.data.message, 5);
          navigate('/', { replace: true }); // El {replace: true} es para que la página anterior sea igual a la actual: https://reach.tech/router/api/navigate
        } else message.warning(res.status + " - Respuesta del servidor desconocida");
      }
    } catch (error) {
      if (typeof error.response.status === 'undefined') {

        message.warning({ content: "Error de conectividad con el servidor", duration: 5 });
      } else {
        if (error.response.status >= 400 && error.response.status <= 499) { // Errores del cliente
          message.warning({ content: error.response.data.message, duration: 5 });
        }
        else if (error.response.status >= 500 && error.response.status <= 599) {
          message.error({ content: error.response.data.message, duration: 5 });
        } // Errores del servidor
        else {
          message.warning({ content: error.response.status + " - Error de conectividad con el servidor", duration: 5 });
        }
      }
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
        // signUp,
        setUser,
        setLoggedIn,
        user,
        admin,
      }}
    >
      <>{props.children}</>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
