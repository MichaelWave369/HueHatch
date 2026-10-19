# HueHatch 🎨

**The Living Coloring Book** is a free, original React coloring experience. Color original moving SVG worlds **as they animate**, using your own selected colors. Freeze the exact frame whenever you need a steadier canvas.

## Included
- **Seven** original SVG worlds: Sunshine Meadow, Undersea Parade, Disco Bot 3000, Moonbeam Village, **Dragon Skies, Enchanted Forest, and Cosmic Playground**.
- Click/tap/keyboard fill, custom color palette, pencil drawing, white pen, undo/redo and reset.
- Browser-local autosave, coloring progress and still PNG downloads.
- Live animation while coloring (enabled by default), true freeze/resume, and 0.5× to 2× motion speeds.
- A browser-local gallery of up to 16 copy-only keepsakes, each retaining its original fills and pencil strokes.
- **Living Gallery:** animated SVG thumbnails with a pause/play control, respecting reduced-motion settings.
- **Reactive Coloring:** coloring a robot heart triggers a heartbeat, speaker cones pulse, three petals plus a flower center unlock a bloom, bubbles float further, and stars twinkle. Reactive highlights also appear in saved gallery previews and exported animated SVGs.
- **Magic Soundbox (v0.5):** entirely original, opt-in synthesized coloring sounds using the Web Audio API: gentle robot heartbeats/bass, flower chimes, ocean bubbles and moonlit stars. Colors influence pitch. Includes preview, volume control (defaults to 35%), and sound off every page load.
- Accessible reactive-status messages and an unlocked-effects counter under each coloring page; Undo/Redo automatically updates effects with no saved-data migration.
- **Animated SVG export:** download the current world or a gallery keepsake as a self-contained moving SVG (CSS motion, no server, scripts or remote image assets).
- Open a saved copy in the editor with a confirmation before replacing its current page.
- Responsive web app, no account required, MIT license.

## Develop
Requires Node.js 22 or later.

    npm install
    npm run dev
    npm test
    npm run build

## Deploy
After merging to main, enable **Settings → Pages → GitHub Actions**. The included deploy workflow will publish the React app to the project URL `https://michaelwave369.github.io/HueHatch/`.

Note: saved pages and gallery keepsakes live only in this browser; clearing site data removes them. Gallery entries do not sync between devices. PNGs are still images. Animated SVG files play in compatible browsers, while some image viewers, social networks and chat applications show only the first frame. SVG is not a GIF or MP4. As in the editor, freehand pencil strokes remain stationary when scene shapes move. Reduced-motion operating system preferences are respected. Google Fonts are requested for the interface font and can be replaced with local font stacks later.

## v0.4 smoke test

1. Open Disco Bot, paint the heart, and confirm the heart grows/shrinks in your color. Color a woofer to add a beat.
2. Open Sunshine Meadow; color a flower center and three of its petals, and watch the center bloom.
3. Fill ocean bubbles and village stars; verify their unique movement.
4. Freeze frame, change animation speed, use Undo/Redo, and reopen old gallery items. Reactive effects must reflect actual saved fills only.
5. Export an animated SVG from the editor and gallery; open in a compatible browser and verify the same color-triggered behavior.
6. Enable reduced motion in your OS and confirm animations stop (static colors remain).

These are color-triggered CSS animations, not sound effects or character AI. They reuse existing SVG artwork and require no network service.
\n## v0.5 Soundbox safety and manual QA\n\n- Open the app or reload: **no sound should play** until you press *Enable sounds*. There are no autoplaying ambience loops.\n- Enable sound, then press *Preview this world*. Fill Disco Bot's heart and a woofer, then fill an ocean bubble, village star and flower petal. Each produces a different brief, gentle sound.\n- Color three petals and the flower center in either order. The bloom should make its special chime the moment the bloom condition is fulfilled.\n- Lower volume to 0: nothing plays; then raise it. Click *Turn off* to stop active notes immediately.\n- Reload the page: sound is off again. Your chosen volume remains in this browser; saved art and old animated SVG exports remain unchanged.\n- Test keyboard coloring, brush mode, reduced-motion settings, and an unsupported/blocked AudioContext. The coloring tool must remain usable when sound cannot start.\n\n**Scope:** Audio plays only for color-fill interactions after a deliberate enable action. It does not add soundtracks to PNG or animated SVG files, and it does not access the microphone, network or audio files.\n
## v0.6: Three new living worlds

- **Dragon Skies:** friendly dragon with independently colorable head, body, wings, tail, eyes, flame, mountain range and sparkles. Flapping wings and rainbow-fire effects, plus a gentle synthesized dragon sound when enabled.
- **Enchanted Forest:** moonlit grove with trees, glowing fireflies, giant mushrooms, pond and crystals; softly drifting lights and chimes.
- **Cosmic Playground:** rocket, colorful launch flame, orbiting planet/ring, moon, satellite, comet, asteroids and stars. Rocket ignition and space chimes through the optional Soundbox.
- All scenes use independent original SVG primitives, preserve existing autosave format, work with gallery snapshots, and export using the existing self-contained animated SVG pipeline. Sound remains off until you opt in.

### Quick test

1. Open each new world and tap-to-fill moving objects; verify the colored parts stay colored during animation.
2. Freeze/resume each new world, change animation speed, and verify Undo/Redo still work.
3. Try coloring a dragon wing and flame, a forest firefly and mushroom, and a rocket flame and planet. Confirm effects awaken and Soundbox cues play only when enabled.
4. Save and reopen a new-world gallery item, download its animated SVG and PNG, and check reload persistence.
5. Revisit all four original worlds to ensure the earlier pages and gallery keepsakes remain unchanged.
6. Test phone layout, keyboard fill, and system reduced-motion preference.

**Technical note:** New-world animations use only CSS and original SVG shapes; exported SVG files do not contain audio, and some image viewers show them as still images.
