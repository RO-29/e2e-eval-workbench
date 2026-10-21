import assert from 'node:assert/strict';
import test from 'node:test';
import { taskSummary, validateTask } from '../../src/domain.mjs';

test('validateTask trims a valid title', () => {
  assert.deepEqual(validateTask({ title: '  Ship release  ', priority: 'high' }), {
    ok: true,
    value: { title: 'Ship release', priority: 'high' }
  });
});

test('validateTask rejects a short title', () => {
  assert.deepEqual(validateTask({ title: 'x' }), {
    ok: false,
    error: 'Title must contain at least 3 characters.'
  });
});

test('taskSummary counts open and complete tasks', () => {
  assert.deepEqual(taskSummary([{ done: false }, { done: true }, { done: false }]), {
    total: 3,
    open: 2,
    done: 1
  });
});
