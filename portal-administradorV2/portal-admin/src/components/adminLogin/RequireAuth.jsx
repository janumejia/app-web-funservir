import { useLocation, Navigate, Outlet } from "react-router-dom";
import useAuth  from "../../hooks/useAuth";

const RequireAuth = () => {
    const { auth } = useAuth();
    const location = useLocation();

    // Retornamos un booleano indicando si el usuarios se encuentra logueado o no
    return (
        auth?.userType === "Administrador"
            ? <Outlet />
            : <Navigate to="/" state={{ from:location }} replace />
    );
}

export default RequireAuth;