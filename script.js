/* =========================================================
   EDIT THIS PART — make it yours
   ========================================================= */
const CONFIG = {
  // Browser tab title
  tabTitle: "A Goodbye, For Now",

  // Line that types itself out under the heading.
  // One line = types once and stays. Several lines = they cycle.
  typeLines: [
    "But if you did, I have a very special message for you.",
  ],

  // Flip cards: front emoji + the message revealed on the back
  reasons: [
    { icon: "💪", text: "How brave and strong you are, even when things aren't easy." },
    { icon: "🫶", text: "You actually care about people, even when it costs you something." },
    { icon: "✨", text: "Talking to you makes an ordinary day feel less ordinary." },
    { icon: "😊", text: "I love your smile more than anything else in this universe." },
    { icon: "👗", text: "I admire the influencer in you — and those lovely outfits." },
    { icon: "🌙", text: "Late-night conversations with you are my favourite kind." },
  ],

  // Shown when she taps "I forgive you"
  forgivenMessage: "Thank you. I promise I'll be better. 🤍",

  // Photo gallery revealed after "I forgive you".
  // src = file in the photos/ folder, caption = the cute/funny line under it.
  photos: [
    { src: "photos/photo-1.jpeg", caption: "Full Messi cosplay. Yes, I practised this pose." },
    { src: "photos/photo-2.jpeg", caption: "Caught wearing an owl, in a room full of plushies. No notes." },
    { src: "photos/photo-3.jpeg", caption: "The 'I know I messed up' face, in HD." },
    { src: "photos/photo-4.jpeg", caption: "Pretending to know things about drinks. I don't." },
    { src: "photos/photo-5.jpeg", caption: "Public transport does things to a man." },
    { src: "photos/photo-6.jpeg", caption: "Blurry, pouting, slightly unhinged. Peak me, honestly." },
  ],

  // Cycled when she taps "Not yet"
  notYetMessages: [
    "That's fair. I'll be here.",
    "Take your time, I mean it.",
    "Okay. Still sorry though. 🥺",
    "No rush. Really.",
  ],

  // Unlocked after tapping the little heart in the footer enough times
  secretMessage: "Okay you found it — you're kind of the best. Coffee's on me. ☕",
  secretAfterTaps: 8,

  // "I've read your letter" button at the end of the goodbye letter.
  // 1) Phone notification (free, no account): install the "ntfy" app,
  //    tap +, subscribe to this exact topic name. Keep the name private.
  ntfyTopic: "letter-read-290b4683785d",
  // 2) Optional email: get a free access key at https://web3forms.com
  //    (enter your email, they send you the key) and paste it here.
  web3formsKey: "",
  // {name} is replaced with the name they type
  readMessage: "{name} read your letter, all the way to the end. 🤍",
  readMessageReply: "Their words:",
  readThanks: "Thank you for reading it.",
  readThanksSmall: "I've been notified that you've read my feelings.",
};

/* =========================================================
   No need to edit below this line
   ========================================================= */

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const isTouch = window.matchMedia("(hover: none)").matches;

document.title = CONFIG.tabTitle;

/* ---------- toast helper ---------- */
const toast = document.getElementById("toast");
let toastTimer;
function showToast(msg) {
  toast.textContent = msg;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => (toast.hidden = true), 300);
  }, 2600);
}

/* ---------- typewriter ---------- */
const typeEl = document.getElementById("typeLine");
(function typewriter() {
  if (reduceMotion) {
    typeEl.textContent = CONFIG.typeLines.join(" ");
    return;
  }
  let li = 0, ci = 0, deleting = false;
  const caret = document.createElement("span");
  caret.className = "caret";
  caret.innerHTML = "&nbsp;";
  function tick() {
    const full = CONFIG.typeLines[li];
    ci += deleting ? -1 : 1;
    typeEl.textContent = full.slice(0, ci);
    typeEl.appendChild(caret);
    let delay = deleting ? 30 : 55;
    if (!deleting && ci === full.length && CONFIG.typeLines.length === 1) {
      return; // single line: type it once and leave it there
    }
    if (!deleting && ci === full.length) {
      delay = 1500;
      deleting = true;
    } else if (deleting && ci === 0) {
      deleting = false;
      li = (li + 1) % CONFIG.typeLines.length;
      delay = 300;
    }
    setTimeout(tick, delay);
  }
  tick();
})();

