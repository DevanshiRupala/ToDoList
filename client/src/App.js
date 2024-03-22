import Login from "./components/login";
import Register from "./components/register";
import {Routes,Route,BrowserRouter as Router} from 'react-router-dom';
import Home from "./components/home";
import Fpass from "./components/fpassword";
import Otp from "./components/otp";
import Reset from "./components/reset";
import Pentask from "./components/pentask";
import Chart from "./components/charts";
import Protected from "./components/protect";

function App() {

  return (
    <>
    <Routes>
      <Route path="/" element={<Login />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/home"  element={<Protected Cmp = {Home}/>}/>
      <Route path="/fpassword" element={<Fpass />}/>
      <Route path="/enterOtp" element={<Otp/>}/>
      <Route path="/reset" element={<Reset/>}/>
      <Route path="/logout" element={<Reset/>}/>
      <Route path="/verification" element={<Reset/>}/>
      <Route path="/pentask"  element={<Protected Cmp = {Pentask}/>}/>
      <Route path="/showchart"  element={<Protected Cmp = {Chart}/>}/>
    </Routes>
    </>
  );
}

export default App;
