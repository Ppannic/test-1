import React, { useState } from 'react';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

type Filter = 'all' | 'completed' | 'incomplete';

const TodoApp: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editText, setEditText] = useState('');
  const [filter, setFilter] = useState<Filter>('all');

  const addTask = () => {
    if (newTask.trim() === '') {
      alert('Please enter a task name.');
      return;
    }
    const task: Task = {
      id: Date.now(),
      title: newTask,
      completed: false
    };
    setTasks([task, ...tasks]);
    setNewTask('');
  };

  const toggleTask = (id: number) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, completed: !task.completed } : task
    ));
  };

  const deleteTask = (id: number) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== id));
    }
  };

  const startEdit = (task: Task) => {
    setEditId(task.id);
    setEditText(task.title);
  };

  const saveEdit = (id: number) => {
    if (editText.trim() === '') {
      alert('Task name cannot be empty.');
      return;
    }
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title: editText } : task
    ));
    setEditId(null);
    setEditText('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditText('');
  };

  const filteredTasks = tasks.filter(task => {
    if (filter === 'completed') return task.completed;
    if (filter === 'incomplete') return !task.completed;
    return true;
  });

  const renderTask = (task: Task) => {
    const isEditing = editId === task.id;

    return (
      <div key={task.id} className="task-item">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
            />
            <button className="primary" onClick={() => saveEdit(task.id)}>Save</button>
            <button onClick={cancelEdit}>Cancel</button>
          </>
        ) : (
          <label>
            <input 
              type="checkbox" 
              checked={task.completed} 
              onChange={() => toggleTask(task.id)} 
            />
            <span className={task.completed ? "task-completed" : ""}>
              {task.title}
            </span>
          </label>
        )}
        {!isEditing && (
          <div>
            <button onClick={() => startEdit(task)}>Edit</button>
            <button className="danger" onClick={() => deleteTask(task.id)}>Delete</button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <input 
        type="text" 
        placeholder="Add a new task" 
        value={newTask} 
        onChange={(e) => setNewTask(e.target.value)} 
        onKeyDown={(e) => e.key === 'Enter' && addTask()}
      />
      <button className="primary" onClick={addTask}>Add Task</button>

      <div className="filters">
        <button 
          onClick={() => setFilter('all')} 
          className={filter === 'all' ? 'active' : ''}
        >All Tasks</button>
        <button 
          onClick={() => setFilter('incomplete')} 
          className={filter === 'incomplete' ? 'active' : ''}
        >Incomplete</button>
        <button 
          onClick={() => setFilter('completed')} 
          className={filter === 'completed' ? 'active' : ''}
        >Completed</button>
      </div>

      <div className="group">
        {filteredTasks.map(renderTask)}
      </div>

      <button className="danger" onClick={onLogout}>Logout</button>
    </div>
  );
};

export default TodoApp;
