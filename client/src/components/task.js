import React, {useState} from 'react';
import './task.css';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';

const Task = ({ task , showtasks, email}) => {
  var d="",day="",month="",year="",date="";
  d = new Date(task.dueDate);
  year = d.getFullYear();
  month = d.getMonth()+1;
  day = d.getDate();
  date = day+"-"+month+"-"+year;
  

  const ondelete = (e) =>
  {
    console.log(e);
    axios.post("http://localhost:8000/deletetask", { e })
    .then(res => {
      if (res) {
        console.log(res);
        const email = res.data.email;
        showtasks(email);
      }
    })
    .catch(err => console.error(err));
  };

  


  const completetask = (id) => {
    axios.post("http://localhost:8000/completetask", {id})
    .then(res => {
      if(res) {
        showtasks(email);
      }
    })
  };

  return (
    <>
    <div key={task._id} className="task1">
      <div className="devanshi">{task.description}
      <div >{date}</div></div><br></br>
      
      <button className="buttons" onClick={() => ondelete(task._id)}>
      <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 384 512"><path d="M342.6 150.6c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L192 210.7 86.6 105.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3L146.7 256 41.4 361.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L192 301.3 297.4 406.6c12.5 12.5 32.8 12.5 45.3 0s12.5-32.8 0-45.3L237.3 256 342.6 150.6z"/></svg>
      </button>
      
      <button className="buttons" onClick={() => completetask(task._id)}>
    <svg xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512">
      <path
      fill="none"
        stroke="white"
        strokeWidth="90"
        d="M88 256L208 385L440 160"
      />
    </svg>
  </button>
      
    </div>
    
    </>
  );
};

export default Task;