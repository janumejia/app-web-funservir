import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";

import { TextArea } from '@thumbtack/thumbprint-react'; // Para el text area

const ParametryInclusiveElement = () => {

    // Para actualizar los campos de usuario a medida que el usuario los introduce
    const [inputs, setInputs] = useState({
        name: "",
        desc: "",
    });
    
    const { name, desc } = inputs;
    
    const [message, setMessage] = useState();
    
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    
    // Al haber cambios en alguno de los inputs presentes, ajuste el valor de la variable inmediatamente
    const HandleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    // Al presionar el botón de actualizar
    const onSubmit = async (e) => {
        e.preventDefault();

        //¿Si están todos los campos llenos?
        if (name !== "" && desc !== "") {
            setLoading(true);
            await axios
                .post(`${process.env.REACT_APP_HOST_BACK}/addElement`, inputs)
                .then((res) => {
                    const { data } = res;
                    setMessage(data.message);
                    setInputs({ name: "", desc: "" });
                    setTimeout(() => {
                        setMessage("");
                        // navigate("/loginUser");
                    }, 1500);
                })
                .catch((error) => {
                    console.error(error);
                    setMessage("Upsss, hubo un error... como siempre");
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
                <h2>Agregar elementos inclusivos</h2>
                <form onSubmit={(e) => onSubmit(e)}>
                    <div className={styles.inputContainer}>
                        <div className={styles.left}>
                            <input
                                onChange={(e) => HandleChange(e)}
                                value={name}
                                name="name"
                                id="name"
                                type="text"
                                placeholder="Nombre del elemento inclusivo"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    
                    <div className={styles.inputContainer}>
                        <div className={styles.left}>
                            <textarea
                                rows="10"
                                onChange={(e) => HandleChange(e)}
                                value={desc}
                                name="desc"
                                id="desc"
                                type="text"
                                placeholder="Descripción del elemento inclusivo"
                                autoComplete="off"
                            />
                        </div>
                    </div>
                    <button type="submit">
                        {loading ? "Cargando..." : "Agregar"}
                    </button>
                </form>
            </div>
            {message && <div className={styles.toast}>{message}</div>}
        </>
    );
};

export default ParametryInclusiveElement