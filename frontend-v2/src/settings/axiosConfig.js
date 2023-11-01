import axios from "axios";

// Interceptor para ajustar el encabezado "Authorization" de la variable "AWFS_token" del localStorage
axios.interceptors.request.use(
    (config) => {
        const AWFS_token = localStorage.getItem('AWFS-token');
        
        // Verificamos si la variable "AWFS_token" está presente en el localstorage y cumple el formato apropiado
        if (AWFS_token && isJWTValid(AWFS_token)) {
            config.headers.Authorization = `${AWFS_token}`;
        }

        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

const isJWTValid = (token) => {
    if (token !== null && token !== "" && /^([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_=]+)\.([a-zA-Z0-9_\-\+\/=]*)$/.test(token)) return true;
    else return false;
}

export default axios;