import './style.css';

const messages = [
  'WHY DID YOU CLICK THAT?',
  'YOU ACTUALLY DID IT.',
  'THE MEME IS FIGHTING BACK.',
  'WHO GAVE YOU PERMISSION?',
  'ERROR: TOO MUCH MEME.',
  'THIS IS GETTING WORSE.',
  'ONE MORE TIME?',
  'PLEASE BE NORMAL.',
];
const reactions = ['BONK!', 'NOPE!', 'BRUH!', 'OUCH!', 'WHY?', 'BOOM!', 'HEY!'];
const filters = {
  normal: 'NORMAL', crazy: 'CRAZY', alien: 'ALIEN', radioactive: 'RADIOACTIVE',
  night: 'NIGHT VISION', vhs: 'VHS', matrix: 'MATRIX', thermal: 'THERMAL',
  negative: 'NEGATIVE', paper: 'PAPER', pixel: 'PIXEL', glitch: 'GLITCH',
};
const randomEffects = ['crazy', 'alien', 'radioactive', 'night', 'vhs', 'matrix', 'thermal', 'negative', 'paper', 'pixel', 'glitch'];

const state = {
  interactions: 0,
  filter: 'normal',
  hue: 0,
  flipX: false,
  flipY: false,
  rotation: 0,
  scale: 1,
  shake: false,
  glitch: false,
  punching: false,
  exploding: false,
  rage: false,
  ultimate: false,
  sound: false,
  spinVelocity: 0,
  holdProgress: 0,
  pointer: { x: 0, y: 0 },
};

