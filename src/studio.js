import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './public-config.js';
import { CONTRIBUTIONS_OPEN } from './studio-config.js';
import { curated, packs, draftKey, validatePractice } from '../dist/practice-data.js';

const $ = id => document.getElementById(id);
const status = (id, text) => { $(id).textContent = text; };
const reasons = { unclear:'Unclear instructions', unsafe:'Safety or privacy concern', outdated:'Outdated information', other:'Other' };
const el = (tag, text) => {
  const node = document.createElement(tag);
  if (text !== undefined) node.textContent = text;
  return node;
};
const action = (label, onClick) => {
  const button = el('button',label);
  button.className = 'btn btn-secondary'; button.type = 'button';
  button.addEventListener('click', onClick);
  return button;
};
const formatDate = value => new Intl.DateTimeFormat('en',{dateStyle:'medium'}).format(new Date(value));
const memory = new Map();
const sessionStorageOnly = {
  getItem(key) { try { return sessionStorage.getItem(key); } catch { return memory.get(key) ?? null; } },
  setItem(key, value) { try { sessionStorage.setItem(key,value); } catch { memory.set(key,value); } },
  removeItem(key) { try { sessionStorage.removeItem(key); } catch { memory.delete(key); } },
};
let client;
let user;
let reviewer = false;
let authRevision = 0;
let community = [];
let editing;
let submittedBusy = false;
const completions = new Set();
let drafts = [];
try {
  const saved = JSON.parse(localStorage.getItem(draftKey) || '[]');
  if (Array.isArray(saved)) drafts = saved.slice(0,20).flatMap(draft => {
    if (!draft || typeof draft.id !== 'string') return [];
    const {item} = validatePractice(draft);
    return item ? [{...item,id:draft.id}] : [];
  });
} catch { /* Curated practices still work. */ }

function practiceCard(item, source) {
  const card = el('article');
  card.className = `studio-card pack-${item.pack}`;
  const label = el('p',packs[item.pack]); label.className = 'studio-pack';
  card.append(label, el('h3',item.title), el('p',item.goal));
  if (item.example) card.append(el('p','Labelled example · no link to open'));
  const details = el('details');
  details.append(el('summary','Open practice'));
  const steps = el('ol');
  for (const step of item.steps) steps.append(el('li',step));
  const check = el('p'); check.append(el('strong','Check your result'), el('br'), document.createTextNode(item.success_check));
  details.append(steps,check);
  if (item.tool) {
    const link = el('a','Open the real tool'); link.href = `index.html#${item.tool}`;
    link.className = 'btn btn-primary'; details.append(link);
    const last = Number(sessionStorageOnly.getItem(`samajh-tool-${item.tool}`));
    if (last > 0 && Date.now() - last < 60 * 60 * 1000) details.append(el('p',`This browser recorded: ${item.event}. Check the result above.`));
  }
  if (source !== 'review') {
    const done = action(completions.has(item.id) ? 'Checked by you' : 'I checked my result', event => {
      completions.add(item.id); event.currentTarget.textContent = 'Checked by you'; event.currentTarget.disabled = true;
    });
    done.disabled = completions.has(item.id); details.append(done);
  }
  if (source === 'community') {
    const credit = item.credit ? `${item.credit} · ` : '';
    details.append(el('p',`${credit}Reviewed ${formatDate(item.reviewed_at)}`));
    if (user) details.append(reportControls(item));
    else if (CONTRIBUTIONS_OPEN) {
      const signIn = el('a','Sign in to report an issue'); signIn.href = '#contributor'; details.append(signIn);
    }
  }
  card.append(details);
  return card;
}

function renderLibrary() {
  const selected = $('pack-filter').value;
  const matching = item => selected === 'all' || item.pack === selected;
  $('curated').replaceChildren(...curated.filter(matching).map(item => practiceCard(item,'curated')));
  $('community').replaceChildren(...community.filter(matching).map(item => practiceCard(item,'community')));
  if (community.length) status('community-message', community.some(matching) ? '' : 'No reviewed community practices in this pack yet.');
}

function reportControls(item) {
  const panel = el('details'); panel.append(el('summary','Report an issue'));
  const label = el('label','Reason '); const select = el('select');
  for (const [value,title] of Object.entries(reasons)) select.add(new Option(title,value));
  label.append(select);
  const message = el('p'); message.setAttribute('role','status');
  const button = action('Submit report', async () => {
    if (!user || button.disabled) return;
    button.disabled = true;
    try {
      const {error} = await client.from('practice_reports').insert({practice_id:item.id,reason:select.value});
      message.textContent = error?.code === '23505' ? 'You already reported this practice.' : error ? 'Report could not be saved.' : 'Report sent for review.';
      if (error && error.code !== '23505') button.disabled = false;
    } catch { message.textContent = 'Connection unavailable.'; button.disabled = false; }
  });
  panel.append(label,button,message);
  return panel;
}

