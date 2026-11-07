/**
 * ambient.js - Subtle canvas-based atmospheric lighting & dust motes
 * 
 * Provides an organic, gentle sense of physical space and memory.
 * Restrained, quiet, respects prefers-reduced-motion.
 */

export class AmbientAtmosphere {
  constructor(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = canvasElement?.getContext('2d');
    this.particles = [];
    this.numParticles = 28;
    this.animationFrameId = null;
    this.isRunning = false;
    this.reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    this.mouse = { x: 0.5, y: 0.5, targetX: 0.5, targetY: 0.5 };

    if (!this.canvas || !this.ctx || this.reducedMotion) {
      return;
    }

    this.init();
  }

  init() {
    this.resize();
    this.createParticles();
    this.bindEvents();
    this.start();
  }

  bindEvents() {
    this.handleResize = () => {
      this.resize();
      this.createParticles();
    };
    window.addEventListener('resize', this.handleResize, { passive: true });

    this.handleMouseMove = (e) => {
      this.mouse.targetX = e.clientX / window.innerWidth;
      this.mouse.targetY = e.clientY / window.innerHeight;
    };
    window.addEventListener('mousemove', this.handleMouseMove, { passive: true });

    this.handleVisibilityChange = () => {
      if (document.hidden) {
        this.stop();
      } else if (!this.reducedMotion) {
        this.start();
      }
    };
    document.addEventListener('visibilitychange', this.handleVisibilityChange);
  }

  resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width * dpr;
    this.canvas.height = this.height * dpr;
    this.ctx.scale(dpr, dpr);
  }

  createParticles() {
    this.particles = [];
    for (let i = 0; i < this.numParticles; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        size: Math.random() * 1.4 + 0.6,
        alpha: Math.random() * 0.35 + 0.1,
        baseAlpha: Math.random() * 0.35 + 0.1,
        speedY: -(Math.random() * 0.18 + 0.05),
        speedX: (Math.random() - 0.5) * 0.12,
        swayPhase: Math.random() * Math.PI * 2,
        swaySpeed: Math.random() * 0.008 + 0.004,
      });
    }
  }

  update() {
    // Smooth mouse parallax easing
    this.mouse.x += (this.mouse.targetX - this.mouse.x) * 0.03;
    this.mouse.y += (this.mouse.targetY - this.mouse.y) * 0.03;

    const parallaxX = (this.mouse.x - 0.5) * 16;
    const parallaxY = (this.mouse.y - 0.5) * 16;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      p.swayPhase += p.swaySpeed;
      p.y += p.speedY;
      p.x += p.speedX + Math.sin(p.swayPhase) * 0.15;

      // Wrap around edges softly
      if (p.y < -10) {
        p.y = this.height + 10;
        p.x = Math.random() * this.width;
      }
      if (p.x < -10) p.x = this.width + 10;
      if (p.x > this.width + 10) p.x = -10;
    }
  }

  draw() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    const parallaxX = (this.mouse.x - 0.5) * 14;
    const parallaxY = (this.mouse.y - 0.5) * 14;

    for (let i = 0; i < this.particles.length; i++) {
      const p = this.particles[i];
      const renderX = p.x + parallaxX * (p.size * 0.5);
      const renderY = p.y + parallaxY * (p.size * 0.5);

      this.ctx.beginPath();
      this.ctx.arc(renderX, renderY, p.size, 0, Math.PI * 2);
      
      // Warm champagne/amber mote color
      this.ctx.fillStyle = `rgba(224, 195, 150, ${p.alpha})`;
      this.ctx.fill();
    }
  }

  loop() {
    if (!this.isRunning) return;
    this.update();
    this.draw();
    this.animationFrameId = requestAnimationFrame(() => this.loop());
  }

  start() {
    if (!this.isRunning && !this.reducedMotion) {
      this.isRunning = true;
      this.loop();
    }
  }

  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  destroy() {
    this.stop();
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    document.removeEventListener('visibilitychange', this.handleVisibilityChange);
  }
}

