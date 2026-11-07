/**
 * scene9.js - Scene 9: Final Scene — Until Our Next Memory
 * 
 * Manages the cinematic closing atmosphere, paced reveal of the heartfelt final message,
 * the handcrafted signature, the "Keep this memory" interaction,
 * the static final screen, and the seamless "Experience it again" replay controller.
 */

export class Scene9 {
  constructor() {
    this.container = document.querySelector('.scene9-container');
    this.candleMemorial = document.querySelector('.scene9-candle-memorial');
    this.openingLine1 = document.querySelector('.scene9-opening-line1');
    this.openingLine2 = document.querySelector('.scene9-opening-line2');
    this.scrollHint = document.querySelector('.scene9-scroll-hint');
    this.keepBtn = document.getElementById('scene9-keep-memory-btn');
    this.memoryKeptCard = document.getElementById('scene9-memory-kept-card');
    this.replayBtn = document.getElementById('scene9-replay-btn');
    this.observer = null;

    this.init();
  }

  init() {
    this.setupKeepMemoryInteraction();
    this.setupScrollObserver();
    this.bindKeyboardNavigation();
    this.bindReplay();
  }

  setupKeepMemoryInteraction() {
    if (!this.keepBtn || !this.memoryKeptCard) return;

    const handleKeep = () => {
      if (this.keepBtn.classList.contains('activated')) return;

      this.keepBtn.classList.add('activated');
      this.keepBtn.setAttribute('aria-expanded', 'true');

      // Unfold the kept memory card smoothly
      setTimeout(() => {
        this.memoryKeptCard.classList.add('revealed');
      }, 400);
    };

    this.keepBtn.addEventListener('click', handleKeep);
    this.keepBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleKeep();
      }
    });
  }

  setupScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(
        '.scene9-card, .scene9-signature-block, .scene9-interactive-section, .scene9-final-screen'
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
      '.scene9-card, .scene9-signature-block, .scene9-interactive-section, .scene9-final-screen'
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

  bindReplay() {
    if (this.replayBtn) {
      this.replayBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('experience:replay', {
          detail: { timestamp: Date.now() }
        }));
      });
    }
  }

  reset() {
    if (!this.container) return;
    this.container.classList.remove('active');
    this.container.scrollTop = 0;
    this.openingLine1?.classList.remove('revealed');
    this.openingLine2?.classList.remove('revealed');
    this.candleMemorial?.classList.remove('revealed');
    this.scrollHint?.classList.remove('revealed');
    this.keepBtn?.classList.remove('activated');
    this.keepBtn?.setAttribute('aria-expanded', 'false');
    this.memoryKeptCard?.classList.remove('revealed');

    document.querySelectorAll(
      '.scene9-card, .scene9-signature-block, .scene9-interactive-section, .scene9-final-screen'
    ).forEach(el => el.classList.remove('in-view'));
  }

  startScene() {
    if (!this.container) return;

    this.container.classList.add('active');
    this.container.scrollTop = 0;

    // 1. Reveal subtle candle flame
    setTimeout(() => {
      if (this.candleMemorial) this.candleMemorial.classList.add('revealed');

      // 2. "Before you leave..."
      setTimeout(() => {
        if (this.openingLine1) this.openingLine1.classList.add('revealed');

        // 3. "I just want to say one last thing."
        setTimeout(() => {
          if (this.openingLine2) this.openingLine2.classList.add('revealed');

          // 4. Scroll hint appears
          setTimeout(() => {
            if (this.scrollHint) this.scrollHint.classList.add('revealed');
          }, 1600);

        }, 1800);

      }, 1400);

    }, 800);
  }
}

