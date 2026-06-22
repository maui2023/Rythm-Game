# Music Notes: ABC Adventure!

A colorful, responsive, and educational 3D music rhythm game built for children and music enthusiasts. Players hit rhythmic note blocks falling down 7 lanes matching the notes **A, B, C, D, E, F, G** in sync with the beat.

The application is fully self-contained within [index.html](file:///home/maui/Documents/rythm/index.html) and styled with modern glassmorphism components.

## Features

- **3D WebGL Rhythm Engine:** Implemented with Three.js. Includes a fixed-perspective 3D viewport showing 7 vertical lanes colored in a bright rainbow layout.
- **Dynamic Visual Feedback:**
  - Note blocks are custom 3D cylinders with letters drawn on dynamic canvas textures.
  - Successfully hit notes pulse and glow intensely (increased emissive values) before scaling up and fading away.
  - Mistimed hits result in the note immediately shrinking and fading out rapidly without any glow.
  - 3D particle explosions burst outward on successful hits.
- **Embedded Web Audio Synthesis:**
  - Zero external media assets needed! The game generates cute, kid-friendly xylophone chime sounds using oscillator nodes (`OscillatorNode`).
  - Includes metronome/drum beats synthesized from white noise buffers (snare) and low-frequency sweeps (kick).
  - Three classic songs are available:
    - ⭐ *Twinkle Twinkle Little Star* (Easy)
    - 🐑 *Mary Had a Little Lamb* (Easy)
    - 🛶 *Row, Row, Row Your Boat* (Medium)
- **Flexible Authentication System:**
  - **Google SSO:** Click login, choose an account, and instantly start playing with automatic approval.
  - **Standard Signup:** Register with an email and password. Accounts start as "pending".
  - **Admin Control Panel:** Click the "Admin Console" link in the bottom-left corner of the authentication screens to approve pending accounts, delete accounts, or approve all users.
- **WebGL & Mobile Optimizations:**
  - Cap device pixel ratio rendering to `2.0` to preserve mobile framerates.
  - Geometries and materials are pooled and reused to prevent garbage collection frame drops.
  - Dynamic frame rates handled via `performance.now()` delta-time updates to keep speed consistent.

## Controls

### Mobile / Touch Devices
- Tap the circular colored lane buttons (**A, B, C, D, E, F, G**) at the bottom of the screen.

### Desktop / Keyboard
- Keyboard triggers map to two layout systems simultaneously:
  - **Home Row:** `A`, `S`, `D`, `F`, `G`, `H`, `J` (for Lane 1 through 7)
  - **Alphabet Keys:** Literal keys `a`, `b`, `c`, `d`, `e`, `f`, `g` on the keyboard

## Getting Started

### Method 1: Local Server (Recommended)
To run the game, serve the directory using a lightweight HTTP server to ensure Three.js resources and audio context load perfectly:

```bash
# Using Node/npx:
npx serve -l 8000

# Using Python 3:
python3 -m http.server 8000
```
Then open your web browser and navigate to `http://localhost:8000`.

### Method 2: Direct File Open
You can also open [index.html](file:///home/maui/Documents/rythm/index.html) directly in any modern browser by double-clicking it.
