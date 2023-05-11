import { createContext, useState, useEffect } from "react";
import axios from '../api/axios';

const UncheckedSitesContext = createContext({});

export const UncheckedSitesProvider = ({ children }) => {
    const [amount, setAmount] = useState(0);

    const updateUncheckedSites = async () => {
        const res = await axios('/notification', { headers: { 'token': localStorage.getItem("token") } })
        setAmount(res.data);
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                await updateUncheckedSites();
            } catch (error) {
                console.log("error en provider UncheckedSitesContext");
            }
        };
        fetchData();
    }, []);

    return (
        <UncheckedSitesContext.Provider
            value={{
                amount,
                setAmount,
                updateUncheckedSites
            }}>
            {children}
        </UncheckedSitesContext.Provider>
    )
}

export default UncheckedSitesContext;