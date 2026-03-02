import { test } from 'node:test';
import assert from 'node:assert';
import { greet } from '../index.ts';

test('index file loads without errors and greets', () => {
  const result = greet("Jules");
  assert.strictEqual(result, "Hello Jules via Bun!", 'index.ts loaded and functioned successfully');
});
