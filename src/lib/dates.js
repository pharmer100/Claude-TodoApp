/** Dates are stored as 'YYYY-MM-DD' strings in the user's local time zone. */
export function todayISO() {
  const d = new Date();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}-${m}-${day}`;
}

export function isOverdue(task, today = todayISO()) {
  return !task.completed && !!task.dueDate && task.dueDate < today;
}

export function isDueToday(task, today = todayISO()) {
  return task.dueDate === today;
}

export function formatDue(dateStr, today = todayISO()) {
  if (!dateStr) return '';
  if (dateStr === today) return 'Today';
  const [y, m, d] = dateStr.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  const [ty, tm, td] = today.split('-').map(Number);
  const diff = Math.round((date - new Date(ty, tm - 1, td)) / 86400000);
  if (diff === 1) return 'Tomorrow';
  if (diff === -1) return 'Yesterday';
  return date.toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'short',
    ...(y !== ty ? { year: 'numeric' } : {}),
  });
}

const PRIORITY_RANK = { high: 0, medium: 1, low: 2 };

/** Overdue first, then by due date (no date last), then by priority. */
export function sortTasks(tasks, today = todayISO()) {
  return [...tasks].sort((a, b) => {
    const ao = isOverdue(a, today) ? 0 : 1;
    const bo = isOverdue(b, today) ? 0 : 1;
    if (ao !== bo) return ao - bo;
    const ad = a.dueDate ?? '9999-99-99';
    const bd = b.dueDate ?? '9999-99-99';
    if (ad !== bd) return ad < bd ? -1 : 1;
    return PRIORITY_RANK[a.priority] - PRIORITY_RANK[b.priority];
  });
}
