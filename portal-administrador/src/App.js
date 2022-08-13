import { Routes, Route } from "react-router-dom"
import Login from './views/admin-login/login/'
import Home from './home/Home'
import ParametryInclusiveElement from './views/parametryInclusiveElement'
// import ParametryEditUser from "./views/parametryEditUser";
import ParametryAddCategory from "./views/parametryAddCategory"

import styles from './App.module.scss';

function App() {
  return (
    <>
        <div className={styles.container}>
          <Routes>
            <Route path="/" element={<Home/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/add-inclusive-element" element={<ParametryInclusiveElement/>} />
            {/* <Route path="/parametry-edit-user" element={<ParametryEditUser/>} /> */}
            <Route path="/add-category" element={<ParametryAddCategory /> } />
          </Routes>
        </div>
    </>
  );
}

export default App;
