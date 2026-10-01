/**
 * RETRO DRIVE LB — Main Interactive Script
 * Production-Refined Implementation with Multi-Harmonic V8 Synthesizer
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initBeforeAfterSlider();
  initCarInspectorModal();
  initEventRSVP();
  initInquiryForm();
  initV8EngineInstrument();
});

/* ==========================================================================
   NAVIGATION & SCROLL SPY
   ========================================================================== */
function initNavigation() {
  const nav = document.getElementById('siteNav');
  const mobileToggle = document.getElementById('navMobileBtn');
  const navMenu = document.getElementById('navMenu');
  const links = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  const darkSections = ['childhood', 'oldsmobile', 'garage', 'contact'];

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    if (scrollY > 25) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    let currentDark = false;
    darkSections.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const rect = el.getBoundingClientRect();
        if (rect.top <= 75 && rect.bottom >= 75) {
          currentDark = true;
        }
      }
    });

    if (currentDark) {
      nav.classList.add('nav-dark');
    } else {
      nav.classList.remove('nav-dark');
    }

    let currentId = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 140;
      const height = sec.offsetHeight;
      if (scrollY >= top && scrollY < top + height) {
        currentId = sec.getAttribute('id');
      }
    });

    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentId}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });

  if (mobileToggle && navMenu) {
    function toggleMobileMenu() {
      const isOpen = navMenu.classList.toggle('mobile-open');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    }

    function closeMobileMenu() {
      if (navMenu.classList.contains('mobile-open')) {
        navMenu.classList.remove('mobile-open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    }

    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      toggleMobileMenu();
    });

    links.forEach(link => {
      link.addEventListener('click', closeMobileMenu);
    });

    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target)) {
        closeMobileMenu();
      }
    });

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        closeMobileMenu();
      }
    });
  }
}

/* ==========================================================================
   RESTORATION BEFORE / AFTER SLIDER (POINTER EVENTS & CLIP-PATH)
   ========================================================================== */
function initBeforeAfterSlider() {
  const container = document.getElementById('restorationSlider');
  if (!container) return;

  let isDragging = false;

  function updateSlider(clientX) {
    const rect = container.getBoundingClientRect();
    let x = clientX - rect.left;
    if (x < 0) x = 0;
    if (x > rect.width) x = rect.width;

    const percentage = Math.min(100, Math.max(0, (x / rect.width) * 100));
    container.style.setProperty('--reveal', `${percentage.toFixed(2)}%`);

    const dialBtn = container.querySelector('.slider-dial-button');
    if (dialBtn) {
      dialBtn.setAttribute('aria-valuenow', Math.round(percentage));
    }
  }

  container.addEventListener('pointerdown', (e) => {
    isDragging = true;
    container.setPointerCapture(e.pointerId);
    updateSlider(e.clientX);
  });

  container.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    updateSlider(e.clientX);
  });

  container.addEventListener('pointerup', (e) => {
    isDragging = false;
    try {
      container.releasePointerCapture(e.pointerId);
    } catch (_) {}
  });

  container.addEventListener('pointercancel', (e) => {
    isDragging = false;
    try {
      container.releasePointerCapture(e.pointerId);
    } catch (_) {}
  });

  container.addEventListener('keydown', (e) => {
    let currentPct = parseFloat(getComputedStyle(container).getPropertyValue('--reveal')) || 50;
    if (e.key === 'ArrowLeft') {
      currentPct = Math.max(0, currentPct - 4);
      container.style.setProperty('--reveal', `${currentPct}%`);
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      currentPct = Math.min(100, currentPct + 4);
      container.style.setProperty('--reveal', `${currentPct}%`);
      e.preventDefault();
    }
  });
}

/* ==========================================================================
   CAR SPECIFICATION ARCHIVE MODAL
   ========================================================================== */
