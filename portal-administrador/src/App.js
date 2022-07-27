import { Routes, Route } from "react-router-dom"
import Login from './views/admin-login/login/'
import styles from './App.module.scss';

function App() {
  return (
    <>
        <div className={styles.container}>
          <Routes>
            <Route path="/" element={<Login/>} />
          </Routes>
        </div>
    </>
  );
}

export default App;