/* ---------- flip cards ---------- */
const grid = document.getElementById("reasonsGrid");
CONFIG.reasons.forEach((r) => {
  const btn = document.createElement("button");
  btn.className = "flip";
  btn.setAttribute("aria-label", "Reveal a message");
  btn.innerHTML =
    '<div class="flip-inner">' +
    '<div class="flip-face flip-front">' + r.icon + "</div>" +
    '<div class="flip-face flip-back">' + r.text + "</div>" +
    "</div>";
  btn.addEventListener("click", () => {
    btn.classList.toggle("open");
    if (btn.classList.contains("open")) burstAt(btn, 12);
  });
  grid.appendChild(btn);
});

/* ---------- floating hearts ---------- */
const heartLayer = document.querySelector(".hearts");
const heartChars = ["💗", "💖", "💕", "🩷", "💘"];
let heartCount = 0;
const heartCountEl = document.getElementById("heartCount");

function spawnHeart(x) {
  const h = document.createElement("span");
  h.className = "heart";
  h.textContent = heartChars[Math.floor(Math.random() * heartChars.length)];
  h.style.left = (x != null ? x : Math.random() * 100) + "vw";
  h.style.fontSize = 14 + Math.random() * 22 + "px";
  const dur = 6 + Math.random() * 6;
  h.style.animationDuration = dur + "s";
  heartLayer.appendChild(h);
  heartCount++;
  heartCountEl.textContent = heartCount;
  setTimeout(() => h.remove(), dur * 1000);
}

if (!reduceMotion) {
  setInterval(() => spawnHeart(), 900);
  for (let i = 0; i < 4; i++) setTimeout(() => spawnHeart(), i * 300);
}

/* ---------- reveal on scroll ---------- */
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.15 }
);
// cards only start hidden once this runs, so they never get stuck invisible
document.documentElement.classList.add("reveal-ready");
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ---------- mood emoji: tap to send a heart burst ---------- */
const moodEmoji = document.getElementById("moodEmoji");
if (moodEmoji) moodEmoji.addEventListener("click", () => {
  for (let i = 0; i < 6; i++) setTimeout(() => spawnHeart(45 + Math.random() * 10), i * 80);
  chime(660);
});

/* ---------- floating emoji reaction that pops from a point ---------- */
function floatEmoji(x, y, char) {
  const s = document.createElement("span");
  s.className = "float-emoji";
  s.textContent = char;
  s.style.left = x + "px";
  s.style.top = y + "px";
  s.style.setProperty("--dx", (Math.random() * 80 - 40).toFixed(0) + "px");
  s.style.setProperty("--rot", (Math.random() * 50 - 25).toFixed(0) + "deg");
  document.body.appendChild(s);
  setTimeout(() => s.remove(), 1400);
}

/* ---------- interactive "what I'll do better" ---------- */
const loveChars = ["❤️", "💖", "🥹", "✨", "💐", "🫶", "💞"];
let reactions = 0;
const reactCountEl = document.getElementById("reactCount");

function reactFrom(el, emoji) {
  const r = el.getBoundingClientRect();
  const n = reduceMotion ? 1 : 7;
  for (let i = 0; i < n; i++) {
    const char = emoji || loveChars[Math.floor(Math.random() * loveChars.length)];
    const x = r.left + r.width * (0.15 + Math.random() * 0.7);
    const y = r.top + r.height * 0.5;
    if (reduceMotion) floatEmoji(x, y, char);
    else setTimeout(() => floatEmoji(x, y, char), i * 55);
  }
  reactions++;
  reactCountEl.hidden = false;
  reactCountEl.textContent =
    reactions === 1
      ? "1 promise sealed 💗"
      : reactions + " reactions sent 💗";
  chime(523.25 + Math.min(reactions, 12) * 18);
}

