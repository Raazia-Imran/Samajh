import { meetingURL, renamedFileName, fileExtension, shareableURL } from './live-utils.js';
const $ = id => document.getElementById(id);
function status(id, message, error = false) {
  const element = $(id);
  element.textContent = message;
  element.dataset.error = String(error);
}
$('meeting-form').addEventListener('submit', event => {
  event.preventDefault();
  const url = meetingURL($('meeting-url').value);
  if (!url) return status('meeting-status', 'Use a standard HTTPS Zoom invitation or Google Meet link. Open other meeting links directly in the trusted service.', true);
  const link = document.createElement('a');
  link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer'; link.click();
  status('meeting-status', 'Meeting link handed off to your browser. Continue joining in Zoom or Meet.');
});
$('rename-file').addEventListener('change', () => {
  const file = $('rename-file').files[0];
  if (!file) return;
  const ext = fileExtension(file.name);
  $('rename-name').value = ext ? file.name.slice(0, -ext.length) : file.name;
  $('extension-note').textContent = ext ? `File type kept: ${ext}` : 'This file has no filename extension.';
});
$('rename-form').addEventListener('submit', event => {
  event.preventDefault();
  const file = $('rename-file').files[0];
  if (!file) return status('rename-status', 'Choose a file first.', true);
  const name = renamedFileName(file.name, $('rename-name').value);
  if (!name) return status('rename-status', 'Please enter a normal filename, without special characters.', true);
  const url = URL.createObjectURL(file);
  const link = document.createElement('a'); link.href = url; link.download = name; link.click();
  setTimeout(() => URL.revokeObjectURL(url), 30000);
  status('rename-status', `Download requested for ${name}. Check Downloads. Your original file is unchanged.`);
});
$('pdf-file').addEventListener('change', () => {
  const file = $('pdf-file').files[0];
  $('share-pdf').disabled = !file || !file.name.toLowerCase().endsWith('.pdf');
  status('share-status', file && !$('share-pdf').disabled ? 'File selected. Review the recipient in your device’s share menu.' : 'Choose a PDF file.', !!file && $('share-pdf').disabled);
});
$('share-pdf').addEventListener('click', async () => {
  const file = $('pdf-file').files[0];
  if (!file || !file.name.toLowerCase().endsWith('.pdf')) return;
  if (!navigator.share || !navigator.canShare?.({files:[file]})) return status('share-status', 'File sharing is not available in this browser. Open your email or messaging app and attach the selected PDF there.', true);
  try { await navigator.share({ files: [file] }); status('share-status', 'The device sharing request completed. Check your chosen app to confirm the file was sent.'); }
  catch (error) { status('share-status', error.name === 'AbortError' ? 'Sharing was cancelled. Nothing else is attempted.' : 'Sharing did not complete. Use your messaging app to attach the PDF.', error.name !== 'AbortError'); }
});
$('copy-form').addEventListener('submit', async event => {
  event.preventDefault();
  const url = shareableURL($('copy-url').value);
  if (!url) return status('copy-status', 'Enter an HTTPS link without embedded login credentials.', true);
  try { await navigator.clipboard.writeText(url); status('copy-status', 'Link copied. Check sharing permissions before pasting it to a recipient.'); }
  catch { $('copy-url').select(); status('copy-status', 'Clipboard access is unavailable. Copy the selected text manually.', true); }
});
