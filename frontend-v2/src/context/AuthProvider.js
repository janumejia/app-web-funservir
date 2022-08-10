import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// Para usar Context usamos React.createContext() , que retorna un provider y un consumer
export const AuthContext = React.createContext(); 

const fakeUserData = {
  id: 1,
  name: 'Jhon Doe',
  avatar:
    'http://s3.amazonaws.com/redqteam.com/isomorphic-reloaded-image/profilepic.png',
  roles: ['USER', 'ADMIN'],
};

const AuthProvider = (props) => {
  let navigate = useNavigate();
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState({});

  const signIn = (params) => {
    console.log(params, 'sign in form Props');
    setUser(fakeUserData);
    setLoggedIn(true);
    navigate('/', { replace: true });
  };

  const signUp = (params) => {
    console.log(params, 'sign up form Props');
    setUser(fakeUserData);
    setLoggedIn(true);
    navigate('/', { replace: true });
  };

  const logOut = () => {
    setUser(null);
    setLoggedIn(false);
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
      }}
    >
      <>{props.children}</>
    </AuthContext.Provider>
  );
};

export default AuthProvider;
