import { useState } from 'react';

/**
 * Used both for adding a task (compact) and editing one (full).
 * `initial` pre-fills the fields; `onSubmit` receives the cleaned values.
 */
export default function TaskForm({ initial, onSubmit, onCancel, submitLabel = 'Add task', compact = false }) {
  const [title, setTitle] = useState(initial?.title ?? '');
  const [notes, setNotes] = useState(initial?.notes ?? '');
  const [priority, setPriority] = useState(initial?.priority ?? 'medium');
  const [dueDate, setDueDate] = useState(initial?.dueDate ?? '');
  const [showNotes, setShowNotes] = useState(!compact || !!initial?.notes);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    await onSubmit({ title: trimmed, notes: notes.trim(), priority, dueDate: dueDate || null });
    if (compact) {
      setTitle('');
      setNotes('');
      setPriority('medium');
      setDueDate('');
      setShowNotes(false);
    }
  };

  return (
    <form className={`task-form ${compact ? 'compact' : ''}`} onSubmit={handleSubmit}>
      <input
        className="input title-input"
        placeholder="Task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        autoFocus={!compact}
        aria-label="Task title"
      />
      {showNotes ? (
        <textarea
          className="input"
          placeholder="Notes / description (optional)"
          rows={compact ? 2 : 4}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          aria-label="Notes"
        />
      ) : (
        <button type="button" className="link-btn" onClick={() => setShowNotes(true)}>
          + Add notes
        </button>
      )}
      <div className="form-row">
        <label className="field">
          <span>Priority</span>
          <select className="input" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </label>
        <label className="field">
          <span>Due date</span>
          <input className="input" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        </label>
        <div className="form-actions">
          {onCancel && (
            <button type="button" className="btn ghost" onClick={onCancel}>
              Cancel
            </button>
          )}
          <button type="submit" className="btn primary" disabled={!title.trim()}>
            {submitLabel}
          </button>
        </div>
      </div>
    </form>
  );
}
