/* =============================================================================
   2008 HORROR ARG CONFIGURATION
   -----------------------------------------------------------------------------
   Configure your background, passwords, clues, and responses here!
   ============================================================================= */
const ARG_CONFIG = {
  // Optional background image override in JavaScript.
  // By default, it uses the '--bg-image' in style.css.
  backgroundImage: "",

  // Sound enabled by default (toggle via [ audio: muted ] in the corner)
  soundEnabled: false,

  // Passwords and riddles (case-insensitive)
  passwords: {
    "eye": {
      title: "ACCESS GRANTED",
      message: "The eye has seen you. Tape 04 unsealed.",
      clue: "Seek frequency 142.857 MHz. Coordinates: 37.2431 N, 115.7930 W. Next word: 'ouroboros'",
      redirectUrl: null
    },
    "ouroboros": {
      title: "LOOP RECOGNIZED",
      message: "The tape restarts itself. It never ended.",
      clue: "Check the source code metadata for the date of the incident.",
      redirectUrl: null
    },
    "freak": {
      title: "CONNECTION ESTABLISHED",
      message: "You are not the first to find this camera.",
      clue: "Archive fragment: 'Don't look back into the hallway.'",
      redirectUrl: null
    }
  },

  // Randomized error messages when a wrong password is typed:
  errorMessages: [
    "access denied.",
    "invalid cipher key.",
    "tape sequence corrupted.",
    "nothing here.",
    "the eye is closed."
  ]
};

/* =============================================================================
   EASY BACKGROUND INITIALIZATION
   ============================================================================= */
(function initBackground() {
  if (ARG_CONFIG.backgroundImage && ARG_CONFIG.backgroundImage.trim() !== "") {
    const bg = document.getElementById("bg-layer");
    if (bg) {
      bg.style.backgroundImage = `url('${ARG_CONFIG.backgroundImage}')`;
    }
  }
})();

/* =============================================================================
   2008 ANALOG STATIC NOISE ENGINE (CANVAS)
   Generates authentic gritty TV / CCD sensor grain at 22 fps.
   ============================================================================= */
(function initNoiseCanvas() {
  const canvas = document.getElementById("noise-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  // Offscreen low-res buffer for genuine 2008 retro pixelated noise
  const bufferWidth = 240;
  const bufferHeight = 160;
  const offscreen = document.createElement("canvas");
  offscreen.width = bufferWidth;
  offscreen.height = bufferHeight;
  const offCtx = offscreen.getContext("2d");
  const imgData = offCtx.createImageData(bufferWidth, bufferHeight);
  const buffer32 = new Uint32Array(imgData.data.buffer);

  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  let lastFrame = 0;
  const fpsInterval = 1000 / 22; // 22 fps analog grain jitter

  function renderNoise(timestamp) {
    requestAnimationFrame(renderNoise);

    const elapsed = timestamp - lastFrame;
    if (elapsed < fpsInterval) return;
    lastFrame = timestamp - (elapsed % fpsInterval);

    const len = buffer32.length;
    for (let i = 0; i < len; i++) {
      // Gritty monochrome grain with occasional speckle
      const val = (Math.random() * 255) | 0;
      buffer32[i] = (255 << 24) | (val << 16) | (val << 8) | val;
    }

    offCtx.putImageData(imgData, 0, 0);

    // Blit scaled noise to full screen canvas
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(offscreen, 0, 0, canvas.width, canvas.height);
  }

  requestAnimationFrame(renderNoise);
})();

/* =============================================================================
   SYNTHESIZED 2008 HORROR AUDIO ENGINE
   Tape drone, static hiss, and mechanical keystrokes.
   ============================================================================= */
class HorrorAudioEngine {
  constructor() {
    this.ctx = null;
    this.enabled = ARG_CONFIG.soundEnabled;
    this.noiseNode = null;
    this.noiseGain = null;
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
    this.ensureContext();

    if (this.enabled) {
      this.startTapeHiss();
      this.playTone(300, 0.08, "square", 0.05);
    } else {
      this.stopTapeHiss();
    }
    return this.enabled;
  }

  startTapeHiss() {
    if (!this.ctx || this.noiseNode) return;

    // Generate gentle background tape static buffer
    const bufferSize = this.ctx.sampleRate * 2;
    const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const output = noiseBuffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      output[i] = Math.random() * 2 - 1;
    }

    const whiteNoise = this.ctx.createBufferSource();
    whiteNoise.buffer = noiseBuffer;
    whiteNoise.loop = true;

    // Filter to sound like low tape hiss / rumble
    const filter = this.ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.value = 800;
    filter.Q.value = 1.0;

    const gain = this.ctx.createGain();
    gain.gain.setValueAtTime(0.012, this.ctx.currentTime);

    whiteNoise.connect(filter);
    filter.connect(gain);
    gain.connect(this.ctx.destination);

    whiteNoise.start();
    this.noiseNode = whiteNoise;
    this.noiseGain = gain;
  }

  stopTapeHiss() {
    if (this.noiseNode) {
      try {
        this.noiseNode.stop();
        this.noiseNode.disconnect();
      } catch (e) {}
      this.noiseNode = null;
      this.noiseGain = null;
    }
  }

  playKeypress() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    const now = this.ctx.currentTime;

    osc.type = "triangle";
    osc.frequency.setValueAtTime(450 + Math.random() * 150, now);
    osc.frequency.exponentialRampToValueAtTime(100, now + 0.025);

    gain.gain.setValueAtTime(0.04, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.025);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.03);
  }

  playDenialDistortion() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.linearRampToValueAtTime(50, now + 0.3);

    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.3);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.32);
  }

  playSuccessDrone() {
    if (!this.enabled) return;
    this.ensureContext();
    if (!this.ctx) return;

    const freqs = [164.81, 196.00, 246.94]; // E minor chord
    const now = this.ctx.currentTime;

    freqs.forEach(freq => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.05, now + 0.2);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 2.6);
    });
  }

  playTone(freq, duration, type = "sine", volume = 0.05) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, now);

    gain.gain.setValueAtTime(volume, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }
}

