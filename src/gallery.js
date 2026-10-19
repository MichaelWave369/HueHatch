// Browser-local, copy-only keepsakes. The editor's autosaved pages remain separate.
export const GALLERY_KEY = 'huehatch-gallery-v1';
export const MAX_SNAPSHOTS = 16;
const SCENE_IDS = new Set(['meadow', 'ocean', 'robot', 'village', 'dragon', 'forest', 'space']);

export function clonePainting(painting) {
  const fills = painting?.fills && typeof painting.fills === 'object' && !Array.isArray(painting.fills)
    ? Object.fromEntries(Object.entries(painting.fills)
        .filter(([id, color]) => typeof id === 'string' && /^#[0-9a-f]{6}$/i.test(color)))
    : {};
  const strokes = Array.isArray(painting?.strokes)
    ? painting.strokes.filter(s => s && /^#[0-9a-f]{6}$/i.test(s.color)
        && Number.isFinite(s.size) && Array.isArray(s.points))
        .slice(0, 300).map(s => ({
          color: s.color,
          size: Math.min(50, Math.max(1, s.size)),
          points: s.points.filter(p => Array.isArray(p) && p.length === 2
            && p.every(Number.isFinite)).slice(0, 10000).map(p => [...p])
        }))
    : [];
  return { fills, strokes };
}

export function parseGallery(raw) {
  try {
    const value = JSON.parse(raw || '[]');
    if (!Array.isArray(value)) return [];
    return value.filter(entry => entry && typeof entry.id === 'string'
      && SCENE_IDS.has(entry.sceneId) && typeof entry.savedAt === 'string'
      && entry.painting && typeof entry.painting === 'object')
      .slice(0, MAX_SNAPSHOTS)
      .map(entry => ({
        id: entry.id, sceneId: entry.sceneId, savedAt: entry.savedAt,
        painting: clonePainting(entry.painting)
      }));
  } catch {
    return [];
  }
}

export function makeSnapshot(sceneId, painting, now = new Date(), id = undefined) {
  if (!SCENE_IDS.has(sceneId)) throw new Error('Unknown coloring world');
  return {
    id: id ?? `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`,
    sceneId,
    savedAt: now.toISOString(),
    painting: clonePainting(painting)
  };
}

export function addSnapshot(gallery, snapshot) {
  return [snapshot, ...gallery.filter(entry => entry.id !== snapshot.id)].slice(0, MAX_SNAPSHOTS);
}