for (const [value,title] of Object.entries(packs)) {
  $('pack-filter').add(new Option(title,value)); $('draft-pack').add(new Option(title,value));
}
$('pack-filter').addEventListener('change',renderLibrary);

function renderSteps(values) {
  $('draft-steps').replaceChildren(...values.map((value,index) => {
    const label = el('label',`Step ${index+1}`);
    const field = el('input'); field.className = 'text-field'; field.maxLength = 220; field.value = value;
    label.append(field); return label;
  }));
  $('add-step').disabled = values.length >= 5;
}
const getSteps = () => [...$('draft-steps').querySelectorAll('input')].map(input => input.value);
function openDraft(item) {
  editing = item?.id;
  $('practice-form').reset();
  $('draft-pack').value = item?.pack || 'files';
  $('draft-title').value = item?.title || '';
  $('draft-goal').value = item?.goal || '';
  $('draft-check').value = item?.success_check || '';
  $('draft-credit').value = item?.credit || '';
  renderSteps(item?.steps || ['','','']); status('draft-status','');
}
function readForm() {
  const result = validatePractice({pack:$('draft-pack').value,title:$('draft-title').value,goal:$('draft-goal').value,
    steps:getSteps(),success_check:$('draft-check').value,credit:$('draft-credit').value});
  if (result.error) status('draft-status',result.error);
  return result.item;
}
function saveDrafts(next) {
  try { localStorage.setItem(draftKey,JSON.stringify(next)); }
  catch { status('draft-status','Browser storage is unavailable or full. Copy your text before leaving.'); return false; }
  drafts = next; renderDrafts(); return true;
}
function renderDrafts() {
  $('draft-list').replaceChildren(...drafts.map(draft => {
    const card = practiceCard(draft,'draft');
    card.append(action('Edit', () => { openDraft(draft); $('draft-title').focus(); }),action('Delete', () => {
      if (!confirm(`Delete the local draft “${draft.title}”?`)) return;
      if (saveDrafts(drafts.filter(item => item.id !== draft.id))) {
        if (editing === draft.id) openDraft();
        status('draft-status','Private draft deleted.');
      }
    }));
    return card;
  }));
  if (!drafts.length) $('draft-list').append(el('p','No private drafts yet.'));
}
$('add-step').addEventListener('click', () => {
  const steps = getSteps(); if (steps.length < 5) { renderSteps([...steps,'']); $('draft-steps').querySelector('label:last-child input').focus(); }
});
$('new-draft').addEventListener('click', () => { openDraft(); $('draft-title').focus(); });
$('practice-form').addEventListener('submit', event => {
  event.preventDefault();
  const item = readForm(); if (!item) return;
  if (!editing && drafts.length >= 20) { status('draft-status','Delete an older draft to save a new one.'); return; }
  const id = editing || crypto.randomUUID();
  if (saveDrafts([{...item,id},...drafts.filter(draft => draft.id !== id)])) {
    editing = id; status('draft-status','Private draft saved on this browser.');
  }
});

async function loadCommunity() {
  try {
    const {data,error} = await client.from('community_practices').select('id,pack,title,goal,steps,success_check,credit,reviewed_at').order('reviewed_at',{ascending:false}).limit(60);
    if (error) throw error;
    community = data;
    status('community-message',data.length ? '' : 'No community practices have been published yet.');
    renderLibrary();
  } catch { status('community-message','The community library could not load. Curated practices are still available.'); }
}

async function loadAccount(revision) {
  const id = user?.id;
  if (!id) return;
  const [mine, access] = await Promise.all([
    client.from('practice_submissions').select('title,status,created_at').eq('owner_id',id).order('created_at',{ascending:false}).limit(30),
    client.from('practice_reviewers').select('user_id').eq('user_id',id).maybeSingle(),
  ]);
  if (revision !== authRevision) return;
  $('submission-list').replaceChildren(...(mine.error ? [el('li','Submissions could not be loaded.')] : mine.data.map(item => el('li',`${item.title} · ${item.status} · ${formatDate(item.created_at)}`))));
  if (!mine.error && !mine.data.length) $('submission-list').append(el('li','No submissions yet.'));
  reviewer = Boolean(access.data);
  $('reviewer').hidden = !reviewer;
  if (reviewer) await loadReview(revision);
}

async function loadReview(revision) {
  const [pending,reports] = await Promise.all([
    client.from('practice_submissions').select('id,pack,title,goal,steps,success_check,credit').eq('status','pending').order('created_at').limit(40),
    client.from('practice_reports').select('practice_id,reason,created_at,community_practices(title)').order('created_at').limit(60),
  ]);
  if (revision !== authRevision) return;
  $('review-list').replaceChildren(...(pending.data || []).map(item => {
    const card = practiceCard(item,'review');
    card.append(el('p',item.credit ? `Requested credit: ${item.credit}` : 'No public credit requested.'),action('Publish', () => review(item.id,'publish')),action('Decline', () => review(item.id,'decline')));
    return card;
  }));
  if (!pending.data?.length) $('review-list').append(el('p',pending.error ? 'Queue could not be loaded.' : 'No pending submissions.'));
  const grouped = new Map();
  for (const report of reports.data || []) {
    if (!grouped.has(report.practice_id)) grouped.set(report.practice_id,{title:report.community_practices?.title || 'Practice',reasons:[]});
    grouped.get(report.practice_id).reasons.push(reasons[report.reason]);
  }
  $('report-list').replaceChildren(...[...grouped].map(([id,item]) => {
    const card = el('article'); card.className = 'studio-card';
    card.append(el('h4',item.title),el('p',item.reasons.join(', ')),action('Archive practice', () => review(id,'archive')),action('Dismiss reports', () => dismissReports(id)));
    return card;
  }));
  if (!grouped.size) $('report-list').append(el('p',reports.error ? 'Reports could not be loaded.' : 'No unresolved reports.'));
}

