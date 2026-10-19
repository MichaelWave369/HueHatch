import React from 'react';

function pathData(points) {
  return points.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
}

function MiniArtwork({ scene, painting, motionSpeed, playing }) {
  return (
    <svg viewBox="0 0 900 620" role="img" aria-label={scene.name + (playing ? ' moving coloring preview' : ' paused coloring preview')}
      className={'gallery-thumbnail world alive' + (playing ? '' : ' paused')} data-speed={motionSpeed} xmlns="http://www.w3.org/2000/svg">
      {scene.parts.map(part => React.createElement(part.tag, {
        key: part.id, ...part.attrs, fill: painting.fills[part.id] || '#ffffff', className: 'area ' + part.motion,
        stroke: ['sky', 'water', 'backdrop'].includes(part.id) ? 'none' : '#30263e',
        strokeWidth: 5, strokeLinejoin: 'round', strokeLinecap: 'round'
      }))}
      <g pointerEvents="none">
        {painting.strokes.map((s, i) => <path key={i} d={pathData(s.points)} fill="none"
          stroke={s.color} strokeWidth={s.size} strokeLinecap="round" strokeLinejoin="round"/>)}
      </g>
    </svg>
  );
}

export default function Gallery({ entries, scenes, onSave, onOpen, onDelete, onExport, motionSpeed }) {
  const [playing, setPlaying] = React.useState(true);
  return <section className="gallery" id="living-gallery" aria-labelledby="gallery-title">
    <div className="gallery-heading">
      <div>
        <div className="label">✳ YOUR KEEPSAKES · {entries.length} SAVED</div>
        <h2 id="gallery-title">Your living gallery</h2>
        <p>Keep a copy of any moment, even while you're still coloring.</p>
      </div>
      <div className="gallery-header-actions"><button type="button" className="gallery-motion" aria-pressed={playing}
        onClick={() => setPlaying(value => !value)}>{playing ? 'Ⅱ Pause gallery' : '▶ Play gallery'}</button>
      <button type="button" className="gallery-save" onClick={onSave}>＋ Save this artwork</button></div>
    </div>
    {entries.length ? <div className="gallery-grid">
      {entries.map(entry => {
        const scene = scenes.find(s => s.id === entry.sceneId);
        if (!scene) return null;
        const date = new Date(entry.savedAt);
        return <article className="gallery-card" key={entry.id}>
          <MiniArtwork scene={scene} painting={entry.painting} motionSpeed={motionSpeed} playing={playing}/>
          <div className="gallery-card-meta">
            <strong>{scene.emoji} {scene.name}</strong>
            <small>{Number.isNaN(date.getTime()) ? 'Saved artwork' : date.toLocaleDateString()}</small>
          </div>
          <div className="gallery-actions">
            <button type="button" onClick={() => onOpen(entry)}
              aria-label={'Open saved ' + scene.name + ' in editor'}>Open in editor</button>
            <button type="button" onClick={() => onExport(entry)} aria-label={'Download animated ' + scene.name}>↓ SVG</button>
            <button type="button" className="gallery-remove" onClick={() => onDelete(entry)}
              aria-label={'Delete saved ' + scene.name}>Delete</button>
          </div>
        </article>;
      })}
    </div> : <div className="gallery-empty">
      <strong>No keepsakes yet.</strong>
      <p>Tap “Save this artwork” to add your current coloring to the gallery. Your regular page autosave still works.</p>
    </div>}
    <p className="gallery-footnote">Saved in this browser only, up to 16 keepsakes. SVG downloads animate in compatible viewers. Opening a saved copy replaces that world's current editor page, with confirmation first.</p>
  </section>;
}
