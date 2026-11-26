import test from 'node:test';
import assert from 'node:assert/strict';
import { findTasks, tasks, translate } from '../dist/workspace-copy.js';
import { toolGuides } from '../dist/tool-guides.js';

test('English task descriptions resolve real tool IDs, not fictional lessons', () => {
  assert.equal(findTasks('I want to rename a PDF')[0].id, 'rename');
  assert.equal(findTasks('Share my screen in a meeting')[0].id, 'screen-preview');
  assert.equal(findTasks('My MICROPHONE is not working')[0].id, 'device');
  for (const [message,id] of [
    ['Find a download','downloads'],
    ['Who can see my Google Drive file?','access-check'],
    ['Email with an attachment','email-draft'],
    ['My Wi-Fi has no internet','phone-internet'],
    ['Take a screenshot','phone-screenshot'],
    ['Suspicious link','message-safety'],
  ]) assert.equal(findTasks(message)[0].id,id);
  assert.deepEqual(findTasks('Find a restaurant'), []);
});

test('real tools have distinct routes and labels in each dashboard language', () => {
  assert.equal(new Set(tasks.map(task => task.id)).size, tasks.length);
  assert.equal(tasks.length,12);
  for (const task of tasks) {
    assert.equal(task.title.length,3);
    const guide = toolGuides[task.id];
    assert.equal(guide.answers.length,3);
    assert.ok(guide.answers.every(line => line.length === 3 && line.every(Boolean)));
    if (task.guide) assert.ok(guide.steps?.length || guide.choices?.length);
  }
  assert.equal(translate('profile', 'ur'), 'پروفائل');
  assert.equal(translate('activity', 'roman'), 'Meri sargarmiyan');
});