const audio = new HorrorAudioEngine();

/* =============================================================================
   PUPIL CURSOR TRACKING (SUBTLE & UNSETTLING)
   ============================================================================= */
(function initPupil() {
  const pupilGroup = document.getElementById("pupil-group");
  const eye = document.getElementById("eye-container");
  if (!pupilGroup || !eye) return;

  function movePupil(clientX, clientY) {
    const rect = eye.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const dx = clientX - centerX;
    const dy = clientY - centerY;
    const angle = Math.atan2(dy, dx);
    const dist = Math.min(6, Math.hypot(dx, dy) / 25);

    const x = Math.cos(angle) * dist;
    const y = Math.sin(angle) * dist;

    pupilGroup.style.transform = `translate(${x}px, ${y}px)`;
  }

  window.addEventListener("mousemove", e => movePupil(e.clientX, e.clientY));
  window.addEventListener("touchmove", e => {
    if (e.touches && e.touches[0]) {
      movePupil(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });
})();

/* =============================================================================
   FORM LOGIC & PASSWORD VERIFICATION
   ============================================================================= */
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("password-form");
  const input = document.getElementById("password-input");
  const output = document.getElementById("output-log");
  const soundBtn = document.getElementById("sound-btn");
  const container = document.querySelector(".horror-container");

  // Audio Toggle
  soundBtn.addEventListener("click", () => {
    const isEnabled = audio.toggle();
    soundBtn.textContent = isEnabled ? "[ audio: on ]" : "[ audio: muted ]";
    soundBtn.style.color = isEnabled ? "#7cd986" : "";
  });

  // Typing Audio
  input.addEventListener("input", () => {
    audio.playKeypress();
  });

  // Form Submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const val = input.value.trim().toLowerCase();
    if (!val) return;

    // Immediate click feedback
    audio.playKeypress();

    // Check Password
    const match = ARG_CONFIG.passwords[val];

    output.innerHTML = ""; // Keep it simple and clean

    if (match) {
      // SUCCESS
      audio.playSuccessDrone();

      const lineTitle = document.createElement("div");
      lineTitle.className = "log-line success";
      lineTitle.textContent = `> ${match.title}`;
      output.appendChild(lineTitle);

      const lineMsg = document.createElement("div");
      lineMsg.className = "log-line";
      lineMsg.textContent = match.message;
      output.appendChild(lineMsg);

      if (match.clue) {
        const lineClue = document.createElement("div");
        lineClue.className = "log-line clue";
        lineClue.textContent = match.clue;
        output.appendChild(lineClue);
      }

      if (match.redirectUrl) {
        setTimeout(() => {
          window.location.href = match.redirectUrl;
        }, 3000);
      }
    } else {
      // DENIAL / ERROR
      audio.playDenialDistortion();

      // VHS tracking glitch
      container.classList.remove("glitch-active");
      void container.offsetWidth;
      container.classList.add("glitch-active");

      const randomErr = ARG_CONFIG.errorMessages[
        Math.floor(Math.random() * ARG_CONFIG.errorMessages.length)
      ];

      const errLine = document.createElement("div");
      errLine.className = "log-line error";
      errLine.textContent = `> ${randomErr}`;
      output.appendChild(errLine);
    }

    input.value = "";
    input.focus();
  });
});

/* =============================================================================
   CONSOLE EASTER EGG
   ============================================================================= */
(function printConsoleClue() {
  console.log("%c[REC: 2008-11-04 // CAM-02]", "color: #ff1111; font-family: monospace; font-size: 13px;");
  console.log("%cAll seeing eye is active. Don't look away from the screen.", "color: #888; font-family: monospace;");
})();