/**
 * CHAMBER OF CHEMISTRY — 3D MOLECULAR ENGINE
 * Provides interactive 3D Ball-and-Stick & Space-Filling molecular rendering
 * using mathematical 3D perspective projection onto HTML5 Canvas.
 */

(function () {
  'use strict';

  // Standard CPK Color Palette & Radii for Elements
  const CPK_COLORS = {
    H: { color: '#F8FAFC', stroke: '#CBD5E1', radius: 14, vdw: 22, name: 'Hydrogen' },
    C: { color: '#334155', stroke: '#1E293B', radius: 24, vdw: 36, name: 'Carbon' },
    N: { color: '#38BDF8', stroke: '#0284C7', radius: 22, vdw: 34, name: 'Nitrogen' },
    O: { color: '#EF4444', stroke: '#B91C1C', radius: 21, vdw: 32, name: 'Oxygen' },
    Au: { color: '#D5A84B', stroke: '#B45309', radius: 28, vdw: 40, name: 'Gold' }
  };

  // Verified 3D Molecular Coordinates & Chemical Data
  const MOLECULES = {
    benzene: {
      name: 'Benzene',
      formula: 'C₆H₆',
      mass: '78.11 g/mol',
      geometry: 'Planar Hexagonal (D₆h)',
      hybridisation: 'sp² Carbon',
      bondAngle: '120°',
      significance: 'Fundamental aromatic hydrocarbon demonstrating cyclic delocalised π-electron resonance.',
      atoms: [
        // 6 Carbon atoms in hexagonal ring
        { element: 'C', x: 0, y: -75, z: 0 },
        { element: 'C', x: 65, y: -37.5, z: 0 },
        { element: 'C', x: 65, y: 37.5, z: 0 },
        { element: 'C', x: 0, y: 75, z: 0 },
        { element: 'C', x: -65, y: 37.5, z: 0 },
        { element: 'C', x: -65, y: -37.5, z: 0 },
        // 6 Hydrogen atoms radiating outward
        { element: 'H', x: 0, y: -130, z: 0 },
        { element: 'H', x: 112, y: -65, z: 0 },
        { element: 'H', x: 112, y: 65, z: 0 },
        { element: 'H', x: 0, y: 130, z: 0 },
        { element: 'H', x: -112, y: 65, z: 0 },
        { element: 'H', x: -112, y: -65, z: 0 }
      ],
      bonds: [
        [0, 1, 1.5], [1, 2, 1.5], [2, 3, 1.5], [3, 4, 1.5], [4, 5, 1.5], [5, 0, 1.5],
        [0, 6, 1], [1, 7, 1], [2, 8, 1], [3, 9, 1], [4, 10, 1], [5, 11, 1]
      ]
    },

    water: {
      name: 'Water',
      formula: 'H₂O',
      mass: '18.015 g/mol',
      geometry: 'Bent / Angular',
      hybridisation: 'sp³ Oxygen (2 lone pairs)',
      bondAngle: '104.5°',
      significance: 'Universal polar solvent supporting biological chemistry and hydrogen bonding.',
      atoms: [
        { element: 'O', x: 0, y: -15, z: 0 },
        { element: 'H', x: -68, y: 48, z: 0 },
        { element: 'H', x: 68, y: 48, z: 0 }
      ],
      bonds: [
        [0, 1, 1], [0, 2, 1]
      ]
    },

    methane: {
      name: 'Methane',
      formula: 'CH₄',
      mass: '16.04 g/mol',
      geometry: 'Tetrahedral (Td)',
      hybridisation: 'sp³ Carbon',
      bondAngle: '109.5°',
      significance: 'Simplest alkane with four equivalent C–H σ-bonds, classic organic 3D geometry.',
      atoms: [
        { element: 'C', x: 0, y: 0, z: 0 },
        { element: 'H', x: 0, y: -85, z: 0 },
        { element: 'H', x: 80, y: 28, z: 30 },
        { element: 'H', x: -80, y: 28, z: 30 },
        { element: 'H', x: 0, y: 28, z: -85 }
      ],
      bonds: [
        [0, 1, 1], [0, 2, 1], [0, 3, 1], [0, 4, 1]
      ]
    },

    co2: {
      name: 'Carbon Dioxide',
      formula: 'CO₂',
      mass: '44.01 g/mol',
      geometry: 'Linear',
      hybridisation: 'sp Carbon',
      bondAngle: '180°',
      significance: 'Linear non-polar molecule with zero net dipole moment despite polar C=O double bonds.',
      atoms: [
        { element: 'C', x: 0, y: 0, z: 0 },
        { element: 'O', x: -95, y: 0, z: 0 },
        { element: 'O', x: 95, y: 0, z: 0 }
      ],
      bonds: [
        [0, 1, 2], [0, 2, 2]
      ]
    },

    ethanol: {
      name: 'Ethanol',
      formula: 'C₂H₅OH',
      mass: '46.07 g/mol',
      geometry: 'Tetrahedral at Carbons, Bent at Oxygen',
      hybridisation: 'sp³ Carbon and Oxygen',
      bondAngle: '109.5° (C-C-O), ~104.5° (C-O-H)',
      significance: 'Primary monohydric alcohol; models functional group chemistry and hydrogen bonding.',
      atoms: [
        { element: 'C', x: -60, y: 0, z: 0 },
        { element: 'C', x: 25, y: -20, z: 15 },
        { element: 'O', x: 85, y: 40, z: -20 },
        { element: 'H', x: 145, y: 20, z: -20 },
        { element: 'H', x: -110, y: -70, z: 0 },
        { element: 'H', x: -100, y: 55, z: 60 },
        { element: 'H', x: -75, y: 50, z: -65 },
        { element: 'H', x: 35, y: -75, z: -65 },
        { element: 'H', x: 45, y: -80, z: 75 }
      ],
      bonds: [
        [0, 1, 1], [1, 2, 1], [2, 3, 1],
        [0, 4, 1], [0, 5, 1], [0, 6, 1],
        [1, 7, 1], [1, 8, 1]
      ]
    },

    aspirin: {
      name: 'Acetylsalicylic Acid',
      formula: 'C₉H₈O₄',
      mass: '180.16 g/mol',
      geometry: 'Aromatic Ring with Ester & Carboxyl Substituents',
      hybridisation: 'sp² / sp³ Centers',
      bondAngle: '120° ring, 109.5° methyl',
      significance: 'Classic organic pharmaceutical synthesised via esterification of salicylic acid.',
      atoms: [
        // Benzene ring
        { element: 'C', x: -30, y: -50, z: 0 },
        { element: 'C', x: 30, y: -50, z: 0 },
        { element: 'C', x: 60, y: 0, z: 0 },
        { element: 'C', x: 30, y: 50, z: 0 },
        { element: 'C', x: -30, y: 50, z: 0 },
        { element: 'C', x: -60, y: 0, z: 0 },
        // Carboxyl group on C0
        { element: 'C', x: -65, y: -105, z: 0 },
        { element: 'O', x: -125, y: -115, z: 0 },
        { element: 'O', x: -30, y: -150, z: 0 },
        { element: 'H', x: -50, y: -185, z: 0 },
        // Ester branch on C1
        { element: 'O', x: 65, y: -105, z: 0 },
        { element: 'C', x: 125, y: -90, z: 15 },
        { element: 'O', x: 155, y: -140, z: 25 },
        { element: 'C', x: 160, y: -25, z: 15 }
      ],
      bonds: [
        [0, 1, 1.5], [1, 2, 1.5], [2, 3, 1.5], [3, 4, 1.5], [4, 5, 1.5], [5, 0, 1.5],
        [0, 6, 1], [6, 7, 2], [6, 8, 1], [8, 9, 1],
        [1, 10, 1], [10, 11, 1], [11, 12, 2], [11, 13, 1]
      ]
    }
  };

  /**
   * 3D Molecular Canvas Renderer
   */
  class MoleculeRenderer {
    constructor(canvasId, initialMolKey = 'benzene') {
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) return;

      this.ctx = this.canvas.getContext('2d');
      this.currentMolKey = initialMolKey;
      this.mol = MOLECULES[initialMolKey];

      // 3D Rotation angles in radians
      this.rotX = 0.35;
      this.rotY = 0.45;
      this.rotZ = 0.0;
      this.zoom = 1.0;
      this.autoSpin = true;
      this.spinSpeed = 0.008;
      this.isSpaceFilling = false;

      // Mouse drag state
      this.isDragging = false;
      this.lastMouseX = 0;
      this.lastMouseY = 0;

      this.hoveredAtom = null;

      this.init();
    }

    init() {
      this.resize();
      window.addEventListener('resize', () => this.resize());

      // Mouse / Touch Drag Events
      this.canvas.addEventListener('mousedown', (e) => this.onPointerDown(e.clientX, e.clientY));
      window.addEventListener('mousemove', (e) => this.onPointerMove(e.clientX, e.clientY));
      window.addEventListener('mouseup', () => this.onPointerUp());

      this.canvas.addEventListener('touchstart', (e) => {
        if (e.touches.length === 1) {
          this.onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchmove', (e) => {
        if (this.isDragging && e.touches.length === 1) {
          this.onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }, { passive: true });

      window.addEventListener('touchend', () => this.onPointerUp());

      // Wheel Zoom
      this.canvas.addEventListener('wheel', (e) => {
        e.preventDefault();
        this.zoom += e.deltaY * -0.0012;
        this.zoom = Math.max(0.5, Math.min(2.2, this.zoom));
      }, { passive: false });

      // Start animation loop
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

    setMolecule(molKey) {
      if (MOLECULES[molKey]) {
        this.currentMolKey = molKey;
        this.mol = MOLECULES[molKey];
        this.updateInfoOverlay();
      }
    }

    toggleSpaceFilling() {
      this.isSpaceFilling = !this.isSpaceFilling;
    }

    onPointerDown(x, y) {
      this.isDragging = true;
      this.autoSpin = false;
      this.lastMouseX = x;
      this.lastMouseY = y;
    }

    onPointerMove(x, y) {
      if (!this.isDragging) return;
      const dx = x - this.lastMouseX;
      const dy = y - this.lastMouseY;

      this.rotY += dx * 0.008;
      this.rotX += dy * 0.008;

      this.lastMouseX = x;
      this.lastMouseY = y;
    }

    onPointerUp() {
      this.isDragging = false;
    }

    updateInfoOverlay() {
      const nameEl = document.getElementById('mol-name');
      const formulaEl = document.getElementById('mol-formula');
      const massEl = document.getElementById('mol-mass');
      const geomEl = document.getElementById('mol-geometry');
      const hybEl = document.getElementById('mol-hybridisation');
      const angleEl = document.getElementById('mol-angle');
      const sigEl = document.getElementById('mol-significance');

      if (nameEl) nameEl.textContent = this.mol.name;
      if (formulaEl) formulaEl.textContent = this.mol.formula;
      if (massEl) massEl.textContent = this.mol.mass;
      if (geomEl) geomEl.textContent = this.mol.geometry;
      if (hybEl) hybEl.textContent = this.mol.hybridisation;
      if (angleEl) angleEl.textContent = this.mol.bondAngle;
      if (sigEl) sigEl.textContent = this.mol.significance;
    }

    render() {
      if (this.autoSpin && !this.isDragging) {
        this.rotY += this.spinSpeed;
        this.rotX += this.spinSpeed * 0.4;
      }

      const ctx = this.ctx;
      const cx = this.width / 2;
      const cy = this.height / 2;
      const fov = 420;
      const cameraDist = 480;

      ctx.clearRect(0, 0, this.width, this.height);

      // Precalculate Sin/Cos matrices
      const cosX = Math.cos(this.rotX);
      const sinX = Math.sin(this.rotX);
      const cosY = Math.cos(this.rotY);
      const sinY = Math.sin(this.rotY);

      // 1. Transform Atoms to 3D View Space
      const projectedAtoms = this.mol.atoms.map((atom, idx) => {
        // Rotate around Y-axis
        let x1 = atom.x * cosY + atom.z * sinY;
        let y1 = atom.y;
        let z1 = -atom.x * sinY + atom.z * cosY;

        // Rotate around X-axis
        let x2 = x1;
        let y2 = y1 * cosX - z1 * sinX;
        let z2 = y1 * sinX + z1 * cosX;

        // Apply Zoom & Perspective Projection
        const scale = (fov / (cameraDist + z2)) * this.zoom;
        const screenX = cx + x2 * scale;
        const screenY = cy + y2 * scale;

        const cpk = CPK_COLORS[atom.element] || CPK_COLORS.C;
        const radius = (this.isSpaceFilling ? cpk.vdw : cpk.radius) * scale;

        return {
          idx,
          element: atom.element,
          x3d: x2,
          y3d: y2,
          z3d: z2,
          screenX,
          screenY,
          radius,
          scale,
          cpk
        };
      });

      // 2. Prepare Render Queue for Depth Sorting (Painter's Algorithm)
      const renderQueue = [];

      // Add bonds (ball-and-stick only or thin lines in space-fill)
      this.mol.bonds.forEach((bond) => {
        const a1 = projectedAtoms[bond[0]];
        const a2 = projectedAtoms[bond[1]];
        if (!a1 || !a2) return;

        const avgZ = (a1.z3d + a2.z3d) / 2;
        const bondOrder = bond[2] || 1;

        renderQueue.push({
          type: 'bond',
          z: avgZ,
          a1,
          a2,
          order: bondOrder
        });
      });

      // Add atoms
      projectedAtoms.forEach((atom) => {
        renderQueue.push({
          type: 'atom',
          z: atom.z3d,
          atom
        });
      });

      // Sort back-to-front (lowest z is farthest away)
      renderQueue.sort((a, b) => a.z - b.z);

      // 3. Draw sorted objects
      renderQueue.forEach((item) => {
        if (item.type === 'bond') {
          this.drawBond(ctx, item.a1, item.a2, item.order);
        } else if (item.type === 'atom') {
          this.drawAtom(ctx, item.atom);
        }
      });

      requestAnimationFrame(() => this.render());
    }

    drawBond(ctx, a1, a2, order) {
      if (this.isSpaceFilling) return; // Don't draw bonds in space-filling view

      const dx = a2.screenX - a1.screenX;
      const dy = a2.screenY - a1.screenY;
      const dist = Math.hypot(dx, dy);
      if (dist === 0) return;

      const angle = Math.atan2(dy, dx);
      const nx = -Math.sin(angle);
      const ny = Math.cos(angle);

      ctx.save();

      if (order === 1) {
        // Single Bond: Gradient cylinder connecting atoms
        const grad = ctx.createLinearGradient(a1.screenX, a1.screenY, a2.screenX, a2.screenY);
        grad.addColorStop(0, a1.cpk.color);
        grad.addColorStop(1, a2.cpk.color);

        ctx.strokeStyle = grad;
        ctx.lineWidth = Math.max(3, 7 * a1.scale);
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(a1.screenX, a1.screenY);
        ctx.lineTo(a2.screenX, a2.screenY);
        ctx.stroke();

        // Subtle specular highlight line along bond
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.lineWidth = Math.max(1, 2 * a1.scale);
        ctx.beginPath();
        ctx.moveTo(a1.screenX, a1.screenY);
        ctx.lineTo(a2.screenX, a2.screenY);
        ctx.stroke();
      } else if (order === 2 || order === 1.5) {
        // Double or Resonance Bond (two parallel cylinders)
        const offset = 4.5 * a1.scale;

        for (let sign of [-1, 1]) {
          const offX = nx * offset * sign;
          const offY = ny * offset * sign;

          const grad = ctx.createLinearGradient(a1.screenX + offX, a1.screenY + offY, a2.screenX + offX, a2.screenY + offY);
          grad.addColorStop(0, a1.cpk.color);
          grad.addColorStop(1, a2.cpk.color);

          ctx.strokeStyle = grad;
          ctx.lineWidth = Math.max(2, 4.5 * a1.scale);
          ctx.lineCap = 'round';

          if (order === 1.5 && sign === 1) {
            ctx.setLineDash([5, 4]); // Resonant dashed bond!
          } else {
            ctx.setLineDash([]);
          }

          ctx.beginPath();
          ctx.moveTo(a1.screenX + offX, a1.screenY + offY);
          ctx.lineTo(a2.screenX + offX, a2.screenY + offY);
          ctx.stroke();
        }
      }

      ctx.restore();
    }

    drawAtom(ctx, atom) {
      const { screenX, screenY, radius, cpk } = atom;
      if (radius <= 0) return;

      ctx.save();

      // Radial 3D Sphere Shading with Specular Light Source from top-left (-30%, -30%)
      const lightX = screenX - radius * 0.35;
      const lightY = screenY - radius * 0.35;
      const grad = ctx.createRadialGradient(lightX, lightY, radius * 0.08, screenX, screenY, radius);

      grad.addColorStop(0, '#FFFFFF'); // Specular highlight
      grad.addColorStop(0.2, cpk.color);
      grad.addColorStop(0.85, cpk.stroke);
      grad.addColorStop(1, '#0F172A'); // Shadow fringe

      ctx.beginPath();
      ctx.arc(screenX, screenY, Math.max(1, radius), 0, Math.PI * 2);
      ctx.fillStyle = grad;
      ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
      ctx.shadowBlur = radius * 0.4;
      ctx.shadowOffsetY = radius * 0.2;
      ctx.fill();

      // Outer rim
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Atom Element Symbol Label (when large enough)
      if (radius > 16 && !this.isSpaceFilling) {
        ctx.fillStyle = atom.element === 'H' ? '#1E293B' : '#FFFFFF';
        ctx.font = `bold ${Math.round(radius * 0.75)}px 'Plus Jakarta Sans', sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(atom.element, screenX, screenY);
      }

      ctx.restore();
    }
  }

  // Export to window for page scripts
  window.MoleculeRenderer = MoleculeRenderer;
  window.COC_MOLECULES = MOLECULES;
})();
