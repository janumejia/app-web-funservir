import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from '@mui/material/Checkbox';
import Radio from "@mui/material/Radio";

import styles from "./styles.module.scss";

const RegisterUserT = ({ usuario }) => {

  const { name, email, password } = usuario;
  const [inputs, setInputs] = useState({
    name: name,
    email: email,
    password: password,
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

  const HandleChangeArray = (e) => {
    setInputs(...inputs, [e.target.name].concat(e.target.value));
    console.log(inputs.discapacidad);
  }
  
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
            <div className={styles.left}>
              <input
                onChange={(e) => HandleChange(e)}
                value={edad}
                name="edad"
                id="edad"
                type="text"
                placeholder="Ingrese su edad"
                autoComplete="off"
              />
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.left}>
              <h4>Sexo: </h4>
              <RadioGroup
                row aria-labelledby="demo-controlled-radio-buttons-group"
                name="sexo"
                value={sexo}
                onChange={(e) => HandleChange(e)}
              >
                <FormControlLabel value="Femenino" control={<Radio />} label="Female" />
                <FormControlLabel value="Masculino" control={<Radio />} label="Male" />
                <FormControlLabel value="Otro" control={<Radio />} label="Other" />
              </RadioGroup>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.left}>
              <input
                onChange={(e) => HandleChange(e)}
                value={direccion}
                name="direccion"
                id="direccion"
                type="text"
                placeholder="Ingrese su dirección de residencia"
                autoComplete="off"
              />
            </div>
          </div>
          <div className={styles.inputContainer}>

            <div className={styles.radioGroup}>
              <h4>Discapacidad: (Seleccione ninguna, una o varias)</h4>
              <Checkbox checked={discapacidad} onChange={HandleChangeArray} inputProps={{ 'aria-label': 'controlled' }}></Checkbox>
              <Checkbox checked={discapacidad} onChange={HandleChangeArray} inputProps={{ 'aria-label': 'controlled' }}></Checkbox>
              <Checkbox checked={discapacidad} onChange={(e) => HandleChangeArray(e)} inputProps={{ 'aria-label': 'controlled' }}></Checkbox>
              <Checkbox checked={discapacidad} onChange={(e) => HandleChangeArray(e)} inputProps={{ 'aria-label': 'controlled' }}></Checkbox>
              <Checkbox checked={discapacidad} onChange={(e) => HandleChangeArray(e)} inputProps={{ 'aria-label': 'controlled' }}></Checkbox>
            </div>
          </div>
        </form>
      </div>
      {message && <div className={styles.toast}>{message}</div>}
    </>
  );
};
export default RegisterUserT