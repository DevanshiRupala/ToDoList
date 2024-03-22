import {NavLink, useNavigate} from 'react-router-dom'
import {useState} from 'react'
import React from 'react' 
import axios from 'axios'
import "./register.css"
import { Toaster, toast } from 'react-hot-toast';

const Register = () =>{

  const [input, setInput] = useState({
              name:"",
              email:"",
              password:"",
              phno:""
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
    
        const addUserdata = async (e)=>{
            e.preventDefault();
            const {fname,email,password} = input;
    
            if(fname === "")
              alert("Please enter your name");
            else if(email === "")
              alert("Please enter your email");
            else if(! email.includes("@"))
              alert("Enter valid email");
            else if(password === "")
              alert("enter password");
            else if(password.length < 8)
              alert("password must be greater than or equal to 8 character");
            else{
              axios.post("http://localhost:8000/register",{fname,email,password})
              .then(res => {
                toast('Registered Successfully', {
                  duration: 3000, 
                  position: 'top-center', 
                  style: {
                    backgroundColor: 'green',
                    width: '250px', 
                  },
                })
                setTimeout(() => {navigate("/home", {state:{email}});}, 4000);
              })
              .catch(err => console.log(err))
            }
         }
    return(
      <>
      <Toaster/>
<section className="custom-page">
        <div className="container">
            <div className="left-column1">
                <img src="https://stacks.rocks/site/templates/assets-old/images/user/login.svg" alt="Sample image" className="custom-image1"/>
            </div>

            <div className="right-column4">
                <form onSubmit={addUserdata}>
                    <br/><br/><br/>
                    <input type="text" name="fname" placeholder="Username" className="custom-input mb-8" onChange={setVal}  required/>
                    <input type="email" name="email" placeholder="Email address" className="custom-input mb-8" onChange={setVal}  required/>
                    
                    <input type="password" name="password" placeholder="Password" className="custom-input mb-8" onChange={setVal}  required/>
                   

                    <input type="submit" value="Register" className="custom-button1"></input>

                    <p className="custom-acc1"><br/>
                        Already have an account? <NavLink to="/">Login
                        </NavLink>
                    </p><br/>
                </form>
            </div>
        </div>
    </section>
</>
  );
}
  
 export default Register;