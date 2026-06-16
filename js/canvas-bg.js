/**
 * HeroNetworkCanvas — Animated particle-network background for the hero section.
 * Tech: Canvas API + requestAnimationFrame | No external dependencies.
 * Clase encapsulada, sin variables globales, responsive, con fallback accesible.
 */
class HeroNetworkCanvas {
  constructor(canvasEl) {
    this.canvas = canvasEl;
    this.ctx    = canvasEl.getContext('2d');
    this.nodes  = [];
    this.mouse  = { x: -9999, y: -9999 };
    this.animFrame = null;

    /* Paleta extraída de variables CSS del proyecto */
    this.palette = [
      'rgba(124,92,252,',   /* violet */
      'rgba(0,212,255,',    /* cyan   */
      'rgba(0,229,160,',    /* green  */
    ];

    this.config = {
      nodeCount:   55,
      maxDist:    140,
      nodeSpeed:  0.28,
      nodeRadius:  1.8,
      mouseRepel: 90,
    };
  }

  /* ── init ── */
  init() {
    this.resize();
    this._spawnNodes();
    this.events();
    this.loop();
  }

  /* ── resize ── */
  resize() {
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width  = rect.width;
    this.canvas.height = rect.height;
  }

  /* ── spawn nodes ── */
  _spawnNodes() {
    this.nodes = [];
    const { nodeCount, nodeSpeed } = this.config;
    for (let i = 0; i < nodeCount; i++) {
      const colorBase = this.palette[Math.floor(Math.random() * this.palette.length)];
      this.nodes.push({
        x:    Math.random() * this.canvas.width,
        y:    Math.random() * this.canvas.height,
        vx:   (Math.random() - 0.5) * nodeSpeed * 2,
        vy:   (Math.random() - 0.5) * nodeSpeed * 2,
        r:    this.config.nodeRadius + Math.random() * 1.2,
        color: colorBase,
      });
    }
  }

  /* ── update physics ── */
  update() {
    const { width, height } = this.canvas;
    const { mouseRepel } = this.config;

    this.nodes.forEach(n => {
      /* bounce walls */
      if (n.x < 0 || n.x > width)  n.vx *= -1;
      if (n.y < 0 || n.y > height) n.vy *= -1;

      /* soft mouse repel */
      const dx = n.x - this.mouse.x;
      const dy = n.y - this.mouse.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < mouseRepel && dist > 0) {
        const force = (mouseRepel - dist) / mouseRepel * 0.4;
        n.vx += (dx / dist) * force;
        n.vy += (dy / dist) * force;
      }

      /* speed cap */
      const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
      if (speed > 0.9) { n.vx = (n.vx / speed) * 0.9; n.vy = (n.vy / speed) * 0.9; }

      n.x += n.vx;
      n.y += n.vy;
    });
  }

  /* ── draw ── */
  draw() {
    const ctx = this.ctx;
    ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    const { maxDist } = this.config;
    const nodes = this.nodes;

    /* draw edges */
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx   = nodes[i].x - nodes[j].x;
        const dy   = nodes[i].y - nodes[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.28;
          ctx.beginPath();
          ctx.strokeStyle = nodes[i].color + alpha + ')';
          ctx.lineWidth   = 0.6;
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }
    }

    /* draw nodes */
    nodes.forEach(n => {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = n.color + '0.65)';
      ctx.fill();
    });
  }

  /* ── loop ── */
  loop() {
    // Pausar si la pestaña no está visible (ahorra CPU)
    if (document.hidden) {
      this.animFrame = requestAnimationFrame(() => this.loop());
      return;
    }
    this.update();
    this.draw();
    this.animFrame = requestAnimationFrame(() => this.loop());
  }

  /* ── events ── */
  events() {
    window.addEventListener('resize', () => {
      this.resize();
      this._spawnNodes();
    });

    this.canvas.parentElement.addEventListener('mousemove', e => {
      const rect = this.canvas.getBoundingClientRect();
      this.mouse.x = e.clientX - rect.left;
      this.mouse.y = e.clientY - rect.top;
    });

    this.canvas.parentElement.addEventListener('mouseleave', () => {
      this.mouse.x = -9999;
      this.mouse.y = -9999;
    });
  }

  /* ── destroy ── */
  destroy() {
    cancelAnimationFrame(this.animFrame);
  }
}

/* ── Bootstrap ── */
window.addEventListener('DOMContentLoaded', () => {
  // Respetar prefers-reduced-motion: desactivar canvas si el usuario prefiere menos movimiento
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const canvas = document.getElementById('hero-canvas');
  if (canvas && !prefersReduced) {
    const bg = new HeroNetworkCanvas(canvas);
    bg.init();
  } else if (canvas) {
    // Ocultar canvas sin animación
    canvas.style.display = 'none';
  }
});
