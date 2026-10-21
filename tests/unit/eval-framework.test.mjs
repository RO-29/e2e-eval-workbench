import assert from 'node:assert/strict';
import test from 'node:test';
import { createReport, gradeCriterion, runSuite } from '../../evals/framework/core.mjs';

test('grader reads a nested value and applies its weight', () => {
  const result = gradeCriterion({
    id: 'status', description: 'Status is correct.', path: 'response.status', weight: 2,
    grader: { type: 'equals', expected: 201 }
  }, { response: { status: 201 } });
  assert.equal(result.passed, true);
  assert.equal(result.earned, 2);
});

test('suite score uses all criterion weights', async () => {
  const suite = await runSuite({
    id: 'sample', name: 'Sample', threshold: 0.75,
    cases: [{
      id: 'one', name: 'One', criteria: [
        { id: 'a', description: 'A', path: 'a', weight: 3, grader: { type: 'equals', expected: true } },
        { id: 'b', description: 'B', path: 'b', weight: 1, grader: { type: 'equals', expected: true } }
      ]
    }]
  }, { run: async () => ({ a: true, b: false }) });
  assert.equal(suite.score, 0.75);
  assert.equal(suite.passed, true);
});

test('report fails when a required suite fails', () => {
  const report = createReport([{ earned: 9, available: 10, passed: false, cases: [] }], 0.9);
  assert.equal(report.score, 0.9);
  assert.equal(report.passed, false);
});
