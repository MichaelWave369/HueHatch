# HueHatch 🎨

**The Living Coloring Book** is a free, original React coloring experience. Color original moving SVG worlds **as they animate**, using your own selected colors. Freeze the exact frame whenever you need a steadier canvas.

## Included
- Four original SVG worlds: Sunshine Meadow, Undersea Parade, Disco Bot 3000 and Moonbeam Village.
- Click/tap/keyboard fill, custom color palette, pencil drawing, white pen, undo/redo and reset.
- Browser-local autosave, coloring progress and still PNG downloads.
- Live animation while coloring (enabled by default), true freeze/resume, and 0.5× to 2× motion speeds.
- A browser-local gallery of up to 16 copy-only keepsakes, each retaining its original fills and pencil strokes.
- **Living Gallery:** animated SVG thumbnails with a pause/play control, respecting reduced-motion settings.
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