document.querySelectorAll("#promises li").forEach((li) => {
  li.tabIndex = 0;
  li.setAttribute("role", "button");
  const fire = () => {
    reactFrom(li, li.dataset.emoji);
    li.classList.remove("thump");
    void li.offsetWidth;
    li.classList.add("thump");
  };
  li.addEventListener("click", fire);
  li.addEventListener("keydown", (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fire();
    }
  });
});

document.querySelectorAll("#reactBar button").forEach((b) => {
  b.addEventListener("click", () => reactFrom(b, b.dataset.emoji));
});

/* ---------- forgiveness meter ---------- */
const meter = document.getElementById("meter");
const meterPct = document.getElementById("meterPct");
const meterLabel = document.getElementById("meterLabel");
const moods = [
  { max: 5, emoji: "😡", label: "Still pretty upset. Understandable." },
  { max: 25, emoji: "😠", label: "Not happy with me. Fair enough." },
  { max: 50, emoji: "😐", label: "Somewhere in the middle." },
  { max: 75, emoji: "🙂", label: "Getting there, slowly." },
  { max: 95, emoji: "😌", label: "Almost okay again." },
  { max: 100, emoji: "🥰", label: "All forgiven. I don't deserve it, thank you." },
];
let hitFull = false;

function onMeter() {
  const v = +meter.value;
  meterPct.textContent = v;
  meter.style.setProperty("--fill", v + "%");
  document.documentElement.style.setProperty("--hue", 335 + (v / 100) * 60);
  const mood = moods.find((m) => v <= m.max);
  if (moodEmoji) moodEmoji.textContent = mood.emoji;
  meterLabel.textContent = mood.label;
  if (v === 100 && !hitFull) {
    hitFull = true;
    burstConfetti();
    showToast("You made my whole week. 💛");
  }
  if (v < 100) hitFull = false;
}
meter.addEventListener("input", onMeter);

/* ---------- "Not yet" button dodges ---------- */
const noBtn = document.getElementById("noBtn");
let dodges = 0;
if (!isTouch) noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("click", (e) => {
  e.preventDefault();
  dodge();
  showNotYet();
});

function dodge() {
  if (reduceMotion) return;
  dodges++;
  const rangeX = Math.min(140, window.innerWidth * 0.18);
  const rangeY = isTouch ? 26 : 70;
  let x = (Math.random() - 0.5) * 2 * rangeX;
  const y = (Math.random() - 0.5) * 2 * rangeY;
  const r = noBtn.getBoundingClientRect();
  const margin = 8;
  x = Math.max(-r.left + margin, Math.min(window.innerWidth - r.right - margin, x));
  noBtn.style.transform = `translate(${x}px, ${y}px)`;
  if (dodges === 3) noBtn.textContent = "Hmm...";
  if (dodges === 6) noBtn.textContent = "You sure?";
}

const responseEl = document.getElementById("response");
let notYetIdx = 0;
function showNotYet() {
  responseEl.hidden = false;
  responseEl.textContent =
    CONFIG.notYetMessages[notYetIdx % CONFIG.notYetMessages.length];
  notYetIdx++;
}

/* ---------- "I forgive you" -> confetti + reveal gallery ---------- */
const yesBtn = document.getElementById("yesBtn");
yesBtn.addEventListener("click", () => {
  responseEl.hidden = false;
  responseEl.textContent = CONFIG.forgivenMessage;
  burstConfetti();
  chime(523.25);
  setTimeout(() => chime(659.25), 120);
  setTimeout(() => chime(783.99), 240);
  openGallery();
});

