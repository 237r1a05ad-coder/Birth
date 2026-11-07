/**
 * scene3.js - Scene 3: The Story Begins
 * 
 * Manages the transition backward in time from Scene 2, the prologue reveal,
 * the 6th Class chapter opening, the delicate timeline of passing years,
 * the personal narration, the screen/distance revelation, and the emotional conclusion.
 */

export class Scene3 {
  constructor() {
    this.container = document.querySelector('.scene3-container');
    this.prologueLine1 = document.querySelector('.scene3-prologue-line1');
    this.prologueLine2 = document.querySelector('.scene3-prologue-line2');
    this.scrollHint = document.querySelector('.scene3-scroll-hint');
    this.scrollFlow = document.querySelector('.scene3-scroll-flow');
    this.observer = null;

    this.init();
  }

  init() {
    this.setupScrollObserver();
    this.bindKeyboardNavigation();
    this.bindProceed();
  }

  bindProceed() {
    const proceedBtn = document.getElementById('scene3-proceed-btn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('scene3:complete', {
          detail: { scene: 3, timestamp: Date.now() }
        }));
      });
    }
  }

  setupScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      // Fallback: reveal all immediately if observer unsupported
      document.querySelectorAll('.scene3-card, .scene3-milestone-item').forEach(el => {
        el.classList.add('in-view');
      });
      return;
    }

    const observerOptions = {
      root: this.container,
      rootMargin: '0px 0px -12% 0px',
      threshold: 0.15
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
        }
      });
    }, observerOptions);

    const observeTargets = document.querySelectorAll('.scene3-card, .scene3-milestone-item');
    observeTargets.forEach(target => this.observer.observe(target));
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

    // 1. Prologue: "But before today…"
    setTimeout(() => {
      if (this.prologueLine1) this.prologueLine1.classList.add('revealed');

      // 2. "There was a beginning."
      setTimeout(() => {
        if (this.prologueLine2) this.prologueLine2.classList.add('revealed');

        // 3. Scroll cue appears
        setTimeout(() => {
          if (this.scrollHint) this.scrollHint.classList.add('revealed');
        }, 1600);

      }, 2000);

    }, 800);
  }
}

