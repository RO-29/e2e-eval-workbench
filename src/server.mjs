import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { taskSummary, validateTask } from './domain.mjs';
import { createStore } from './store.mjs';

const root = fileURLToPath(new URL('../public/', import.meta.url));
const store = createStore();
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8'
};

async function readJson(request) {
  const chunks = [];
  for await (const chunk of request) chunks.push(chunk);
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function json(response, status, body) {
  response.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  response.end(JSON.stringify(body));
}

export function createAppServer() {
  return createServer(async (request, response) => {
    const url = new URL(request.url, 'http://localhost');

    if (request.method === 'GET' && url.pathname === '/health') {
      return json(response, 200, { status: 'ok' });
    }

    if (request.method === 'GET' && url.pathname === '/api/tasks') {
      const tasks = store.list();
      return json(response, 200, { tasks, summary: taskSummary(tasks) });
    }

    if (request.method === 'POST' && url.pathname === '/api/tasks') {
      try {
        const result = validateTask(await readJson(request));
        if (!result.ok) return json(response, 400, { error: result.error });
        return json(response, 201, { task: store.create(result.value) });
      } catch {
        return json(response, 400, { error: 'Request body must contain valid JSON.' });
      }
    }

    const toggleMatch = url.pathname.match(/^\/api\/tasks\/([^/]+)\/toggle$/);
    if (request.method === 'PATCH' && toggleMatch) {
      const task = store.toggle(toggleMatch[1]);
      if (!task) return json(response, 404, { error: 'Task was not found.' });
      return json(response, 200, { task });
    }

    if (request.method === 'POST' && url.pathname === '/api/reset') {
      store.reset();
      return json(response, 200, { status: 'reset' });
    }

    if (request.method === 'GET') {
      const relativePath = url.pathname === '/' ? 'index.html' : url.pathname.slice(1);
      if (relativePath.includes('..')) return json(response, 400, { error: 'Path is not valid.' });
      try {
        const filePath = join(root, relativePath);
        const content = await readFile(filePath);
        response.writeHead(200, { 'content-type': contentTypes[extname(filePath)] ?? 'application/octet-stream' });
        return response.end(content);
      } catch {
        return json(response, 404, { error: 'Route was not found.' });
      }
    }

    return json(response, 405, { error: 'Method is not allowed.' });
  });
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT ?? 4173);
  createAppServer().listen(port, '127.0.0.1', () => {
    console.log(`Task Lab is ready at http://127.0.0.1:${port}`);
  });
}
