import test from 'node:test';
import assert from 'node:assert/strict';
import { reactionClass, reactionMessage, reactionSummary, WORLD_HINTS } from '../src/reactivity.js';

const ink = '#ff6f91';
const painted = (...ids) => Object.fromEntries(ids.map(id => [id, ink]));
const part = (...ids) => ids.map(id => ({ id }));

test('nothing reactive is unlocked in an untouched scene', () => {
  for (const sceneId of ['meadow','ocean','robot','village']) {
    assert.equal(reactionClass(sceneId,'heart',{}), '');
    assert.equal(reactionClass(sceneId,'star-0',{}), '');
    assert.ok(WORLD_HINTS[sceneId]);
  }
});

test('painting a robot heart creates a heartbeat and a meaningful response', () => {
  assert.equal(reactionClass('robot','heart',painted('heart')), 'reaction-heart');
  assert.equal(reactionClass('robot','woofer-l',painted('woofer-l')), 'reaction-beat');
  assert.equal(reactionClass('robot','disco',painted('disco')), 'reaction-disco');
  assert.match(reactionMessage('robot','heart',painted('heart')), /heartbeat/i);
  assert.equal(reactionClass('robot','head',painted('head')), '');
});

test('flower center blooms only after three petals have been colored', () => {
  const center = painted('flower-a','petal-a0','petal-a1');
  assert.equal(reactionClass('meadow','flower-a',center),'reaction-petal');
  const blooming = { ...center, 'petal-a2': ink };
  assert.equal(reactionClass('meadow','flower-a',blooming),'reaction-bloom');
  assert.equal(reactionClass('meadow','flower-b',blooming),'');
  assert.match(reactionMessage('meadow','flower-a',blooming),/bloom/i);
});

test('reactive highlights derive from real fill IDs for all original worlds', () => {
  assert.equal(reactionClass('meadow','sun',painted('sun')),'reaction-sun');
  assert.equal(reactionClass('ocean','bubble-3',painted('bubble-3')),'reaction-bubble');
  assert.equal(reactionClass('ocean','jelly',painted('jelly')),'reaction-jelly');
  assert.equal(reactionClass('village','star-0',painted('star-0')),'reaction-star');
  assert.equal(reactionClass('village','window-a',painted('window-a')),'reaction-window');
});

test('undo and reset derive the reactions anew; existing gallery shape is unchanged', () => {
  const scene = {id:'robot',parts:part('heart','woofer-l','disco','head')};
  const colored = painted('heart','woofer-l','head');
  assert.deepEqual(reactionSummary(scene,colored),{awakened:2,possible:3});
  const undone = {...colored}; delete undone.heart;
  assert.deepEqual(reactionSummary(scene,undone),{awakened:1,possible:3});
  assert.deepEqual(reactionSummary(scene,{}),{awakened:0,possible:3});
});

test('untrusted fill values do not create reactive styles', () => {
  assert.equal(reactionClass('robot','heart',{heart:'url(javascript:evil)'}),'');
  assert.equal(reactionClass('village','moon',{moon:'#fff'}),'');
  assert.equal(reactionClass('ocean','fish',Object.create({fish:'#ff6f91'})),'');
  assert.equal(reactionClass('unknown','heart',painted('heart')),'');
});
