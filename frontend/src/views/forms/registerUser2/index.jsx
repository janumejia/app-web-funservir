import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";

import styles from "./styles.module.scss";

const RegisterUserT = ({usuario}) => {
  

  const [inputs, setInputs] = useState({
    name: '',
    email: '',
    password: '',
    edad: "",
    sexo: "",
    direccion: "",
    discapacidad: [],
    tutor: false,
    fundacion: ""
  });
  const [message, setMessage] = useState();
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const { edad, sexo, direccion, discapacidad, tutor, fundacion } = inputs; //Revisar si todas las variables pueden cambiarse por este metodo
  const HandleChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  // Al presionar el botón de registrarse
  const onSubmit = async (e) => {
    e.preventDefault();

    //¿Si están todos los campos llenos?
    if (edad !== "" && sexo !== "" && direccion !== "" && discapacidad !== "" && fundacion !== "") {

      setLoading(true);
      await axios
        .post("http://localhost:4000/register", inputs)
        .then((res) => {
          const { data } = res;
          setMessage(data.message);
          setInputs({ name: "", password: "", email: "", confirmPassword: "" });
          setTimeout(() => {
            setMessage("");
            navigate("/login");
          }, 1500);
        })
        .catch((error) => {
          console.error(error);
          setMessage("Hubo un error");
          setTimeout(() => {
            setMessage("");
          }, 1500);
        });

      setLoading(false);
    } else { // No están todos los campos llenos
      setMessage("Debes completar todos los campos");
      setTimeout(() => {
        setMessage("");
      }, 1500);
    }
  };

  return (
    <>
      <div className={styles.formContainer}>
        <h2>Registro de usuario nuevo</h2>
        <form onSubmit={(e) => onSubmit(e)}>
          <div className={styles.inputContainer}>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={sexo}
              onChange={(e) => HandleChange(e)}
            >
              <FormControlLabel value="Femenino" control={<Radio />} label="Female" />
              <FormControlLabel value="Masculino" control={<Radio />} label="Male" />
              <FormControlLabel value="Otro" control={<Radio />} label="Other" />
            </RadioGroup>

            <button type="submit">
              {loading ? "Cargando..." : "Regístrate"}
            </button>
            <p>
              <b>¿Eres dueño de un sitio?</b>
            </p>
            <p>
              <b onClick={() => navigate("/login")}>¿Ya tienes cuenta?</b>
            </p>
          </div>
        </form>
      </div>
      {message && <div className={styles.toast}>{message}</div>}
    </>
  );
};
export default RegisterUserT