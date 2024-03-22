import axios from 'axios';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import '../components/otp.css';
import { Toaster, toast } from 'react-hot-toast';

const Reset = () => {
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();

  const [Pass, setPass] = useState("");

  const setVal = (e) => {
    setPass(e.target.value);
  };

  const sendPass = (e) => {
    e.preventDefault();
    console.log(Pass);
    if(Pass.length < 8)
    {
      toast('Password length should be greater or equal to 8', {
        duration: 2000, 
        position: 'top-center', 
        style: {
          backgroundColor: 'blue', 
          width: '390px'
        },
      })
    }
    else{
    axios.post("http://localhost:8000/sendPass", { Pass, email })
      .then(res => {
        if(res.status === 200){
        console.log(res);
        toast('Password changed successfully', {
          duration: 2000, 
          position: 'top-center', 
          style: {
            backgroundColor: 'blue',
          },
        })
        setTimeout(() => {navigate("/")}, 2000);
        }
        else{
          toast('Please try again', {
            duration: 2000, 
            position: 'top-center', 
            style: {
              backgroundColor: 'blue',
            },
          })
        }
      })
      .catch(err => { 
        console.error(err);
      });
    }
  }

  return (
    <>
    <Toaster/>
          <div className="center1">
        <h1>Reset Password</h1>
        <form method="post" onSubmit={sendPass}>
          <div className="txt_field1">
          <label>Enter Password</label>
            <input type="password" name="pass" onChange={setVal} required />
          </div>
          <input type="submit" value="Reset" className='verify'/><br></br><br></br> 
        </form></div>
    </>
  );
}

export default Reset;
