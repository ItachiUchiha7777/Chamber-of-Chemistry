/**
 * CHAMBER OF CHEMISTRY — 3D HERO SIMULATION & UI ANIMATIONS
 * Real-time 3D Atomic Orbital & Molecular Dynamics Canvas Engine
 * + Scroll-triggered UI reveals and interactive micro-interactions.
 */

(function () {
  'use strict';

  /**
   * Hero 3D Atomic & Molecular Canvas Simulation
   */
  class HeroSimulation {
    constructor(canvasId) {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.mode = 'atom'; // 'atom' or 'mesh'
      this.rotX = 0.4;
      this.rotY = 0.6;
      this.zoom = 1.0;
      this.isDragging = false;
      this.lastX = 0;
      this.lastY = 0;
      this.time = 0;

      // Mouse Parallax
      this.mouseX = 0;
      this.mouseY = 0;
      this.targetRotX = 0.4;
      this.targetRotY = 0.6;

      // Background ambient particles
      this.particles = [];
      this.initParticles(35);

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Mouse Drag & Parallax
      this.canvas.addEventListener('mousedown', (e) => {
        this.isDragging = true;
        this.lastX = e.clientX;
        this.lastY = e.clientY;
      });

      window.addEventListener('mousemove', (e) => {
        if (this.isDragging) {
          const dx = e.clientX - this.lastX;
          const dy = e.clientY - this.lastY;
          this.rotY += dx * 0.008;
          this.rotX += dy * 0.008;
          this.targetRotY = this.rotY;
          this.targetRotX = this.rotX;
          this.lastX = e.clientX;
          this.lastY = e.clientY;
        } else {
          // Subtle mouse tilt
          const rect = this.canvas.getBoundingClientRect();
          const cx = rect.left + rect.width / 2;
          const cy = rect.top + rect.height / 2;
          this.mouseX = (e.clientX - cx) * 0.0003;
          this.mouseY = (e.clientY - cy) * 0.0003;
        }
      });

      window.addEventListener('mouseup', () => {
        this.isDragging = false;
      });

      // Touch events
      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          this.isDragging = true;
          this.lastX = e.touches[0].clientX;
          this.lastY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (this.isDragging && e.touches.length === 1) {
          const dx = e.touches[0].clientX - this.lastX;
          const dy = e.touches[0].clientY - this.lastY;
          this.rotY += dx * 0.008;
          this.rotX += dy * 0.008;
          this.targetRotY = this.rotY;
          this.targetRotX = this.rotX;
          this.lastX = e.touches[0].clientX;
          this.lastY = e.touches[0].clientY;
        }
      }, { passive: true });

      window.addEventListener('touchend', () => {
        this.isDragging = false;
      });

      // Toggle button
      const toggleBtn = document.getElementById('hero-sim-toggle');
      if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
          this.mode = this.mode === 'atom' ? 'mesh' : 'atom';
          toggleBtn.textContent = this.mode === 'atom' ? 'View Molecular Mesh' : 'View Quantum Atom';
        });
      }

      this.render();
    }

    resize() {
      const rect = this.canvas.parentElement.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      this.width = rect.width;
      this.height = rect.height;
      this.canvas.width = this.width * dpr;
      this.canvas.height = this.height * dpr;
      this.ctx.scale(dpr, dpr);
    }

    initParticles(count) {
      this.particles = [];
      for (let i = 0; i < count; i++) {
        this.particles.push({
          x: (Math.random() - 0.5) * 500,
          y: (Math.random() - 0.5) * 500,
          z: (Math.random() - 0.5) * 500,
          size: Math.random() * 2.5 + 1.2,
          color: Math.random() > 0.5 ? '#38BDF8' : '#D5A84B',
          vx: (Math.random() - 0.5) * 0.4,
          vy: (Math.random() - 0.5) * 0.4,
          vz: (Math.random() - 0.5) * 0.4
        });
      }
    }

    render() {
      this.time += 0.015;

      if (!this.isDragging) {
        this.rotY += 0.006 + this.mouseX;
        this.rotX += 0.002 + this.mouseY;
      }

      const ctx = this.ctx;
      const cx = this.width / 2;
      const cy = this.height / 2;
      const fov = 400;
      const cameraDist = 480;

      ctx.clearRect(0, 0, this.width, this.height);

      const cosX = Math.cos(this.rotX);
      const sinX = Math.sin(this.rotX);
      const cosY = Math.cos(this.rotY);
      const sinY = Math.sin(this.rotY);

      // Helper 3D Projection
      const project = (x, y, z) => {
        let x1 = x * cosY + z * sinY;
        let y1 = y;
        let z1 = -x * sinY + z * cosY;

        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        const scale = fov / (cameraDist + z2);
        return {
          x: cx + x2 * scale,
          y: cy + y2 * scale,
          scale,
          z: z2
        };
      };

      // 1. Render Ambient Background Chemical Particles
      this.particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.z += p.vz;
        if (p.x > 250) p.x = -250;
        if (p.x < -250) p.x = 250;
        if (p.y > 250) p.y = -250;
        if (p.y < -250) p.y = 250;
        if (p.z > 250) p.z = -250;
        if (p.z < -250) p.z = 250;

        const proj = project(p.x, p.y, p.z);
        if (proj.scale > 0) {
          ctx.beginPath();
          ctx.arc(proj.x, proj.y, Math.max(1, p.size * proj.scale), 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.min(0.8, Math.max(0.2, (proj.z + 250) / 500));
          ctx.fill();
        }
      });
      ctx.globalAlpha = 1.0;

      if (this.mode === 'atom') {
        this.renderAtomSimulation(ctx, project, cx, cy);
      } else {
        this.renderMeshSimulation(ctx, project);
      }

      requestAnimationFrame(() => this.render());
    }

    renderAtomSimulation(ctx, project, cx, cy) {
      // Draw Central Glowing Nucleus (Clusters of protons and neutrons)
      const nucleusAtoms = [
        { x: 0, y: 0, z: 0, color: '#D5A84B', r: 10 },
        { x: -7, y: 5, z: 4, color: '#38BDF8', r: 9 },
        { x: 8, y: -6, z: -3, color: '#D5A84B', r: 9 },
        { x: 4, y: 7, z: -5, color: '#38BDF8', r: 8.5 },
        { x: -6, y: -6, z: 6, color: '#D5A84B', r: 8.5 }
      ];

      // Sort nucleus back-to-front
      const projectedNucleus = nucleusAtoms.map(na => {
        const p = project(na.x, na.y, na.z);
        return { ...na, ...p };
      }).sort((a, b) => a.z - b.z);

      // Nucleus Outer Glow Aura
      const centerProj = project(0, 0, 0);
      const radGlow = ctx.createRadialGradient(centerProj.x, centerProj.y, 4, centerProj.x, centerProj.y, 45 * centerProj.scale);
      radGlow.addColorStop(0, 'rgba(213, 168, 75, 0.7)');
      radGlow.addColorStop(0.5, 'rgba(56, 189, 248, 0.3)');
      radGlow.addColorStop(1, 'rgba(24, 50, 75, 0)');
      ctx.fillStyle = radGlow;
      ctx.beginPath();
      ctx.arc(centerProj.x, centerProj.y, 45 * centerProj.scale, 0, Math.PI * 2);
      ctx.fill();

      projectedNucleus.forEach(p => {
        const grad = ctx.createRadialGradient(p.x - p.r * 0.3, p.y - p.r * 0.3, p.r * 0.1, p.x, p.y, p.r * p.scale);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.3, p.color);
        grad.addColorStop(1, '#0F1E2E');
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r * p.scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3 Quantum Elliptical Orbits tilted in 3D
      const orbits = [
        { tiltX: 0.2, tiltY: 0.8, tiltZ: 0.3, rx: 140, ry: 60, speed: 1.8, color: '#38BDF8' },
        { tiltX: 1.1, tiltY: 0.3, tiltZ: -0.6, rx: 140, ry: 60, speed: -2.2, color: '#D5A84B' },
        { tiltX: -0.7, tiltY: 0.9, tiltZ: 1.2, rx: 145, ry: 65, speed: 2.6, color: '#7DD3FC' }
      ];

      orbits.forEach((orb, i) => {
        // Draw orbital trajectory ring
        ctx.beginPath();
        const steps = 60;
        let firstPt = null;

        for (let j = 0; j <= steps; j++) {
          const theta = (j / steps) * Math.PI * 2;
          // Unrotated ellipse coords
          const lx = orb.rx * Math.cos(theta);
          const ly = orb.ry * Math.sin(theta);
          const lz = 0;

          // Apply orbit's internal tilt
          const ox = lx * Math.cos(orb.tiltZ) - ly * Math.sin(orb.tiltZ);
          const oy = (lx * Math.sin(orb.tiltZ) + ly * Math.cos(orb.tiltZ)) * Math.cos(orb.tiltX);
          const oz = (lx * Math.sin(orb.tiltZ) + ly * Math.cos(orb.tiltZ)) * Math.sin(orb.tiltX) + lz;

          const proj = project(ox, oy, oz);
          if (j === 0) {
            ctx.moveTo(proj.x, proj.y);
            firstPt = proj;
          } else {
            ctx.lineTo(proj.x, proj.y);
          }
        }

        ctx.strokeStyle = orb.color;
        ctx.lineWidth = 1.6;
        ctx.globalAlpha = 0.45;
        ctx.setLineDash([4, 4]);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.globalAlpha = 1.0;

        // Draw Orbiting Electron with glowing trail
        const elTheta = this.time * orb.speed;
        const elLx = orb.rx * Math.cos(elTheta);
        const elLy = orb.ry * Math.sin(elTheta);

        const elOx = elLx * Math.cos(orb.tiltZ) - elLy * Math.sin(orb.tiltZ);
        const elOy = (elLx * Math.sin(orb.tiltZ) + elLy * Math.cos(orb.tiltZ)) * Math.cos(orb.tiltX);
        const elOz = (elLx * Math.sin(orb.tiltZ) + elLy * Math.cos(orb.tiltZ)) * Math.sin(orb.tiltX);

        const elProj = project(elOx, elOy, elOz);

        // Electron glow
        const elGlow = ctx.createRadialGradient(elProj.x, elProj.y, 2, elProj.x, elProj.y, 14 * elProj.scale);
        elGlow.addColorStop(0, '#FFFFFF');
        elGlow.addColorStop(0.3, orb.color);
        elGlow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = elGlow;
        ctx.beginPath();
        ctx.arc(elProj.x, elProj.y, 14 * elProj.scale, 0, Math.PI * 2);
        ctx.fill();

        // Electron core
        ctx.fillStyle = '#FFFFFF';
        ctx.beginPath();
        ctx.arc(elProj.x, elProj.y, 4 * elProj.scale, 0, Math.PI * 2);
        ctx.fill();
      });
    }

    renderMeshSimulation(ctx, project) {
      // 3D Benzene & Functional Cluster Mesh
      const meshNodes = [
        { x: 0, y: -70, z: 0 },
        { x: 60, y: -35, z: 0 },
        { x: 60, y: 35, z: 0 },
        { x: 0, y: 70, z: 0 },
        { x: -60, y: 35, z: 0 },
        { x: -60, y: -35, z: 0 },
        // Secondary outer nodes
        { x: 100, y: 80, z: 40 },
        { x: -100, y: -80, z: -40 },
        { x: 0, y: 120, z: -30 }
      ];

      const meshEdges = [
        [0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 0],
        [2, 6], [5, 7], [3, 8]
      ];

      const projs = meshNodes.map(n => project(n.x, n.y, n.z));

      // Draw Bonds
      ctx.strokeStyle = '#38BDF8';
      ctx.lineWidth = 2.5;
      meshEdges.forEach(edge => {
        const p1 = projs[edge[0]];
        const p2 = projs[edge[1]];
        ctx.beginPath();
        ctx.moveTo(p1.x, p1.y);
        ctx.lineTo(p2.x, p2.y);
        ctx.stroke();
      });

      // Draw Nodes
      projs.forEach((p, idx) => {
        const isCenter = idx < 6;
        const color = isCenter ? '#D5A84B' : '#38BDF8';
        const rad = (isCenter ? 8 : 6) * p.scale;

        const grad = ctx.createRadialGradient(p.x - rad * 0.3, p.y - rad * 0.3, 1, p.x, p.y, rad);
        grad.addColorStop(0, '#FFFFFF');
        grad.addColorStop(0.3, color);
        grad.addColorStop(1, '#0F1E2E');

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(2, rad), 0, Math.PI * 2);
        ctx.fill();
      });
    }
  }

  /**
   * Scroll Reveal & UI Interactivity Setup
   */
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  }

  // Export to window
  window.HeroSimulation = HeroSimulation;
  window.initScrollReveals = initScrollReveals;

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('hero-chemistry-canvas')) {
      new HeroSimulation('hero-chemistry-canvas');
    }
    initScrollReveals();
  });
})();
