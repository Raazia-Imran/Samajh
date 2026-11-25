import { findTasks, languages, tasks, translate } from './workspace-copy.js';

const $ = id => document.getElementById(id);
const defaults = { name: '', language: 'en', large: false, quiet: false, remember: false, welcomed: false };
const profileKey = 'samajh-workspace-profile';
const activityKey = 'samajh-live-activity';
const navItems = [['home','home'],['tools','grid'],['activity','pulse'],['help','heart'],['profile','user']];
const paths = {
  home:'m3 10 9-7 9 7v10h-6v-6H9v6H3Z', grid:'M4 4h6v6H4zm10 0h6v6h-6zM4 14h6v6H4zm10 0h6v6h-6z',
  pulse:'M2 12h5l3-7 4 14 3-7h5', heart:'M20.8 4.8a5 5 0 0 0-7 0L12 6.6l-1.8-1.8a5 5 0 1 0-7 7L12 21l8.8-9.2a5 5 0 0 0 0-7Z',
  user:'M8 7a4 4 0 1 0 8 0 4 4 0 1 0-8 0ZM4 21v-2a5 5 0 0 1 5-5h6a5 5 0 0 1 5 5v2',
  mic:'M9 5a3 3 0 0 1 6 0v7a3 3 0 0 1-6 0Zm-3 5v2a6 6 0 0 0 12 0v-2M12 18v4m-4 0h8',
  screen:'M3 4h18v13H3zm5 17h8m-4-4v4', video:'M3 6h12v12H3zm12 4 6-3v10l-6-3',
  file:'M5 3h9l5 5v13H5zm9 0v6h5M8 13h8m-8 4h6', share:'M12 16V3m-5 5 5-5 5 5M4 13v8h16v-8',
  link:'m10 13 4-4m-6 6-2 2a4 4 0 0 1-6-6l4-4a4 4 0 0 1 6 0m4-1 2-2a4 4 0 1 1 6 6l-4 4a4 4 0 0 1-6 0',
};

function icon(name) {
  const svg = document.createElementNS('http://www.w3.org/2000/svg','svg');
  svg.setAttribute('viewBox','0 0 24 24');
  svg.setAttribute('width','22'); svg.setAttribute('height','22');
  svg.setAttribute('fill','none'); svg.setAttribute('stroke','currentColor');
  svg.setAttribute('stroke-width','1.7'); svg.setAttribute('stroke-linejoin','round');
  svg.setAttribute('stroke-linecap','round'); svg.setAttribute('aria-hidden','true');
  const path = document.createElementNS('http://www.w3.org/2000/svg','path');
  path.setAttribute('d',paths[name]); svg.append(path);
  return svg;
}

function read(key, fallback) {
  try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
}

const savedProfile = read(profileKey, defaults);
const profile = { ...defaults, ...savedProfile };
if (!Object.hasOwn(languages, profile.language)) profile.language = 'en';
if (typeof profile.name !== 'string') profile.name = '';
profile.name = profile.name.slice(0,48);
const savedActivity = profile.remember ? read(activityKey, []) : [];
let activity = Array.isArray(savedActivity) ? savedActivity.filter(entry =>
  entry && tasks.some(task => task.id === entry.task) && Number.isFinite(entry.at) && Number.isFinite(new Date(entry.at).valueOf())).slice(0,60) : [];
let panel = 'home';
let selected = tasks[0].id;
let search = '';
const t = key => translate(key, profile.language);
const localized = values => values[languages[profile.language][1]];
function persistProfile() { try { localStorage.setItem(profileKey, JSON.stringify(profile)); return true; } catch { return false; } }
function persistActivity() {
  try {
    if (profile.remember && activity.length) localStorage.setItem(activityKey, JSON.stringify(activity));
    else localStorage.removeItem(activityKey);
  } catch { /* Current visit remains usable. */ }
}

function renderNav() {
  for (const menu of document.querySelectorAll('[data-nav-menu]')) {
    menu.replaceChildren(...navItems.map(([id, symbol]) => {
      const link = document.createElement('a');
      link.href = `#${id}`;
      if (id === panel) link.setAttribute('aria-current','page');
      const label = document.createElement('span'); label.textContent = t(id);
      link.append(icon(symbol), label);
      return link;
    }));
  }
  $('breadcrumb').textContent = t(panel);
}

function renderCatalog() {
  const shown = search ? findTasks(search) : tasks;
  const summary = $('search-summary');
  summary.hidden = !search;
  summary.textContent = search ? t(shown.length ? 'results' : 'noResults') : '';
  $('tool-cards').replaceChildren(...shown.map(task => {
    const link = document.createElement('a');
    link.className = 'sam-tile'; link.href = `#${task.id}`;
    const image = document.createElement('span'); image.className = `sam-tile-icon ${task.color}`; image.append(icon(task.icon));
    const heading = document.createElement('h3'); heading.textContent = localized(task.title);
    const detail = document.createElement('p'); detail.textContent = localized(task.detail);
    const action = document.createElement('span'); action.className = 'sam-tile-action'; action.textContent = t('openTool');
    link.append(image, heading, detail, action);
    return link;
  }));
}

function renderTools() {
  $('tool-tabs').replaceChildren(...tasks.map(task => {
    const link = document.createElement('a');
    link.href = `#${task.id}`;
    if (selected === task.id) link.setAttribute('aria-current','true');
    link.textContent = localized(task.title);
    $(task.id).hidden = selected !== task.id;
    return link;
  }));
}

