import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Welcome from './views/welcome/Welcome';
import RegisterUser from './views/forms/login/registerUser/RegisterUser'; // Nuevo
import Home from './views/home/Home';
import LoginUser from './views/forms/login';

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
