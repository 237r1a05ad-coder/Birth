/**
 * scene7.js - Scene 7: The Personal Letter
 * 
 * Manages the prologue, the physical envelope opening animation,
 * the progressive unfolding of the personal letter from Prudhvi to Harshita,
 * the closing reflections, and the transition point for Scene 8.
 */

export class Scene7 {
  constructor() {
    this.container = document.querySelector('.scene7-container');
    this.prologueLine1 = document.querySelector('.scene7-prologue-line1');
    this.prologueLine2 = document.querySelector('.scene7-prologue-line2');
    this.prologueLine3 = document.querySelector('.scene7-prologue-line3');
    this.prologueLine4 = document.querySelector('.scene7-prologue-line4');
    this.scrollHint = document.querySelector('.scene7-scroll-hint');
    this.envelopeBox = document.getElementById('scene7-envelope-box');
    this.letterSheet = document.getElementById('scene7-letter-sheet');
    this.observer = null;

    this.init();
  }

  init() {
    this.setupEnvelopeInteraction();
    this.setupScrollObserver();
    this.bindKeyboardNavigation();
    this.bindProceed();
  }

  bindProceed() {
    const proceedBtn = document.getElementById('scene7-proceed-btn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('scene7:complete', {
          detail: { scene: 7, timestamp: Date.now() }
        }));
      });
    }
  }

  setupEnvelopeInteraction() {
    if (!this.envelopeBox || !this.letterSheet) return;

    const handleOpen = () => {
      if (this.envelopeBox.classList.contains('opened')) return;

      // 1. Envelope flap flips open
      this.envelopeBox.classList.add('opened');
      this.envelopeBox.setAttribute('aria-expanded', 'true');

      // 2. Letter sheet emerges and unfolds smoothly
      setTimeout(() => {
        this.letterSheet.classList.add('revealed');

        // Gracefully scroll down to bring the letter header naturally into focus
        this.letterSheet.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 700);
    };

    this.envelopeBox.addEventListener('click', handleOpen);
    this.envelopeBox.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleOpen();
      }
    });
  }

  setupScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(
        '.scene7-envelope-section, .scene7-after-letter, .scene7-card-conclusion'
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
      '.scene7-envelope-section, .scene7-after-letter, .scene7-card-conclusion'
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

    // 1. Prologue: "And now…"
    setTimeout(() => {
      if (this.prologueLine1) this.prologueLine1.classList.add('revealed');

      // 2. "There is something I wanted to write to you."
      setTimeout(() => {
        if (this.prologueLine2) this.prologueLine2.classList.add('revealed');

        // 3. "Not just another birthday wish."
        setTimeout(() => {
          if (this.prologueLine3) this.prologueLine3.classList.add('revealed');

          // 4. "A little letter. From me to you."
          setTimeout(() => {
            if (this.prologueLine4) this.prologueLine4.classList.add('revealed');

            // 5. Scroll hint appears
            setTimeout(() => {
              if (this.scrollHint) this.scrollHint.classList.add('revealed');
            }, 1600);

          }, 1800);

        }, 1800);

      }, 1800);

    }, 800);
  }
}
