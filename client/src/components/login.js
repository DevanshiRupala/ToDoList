import {NavLink, useNavigate} from 'react-router-dom'
import {useState} from 'react'
import React from 'react' 
import axios from 'axios'
import "./login.css"
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { Toaster, toast } from 'react-hot-toast';

const MySwal = withReactContent(Swal)


const Login = () =>{

  const [input, setInput] = useState({
    email:"",
    password:""
});

const navigate = useNavigate();

const setVal = (e)=>{
  const {name,value} = e.target;
  setInput(()=>
  {
      return{
          ...input,[name]:value
      }
  })
};

const checkUserdata = (e)=>{
  e.preventDefault();
  const {email,password} = input;

  if(email === "")
  toast('Enter valid cradentials', {
    duration: 3000, 
    position: 'top-center', 
    style: {
      backgroundColor: 'blue',
      width: '250px', 
    },
  })
  else if(! email.includes("@"))
  toast('Enter valid cradentials', {
    duration: 3000, 
    position: 'top-center', 
    style: {
      backgroundColor: 'blue',
      width: '250px', 
    },
  })
  else if(password === "")
  toast('Enter valid cradentials', {
    duration: 3000, 
    position: 'top-center', 
    style: {
      backgroundColor: 'blue',
      width: '250px', 
    },
  })
  else if(password.length < 8)
  toast('Enter valid cradentials', {
    duration: 3000, 
    position: 'top-center', 
    style: {
      backgroundColor: 'blue',
      width: '250px', 
    },
  })
  else
    {
      axios.post("http://localhost:8000/",{email,password})
          .then(res => {
            console.log(res.data);
            localStorage.setItem('login',true);
            if(res.data){
              toast('Logged in successfully', {
                duration: 1000, 
                position: 'top-center', 
                style: {
                  backgroundColor: 'green', 
                  width: '250px',
                },
              })
              setTimeout(() => {navigate("/home", {state:{email}});}, 2000);
            }
          })
          .catch((err) => toast('Enter valid cradentials', {
            duration: 3000, 
            position: 'top-center', 
            style: {
              backgroundColor: 'blue', 
              width: '250px',
            },
          }))
    }
}

return(
  <>
  <Toaster/>
    <section className="custom-page">
        <div className="container">
            <div className="left-column">
                <img src="https://tecdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/draw2.webp" alt="Sample image" className="custom-image"/>
            </div>

            <div className="right-column3">
                <form onSubmit={checkUserdata}>
                    <br/><br/><br/>
                    
                    <input type="email" name="email" placeholder="Email address" className="custom-input mb-8" onChange={setVal}  required/>
                    
                    <input type="password" name="password" placeholder="Password" className="custom-input mb-8" onChange={setVal}  required/>

                    <input type="submit" value="Login" className="custom-button"></input>

                    <p className="custom-acc"><br/>
                        Don't have an account? <NavLink to="/register">Register</NavLink>
                    </p><br/>
                    <p className='forgot'><NavLink to="/fpassword" >Forgot password?</NavLink></p>
                </form>
            </div>
        </div>
    </section>
  </>
  );
}
  

export default Login;