/* ---------- photo gallery ---------- */
const gallery = document.getElementById("gallery");
const galImg = document.getElementById("galImg");
const galCaption = document.getElementById("galCaption");
const galDots = document.getElementById("galDots");
const galIndexEl = document.getElementById("galIndex");
const galTotalEl = document.getElementById("galTotal");
const galDownload = document.getElementById("galDownload");
const galDownloadAll = document.getElementById("galDownloadAll");
const galPrev = document.getElementById("galPrev");
const galNext = document.getElementById("galNext");
const photos = CONFIG.photos || [];
let galAt = 0;
let galAuto = null;
let galleryOpen = false;

galTotalEl.textContent = photos.length;
photos.forEach((_, i) => {
  const d = document.createElement("button");
  d.setAttribute("aria-label", "Go to photo " + (i + 1));
  d.addEventListener("click", () => {
    showPhoto(i);
    restartAuto();
  });
  galDots.appendChild(d);
});

function fileName(src) {
  const base = src.split("/").pop().split(".")[0];
  return "cute-pic-" + base.replace(/[^\w-]/g, "") + ".jpeg";
}

function showPhoto(i) {
  if (!photos.length) return;
  galAt = (i + photos.length) % photos.length;
  const p = photos[galAt];
  galImg.src = p.src;
  galImg.alt = p.caption;
  galCaption.textContent = p.caption;
  galIndexEl.textContent = galAt + 1;
  galDownload.href = p.src;
  galDownload.setAttribute("download", fileName(p.src));
  [...galDots.children].forEach((d, k) => d.classList.toggle("active", k === galAt));
}

function restartAuto() {
  clearInterval(galAuto);
  if (reduceMotion) return;
  galAuto = setInterval(() => showPhoto(galAt + 1), 3500);
}

galPrev.addEventListener("click", () => { showPhoto(galAt - 1); restartAuto(); });
galNext.addEventListener("click", () => { showPhoto(galAt + 1); restartAuto(); });

galDownloadAll.addEventListener("click", () => {
  photos.forEach((p, i) => {
    setTimeout(() => {
      const a = document.createElement("a");
      a.href = p.src;
      a.download = fileName(p.src);
      document.body.appendChild(a);
      a.click();
      a.remove();
    }, i * 400);
  });
  showToast("Saving all " + photos.length + " of my questionable selfies 📥");
});

function openGallery() {
  if (galleryOpen || !photos.length) return;
  galleryOpen = true;
  gallery.hidden = false;
  showPhoto(0);
  restartAuto();
  setTimeout(() => gallery.scrollIntoView({ behavior: "smooth", block: "center" }), 200);
}

/* ---------- secret heart tap ---------- */
const heartTap = document.getElementById("heartTap");
const secret = document.getElementById("secret");
let taps = 0;
heartTap.addEventListener("click", () => {
  taps++;
  spawnHeart(50);
  chime(440 + taps * 30);
  if (taps === CONFIG.secretAfterTaps) {
    secret.hidden = false;
    secret.textContent = CONFIG.secretMessage;
    burstConfetti();
  } else if (taps < CONFIG.secretAfterTaps) {
    heartTap.title = CONFIG.secretAfterTaps - taps + " more...";
  }
});

/* ---------- confetti ---------- */
function burstConfetti() {
  if (reduceMotion) return;
  const colors = ["#ff6b9d", "#ffb703", "#8ecae6", "#c77dff", "#ffffff"];
  for (let i = 0; i < 90; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = Math.random() * 100 + "vw";
    c.style.background = colors[Math.floor(Math.random() * colors.length)];
    c.style.animationDuration = 2.5 + Math.random() * 2 + "s";
    c.style.animationDelay = Math.random() * 0.6 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 5000);
  }
}

