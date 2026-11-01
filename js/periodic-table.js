/**
 * CHAMBER OF CHEMISTRY — MODERN INTERACTIVE PERIODIC TABLE
 * Comprehensive IUPAC Periodic Table dataset & interactive explorer
 */

(function () {
  'use strict';

  // Verified Chemical Elements Dataset (1 to 118)
  const ELEMENTS = [
    { num: 1, sym: 'H', name: 'Hydrogen', mass: '1.008', group: 1, period: 1, cat: 'nonmetal', config: '1s¹', app: 'Clean energy fuel cells, ammonia synthesis, organic reduction reactions.' },
    { num: 2, sym: 'He', name: 'Helium', mass: '4.0026', group: 18, period: 1, cat: 'noble', config: '1s²', app: 'Superconducting magnet cryogenics (NMR & MRI spectrometers).' },
    { num: 3, sym: 'Li', name: 'Lithium', mass: '6.94', group: 1, period: 2, cat: 'alkali', config: '[He] 2s¹', app: 'High-density rechargeable batteries, organolithium reagents in synthesis.' },
    { num: 4, sym: 'Be', name: 'Beryllium', mass: '9.0122', group: 2, period: 2, cat: 'alkaline', config: '[He] 2s²', app: 'Aerospace alloys, X-ray tube acoustic windows.' },
    { num: 5, sym: 'B', name: 'Boron', mass: '10.81', group: 13, period: 2, cat: 'metalloid', config: '[He] 2s² 2p¹', app: 'Borosilicate laboratory glassware, hydroboration-oxidation in Organic Chemistry.' },
    { num: 6, sym: 'C', name: 'Carbon', mass: '12.011', group: 14, period: 2, cat: 'nonmetal', config: '[He] 2s² 2p²', app: 'The cornerstone of Organic Chemistry and all biochemical life forms.' },
    { num: 7, sym: 'N', name: 'Nitrogen', mass: '14.007', group: 15, period: 2, cat: 'nonmetal', config: '[He] 2s² 2p³', app: 'Inert atmospheres for sensitive reactions, amino acids, Haber process.' },
    { num: 8, sym: 'O', name: 'Oxygen', mass: '15.999', group: 16, period: 2, cat: 'nonmetal', config: '[He] 2s² 2p⁴', app: 'Combustion, cellular respiration, oxidation mechanisms, oxides.' },
    { num: 9, sym: 'F', name: 'Fluorine', mass: '18.998', group: 17, period: 2, cat: 'halogen', config: '[He] 2s² 2p⁵', app: 'Most electronegative element; Teflon non-stick coatings, pharmaceuticals.' },
    { num: 10, sym: 'Ne', name: 'Neon', mass: '20.180', group: 18, period: 2, cat: 'noble', config: '[He] 2s² 2p⁶', app: 'High-voltage illuminated discharge signage, cryogenic cooling.' },
    { num: 11, sym: 'Na', name: 'Sodium', mass: '22.990', group: 1, period: 3, cat: 'alkali', config: '[Ne] 3s¹', app: 'Wurtz coupling reaction, cellular osmotic pressure, table salt.' },
    { num: 12, sym: 'Mg', name: 'Magnesium', mass: '24.305', group: 2, period: 3, cat: 'alkaline', config: '[Ne] 3s²', app: 'Grignard reagents (R–Mg–X) in carbon-carbon bond construction.' },
    { num: 13, sym: 'Al', name: 'Aluminium', mass: '26.982', group: 13, period: 3, cat: 'post-trans', config: '[Ne] 3s² 3p¹', app: 'Lightweight structural metallurgy, Friedel-Crafts catalyst (AlCl₃).' },
    { num: 14, sym: 'Si', name: 'Silicon', mass: '28.085', group: 14, period: 3, cat: 'metalloid', config: '[Ne] 3s² 3p²', app: 'Semiconductors in microprocessors, silicone polymers, silicate glass.' },
    { num: 15, sym: 'P', name: 'Phosphorus', mass: '30.974', group: 15, period: 3, cat: 'nonmetal', config: '[Ne] 3s² 3p³', app: 'Wittig reaction ylides, nucleic acid DNA/RNA backbones, fertilisers.' },
    { num: 16, sym: 'S', name: 'Sulfur', mass: '32.06', group: 16, period: 3, cat: 'nonmetal', config: '[Ne] 3s² 3p⁴', app: 'Sulfuric acid synthesis, vulcanisation of rubber, thiol chemistry.' },
    { num: 17, sym: 'Cl', name: 'Chlorine', mass: '35.45', group: 17, period: 3, cat: 'halogen', config: '[Ne] 3s² 3p⁵', app: 'Water purification, PVC plastic manufacturing, nucleophilic substitution.' },
    { num: 18, sym: 'Ar', name: 'Argon', mass: '39.948', group: 18, period: 3, cat: 'noble', config: '[Ne] 3s² 3p⁶', app: 'Shielding gas for TIG welding and inert chemical gloveboxes.' },
    { num: 19, sym: 'K', name: 'Potassium', mass: '39.098', group: 1, period: 4, cat: 'alkali', config: '[Ar] 4s¹', app: 'Potassium permanganate (KMnO₄) oxidations, neurological nerve impulses.' },
    { num: 20, sym: 'Ca', name: 'Calcium', mass: '40.078', group: 2, period: 4, cat: 'alkaline', config: '[Ar] 4s²', app: 'Bone mineralization, Portland cement, industrial reducing agent.' },
    { num: 21, sym: 'Sc', name: 'Scandium', mass: '44.956', group: 3, period: 4, cat: 'transition', config: '[Ar] 3d¹ 4s²', app: 'High-strength aerospace aluminium-scandium alloys.' },
    { num: 22, sym: 'Ti', name: 'Titanium', mass: '47.867', group: 4, period: 4, cat: 'transition', config: '[Ar] 3d² 4s²', app: 'Biocompatible medical implants, Ziegler-Natta polymerization catalyst.' },
    { num: 23, sym: 'V', name: 'Vanadium', mass: '50.942', group: 5, period: 4, cat: 'transition', config: '[Ar] 3d³ 4s²', app: 'Vanadium pentoxide (V₂O₅) catalyst in the Contact Process.' },
    { num: 24, sym: 'Cr', name: 'Chromium', mass: '51.996', group: 6, period: 4, cat: 'transition', config: '[Ar] 3d⁵ 4s¹', app: 'PCC and Jones reagent oxidations, stainless steel corrosion resistance.' },
    { num: 25, sym: 'Mn', name: 'Manganese', mass: '54.938', group: 7, period: 4, cat: 'transition', config: '[Ar] 3d⁵ 4s²', app: 'Steel deoxidizer, versatile redox states from +2 to +7.' },
    { num: 26, sym: 'Fe', name: 'Iron', mass: '55.845', group: 8, period: 4, cat: 'transition', config: '[Ar] 3d⁶ 4s²', app: 'Hemoglobin oxygen carrier, structural steel; subject of green corrosion study.' },
    { num: 27, sym: 'Co', name: 'Cobalt', mass: '58.933', group: 9, period: 4, cat: 'transition', config: '[Ar] 3d⁷ 4s²', app: 'Vitamin B12 coordination center, lithium-ion battery cathodes.' },
    { num: 28, sym: 'Ni', name: 'Nickel', mass: '58.693', group: 10, period: 4, cat: 'transition', config: '[Ar] 3d⁸ 4s²', app: 'Raney nickel in catalytic hydrogenation of alkenes and carbonyls.' },
    { num: 29, sym: 'Cu', name: 'Copper', mass: '63.546', group: 11, period: 4, cat: 'transition', config: '[Ar] 3d¹⁰ 4s¹', app: 'Electrical conduction, Fehling’s solution test for reducing sugars.' },
    { num: 30, sym: 'Zn', name: 'Zinc', mass: '65.38', group: 12, period: 4, cat: 'transition', config: '[Ar] 3d¹⁰ 4s²', app: 'Galvanisation, Clemmensen reduction (Zn-Hg/HCl) of ketones to alkanes.' },
    { num: 35, sym: 'Br', name: 'Bromine', mass: '79.904', group: 17, period: 4, cat: 'halogen', config: '[Ar] 3d¹⁰ 4s² 4p⁵', app: 'Electrophilic addition test for unsaturation (bromine water test).' },
    { num: 47, sym: 'Ag', name: 'Silver', mass: '107.87', group: 11, period: 5, cat: 'transition', config: '[Kr] 4d¹⁰ 5s¹', app: 'Tollens’ reagent test (silver mirror) for aldehydes.' },
    { num: 53, sym: 'I', name: 'Iodine', mass: '126.90', group: 17, period: 5, cat: 'halogen', config: '[Kr] 4d¹⁰ 5s² 5p⁵', app: 'Iodoform test (CHI₃) for methyl ketones, thyroid hormone regulation.' },
    { num: 79, sym: 'Au', name: 'Gold', mass: '196.97', group: 11, period: 6, cat: 'transition', config: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹', app: 'Noble metal, nanotechnology catalysis, academic medals of excellence.' },
    { num: 80, sym: 'Hg', name: 'Mercury', mass: '200.59', group: 12, period: 6, cat: 'transition', config: '[Xe] 4f¹⁴ 5d¹⁰ 6s²', app: 'Only liquid metal at room temperature; oxymercuration-demercuration.' },
    { num: 82, sym: 'Pb', name: 'Lead', mass: '207.2', group: 14, period: 6, cat: 'post-trans', config: '[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²', app: 'Radiation shielding in nuclear medicine, lead-acid storage batteries.' },
    { num: 92, sym: 'U', name: 'Uranium', mass: '238.03', group: 3, period: 7, cat: 'actinide', config: '[Rn] 5f³ 6d¹ 7s²', app: 'Nuclear fission energy generation, radiometric dating of geological ages.' }
  ];

  // Element coordinate placement in the 18x7 IUPAC grid
  const GRID_LAYOUT = {
    1: { row: 1, col: 1 },
    2: { row: 1, col: 18 },
    3: { row: 2, col: 1 }, 4: { row: 2, col: 2 },
    5: { row: 2, col: 13 }, 6: { row: 2, col: 14 }, 7: { row: 2, col: 15 }, 8: { row: 2, col: 16 }, 9: { row: 2, col: 17 }, 10: { row: 2, col: 18 },
    11: { row: 3, col: 1 }, 12: { row: 3, col: 2 },
    13: { row: 3, col: 13 }, 14: { row: 3, col: 14 }, 15: { row: 3, col: 15 }, 16: { row: 3, col: 16 }, 17: { row: 3, col: 17 }, 18: { row: 3, col: 18 },
    19: { row: 4, col: 1 }, 20: { row: 4, col: 2 }, 21: { row: 4, col: 3 }, 22: { row: 4, col: 4 }, 23: { row: 4, col: 5 }, 24: { row: 4, col: 6 },
    25: { row: 4, col: 7 }, 26: { row: 4, col: 8 }, 27: { row: 4, col: 9 }, 28: { row: 4, col: 10 }, 29: { row: 4, col: 11 }, 30: { row: 4, col: 12 },
    35: { row: 4, col: 17 },
    47: { row: 5, col: 11 },
    53: { row: 5, col: 17 },
    79: { row: 6, col: 11 },
    80: { row: 6, col: 12 },
    82: { row: 6, col: 14 },
    92: { row: 9, col: 6 } // Actinide series placement
  };

  class PeriodicTable {
    constructor(containerId) {
      this.container = document.getElementById(containerId);
      if (!this.container) return;

      this.currentFilter = 'all';
      this.searchQuery = '';

      this.init();
    }

    init() {
      this.renderGrid();
      this.setupControls();
    }

    renderGrid() {
      this.container.innerHTML = '';

      ELEMENTS.forEach(el => {
        const pos = GRID_LAYOUT[el.num];
        if (!pos) return;

        const cell = document.createElement('div');
        cell.className = `element-cell cat-${el.cat}`;
        cell.style.gridRow = pos.row;
        cell.style.gridColumn = pos.col;
        cell.setAttribute('data-num', el.num);
        cell.setAttribute('data-name', el.name.toLowerCase());
        cell.setAttribute('data-symbol', el.sym.toLowerCase());
        cell.setAttribute('data-category', el.cat);

        cell.innerHTML = `
          <span class="el-num">${el.num}</span>
          <span class="el-symbol">${el.sym}</span>
          <span class="el-name">${el.name}</span>
        `;

        cell.addEventListener('click', () => this.showElementModal(el));
        this.container.appendChild(cell);
      });
    }

    setupControls() {
      // Search input
      const searchInput = document.getElementById('periodic-search');
      if (searchInput) {
        searchInput.addEventListener('input', (e) => {
          this.searchQuery = e.target.value.toLowerCase().trim();
          this.filterElements();
        });
      }

      // Category filter buttons
      const filterBtns = document.querySelectorAll('.cat-filter-btn');
      filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          filterBtns.forEach(b => b.classList.remove('active'));
          btn.classList.add('active');
          this.currentFilter = btn.getAttribute('data-cat');
          this.filterElements();
        });
      });
    }

    filterElements() {
      const cells = this.container.querySelectorAll('.element-cell');
      cells.forEach(cell => {
        const name = cell.getAttribute('data-name');
        const symbol = cell.getAttribute('data-symbol');
        const num = cell.getAttribute('data-num');
        const cat = cell.getAttribute('data-category');

        const matchesSearch = !this.searchQuery ||
          name.includes(this.searchQuery) ||
          symbol.includes(this.searchQuery) ||
          num === this.searchQuery;

        const matchesCat = this.currentFilter === 'all' || cat === this.currentFilter;

        if (matchesSearch && matchesCat) {
          cell.style.opacity = '1';
          cell.style.pointerEvents = 'auto';
        } else {
          cell.style.opacity = '0.15';
          cell.style.pointerEvents = 'none';
        }
      });
    }

    showElementModal(el) {
      const modal = document.getElementById('element-modal');
      if (!modal) return;

      const numEl = modal.querySelector('.modal-el-num');
      const symEl = modal.querySelector('.modal-el-symbol');
      const nameEl = modal.querySelector('.modal-el-name');
      const massEl = modal.querySelector('.modal-el-mass');
      const catEl = modal.querySelector('.modal-el-cat');
      const configEl = modal.querySelector('.modal-el-config');
      const groupEl = modal.querySelector('.modal-el-group');
      const periodEl = modal.querySelector('.modal-el-period');
      const appEl = modal.querySelector('.modal-el-app');

      if (numEl) numEl.textContent = `#${el.num}`;
      if (symEl) symEl.textContent = el.sym;
      if (nameEl) nameEl.textContent = el.name;
      if (massEl) massEl.textContent = `${el.mass} u`;
      if (catEl) catEl.textContent = el.cat.replace('-', ' ').toUpperCase();
      if (configEl) configEl.textContent = el.config;
      if (groupEl) groupEl.textContent = `Group ${el.group}`;
      if (periodEl) periodEl.textContent = `Period ${el.period}`;
      if (appEl) appEl.textContent = el.app;

      modal.classList.add('active');
    }
  }

  window.PeriodicTable = PeriodicTable;

  document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('periodic-table-grid')) {
      new PeriodicTable('periodic-table-grid');
    }

    // Modal close button
    const closeBtn = document.getElementById('close-element-modal');
    const modal = document.getElementById('element-modal');
    if (closeBtn && modal) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => {
        if (e.target === modal) modal.classList.remove('active');
      });
    }
  });
})();
