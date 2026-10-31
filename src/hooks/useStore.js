import { useCallback, useEffect, useState } from 'react';
import { repo } from '../storage/index.js';

/**
 * App state backed by the repository. The UI updates immediately after
 * each repository call resolves, so a remote backend (Supabase) works
 * the same way as localStorage.
 */
export function useStore() {
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([repo.listProjects(), repo.listTasks()])
      .then(([p, t]) => {
        setProjects(p);
        setTasks(t);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const run = useCallback(async (fn) => {
    try {
      setError(null);
      return await fn();
    } catch (e) {
      setError(e.message || 'Something went wrong');
    }
  }, []);

  const addProject = (name) =>
    run(async () => {
      const p = await repo.createProject({ name });
      setProjects((list) => [...list, p]);
      return p;
    });

  const renameProject = (id, name) =>
    run(async () => {
      const p = await repo.updateProject(id, { name });
      setProjects((list) => list.map((x) => (x.id === id ? p : x)));
    });

  const removeProject = (id) =>
    run(async () => {
      await repo.deleteProject(id);
      setProjects((list) => list.filter((x) => x.id !== id));
      setTasks((list) => list.filter((t) => t.projectId !== id));
    });

  const addTask = (fields) =>
    run(async () => {
      const t = await repo.createTask(fields);
      setTasks((list) => [...list, t]);
    });

  const updateTask = (id, changes) =>
    run(async () => {
      const t = await repo.updateTask(id, changes);
      setTasks((list) => list.map((x) => (x.id === id ? t : x)));
    });

  const toggleTask = (task) =>
    updateTask(task.id, {
      completed: !task.completed,
      completedAt: task.completed ? null : new Date().toISOString(),
    });

  const removeTask = (id) =>
    run(async () => {
      await repo.deleteTask(id);
      setTasks((list) => list.filter((x) => x.id !== id));
    });

  return {
    projects, tasks, loading, error, clearError: () => setError(null),
    addProject, renameProject, removeProject,
    addTask, updateTask, toggleTask, removeTask,
  };
}
