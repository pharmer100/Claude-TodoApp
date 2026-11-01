import TaskSections from './TaskSections.jsx';

/** Overview: open tasks from every project, grouped into Now / Next / Later. */
export default function SummaryView({ projects, tasks, store, onEdit, onDeleteTask, onOpenProject, onNewTask }) {
  const projectName = (id) => projects.find((p) => p.id === id)?.name ?? 'Unknown project';
  const dateLabel = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });
  const openCount = tasks.filter((t) => !t.completed).length;

  return (
    <section className="view">
      <header className="view-header">
        <div>
          <h1>Overview</h1>
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
        <div className="empty"><p>Create a project from the sidebar to get started.</p></div>
      ) : openCount === 0 ? (
        <div className="empty">
          <p>No open tasks across your projects.</p>
          <button className="btn soft" onClick={onNewTask}>+ Add a task</button>
        </div>
      ) : (
        <TaskSections
          tasks={tasks}
          projectName={projectName}
          onOpenProject={onOpenProject}
          onToggle={store.toggleTask}
          onEdit={onEdit}
          onDelete={onDeleteTask}
        />
      )}
    </section>
  );
}
