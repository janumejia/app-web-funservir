import axios from "axios";

axios.defaults.withCredentials = true; // Para que se envíe la cookie de sesión para cada petición, en caso que la tenga

export default axios;