const app = document.querySelector('#app');
app.innerHTML = `
  <div class="loading-screen" id="loadingScreen">
    <div class="loading-inner"><span class="loading-kicker">RIJUNA // MEME LAB</span><strong id="loadingText">LOADING MEME...</strong><div class="loading-bar"><i></i></div><small>CALCULATING HOW STUPID THIS PHOTO IS...</small></div>
  </div>
  <main class="lab" id="lab">
    <header class="topbar">
      <div class="brand"><span class="brand-mark">R</span><span>RIJUNA<br><b>MEME LAB</b></span></div>
      <div class="top-status"><span class="live-dot"></span> LIVE EXPERIMENT <span class="slash">/</span> <span id="interactionCount">0</span> INTERACTIONS</div>
      <button class="sound-button" id="soundButton" title="Toggle sound">SOUND <span id="soundState">OFF</span></button>
    </header>

    <section class="hero" id="hero">
      <div class="hero-copy">
        <p class="eyebrow">ONE PHOTO. INFINITE BAD IDEAS.</p>
        <h1>DO NOT<br><em>TOUCH IT.</em></h1>
        <p class="subcopy">A highly unnecessary laboratory for one extremely suspicious face.</p>
        <div class="hero-cta"><span class="pulse-dot"></span><span>THE PHOTO IS WATCHING</span></div>
      </div>
      <div class="stage" id="stage">
        <div class="orbit orbit-a"></div><div class="orbit orbit-b"></div>
        <div class="reaction-burst" id="reactionBurst"></div>
        <div class="meme-wrap" id="memeWrap">
          <div class="meme-shadow"></div>
          <div class="meme-frame" id="memeFrame">
            <img id="memeImage" src="/rijuna.jpg" alt="The Rijuna meme" draggable="false" />
            <div class="scanlines"></div><div class="rgb-layer red"></div><div class="rgb-layer cyan"></div>
          </div>
          <span class="image-sticker sticker-top">100%<br>UNWISE</span><span class="image-sticker sticker-bottom">NO THOUGHTS<br>JUST CLICK</span>
        </div>
        <div class="stage-caption"><span>SUBJECT 001</span><span id="filterReadout">NORMAL / CONTAINED</span></div>
      </div>
      <div class="chaos-copy"><span class="rotate-label">INTERACT AT YOUR OWN RISK</span><div class="big-counter"><strong id="bigCounter">00</strong><span>MEME<br>EVENTS</span></div><button class="reset-button" id="resetButton">↺ RESET THE EVIDENCE</button></div>
    </section>

    <section class="control-deck">
      <div class="deck-column primary-controls"><div class="section-tag"><span>01</span> PHYSICAL INTERACTIONS</div><div class="button-grid"><button class="action-button punch" id="punchButton"><span>✦</span> PUNCH IT</button><button class="action-button danger" id="destroyButton"><span>×</span> DESTROY THE MEME</button><button class="action-button spin" id="spinButton"><span>↻</span> HOLD TO SPIN</button><button class="action-button weird" id="worseButton"><span>?</span> MAKE IT WORSE</button></div></div>
      <div class="deck-column filter-controls"><div class="section-tag"><span>02</span> FILTER LAB <i id="filterName">NORMAL</i></div><div class="filter-list">${Object.entries(filters).map(([key, label]) => `<button class="filter-button ${key === 'normal' ? 'active' : ''}" data-filter="${key}">${label}</button>`).join('')}</div></div>
      <div class="deck-column transform-controls"><div class="section-tag"><span>03</span> OPTICAL DAMAGE</div><div class="transform-list"><button data-transform="flipX">FLIP X <span>↔</span></button><button data-transform="flipY">FLIP Y <span>↕</span></button><button data-transform="mirror">MIRROR <span>◐</span></button><button data-transform="upside">UPSIDE DOWN <span>↟</span></button><button id="glitchButton">GLITCH <span>▦</span></button><button class="doomsday" id="doomsdayButton">DO NOT PRESS <span>!</span></button></div></div>
    </section>
    <section class="arcade" id="arcade">
      <div class="arcade-heading"><div><p class="eyebrow">04 / THE MEME ARCADE</p><h2>PLAY WITH<br><em>THE EVIDENCE.</em></h2></div><p class="arcade-intro">Same face. New rules. Pick a game and prove you can recognize one extremely over-filtered photograph.</p></div>
      <div class="game-tabs"><button class="game-tab active" data-game="memory">MEME MATCH</button><button class="game-tab" data-game="hunt">FILTER HUNT</button><button class="game-tab" data-game="frenzy">CLICK FRENZY</button></div>
      <div class="game-panel" id="memoryGame"><div class="game-info"><span class="game-number">GAME 01</span><h3>MEME MATCH</h3><p>Find matching filter pairs. Click two cards back to back. No peeking, professional meme scientist.</p><div class="game-score"><b id="memoryMatches">0</b><span>PAIRS FOUND</span><b id="memoryMoves">0</b><span>MOVES</span></div><button class="game-button" id="memoryStart">SHUFFLE THE MEMES ↗</button></div><div class="memory-board" id="memoryBoard"></div></div>
      <div class="game-panel hidden-game" id="huntGame"><div class="game-info"><span class="game-number">GAME 02</span><h3>FILTER HUNT</h3><p>Find the exact filter the announcer calls before the clock melts.</p><div class="hunt-target" id="huntTarget">READY?</div><div class="game-score"><b id="huntScore">0</b><span>HITS</span><b id="huntTime">15</b><span>SECONDS</span></div><button class="game-button" id="huntStart">START THE HUNT ↗</button></div><div class="hunt-board" id="huntBoard"></div></div>
      <div class="game-panel hidden-game" id="frenzyGame"><div class="game-info"><span class="game-number">GAME 03</span><h3>CLICK FRENZY</h3><p>Click the good face as fast as possible. The bad faces are decoys. Obviously.</p><div class="hunt-target" id="frenzyStatus">10 SECONDS OF NONSENSE</div><div class="game-score"><b id="frenzyScore">0</b><span>CLICKS</span><b id="frenzyTime">10</b><span>SECONDS</span></div><button class="game-button" id="frenzyStart">RELEASE THE CHAOS ↗</button></div><div class="frenzy-board" id="frenzyBoard"></div></div>
    </section>
    <footer class="footer"><span>RIJUNA / 2026 / THE INTERNET'S LEAST NECESSARY TOOL</span><span id="unlockText">10 CLICKS UNLOCKS SOMETHING</span></footer>
  </main>
  <div class="toast" id="toast"></div><div class="floating-phrase" id="floatingPhrase"></div>
`;

const $ = (id) => document.getElementById(id);
const memeWrap = $('memeWrap');
const memeFrame = $('memeFrame');
const stage = $('stage');
const toast = $('toast');
let audioContext;
let drag = null;
let holdTimer;
let spinFrame;
let lastPointer = { x: 0, y: 0, t: 0 };
let memoryDeck = [];
let memoryOpen = [];
let memoryLocked = false;
let huntTimer;
let frenzyTimer;
let frenzyRunning = false;

const gameFilters = ['normal', 'crazy', 'alien', 'radioactive', 'night', 'vhs', 'matrix', 'thermal', 'negative', 'paper', 'pixel', 'glitch'];

