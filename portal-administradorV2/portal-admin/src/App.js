import MainComponent from "./components/mainComponent/MainComponent";
import AdminLogin from "./components/adminLogin/AdminLogin";
import { Routes, Route } from "react-router-dom"



function App() {
  return (
    <Routes>
      <Route path="/" element={<AdminLogin/>} />
      <Route path="/dashboard/*" element={<MainComponent/>} />
    </Routes>
  );
}

export default App;
