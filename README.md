# OccultFreakIO // All Seeing Eye (ARG Portal)

An interactive, atmospheric landing page for an Alternate Reality Game (ARG). Features a glowing **All Seeing Eye** sacred geometry sigil, mouse-tracking pupil, cryptographic password terminal, immersive Web Audio sound synthesis, and multiple layers of hidden clues for players.

---

## 🖼️ How to Add or Change Background Images

Adding a background image is designed to be as simple as changing a single line of code!

### Option 1: In `style.css` (Recommended)
Open [`style.css`](style.css) and look at the very top:

```css
:root {
  /* Set your background image URL or file path here: */
  --bg-image: url('assets/bg-occult.jpg');
  --bg-opacity: 0.38;   /* 0.0 (invisible) to 1.0 (fully visible) */
  --bg-blur: 0px;       /* Optional blur (e.g., 2px) */
}
```

- **Local Image**: Place your image inside the `assets/` folder (e.g. `assets/my-image.png`) and set `--bg-image: url('assets/my-image.png');`.
- **Web Image**: You can also use a web URL, like `--bg-image: url('https://example.com/arg-image.jpg');`.
- **No Image**: Set `--bg-image: none;` to display the dark mystic gradient instead.

### Option 2: In `script.js`
Open [`script.js`](script.js) and set `backgroundImage` in `ARG_CONFIG`:

```javascript
const ARG_CONFIG = {
  backgroundImage: "assets/your-custom-bg.jpg",
  // ...
};
```

---

## 🔐 How to Add & Edit Passwords & Clues

Open [`script.js`](script.js). The entire puzzle database is defined in `ARG_CONFIG.passwords`:

```javascript
passwords: {
  "eye": {
    status: "INITIATION VERIFIED",
    title: "ACCESS GRANTED // THE ALL SEEING EYE OPENS",
    message: "The veil of ignorance dissolves. You are recognized as an Initiate.",
    clue: "FREQUENCY: 142.857 MHz // TARGET: Groom Lake Facility // KEY-2: 'ouroboros'",
    redirectUrl: null // Set to a URL string if you want players redirected upon unlock!
  },
  "yourpassword": {
    status: "UNLOCKED",
    title: "STAGE COMPLETED",
    message: "Custom message for your ARG players...",
    clue: "Next clue text...",
    redirectUrl: "https://your-next-puzzle.com"
  }
}
```

- Passwords are automatically case-insensitive.
- You can add as many passwords, riddle solutions, and branch points as you'd like.

---

## 🕵️ Built-in ARG Easter Eggs

1. **HTML Meta Tags**: Inspecting the HTML reveals hidden clues like `clue-frequency="142.857 MHz"`, coordinates `37.2431 N, 115.7930 W`, and ROT-13 cipher notes.
2. **Developer Console**: Opening DevTools (`F12`) prints an ASCII All Seeing Eye and warning transmission.
3. **Web Audio Synthesizer**: Keystroke sound effects, failure buzz, and victory chords synthesized directly in the browser with zero external audio assets required.
4. **Interactive Sigil**: The pupil of the All Seeing Eye follows the player's cursor and touch movements.

---

## 🚀 Hosting on GitHub Pages

1. Go to your repository settings on GitHub (`Settings` > `Pages`).
2. Under **Build and deployment**, select:
   - **Source**: `Deploy from a branch`
   - **Branch**: `main` / `(root)`
3. Save, and your ARG page will be live at:
   `https://VenyySama-dev.github.io/OccultFreakIO/`