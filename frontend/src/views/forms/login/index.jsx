import React from 'react';
import LoginForm from './styles.module.css'
import styles from './styles.module.scss'
import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import axios from "axios";

const FormularioB = () => {

  const [inputs, setInputs] = useState({
    email: "",
    password: ""
  });
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { email, password } = inputs;

  const HandleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  // Al presionar el botón de registrarse
  const onSubmit = async (e) => {
    e.preventDefault();

    //¿Si están todos los campos llenos?
    if (password !== "" && email !== "") {
      const Usuario = {
        email,
        password
      };
      setLoading(true);
      await axios
        .post(`${process.env.REACT_APP_HOST_BACK}/loginUser`, Usuario)
        .then((res) => {
          const { data } = res;
          setMessage(data.message); 
          if (Object.values(data.user).length!==0) {
            setTimeout(() => {
              setMessage("");
              localStorage.setItem("token", data?.user.token);
              navigate(`/`);
            }, 1500);
          }else{
            setTimeout(() => {
              setMessage("");
            }, 1500);
          }
        })
        .catch((error) => {
          console.error(error);
          setMessage("Sin conexión");
          setTimeout(() => {
            setMessage("");
          }, 1500);
        });
      setInputs({ password: "", email: "" });
      setLoading(false);
    } else { // No están todos los campos llenos
      setMessage("Debes completar todos los campos");
      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };



  return (
    <div className={LoginForm.Container}>
      <div className={styles.formContainer}>
        <h2>Iniciar Sesión</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className={styles.inputContainer}>
            <div className={styles.left}>
              <input
                onChange={(e) => HandleChange(e)}
                value={email}
                name="email"
                id="email"
                type="email"
                placeholder="Correo electrónico"
                autoComplete="off"
              />
            </div>
          </div>

          <div className={styles.inputContainer}>
            <div className={styles.left}>
              <input
                onChange={(e) => HandleChange(e)}
                value={password}
                name="password"
                id="password"
                type="password"
                placeholder="Contraseña"
                autoComplete="off"
              />
            </div>
          </div>
          <a href="/" className={LoginForm.ForgotPswd}>{'¿Olvidaste tu contraseña?'}</a>
          <button type="submit">
            {loading ? "Cargando..." : "Inicia sesión"}
          </button>
          <div>
            <input type="checkbox" className={LoginForm.checkmark} />Recordarme
          </div>
          <hr />
          <a href="/registerUser" className={LoginForm.Member}>{'¿Aún no eres miembro?'}</a>
        </form>
      </div>
      {message && <div className={styles.toast}>{message}</div>}
    </div>
  )
};

export default FormularioB;