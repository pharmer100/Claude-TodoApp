# ClaudeTodoapp

A React (Vite) to-do app with projects, tasks, priorities, due dates,
notes and an **Overview** page. Data is stored in the browser's `localStorage`.

## Run it

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # production build in dist/
```

## Features

- **Projects:** create, rename, delete (deleting removes the project's tasks).
- **Tasks:** title, notes/description, priority (High / Medium / Low), optional due date.
  Add tasks with the **+ New task** button, which opens a pop-up (on the Today page it also
  asks which project). Edit, delete, or tick off a task. Completed tasks are hidden behind a **Show completed** toggle.
- **Now / Next / Later:** the Overview page (all projects) and every project page group open
  tasks into three collapsible sections. Each task appears in one section only:
  - **Now:** due today, overdue, or high priority
  - **Next:** due in the next 7 days (after today)
  - **Later:** everything else (no due date, or due later)
  Completed tasks never appear on the Overview. Collapsed sections are remembered.
- Sorting: overdue → due date → priority.
- Modern light design; responsive (the sidebar becomes a slide-out menu and pop-ups become bottom sheets on mobile).

## Structure

```
src/
  storage/
    localStorageRepo.js   ← all persistence lives here (async API)
    index.js              ← picks which repo the app uses
  hooks/useStore.js       ← React state + actions, calls the repo
  lib/dates.js            ← date helpers, sorting, overdue logic
  components/             ← Sidebar, ProjectView, SummaryView, TaskItem, TaskForm, TaskDialog, ConfirmDialog
  App.jsx, styles.css
```

## Moving to Supabase later

The UI never touches `localStorage` directly; it only calls the async methods on
`repo`. To switch backends:

1. Create tables:

```sql
create table projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users default auth.uid(),
  name text not null,
  created_at timestamptz default now()
);

create table tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users default auth.uid(),
  project_id uuid not null references projects(id) on delete cascade,
  title text not null,
  notes text default '',
  priority text not null default 'medium' check (priority in ('high','medium','low')),
  due_date date,
  completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz default now()
);
-- Enable Row Level Security + policies "user_id = auth.uid()" on both tables.
```

2. `npm install @supabase/supabase-js` and write `src/storage/supabaseRepo.js`
   implementing the same methods as `localStorageRepo.js`:
   `listProjects, createProject, updateProject, deleteProject,
   listTasks, createTask, updateTask, deleteTask`.
   Map the snake_case columns (`project_id`, `due_date`, `completed_at`, `created_at`)
   to the camelCase fields the app uses (`projectId`, `dueDate`, `completedAt`, `createdAt`).

3. Change `src/storage/index.js` to `export const repo = supabaseRepo;`.

Existing localStorage data lives under the key `todo-app:v1` and can be read once
and inserted into Supabase as a one-off import.
