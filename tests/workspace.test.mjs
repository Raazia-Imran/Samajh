import test from 'node:test';
import assert from 'node:assert/strict';
import { findTasks, tasks, translate } from '../dist/workspace-copy.js';

test('English task descriptions resolve real tool IDs, not fictional lessons', () => {
  assert.equal(findTasks('I want to rename a PDF')[0].id, 'rename');
  assert.equal(findTasks('Share my screen in a meeting')[0].id, 'screen-preview');
  assert.equal(findTasks('My MICROPHONE is not working')[0].id, 'device');
  assert.deepEqual(findTasks('Find a restaurant'), []);
});

test('real tools have distinct routes and labels in each dashboard language', () => {
  assert.equal(new Set(tasks.map(task => task.id)).size, tasks.length);
  for (const task of tasks) assert.equal(task.title.length, 3);
  assert.equal(translate('profile', 'ur'), 'پروفائل');
  assert.equal(translate('activity', 'roman'), 'Meri sargarmiyan');
});
