import axios from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import "../components/otp.css";
import { Toaster, toast } from 'react-hot-toast';

const Otp = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();

  const [input, setInput] = useState({
    otp: ""
  });

  const setVal = (e) => {
    const { name, value } = e.target;
    setInput((prevInput) => ({
      ...prevInput,
      [name]: value
    }));
  };

  const sendOtp = (e) => {
    e.preventDefault();
    const { otp } = input;

    axios.post("http://localhost:8000/sendOtp", { otp, email })
      .then(res => {
        console.log(res);
        navigate("/reset", {state:{email}})
      })
      .catch(err => { 
        toast('Otp is wrong or expired please try again', {
          duration: 2000, 
          position: 'top-center', 
          style: {
            backgroundColor: 'red', 
            width: '390px'
          },
        })
      });
  }

  return (
    <>
    <Toaster/>
        <div className="center1">
        <h1>Otp Verification</h1>
        <form method="post" onSubmit={sendOtp}>
          <div className="txt_field1">
          <label>Enter Otp</label><br></br>
            <input type="text" name="otp" onChange={setVal} required />
          </div>
          <input type="submit" value="Verify" className='verify' /><br></br><br></br> 
        </form></div>
    </>
  );
}

export default Otp;