const CAR_DATA = {
  oldsmobile: {
    year: '1970',
    name: 'Oldsmobile Cutlass 442 Holiday Coupe',
    origin: 'Lansing, Michigan / Rebuilt in Beirut',
    engine: 'Rocket 350 cu. in. V8 (5.7L)',
    carburetor: 'Rochester 4-Barrel Quadrajet',
    transmission: 'TH-350 3-speed Automatic',
    exterior: 'Deep Warm Burgundy Metallic / Polished Chrome',
    interior: 'Saddle Tan Vinyl & Walnut Trim',
    story: 'Discovered in a forgotten garage in rough condition with seized pistons. Charbel and his lifelong friend Rabih took the entire chassis down to bare metal over an eighteen-month restoration. Every single bolt, rubber seal, and trim clip was restored or machined. Today, its V8 note echoes through the coastal highway with effortless majesty.',
    notes: 'Charbel\'s proudest accomplishment and the genesis of Retro Drive LB.'
  },
  mercedes: {
    year: '1968',
    name: 'Mercedes-Benz 280SL ‘Pagoda’ (W113)',
    origin: 'Stuttgart, Germany',
    engine: '2.8L M130 Inline-6 (Mechanical Bosch Fuel Injection)',
    carburetor: 'Bosch Multi-Plunger Injection Pump',
    transmission: '4-speed Automatic',
    exterior: 'Midnight Petrol Blue (Dunkelblau)',
    interior: 'Cognac Perforated Leather',
    story: 'An icon of Mediterranean elegance. Built for long, winding ascents from the port of Beirut up into the Mount Lebanon pine ridges. Kept in flawless mechanical tune, the inline-six delivers a signature rhythmic exhaust note that purrs smoothly even at 6,000 RPM.',
    notes: 'Preserved with 100% period-correct Becker Europa radio and original stamped toolkit.'
  },
  alfa: {
    year: '1972',
    name: 'Alfa Romeo 2000 GT Veloce (Bertone)',
    origin: 'Milan, Italy',
    engine: '2.0L Twin-Cam Inline-4 (1,962 cc)',
    carburetor: 'Dual Twin-Choke Dell’Orto DHLA 40',
    transmission: '5-speed All-Synchromesh Manual',
    exterior: 'Giallo Ocra (Vintage Ochre Mustard)',
    interior: 'Nero Skai Bucket Seats & Wood Steering Wheel',
    story: 'Pure Italian passion adapted for Lebanese coastal switchbacks. The singing dual Dell’Orto carburetors produce an addictive mechanical rasp. Restored with competition-spec suspension dampers and period Cromodora alloys.',
    notes: 'A frequent favorite at the Byblos sunrise coffee meetups.'
  }
};

function initCarInspectorModal() {
  const modal = document.getElementById('carModal');
  if (!modal) return;

  const closeBtn = document.getElementById('carModalClose');
  const exploreBtns = document.querySelectorAll('.btn-car-explore');

  const titleEl = document.getElementById('modalCarTitle');
  const originEl = document.getElementById('modalCarOrigin');
  const engineEl = document.getElementById('modalCarEngine');
  const transEl = document.getElementById('modalCarTransmission');
  const carbEl = document.getElementById('modalCarCarb');
  const colorEl = document.getElementById('modalCarColor');
  const storyEl = document.getElementById('modalCarStory');
  const notesEl = document.getElementById('modalCarNotes');

  exploreBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const carKey = btn.getAttribute('data-car');
      const data = CAR_DATA[carKey];
      if (!data) return;

      titleEl.textContent = `${data.year} ${data.name}`;
      originEl.textContent = data.origin;
      engineEl.textContent = data.engine;
      transEl.textContent = data.transmission;
      carbEl.textContent = data.carburetor;
      colorEl.textContent = data.exterior;
      storyEl.textContent = data.story;
      notesEl.textContent = data.notes;

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
  });
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
}

/* ==========================================================================
   EVENT RSVP MODAL
   ========================================================================== */
function initEventRSVP() {
  const modal = document.getElementById('rsvpModal');
  if (!modal) return;

  const closeBtn = document.getElementById('rsvpModalClose');
  const rsvpBtns = document.querySelectorAll('.btn-event-rsvp');
  const eventNameInput = document.getElementById('rsvpEventName');
  const form = document.getElementById('rsvpForm');
  const successBox = document.getElementById('rsvpSuccess');

  rsvpBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const eventName = btn.getAttribute('data-event') || 'Retro Drive Gathering';
      if (eventNameInput) eventNameInput.value = eventName;
      if (successBox) successBox.style.display = 'none';
      if (form) form.style.display = 'block';

      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeRsvp() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (closeBtn) closeBtn.addEventListener('click', closeRsvp);
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeRsvp();
  });

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      form.style.display = 'none';
      if (successBox) successBox.style.display = 'block';
    });
  }
}

/* ==========================================================================
   RESTORATION INQUIRY FORM
   ========================================================================== */
