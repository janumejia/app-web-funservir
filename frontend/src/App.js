import React from 'react';
import { Routes, Route } from "react-router-dom"
import RegisterUser from './views/forms/registerUser/RegisterUser'; // Nuevo
import Home from './views/home/Home';
import LoginUser from './views/forms/login';
import Navbar from './components/commons/Navbar/Navbar'


import styles from "./App.module.scss"

const App = () => {
  return (
    <>
      <Navbar />
        <div className={styles.container}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/loginUser" element={<LoginUser />} />
            <Route path="/registerUser" element={<RegisterUser />} />
          </Routes>
        </div>
    </>
  )
}

export default App;
