import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RegisterUserT from "../registerUser2/index.jsx";
import styles from "./styles.module.scss";

const RegisterUser = () => {


  const [inputs, setInputs] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
    childComponents: false
  });
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { name, email, password, confirmPassword } = inputs;

  const HandleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };
  // Al presionar el botón de registrarse
  const onSubmit = async (e) => {
    e.preventDefault();

    // ¿Si están todos los campos llenos?
    if (name !== "" && password !== "" && email !== "" && confirmPassword !== "") {

      // ¿Las contraseñas no son iguales?
      if (password !== confirmPassword) {
        setMessage("Las contraseñas no coinciden");
        setTimeout(() => {
          setMessage("");
        }, 1500);
      } else if (agreePolicies) { // ¿Si aceptó las políticas?
        setLoading(true);
        setInputs({ ...inputs, childComponents: true }); //https://stackoverflow.com/questions/61054275/usestate-with-boolean-value-in-react revisar useEffect para limpiar el estado
      } else { // No aceptó las políticas
        setMessage("Debes aceptar los términos y condiciones");
        setTimeout(() => {
          setMessage("");
        }, 1500);
      }
    } else { // No están todos los campos llenos
      setMessage("Debes completar todos los campos");
      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };

  // Para que el valor del checkbox de aceptar políticas se almacene en una variable booleana llamada agreePolicies
  const [agreePolicies, setAgreePolicies] = useState(false); // Inicialmente en falso

  const handleAgreePolicies = () => { // Al presionar sobre el checkbox cambia al estado opuesto
    setAgreePolicies(!agreePolicies);
  };

  return (
    <>
      {!inputs.childComponents ? <><div className={styles.formContainer}>
        <h2>Registrarse</h2>
        <form onSubmit={(e) => onSubmit(e)}>

          <div className={styles.inputContainer}>
            <div className={styles.left}>
              <input
                onChange={(e) => HandleChange(e)}
                value={name}
                name="name"
                id="name"
                type="text"
                placeholder="Nombre completo"
                autoComplete="off"
              />
            </div>
          </div>

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

          <div className={styles.inputContainer}>
            <div className={styles.left}>
              <input
                onChange={(e) => HandleChange(e)}
                value={name}
                name="name"
                id="name"
                type="text"
                placeholder="Nombre completo"
                autoComplete="off"
              />
            </div>
          </div>

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

          <div className={styles.inputContainer}>
            <div className={styles.left}>
              <input
                onChange={(e) => HandleChange(e)}
                value={confirmPassword}
                name="confirmPassword"
                id="confirmPassword"
                type="password"
                placeholder="Confirmar contraseña"
                autoComplete="off"
              />
            </div>
          </div>

          <div className={styles.checkboxPolicies}>
            <input
              type="checkbox"
              id="checkboxPolicies"
              name="checkboxPolicies"
              value="checkboxPolicies"
              checked={agreePolicies}
              onChange={handleAgreePolicies}
            />
            Estoy de acuerdo con los términos y condiciones
          </div>

          <button type="submit">
            {loading ? "Cargando..." : "Regístrate"}
          </button>
          <p>
            <b onClick={() => navigate("/registerBusinessOwner")}>¿Eres dueño de un sitio?</b> {/*Poner el navigate al due;o de sitio*/}
          </p>
          <p>
            <b onClick={() => navigate("/login")}>¿Ya tienes cuenta?</b>
          </p>
        </form>
      </div>
        {message && <div className={styles.toast}>{message}</div>}
      </> : <RegisterUserT usuario={inputs} />}
    </>
  );
};

export default RegisterUser