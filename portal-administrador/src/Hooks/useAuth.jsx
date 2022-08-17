import { createContext, useContext, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import axios from "axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  const login = async (Usuario) => {
    await axios
      .post("http://localhost:4000/adminLogin", Usuario)
      .then((res) => {
        const { data } = res;
        if (Object.values(data.user).length !== 0) {
          setUser("user", data?.user.token); // Usamos el hook de autenticación
          navigate(`/`);
          console.log("Nice")
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const logout = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const value = useMemo(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
