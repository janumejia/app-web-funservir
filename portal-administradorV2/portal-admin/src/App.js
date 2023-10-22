import MainComponent from "./components/mainComponent/MainComponent";
import AdminLogin from "./components/adminLogin/AdminLogin";
import { Routes, Route } from "react-router-dom"
import RequireAuth from "./components/adminLogin/RequireAuth";

function App() {

  return (
    <Routes>
      {/* Ruta pública */}
      <Route path="/" element={<AdminLogin />} />

      {/* Rutas protegidas */}
     {/* <Route element={<RequireAuth />}> */}
        <Route path="/dashboard/*" element={<MainComponent />} />
      {/* </Route> */}
      {/* Debemos crear una componente para las rutas desconocidas: 404 */}
    </Routes>
  );
}

export default App;