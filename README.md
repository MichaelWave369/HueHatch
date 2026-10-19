# HueHatch 🎨

**The Living Coloring Book** is a free, original React coloring experience. Fill the shapes, then watch your own color choices move and dance.

## Included
- Four original SVG worlds: Sunshine Meadow, Undersea Parade, Disco Bot 3000 and Moonbeam Village.
- Click/tap/keyboard fill, custom color palette, pencil drawing, white pen, undo/redo and reset.
- Browser-local autosave, coloring progress and still PNG downloads.
- Automatic animation at 100% or preview animation anytime.
- Responsive web app, no account required, MIT license.

## Develop
Requires Node.js 22 or later.

    npm install
    npm run dev
    npm run build

## Deploy
After merging to main, enable **Settings → Pages → GitHub Actions**. The included deploy workflow will publish the React app to the project URL `https://michaelwave369.github.io/HueHatch/`.

Note: saved progress is kept only in this browser; exported PNGs are still images rather than animated videos. Google Fonts are requested for the interface font and can be replaced with local font stacks later.
