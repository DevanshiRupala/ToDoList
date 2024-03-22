import axios from 'axios'
import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import "../components/fpassword.css";
import { Toaster, toast } from 'react-hot-toast';

const Pass = () => {
    
  const [input, setInput] = useState({
    email:"",
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
    const sendEmail = (e) =>
    {
      e.preventDefault();
      const {email} = input;
      axios.post("http://localhost:8000/sendEmail",{email})
      .then(res => {
        console.log(res);
        if(res)
        {
          toast('Email sent successfully', {
            duration: 2000, // Duration in milliseconds
            position: 'top-center', // Toast position
            style: {
              backgroundColor: 'blue',
              width: '250px', // Custom styling for the toast
            },
          })
          setTimeout(() => {navigate("/enterOtp",{state:{email}})},2000);
        }
      })
      .catch(err => console.log(err))
    }

    return (
      <>
      {/* <div class="center">
      <h1>Enter Email</h1>
      <form method="post" onSubmit={sendEmail}>
        <div className="txt_field">
          <input type="email" name="email" onChange={setVal} required />
          <span></span>
          <label>Email</label>
        </div>
        <div className="pass"></div>
        <input type="submit" value="Send Email"/><br></br><br></br>
      </form>
    </div> */}
    {/* <div className="right-column">
    <p>Enter Email</p>
                <form onSubmit={sendEmail}>
                    <br/><br/><br/>
                    <input type="email" name="email" placeholder="Email address" className="custom-input mb-8" onChange={setVal}  required/>
                    <input type="submit" value="Login" className="custom-button"></input>
                </form>
            </div> */}
<Toaster/>
<section className="custom-page">
        <div className="container">
            {/* <div className="left-column">
                <img src="https://i.pinimg.com/564x/fd/84/d4/fd84d4d8f5ba8f89638bbf309e986682.jpg" alt="Sample image" className="custom-image"/>
            </div> */}

            <div className="right-column">
              <h2 className='geeta'>Forgot Password?</h2>
                <form onSubmit={sendEmail}>

                    <br/><br/>
                    
                    <input type="email" name="email" placeholder="Email address" className="custom-input5 mb-8" onChange={setVal}  required/>
                     
                    <input type="submit" value="Send Email" className="custom-button"></input><br/>
                </form>
            </div>
        </div>
    </section>
    </>
    )
}

export default Pass;