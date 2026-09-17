/* =============================================================================
   ARG MASTER CONFIGURATION & PUZZLE DATABASE
   -----------------------------------------------------------------------------
   Configure your ARG secrets, passwords, hints, and background here!
   ============================================================================= */
const ARG_CONFIG = {
  // (Optional) JavaScript background image override.
  // Leave empty to use the background configured at the top of style.css.
  backgroundImage: "", 

  // Audio effects enabled by default (players can toggle via the top-right button)
  soundEnabled: false,

  // PUZZLE PASSWORDS (case-insensitive keys)
  // Add as many passwords / riddles as you want for your ARG!
  passwords: {
    "eye": {
      status: "INITIATION VERIFIED",
      title: "ACCESS GRANTED // THE ALL SEEING EYE OPENS",
      message: "The veil of ignorance dissolves. You are recognized as an Initiate of the Archive.",
      clue: "FREQUENCY: 142.857 MHz // SECTOR: Nevada 37.2431°N, 115.7930°W // NEXT KEYWORD: 'ouroboros'",
      redirectUrl: null // Set to a URL string (e.g. "https://...") if you want an automatic redirect!
    },
    "ouroboros": {
      status: "RECURSION CYCLE",
      title: "NODE 02 UNLOCKED // ETERNAL CONSUMPTION",
      message: "The serpent has swallowed its tail. Time is a circle without beginning or end.",
      clue: "TRANSMISSION: Look inside the HTML comments of this page for the third fragment.",
      redirectUrl: null
    },
    "freak": {
      status: "FELLOW OCCULTIST",
      title: "TRANSMISSION RECEIVED // OCCULT FREAK RECOGNIZED",
      message: "You have found the inner sanctum. Keep your eyes sharp and ears open.",
      clue: "ARCHIVE HASH: SHA-256 [0x7f4a...9b12]. We will contact you soon.",
      redirectUrl: null
    }
  },

  // Randomized messages when an incorrect password is entered:
  denialMessages: [
    "ACCESS DENIED // Invalid cipher token.",
    "THE EYE REMAINS BLIND // Hash mismatch in sub-sector 9.",
    "AUTHENTICATION FAILED // Your IP signature has been logged.",
    "CIPHER REJECTED // The veil will not yield to this key.",
    "SECURITY BREACH DETECTED // Return to terminal zero."
  ]
};

/* =============================================================================
   BACKGROUND DYNAMIC INITIALIZATION
   ============================================================================= */
(function initBackground() {
  if (ARG_CONFIG.backgroundImage && ARG_CONFIG.backgroundImage.trim() !== "") {
    const bgLayer = document.getElementById("bg-layer");
    if (bgLayer) {
      bgLayer.style.backgroundImage = `url('${ARG_CONFIG.backgroundImage}')`;
    }
  }
})();

/* =============================================================================
   SYNTHESIZED WEB AUDIO ENGINE (Zero External Audio Files Needed)
   ============================================================================= */
class ArgAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = ARG_CONFIG.soundEnabled;
  }

  ensureContext() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) {
        this.ctx = new AudioContext();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.ensureContext();
      this.playBeep(440, 0.08, "sine");
    }
    return this.enabled;
  }

  playKeypress() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = "sine";
    // Subtle typewriter click tone
    osc.frequency.setValueAtTime(750 + Math.random() * 250, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.035);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.035);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.04);
  }

  playDenialBuzz() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(140, now);
    osc.frequency.linearRampToValueAtTime(80, now + 0.35);

    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.35);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.36);
  }

  playSuccessChord() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const freqs = [220, 277.18, 329.63, 440, 554.37]; // A major chord
    const now = this.ctx.currentTime;

    freqs.forEach((freq, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now + idx * 0.06);

      gain.gain.setValueAtTime(0.001, now + idx * 0.06);
      gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.06 + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.8);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now + idx * 0.06);
      osc.stop(now + 2.0);
    });
  }

  playBeep(freq, duration, type = "sine") {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(0.08, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }
}

const audioEngine = new ArgAudioEngine();

/* =============================================================================
   INTERACTIVE SACRED EYE (Pupil Tracks Mouse / Touch)
   ============================================================================= */
