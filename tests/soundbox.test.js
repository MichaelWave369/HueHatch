import test from 'node:test';
import assert from 'node:assert/strict';
import { cueForFill, createSoundbox, normalizeVolume, pitchFromColor, previewCue, DEFAULT_VOLUME }
  from '../src/soundbox.js';

const color = '#ff6f91';
const paint = (...ids) => Object.fromEntries(ids.map(id => [id, color]));

test('soundbox remains silent for unknown scenes, invalid paint, or unchanged fills', () => {
  assert.equal(cueForFill('unknown', 'heart', {}, paint('heart')), null);
  assert.equal(cueForFill('robot', 'heart', paint('heart'), paint('heart')), null);
  assert.equal(cueForFill('robot', 'heart', {}, {heart:'url(evil)'}), null);
  assert.equal(cueForFill('robot', 'heart', {}, {}), null);
});

test('worlds make distinct sounds with bounded frequencies and levels', () => {
  const samples = [
    cueForFill('robot','heart',{},paint('heart')),
    cueForFill('robot','woofer-l',{},paint('woofer-l')),
    cueForFill('meadow','sun',{},paint('sun')),
    cueForFill('ocean','bubble-0',{},paint('bubble-0')),
    cueForFill('village','star-0',{},paint('star-0')),
    cueForFill('ocean','sand',{},paint('sand'))
  ];
  assert.deepEqual(samples.map(s => s.kind),
    ['reaction-heart','reaction-beat','reaction-sun','reaction-bubble','reaction-star','color-tap']);
  for(const cue of samples) {
    assert.ok(cue.notes.length >= 1 && cue.notes.length <= 4);
    for(const tone of cue.notes) {
      assert.ok(tone.hz >= 65 && tone.hz <= 1400);
      assert.ok(tone.duration > 0 && tone.duration <= .55);
      assert.ok(tone.level <= .15);
    }
  }
});

test('bloom chime triggers when flower center is colored last OR third petal is colored last', () => {
  const afterCenter = paint('petal-a0','petal-a1','petal-a2','flower-a');
  assert.equal(cueForFill('meadow','flower-a',paint('petal-a0','petal-a1','petal-a2'),afterCenter).kind,
    'reaction-bloom');
  const beforePetal = paint('flower-a','petal-a0','petal-a1');
  const afterPetal = {...beforePetal,'petal-a2':color};
  assert.equal(cueForFill('meadow','petal-a2',beforePetal,afterPetal).kind,'reaction-bloom');
  assert.equal(cueForFill('meadow','petal-a0',{},paint('petal-a0')).kind,'reaction-petal');
});

test('color changes subtly determine pitch; volume is bounded', () => {
  assert.notEqual(pitchFromColor('#ff0000'),pitchFromColor('#0000ff'));
  assert.equal(pitchFromColor('not-a-color'),1);
  assert.equal(normalizeVolume(-500),0);
  assert.equal(normalizeVolume(500),100);
  assert.equal(normalizeVolume('n/a'),DEFAULT_VOLUME);
  assert.equal(previewCue('robot').kind,'reaction-heart');
  assert.equal(previewCue('ocean').kind,'reaction-bubble');
});

// Tiny Web Audio stand-in: no browser, sound files or npm dependencies required.
function audioHost() {
  const stats={created:0,resumed:0,closed:0,started:0,stopped:0,types:[]};
  class FakeParam {
    setValueAtTime() {}
    linearRampToValueAtTime() {}
    exponentialRampToValueAtTime() {}
  }
  class FakeContext {
    constructor(){stats.created++;this.state='suspended';this.currentTime=1;this.destination={};}
    resume(){stats.resumed++;this.state='running';return Promise.resolve();}
    close(){stats.closed++;this.state='closed';return Promise.resolve();}
    createOscillator(){
      const oscillator={frequency:new FakeParam(),type:'sine',connect(){},disconnect(){},
        start(){stats.started++;stats.types.push(oscillator.type)},
        stop(){stats.stopped++}};
      return oscillator;
    }
    createGain(){return {gain:new FakeParam(),connect(){},disconnect(){}};}
  }
  return {host:{AudioContext:FakeContext},stats};
}

test('AudioContext only opens after explicit enable and closes on mute', async () => {
  const {host,stats}=audioHost();
  const engine=createSoundbox(host);
  assert.equal(stats.created,0);
  assert.equal(engine.isEnabled(),false);
  assert.equal(engine.play(previewCue('robot'),35),false);
  assert.equal(stats.started,0);
  assert.equal(await engine.enable(),true);
  assert.equal(stats.created,1);
  assert.equal(stats.resumed,1);
  assert.equal(engine.play(previewCue('robot'),0),false);
  assert.equal(stats.started,0);
  assert.equal(engine.play(previewCue('robot'),35),true);
  assert.equal(stats.started,2);
  engine.disable();
  assert.equal(engine.isEnabled(),false);
  assert.equal(stats.closed,1);
  assert.equal(engine.play(previewCue('robot'),35),false);
});

test('soundbox handles unsupported audio and autoplay resume failure without throwing', async () => {
  const unsupported=createSoundbox({});
  assert.equal(await unsupported.enable(),false);
  assert.equal(unsupported.play(previewCue('meadow'),35),false);
  let closeCount=0;
  class RefusingAudio {
    constructor(){this.state='suspended';}
    resume(){return Promise.reject(new Error('blocked'))}
    close(){closeCount++;return Promise.resolve();}
  }
  const blocked=createSoundbox({AudioContext:RefusingAudio});
  assert.equal(await blocked.enable(),false);
  assert.equal(blocked.isEnabled(),false);
  assert.equal(closeCount,1);
});
