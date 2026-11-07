/**
 * scene2.js - Scene 2: The Birthday Reveal & Candle Blowing Experience
 * 
 * Manages the atmospheric darkness, first flame ignition, gradual cake reveal,
 * "Happy Birthday, Harshita" title, interactive candle blowing via audio breath detection
 * (or accessible tap fallback), flame extinction physics, and the quiet final wish message.
 */

import { AudioBreathDetector } from './audio-breath.js';

export class Scene2 {
  constructor() {
    this.container = document.querySelector('.scene2-container');
    this.stage = document.querySelector('.scene2-stage');
    this.header = document.querySelector('.scene2-header');
    this.ambientLight = document.querySelector('.scene2-candle-ambient');
    
    // Candle Flames
    this.flameCenter = document.getElementById('flame-center');
    this.flameLeft = document.getElementById('flame-left');
    this.flameRight = document.getElementById('flame-right');
    this.allFlames = [this.flameCenter, this.flameLeft, this.flameRight].filter(Boolean);

    // Interaction elements
    this.interactionArea = document.querySelector('.scene2-interaction-area');
    this.micBtn = document.getElementById('mic-blow-btn');
    this.micText = document.getElementById('mic-btn-text');
    this.fallbackBtn = document.getElementById('fallback-blow-btn');

    // Post-wish message elements
    this.postWishArea = document.querySelector('.scene2-post-wish');
    this.wishLine1 = document.querySelector('.scene2-wish-line1');
    this.wishLine2 = document.querySelector('.scene2-wish-line2');

    this.isExtinguished = false;
    this.isBlowing = false;
    this.detector = null;

    this.init();
  }

  init() {
    this.setupDetector();
    this.bindEvents();
  }

  setupDetector() {
    this.detector = new AudioBreathDetector({
      onListeningStart: () => {
        if (this.micBtn) {
          this.micBtn.classList.add('listening');
          this.micText.textContent = 'Listening… blow gently toward your mic';
        }
      },
      onBreathProgress: (progress, intensity) => {
        this.handleBreathProgress(progress, intensity);
      },
      onExtinguish: () => {
        this.extinguishCandles();
      },
      onError: (err) => {
        console.warn('Microphone unavailable, switching seamlessly to tap fallback:', err.message);
        this.activateFallbackOnly();
      }
    });
  }

  bindEvents() {
    // Microphone button trigger
    if (this.micBtn) {
      this.micBtn.addEventListener('click', () => {
        if (!this.detector.isListening) {
          this.detector.start();
        }
      });
    }

    // Discreet tap fallback trigger
    if (this.fallbackBtn) {
      this.fallbackBtn.addEventListener('click', () => {
        this.simulateTapBlow();
      });
    }

    // Direct tap on cake viewport also acts as an intuitive fallback
    const cakeViewport = document.querySelector('.scene2-cake-viewport');
    if (cakeViewport) {
      cakeViewport.addEventListener('click', () => {
        if (!this.isExtinguished && this.interactionArea.classList.contains('visible')) {
          this.simulateTapBlow();
        }
      });
    }
  }

  activateFallbackOnly() {
    if (this.micBtn) {
      this.micBtn.style.display = 'none';
    }
    if (this.fallbackBtn) {
      this.fallbackBtn.textContent = 'Tap to blow out the candles';
      this.fallbackBtn.style.fontSize = '0.95rem';
      this.fallbackBtn.style.color = 'var(--color-text-main)';
    }
  }

  /**
   * Main Scene 2 Entry Orchestration
   */
  startScene() {
    this.container.classList.add('active');

    // 1. Initial Suspended Darkness (~1.2s pause)
    setTimeout(() => {
      // 2. The First Flame appears in darkness
      this.igniteFirstFlame();
    }, 1200);
  }

  igniteFirstFlame() {
    if (this.flameCenter) {
      this.flameCenter.classList.add('lit');
    }
    if (this.ambientLight) {
      this.ambientLight.classList.add('ignited');
    }

    // 3. Gradual discovery: after 1.4s, side candles catch light and cake is illuminated
    setTimeout(() => {
      if (this.flameLeft) this.flameLeft.classList.add('lit');
      if (this.flameRight) this.flameRight.classList.add('lit');

      this.stage.classList.add('cake-revealed');

      // 4. Reveal "Happy Birthday, Harshita"
      setTimeout(() => {
        this.header.classList.add('visible');

        // 5. Contemplative breathing room before "Make a wish."
        setTimeout(() => {
          this.interactionArea.classList.add('visible');
        }, 2200);

      }, 1600);

    }, 1400);
  }

