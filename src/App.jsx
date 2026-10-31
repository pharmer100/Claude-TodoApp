import { useEffect, useState } from 'react';
import { useStore } from './hooks/useStore.js';
import Sidebar from './components/Sidebar.jsx';
import ProjectView from './components/ProjectView.jsx';
import SummaryView, { getSummaryGroups } from './components/SummaryView.jsx';
import EditTaskDialog from './components/EditTaskDialog.jsx';
import ConfirmDialog from './components/ConfirmDialog.jsx';

const VIEW_KEY = 'todo-app:view';

export default function App() {
  const store = useStore();
  const { projects, tasks, loading, error } = store;
  const [view, setView] = useState(() => {
    try { return localStorage.getItem(VIEW_KEY) || 'summary'; } catch { return 'summary'; }
  });
  const [editing, setEditing] = useState(null);
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

  const summaryCount = getSummaryGroups(tasks).reduce((n, g) => n + g.tasks.length, 0);
  const project = projects.find((p) => p.id === view);
  const viewTitle = project ? project.name : 'Today';

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
        <div className="brand">Tasks</div>
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
          />
        ) : (
          <SummaryView
            projects={projects}
            tasks={tasks}
            store={store}
            onEdit={setEditing}
            onDeleteTask={deleteTask}
            onOpenProject={select}
          />
        )}
      </main>

      {editing && (
        <EditTaskDialog task={editing} onSave={store.updateTask} onClose={() => setEditing(null)} />
      )}
      {confirming && <ConfirmDialog {...confirming} onClose={() => setConfirming(null)} />}
    </div>
  );
}