function cardMarkup(filter, index, hidden = true) {
  return `<button class="memory-card ${hidden ? 'is-hidden' : 'is-found'}" data-filter="${filter}" data-index="${index}"><span class="card-back">R</span><span class="card-face"><img src="/rijuna.jpg" alt="${filters[filter]} Rijuna" style="filter:${filterCss[filter]}"><small>${filters[filter]}</small></span></button>`;
}

const filterCss = { normal: 'saturate(1.15) contrast(1.05)', crazy: 'saturate(2.5) contrast(1.35) hue-rotate(20deg)', alien: 'hue-rotate(115deg) saturate(2.5) contrast(1.2)', radioactive: 'sepia(1) saturate(7) hue-rotate(55deg) contrast(1.3)', night: 'grayscale(1) sepia(1) hue-rotate(70deg) saturate(4) brightness(.8) contrast(1.4)', vhs: 'saturate(.65) contrast(1.25) sepia(.2)', matrix: 'grayscale(1) sepia(1) hue-rotate(70deg) saturate(5) contrast(1.3)', thermal: 'saturate(5) hue-rotate(180deg) contrast(1.3)', negative: 'invert(1) hue-rotate(180deg)', paper: 'grayscale(1) contrast(1.6) brightness(1.2)', pixel: 'contrast(1.4) saturate(1.5)', glitch: 'saturate(2) contrast(1.5) hue-rotate(90deg)' };