function initInquiryForm() {
  const form = document.getElementById('restorationForm');
  const receipt = document.getElementById('inquiryReceipt');
  const receiptCode = document.getElementById('receiptCode');
  const receiptVehicle = document.getElementById('receiptVehicle');

  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const vehicle = form.elements['vehicle'].value || 'Classic Automobile';
    const randCode = 'RD-' + Math.floor(1000 + Math.random() * 9000) + '/LB';

    if (receiptCode) receiptCode.textContent = randCode;
    if (receiptVehicle) receiptVehicle.textContent = vehicle;

    form.reset();
    if (receipt) {
      receipt.style.display = 'block';
      receipt.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

/* ==========================================================================
   MULTI-HARMONIC INTERACTIVE V8 ENGINE SYNTHESIZER (WEB AUDIO API)
   Realistic Mechanical Starter Crank • Lopey Muscle Idle • Scroll-Velocity Throttle
   ========================================================================== */
let audioCtx = null;
let engineState = 'OFF'; // 'OFF' | 'STARTING' | 'RUNNING'
let currentRpm = 700;
let targetRpm = 700;
let revAnimationTimer = null;

// Scroll throttle tracking
let lastScrollY = 0;
let lastScrollTime = 0;
let scrollVelocity = 0;
let scrollDecayTimer = null;

// Audio Nodes
let masterGain = null;
let compressor = null;
let engineBus = null;

let oscFund = null;     // Fundamental 44-50Hz (deep cross-plane V8 cylinder firings)
let oscHarm2 = null;    // 2nd harmonic (88-100Hz body)
let oscHarm3 = null;    // 3rd harmonic (exhaust bark)
let oscHarm4 = null;    // 4th harmonic (mechanical cam & lifter)
let lfoCamChop = null;  // Uneven American cam lobe modulation (~5.2Hz)
let lfoCamGain = null;

let noiseNode = null;
let noiseFilter = null;
let noiseGain = null;
let filterLowpass = null;

function initV8EngineInstrument() {
  const btn = document.getElementById('soundInstrumentBtn');
  const rpmLabel = document.getElementById('soundRpmLabel');
  const hintLabel = document.getElementById('soundHint');

  if (!btn) return;

  function ensureAudioContext() {
    if (!audioCtx) {
      const AudioCtxClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioCtxClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Master Button Click handler (Toggles start or stop)
  btn.addEventListener('click', () => {
    ensureAudioContext();

    if (engineState === 'OFF') {
      startV8EngineSequence();
    } else if (engineState === 'RUNNING') {
      stopV8Engine();
    }
  });

  // Track page scroll velocity for dynamic throttle revving
  lastScrollY = window.scrollY || window.pageYOffset || 0;
  lastScrollTime = performance.now();

  function onScrollThrottle() {
    // SCROLLING MUST DO NOTHING IF ENGINE IS OFF
    if (engineState !== 'RUNNING') return;

    const currentY = window.scrollY || window.pageYOffset || 0;
    const now = performance.now();
    const dt = Math.max(10, now - lastScrollTime);
    const dy = Math.abs(currentY - lastScrollY);

    // Calculate pixels per millisecond
    const instantVelocity = (dy / dt) * 1000; // px/sec

    // Smooth velocity accumulation (low-pass filter)
    scrollVelocity = (scrollVelocity * 0.4) + (instantVelocity * 0.6);

    lastScrollY = currentY;
    lastScrollTime = now;

    // Map velocity to engine RPM:
    // 0 px/s       -> 700 RPM (idle)
    // 300 px/s     -> ~950 RPM (slow scroll)
    // 1000 px/s    -> ~1450 RPM (normal scroll)
    // 2400 px/s    -> ~2250 RPM (fast scroll)
    // 4000+ px/s   -> ~2950 RPM (very fast scroll)
    const revBoost = Math.min(2300, scrollVelocity * 0.58);
    setTargetRpm(700 + revBoost);

    // Clear previous timeout and schedule return to idle
    if (scrollDecayTimer) clearTimeout(scrollDecayTimer);
    scrollDecayTimer = setTimeout(() => {
      scrollVelocity = 0;
      if (engineState === 'RUNNING') {
        setTargetRpm(700);
      }
    }, 120);
  }

  window.addEventListener('scroll', onScrollThrottle, { passive: true });
}

function startV8EngineSequence() {
  const btn = document.getElementById('soundInstrumentBtn');
  const rpmLabel = document.getElementById('soundRpmLabel');
  const hintLabel = document.getElementById('soundHint');

  engineState = 'STARTING';
  if (btn) {
    btn.classList.add('starting');
    btn.classList.remove('running', 'revving');
  }
  if (rpmLabel) rpmLabel.textContent = 'STARTING';
  if (hintLabel) hintLabel.textContent = 'CRANK';

  buildAudioGraph();

  // Play realistic mechanical starter motor turning over
  playStarterCrank();

  // Combustion catches after starter sequence (~920ms)
  setTimeout(() => {
    if (engineState !== 'STARTING') return;

    engineState = 'RUNNING';
    if (btn) {
      btn.classList.remove('starting');
      btn.classList.add('running');
    }
    if (hintLabel) hintLabel.textContent = 'SCROLL TO REV';

    // Initial ignition surge (1,350 RPM flare) settling naturally into 700 RPM idle
    currentRpm = 1350;
    targetRpm = 700;

    // Fade in master engine bus smoothly as combustion catches
    if (masterGain && audioCtx) {
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.38, audioCtx.currentTime + 0.35);
    }

    startRpmLoop();
  }, 920);
}

/**
 * Believable mechanical classic-car starter motor sound:
 * Layered heavy starter motor whine + rhythmic compression compression strokes
 * (4 rhythmic mechanical chugs of cylinders being rotated against compression)
 */
function playStarterCrank() {
  if (!audioCtx) return;

  const now = audioCtx.currentTime;

  // 1. Starter DC Motor Whine (heavy 12V starter under battery load)
  const motorOsc = audioCtx.createOscillator();
  const motorGain = audioCtx.createGain();
  const motorFilter = audioCtx.createBiquadFilter();

  motorOsc.type = 'sawtooth';
  motorOsc.frequency.setValueAtTime(68, now);
  motorOsc.frequency.linearRampToValueAtTime(82, now + 0.3);
  motorOsc.frequency.linearRampToValueAtTime(74, now + 0.6);
  motorOsc.frequency.linearRampToValueAtTime(96, now + 0.9);

  motorFilter.type = 'lowpass';
  motorFilter.frequency.setValueAtTime(320, now);
  motorFilter.Q.setValueAtTime(1.5, now);

  motorGain.gain.setValueAtTime(0.001, now);
  motorGain.gain.linearRampToValueAtTime(0.18, now + 0.08);
  motorGain.gain.linearRampToValueAtTime(0.16, now + 0.7);
  motorGain.gain.linearRampToValueAtTime(0.001, now + 0.92);

  motorOsc.connect(motorFilter);
  motorFilter.connect(motorGain);
  motorGain.connect(compressor || audioCtx.destination);

  motorOsc.start(now);
  motorOsc.stop(now + 0.93);

  // 2. Rhythmic Mechanical Starter Pulses (the chug-chug-chug of pistons moving)
  const pulseTimes = [0.08, 0.28, 0.48, 0.68];
  pulseTimes.forEach((pt, i) => {
    const pulseOsc = audioCtx.createOscillator();
    const pulseGain = audioCtx.createGain();
    const pFilter = audioCtx.createBiquadFilter();

    pulseOsc.type = 'triangle';
    // Pitch drops slightly on each heavy compression stroke
    pulseOsc.frequency.setValueAtTime(42 + i * 4, now + pt);

    pFilter.type = 'lowpass';
    pFilter.frequency.setValueAtTime(180, now + pt);

    pulseGain.gain.setValueAtTime(0.001, now + pt);
    pulseGain.gain.linearRampToValueAtTime(0.24, now + pt + 0.04);
    pulseGain.gain.exponentialRampToValueAtTime(0.001, now + pt + 0.16);

    pulseOsc.connect(pFilter);
    pFilter.connect(pulseGain);
    pulseGain.connect(compressor || audioCtx.destination);

    pulseOsc.start(now + pt);
    pulseOsc.stop(now + pt + 0.18);
  });

  // 3. Mechanical Starter Click & Solenoid Engagement at beginning
  const clickOsc = audioCtx.createOscillator();
  const clickGain = audioCtx.createGain();
  clickOsc.type = 'square';
  clickOsc.frequency.setValueAtTime(140, now);
  clickGain.gain.setValueAtTime(0.2, now);
  clickGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.05);

  clickOsc.connect(clickGain);
  clickGain.connect(compressor || audioCtx.destination);

  clickOsc.start(now);
  clickOsc.stop(now + 0.06);
}

function buildAudioGraph() {
  if (!audioCtx) return;

  // Master Gain -> Dynamic Compressor -> Destination
  masterGain = audioCtx.createGain();
  masterGain.gain.setValueAtTime(0.0001, audioCtx.currentTime);

  compressor = audioCtx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-14, audioCtx.currentTime);
  compressor.knee.setValueAtTime(8, audioCtx.currentTime);
  compressor.ratio.setValueAtTime(4.0, audioCtx.currentTime);
  compressor.attack.setValueAtTime(0.004, audioCtx.currentTime);
  compressor.release.setValueAtTime(0.18, audioCtx.currentTime);

  masterGain.connect(compressor);
  compressor.connect(audioCtx.destination);

  engineBus = audioCtx.createGain();
  engineBus.gain.setValueAtTime(1.0, audioCtx.currentTime);

  filterLowpass = audioCtx.createBiquadFilter();
  filterLowpass.type = 'lowpass';
  filterLowpass.frequency.setValueAtTime(260, audioCtx.currentTime);
  filterLowpass.Q.setValueAtTime(2.2, audioCtx.currentTime);

  engineBus.connect(filterLowpass);
  filterLowpass.connect(masterGain);

  // 1. Fundamental Oscillator (46Hz at 700 RPM: deep V8 cross-plane thump)
  oscFund = audioCtx.createOscillator();
  oscFund.type = 'triangle';
  oscFund.frequency.setValueAtTime(46.6, audioCtx.currentTime);

  const gainFund = audioCtx.createGain();
  gainFund.gain.setValueAtTime(0.72, audioCtx.currentTime);
  oscFund.connect(gainFund);
  gainFund.connect(engineBus);

  // 2. 2nd Harmonic (Cross-plane engine rumble & exhaust manifold resonance)
  oscHarm2 = audioCtx.createOscillator();
  oscHarm2.type = 'sawtooth';
  oscHarm2.frequency.setValueAtTime(93.2, audioCtx.currentTime);

  const gainHarm2 = audioCtx.createGain();
  gainHarm2.gain.setValueAtTime(0.38, audioCtx.currentTime);
  oscHarm2.connect(gainHarm2);
  gainHarm2.connect(engineBus);

  // 3. 3rd Harmonic (Chamber exhaust bark)
  oscHarm3 = audioCtx.createOscillator();
  oscHarm3.type = 'triangle';
  oscHarm3.frequency.setValueAtTime(140, audioCtx.currentTime);

  const gainHarm3 = audioCtx.createGain();
  gainHarm3.gain.setValueAtTime(0.24, audioCtx.currentTime);
  oscHarm3.connect(gainHarm3);
  gainHarm3.connect(engineBus);

  // 4. 4th Harmonic (Mechanical pushrod valve train texture)
  oscHarm4 = audioCtx.createOscillator();
  oscHarm4.type = 'sine';
  oscHarm4.frequency.setValueAtTime(186.4, audioCtx.currentTime);

  const gainHarm4 = audioCtx.createGain();
  gainHarm4.gain.setValueAtTime(0.16, audioCtx.currentTime);
  oscHarm4.connect(gainHarm4);
  gainHarm4.connect(engineBus);

  // 5. Authentic American V8 Cam Chop LFO (Uneven muscle idle lope)
  lfoCamChop = audioCtx.createOscillator();
  lfoCamChop.type = 'sine';
  lfoCamChop.frequency.setValueAtTime(5.2, audioCtx.currentTime);

  lfoCamGain = audioCtx.createGain();
  lfoCamGain.gain.setValueAtTime(3.8, audioCtx.currentTime);

  lfoCamChop.connect(lfoCamGain);
  lfoCamGain.connect(oscFund.frequency);
  lfoCamGain.connect(oscHarm2.frequency);

  // 6. Filtered Mechanical Exhaust Texture (Warm low-frequency pink/bandpass air)
  const bufferSize = audioCtx.sampleRate * 2;
  const noiseBuffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const output = noiseBuffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    output[i] = Math.random() * 2 - 1;
  }

  noiseNode = audioCtx.createBufferSource();
  noiseNode.buffer = noiseBuffer;
  noiseNode.loop = true;

  noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'bandpass';
  noiseFilter.frequency.setValueAtTime(290, audioCtx.currentTime);
  noiseFilter.Q.setValueAtTime(1.8, audioCtx.currentTime);

  noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.14, audioCtx.currentTime);

  noiseNode.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(engineBus);

  oscFund.start();
  oscHarm2.start();
  oscHarm3.start();
  oscHarm4.start();
  lfoCamChop.start();
  noiseNode.start();
}

