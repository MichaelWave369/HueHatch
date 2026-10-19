import React from 'react';

export default function SoundboxControls({ enabled, volume, onToggle, onVolume, onPreview, status }) {
  return <section className="soundbox" aria-labelledby="soundbox-title">
    <div className="label">✳ THE MAGIC SOUNDBOX</div>
    <h3 id="soundbox-title">Color with a little music</h3>
    <p>Soft robot beats, flower chimes, bubbly pops and moonlit notes respond when you fill a shape.</p>
    <button type="button" className={'soundbox-toggle' + (enabled ? ' soundbox-on' : '')}
      onClick={onToggle} aria-pressed={enabled}
      aria-label={enabled ? 'Turn off coloring sounds' : 'Turn on coloring sounds'}>
      {enabled ? '♪ Sounds on · Turn off' : '♫ Enable sounds'}
    </button>
    <div className="soundbox-volume">
      <label htmlFor="huehatch-volume">Volume</label>
      <input id="huehatch-volume" type="range" min="0" max="100" step="5"
        value={volume} onChange={e => onVolume(Number(e.target.value))}
        aria-valuetext={volume + ' percent'}/>
      <output htmlFor="huehatch-volume">{volume}%</output>
    </div>
    <button type="button" className="soundbox-preview" disabled={!enabled || volume === 0}
      onClick={onPreview}>♫ Preview this world</button>
    <div className="soundbox-status" role="status" aria-live="polite">
      {status || (enabled ? 'Sound is on. Fill a color to hear it!' : 'Muted by default. Nothing plays until you opt in.')}
    </div>
    <small className="soundbox-disclaimer">Made with your browser's Web Audio API. No recordings, downloads, microphone or external sound files. Sound turns off on every page reload.</small>
  </section>;
}