function beep(type = 'click') {
  if (!state.sound) return;
  audioContext ||= new AudioContext();
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const tones = { click: [180, 0.06], pop: [420, 0.12], bonk: [90, 0.2], glitch: [740, 0.15], error: [120, 0.28] };
  const [frequency, duration] = tones[type] || tones.click;
  osc.frequency.value = frequency; osc.type = type === 'glitch' ? 'sawtooth' : 'square';
  gain.gain.setValueAtTime(0.045, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
  osc.connect(gain).connect(audioContext.destination); osc.start(); osc.stop(audioContext.currentTime + duration);
}

function increment(amount = 1) {
  state.interactions += amount;
  $('interactionCount').textContent = state.interactions;
  $('bigCounter').textContent = String(state.interactions).padStart(2, '0');
  if (state.interactions === 10) showToast('NEW BEHAVIOR DETECTED.');
  if (state.interactions === 25) showToast('THE MEME KNOWS YOUR NAME.');
  if (state.interactions >= 50 && !state.ultimate) activateUltimate();
}

function showToast(text = messages[Math.floor(Math.random() * messages.length)]) {
  toast.textContent = text; toast.classList.remove('show'); void toast.offsetWidth; toast.classList.add('show');
  $('floatingPhrase').textContent = text; $('floatingPhrase').classList.remove('rise'); void $('floatingPhrase').offsetWidth; $('floatingPhrase').classList.add('rise');
}

function pulse(className, duration = 600) {
  stage.classList.remove(className); void stage.offsetWidth; stage.classList.add(className);
  setTimeout(() => stage.classList.remove(className), duration);
}

function render() {
  const x = state.pointer.x * 5; const y = state.pointer.y * 4;
  const flipX = state.flipX ? -1 : 1; const flipY = state.flipY ? -1 : 1;
  memeWrap.style.setProperty('--tilt-x', `${-y}deg`); memeWrap.style.setProperty('--tilt-y', `${x}deg`);
  memeWrap.style.setProperty('--rotation', `${state.rotation}deg`); memeWrap.style.setProperty('--scale', state.scale);
  memeWrap.style.setProperty('--flip-x', flipX); memeWrap.style.setProperty('--flip-y', flipY);
  memeFrame.dataset.filter = state.filter; stage.dataset.rage = state.rage; stage.dataset.ultimate = state.ultimate;
  $('filterReadout').textContent = `${filters[state.filter]} / ${state.rage ? 'UNSTABLE' : 'CONTAINED'}`;
  $('filterName').textContent = filters[state.filter];
}

function setFilter(filter) {
  state.filter = filter; increment(); beep(filter === 'glitch' ? 'glitch' : 'click');
  document.querySelectorAll('.filter-button').forEach((button) => button.classList.toggle('active', button.dataset.filter === filter));
  if (filter === 'glitch') pulse('glitching', 1000); render();
}

function punch() { increment(); beep('bonk'); pulse('punching', 700); showToast(reactions[Math.floor(Math.random() * reactions.length)]); state.scale = 1.08; render(); setTimeout(() => { state.scale = 1; render(); }, 420); }
function glitch() { increment(); beep('glitch'); state.glitch = true; pulse('glitching', 1100); setFilter('glitch'); setTimeout(() => { state.glitch = false; if (!state.rage) setFilter('normal'); }, 1100); }
function destroy() { increment(); beep('error'); state.exploding = true; pulse('exploding', 1400); showToast('THE MEME HAS LEFT THE CHAT.'); setTimeout(() => { state.exploding = false; render(); }, 1250); }
function activateRage() { increment(); beep('glitch'); state.rage = true; pulse('rage', 4800); showToast('RAGE MODE: ABSOLUTELY UNNECESSARY.'); let tick = 0; const timer = setInterval(() => { state.rotation = (tick++ % 2 ? -8 : 8); state.scale = 1.08 + Math.random() * 0.1; state.hue = Math.random() * 360; memeFrame.style.filter = `hue-rotate(${state.hue}deg)`; render(); }, 160); setTimeout(() => { clearInterval(timer); state.rage = false; state.rotation = 0; state.scale = 1; memeFrame.style.filter = ''; render(); }, 4800); }
function activateUltimate() { state.ultimate = true; state.rage = true; showToast('ULTIMATE MEME MODE UNLOCKED.'); pulse('ultimate', 9000); setTimeout(() => { state.ultimate = false; state.rage = false; render(); }, 9000); }
function doomsday() { increment(2); beep('error'); showToast('YOU WERE WARNED.'); pulse('doomsday', 3300); state.scale = 1.3; state.rotation = 12; render(); setTimeout(() => { state.scale = 1; state.rotation = 0; state.filter = 'normal'; state.flipX = false; state.flipY = false; render(); }, 2600); }
function randomEffect() { const effect = randomEffects[Math.floor(Math.random() * randomEffects.length)]; increment(); showToast(messages[Math.floor(Math.random() * messages.length)]); if (effect === 'glitch') glitch(); else { setFilter(effect); state.rotation = Math.round(Math.random() * 40 - 20); state.scale = 0.96 + Math.random() * 0.18; render(); } }

function reset() { Object.assign(state, { filter: 'normal', hue: 0, flipX: false, flipY: false, rotation: 0, scale: 1, shake: false, glitch: false, punching: false, exploding: false, rage: false, ultimate: false }); memeFrame.style.filter = ''; document.querySelectorAll('.filter-button').forEach((button) => button.classList.toggle('active', button.dataset.filter === 'normal')); render(); showToast('EVIDENCE DESTROYED.'); }

function startMemory() {
  memoryOpen = []; memoryLocked = false;
  memoryDeck = [...gameFilters.slice(0, 6), ...gameFilters.slice(0, 6)].sort(() => Math.random() - .5);
  $('memoryMatches').textContent = '0'; $('memoryMoves').textContent = '0';
  $('memoryBoard').innerHTML = memoryDeck.map((filter, index) => cardMarkup(filter, index)).join('');
  $('memoryBoard').querySelectorAll('.memory-card').forEach((card) => card.addEventListener('click', () => flipMemoryCard(card)));
}

function flipMemoryCard(card) {
  if (memoryLocked || !card.classList.contains('is-hidden') || memoryOpen.some((open) => open.dataset.index === card.dataset.index)) return;
  card.classList.remove('is-hidden'); card.classList.add('is-revealed'); memoryOpen.push(card); beep('pop');
  if (memoryOpen.length < 2) return;
  $('memoryMoves').textContent = Number($('memoryMoves').textContent) + 1;
  const [first, second] = memoryOpen;
  if (first.dataset.filter === second.dataset.filter) {
    memoryOpen.forEach((open) => { open.classList.remove('is-revealed'); open.classList.add('is-found'); });
    $('memoryMatches').textContent = Number($('memoryMatches').textContent) + 1; memoryOpen = []; increment();
    if (Number($('memoryMatches').textContent) === 6) showToast('YOU KNOW THE MEME. DISTURBING.');
  } else {
    memoryLocked = true;
    setTimeout(() => { memoryOpen.forEach((open) => { open.classList.remove('is-revealed'); open.classList.add('is-hidden'); }); memoryOpen = []; memoryLocked = false; }, 650);
  }
}

function startHunt() {
  clearInterval(huntTimer); let time = 15; let score = 0;
  $('huntScore').textContent = '0'; $('huntTime').textContent = time; $('huntStart').textContent = 'RESET THE HUNT ↗';
  const nextTarget = () => { const target = gameFilters[Math.floor(Math.random() * gameFilters.length)]; $('huntTarget').textContent = `FIND: ${filters[target]}`; $('huntTarget').dataset.target = target; };
  $('huntBoard').innerHTML = gameFilters.map((filter, index) => `<button class="hunt-card" data-filter="${filter}" style="--delay:${index * .03}s"><img src="/rijuna.jpg" alt="${filters[filter]}" style="filter:${filterCss[filter]}"><span>${filters[filter]}</span></button>`).join('');
  $('huntBoard').querySelectorAll('.hunt-card').forEach((card) => card.addEventListener('click', () => { if (card.dataset.filter === $('huntTarget').dataset.target) { score += 1; $('huntScore').textContent = score; increment(); pulse('punching', 250); nextTarget(); } else { card.classList.add('wrong'); setTimeout(() => card.classList.remove('wrong'), 250); beep('error'); } }));
  nextTarget();
  huntTimer = setInterval(() => { time -= 1; $('huntTime').textContent = time; if (time <= 0) { clearInterval(huntTimer); $('huntTarget').textContent = `TIME! ${score} HITS`; showToast(`${score} FILTERS SURVIVED.`); } }, 1000);
}

function startFrenzy() {
  clearInterval(frenzyTimer); frenzyRunning = true; let time = 10; let score = 0;
  $('frenzyScore').textContent = '0'; $('frenzyTime').textContent = time; $('frenzyStatus').textContent = 'CLICK THE GOOD ONE'; $('frenzyStart').textContent = 'RESTART THE CHAOS ↗';
  const spawn = () => {
    const board = $('frenzyBoard'); const count = window.innerWidth < 600 ? 5 : 8; board.innerHTML = Array.from({ length: count }, (_, index) => `<button class="frenzy-card ${index === 0 ? 'good' : 'decoy'}" style="--x:${8 + Math.random() * 80}%;--y:${8 + Math.random() * 72}%;--r:${Math.random() * 30 - 15}deg"><img src="/rijuna.jpg" alt="Meme target" style="filter:${index === 0 ? 'saturate(1.15)' : filterCss[gameFilters[Math.floor(Math.random() * gameFilters.length)]]}"></button>`).join('');
    board.querySelector('.good').addEventListener('click', () => { if (!frenzyRunning) return; score += 1; $('frenzyScore').textContent = score; increment(); beep('pop'); spawn(); });
    board.querySelectorAll('.decoy').forEach((decoy) => decoy.addEventListener('click', () => { if (!frenzyRunning) return; score = Math.max(0, score - 1); $('frenzyScore').textContent = score; pulse('shaking', 180); decoy.classList.add('bonked'); }));
  };
  spawn();
  frenzyTimer = setInterval(() => { time -= 1; $('frenzyTime').textContent = time; if (time <= 0) { clearInterval(frenzyTimer); frenzyRunning = false; $('frenzyStatus').textContent = `FINAL SCORE: ${score}`; $('frenzyBoard').innerHTML = '<div class="game-over">CHAOS COMPLETE.<br><small>YOUR CLICKING WAS ACCEPTABLE.</small></div>'; } }, 1000);
}

document.querySelectorAll('.game-tab').forEach((tab) => tab.addEventListener('click', () => {
  document.querySelectorAll('.game-tab').forEach((item) => item.classList.toggle('active', item === tab));
  document.querySelectorAll('.game-panel').forEach((panel) => panel.classList.toggle('hidden-game', panel.id !== `${tab.dataset.game}Game`));
}));
$('memoryStart').addEventListener('click', startMemory); $('huntStart').addEventListener('click', startHunt); $('frenzyStart').addEventListener('click', startFrenzy);
startMemory();

$('punchButton').addEventListener('click', punch); $('destroyButton').addEventListener('click', destroy); $('worseButton').addEventListener('click', randomEffect); $('glitchButton').addEventListener('click', glitch); $('doomsdayButton').addEventListener('click', doomsday); $('resetButton').addEventListener('click', reset);
$('soundButton').addEventListener('click', () => { state.sound = !state.sound; $('soundState').textContent = state.sound ? 'ON' : 'OFF'; if (state.sound) beep(); });
document.querySelectorAll('.filter-button').forEach((button) => button.addEventListener('click', () => setFilter(button.dataset.filter)));
document.querySelectorAll('[data-transform]').forEach((button) => button.addEventListener('click', () => { increment(); const transform = button.dataset.transform; if (transform === 'flipX') state.flipX = !state.flipX; if (transform === 'flipY') state.flipY = !state.flipY; if (transform === 'mirror') { state.flipX = !state.flipX; state.rotation += 180; } if (transform === 'upside') { state.flipY = !state.flipY; state.rotation += 180; } render(); }));

$('spinButton').addEventListener('pointerdown', (event) => { event.currentTarget.setPointerCapture(event.pointerId); increment(); clearInterval(spinFrame); state.spinVelocity = 3; const spin = () => { state.rotation += state.spinVelocity; state.spinVelocity = Math.min(state.spinVelocity + 0.15, 28); render(); spinFrame = requestAnimationFrame(spin); }; spin(); });
$('spinButton').addEventListener('pointerup', () => { cancelAnimationFrame(spinFrame); const slow = () => { state.rotation += state.spinVelocity; state.spinVelocity *= 0.94; render(); if (state.spinVelocity > 0.1) spinFrame = requestAnimationFrame(slow); }; slow(); });

memeFrame.addEventListener('click', (event) => { if (drag?.moved) return; increment(); beep('pop'); pulse(state.interactions % 4 === 0 ? 'glitching' : 'shaking', 650); state.scale = state.interactions % 5 === 0 ? 1.24 : 1.04; state.rotation = state.interactions % 3 === 0 ? 360 : (Math.random() * 16 - 8); showToast(); render(); setTimeout(() => { state.scale = 1; state.rotation = 0; render(); }, 580); });
memeFrame.addEventListener('dblclick', (event) => { event.preventDefault(); increment(2); beep('glitch'); state.scale = 1.55; state.rotation = -10; pulse('double-secret', 1200); showToast('DOUBLE CLICK? REALLY?'); render(); setTimeout(() => { state.scale = 1; state.rotation = 0; render(); }, 1100); });
memeFrame.addEventListener('contextmenu', (event) => { event.preventDefault(); increment(); showToast('HEY.'); pulse('shaking', 500); beep('error'); });

stage.addEventListener('pointermove', (event) => { const rect = stage.getBoundingClientRect(); state.pointer.x = (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2); state.pointer.y = (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2); render(); });
stage.addEventListener('pointerleave', () => { state.pointer.x = 0; state.pointer.y = 0; render(); });

memeFrame.addEventListener('pointerdown', (event) => { if (event.button !== 0) return; memeFrame.setPointerCapture(event.pointerId); drag = { x: event.clientX, y: event.clientY, moved: false, start: performance.now() }; memeFrame.classList.add('dragging'); holdTimer = setTimeout(() => { state.scale = 1.15; pulse('holding', 4000); showToast('LET GO OF THE MEME.'); render(); }, 1000); });
memeFrame.addEventListener('pointermove', (event) => { if (!drag) return; const dx = event.clientX - drag.x; const dy = event.clientY - drag.y; if (Math.abs(dx) + Math.abs(dy) > 8) drag.moved = true; if (drag.moved) { state.pointer.x = Math.max(-1, Math.min(1, state.pointer.x + dx / 240)); state.pointer.y = Math.max(-1, Math.min(1, state.pointer.y + dy / 240)); state.rotation += dx / 8; memeWrap.style.translate = `${dx}px ${dy}px`; } drag.x = event.clientX; drag.y = event.clientY; lastPointer = { x: event.clientX, y: event.clientY, t: performance.now() }; render(); });
memeFrame.addEventListener('pointerup', () => { clearTimeout(holdTimer); if (drag?.moved) { increment(); showToast('NICE THROW.'); memeWrap.animate([{ translate: `${state.pointer.x * 80}px ${state.pointer.y * 80}px` }, { translate: '0 0' }], { duration: 700, easing: 'cubic-bezier(.2,1.5,.4,1)' }); } memeFrame.classList.remove('dragging'); drag = null; state.scale = 1; render(); });

window.addEventListener('keydown', (event) => { if (event.key.toLowerCase() === 'r') reset(); if (event.key.toLowerCase() === 'g') glitch(); if (event.key === ' ') { event.preventDefault(); punch(); } });

setTimeout(() => $('loadingScreen').classList.add('hidden'), 1450);
render();
