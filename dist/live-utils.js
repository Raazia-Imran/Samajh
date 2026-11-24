// Pure validation for user-invoked real-world tools. No network requests.
export function meetingURL(value) {
  let url;
  try { url = new URL(value.trim()); } catch { return null; }
  if (url.protocol !== 'https:' || url.username || url.password || url.port) return null;
  const host = url.hostname.toLowerCase();
  const zoom = (host === 'zoom.us' || host.endsWith('.zoom.us')) && /^\/(?:j|wc\/join)\/\d+\/?$/.test(url.pathname);
  const meet = host === 'meet.google.com' && /^\/[a-z]{3}-[a-z]{4}-[a-z]{3}\/?$/i.test(url.pathname);
  return zoom || meet ? url.href : null;
}

export function fileExtension(name) {
  const dot = name.lastIndexOf('.');
  return dot > 0 ? name.slice(dot) : '';
}

export function renamedFileName(original, value) {
  const base = value.trim();
  if (!base || base.length > 100 || /[<>:"/\\|?*\x00-\x1f\x7f]/.test(base) || /[. ]$/.test(base) || /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\.|$)/i.test(base)) return null;
  const ext = fileExtension(original);
  return base.toLowerCase().endsWith(ext.toLowerCase()) && ext ? base : base + ext;
}

export function shareableURL(value) {
  try { const url = new URL(value.trim()); return url.protocol === 'https:' && !url.username && !url.password ? url.href : null; } catch { return null; }
}
