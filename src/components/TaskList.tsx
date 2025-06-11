import React from 'react';
import Swal from 'sweetalert2';

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
  const handleDelete = (id: number) => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you really want to delete this task?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        deleteTask(id);
        Swal.fire({
          icon: 'success',
          title: 'Task deleted successfully',
          showConfirmButton: false,
          timer: 1500,
        });
      }
    });
  };

  const handleSave = (id: number) => {
    if (editText.trim() === '' || editDescription.trim() === '') {
      Swal.fire({
        icon: 'warning',
        title: 'Please enter both title and description',
        confirmButtonText: 'OK',
      });
      return;
    }

    saveEdit(id);

    Swal.fire({
      icon: 'success',
      title: 'Task updated successfully',
      timer: 1500,
      showConfirmButton: false,
    });
  };

  const handleViewDetail = (task: Task) => {
    Swal.fire({
      title: `<strong>${task.title}</strong>`,
      html: `<pre style="text-align:left; white-space:pre-wrap;">${task.description}</pre>`,
      icon: 'info',
      confirmButtonText: 'Close',
    });
  };

  return (
    <div className="task-list">
      {tasks.map((task) =>
        editId === task.id ? (
          <div key={task.id} className="task-item">
            <div className="task-edit">
              <input
                type="text"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
                placeholder="Edit title"
              />
              <textarea
                rows={3}
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                placeholder="Edit description"
              />
            </div>
            <div className="task-buttons">
              <button className="primary" onClick={() => handleSave(task.id)}>Save</button>
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
                <div className="task-description">
                  <div className="description-snippet">{task.description}</div>
                  <button className="view-detail-btn" onClick={() => handleViewDetail(task)}>
                    View Details
                  </button>
                </div>
              </div>
            </div>
            <div className="task-buttons">
              <button className="primary" onClick={() => startEdit(task)}>Edit</button>
              <button className="danger" onClick={() => handleDelete(task.id)}>Delete</button>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default TaskList;
