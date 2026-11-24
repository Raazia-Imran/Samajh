import test from 'node:test';
import assert from 'node:assert/strict';
import { savedAttemptRows } from '../src/cloud-records.js';
test('cloud import is explicit and strips private or invalid fields', () => {
  const record={id:'mic',transfer:false,hints:0,at:'2026-11-24T12:00:00Z',note:'never upload this',user_id:'somebody-else'};
  assert.deepEqual(savedAttemptRows(JSON.stringify({consent:false,records:[record]})),[]);
  assert.deepEqual(savedAttemptRows(JSON.stringify({consent:true,records:[record,record,{...record,id:'not-real'},{...record,hints:-1}]})),[{task_id:'mic',transfer:false,hints:0,completed_at:'2026-11-24T12:00:00.000Z'}]);
  assert.deepEqual(savedAttemptRows('bad json'),[]);
});
