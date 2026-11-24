import { TASKS } from '../dist/engine.js';
const taskIds = new Set(TASKS.map(t => t.id));

export function savedAttemptRows(raw) {
  let saved; try { saved = JSON.parse(raw || 'null'); } catch { return []; }
  if (saved?.consent !== true || !Array.isArray(saved.records)) return [];
  const rows = saved.records.slice(-100).filter(r => r && taskIds.has(r.id) && typeof r.transfer === 'boolean' && Number.isInteger(r.hints) && r.hints >= 0 && r.hints <= 10000 && typeof r.at === 'string' && Number.isFinite(Date.parse(r.at))).map(r => ({task_id:r.id,transfer:r.transfer,hints:r.hints,completed_at:new Date(r.at).toISOString()}));
  return [...new Map(rows.map(row => [JSON.stringify(row),row])).values()];
}
