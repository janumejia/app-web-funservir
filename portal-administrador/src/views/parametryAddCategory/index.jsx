import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styles from "./styles.module.scss";

import { TextArea } from '@thumbtack/thumbprint-react'; // Para el text area

// const getCategoriesF = async () => {
//     let names = []
//     try {
//         const res = await axios.get(`${process.env.REACT_APP_HOST_BACK}/getCategories`)
//         const arr = res.data
//         arr.forEach(function (element) {
//             names.push(element.name)
//         })
//     } catch (error) {
//         console.error(error)
//     }

//     return await names

// }




const ParametryInclusiveElement = () => {

    const [categories, setCategories] = useState()

    const getAnswer = async () => {
        const { data } = await axios(`${process.env.REACT_APP_HOST_BACK}/getCategories`);
        const arr = data
        let names = []
        arr.forEach(function (element) {
            names.push(element.name)
        })
        console.log(arr)
        setCategories(arr);
    };

    useEffect(() => {
        getAnswer();
    }, []);


    // Para actualizar los campos de usuario a medida que el usuario los introduce
    const [inputs, setInputs] = useState({
        name: "",
    });

    const { name } = inputs;

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
        if (name !== "") {
            setLoading(true);
            await axios
                .post(`${process.env.REACT_APP_HOST_BACK}/addCategory`, inputs)
                .then((res) => {
                    const { data } = res;
                    setMessage(data.message);
                    setInputs({ name: "" });
                    setTimeout(() => {
                        setMessage("");
                        navigate("/add-category");
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
                <h2>Agregar categoría</h2>
                <br />
                <div className={styles.inputContainer}>
                    <table className="table table-striped table-bordered">
                        <h3>Categorías agregadas hasta el momento:</h3>
                        <br />
                        <tbody>
                            {categories && categories.map(element =>
                                <tr key={element._id}>
                                    <td>- {element.name}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <form onSubmit={(e) => onSubmit(e)}>
                    <div className={styles.inputContainer}>
                        <div className={styles.left}>
                            <input
                                onChange={(e) => HandleChange(e)}
                                value={name}
                                name="name"
                                id="name"
                                type="text"
                                placeholder="Nombre de la categoría"
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