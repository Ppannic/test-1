import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import TaskList from './TaskList';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

const TASKS_PER_PAGE = 10;

const Dashboard: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [editId, setEditId] = useState<number | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');

  const [pageAll, setPageAll] = useState(1);
  const [pageIncomplete, setPageIncomplete] = useState(1);
  const [pageCompleted, setPageCompleted] = useState(1);

  const [menuOpen, setMenuOpen] = useState(false);

  const addTask = () => {
    if (newTitle.trim() === '' || newDescription.trim() === '') {
      alert('Please enter both title and description.');
      return;
    }
    const task: Task = {
      id: Date.now(),
      title: newTitle.trim(),
      description: newDescription.trim(),
      completed: false,
    };
    setTasks([task, ...tasks]);
    setNewTitle('');
    setNewDescription('');
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
    setEditTitle(task.title);
    setEditDescription(task.description);
  };

  const saveEdit = (id: number) => {
    if (editTitle.trim() === '' || editDescription.trim() === '') {
      alert('Please enter both title and description.');
      return;
    }
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, title: editTitle.trim(), description: editDescription.trim() } : task
    ));
    setEditId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditTitle('');
    setEditDescription('');
  };

  const allTasks = tasks;
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completedTasks = tasks.filter(task => task.completed);

  const paginate = (items: Task[], page: number) =>
    items.slice((page - 1) * TASKS_PER_PAGE, page * TASKS_PER_PAGE);

  const getPaginationData = (filter: 'all' | 'incomplete' | 'completed') => {
    let filteredTasks: Task[];
    let page: number;
    let setPage: React.Dispatch<React.SetStateAction<number>>;
    if (filter === 'all') {
      filteredTasks = allTasks;
      page = pageAll;
      setPage = setPageAll;
    } else if (filter === 'incomplete') {
      filteredTasks = incompleteTasks;
      page = pageIncomplete;
      setPage = setPageIncomplete;
    } else {
      filteredTasks = completedTasks;
      page = pageCompleted;
      setPage = setPageCompleted;
    }

    const totalPages = Math.ceil(filteredTasks.length / TASKS_PER_PAGE) || 1;
    if (page > totalPages) {
      setPage(1);
      page = 1;
    }
    const paginated = paginate(filteredTasks, page);
    return { paginated, page, totalPages, setPage };
  };

  return (
    <Router>
      <div className="dashboard">
        <button 
          className="hamburger-btn" 
          onClick={() => setMenuOpen(!menuOpen)} 
          aria-label="Toggle menu"
        >
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
          <div className={`bar ${menuOpen ? 'open' : ''}`}></div>
        </button>

        <aside className={`sidebar ${menuOpen ? 'open' : ''}`}>
          <h2>Todo Dashboard</h2>
          <nav>
            <NavLink to="/add" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>Add Task</NavLink>
            <NavLink to="/all" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>All Tasks</NavLink>
            <NavLink to="/incomplete" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>Incomplete</NavLink>
            <NavLink to="/completed" className={({ isActive }) => (isActive ? 'active' : '')} onClick={() => setMenuOpen(false)}>Completed</NavLink>
            <button onClick={onLogout} className="logout-btn">Logout</button>
          </nav>
        </aside>

        <main className="main-content" onClick={() => menuOpen && setMenuOpen(false)}>
          <header className="header">
            <h1>Your Tasks</h1>
          </header>

          <Routes>
            <Route path="/" element={<Navigate to="/add" replace />} />

            <Route
              path="/add"
              element={
                <div className="todo-input-section">
                  <input
                    type="text"
                    placeholder="Task Title"
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                  />
                  <textarea
                    placeholder="Task Description"
                    value={newDescription}
                    onChange={e => setNewDescription(e.target.value)}
                    rows={3}
                  />
                  <button className="primary" onClick={addTask}>Add</button>
                </div>
              }
            />

            <Route
              path="/all"
              element={
                <PaginatedTaskList
                  paginationData={getPaginationData('all')}
                  toggleTask={toggleTask}
                  startEdit={startEdit}
                  deleteTask={deleteTask}
                  editId={editId}
                  editText={editTitle}
                  setEditText={setEditTitle}
                  editDescription={editDescription}
                  setEditDescription={setEditDescription}
                  saveEdit={saveEdit}
                  cancelEdit={cancelEdit}
                />
              }
            />

            <Route
              path="/incomplete"
              element={
                <PaginatedTaskList
                  paginationData={getPaginationData('incomplete')}
                  toggleTask={toggleTask}
                  startEdit={startEdit}
                  deleteTask={deleteTask}
                  editId={editId}
                  editText={editTitle}
                  setEditText={setEditTitle}
                  editDescription={editDescription}
                  setEditDescription={setEditDescription}
                  saveEdit={saveEdit}
                  cancelEdit={cancelEdit}
                />
              }
            />

            <Route
              path="/completed"
              element={
                <PaginatedTaskList
                  paginationData={getPaginationData('completed')}
                  toggleTask={toggleTask}
                  startEdit={startEdit}
                  deleteTask={deleteTask}
                  editId={editId}
                  editText={editTitle}
                  setEditText={setEditTitle}
                  editDescription={editDescription}
                  setEditDescription={setEditDescription}
                  saveEdit={saveEdit}
                  cancelEdit={cancelEdit}
                />
              }
            />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

interface PaginatedTaskListProps {
  paginationData: {
    paginated: Task[];
    page: number;
    totalPages: number;
    setPage: React.Dispatch<React.SetStateAction<number>>;
  };
  toggleTask: (id: number) => void;
  startEdit: (task: Task) => void;
  deleteTask: (id: number) => void;
  editId: number | null;
  editText: string;
  setEditText: React.Dispatch<React.SetStateAction<string>>;
  editDescription: string;
  setEditDescription: React.Dispatch<React.SetStateAction<string>>;
  saveEdit: (id: number) => void;
  cancelEdit: () => void;
}

const PaginatedTaskList: React.FC<PaginatedTaskListProps> = ({
  paginationData,
  toggleTask,
  startEdit,
  deleteTask,
  editId,
  editText,
  setEditText,
  editDescription,
  setEditDescription,
  saveEdit,
  cancelEdit,
}) => {
  const { paginated, page, totalPages, setPage } = paginationData;

  if (paginated.length === 0) return <p>No tasks here.</p>;

  return (
    <>
      <TaskList
        tasks={paginated}
        toggleTask={toggleTask}
        startEdit={startEdit}
        deleteTask={deleteTask}
        editId={editId}
        editText={editText}
        setEditText={setEditText}
        editDescription={editDescription}
        setEditDescription={setEditDescription}
        saveEdit={saveEdit}
        cancelEdit={cancelEdit}
      />

      <div style={{ marginTop: 20, display: 'flex', justifyContent: 'center', gap: 12  , }}>
        <button 
          className="pagination-btn"
          onClick={() => setPage(page - 1)}
          disabled={page === 1}
        >
          Previous
        </button>
        <span style={{ alignSelf: 'center' }}>
          Page {page} of {totalPages}
        </span>
        <button
          className="pagination-btn"
          onClick={() => setPage(page + 1)}
          disabled={page === totalPages}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Dashboard;
