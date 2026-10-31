import { useEffect } from 'react';
import TaskForm from './TaskForm.jsx';

export default function EditTaskDialog({ task, onSave, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="edit-title">
        <h2 id="edit-title">Edit task</h2>
        <TaskForm
          initial={task}
          submitLabel="Save"
          onCancel={onClose}
          onSubmit={async (values) => {
            await onSave(task.id, values);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
