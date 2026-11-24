import { createClient } from '@supabase/supabase-js';
import { TASKS } from '../dist/engine.js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './public-config.js';
import { savedAttemptRows } from './cloud-records.js';

const $ = id => document.getElementById(id);
const titles = new Map(TASKS.map(task => [task.id, task.title]));
let client, user = null, busy = false, version = 0;
function say(text) { $('account-status').textContent = text; }
function clearList() { $('cloud-history').replaceChildren(); $('cloud-empty').textContent = ''; }
function showSession(session) {
  user = session?.user || null;
  version++;
  clearList();
  $('account-heading').textContent = user ? 'Your cloud learning' : 'Sign in by email';
  $('email-form').hidden = !!user;
  $('account-identity').hidden = !user;
  $('account-identity').textContent = user ? `Signed in as ${user.email || 'your account'}` : '';
  $('account-actions').hidden = !user;
  say(user ? 'Signed in. Your cloud history is separate from your browser history.' : 'Enter your email to request a secure sign-in link.');
  if (user) setTimeout(refresh, 0);
}
async function refresh() {
  if (!user) return;
  const current = version;
  const {data,error} = await client.from('learning_attempts').select('task_id,transfer,hints,completed_at').order('completed_at',{ascending:false}).limit(100);
  if (version !== current) return;
  clearList();
  if (error) return say('Cloud history could not be loaded. Please try again.');
  for (const row of data) {
    const li = document.createElement('li');
    li.textContent = `${titles.get(row.task_id) || row.task_id} · ${row.transfer?'Different view':'Guided practice'} · ${row.hints} hints · ${new Date(row.completed_at).toLocaleString()}`;
    $('cloud-history').append(li);
  }
  $('cloud-empty').textContent = data.length ? 'Showing up to the latest 100 observations.' : 'No cloud observations saved yet.';
}
async function run(operation) {
  if (busy) return;
  busy = true;
  try { await operation(); } catch { say('The account request could not be completed. Check your connection and try again.'); }
  finally { busy = false; }
}
if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  say('Cloud learning has not been configured. You can still use the real tools and practice in this browser.');
} else {
  client = createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {auth:{flowType:'pkce',detectSessionInUrl:true}});
  client.auth.onAuthStateChange((event,session) => { if (event !== 'TOKEN_REFRESHED' || !user) showSession(session); });
  $('email-form').addEventListener('submit', event => {
    event.preventDefault(); run(async () => {
      const email = $('account-email').value.trim();
      const redirectTo = `${location.origin}${location.pathname}`;
      say('Requesting a sign-in link…');
      const {error} = await client.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo}});
      say(error ? 'Unable to send a sign-in link. Verify the email and try again later. The email service may need configuration.' : 'Sign-in link requested. Check your inbox and spam folder.');
    });
  });
  $('refresh').onclick = () => run(refresh);
  $('sync').onclick = () => run(async () => {
    if (!user) return;
    let raw; try { raw = localStorage.getItem('samajh-progress'); } catch { return say('Device storage is unavailable.'); }
    const rows = savedAttemptRows(raw);
    if (!rows.length) return say('No saved practice records on this browser. Enable “Remember my progress” in practice settings and complete an attempt first.');
    if (!confirm(`Import ${rows.length} saved observation(s) into the account shown above? Only do this if these are your own records.`)) return;
    const current = version;
    const {error} = await client.from('learning_attempts').upsert(rows.map(row=>({...row,user_id:user.id})),{onConflict:'user_id,task_id,transfer,hints,completed_at',ignoreDuplicates:true});
    if (version !== current) return;
    if (error) return say('Cloud import failed. Your device history is unchanged.');
    say('Import accepted. Existing matching observations were not duplicated.');
    await refresh();
  });
  $('delete-history').onclick = () => run(async () => {
    if (!user || !confirm('Delete all learning observations in this cloud account? Your device history will remain.')) return;
    const current = version;
    const {error} = await client.from('learning_attempts').delete().eq('user_id',user.id);
    if (version !== current) return;
    if (error) return say('Cloud history could not be deleted. Please try again.');
    say('Cloud history deleted. Device history is unchanged.'); await refresh();
  });
  $('sign-out').onclick = () => run(async () => { const {error} = await client.auth.signOut(); if (error) say('Could not sign out. Try again.'); });
}