  handleBreathProgress(progress, intensity) {
    if (this.isExtinguished) return;

    if (intensity > 0.1) {
      // Real-time organic flame bending and flickering with breath
      this.allFlames.forEach(flame => {
        flame.classList.add('flicker-strong');
        const sway = (Math.random() - 0.5) * 20 * intensity;
        const scaleY = Math.max(0.4, 1 - progress * 0.5);
        flame.style.transform = `scale(${1 - progress * 0.3}, ${scaleY}) rotate(${sway}deg)`;
      });
    } else {
      this.allFlames.forEach(flame => {
        flame.classList.remove('flicker-strong');
        flame.style.transform = '';
      });
    }
  }

  simulateTapBlow() {
    if (this.isExtinguished) return;

    // Simulate breath physics with subtle anticipation flutter
    this.allFlames.forEach(flame => {
      flame.classList.add('flicker-strong');
    });

    setTimeout(() => {
      this.extinguishCandles();
    }, 600);
  }

  extinguishCandles() {
    if (this.isExtinguished) return;
    this.isExtinguished = true;

    // Immediately stop microphone and audio context to avoid memory leaks
    if (this.detector) {
      this.detector.stop();
    }

    // 1. Flames extinguish and wisp of smoke ascends
    this.allFlames.forEach(flame => {
      flame.classList.remove('lit', 'flicker-strong');
      flame.classList.add('extinguished');
      flame.style.transform = '';
    });

    // 2. Ambient light drops down, room becomes quiet & dark
    if (this.ambientLight) {
      this.ambientLight.classList.remove('ignited');
      this.ambientLight.classList.add('extinguished');
    }

    // 3. Fade out the wish instruction controls
    this.interactionArea.style.opacity = '0';
    this.interactionArea.style.pointerEvents = 'none';

    // 4. Quiet pause (1.8s) of stillness in the darkened room
    setTimeout(() => {
      this.interactionArea.style.display = 'none';
      this.header.style.opacity = '0.35'; // Subtly soften birthday header to focus on wish

      this.revealPostWishMessages();
    }, 1800);
  }

  revealPostWishMessages() {
    this.postWishArea.classList.add('visible');

    // First line: "Whatever you wished for…"
    setTimeout(() => {
      this.wishLine1.classList.add('revealed');

      // Short delay (2.2s): "I hope it finds its way to you."
      setTimeout(() => {
        this.wishLine2.classList.add('revealed');

        // Allow the moment to linger, then reveal navigation buttons
        const proceedBtn = document.getElementById('scene2-proceed-btn');
        if (proceedBtn) {
          setTimeout(() => proceedBtn.classList.add('revealed'), 800);
        }

        let handedOff = false;
        const triggerScene3 = () => {
          if (handedOff) return;
          handedOff = true;
          window.dispatchEvent(new CustomEvent('scene2:complete', {
            detail: { scene: 2, timestamp: Date.now() }
          }));
        };

        if (proceedBtn) {
          proceedBtn.addEventListener('click', triggerScene3);
        }

      }, 2200);

    }, 300);
  }

  reset() {
    this.isExtinguished = false;
    this.isBlowing = false;
    this.stage?.classList.remove('ignited', 'revealed', 'extinguished', 'candle-blown');
    this.header?.classList.remove('revealed');
    this.interactionArea?.classList.remove('revealed', 'fading-out');
    this.postWishArea?.classList.remove('revealed');
    this.wishLine1?.classList.remove('revealed');
    this.wishLine2?.classList.remove('revealed');
    this.allFlames.forEach(f => f.classList.remove('blown-out'));
    if (this.micBtn) {
      this.micBtn.classList.remove('listening');
      this.micBtn.disabled = false;
      if (this.micText) this.micText.textContent = 'Take a breath… and blow out the candles';
    }
  }
}

