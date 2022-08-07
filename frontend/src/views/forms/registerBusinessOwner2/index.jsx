import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from '@mui/material/Checkbox';
import Radio from "@mui/material/Radio";

// Para el campo de subir archivo
// import DropzoneDialogComponent from "../../../components/commons/inputs/fileUploadDropzone"
import { DropzoneDialog } from 'material-ui-dropzone'
import Button from '@material-ui/core/Button';

import { BsUpload } from "react-icons/bs"; // Para usr iconos en React. Documentación https://react-icons.github.io/react-icons

import styles from "./styles.module.scss";

const RegisterBusinessOwner2 = ({ usuario }) => {

    //Recibimos los datos de la anterior vista
    const { name, email, nit, businessName, password } = usuario;

    // Para actualizar los campos de usuario a medida que el usuario los introduce
    const [inputs, setInputs] = useState({
        name: name,
        email: email,
        nit: nit,
        businessName: businessName,
        password: password,
        edad: "",
        sexo: "",
        direccion: "",
        discapacidad: [],
        tutor: false,
        fundacion: "",
        userType: 'O', // Usuario dueño de sitio ('O' de Owner)
    });
    
    const { edad, sexo, direccion, discapacidad, tutor, fundacion } = inputs;
    
    const [message, setMessage] = useState();
    
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    
    // Al haber cambios en alguno de los inputs presentes, ajuste el valor de la variable inmediatamente
    const HandleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };
    
    // Para escuchar los cambios en los checkbox de tipos de discapacidades y ajustarlo de inmediatamente
    const HandleChangeArray = (e) => {
        let newArray = [...inputs.discapacidad, e.target.id]
        if (inputs.discapacidad.includes(e.target.id)) {
            newArray = newArray.filter(disability => disability !== e.target.id)
        }
        setInputs({ ...inputs, discapacidad: newArray });
    }
    
    // Parte del campo de subir archivo
    const [inputDropzone, setInputDropzone] = useState({
        dropzoneOpen: false, // Si está abierta la DropZone o no (dependiendo si clickeó el botón de subir RUT)
        fileUploaded: [], // Archivo RUT subido
    })

    const { dropzoneOpen, fileUploaded  } = inputDropzone

    
    // Cerrar DropzoneDialog
    const DropzoneDialogHandleClose = () => {
        setInputDropzone({ dropzoneOpen: false })
    }
    
    // Guardar archivo subido en el DropzoneDialog
    const DropzoneDialogHandleSave = (file) => {
        setInputDropzone({ dropzoneOpen: false })
        setInputs({ ...inputs, fileUploaded: file })
    }

    // Abrir DropzoneDialog
    const DropzoneDialogHandleOpen = () => {
        setInputDropzone({ dropzoneOpen: true })
    }


    // Al presionar el botón de registrarse
    const onSubmit = async (e) => {
        e.preventDefault();

        //¿Si están todos los campos llenos?
        if (edad !== "" && sexo !== "" && direccion !== "" && fundacion !== "") {
            setLoading(true);
            await axios
                .post(`${process.env.REACT_APP_HOST_BACK}/register`, inputs)
                .then((res) => {
                    const { data } = res;
                    setMessage(data.message);
                    setInputs({ name: "", email: "", password: "", nit: "", businessName: "", edad: "", sexo: "", direccion: " ", discapacidad: " ", tutor: " ", fundacion: " " });
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
                                <FormControlLabel value={false} control={<Radio />} label="No" defaultChecked />
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

                    <div className={styles.inputContainer}>
                        <div className={styles.left}>
                            {fileUploaded ? "Sube aquí tu RUT" : "Archivo RUT cargado" }
                            <Button onClick={() => DropzoneDialogHandleOpen()} >
                                <BsUpload />
                            </Button>
                        </div>
                        <DropzoneDialog
                            open={dropzoneOpen}
                            onSave={(e) => DropzoneDialogHandleSave(e)}
                            acceptedFiles={['application/pdf']}
                            showPreviews={true}
                            maxFileSize={2097152} // Máximo 2 megabytes
                            filesLimit={1} // Máximo puede subir un archivo
                            onClose={() => DropzoneDialogHandleClose()}
                            dialogTitle={"Subir RUT"}
                            cancelButtonText={"Cancelar"}
                            submitButtonText={"Cargar archivo"}
                            dropzoneText={"Click o arrastra para subir archivo"}
                            previewText={"Vista previa:"}
                        />
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

export default RegisterBusinessOwner2