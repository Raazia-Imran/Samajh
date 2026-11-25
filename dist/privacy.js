import { tasks } from './workspace-copy.js';
import { draftKey } from './practice-data.js';

const form = document.getElementById('reset-data');
const status = document.getElementById('privacy-status');
form.addEventListener('submit', event => {
  event.preventDefault();
  const fields = new FormData(form);
  if (![...fields.keys()].length) { status.textContent = 'Choose what you want to clear first.'; return; }
  if (!confirm('Clear the selected Samajh data from this browser?')) return;
  try {
    if (fields.has('profile')) localStorage.removeItem('samajh-workspace-profile');
    if (fields.has('activity')) {
      localStorage.removeItem('samajh-live-activity');
      for (const task of tasks) sessionStorage.removeItem(`samajh-tool-${task.id}`);
    }
    if (fields.has('drafts')) localStorage.removeItem(draftKey);
    form.reset(); status.textContent = 'Selected browser data cleared.';
  } catch { status.textContent = 'The browser blocked access to some storage. You can clear this site’s data in your browser settings.'; }
});