function renderActivity() {
  $('home-activity-count').textContent = new Intl.NumberFormat(languages[profile.language][0]).format(activity.length);
  $('activity-empty').hidden = activity.length > 0;
  $('clear-activity').disabled = activity.length === 0;
  const formatter = new Intl.DateTimeFormat(languages[profile.language][0], { dateStyle:'medium', timeStyle:'short' });
  $('activity-list').replaceChildren(...activity.map(entry => {
    const task = tasks.find(item => item.id === entry.task);
    const item = document.createElement('li');
    const label = document.createElement('strong'); label.textContent = localized(task.event);
    const time = document.createElement('time'); time.dateTime = new Date(entry.at).toISOString(); time.textContent = formatter.format(entry.at);
    item.append(icon(task.icon), label, time);
    return item;
  }));
}

function helperURL() {
  const url = new URL('index.html',location.href);
  url.hash = $('share-tool').value;
  $('share-url').value = url.href;
}

function renderHelper() {
  const select = $('share-tool');
  const previous = select.value;
  select.replaceChildren(...tasks.map(task => new Option(localized(task.title), task.id)));
  if (previous) select.value = previous;
  helperURL();
}

function renderPreferences() {
  const name = profile.name || t('profile');
  const initial = Array.from(profile.name)[0]?.toLocaleUpperCase() || 'S';
  $('user-name').textContent = name;
  $('user-initial').textContent = initial;
  $('profile-initial').textContent = initial;
  $('display-name').value = profile.name;
  $('profile-language').value = profile.language;
  $('language-picker').value = profile.language;
  $('larger-text').checked = profile.large;
  $('reduce-motion').checked = profile.quiet;
  $('save-activity').checked = profile.remember;
  document.body.classList.toggle('sam-large', profile.large);
  document.body.classList.toggle('sam-quiet', profile.quiet);
}

function renderLocale() {
  document.documentElement.lang = languages[profile.language][0];
  document.documentElement.dir = profile.language === 'ur' ? 'rtl' : 'ltr';
  for (const element of document.querySelectorAll('[data-copy]')) {
    element.textContent = t(element.dataset.copy);
  }
  renderNav(); renderCatalog(); renderTools(); renderActivity(); renderHelper(); renderPreferences();
}

function route(focus = true) {
  const hash = location.hash.slice(1);
  if (hash === 'main') return;
  const task = tasks.find(item => item.id === hash);
  const aliases = {library:'tools', progress:'activity', helper:'help'};
  const destination = task ? 'tools' : Object.hasOwn(aliases, hash) ? aliases[hash] : hash;
  const next = navItems.some(([id]) => id === destination) ? destination : 'home';
  const nextTool = task?.id || selected;
  if (panel === 'tools' && (next !== 'tools' || nextTool !== selected)) {
    window.dispatchEvent(new Event('samajh:leave-tool'));
  }
  panel = next; selected = nextTool;
  for (const section of document.querySelectorAll('[data-panel]')) section.hidden = section.dataset.panel !== panel;
  renderNav(); renderTools();
  if (focus) {
    $(`${panel}-title`).focus({preventScroll:true});
    window.scrollTo({top:0, behavior:'instant'});
  }
}

function selectLanguage(language) {
  if (!Object.hasOwn(languages, language)) return;
  profile.language = language;
  profile.welcomed = true;
  persistProfile(); renderLocale();
}

window.addEventListener('hashchange', () => route());
window.addEventListener('samajh:activity', event => {
  if (!tasks.some(task => task.id === event.detail)) return;
  const at = Date.now();
  try { sessionStorage.setItem(`samajh-tool-${event.detail}`,String(at)); } catch { /* Tool still works. */ }
  activity = [{task:event.detail,at}, ...activity].slice(0,60);
  persistActivity(); renderActivity();
});
$('task-search-form').addEventListener('submit', event => {
  event.preventDefault(); search = $('task-search').value.trim(); renderCatalog();
  $('discover-title').scrollIntoView({block:'nearest'});
});
$('task-search').addEventListener('input', event => { if (!event.target.value) { search = ''; renderCatalog(); } });
$('language-picker').addEventListener('change', event => selectLanguage(event.target.value));
$('profile-form').addEventListener('submit', event => {
  event.preventDefault();
  profile.name = $('display-name').value.trim();
  profile.language = $('profile-language').value;
  profile.large = $('larger-text').checked;
  profile.quiet = $('reduce-motion').checked;
  profile.remember = $('save-activity').checked;
  const saved = persistProfile(); persistActivity(); renderLocale();
  $('profile-message').textContent = t(saved ? 'saved' : 'sessionOnly');
});
$('clear-activity').addEventListener('click', () => {
  activity = []; persistActivity(); renderActivity(); $('activity-message').textContent = t('cleared');
});
$('share-tool').addEventListener('change', helperURL);
$('copy-tool').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText($('share-url').value); $('helper-message').textContent = t('copied'); }
  catch { $('share-url').focus(); $('share-url').select(); $('helper-message').textContent = t('copyFallback'); }
});

const welcome = $('welcome');
for (const button of welcome.querySelectorAll('[data-language]')) {
  button.addEventListener('click', () => { selectLanguage(button.dataset.language); welcome.close(); });
}
welcome.addEventListener('close', () => {
  if (!profile.welcomed) { profile.welcomed = true; persistProfile(); }
  if (panel === 'home') $('home-title').focus({preventScroll:true});
});
$('choose-language').addEventListener('click', () => welcome.showModal());
renderLocale(); route(false);
if (!profile.welcomed && panel === 'home') welcome.showModal();
