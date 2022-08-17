import Navbar from "./Components/Navbar"
import ProtectedNavbar from "./Components/ProtectedNavbar"
import { Routes, Route } from "react-router-dom"
import Login from './views/admin-login/login/'
import Home from './views/home/Home'
import ParametryInclusiveElement from './views/parametryInclusiveElement'
// import ParametryEditUser from "./views/parametryEditUser";
import ParametryAddCategory from "./views/parametryAddCategory"
import { ProtectedRoute } from "./Components/ProtectedRoute"; // Para que un usuario no logueado no acceda a rutas no permitida

import styles from './App.module.scss';

function App() {
  return (
    <>
      <Navbar />
      <div className={styles.container}>
      <Routes>
        <Route element={<Navbar />}>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
        </Route>

        <Route path="/dashboard" element={<ProtectedNavbar />}>
          <Route path="add-inclusive-element" element={<ParametryInclusiveElement />} />
          <Route path="add-category" element={<ParametryAddCategory />} />
        </Route>
      </Routes>
        
        
        
        {/* <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/add-inclusive-element" element={
            <ProtectedRoute>
              <ParametryInclusiveElement />
            </ProtectedRoute>
          } />
          <Route path="/add-category" element={
            <ProtectedRoute>
              <ParametryAddCategory />
            </ProtectedRoute>
          } />
        </Routes> */}
      </div>
    </>
  );
}

export default App;
