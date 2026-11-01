import { useEffect, useState } from 'react';
import { useStore } from './hooks/useStore.js';
import Sidebar from './components/Sidebar.jsx';
import ProjectView from './components/ProjectView.jsx';
import SummaryView from './components/SummaryView.jsx';
import { getSections } from './lib/dates.js';
import TaskDialog from './components/TaskDialog.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';

const VIEW_KEY = 'todo-app:view';

export default function App() {
  const store = useStore();
  const { projects, tasks, loading, error } = store;
  const [view, setView] = useState(() => {
    try { return localStorage.getItem(VIEW_KEY) || 'summary'; } catch { return 'summary'; }
  });
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [confirming, setConfirming] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // Fall back to the summary if the remembered project no longer exists.
  useEffect(() => {
    if (!loading && view !== 'summary' && !projects.some((p) => p.id === view)) setView('summary');
  }, [loading, view, projects]);

  useEffect(() => {
    try { localStorage.setItem(VIEW_KEY, view); } catch { /* ignore */ }
  }, [view]);

  const select = (v) => {
    setView(v);
    setMenuOpen(false);
  };

  const deleteTask = (task) =>
    setConfirming({
      title: 'Delete task?',
      message: `"${task.title}" will be permanently deleted.`,
      onConfirm: () => store.removeTask(task.id),
    });

  const summaryCount = getSections(tasks)[0].tasks.length; // tasks in Now
  const project = projects.find((p) => p.id === view);
  const viewTitle = project ? project.name : 'Overview';

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <div className={`app ${menuOpen ? 'menu-open' : ''}`}>
      <header className="topbar">
        <button className="icon-btn" onClick={() => setMenuOpen((v) => !v)} aria-label="Toggle menu">
          ☰
        </button>
        <span className="truncate">{viewTitle}</span>
      </header>

      <aside className="sidebar-wrap">
        <div className="brand"><span className="brand-mark" aria-hidden="true">✓</span> ClaudeTodoapp</div>
        <Sidebar
          projects={projects}
          tasks={tasks}
          view={view}
          onSelect={select}
          onAddProject={store.addProject}
          summaryCount={summaryCount}
        />
      </aside>
      {menuOpen && <div className="scrim" onClick={() => setMenuOpen(false)} />}

      <main className="main">
        {error && (
          <div className="error" role="alert">
            {error}
            <button className="link-btn" onClick={store.clearError}>Dismiss</button>
          </div>
        )}
        {project ? (
          <ProjectView
            key={project.id}
            project={project}
            tasks={tasks}
            store={store}
            onEdit={setEditing}
            onDeleteTask={deleteTask}
            onDeleted={() => select('summary')}
            askConfirm={setConfirming}
            onNewTask={() => setAdding(true)}
          />
        ) : (
          <SummaryView
            projects={projects}
            tasks={tasks}
            store={store}
            onEdit={setEditing}
            onDeleteTask={deleteTask}
            onOpenProject={select}
            onNewTask={() => setAdding(true)}
          />
        )}
      </main>

      {editing && (
        <TaskDialog
          title="Edit task"
          task={editing}
          submitLabel="Save changes"
          onSubmit={(values) => store.updateTask(editing.id, values)}
          onClose={() => setEditing(null)}
        />
      )}
      {adding && (
        <TaskDialog
          title={project ? `New task in ${project.name}` : 'New task'}
          projects={project ? undefined : projects}
          submitLabel="Add task"
          onSubmit={(values) => store.addTask(project ? { ...values, projectId: project.id } : values)}
          onClose={() => setAdding(false)}
        />
      )}
      {confirming && <ConfirmDialog {...confirming} onClose={() => setConfirming(null)} />}
    </div>
  );
}
