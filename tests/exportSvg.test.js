import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { renderAnimatedSvg, escapeXml } from '../src/exportSvg.js';

const example = {
  id: 'robot',
  name: 'Disco Bot 3000',
  parts: [
    {tag:'rect',id:'backdrop',attrs:{x:0,y:0,width:900,height:620},motion:''},
    {tag:'rect',id:'body',attrs:{x:340,y:333,width:218,height:144,rx:25},motion:'dance'},
    {tag:'path',id:'heart',attrs:{d:'M450 416Q410 396 429 384Z'},motion:'pulse'}
  ]
};

test('animated export preserves the chosen palette, paths and motion classes', () => {
  const painting={fills:{backdrop:'#d4a8ff',body:'#a26f60',heart:'#ff6f91'},
    strokes:[{color:'#7bb9ff',size:9,points:[[15,20],[25,35]]}]};
  const css='.world.alive .dance{animation:dance .8s infinite}@keyframes dance{to{transform:rotate(6deg)}}';
  const output=renderAnimatedSvg(example,painting,{speed:1.5,motionCss:css});
  assert.match(output,/<svg xmlns="http:\/\/www.w3.org\/2000\/svg"/);
  assert.match(output,/data-speed="1.5"/);
  assert.match(output,/fill="#d4a8ff"/);
  assert.match(output,/fill="#a26f60"/);
  assert.match(output,/fill="#ff6f91"/);
  assert.match(output,/class="area dance"/);
  assert.match(output,/stroke="#7bb9ff" stroke-width="9"/);
  assert.match(output,/M15 20 L25 35/);
  assert.match(output,/<style>.*@keyframes dance/s);
  assert.doesNotMatch(output,/<script\b/);
  assert.doesNotMatch(output,/<image\b/);
});

test('serializes XML-sensitive geometry as data, never markup', () => {
  const injected={id:'test',name:'<trick & "quote">',parts:[
    {tag:'path',id:'unsafe',attrs:{d:'M0 0 <script>alert("x")</script>'},motion:''},
    {tag:'script',id:'ignored',attrs:{d:'invalid'},motion:''}
  ]};
  const result=renderAnimatedSvg(injected,{fills:{unsafe:'url(javascript:evil)'},strokes:[]});
  assert.match(result,/<title>&lt;trick &amp; &quot;quote&quot;&gt;<\/title>/);
  assert.match(result,/&lt;script&gt;/);
  assert.doesNotMatch(result,/<script>/);
  assert.match(result,/fill="#ffffff"/);
  assert.equal(escapeXml("'<>&\""),'&apos;&lt;&gt;&amp;&quot;');
});

test('invalid speed falls back to normal and invalid stylesheet is rejected', () => {
  assert.match(renderAnimatedSvg(example,{}, {speed:999}),/data-speed="1"/);
  assert.throws(()=>renderAnimatedSvg(example,{}, {motionCss:'</style><script>'}),/stylesheet/);
  assert.throws(()=>renderAnimatedSvg(null,{}),/unknown scene/);
});

test('shared animation.css includes live motion, speed presets and reduced-motion support', () => {
  const css=readFileSync(new URL('../src/animation.css', import.meta.url),'utf8');
  for(const motion of ['.sun','.cloud','.flutter','.sway','.swim','.bob','.pulse','.dance']){
    assert.ok(css.includes(motion), 'missing '+motion);
  }
  for(const speed of ['0.5','1.5','2']){
    assert.ok(css.includes('data-speed="'+speed+'"'));
  }
  assert.match(css,/@media\(prefers-reduced-motion:reduce\)/);
  assert.match(css,/animation-play-state: paused/);
  assert.doesNotMatch(css,/@import|url\(/);
});
