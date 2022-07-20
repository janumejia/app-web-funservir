import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Login from './views/Login';
import Register from './views/Register';
import Welcome from './views/Welcome';
import RegisterUser from './views/RegisterUser'; // Nuevo
import Home from './views/Home';
import LoginUser from './views/inputs/BasicForm'

import styles from "./App.module.scss" 

const App = () => {
  return <BrowserRouter>
    <div className={styles.container}>
      <Routes>
        {/* <Route path="/" element={<Register />} /> */}
        <Route path="/" element={<Home />} />
        <Route path="/loginUser" element={<LoginUser />} />
        <Route path="/welcome" element={<Welcome />} />
        <Route path="/registerUser" element={<RegisterUser />} />
      </Routes>
    </div>
  </BrowserRouter>
}

export default App;
