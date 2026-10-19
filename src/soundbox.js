import { reactionClass } from './reactivity.js';

// Only short, deterministic synthesizer notes. No microphones, MIDI, uploads,
// external audio clips, network requests or always-on background playback.
const HEX = /^#[0-9a-f]{6}$/i;
const WORLDS = new Set(['meadow', 'ocean', 'robot', 'village']);
const PENTATONIC = [0, 2, 4, 7, 9, 12];

export const SOUND_VOLUME_KEY = 'huehatch-sound-volume-v1';
export const DEFAULT_VOLUME = 35;

export function normalizeVolume(value) {
  const n = Number(value);
  return Number.isFinite(n) ? Math.min(100, Math.max(0, Math.round(n))) : DEFAULT_VOLUME;
}

export function pitchFromColor(hex) {
  if (!HEX.test(hex || '')) return 1;
  const [r, g, b] = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  const hi = Math.max(r, g, b), lo = Math.min(r, g, b), range = hi - lo;
  if (!range) return 1;
  let hue = hi === r ? ((g - b) / range) % 6
    : hi === g ? (b - r) / range + 2 : (r - g) / range + 4;
  hue = (hue * 60 + 360) % 360;
  const step = PENTATONIC[Math.min(5, Math.floor(hue / 60))];
  return Math.pow(2, step / 12);
}

const note = (hz, duration, start = 0, wave = 'sine', slide = 1, level = .11) =>
  ({ hz: Math.min(1400, Math.max(65, Math.round(hz))), duration, start,
    wave, slide, level });

// A fill event picks a sound from the current art, not from timers or animation.
export function cueForFill(sceneId, partId, before = {}, after = {}) {
  if (!WORLDS.has(sceneId) || typeof partId !== 'string') return null;
  const color = Object.hasOwn(after, partId) ? after[partId] : null;
  if (!HEX.test(color || '') || before?.[partId] === color) return null;
  const pitch = pitchFromColor(color);
  let kind = reactionClass(sceneId, partId, after) || 'color-tap';

  // Completing three petals AFTER coloring the flower center counts as a bloom
  // too; otherwise the visual blooms but the sound would only be a generic petal.
  if (sceneId === 'meadow' && /^petal-[ab][0-7]$/.test(partId)) {
    const center = 'flower-' + partId[6];
    if (reactionClass(sceneId, center, after) === 'reaction-bloom'
        && reactionClass(sceneId, center, before) !== 'reaction-bloom') {
      kind = 'reaction-bloom';
    }
  }

  let notes;
  switch (kind) {
    case 'reaction-heart':
      notes = [note(156 * pitch, .13), note(126 * pitch, .16, .16)];
      break;
    case 'reaction-beat':
      notes = [note(110 * pitch, .25, 0, 'triangle', .67, .15)];
      break;
    case 'reaction-disco':
      notes = [note(330 * pitch, .12), note(440 * pitch, .13, .12),
        note(550 * pitch, .18, .25)];
      break;
    case 'reaction-bloom':
      notes = [note(293 * pitch, .2), note(370 * pitch, .22, .10),
        note(440 * pitch, .29, .22)];
      break;
    case 'reaction-bubble':
      notes = [note(440 * pitch, .23, 0, 'sine', 1.5)];
      break;
    case 'reaction-fish':
    case 'reaction-jelly':
      notes = [note(350 * pitch, .23, 0, 'sine', 1.22)];
      break;
    case 'reaction-star':
    case 'reaction-moon':
    case 'reaction-window':
      notes = [note(493 * pitch, .27), note(740 * pitch, .33, .07, 'sine', 1, .065)];
      break;
    case 'reaction-petal':
    case 'reaction-butterfly':
    case 'reaction-sun':
      notes = [note(392 * pitch, .17, 0, 'sine', 1.13)];
      break;
    default: {
      const base = { meadow: 392, ocean: 329, robot: 220, village: 440 }[sceneId];
      notes = [note(base * pitch, .14, 0, 'sine', 1.06, .075)];
    }
  }
  return { kind, notes };
}

export function previewCue(sceneId) {
  const ids = { robot: 'heart', meadow: 'sun', ocean: 'bubble-0', village: 'star-0' };
  const id = ids[sceneId] || ids.meadow;
  return cueForFill(WORLDS.has(sceneId) ? sceneId : 'meadow', id, {}, { [id]: '#ff6f91' });
}

/**
 * Lazy Web Audio engine. Constructing the engine never creates an AudioContext.
 * enable() must be called directly from the user's button interaction.
 */
export function createSoundbox(host = globalThis) {
  let ctx = null;
  let enabled = false;
  let lastPlayed = -Infinity;
  const voices = new Set();

  async function enable() {
    if (enabled && ctx?.state === 'running') return true;
    const Constructor = host.AudioContext || host.webkitAudioContext;
    if (!Constructor) return false;
    try {
      if (!ctx) ctx = new Constructor();
      if (ctx.state !== 'running') await ctx.resume();
      enabled = ctx.state === 'running';
      if (!enabled) disable();
      return enabled;
    } catch {
      disable();
      return false;
    }
  }

  function play(cue, volume = DEFAULT_VOLUME) {
    if (!enabled || ctx?.state !== 'running' || !cue || !Array.isArray(cue.notes)) return false;
    const scalar = normalizeVolume(volume) / 100;
    if (scalar === 0 || voices.size > 12 || ctx.currentTime - lastPlayed < .065) return false;
    const notes = cue.notes.slice(0, 4);
    if (!notes.length) return false;
    const time = ctx.currentTime + .008;
    try {
      for (const spec of notes) {
        if (!Number.isFinite(spec.hz) || spec.hz < 65 || spec.hz > 1400) continue;
        const start = time + Math.max(0, Math.min(.5, spec.start));
        const duration = Math.max(.06, Math.min(.55, spec.duration));
        const end = start + duration;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = spec.wave === 'triangle' ? 'triangle' : 'sine';
        osc.frequency.setValueAtTime(spec.hz, start);
        osc.frequency.exponentialRampToValueAtTime(
          Math.max(65, Math.min(2100, spec.hz * (spec.slide || 1))), end);
        const peak = Math.min(.15, Math.max(.01, spec.level)) * scalar * .65;
        gain.gain.setValueAtTime(.0001, start);
        gain.gain.linearRampToValueAtTime(peak, start + .014);
        gain.gain.exponentialRampToValueAtTime(.0001, end);
        osc.connect(gain);
        gain.connect(ctx.destination);
        voices.add(osc);
        osc.onended = () => {
          voices.delete(osc);
          try { osc.disconnect(); gain.disconnect(); } catch {}
        };
        osc.start(start);
        osc.stop(end + .015);
      }
      lastPlayed = ctx.currentTime;
      return true;
    } catch {
      // Sound must never interrupt coloring if a browser's audio API fails.
      return false;
    }
  }

  function disable() {
    enabled = false;
    for (const voice of voices) {
      try { voice.stop(); voice.disconnect(); } catch {}
    }
    voices.clear();
    const old = ctx;
    ctx = null;
    lastPlayed = -Infinity;
    if (old) {
      try { const pending = old.close(); pending?.catch?.(() => {}); } catch {}
    }
  }

  return { enable, play, disable, isEnabled: () => enabled };
}
