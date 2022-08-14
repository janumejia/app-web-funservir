import { NavLink } from "./NavLink";
import { Link } from 'react-router-dom';
import { useEffect, useState } from "react";
import axios from "axios";
import "./styles.css"
import { UserContext } from "../../../UserContext";
import { useContext } from "react";
export default function Navbar() {

    const [name, setName] = useState("Iniciar Sesión");
    const {value} = useContext(UserContext);
    const token = localStorage.getItem("token");
    useEffect(() => {
           if (token) {
                axios
                    .get(`${process.env.REACT_APP_HOST_BACK}/user`, {
                        headers: {
                            token: token,
                        },
                    })
                    .then(({ data }) => setName(data.name))
                    .catch((error) => console.error(error));
            }
    }, [value, token]);

    return (
        <nav className="nav">
            <Link to="/" className="site-title">
                Funservir
            </Link>
            <ul>
                <NavLink to="/registerUser">Registrarse</NavLink>
                <NavLink to="/loginUser">{name}</NavLink>
            </ul>
        </nav>
    )
}

// function CustomLink({ to, children }) {
//     const resolvedPath = useResolvedPath(to);
//     const isActive = useMatch({ path: resolvedPath.pathname, end: true });
//     return (
//         <li className={isActive ? "active" : ""}>
//             <Link to={to}>{children}</Link>
//         </li>
//     );
// }