let reviewBusy = false;
async function review(id,decision) {
  if (reviewBusy || !reviewer || !confirm(`Confirm decision: ${decision} this practice?`)) return;
  reviewBusy = true;
  try {
    const {error} = await client.rpc('review_practice',{practice:id,decision});
    if (error) throw error;
    status('review-status','Review saved.'); await Promise.all([loadCommunity(),loadAccount(authRevision)]);
  } catch { status('review-status','Review was not saved. Refresh the queue and try again.'); }
  finally { reviewBusy = false; }
}
async function dismissReports(id) {
  if (reviewBusy || !reviewer || !confirm('Dismiss the reports on this practice?')) return;
  reviewBusy = true;
  try {
    const {error} = await client.from('practice_reports').delete().eq('practice_id',id);
    if (error) throw error;
    status('review-status','Reports dismissed.'); await loadReview(authRevision);
  } catch { status('review-status','Reports were not dismissed.'); }
  finally { reviewBusy = false; }
}

$('submit-practice').addEventListener('click', async () => {
  if (!user || submittedBusy) return;
  const item = readForm(); if (!item || !confirm('Submit this plain-text practice for review? If approved, the content and optional credit will be public.')) return;
  submittedBusy = true; $('submit-practice').disabled = true;
  try {
    const {error} = await client.from('practice_submissions').insert(item);
    status('draft-status',error?.code === '23514' ? 'Check the fields and your pending or daily submission limit.' : error ? 'Submission could not be saved.' : 'Submitted. It stays private while the review is pending.');
    if (!error) await loadAccount(authRevision);
  } catch { status('draft-status','Connection unavailable. Your draft was not submitted.'); }
  finally { submittedBusy = false; $('submit-practice').disabled = !user; }
});

openDraft(); renderDrafts(); renderLibrary();
if (SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY) {
  client = createClient(SUPABASE_URL,SUPABASE_PUBLISHABLE_KEY,{auth:{flowType:'pkce',storage:sessionStorageOnly,storageKey:'samajh-studio-auth',persistSession:CONTRIBUTIONS_OPEN,detectSessionInUrl:CONTRIBUTIONS_OPEN}});
  loadCommunity();
}

if (client && CONTRIBUTIONS_OPEN) {
  client.auth.onAuthStateChange((_event,session) => {
    user = session?.user; const revision = ++authRevision;
    reviewer = false; $('reviewer').hidden = true;
    $('studio-sign-in').hidden = !!user;
    $('studio-sign-out').hidden = !user;
    $('my-submissions').hidden = !user;
    $('contribution-hint').hidden = !!user;
    $('submission-list').replaceChildren();
    $('submit-practice').disabled = !user || submittedBusy;
    status('studio-auth-status',user ? 'Signed in for this tab. You can now submit practices for review.' : 'Sign in by email to submit or report practices. Private drafts and curated practices don’t require an account.');
    renderLibrary();
    if (user) setTimeout(() => loadAccount(revision).catch(() => status('studio-auth-status','Could not load contribution permissions.')),0);
  });
  $('studio-sign-in').addEventListener('submit',async event => {
    event.preventDefault();
    const button = event.currentTarget.querySelector('button'); button.disabled = true;
    try {
      const redirect = new URL('studio.html',location.href).href;
      const {error} = await client.auth.signInWithOtp({email:$('studio-email').value.trim(),options:{emailRedirectTo:redirect}});
      status('studio-auth-status',error ? 'Sign-in email could not be sent. You can still use practices and drafts.' : 'Check your inbox. Open the sign-in link in this same tab so your session can be verified.');
    } catch { status('studio-auth-status','Sign-in service is unavailable.'); }
    finally { button.disabled = false; }
  });
  $('studio-sign-out').addEventListener('click',async () => {
    try { const {error} = await client.auth.signOut({scope:'local'}); if (error) throw error; }
    catch { status('studio-auth-status','Could not sign out. Close this tab on a shared device.'); }
  });
} else {
  status('contribution-hint','Community submissions are opening after contributor sign-in is ready.');
  status('studio-auth-status','Contributor sign-in is paused while we set up the launch. You can use the library and save private drafts now.');
  if (!client) status('community-message','The community library is not configured.');
}