// small confetti puff anchored to an element
function burstAt(el, n) {
  if (reduceMotion) return;
  const r = el.getBoundingClientRect();
  const colors = ["#ff6b9d", "#ffb703", "#c77dff"];
  for (let i = 0; i < n; i++) {
    const c = document.createElement("div");
    c.className = "confetti";
    c.style.left = r.left + r.width / 2 + "px";
    c.style.top = r.top + "px";
    c.style.background = colors[i % colors.length];
    c.style.animationDuration = 1.6 + Math.random() * 1.4 + "s";
    document.body.appendChild(c);
    setTimeout(() => c.remove(), 3200);
  }
}

/* ---------- optional ambient sound (generated, no files) ---------- */
let audioCtx = null;
let soundOn = false;
let loopTimer = null;
const soundToggle = document.getElementById("soundToggle");

function chime(freq) {
  if (!soundOn || !audioCtx) return;
  const o = audioCtx.createOscillator();
  const g = audioCtx.createGain();
  o.type = "sine";
  o.frequency.value = freq;
  g.gain.value = 0.0001;
  o.connect(g).connect(audioCtx.destination);
  const t = audioCtx.currentTime;
  g.gain.exponentialRampToValueAtTime(0.12, t + 0.02);
  g.gain.exponentialRampToValueAtTime(0.0001, t + 1.1);
  o.start(t);
  o.stop(t + 1.2);
}

const melody = [523.25, 659.25, 783.99, 659.25, 587.33, 698.46];
let mi = 0;
function ambientLoop() {
  chime(melody[mi % melody.length] / 2);
  mi++;
  loopTimer = setTimeout(ambientLoop, 1400);
}

soundToggle.addEventListener("click", () => {
  soundOn = !soundOn;
  soundToggle.setAttribute("aria-pressed", String(soundOn));
  soundToggle.firstElementChild.textContent = soundOn ? "🔊" : "🔈";
  if (soundOn) {
    audioCtx = audioCtx || new (window.AudioContext || window.webkitAudioContext)();
    if (audioCtx.state === "suspended") audioCtx.resume();
    ambientLoop();
    showToast("Music on 🎵");
  } else {
    clearTimeout(loopTimer);
    showToast("Music off");
  }
});

/* ---------- shake to say sorry (mobile) ---------- */
let lastShake = 0;
function onMotion(e) {
  const a = e.accelerationIncludingGravity;
  if (!a) return;
  const force = Math.abs(a.x || 0) + Math.abs(a.y || 0) + Math.abs(a.z || 0);
  const now = Date.now();
  if (force > 32 && now - lastShake > 1200) {
    lastShake = now;
    for (let i = 0; i < 8; i++) setTimeout(() => spawnHeart(), i * 60);
    showToast("I'm sorry, I'm sorry, I'm sorry 🥺");
  }
}

if (isTouch && typeof DeviceMotionEvent !== "undefined") {
  // iOS needs a permission prompt triggered by a tap
  if (typeof DeviceMotionEvent.requestPermission === "function") {
    document.body.addEventListener(
      "click",
      function askMotion() {
        DeviceMotionEvent.requestPermission()
          .then((s) => s === "granted" && window.addEventListener("devicemotion", onMotion))
          .catch(() => {});
        document.body.removeEventListener("click", askMotion);
      },
      { once: true }
    );
  } else {
    window.addEventListener("devicemotion", onMotion);
  }
}

/* =========================================================
   Envelope + closure screen — dark, quiet, with the song
   ========================================================= */
const closure = document.getElementById("closure");
const closureSky = document.getElementById("closureSky");
const closureSong = document.getElementById("closureSong");
const closureMusic = document.getElementById("closureMusic");
const closureBack = document.getElementById("closureBack");
const envelope = document.getElementById("openClosure");
const envelopeCard = document.getElementById("envelopeCard");
let closureIsOpen = false;
let skyBuilt = false;
let fadeObserver = null;
let volumeAnim = null;

