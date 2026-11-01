import { useEffect } from 'react';
import TaskForm from './TaskForm.jsx';

/** Pop-up used for both adding and editing a task. */
export default function TaskDialog({ title, task, projects, defaultProjectId, submitLabel, onSubmit, onClose }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="dialog" role="dialog" aria-modal="true" aria-labelledby="task-dialog-title">
        <div className="dialog-head">
          <h2 id="task-dialog-title">{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">✕</button>
        </div>
        <TaskForm
          initial={task}
          projects={projects}
          defaultProjectId={defaultProjectId}
          submitLabel={submitLabel}
          onCancel={onClose}
          onSubmit={async (values) => {
            await onSubmit(values);
            onClose();
          }}
        />
      </div>
    </div>
  );
}
