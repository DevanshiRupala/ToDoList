import React, { useState, useEffect } from 'react';
import Task from '../components/task';
import TaskModal from '../components/taskModel';
import '../components/home.css';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import 'font-awesome/css/font-awesome.min.css';
import { Toaster, toast } from 'react-hot-toast';

const Home = () => {
  const categories = ['All Tasks', 'Todays Tasks', 'Important Tasks', 'Completed Tasks', 'Overdue Tasks'];
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All Tasks'); // Default category
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const { email } = location.state || {};
  const navigate = useNavigate();

  useEffect(() => {
    let login = localStorage.getItem('login');
    if (!login) {
      navigate("/");
    }
    axios.post("http://localhost:8000/showtasks", { email })
      .then((res) => {
        const { data } = res;
        setTasks(data);
        filterTasksByCategory(data, selectedCategory); // Initial filtering
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
      });
  }, [email]);

  useEffect(() => {
    filterTasksByCategory(tasks, selectedCategory);
  }, [tasks, selectedCategory]);

  function showtasks(email) {
    axios.post("http://localhost:8000/showtasks", { email })
      .then((res) => {
        const { data } = res;
        setTasks(data);
        filterTasksByCategory(data, selectedCategory);
      })
      .catch((err) => {
        console.error('Error fetching tasks:', err);
      });
  }

  const handleAddTask = (description, date, request, priority) => {
    axios.post("http://localhost:8000/addtask", { email, description, date, request, priority })
      .then(res => {
        toast('Task added Successfully', {
          duration: 2000, // Duration in milliseconds
          position: 'top-center', // Toast position
          style: {
            backgroundColor: 'blue',
            width: '250px', // Custom styling for the toast
          },
        })
        showtasks(email);
      })
      .catch(err => console.error(err));
  };

  const navigateToTaskList = (email) => {
    console.log('Navigating to Task List with email:', email);
    navigate("/pentask", { state: { email } });
  };

  const nevigatetochart = () => {
    navigate("/showchart", { state: { email } });
  };

  const onlogout = () => {
    localStorage.removeItem('login');
    navigate("/");
  };

  const filterTasksByCategory = (tasks, category) => {
    switch (category) {
      case 'All Tasks':
        const tasks1 = tasks.filter((task) => !task.completed );
        setFilteredTasks(tasks1);
        break;
      case 'Todays Tasks':
        const today = new Date();
        const todaysTasks = tasks.filter((task) => {
          const taskDate = new Date(task.dueDate);
          return (
            taskDate.getDate() === today.getDate() &&
            taskDate.getMonth() === today.getMonth() &&
            taskDate.getFullYear() === today.getFullYear() && !task.completed
          );
        });
        setFilteredTasks(todaysTasks);
        break;
      case 'Important Tasks':
        const importantTasks = tasks.filter((task) => task.priority === 'High' && !task.completed);
        setFilteredTasks(importantTasks);
        break;
      case 'Completed Tasks':
        const completedTasks = tasks.filter((task) => task.completed);
        setFilteredTasks(completedTasks);
        break;
      case 'Overdue Tasks':
        const today1 = new Date();
        const overdueTasks = tasks.filter((task) => {
          const taskDate = new Date(task.dueDate);
          return taskDate < today1 && !task.completed;
        });
        setFilteredTasks(overdueTasks);
        break;
      default:
        setFilteredTasks(tasks);
        break;
    }
  };

  return (
    <>
    <Toaster/>
    <div className="image" id="image">
      <div className="app">
        <div className="sidebar">
          <h2>Categories</h2><br></br>
          <ul>
            {categories.map((category, index) => (
              <li key={index} className='vivan' onClick={() => setSelectedCategory(category)}>
                <i className="fa fa-calendar" aria-hidden="true"></i> {category}<br />
              </li>
            ))}
            <li className="fa fa-line-chart" aria-hidden="true" onClick={nevigatetochart}>Analysis</li>
            <br />
            <li onClick={onlogout}><i class="fa fa-power-off"></i> Log out</li>
          </ul>
        </div>
        <div className="task-list">
          <div class="button-container">
            <button onClick={() => setIsModalOpen(true)} className="add-button">
              <i className="fa fa-plus"></i>
            </button>
            <button className="notify" onClick={() => navigateToTaskList(email)}>
              <span className="go-to-task-list-button">&#x1F514;</span>
            </button>
          </div>
          <h2>Tasks</h2><br></br>
          {filteredTasks.map((task, index) => (
            <Task key={index} task={task} showtasks={showtasks} email={email} />
          ))}
        </div>
      </div>

      {isModalOpen ?
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onAddTask={handleAddTask}
        /> : <></>}
    </div>
    </>
  );
};

export default Home;
