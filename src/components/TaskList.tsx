import React from 'react';

interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
}

interface TaskListProps {
  tasks: Task[];
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

const TaskList: React.FC<TaskListProps> = ({
  tasks,
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
  return (
    <div className="task-list">
      {tasks.map(task =>
        editId === task.id ? (
          <div key={task.id} className="task-item">
            <div className="task-edit">
              <input
                type="text"
                value={editText}
                onChange={e => setEditText(e.target.value)}
                placeholder="Edit title"
              />
              <textarea
                rows={3}
                value={editDescription}
                onChange={e => setEditDescription(e.target.value)}
                placeholder="Edit description"
              />
            </div>
            <div className="task-buttons">
              <button className="primary" onClick={() => saveEdit(task.id)}>Save</button>
              <button className="cancel" onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        ) : (
          <div key={task.id} className="task-item">
            <div className="task-left">
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(task.id)}
              />
              <div>
                <div className={task.completed ? 'task-completed' : ''}>{task.title}</div>
                <div className="task-description">{task.description}</div>
              </div>
            </div>
            <div className="task-buttons">
              <button className="primary" onClick={() => startEdit(task)}>Edit</button>
              <button className="danger" onClick={() => deleteTask(task.id)}>Delete</button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TaskList;
