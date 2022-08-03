import {NavLink} from "./NavLink";
import {Link} from 'react-router-dom';
import axios from "axios";
import { useEffect, useState } from "react";
import "./styles.css"

export default function Navbar() {

    const [name, setName] = useState("");
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
    },);

    return (
        <nav className="nav">
            <Link to="/" className="site-title">
                Funservir
            </Link>
            <ul>
                <NavLink to="/registerUser">Registrarse</NavLink>
                <NavLink to="/loginUser">{name ? name : "Iniciar Sesión"}</NavLink>
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
