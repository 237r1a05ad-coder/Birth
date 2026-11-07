/**
 * scene8.js - Scene 8: The Promise of More Memories
 * 
 * Manages the peaceful night-sky environment, background twinkling star field,
 * paced reveal of future conversations and the anticipation of finally meeting,
 * the interactive wishing star, and the handoff transition to Scene 9.
 */

export class Scene8 {
  constructor() {
    this.container = document.querySelector('.scene8-container');
    this.openingLine1 = document.querySelector('.scene8-opening-line1');
    this.openingLine2 = document.querySelector('.scene8-opening-line2');
    this.openingLine3 = document.querySelector('.scene8-opening-line3');
    this.scrollHint = document.querySelector('.scene8-scroll-hint');
    this.wishingStarBtn = document.getElementById('scene8-wishing-star-btn');
    this.starRevealCard = document.getElementById('scene8-star-reveal-card');
    this.shootingStarEl = document.getElementById('scene8-shooting-star');
    this.canvas = document.getElementById('scene8-stars-canvas');
    this.ctx = null;
    this.stars = [];
    this.animationFrameId = null;
    this.observer = null;

    this.init();
  }

  init() {
    this.initCanvas();
    this.setupWishingStarInteraction();
    this.setupScrollObserver();
    this.bindKeyboardNavigation();
    this.bindProceed();
  }

  initCanvas() {
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext('2d');
    if (!this.ctx) return;

    this.resizeCanvas();
    window.addEventListener('resize', () => this.resizeCanvas());

    // Generate stars
    const starCount = window.innerWidth < 600 ? 55 : 95;
    this.stars = [];
    for (let i = 0; i < starCount; i++) {
      this.stars.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        radius: Math.random() * 1.2 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        twinkleSpeed: Math.random() * 0.015 + 0.005,
        twinklePhase: Math.random() * Math.PI * 2
      });
    }
  }

  resizeCanvas() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startStarAnimation() {
    if (!this.ctx || !this.canvas) return;

    const render = () => {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

      for (let star of this.stars) {
        star.twinklePhase += star.twinkleSpeed;
        const currentAlpha = star.alpha + Math.sin(star.twinklePhase) * 0.25;
        const clampedAlpha = Math.max(0.1, Math.min(0.9, currentAlpha));

        this.ctx.fillStyle = `rgba(225, 235, 255, ${clampedAlpha})`;
        this.ctx.beginPath();
        this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        this.ctx.fill();
      }

      this.animationFrameId = requestAnimationFrame(render);
    };

    if (!this.animationFrameId) {
      render();
    }
  }

  stopStarAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  setupWishingStarInteraction() {
    if (!this.wishingStarBtn || !this.starRevealCard) return;

    const handleWish = () => {
      if (this.wishingStarBtn.classList.contains('activated')) return;

      this.wishingStarBtn.classList.add('activated');
      this.wishingStarBtn.setAttribute('aria-expanded', 'true');

      // Trigger the shooting star trajectory
      if (this.shootingStarEl) {
        this.shootingStarEl.classList.remove('active');
        void this.shootingStarEl.offsetWidth; // Force reflow
        this.shootingStarEl.classList.add('active');
      }

      // Reveal the heartfelt wish message
      setTimeout(() => {
        this.starRevealCard.classList.add('revealed');
      }, 500);
    };

    this.wishingStarBtn.addEventListener('click', handleWish);
    this.wishingStarBtn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleWish();
      }
    });
  }

  setupScrollObserver() {
    if (!('IntersectionObserver' in window)) {
      document.querySelectorAll(
        '.scene8-card, .scene8-interactive-section'
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
      '.scene8-card, .scene8-interactive-section'
    );
    targets.forEach(target => this.observer.observe(target));
  }

  bindKeyboardNavigation() {
    window.addEventListener('keydown', (e) => {
      if (!this.container || !this.container.classList.contains('active')) return;

      // Avoid scrolling if focus is currently inside the interactive star button
      if (document.activeElement && document.activeElement.classList.contains('scene8-wishing-star-btn')) {
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

  bindProceed() {
    const proceedBtn = document.getElementById('scene8-proceed-btn');
    if (proceedBtn) {
      proceedBtn.addEventListener('click', () => {
        window.dispatchEvent(new CustomEvent('scene8:complete', {
          detail: { scene: 8, timestamp: Date.now() }
        }));
      });
    }
  }

  startScene() {
    if (!this.container) return;

    this.container.classList.add('active');
    this.container.scrollTop = 0;

    // Start background stars canvas
    this.startStarAnimation();

    // 1. Opening: "One birthday wish isn't enough..."
    setTimeout(() => {
      if (this.openingLine1) this.openingLine1.classList.add('revealed');

      // 2. "Because I don't just wish you happiness for today."
      setTimeout(() => {
        if (this.openingLine2) this.openingLine2.classList.add('revealed');

        // 3. "I hope life gives you countless beautiful days ahead."
        setTimeout(() => {
          if (this.openingLine3) this.openingLine3.classList.add('revealed');

          // 4. Scroll hint appears
          setTimeout(() => {
            if (this.scrollHint) this.scrollHint.classList.add('revealed');
          }, 1600);

        }, 1800);

      }, 1800);

    }, 800);
  }
}

