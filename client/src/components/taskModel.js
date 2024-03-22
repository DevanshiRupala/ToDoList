import React, { useState } from 'react';
import './taskModel.css';

const TaskModal = ({ isOpen, onClose, onAddTask }) => {
  const [taskDescription, setTaskDescription] = useState('');
  const [taskdate, setTaskDate] = useState('');
  const [taskrequest, setTaskrequest] = useState('');
  const [priority, setTaskPriority] = useState("Medium");

  const handleAddTask = () => {
    
    onAddTask(taskDescription, taskdate, taskrequest, priority );
    setTaskDescription('');
    setTaskDate('');
    setTaskrequest('');
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'show' : ''}`}>
      <div className="modal-container">
        <span className="modal-close-button" onClick={onClose}>&times;</span>
        <h2 className="modal-header">Add Task</h2>
        <input
          type="text"
          placeholder="Task description"
          value={taskDescription}
          onChange={(e) => setTaskDescription(e.target.value)}
          className="modal-input"
        />
        <input
          type="date"
          placeholder="Due Date"
          onChange={(e) => setTaskDate(e.target.value)}
          className="modal-input"
        />
          <input
          type="email"
          placeholder="sent request to a friend"
          onChange={(e) => setTaskrequest(e.target.value)}
          className="modal-input"
        />
        <input
          type="text"
          placeholder=" Set Priority (High,Medium,Low)"
          onChange={(e) => setTaskPriority(e.target.value)}
          className="modal-input"
        />
        <div className="modal-buttons">
          <button className="add-button1" onClick={handleAddTask}>Add</button>
          <button className="cancel-button" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;
