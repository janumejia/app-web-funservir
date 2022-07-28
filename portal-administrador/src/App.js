import { Routes, Route } from "react-router-dom"
import Login from './views/admin-login/login/'
import Home from './home/Home'
import styles from './App.module.scss';

function App() {
  return (
    <>
        <div className={styles.container}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
          </Routes>
        </div>
    </>
  );
}

export default App;
