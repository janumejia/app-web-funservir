import React from 'react';
import {useState} from 'react';
import { Routes, Route} from "react-router-dom"

// Importación de componentes para las rutas del sistema
import Home from './views/home/Home';
import LoginUser from './views/forms/login';
import RegisterUser from './views/forms/registerUser/RegisterUser';
import RegisterBusinessOwner from './views/forms/registerBusinessOwner';
import { UserContext } from './UserContext';
import Navbar from './components/commons/Navbar/Navbar'
import styles from "./App.module.scss"

const App = () => {
  const [value, setValue] = useState();
  return (
    <>
    <UserContext.Provider value={{value,setValue}}>
      <Navbar />
        <div className={styles.container}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loginUser" element={<LoginUser />} />
            <Route path="/registerUser" element={<RegisterUser />} />
            <Route path="/registerBusinessOwner" element={<RegisterBusinessOwner />} />
          </Routes>
        </div>
        </UserContext.Provider>
    </>
  )
}

export default App;
