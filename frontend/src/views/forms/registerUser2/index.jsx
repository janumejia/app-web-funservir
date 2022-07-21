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
    let newArray = [...inputs.discapacidad, e.target.id]
    if (inputs.discapacidad.includes(e.target.id)) {
      newArray = newArray.filter(disa => disa !== e.target.id)
    }
    setInputs({ ...inputs, discapacidad: newArray });
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
          setInputs({ name: "", password: "", email: "", edad: "", sexo: "", direccion: " ", discapacidad: " ", tutor: " ", fundacion: " "});
          setTimeout(() => {
            setMessage("");
            navigate("/loginUser");
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
                <FormControlLabel value="F" control={<Radio />} label="Femenino" />
                <FormControlLabel value="M" control={<Radio />} label="Masculino" />
                <FormControlLabel value="O" control={<Radio />} label="Otro" />
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
              <FormControlLabel value="Motora" control={<Checkbox id="Motora" onChange={HandleChangeArray} inputProps={{ 'aria-label': 'controlled' }} />} label="Motora" />
              <FormControlLabel value="Visual" control={<Checkbox id="Visual" onChange={HandleChangeArray} inputProps={{ 'aria-label': 'controlled' }} />} label="Visual" />
              <FormControlLabel value="Auditiva" control={<Checkbox id="Auditiva" onChange={HandleChangeArray} inputProps={{ 'aria-label': 'controlled' }} />} label="Auditiva" />
              <FormControlLabel value="Intelectual" control={<Checkbox id="Intelectual" onChange={HandleChangeArray} inputProps={{ 'aria-label': 'controlled' }} />} label="Intelectual" />
              <FormControlLabel value="Psicosocial" control={<Checkbox id="Psicosocial" onChange={HandleChangeArray} inputProps={{ 'aria-label': 'controlled' }} />} label="Psicosocial" />
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.left}>
              <label>¿Eres tutor?</label>
              <RadioGroup
                row aria-labelledby="demo-controlled-radio-buttons-group"
                name="tutor"
                value={tutor}
                onChange={(e) => HandleChange(e)}
              >
                <FormControlLabel value={true} control={<Radio />} label="Sí" />
                <FormControlLabel value={false} control={<Radio />} label="No" defaultChecked/>
              </RadioGroup>
            </div>
          </div>
          <div className={styles.inputContainer}>
            <div className={styles.left}>
              <input
                onChange={(e) => HandleChange(e)}
                value={fundacion}
                name="fundacion"
                id="fundacion"
                type="text"
                placeholder="Fundación..."
                autoComplete="off"
              />
            </div>
          </div>
          <button type="submit">
            {loading ? "Cargando..." : "Únete"}
          </button>
        </form>
      </div>
      {message && <div className={styles.toast}>{message}</div>}
    </>
  );
};
export default RegisterUserT