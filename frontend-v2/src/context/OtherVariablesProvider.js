import React, { useEffect, useState } from 'react';
import axios from "../settings/axiosConfig";

// Para usar Context usamos React.createContext() , que retorna un provider y un consumer
export const OtherVariablesContext = React.createContext();

// Componente provider
const OtherVariablesProvider = (props) => {
    const [allElements, setAllElements] = useState([]);
    const [allNeighborhoods, setAllNeighborhoods] = useState([]);
    const [allLocations, setAllLocations] = useState([]);
    const [allCategories, setAllCategories] = useState([]);
    const [allSiteNames, setAllSiteNames] = useState([]);

    // Obtener datos del backend
    useEffect(() => {
        const getVariables = () => {
            axios.get(`${process.env.REACT_APP_HOST_BACK}/siteNames`)
            .then((res) => {
                setAllSiteNames(res.data);
            }).catch((error) => {
                console.error("Error obteniendo datos");
            });

            axios.get(`${process.env.REACT_APP_HOST_BACK}/elements`)
                .then((res) => {
                    setAllElements(res.data);
                }).catch((error) => {
                    console.error("Error obteniendo datos");
                });

            axios.get(`${process.env.REACT_APP_HOST_BACK}/getLocations`)
                .then((res) => {
                    setAllLocations(res.data);
                }).catch((error) => {
                    console.error("Error obteniendo datos");
                });

            axios.get(`${process.env.REACT_APP_HOST_BACK}/getNeighborhoods`)
                .then((res) => {
                    setAllNeighborhoods(res.data);
                }).catch((error) => {
                    console.error("Error obteniendo datos");
                });

            axios.get(`${process.env.REACT_APP_HOST_BACK}/getCategories`)
                .then((res) => {
                    setAllCategories(res.data);
                }).catch((error) => {
                    console.error("Error obteniendo datos");
                });
        }

        getVariables();
    }, []);

    return (
        <OtherVariablesContext.Provider
            value={{
                allElements,
                allNeighborhoods,
                allLocations,
                allCategories,
                allSiteNames,
            }}
        >
            <>{props.children}</>
        </OtherVariablesContext.Provider>
    )
}

export default OtherVariablesProvider;