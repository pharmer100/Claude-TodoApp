import { useState } from 'react';
import TaskForm from './TaskForm.jsx';
import TaskItem from './TaskItem.jsx';
import { sortTasks } from '../lib/dates.js';

export default function ProjectView({ project, tasks, store, onEdit, onDeleteTask, onDeleted, askConfirm }) {
  const [renaming, setRenaming] = useState(false);
  const [name, setName] = useState(project.name);
  const [showCompleted, setShowCompleted] = useState(false);

  const projectTasks = tasks.filter((t) => t.projectId === project.id);
  const active = sortTasks(projectTasks.filter((t) => !t.completed));
  const completed = projectTasks
    .filter((t) => t.completed)
    .sort((a, b) => (b.completedAt ?? '').localeCompare(a.completedAt ?? ''));

  const saveName = async (e) => {
    e?.preventDefault();
    const trimmed = name.trim();
    if (trimmed && trimmed !== project.name) await store.renameProject(project.id, trimmed);
    else setName(project.name);
    setRenaming(false);
  };

  const deleteProject = () => {
    const n = projectTasks.length;
    askConfirm({
      title: `Delete "${project.name}"?`,
      message: n
        ? `This also deletes its ${n} task${n === 1 ? '' : 's'}. This can't be undone.`
        : "This can't be undone.",
      confirmLabel: 'Delete project',
      onConfirm: async () => {
        await store.removeProject(project.id);
        onDeleted();
      },
    });
  };

  const itemProps = { onToggle: store.toggleTask, onEdit, onDelete: onDeleteTask };

  return (
    <section className="view">
      <header className="view-header">
        {renaming ? (
          <form onSubmit={saveName} className="rename">
            <input
              className="input h1-input"
              value={name}
              autoFocus
              onChange={(e) => setName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === 'Escape' && (setName(project.name), setRenaming(false))}
              aria-label="Project name"
            />
          </form>
        ) : (
          <h1 className="editable" onClick={() => setRenaming(true)} title="Click to rename">
            {project.name}
          </h1>
        )}
        <div className="header-actions">
          <button className="btn ghost" onClick={() => setRenaming(true)}>Rename</button>
          <button className="btn ghost danger" onClick={deleteProject}>Delete</button>
        </div>
      </header>

      <TaskForm compact onSubmit={(values) => store.addTask({ ...values, projectId: project.id })} />

      {active.length === 0 ? (
        <p className="empty">{completed.length ? 'All done here. 🎉' : 'No tasks yet. Add your first one above.'}</p>
      ) : (
        <ul className="task-list">
          {active.map((t) => (
            <TaskItem key={t.id} task={t} {...itemProps} />
          ))}
        </ul>
      )}

      {completed.length > 0 && (
        <div className="completed-section">
          <label className="toggle">
            <input type="checkbox" checked={showCompleted} onChange={(e) => setShowCompleted(e.target.checked)} />
            <span>Show completed ({completed.length})</span>
          </label>
          {showCompleted && (
            <ul className="task-list">
              {completed.map((t) => (
                <TaskItem key={t.id} task={t} {...itemProps} />
              ))}
            </ul>
          )}
        </div>
      )}
    </section>
  );
}
