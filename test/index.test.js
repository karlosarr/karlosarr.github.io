import { test } from 'node:test';
import assert from 'node:assert';
import '../index.ts';

test('index file loads without errors', () => {
  // Simple test to ensure index.ts can be parsed and executed by Node.js
  // and therefore its coverage is tracked in lcov.info.
  assert.ok(true, 'index.ts loaded successfully');
});
