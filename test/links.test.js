import { test } from 'node:test';
import assert from 'node:assert';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

test('Sidebar files should not contain broken links', () => {
  const sidebarFiles = ['docs/_sidebar.md', 'docs/es-mx/_sidebar.md'];
  const errors = [];

  for (const filepath of sidebarFiles) {
    try {
      const fullPath = resolve(filepath);
      const content = readFileSync(fullPath, 'utf-8');

      // Look for markdown links pointing to /#
      const brokenLinksMatch = content.match(/\[(.*?)\]\(\/#\)/g);

      if (brokenLinksMatch) {
        errors.push(`Found broken links in ${filepath}: ${brokenLinksMatch.join(', ')}`);
      }
    } catch (err) {
      errors.push(`Could not read file ${filepath}: ${err.message}`);
    }
  }

  assert.strictEqual(errors.length, 0, errors.join('\n'));
});
