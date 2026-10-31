import { useState } from 'react';
import { formatDue, isOverdue, todayISO } from '../lib/dates.js';

const PRIORITY_LABEL = { high: 'High', medium: 'Medium', low: 'Low' };

export default function TaskItem({ task, projectName, onToggle, onEdit, onDelete, onOpenProject }) {
  const [expanded, setExpanded] = useState(false);
  const today = todayISO();
  const overdue = isOverdue(task, today);

  return (
    <li className={`task ${task.completed ? 'done' : ''}`}>
      <input
        type="checkbox"
        className="check"
        checked={task.completed}
        onChange={() => onToggle(task)}
        aria-label={task.completed ? `Mark "${task.title}" as not done` : `Mark "${task.title}" as done`}
      />
      <div className="task-body">
        <div className="task-title">{task.title}</div>
        <div className="task-meta">
          <span className={`badge p-${task.priority}`}>{PRIORITY_LABEL[task.priority]}</span>
          {task.dueDate && (
            <span className={`due ${overdue ? 'overdue' : ''} ${task.dueDate === today ? 'today' : ''}`}>
              {overdue ? 'Overdue · ' : ''}
              {formatDue(task.dueDate, today)}
            </span>
          )}
          {projectName && (
            <button className="project-tag" onClick={onOpenProject}>
              {projectName}
            </button>
          )}
          {task.notes && (
            <button className="link-btn small" onClick={() => setExpanded((v) => !v)}>
              {expanded ? 'Hide notes' : 'Notes'}
            </button>
          )}
        </div>
        {expanded && task.notes && <p className="notes">{task.notes}</p>}
      </div>
      <div className="task-actions">
        <button className="icon-btn" onClick={() => onEdit(task)} aria-label="Edit task" title="Edit">
          ✎
        </button>
        <button className="icon-btn danger" onClick={() => onDelete(task)} aria-label="Delete task" title="Delete">
          ✕
        </button>
      </div>
    </li>
  );
}
