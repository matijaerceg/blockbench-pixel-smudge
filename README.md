# Pixel Smudge 0.1.1

A separate Blockbench 5.2+ brush plugin that carries pixels along your stroke, continually mixing in the colors it passes over. No AI service required.

## Download and install

[Download pixel_smudge.js](https://github.com/matijaerceg/blockbench-pixel-smudge/releases/latest/download/pixel_smudge.js).

Requires Blockbench 5.2+. This independent plugin is not currently listed in the built-in plugin store. No Node.js or build step is required to use it.

## Install and use

In File → Plugins → Load Plugin from File, select `pixel_smudge.js`. Switch to Paint mode and choose **Pixel Smudge** (dotted blur icon beside the normal brush). Its controls appear at the beginning of the top brush toolbar; hover for their names. Drag numbers sideways or click to type.

- **Smudge strength**, default 50%: how much carried color is applied at each step. Zero leaves pixels unchanged.
- **Color pickup**, default 25%: how quickly new pixels replace the carried color. Lower values smear the starting color farther; higher values pick up new colors faster.
- **Brush size** and square/circle shape use the normal Blockbench controls. Start at 1–3 pixels for pixel art.

Start on an existing color and drag through another. Each stroke starts with a fresh pickup. Works through Blockbench’s native texture painting system, in the texture editor or on the model. Ctrl+Z undoes the stroke.

## Layers and limits

Reads and edits **only the active layer**, not the merged appearance. An empty touch-up layer has nothing to pick up. Duplicate your artwork layer first if you want an untouched backup. Smudging a generated Pixel Material Painter layer will be overwritten when that plugin regenerates it.

Colors mix at the final texture resolution; this creates intermediate colors rather than preserving a fixed palette. Transparency mixes with color; Blockbench’s alpha lock preserves existing alpha. Each brush-footprint pixel carries its own color, rather than averaging the entire brush into one flat color.

Mirror painting must be off for this prototype. Screen-space projection and Shift straight-line strokes are disabled. Cross-texture strokes start separate color pickups. UV seams follow Blockbench’s native painting behavior; no seamless cross-island projection is added.

Verified in Blockbench 5.2.1 using native start/move/end paint operations: continual pickup produces a red-to-blue smear, one-stroke Undo/Redo restores exact pixels, new strokes reset pickup, and unloading removes controls. Tests write results to `test-results/validation.json`.

## 0.1.1

Removes stale duplicate tool registrations and toolbar entries before loading. Explicitly initializes Strength to 50 and Pickup to 25 and refreshes their visible fields on selection. Tested repeated registration without unload, normal reload, one remaining tool button, populated controls, and stroke Undo/Redo.


## Development

Run `npm ci`, then `npm test` from this repository. Tests use Playwright with installed Microsoft Edge and load the live Blockbench web application, so internet access is required. They cover painting, default controls, duplicate registration, Undo/Redo, stroke reset and unloading. Generated output is ignored in `test-results/`.

## Feedback

[Report bugs or suggest improvements](https://github.com/matijaerceg/blockbench-pixel-smudge/issues). Include your Blockbench version and whether you use the desktop or web app.

MIT licensed. Independent community plugin; not affiliated with Blockbench.
