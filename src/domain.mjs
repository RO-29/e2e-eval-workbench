export const priorities = new Set(['low', 'medium', 'high']);

export function validateTask(input) {
  const title = typeof input?.title === 'string' ? input.title.trim() : '';
  const priority = input?.priority ?? 'medium';

  if (title.length < 3) return { ok: false, error: 'Title must contain at least 3 characters.' };
  if (title.length > 80) return { ok: false, error: 'Title must contain 80 characters or fewer.' };
  if (!priorities.has(priority)) return { ok: false, error: 'Priority is not valid.' };

  return { ok: true, value: { title, priority } };
}

export function taskSummary(tasks) {
  return {
    total: tasks.length,
    open: tasks.filter((task) => !task.done).length,
    done: tasks.filter((task) => task.done).length
  };
}
