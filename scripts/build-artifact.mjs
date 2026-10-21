import { mkdir, readFile, writeFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const template = await readFile(new URL('artifact/template.html', root), 'utf8');
const reusableEvalPage = await readFile(new URL('pages/reusable-eval.html', root), 'utf8');
const video = await readFile(new URL('video/task-lab-demo.mp4', root));
const poster = await readFile(new URL('video/task-lab.png', root));
const output = template
  .replace('__VIDEO_BASE64__', video.toString('base64'))
  .replace('__POSTER_BASE64__', poster.toString('base64'));

await mkdir(new URL('dist/', root), { recursive: true });
await mkdir(new URL('dist/reusable-eval/', root), { recursive: true });
await writeFile(new URL('artifact/e2e-eval-workbench.html', root), output);
await writeFile(new URL('dist/index.html', root), output);
await writeFile(new URL('dist/reusable-eval/index.html', root), reusableEvalPage);
console.log(new URL('artifact/e2e-eval-workbench.html', root).pathname);
