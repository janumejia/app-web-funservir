import { Link, useMatch, useResolvedPath, useOutlet, Navigate } from "react-router-dom"
import { useAuth } from "../../Hooks/useAuth";

import styles from "./styles.module.css";

export default function Navbar() {
  const { user } = useAuth();
  const outlet = useOutlet();

  if (user) {
    return <Navigate to="/" />;
  }

  return (
    <div>
      <nav className="nav">
        <Link to="/" className="site-title">
          Funservir
        </Link>
        <ul>
          <CustomLink to="/login">Login</CustomLink>
        </ul>
      </nav>
      {outlet}
    </div>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })

  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}