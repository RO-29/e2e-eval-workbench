const form = document.querySelector('#task-form');
const list = document.querySelector('#task-list');
const summary = document.querySelector('#summary');
const empty = document.querySelector('#empty');
const error = document.querySelector('#error');

async function request(path, options) {
  const response = await fetch(path, options);
  const body = await response.json();
  if (!response.ok) throw new Error(body.error ?? 'Request failed.');
  return body;
}

function renderTask(task) {
  const item = document.createElement('li');
  item.dataset.taskId = task.id;
  if (task.done) item.classList.add('done');
  item.innerHTML = `
    <button class="check" aria-label="Mark ${task.title} ${task.done ? 'open' : 'done'}">${task.done ? '✓' : ''}</button>
    <span class="task-title"></span>
    <span class="priority ${task.priority}">${task.priority}</span>
  `;
  item.querySelector('.task-title').textContent = task.title;
  item.querySelector('.check').addEventListener('click', async () => {
    await request(`/api/tasks/${task.id}/toggle`, { method: 'PATCH' });
    await loadTasks();
  });
  return item;
}

async function loadTasks() {
  const body = await request('/api/tasks');
  list.replaceChildren(...body.tasks.map(renderTask));
  summary.textContent = `${body.summary.open} open / ${body.summary.done} done`;
  empty.hidden = body.tasks.length > 0;
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  error.textContent = '';
  const data = new FormData(form);
  try {
    await request('/api/tasks', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: data.get('title'), priority: data.get('priority') })
    });
    form.reset();
    document.querySelector('#title').focus();
    await loadTasks();
  } catch (cause) {
    error.textContent = cause.message;
  }
});

loadTasks().catch((cause) => {
  error.textContent = cause.message;
});