function setTargetRpm(rpm) {
  targetRpm = rpm;
}

function startRpmLoop() {
  if (revAnimationTimer) cancelAnimationFrame(revAnimationTimer);

  function update() {
    if (engineState !== 'RUNNING') return;

    // Smooth inertia interpolation towards target RPM:
    // Faster rev-up when throttle is applied, gentle natural return on deceleration
    const isRevvingUp = targetRpm > currentRpm;
    const lerpRate = isRevvingUp ? 0.08 : 0.045;
    currentRpm += (targetRpm - currentRpm) * lerpRate;

    // Small subtle random cam lope variation (±10 RPM at idle)
    const jitter = (Math.random() - 0.5) * 14;
    const displayRpm = Math.max(680, Math.round(currentRpm + jitter));

    const isRevved = currentRpm > 950;

    // Update UI elements
    const btn = document.getElementById('soundInstrumentBtn');
    const rpmLabel = document.getElementById('soundRpmLabel');
    const hintLabel = document.getElementById('soundHint');
    const needle = document.getElementById('soundNeedle');

    if (btn) {
      if (isRevved) {
        btn.classList.add('revving');
      } else {
        btn.classList.remove('revving');
      }
    }

    if (rpmLabel) {
      if (currentRpm < 780) {
        rpmLabel.textContent = '700 RPM';
      } else {
        rpmLabel.textContent = `${displayRpm.toLocaleString()} RPM`;
      }
    }

    if (hintLabel) {
      if (isRevved) {
        hintLabel.textContent = 'REVVING';
      } else {
        hintLabel.textContent = 'SCROLL';
      }
    }

    if (needle) {
      // Angle from 0 deg (700 RPM) to 65 deg (3000 RPM)
      const deg = Math.min(68, Math.max(0, ((currentRpm - 700) / 2300) * 65));
      needle.style.transform = `translateX(-50%) rotate(${deg}deg)`;
    }

    // Update Audio Parameters dynamically:
    if (audioCtx && oscFund) {
      const now = audioCtx.currentTime;
      // 700 RPM -> ~46.6Hz, 3000 RPM -> ~200Hz
      const fundFreq = (currentRpm / 700) * 46.6;

      oscFund.frequency.setValueAtTime(fundFreq, now);
      oscHarm2.frequency.setValueAtTime(fundFreq * 2, now);
      oscHarm3.frequency.setValueAtTime(fundFreq * 3, now);
      oscHarm4.frequency.setValueAtTime(fundFreq * 4, now);

      // Filter cutoff opens up smoothly as throttle opens (from 260Hz at idle to 880Hz under rev)
      const cutoff = 260 + ((currentRpm - 700) / 2300) * 620;
      filterLowpass.frequency.setValueAtTime(cutoff, now);

      // Noise texture expands with exhaust volume
      if (noiseGain) {
        const nGain = 0.14 + ((currentRpm - 700) / 2300) * 0.12;
        noiseGain.gain.setValueAtTime(nGain, now);
      }

      // LFO cam lope rate speeds up naturally with crank speed
      const lfoSpeed = 5.2 + ((currentRpm - 700) / 2300) * 11;
      lfoCamChop.frequency.setValueAtTime(lfoSpeed, now);
    }

    revAnimationTimer = requestAnimationFrame(update);
  }

  revAnimationTimer = requestAnimationFrame(update);
}