(function initPupilTracking() {
  const pupilGroup = document.getElementById("interactive-pupil-group");
  const eyeWrapper = document.getElementById("eye-wrapper");

  if (!pupilGroup || !eyeWrapper) return;

  function updateEyePosition(clientX, clientY) {
    const rect = eyeWrapper.getBoundingClientRect();
    const eyeCenterX = rect.left + rect.width / 2;
    const eyeCenterY = rect.top + rect.height / 2;

    const deltaX = clientX - eyeCenterX;
    const deltaY = clientY - eyeCenterY;

    const angle = Math.atan2(deltaY, deltaX);
    const distance = Math.min(10, Math.hypot(deltaX, deltaY) / 18);

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    pupilGroup.style.transform = `translate(${moveX}px, ${moveY}px)`;
    pupilGroup.style.transition = "transform 0.08s ease-out";
  }

  window.addEventListener("mousemove", (e) => {
    updateEyePosition(e.clientX, e.clientY);
  });

  window.addEventListener("touchmove", (e) => {
    if (e.touches && e.touches[0]) {
      updateEyePosition(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
})();

/* =============================================================================
   PASSWORD AUTHENTICATION & TERMINAL LOGIC
   ============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("password-form");
  const input = document.getElementById("password-input");
  const display = document.getElementById("terminal-display");
  const attemptsBadge = document.getElementById("attempts-badge");
  const statusTag = document.getElementById("status-tag");
  const occultCard = document.getElementById("occult-card");
  const soundBtn = document.getElementById("sound-toggle-btn");
  const soundIconOff = document.getElementById("sound-icon-off");
  const soundIconOn = document.getElementById("sound-icon-on");
  const soundLabel = document.getElementById("sound-label");

  let attempts = 0;
  let isProcessing = false;

  // Sound Toggle Handler
  soundBtn.addEventListener("click", () => {
    const isNowEnabled = audioEngine.toggle();
    if (isNowEnabled) {
      soundIconOff.classList.add("hidden");
      soundIconOn.classList.remove("hidden");
      soundLabel.textContent = "AUDIO: ON";
      soundBtn.style.color = "var(--color-gold-bright)";
      soundBtn.style.borderColor = "var(--color-gold-bright)";
      logTerminalLine("SYSTEM: Audio feedback synthesizer connected.", "ready");
    } else {
      soundIconOff.classList.remove("hidden");
      soundIconOn.classList.add("hidden");
      soundLabel.textContent = "AUDIO: MUTED";
      soundBtn.style.color = "";
      soundBtn.style.borderColor = "";
      logTerminalLine("SYSTEM: Audio feedback muted.", "hint");
    }
  });

  // Typing sound effect
  input.addEventListener("input", () => {
    audioEngine.playKeypress();
  });

  // Form Submit / Password Verification
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (isProcessing) return;

    const rawValue = input.value.trim();
    if (!rawValue) return;

    const normalizedValue = rawValue.toLowerCase();
    attempts++;
    attemptsBadge.textContent = `ATTEMPTS: ${attempts}`;
    isProcessing = true;

    // Log query in terminal
    logTerminalLine(`&gt; QUERY: "${escapeHtml(rawValue)}"`, "ready");

    // Check if entered value is in our password database
    setTimeout(() => {
      const match = ARG_CONFIG.passwords[normalizedValue];

      if (match) {
        // SUCCESS / CIPHER ACCEPTED
        handlePasswordSuccess(match);
      } else {
        // FAILED / ACCESS DENIED
        handlePasswordDenied();
      }

      isProcessing = false;
      input.value = "";
      input.focus();
    }, 400);
  });

  function handlePasswordSuccess(match) {
    audioEngine.playSuccessChord();

    // Card Glow & Status Update
    occultCard.classList.add("unlocked-card");
    statusTag.textContent = `STATUS: ${match.status || "UNLOCKED"}`;
    statusTag.classList.add("unlocked");

    logTerminalLine(`&gt; ${match.title}`, "granted");
    logTerminalLine(`&gt; ${match.message}`, "granted");
    
    if (match.clue) {
      logTerminalLine(`&gt; ${match.clue}`, "clue");
    }

    if (match.redirectUrl) {
      logTerminalLine(`&gt; REDIRECTING IN 3 SECONDS...`, "ready");
      setTimeout(() => {
        window.location.href = match.redirectUrl;
      }, 3000);
    }
  }

  function handlePasswordDenied() {
    audioEngine.playDenialBuzz();

    // Shake Card Animation
    occultCard.classList.remove("shake-card");
    void occultCard.offsetWidth; // Trigger reflow
    occultCard.classList.add("shake-card");

    setTimeout(() => {
      occultCard.classList.remove("shake-card");
    }, 500);

    // Pick a random denial message
    const randomMsg = ARG_CONFIG.denialMessages[
      Math.floor(Math.random() * ARG_CONFIG.denialMessages.length)
    ];

    logTerminalLine(`&gt; ${randomMsg}`, "denied");
  }

  function logTerminalLine(htmlText, typeClass = "") {
    const line = document.createElement("div");
    line.className = `term-row ${typeClass}`;
    line.innerHTML = htmlText;
    display.appendChild(line);

    // Keep scroll pinned to bottom
    display.scrollTop = display.scrollHeight;
  }

  function escapeHtml(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});

/* =============================================================================
   DEVELOPER CONSOLE CLUES FOR ARG PLAYERS
   ============================================================================= */
(function printConsoleEasterEgg() {
  const asciiEye = `
         .---.
        /     \\
       | () () |     [ OCCULT // FREAK // ALL SEEING EYE ]
        \\  -  /      NODE-404 ARCHIVE
         '---'
  `;

  console.log("%c" + asciiEye, "color: #ffd56b; font-family: monospace; font-weight: bold;");
  console.log(
    "%c[!] WARNING: Unregistered terminal connection detected.%c\n" +
    "Frequency: 142.857 MHz\n" +
    "Coordinates: 37.2431° N, 115.7930° W\n" +
    "Cipher hint: What sees all from the top of the pyramid?",
    "color: #ff3366; font-weight: bold; font-size: 13px;",
    "color: #d4af37; font-family: monospace; font-size: 11px;"
  );
})();