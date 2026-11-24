function setStatus(element, text, error = false) {
  element.textContent = text;
  element.dataset.error = String(error);
}

function attachCapture({ start, stop, status, capture, show, hide, unavailable, active }) {
  let stream;
  let operation = 0;

  function finish(message, error = false) {
    operation += 1;
    const previous = stream;
    stream = undefined;
    previous?.getTracks().forEach(track => track.stop());
    hide();
    start.disabled = !capture;
    stop.disabled = true;
    setStatus(status, message, error);
  }

  if (!capture) {
    finish(unavailable, true);
    return;
  }

  stop.addEventListener('click', () => finish('Stopped.'));
  start.addEventListener('click', async () => {
    const request = ++operation;
    start.disabled = true;
    stop.disabled = false;
    setStatus(status, 'Waiting for your browser permission…');
    try {
      const selected = await capture();
      if (operation !== request) {
        selected.getTracks().forEach(track => track.stop());
        return;
      }
      stream = selected;
      for (const track of stream.getTracks()) {
        track.addEventListener('ended', () => {
          if (operation === request) finish('Your device ended the preview.');
        }, { once: true });
      }
      await show(selected, () => operation === request);
      if (operation === request) setStatus(status, active);
    } catch {
      if (operation === request) finish('Could not start. Check permissions and device availability, then try again.', true);
    }
  });
  window.addEventListener('pagehide', () => finish('Stopped.'));
}

const byId = id => document.getElementById(id);
const devices = navigator.mediaDevices;
const meter = byId('mic-level');
const micPreview = byId('mic-preview');
const AudioEngine = window.AudioContext || window.webkitAudioContext;
let context;
let frame;

attachCapture({
  start: byId('mic-start'), stop: byId('mic-stop'), status: byId('mic-status'),
  capture: devices?.getUserMedia && AudioEngine ? () => devices.getUserMedia({ audio: true, video: false }) : null,
  unavailable: 'Microphone checks are unavailable in this browser.',
  active: 'Microphone is active. Speak and watch the signal, then stop the check.',
  async show(stream, isCurrent) {
    context = new AudioEngine();
    const analyser = context.createAnalyser();
    const source = context.createMediaStreamSource(stream);
    source.connect(analyser);
    const samples = new Float32Array(analyser.fftSize);
    await context.resume();
    if (!isCurrent()) return;
    micPreview.hidden = false;
    function measure() {
      analyser.getFloatTimeDomainData(samples);
      const power = samples.reduce((total, sample) => total + sample ** 2, 0) / samples.length;
      meter.value = Math.min(100, Math.round(Math.sqrt(power) * 400));
      frame = requestAnimationFrame(measure);
    }
    measure();
  },
  hide() {
    cancelAnimationFrame(frame);
    if (context && context.state !== 'closed') context.close().catch(() => {});
    context = undefined;
    micPreview.hidden = true;
    meter.value = 0;
  },
});

const video = byId('screen-video');
attachCapture({
  start: byId('screen-start'), stop: byId('screen-stop'), status: byId('screen-status'),
  capture: devices?.getDisplayMedia ? () => devices.getDisplayMedia({ video: true, audio: false }) : null,
  unavailable: 'Screen preview is unavailable in this browser. Try a supported desktop browser.',
  active: 'Your selected display is visible here. Stop the preview when you are finished.',
  async show(stream) {
    video.srcObject = stream;
    video.hidden = false;
    await video.play();
  },
  hide() {
    video.pause();
    video.srcObject = null;
    video.hidden = true;
  },
});
