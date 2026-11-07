/**
 * scene5.js - Scene 5: The Memory Gallery
 * 
 * Manages the memory album transition, prologue reveals,
 * photographic showcase presentation, emotional reflection,
 * and the hopeful forward-looking conclusion.
 */

export class Scene5 {
  constructor() {
    this.container = document.querySelector('.scene5-container');
    this.prologueLine1 = document.querySelector('.scene5-prologue-line1');
    this.prologueLine2 = document.querySelector('.scene5-prologue-line2');
    this.scrollHint = document.querySelector('.scene5-scroll-hint');
    this.photoImg = document.getElementById('scene5-photo');
    this.photoFallback = document.getElementById('scene5-fallback');
    this.observer = null;

    this.init();
  }

  init() {
    this.setupPhotoHandler();
    this.setupScrollObserver();
    this.bindKeyboardNavigation();
    this.bindProceed();
  }

  bindProceed() {
    const proceedBtn = document.getElementById('scene5-proceed-btn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('scene5:complete', {
          detail: { scene: 5, timestamp: Date.now() }
        }));
      });
    }
  }

  setupPhotoHandler() {
    if (!this.photoImg || !this.photoFallback) return;

    // Handle initial state / cached load
    if (this.photoImg.complete && this.photoImg.naturalWidth > 1) {
      this.photoFallback.classList.remove('active');
    } else if (this.photoImg.complete && this.photoImg.naturalWidth <= 1) {
      // 1x1 placeholder detected - show elegant physical fallback placeholder
      this.photoFallback.classList.add('active');
      this.photoImg.style.display = 'none';
    }

    this.photoImg.addEventListener('load', () => {
      if (this.photoImg.naturalWidth > 1) {
        this.photoFallback.classList.remove('active');
        this.photoImg.style.display = 'block';
      } else {
        this.photoFallback.classList.add('active');
        this.photoImg.style.display = 'none';
      }
    });

    this.photoImg.addEventListener('error', () => {
      this.photoFallback.classList.add('active');
      this.photoImg.style.display = 'none';
    });
  }

  setupScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(
        '.scene5-header, .scene5-photo-showcase, .scene5-card'
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
      '.scene5-header, .scene5-photo-showcase, .scene5-card'
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

    // 1. Prologue: "And then there are the little moments…"
    setTimeout(() => {
      if (this.prologueLine1) this.prologueLine1.classList.add('revealed');

      // 2. "The ones you wish you could keep forever."
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