function stopV8Engine() {
  const btn = document.getElementById('soundInstrumentBtn');
  const rpmLabel = document.getElementById('soundRpmLabel');
  const hintLabel = document.getElementById('soundHint');

  engineState = 'OFF';
  if (btn) {
    btn.classList.remove('running', 'revving', 'starting');
  }
  if (rpmLabel) rpmLabel.textContent = 'OFF';
  if (hintLabel) hintLabel.textContent = 'START';

  const needle = document.getElementById('soundNeedle');
  if (needle) {
    needle.style.transform = 'translateX(-50%) rotate(-45deg)';
  }

  if (revAnimationTimer) {
    cancelAnimationFrame(revAnimationTimer);
    revAnimationTimer = null;
  }

  if (masterGain && audioCtx) {
    // Smooth deceleration and fade out
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime);
    masterGain.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.4);

    setTimeout(() => {
      try {
        if (oscFund) oscFund.stop();
        if (oscHarm2) oscHarm2.stop();
        if (oscHarm3) oscHarm3.stop();
        if (oscHarm4) oscHarm4.stop();
        if (lfoCamChop) lfoCamChop.stop();
        if (noiseNode) noiseNode.stop();

        if (masterGain) masterGain.disconnect();
      } catch (_) {}
    }, 450);
  }
}