// a few faint, slowly drifting specks of light
function buildSky() {
  if (skyBuilt || reduceMotion) return;
  skyBuilt = true;
  for (let i = 0; i < 40; i++) {
    const d = document.createElement("span");
    d.className = "speck";
    d.style.left = Math.random() * 100 + "%";
    d.style.top = Math.random() * 100 + "%";
    const size = 1 + Math.random() * 2;
    d.style.width = d.style.height = size + "px";
    d.style.animationDuration = 14 + Math.random() * 18 + "s";
    d.style.animationDelay = -Math.random() * 20 + "s";
    closureSky.appendChild(d);
  }
}

// The song is routed through a volume knob (gain) so it can start silently
// inside her tap, then fade in later. Phones only allow sound that starts in
// a tap, and iPhones ignore the normal volume setting, so this works on both.
let songCtx = null;
let songGain = null;

function ensureSongGraph() {
  try {
    // play even when the iPhone's silent switch is on
    if (navigator.audioSession) navigator.audioSession.type = "playback";
    if (!songCtx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      songCtx = new AC();
      songGain = songCtx.createGain();
      songGain.gain.value = 0;
      songCtx.createMediaElementSource(closureSong).connect(songGain).connect(songCtx.destination);
    }
    if (songCtx.state !== "running") songCtx.resume();
  } catch (err) {
    console.warn("Falling back to plain audio:", err);
    songCtx = null;
    songGain = null;
  }
}

function fadeVolume(to, ms, done) {
  cancelAnimationFrame(volumeAnim);
  clearTimeout(fadeVolume.timer);
  if (songGain) {
    const g = songGain.gain;
    const now = songCtx.currentTime;
    g.cancelScheduledValues(now);
    g.setValueAtTime(g.value, now);
    g.linearRampToValueAtTime(to, now + ms / 1000);
    if (done) fadeVolume.timer = setTimeout(done, ms);
    return;
  }
  const from = closureSong.volume;
  const start = performance.now();
  function step(t0) {
    const t = Math.min(1, (t0 - start) / ms);
    closureSong.volume = from + (to - from) * t;
    if (t < 1) volumeAnim = requestAnimationFrame(step);
    else if (done) done();
  }
  volumeAnim = requestAnimationFrame(step);
}

function setMusicButton(playing) {
  closureMusic.setAttribute("aria-pressed", String(playing));
  closureMusic.title = playing ? "Pause the song" : "Play the song";
  closureMusic.querySelector(".closure-music-icon").textContent = playing ? "❚❚" : "▶";
  closureMusic.querySelector(".closure-music-label").textContent = playing ? "pause song" : "play song";
}

// start the song with no sound (call this inside a tap)
function primeSong() {
  ensureSongGraph();
  if (songGain) {
    songGain.gain.cancelScheduledValues(0);
    songGain.gain.value = 0;
  } else {
    closureSong.volume = 0;
  }
  const p = closureSong.play();
  if (p && p.catch) p.catch(() => {});
}

function playSong() {
  primeSong();
  setMusicButton(true);
  fadeVolume(0.85, 4000);
  // if the browser still refused, show "play song" so one tap starts it
  setTimeout(() => {
    if (closureSong.paused && closureIsOpen) setMusicButton(false);
  }, 600);
}

function stopSong() {
  fadeVolume(0, 900, () => closureSong.pause());
  setMusicButton(false);
}

// loop forever while the letter is open (backup for browsers that ignore "loop")
closureSong.loop = true;
closureSong.addEventListener("ended", () => {
  if (closureIsOpen && !userPaused) {
    closureSong.currentTime = 0;
    closureSong.play().catch(() => {});
  }
});

closureSong.addEventListener("error", () => {
  console.warn("Song file could not be loaded:", closureSong.src);
});

// backup: if the browser blocked the first play, start on her first tap/scroll
let userPaused = false;
function nudgeSong(e) {
  if (e.target.closest(".closure-music, .closure-back")) return; // those buttons handle themselves
  if (closureIsOpen && closureSong.paused && !userPaused) playSong();
}
["pointerdown", "touchstart", "keydown"].forEach((ev) =>
  closure.addEventListener(ev, nudgeSong, { passive: true })
);

