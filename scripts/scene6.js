/**
 * scene6.js - Scene 6: Things I Never Say Enough
 * 
 * Manages the intimate prologue, personal note unfolding interactions,
 * the 6th class reflection, and the thoughtful closing sentiment.
 */

export class Scene6 {
  constructor() {
    this.container = document.querySelector('.scene6-container');
    this.prologueLine1 = document.querySelector('.scene6-prologue-line1');
    this.prologueLine2 = document.querySelector('.scene6-prologue-line2');
    this.prologueLine3 = document.querySelector('.scene6-prologue-line3');
    this.scrollHint = document.querySelector('.scene6-scroll-hint');
    this.noteCards = document.querySelectorAll('.scene6-note-card');
    this.observer = null;

    this.init();
  }

  init() {
    this.setupNotesInteraction();
    this.setupScrollObserver();
    this.bindKeyboardNavigation();
    this.bindProceed();
  }

  bindProceed() {
    const proceedBtn = document.getElementById('scene6-proceed-btn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('scene6:complete', {
          detail: { scene: 6, timestamp: Date.now() }
        }));
      });
    }
  }

  setupNotesInteraction() {
    this.noteCards.forEach((card) => {
      const toggleBtn = card.querySelector('.scene6-note-toggle');
      if (!toggleBtn) return;

      toggleBtn.addEventListener('click', () => {
        const isOpen = card.classList.contains('open');
        card.classList.toggle('open');
        toggleBtn.setAttribute('aria-expanded', !isOpen);
      });
    });
  }

  setupScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(
        '.scene6-header, .scene6-note-card, .scene6-card-moment, .scene6-card-conclusion'
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
      '.scene6-header, .scene6-note-card, .scene6-card-moment, .scene6-card-conclusion'
    );
    targets.forEach(target => this.observer.observe(target));
  }

  bindKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      if (!this.container || !this.container.classList.contains('active')) return;

      // Allow Enter/Space on note toggle buttons without scrolling
      if (document.activeElement && document.activeElement.classList.contains('scene6-note-toggle')) {
        return;
      }

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

    // 1. Prologue: "There are some things…"
    setTimeout(() => {
      if (this.prologueLine1) this.prologueLine1.classList.add('revealed');

      // 2. "That I probably don't say enough."
      setTimeout(() => {
        if (this.prologueLine2) this.prologueLine2.classList.add('revealed');

        // 3. "But today, I want you to know them."
        setTimeout(() => {
          if (this.prologueLine3) this.prologueLine3.classList.add('revealed');

          // 4. Scroll hint appears
          setTimeout(() => {
            if (this.scrollHint) this.scrollHint.classList.add('revealed');
          }, 1600);

        }, 1800);

      }, 1800);

    }, 800);
  }
}

