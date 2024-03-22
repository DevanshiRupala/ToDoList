import React, { useState, useEffect } from 'react';
import axios from 'axios';
// Import useNavigate

//import Task from '../components/task';
//import TaskModal from '../components/taskModel';
import '../components/pentask.css';
import { useLocation, useNavigate } from 'react-router-dom';

import 'font-awesome/css/font-awesome.min.css';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate(); // Initialize useNavigate
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    showtasks(email);
  }, [email]);

  function showtasks(email) {
    console.log('Email:', email);
    axios.post("http://localhost:8000/showpentasks", { email })
      .then((res) => {
        const { data } = res;
        setTasks(data);
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
      });
  }

  const acceptTask = (task) => {
    axios.post("http://localhost:8000/accept", { task })
      .then(() => {
        showtasks(email);
      })
      .catch(err => console.error(err));
  };

  const declineTask = (task) => {
    axios.post("http://localhost:8000/decline", { task })
      .then(() => {
        showtasks(email);
      })
      .catch(err => console.error(err));
  };

  const backtohome = () => {
    navigate("/home",{state:{email}});
  }

  return (
    <div className="task-list-container1">
      <div className="task-list-header1">
      <h3 className='noti'>Notification</h3>
      <div className="deva">
          <button className="deva1" onClick={backtohome}>&#9664;</button>
        </div>
        </div>
      <ul className="task-list1">
      {tasks.map((task, index) => (
          <li key={task.id} className="task-item">
            <div className="task-details"> {task.description}
            <div className="task-from">Shared By : {task.from}</div>
            </div>
            <button className= "accept-button" onClick={() => acceptTask(task)}>👍</button>
            <button className= "decline-button" style={{ color: 'red' }} onClick={() => declineTask(task)}>👎</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;
