import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { EXPANSION_SCENES } from '../src/scenesExpansion.js';
import { reactionClass, reactionMessage, reactionSummary, WORLD_HINTS } from '../src/reactivity.js';
import { cueForFill, previewCue } from '../src/soundbox.js';
import { addSnapshot, makeSnapshot, parseGallery } from '../src/gallery.js';
import { renderAnimatedSvg } from '../src/exportSvg.js';

const color = '#a999ff';
const colored = (...ids) => Object.fromEntries(ids.map(id => [id,color]));
const sceneById = Object.fromEntries(EXPANSION_SCENES.map(scene => [scene.id,scene]));
const expected = ['dragon','forest','space'];

test('original v0.6 SVG scene registry is deterministic, complete and unique', () => {
  assert.deepEqual(EXPANSION_SCENES.map(s=>s.id),expected);
  for(const scene of EXPANSION_SCENES) {
    assert.ok(scene.parts.length >= 20, scene.id);
    assert.equal(scene.parts[0].id,'sky');
    assert.equal(new Set(scene.parts.map(p=>p.id)).size,scene.parts.length);
    assert.ok(WORLD_HINTS[scene.id]);
    for (const p of scene.parts) {
      assert.ok(['rect','circle','ellipse','path'].includes(p.tag),p.id);
      assert.ok(p.attrs && Object.values(p.attrs).every(v=>typeof v==='number'||typeof v==='string'));
      assert.ok(!Object.keys(p.attrs).some(key=>key.startsWith('on')));
      assert.ok(p.motion===''||/^[a-z-]+$/.test(p.motion));
    }
  }
});

test('new worlds start with no awakened effects and gain reactive coloring', () => {
  for(const s of EXPANSION_SCENES) {
    const blank = reactionSummary(s,{});
    assert.equal(blank.awakened,0);
    assert.ok(blank.possible >= 3);
  }
  assert.equal(reactionClass('dragon','dragon-flame',colored('dragon-flame')),'reaction-dragon-fire');
  assert.equal(reactionClass('dragon','dragon-wing-front',colored('dragon-wing-front')),'reaction-dragon-wing');
  assert.equal(reactionClass('forest','forest-firefly-0',colored('forest-firefly-0')),'reaction-firefly');
  assert.equal(reactionClass('forest','forest-mushroom-cap-a',colored('forest-mushroom-cap-a')),'reaction-mushroom');
  assert.equal(reactionClass('space','space-rocket-flame',colored('space-rocket-flame')),'reaction-thruster');
  assert.equal(reactionClass('space','space-planet',colored('space-planet')),'reaction-planet');
  assert.equal(reactionClass('space','space-star-1',colored('space-star-1')),'reaction-space-star');
  assert.match(reactionMessage('dragon','dragon-flame',colored('dragon-flame')),/fire/i);
  assert.equal(reactionClass('forest','forest-mushroom-cap-a',{}),'');
});

test('new Soundbox cues are opt-in-compatible, distinct and bounded', () => {
  const cues=[
    cueForFill('dragon','dragon-flame',{},colored('dragon-flame')),
    cueForFill('forest','forest-firefly-0',{},colored('forest-firefly-0')),
    cueForFill('space','space-rocket-flame',{},colored('space-rocket-flame'))
  ];
  assert.deepEqual(cues.map(c=>c.kind),
    ['reaction-dragon-fire','reaction-firefly','reaction-thruster']);
  for(const c of cues){
    assert.ok(c.notes.length>=1 && c.notes.length<=4);
    assert.ok(c.notes.every(n=>n.hz>=65&&n.hz<=1400&&n.duration<=.55&&n.level<=.15));
  }
  for(const id of expected) assert.ok(previewCue(id)?.notes.length);
  assert.equal(cueForFill('dragon','dragon-flame',colored('dragon-flame'),colored('dragon-flame')),null);
});

test('new scenes save/open from the same browser-local gallery format', () => {
  let snapshots=[];
  for(const id of expected){
    const sample=makeSnapshot(id,{fills:{sky:color},strokes:[]},
      new Date('2026-10-18T00:00:00.000Z'),id+'-1');
    snapshots=addSnapshot(snapshots,sample);
  }
  const restored=parseGallery(JSON.stringify(snapshots));
  assert.deepEqual(restored.map(e=>e.sceneId),['space','forest','dragon']);
  assert.ok(restored.every(e=>e.painting.fills.sky===color));
  const old=makeSnapshot('robot',{fills:{heart:color},strokes:[]});
  assert.equal(parseGallery(JSON.stringify([old])).length,1);
});

test('every new world exports a self-contained animated SVG with its colors and classes', () => {
  const css=readFileSync(new URL('../src/animation.css',import.meta.url),'utf8');
  for(const [id,partId,className] of [
    ['dragon','dragon-flame','reaction-dragon-fire'],
    ['forest','forest-firefly-0','reaction-firefly'],
    ['space','space-rocket-flame','reaction-thruster']
  ]){
    const output=renderAnimatedSvg(sceneById[id],{fills:{[partId]:color},strokes:[]},
      {motionCss:css,speed:1.5});
    assert.match(output,new RegExp('class="area [^"]*'+className+'"'));
    assert.ok(output.includes('fill="'+color+'"'));
    assert.match(output,/data-speed="1.5"/);
    assert.match(output,/@keyframes hh/);
    assert.doesNotMatch(output,/<script\b/i);
  }
  assert.match(css,/prefers-reduced-motion/);
  assert.match(css,/animation-play-state: paused/);
});
