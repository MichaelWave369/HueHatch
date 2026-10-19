import test from 'node:test';
import assert from 'node:assert/strict';
import { addSnapshot, clonePainting, makeSnapshot, parseGallery, MAX_SNAPSHOTS } from '../src/gallery.js';

test('snapshot is a deep copy: editing never mutates a saved keepsake', () => {
  const original = { fills: { head: '#ffab70' }, strokes: [
    { color: '#ffffff', size: 7, points: [[1, 2], [3, 4]] }
  ] };
  const saved = makeSnapshot('robot', original, new Date('2026-10-18T00:00:00.000Z'), 'robot-1');
  original.fills.head = '#333553';
  original.strokes[0].points[0][0] = 99;
  assert.equal(saved.painting.fills.head, '#ffab70');
  assert.deepEqual(saved.painting.strokes[0].points[0], [1, 2]);
  assert.equal(saved.sceneId, 'robot');
  assert.equal(saved.savedAt, '2026-10-18T00:00:00.000Z');
});

test('gallery parser handles missing/corrupt data and rejects unsupported scenes', () => {
  assert.deepEqual(parseGallery('not json'), []);
  assert.deepEqual(parseGallery('{}'), []);
  const data = [{ id: 'one', sceneId: 'robot', savedAt: '2026-10-18', painting: { fills: { body: '#a26f60' }, strokes: [] } },
    { id: 'bad', sceneId: 'unknown', savedAt: '2026-10-18', painting: {} }];
  assert.equal(parseGallery(JSON.stringify(data)).length, 1);
  assert.equal(parseGallery(JSON.stringify(data))[0].painting.fills.body, '#a26f60');
});

test('only valid color values and stroke geometry survive restore', () => {
  const clean = clonePainting({ fills: { sky: '#7bb9ff', bad: 'url(javascript:alert(1))' },
    strokes: [{ color: '#ff6f91', size: 9, points: [[1, 2], [9, 7]] },
      { color: 'red', size: 2, points: [[2, 3]] }] });
  assert.deepEqual(clean.fills, { sky: '#7bb9ff' });
  assert.equal(clean.strokes.length, 1);
  assert.deepEqual(clean.strokes[0].points, [[1, 2], [9, 7]]);
});

test('gallery has a maximum of 16 copies; editor data is not part of trimming', () => {
  let gallery = [];
  for (let i = 0; i < MAX_SNAPSHOTS + 3; i++) {
    gallery = addSnapshot(gallery, makeSnapshot('meadow', { fills: {}, strokes: [] },
      new Date('2026-10-18T00:00:00.000Z'), 'copy-' + i));
  }
  assert.equal(gallery.length, MAX_SNAPSHOTS);
  assert.equal(gallery[0].id, 'copy-18');
  assert.equal(gallery.at(-1).id, 'copy-3');
});
