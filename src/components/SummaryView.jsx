import TaskItem from './TaskItem.jsx';
import { isDueToday, isOverdue, sortTasks, todayISO } from '../lib/dates.js';

/**
 * Open tasks from every project that are overdue, due today, or high priority.
 * Each task appears in exactly one section (first match wins).
 */
export function getSummaryGroups(tasks) {
  const today = todayISO();
  const open = tasks.filter((t) => !t.completed);
  const overdue = open.filter((t) => isOverdue(t, today));
  const dueToday = open.filter((t) => isDueToday(t, today));
  const high = open.filter((t) => t.priority === 'high' && !isOverdue(t, today) && !isDueToday(t, today));
  return [
    { key: 'overdue', title: 'Overdue', tasks: sortTasks(overdue, today) },
    { key: 'today', title: 'Due today', tasks: sortTasks(dueToday, today) },
    { key: 'high', title: 'High priority', tasks: sortTasks(high, today) },
  ];
}

export default function SummaryView({ projects, tasks, store, onEdit, onDeleteTask, onOpenProject, onNewTask }) {
  const groups = getSummaryGroups(tasks);
  const total = groups.reduce((n, g) => n + g.tasks.length, 0);
  const projectName = (id) => projects.find((p) => p.id === id)?.name ?? 'Unknown project';
  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>Today</h1>
          <p className="subtitle">{dateLabel}</p>
        </div>
        {projects.length > 0 && (
          <div className="header-actions">
            <button className="btn primary add-btn" onClick={onNewTask}>
              <span className="plus" aria-hidden="true">+</span> New task
            </button>
          </div>
        )}
      </header>

      {projects.length === 0 ? (
        <p className="empty">Create a project from the sidebar to get started.</p>
      ) : total === 0 ? (
        <p className="empty">Nothing urgent. No tasks are overdue, due today, or high priority.</p>
      ) : (
        groups
          .filter((g) => g.tasks.length > 0)
          .map((g) => (
            <div key={g.key} className={`group group-${g.key}`}>
              <h2 className="group-title">
                {g.title} <span className="muted">{g.tasks.length}</span>
              </h2>
              <ul className="task-list">
                {g.tasks.map((t) => (
                  <TaskItem
                    key={t.id}
                    task={t}
                    projectName={projectName(t.projectId)}
                    onOpenProject={() => onOpenProject(t.projectId)}
                    onToggle={store.toggleTask}
                    onEdit={onEdit}
                    onDelete={onDeleteTask}
                  />
                ))}
              </ul>
            </div>
          ))
      )}
    </section>
  );
}