closureMusic.addEventListener("click", (e) => {
  e.stopPropagation();
  if (closureSong.paused) {
    userPaused = false;
    playSong();
  } else {
    userPaused = true;
    closureSong.pause();
    setMusicButton(false);
  }
});

function revealWords() {
  const fades = closure.querySelectorAll(".fade:not(.in)");
  if (reduceMotion) {
    fades.forEach((el) => el.classList.add("in"));
    return;
  }
  if (!fadeObserver) {
    fadeObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            fadeObserver.unobserve(e.target);
          }
        });
      },
      { root: closure, threshold: 0.2 }
    );
  }
  fades.forEach((el) => fadeObserver.observe(el));
}

function showClosure() {
  buildSky();
  closure.hidden = false;
  closure.scrollTop = 0;
  document.body.classList.add("closure-open");
  requestAnimationFrame(() => requestAnimationFrame(() => closure.classList.add("show")));
  setTimeout(revealWords, reduceMotion ? 0 : 900);
}

function openClosure() {
  if (closureIsOpen) return;
  closureIsOpen = true;

  // quiet the pink page: stop its music and hearts
  if (soundOn) soundToggle.click();
  soundToggle.hidden = true;
  heartLayer.hidden = true;

  // start the song right inside the tap, so the browser allows it
  userPaused = false;
  playSong();

  // so the phone / browser back button closes the letter instead of leaving
  history.pushState({ closure: true }, "", "#goodbye");

  // envelope opens: flap lifts, letter slides out, then the dark screen
  envelopeCard.classList.add("opening");
  setTimeout(showClosure, reduceMotion ? 0 : 2100);
}

function closeClosure() {
  if (!closureIsOpen) return;
  closureIsOpen = false;
  stopSong();
  closure.classList.remove("show");
  document.body.classList.remove("closure-open");

  // reseal the envelope instantly while the dark screen still covers it
  envelopeCard.classList.add("no-anim");
  envelopeCard.classList.remove("opening");
  void envelopeCard.offsetWidth;
  envelopeCard.classList.remove("no-anim");

  setTimeout(() => {
    closure.hidden = true;
    soundToggle.hidden = false;
    heartLayer.hidden = false;
    envelope.focus({ preventScroll: true });
  }, reduceMotion ? 0 : 1800);
}

function goBack() {
  if (history.state && history.state.closure) history.back(); // popstate closes it
  else closeClosure();
}

/* ---------- number check: the letter is encrypted, a number unlocks it ---------- */
const gate = document.getElementById("gate");
const gateForm = document.getElementById("gateForm");
const gateNumber = document.getElementById("gateNumber");
const gateError = document.getElementById("gateError");
const gateOpen = document.getElementById("gateOpen");
const letterBody = document.getElementById("letterBody");
let letterUnlocked = false;

const fromB64 = (s) => Uint8Array.from(atob(s), (c) => c.charCodeAt(0));

// returns the letter's HTML, or null if the number doesn't match
async function unlockLetter(number) {
  const res = await fetch("letter.enc.json?v=" + Date.now(), { cache: "no-store" });
  const box = await res.json();
  const subtle = crypto.subtle;
  const base = await subtle.importKey("raw", new TextEncoder().encode(number), "PBKDF2", false, ["deriveKey"]);
  const kek = await subtle.deriveKey(
    { name: "PBKDF2", hash: "SHA-256", salt: fromB64(box.salt), iterations: box.iterations },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"]
  );
  for (const k of box.keys) {
    try {
      const raw = await subtle.decrypt({ name: "AES-GCM", iv: fromB64(k.iv) }, kek, fromB64(k.key));
      const key = await subtle.importKey("raw", raw, "AES-GCM", false, ["decrypt"]);
      const html = await subtle.decrypt({ name: "AES-GCM", iv: fromB64(box.iv) }, key, fromB64(box.data));
      return new TextDecoder().decode(html);
    } catch (_) {
      /* not this one — try the next */
    }
  }
  return null;
}

