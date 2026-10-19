# HueHatch 🎨

**The Living Coloring Book** is a free, original React coloring experience. Color original moving SVG worlds **as they animate**, using your own selected colors. Freeze the exact frame whenever you need a steadier canvas.

## Included
- Four original SVG worlds: Sunshine Meadow, Undersea Parade, Disco Bot 3000 and Moonbeam Village.
- Click/tap/keyboard fill, custom color palette, pencil drawing, white pen, undo/redo and reset.
- Browser-local autosave, coloring progress and still PNG downloads.
- Live animation while coloring (enabled by default), true freeze/resume, and 0.5× to 2× motion speeds.
- A browser-local gallery of up to 16 copy-only keepsakes, each retaining its original fills and pencil strokes.
- **Living Gallery:** animated SVG thumbnails with a pause/play control, respecting reduced-motion settings.
- **Reactive Coloring:** coloring a robot heart triggers a heartbeat, speaker cones pulse, three petals plus a flower center unlock a bloom, bubbles float further, and stars twinkle. Reactive highlights also appear in saved gallery previews and exported animated SVGs.
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
