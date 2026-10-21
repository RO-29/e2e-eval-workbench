import { readFile } from 'node:fs/promises';
import { validateTask } from '../src/domain.mjs';

const cases = JSON.parse(await readFile(new URL('./cases.json', import.meta.url), 'utf8'));
let earned = 0;
let available = 0;
const results = [];

for (const item of cases) {
  const actual = validateTask(item.input);
  const expected = item.expected;
  const acceptedMatches = actual.ok === expected.accepted;
  const outputMatches = actual.ok
    ? actual.value.title === expected.title && actual.value.priority === expected.priority
    : actual.error.includes(expected.errorIncludes);
  const passed = acceptedMatches && outputMatches;
  available += item.weight;
  if (passed) earned += item.weight;
  results.push({ name: item.name, passed, weight: item.weight });
}

const score = earned / available;
const report = { score, threshold: 0.9, passed: score >= 0.9, results };
console.log(JSON.stringify(report, null, 2));
if (!report.passed) process.exitCode = 1;
