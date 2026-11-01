import { useState } from 'react';

/**
 * Task fields. When `projects` is passed, a project picker is shown
 * (used when adding a task from the Today page).
 */
export default function TaskForm({ initial, projects, defaultProjectId, onSubmit, onCancel, submitLabel = 'Add task' }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [priority, setPriority] = useState(initial?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [projectId, setProjectId] = useState(defaultProjectId ?? projects?.[0]?.id ?? '');

  const valid = title.trim() && (!projects || projectId);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!valid) return;
    await onSubmit({
      title: title.trim(),
      notes: notes.trim(),
      priority,
      dueDate: dueDate || null,
      ...(projects ? { projectId } : {}),
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label className="field">
        <span>Title</span>
        <input
          id="task-title"
          className="input"
          placeholder="What needs doing?"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </label>

      {projects && (
        <label className="field">
          <span>Project</span>
          <select id="task-project" className="input" value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </label>
      )}

      <div className="field">
        <span>Priority</span>
        <div className="segmented" role="radiogroup" aria-label="Priority">
          {['high', 'medium', 'low'].map((p) => (
            <button
              key={p}
              type="button"
              role="radio"
              aria-checked={priority === p}
              className={`seg p-${p} ${priority === p ? 'on' : ''}`}
              onClick={() => setPriority(p)}
            >
              {p[0].toUpperCase() + p.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <label className="field">
        <span>Due date <em>(optional)</em></span>
        <input id="task-due" className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
      </label>

      <label className="field">
        <span>Notes <em>(optional)</em></span>
        <textarea
          id="task-notes"
          className="input"
          placeholder="Add details, links or a description"
          rows={4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        />
      </label>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn ghost" onClick={onCancel}>Cancel</button>
        )}
        <button type="submit" className="btn primary" disabled={!valid}>{submitLabel}</button>
      </div>
    </form>
  );
}