function showGate() {
  gateError.hidden = true;
  gateNumber.value = "";
  gate.hidden = false;
  requestAnimationFrame(() => gate.classList.add("show"));
  setTimeout(() => gateNumber.focus(), 150);
}

function hideGate() {
  gate.classList.remove("show");
  setTimeout(() => (gate.hidden = true), 300);
}

function gateFail(msg) {
  gateError.textContent = msg;
  gateError.hidden = false;
  gateForm.classList.remove("shake");
  void gateForm.offsetWidth;
  gateForm.classList.add("shake");
}

gateForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const number = gateNumber.value.replace(/\D/g, "").slice(-10);
  if (number.length !== 10) {
    gateFail("Please enter a 10-digit mobile number.");
    return;
  }

  // start the song silently inside this tap, so phones allow it to play later
  primeSong();

  gateOpen.disabled = true;
  gateOpen.textContent = "Opening…";
  gateError.hidden = true;
  let html = null;
  try {
    html = await unlockLetter(number);
  } catch (err) {
    console.warn(err);
  }
  gateOpen.disabled = false;
  gateOpen.textContent = "Open";

  if (!html) {
    closureSong.pause();
    gateFail("Sorry, this letter isn't meant for this number.");
    return;
  }

  letterBody.innerHTML = html;
  letterUnlocked = true;
  hideGate();
  closureSong.currentTime = 0;
  openClosure();
});

document.getElementById("gateCancel").addEventListener("click", hideGate);
gate.addEventListener("click", (e) => {
  if (e.target === gate) hideGate();
});

envelope.addEventListener("click", () => {
  if (letterUnlocked) openClosure();
  else showGate();
});
closureBack.addEventListener("click", goBack);
window.addEventListener("popstate", () => {
  if (closureIsOpen) closeClosure();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && !gate.hidden) hideGate();
  else if (e.key === "Escape" && closureIsOpen) goBack();
});

/* ---------- "I've read your letter" -> notify me ---------- */
const readBtn = document.getElementById("readBtn");
const readNote = document.getElementById("readNote");

const readForm = document.getElementById("readForm");
const readName = document.getElementById("readName");
const readDone = document.getElementById("readDone");
const readSub = document.getElementById("readSub");

function sendReadNotice(name, msg) {
  const when = new Date().toLocaleString();
  let text = CONFIG.readMessage.replace("{name}", name);
  if (msg) text += "\n\n" + CONFIG.readMessageReply + "\n" + msg;
  text += "\n\n" + when;
  const jobs = [];
  if (CONFIG.ntfyTopic) {
    jobs.push(
      fetch("https://ntfy.sh/" + encodeURIComponent(CONFIG.ntfyTopic), {
        method: "POST",
        body: text,
        headers: {
          Title: (msg ? "A message from " : "Letter read by ") + name.replace(/[^\x20-\x7E]/g, "?"),
          Tags: msg ? "love_letter" : "envelope",
        },
      })
    );
  }
  if (CONFIG.web3formsKey) {
    jobs.push(
      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: CONFIG.web3formsKey,
          subject: msg ? name + " sent you a message" : name + " read your letter",
          from_name: "Goodbye letter",
          message: text,
        }),
      })
    );
  }
  return Promise.allSettled(jobs);
}

// step 1: ask for their name
readBtn.addEventListener("click", (e) => {
  e.stopPropagation();
  readBtn.hidden = true;
  readForm.hidden = false;
  readName.focus();
});

// step 2: send the name, then say thank you
readForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const name = readName.value.trim();
  if (!name) {
    readName.focus();
    return;
  }
  readForm.querySelector('button[type="submit"]').disabled = true;
  sendReadNotice(name, document.getElementById("readMsg").value.trim());
  readForm.hidden = true;
  readDone.hidden = false;
  readNote.textContent = CONFIG.readThanks;
  readSub.textContent = CONFIG.readThanksSmall;
});
