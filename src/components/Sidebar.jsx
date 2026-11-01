import { useState } from 'react';

export default function Sidebar({ projects, tasks, view, onSelect, onAddProject, summaryCount }) {
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);

  const openCount = (id) => tasks.filter((t) => t.projectId === id && !t.completed).length;

  const submit = async (e) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const p = await onAddProject(trimmed);
    setName('');
    setAdding(false);
    if (p) onSelect(p.id);
  };

  return (
    <nav className="sidebar">
      <button className={`nav-item ${view === 'summary' ? 'active' : ''}`} onClick={() => onSelect('summary')}>
        <span>Overview</span>
        {summaryCount > 0 && <span className="count" title="Tasks in Now">{summaryCount}</span>}
      </button>

      <div className="nav-heading">Projects</div>
      {projects.map((p) => (
        <button key={p.id} className={`nav-item ${view === p.id ? 'active' : ''}`} onClick={() => onSelect(p.id)}>
          <span className="truncate">{p.name}</span>
          {openCount(p.id) > 0 && <span className="count">{openCount(p.id)}</span>}
        </button>
      ))}

      {adding ? (
        <form onSubmit={submit} className="new-project">
          <input
            className="input"
            placeholder="Project name"
            value={name}
            autoFocus
            onChange={(e) => setName(e.target.value)}
            onKeyDown={(e) => e.key === 'Escape' && (setAdding(false), setName(''))}
            aria-label="New project name"
          />
          <div className="form-actions">
            <button type="button" className="btn ghost" onClick={() => (setAdding(false), setName(''))}>
              Cancel
            </button>
            <button type="submit" className="btn primary" disabled={!name.trim()}>
              Add
            </button>
          </div>
        </form>
      ) : (
        <button className="nav-item add" onClick={() => setAdding(true)}>
          + New project
        </button>
      )}
    </nav>
  );
}
