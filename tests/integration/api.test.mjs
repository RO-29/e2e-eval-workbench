import assert from 'node:assert/strict';
import test from 'node:test';
import { createAppServer } from '../../src/server.mjs';

async function withServer(run) {
  const server = createAppServer();
  await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
  const { port } = server.address();
  try {
    await fetch(`http://127.0.0.1:${port}/api/reset`, { method: 'POST' });
    await run(`http://127.0.0.1:${port}`);
  } finally {
    await new Promise((resolve) => server.close(resolve));
  }
}

test('API creates and lists a task', async () => {
  await withServer(async (baseUrl) => {
    const created = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'Check the API', priority: 'high' })
    });
    assert.equal(created.status, 201);

    const list = await fetch(`${baseUrl}/api/tasks`).then((response) => response.json());
    assert.equal(list.tasks[0].title, 'Check the API');
    assert.deepEqual(list.summary, { total: 1, open: 1, done: 0 });
  });
});

test('API rejects invalid input', async () => {
  await withServer(async (baseUrl) => {
    const response = await fetch(`${baseUrl}/api/tasks`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title: 'x' })
    });
    assert.equal(response.status, 400);
    assert.deepEqual(await response.json(), { error: 'Title must contain at least 3 characters.' });
  });
});
