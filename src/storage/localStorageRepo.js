/**
 * localStorage implementation of the data repository.
 *
 * Every method is async and returns plain objects, so this file can be
 * swapped for a Supabase (or any other backend) implementation with the
 * same method signatures without touching the UI.
 */
const KEY = 'todo-app:v1';

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return { projects: data.projects ?? [], tasks: data.tasks ?? [] };
    }
  } catch (err) {
    console.error('Failed to read saved data', err);
  }
  return { projects: [], tasks: [] };
}

function save(data) {
  try {
    localStorage.setItem(KEY, JSON.stringify(data));
  } catch (err) {
    console.error('Failed to save data', err);
    throw err;
  }
}

const uid = () =>
  globalThis.crypto?.randomUUID?.() ??
  `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;

const now = () => new Date().toISOString();

export const localStorageRepo = {
  // ---- Projects ----
  async listProjects() {
    return load().projects;
  },

  async createProject({ name }) {
    const data = load();
    const project = { id: uid(), name, createdAt: now() };
    data.projects.push(project);
    save(data);
    return project;
  },

  async updateProject(id, changes) {
    const data = load();
    const idx = data.projects.findIndex((p) => p.id === id);
    if (idx === -1) throw new Error('Project not found');
    data.projects[idx] = { ...data.projects[idx], ...changes };
    save(data);
    return data.projects[idx];
  },

  /** Deletes the project and all of its tasks (like ON DELETE CASCADE). */
  async deleteProject(id) {
    const data = load();
    data.projects = data.projects.filter((p) => p.id !== id);
    data.tasks = data.tasks.filter((t) => t.projectId !== id);
    save(data);
  },

  // ---- Tasks ----
  async listTasks() {
    return load().tasks;
  },

  async createTask({ projectId, title, notes = '', priority = 'medium', dueDate = null }) {
    const data = load();
    const task = {
      id: uid(),
      projectId,
      title,
      notes,
      priority,
      dueDate,
      completed: false,
      completedAt: null,
      createdAt: now(),
    };
    data.tasks.push(task);
    save(data);
    return task;
  },

  async updateTask(id, changes) {
    const data = load();
    const idx = data.tasks.findIndex((t) => t.id === id);
    if (idx === -1) throw new Error('Task not found');
    data.tasks[idx] = { ...data.tasks[idx], ...changes };
    save(data);
    return data.tasks[idx];
  },

  async deleteTask(id) {
    const data = load();
    data.tasks = data.tasks.filter((t) => t.id !== id);
    save(data);
  },
};
