import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import RegisterBusinessOwner2 from "../registerBusinessOwner2";

import styles from "./styles.module.scss";

const RegisterBusinessOwner = () => {

    // Para actualizar los campos de usuario a medida que el usuario los introduce
    const [inputs, setInputs] = useState({
        email: "",
        name: "",
        nit: "",
        businessName: "",
        password: "",
        confirmPassword: "",
        childComponents: false
    });

    // Los elementos el obj inputs ya han sido modificados, y los extrae para ajustarlos en el textfield
    const { name, email, nit, businessName, password, confirmPassword } = inputs;

    const [message, setMessage] = useState();
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const HandleChange = (e) => {
        setInputs({ ...inputs, [e.target.name]: e.target.value });
    };

    // Al presionar el botón de registrarse
    const onSubmit = async (e) => {
        e.preventDefault();

        // ¿Si están todos los campos llenos?
        if (name !== "" && email !== "" && nit !== "" && businessName !== "" && password !== "" && confirmPassword !== "") {

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
                <h2>Registrarse como dueño de sitio</h2>
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
                                value={nit}
                                name="nit"
                                id="nit"
                                type="text"
                                placeholder="Nit"
                                autoComplete="off"
                            />
                        </div>
                    </div>

                    <div className={styles.inputContainer}>
                        <div className={styles.left}>
                            <input
                                onChange={(e) => HandleChange(e)}
                                value={businessName}
                                name="businessName"
                                id="businessName"
                                type="text"
                                placeholder="Razón social"
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
                </form>
            </div>
                {message && <div className={styles.toast}>{message}</div>}
            </> : <RegisterBusinessOwner2 usuario={inputs} />}
        </>
    )
}

export default RegisterBusinessOwner