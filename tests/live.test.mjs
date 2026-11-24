import test from 'node:test';
import assert from 'node:assert/strict';
import { meetingURL, renamedFileName, shareableURL } from '../dist/live-utils.js';
test('meeting handoff only accepts recognised HTTPS invitations', () => {
  assert.ok(meetingURL('https://us02web.zoom.us/j/123456789?pwd=test'));
  assert.ok(meetingURL('https://meet.google.com/abc-defg-hij'));
  for (const value of ['javascript:alert(1)','https://zoom.us.example.com/j/123','https://zoom.us@other.example/j/123','https://zoom.us/redirect','http://zoom.us/j/123','https://meet.google.com/unknown']) assert.equal(meetingURL(value), null);
});
test('renamed copy retains file extension and rejects unsafe names', () => {
  assert.equal(renamedFileName('original.pdf','My report'),'My report.pdf');
  assert.equal(renamedFileName('original.pdf','report.pdf'),'report.pdf');
  assert.equal(renamedFileName('README','new'),'new');
  for (const name of ['../bad','CON','bad:name','x\\y','bad.','']) assert.equal(renamedFileName('file.txt', name),null);
});
test('copy link accepts HTTPS only and rejects URL credentials', () => {
  assert.equal(shareableURL('https://example.org/a'),'https://example.org/a');
  assert.equal(shareableURL('javascript:alert(1)'),null);
  assert.equal(shareableURL('https://a:b@example.org/'),null);
});
