// HueHatch reactive coloring: pure, deterministic rules. The stored painting
// format does not change. Live canvas, gallery and SVG exports use identical rules.
const has = (fills, id) => Object.prototype.hasOwnProperty.call(fills || {}, id)
  && /^#[0-9a-f]{6}$/i.test(fills[id]);

export const WORLD_HINTS = Object.freeze({
  meadow: 'Try the flower petals, butterfly wings or sunshine.',
  ocean: 'Try the fish, glowing jellyfish or rising bubbles.',
  robot: 'Try the heart, a speaker cone or the disco light.',
  village: 'Try a star, moon or cottage window.',
  dragon: 'Color the dragon wings or breathe rainbow fire.',
  forest: 'Wake fireflies, mushrooms, crystals and moonlight.',
  space: 'Light a rocket thruster, planet or satellite.'
});

export function reactionClass(sceneId, partId, fills = {}) {
  if (!has(fills, partId)) return '';
  switch (sceneId) {
    case 'meadow':
      if (partId.startsWith('petal-')) return 'reaction-petal';
      if (partId.startsWith('flower-')) {
        const suffix = partId.slice('flower-'.length);
        const petals = Array.from({ length: 8 }, (_, i) => 'petal-' + suffix + i);
        return petals.filter(id => has(fills, id)).length >= 3 ? 'reaction-bloom' : 'reaction-petal';
      }
      if (partId === 'sun') return 'reaction-sun';
      if (partId.startsWith('butterfly-')) return 'reaction-butterfly';
      return '';
    case 'ocean':
      if (partId === 'fish' || partId === 'tail' || partId === 'fin') return 'reaction-fish';
      if (partId.startsWith('bubble-')) return 'reaction-bubble';
      if (partId === 'jelly' || partId === 'jelly-skirt') return 'reaction-jelly';
      if (partId === 'starfish') return 'reaction-starfish';
      return '';
    case 'robot':
      if (partId === 'heart') return 'reaction-heart';
      if (partId.startsWith('woofer-')) return 'reaction-beat';
      if (partId === 'disco') return 'reaction-disco';
      if (partId === 'antenna') return 'reaction-antenna';
      return '';
    case 'village':
      if (partId.startsWith('star-')) return 'reaction-star';
      if (partId === 'moon') return 'reaction-moon';
      if (partId.startsWith('window-')) return 'reaction-window';
      if (partId === 'tree') return 'reaction-tree';
      return '';
    case 'dragon':
      if (partId === 'dragon-flame') return 'reaction-dragon-fire';
      if (partId.startsWith('dragon-wing-')) return 'reaction-dragon-wing';
      if (partId.startsWith('dragon-spark-')) return 'reaction-dragon-spark';
      if (partId === 'dragon-eye') return 'reaction-dragon-eye';
      return '';
    case 'forest':
      if (partId.startsWith('forest-firefly-') || partId.startsWith('forest-glow-')) return 'reaction-firefly';
      if (partId.startsWith('forest-mushroom-cap-')) return 'reaction-mushroom';
      if (partId.startsWith('forest-crystal-')) return 'reaction-crystal';
      if (partId === 'forest-moon') return 'reaction-moon';
      return '';
    case 'space':
      if (partId === 'space-rocket-flame') return 'reaction-thruster';
      if (partId === 'space-planet' || partId === 'space-planet-ring') return 'reaction-planet';
      if (partId.startsWith('space-star-')) return 'reaction-space-star';
      if (partId === 'space-satellite-core' || partId === 'space-satellite-eye') return 'reaction-satellite';
      if (partId === 'space-rocket-window') return 'reaction-rocket-window';
      return '';
    default:
      return '';
  }
}

export function reactionSummary(scene, fills = {}) {
  const awakened = scene.parts.reduce((n, part) =>
    n + (reactionClass(scene.id, part.id, fills) ? 1 : 0), 0);
  const possible = scene.parts.reduce((n, part) =>
    n + (reactionClass(scene.id, part.id, { [part.id]: '#ff6f91' }) ? 1 : 0), 0);
  return { awakened, possible };
}

const RESPONSES = Object.freeze({
  'reaction-heart': 'A heartbeat! Your robot has a pulse.',
  'reaction-beat': 'Bass boost! Your speaker is thumping.',
  'reaction-disco': 'Disco lights are shimmering!',
  'reaction-antenna': 'Signal received! Antenna activated.',
  'reaction-petal': 'Those petals are sparkling.',
  'reaction-bloom': 'A flower bloomed! More petals, more magic.',
  'reaction-sun': 'Sunshine is radiating from your colors.',
  'reaction-butterfly': 'Your butterfly is glowing as it flutters.',
  'reaction-fish': 'Your fish is sparkling as it swims.',
  'reaction-bubble': 'A colorful bubble is floating upward.',
  'reaction-jelly': 'Your jellyfish is glowing under the sea.',
  'reaction-starfish': 'Your starfish is twinkling.',
  'reaction-star': 'A little star just lit up!',
  'reaction-moon': 'Moonlight is glowing.',
  'reaction-window': 'Someone turned on the cottage lights.',
  'reaction-tree': 'The tree shimmers in the moonlight.',
  'reaction-dragon-fire': 'Rainbow fire! Your dragon is breathing color.',
  'reaction-dragon-wing': 'Dragon wings are flapping in your colors.',
  'reaction-dragon-spark': 'Your dragon left a sparkling trail.',
  'reaction-dragon-eye': 'Your dragon has a twinkle in its eye.',
  'reaction-firefly': 'A forest firefly is glowing!',
  'reaction-mushroom': 'An enchanted mushroom wakes up!',
  'reaction-crystal': 'A magic crystal is shimmering.',
  'reaction-thruster': 'Rocket ignition! Colorful engines are glowing.',
  'reaction-planet': 'Your planet is shining in orbit.',
  'reaction-space-star': 'A star just lit up in the galaxy.',
  'reaction-satellite': 'Your satellite is sending a signal.',
  'reaction-rocket-window': 'The rocket window is lit for launch.'
});

export function reactionMessage(sceneId, partId, fills) {
  const kind = reactionClass(sceneId, partId, fills);
  return kind ? RESPONSES[kind] : '';
}
