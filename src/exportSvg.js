import { clonePainting } from './gallery.js';
import { reactionClass } from './reactivity.js';

// Explicitly serialize only SVG primitives we create. No user-authored markup is accepted.
const TAGS = new Set(['rect', 'circle', 'ellipse', 'path']);
const ATTRS = new Set(['x', 'y', 'width', 'height', 'rx', 'ry', 'cx', 'cy', 'r', 'd', 'transform']);
const SPEEDS = new Set([0.5, 1, 1.5, 2]);
const BACKGROUNDS = new Set(['sky', 'water', 'backdrop']);

export function escapeXml(value) {
  return String(value).replace(/[&<>"']/g, char =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' })[char]);
}

function serializeShape(part, fills, sceneId) {
  if (!part || !TAGS.has(part.tag) || typeof part.id !== 'string') return '';
  const attrs = Object.entries(part.attrs || {})
    .filter(([key, value]) => ATTRS.has(key) && (typeof value === 'string' || typeof value === 'number'))
    .map(([key, value]) => `${key}="${escapeXml(value)}"`).join(' ');
  const motion = typeof part.motion === 'string' && /^[a-z-]*$/.test(part.motion)
    ? part.motion : '';
  const fill = fills[part.id] || '#ffffff';
  const reaction = reactionClass(sceneId, part.id, fills);
  return `<${part.tag} ${attrs} fill="${escapeXml(fill)}" stroke="${BACKGROUNDS.has(part.id) ? 'none' : '#30263e'}" stroke-width="5" stroke-linejoin="round" stroke-linecap="round" class="area ${motion}${reaction ? ' ' + reaction : ''}" style="--paint-tone:${escapeXml(fill)}"/>`;
}

function serializeStroke(stroke) {
  const d = stroke.points.map((p, i) => `${i ? 'L' : 'M'}${p[0]} ${p[1]}`).join(' ');
  if (!d) return '';
  return `<path d="${escapeXml(d)}" fill="none" stroke="${stroke.color}" stroke-width="${stroke.size}" stroke-linecap="round" stroke-linejoin="round"/>`;
}

/**
 * Generate a portable, self-contained animated SVG, with the same animation.css
 * rules that power the editor/gallery. No JavaScript or external assets.
 * The browser must support CSS animation inside SVG to show movement.
 */
export function renderAnimatedSvg(scene, painting, options = {}) {
  if (!scene || typeof scene.id !== 'string' || !Array.isArray(scene.parts)) {
    throw new Error('Cannot export an unknown scene.');
  }
  const { motionCss = '', speed = 1 } = options;
  if (typeof motionCss !== 'string' || /[<>]/.test(motionCss)) {
    throw new Error('Animation stylesheet contains unsupported markup.');
  }
  const safeSpeed = SPEEDS.has(Number(speed)) ? Number(speed) : 1;
  const art = clonePainting(painting);
  const shapes = scene.parts.map(p => serializeShape(p, art.fills, scene.id)).join('\n');
  const strokes = art.strokes.map(serializeStroke).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" version="1.1" viewBox="0 0 900 620"
  width="900" height="620" class="world alive" data-speed="${safeSpeed}">
  <title>${escapeXml(scene.name || 'HueHatch artwork')}</title>
  <desc>An animated HueHatch coloring with the artist's selected colors and strokes.</desc>
  <style>${motionCss}</style>
  ${shapes}
  <g pointer-events="none">${strokes}</g>
</svg>`;
}

export function downloadAnimatedSvg(scene, painting, motionCss, speed) {
  const contents = renderAnimatedSvg(scene, painting, { motionCss, speed });
  const blob = new Blob([contents], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `huehatch-${scene.id}-animated.svg`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  // Delay revocation: some browsers need the URL briefly after the click.
  window.setTimeout(() => URL.revokeObjectURL(url), 5000);
}
