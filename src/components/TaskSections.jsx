import { useEffect, useState } from 'react';
import TaskItem from './TaskItem.jsx';
import { getSections } from '../lib/dates.js';

const KEY = 'todo-app:collapsed';

function loadCollapsed() {
  try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; }
}

/** Collapsible Now / Next / Later sections. Collapsed state is remembered. */
export default function TaskSections({ tasks, projectName, onOpenProject, onToggle, onEdit, onDelete }) {
  const [collapsed, setCollapsed] = useState(loadCollapsed);

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(collapsed)); } catch { /* ignore */ }
  }, [collapsed]);

  const toggle = (key) => setCollapsed((c) => ({ ...c, [key]: !c[key] }));

  return getSections(tasks).map((s) => {
    const open = !collapsed[s.key];
    return (
      <section key={s.key} className={`group group-${s.key} ${open ? 'open' : ''}`}>
        <button
          className="group-header"
          onClick={() => toggle(s.key)}
          aria-expanded={open}
          aria-controls={`section-${s.key}`}
        >
          <span className="chevron" aria-hidden="true">›</span>
          <span className="group-title">{s.title}</span>
          <span className="group-count">{s.tasks.length}</span>
          <span className="group-hint">{s.hint}</span>
        </button>
        {open && (
          <div id={`section-${s.key}`}>
            {s.tasks.length === 0 ? (
              <p className="group-empty">No tasks here.</p>
            ) : (
              <ul className="task-list">
                {s.tasks.map((t) => (
                  <TaskItem
                    key={t.id}
                    task={t}
                    projectName={projectName?.(t.projectId)}
                    onOpenProject={onOpenProject ? () => onOpenProject(t.projectId) : undefined}
                    onToggle={onToggle}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    );
  });
}
