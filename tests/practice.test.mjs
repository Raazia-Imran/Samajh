import { test } from 'node:test';
import assert from 'node:assert/strict';
import { curated, packs, validatePractice } from '../dist/practice-data.js';
import { tasks } from '../dist/workspace-copy.js';

test('one curated practice per tool uses supported packs', () => {
  assert.equal(curated.length,12);
  assert.deepEqual(new Set(curated.map(item=>item.tool)),new Set(tasks.map(task=>task.id)));
  assert.equal(new Set(curated.map(item=>item.id)).size,12);
  for (const practice of curated) {
    assert.ok(packs[practice.pack]);
    assert.ok(validatePractice(practice).item);
    const task = tasks.find(task=>task.id === practice.tool);
    assert.equal(Boolean(practice.event),Boolean(task.event));
  }
  assert.equal(curated.find(item=>item.id === 'spot-link').example,true);
});

test('author input is length-limited, plain text, and cannot supply identity or publication state', () => {
  const practice = curated[0];
  const {item} = validatePractice({...practice,status:'published',owner_id:'someone-else',credit:' Helper '});
  assert.equal(item.credit,'Helper');
  assert.deepEqual(Object.keys(item),['pack','title','goal','steps','success_check','credit']);
  for (const input of [{...practice,title:'<em>Test</em>'},{...practice,steps:['one','two']},
    {...practice,goal:'Use https://example.invalid'}, {...practice,steps:['first','second','x'.repeat(221)]}]) {
    assert.ok(validatePractice(input).error);
  }
});
