/**
 * scene4.js - Scene 4: The World of Conversations & Trust
 * 
 * Manages the transition from Scene 3, the prologue, the cinematic whisper
 * conversation reveals, the trust moment, the first-person connection,
 * the playful humour section, and the calm heartfelt conclusion.
 */

export class Scene4 {
  constructor() {
    this.container = document.querySelector('.scene4-container');
    this.prologueLine1 = document.querySelector('.scene4-prologue-line1');
    this.prologueLine2 = document.querySelector('.scene4-prologue-line2');
    this.scrollHint = document.querySelector('.scene4-scroll-hint');
    this.observer = null;

    this.init();
  }

  init() {
    this.setupScrollObserver();
    this.bindKeyboardNavigation();
    this.bindProceed();
  }

  bindProceed() {
    const proceedBtn = document.getElementById('scene4-proceed-btn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('scene4:complete', {
          detail: { scene: 4, timestamp: Date.now() }
        }));
      });
    }
  }

  setupScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(
        '.scene4-card, .scene4-chat-bubble, .scene4-typing-indicator, .scene4-humour-header, .scene4-humour-card'
      ).forEach(el => el.classList.add('in-view'));
      return;
    }

    const observerOptions = {
      root: this.container,
      rootMargin: '0px 0px -10% 0px',
      threshold: 0.15
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    const targets = document.querySelectorAll(
      '.scene4-card, .scene4-chat-bubble, .scene4-typing-indicator, .scene4-humour-header, .scene4-humour-card'
    );
    targets.forEach(target => this.observer.observe(target));
  }

  bindKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      if (!this.container || !this.container.classList.contains('active')) return;

      if (e.key === 'ArrowDown' || e.key === 'PageDown' || (e.key === ' ' && e.target === document.body)) {
        e.preventDefault();
        this.container.scrollBy({ top: 380, behavior: 'smooth' });
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        this.container.scrollBy({ top: -380, behavior: 'smooth' });
      }
    });
  }

  startScene() {
    if (!this.container) return;

    this.container.classList.add('active');
    this.container.scrollTop = 0;

    // 1. Prologue: "And somewhere between all those years…"
    setTimeout(() => {
      if (this.prologueLine1) this.prologueLine1.classList.add('revealed');

      // 2. "We created our own little world of conversations."
      setTimeout(() => {
        if (this.prologueLine2) this.prologueLine2.classList.add('revealed');

        // 3. Scroll hint appears
        setTimeout(() => {
          if (this.scrollHint) this.scrollHint.classList.add('revealed');
        }, 1600);

      }, 2000);

    }, 800);
  }
}

