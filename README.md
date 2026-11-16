# WRaith Portfolio

A cinematic, editorial-style frontend portfolio starter.

## Requirements
- Node.js 20.19+ or 22.12+
- VS Code

## Run locally
1. Extract this ZIP.
2. Open the `wraith-portfolio` folder in VS Code.
3. Open Terminal → New Terminal.
4. Run:

   ```bash
   npm install
   npm run dev
   ```

5. Open the local URL printed by Vite (usually `http://localhost:5173`).

## Build for publishing
```bash
npm run build
npm run preview
```
The production site is generated in the `dist` folder.

## Add your photographs
The current portrait is a designed placeholder, not a real photograph.
- Put your chosen portrait in the `public` folder as `portrait.jpg`.
- In `index.html`, replace both occurrences of `/portrait-placeholder.svg` with `/portrait.jpg`.
- Use a high-resolution portrait you have permission to publish.

## Before publishing
- Replace `hello@example.com` with a professional email address.
- Confirm the availability wording is accurate.
- Replace conceptual project frames with genuine projects and working links.
- Do not describe concept work as paid client work.

## Stack
HTML, CSS, JavaScript, Vite, Three.js and GSAP + ScrollTrigger.
The 3D capability objects use Three.js; the four capability-card illustrations also have lightweight CSS fallbacks.
