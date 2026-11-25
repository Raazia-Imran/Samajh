import { tasks } from './workspace-copy.js';

const requested = location.hash.slice(1);
const destination = tasks.some(task => task.id === requested) ? requested : 'tools';
location.replace(`index.html#${destination}`);
