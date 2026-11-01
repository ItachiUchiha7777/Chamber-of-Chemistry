/**
 * CHAMBER OF CHEMISTRY — CORE APPLICATION SCRIPT
 * Manages Navigation, Forms, Interactive Quiz, WhatsApp Generators & Modals
 */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initMobileMenu();
    initContactForm();
    initInteractiveQuiz();
    initResourceModals();
    initFAQAccordion();
  });

  /**
   * 1. Navigation Sticky Scroll & Blur
   */
  function initNavbar() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    // Active Link Highlight
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      const href = link.getAttribute('href');
      if (href === currentPath || (currentPath === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
  }

  /**
   * 2. Mobile Hamburger Menu Drawer
   */
  function initMobileMenu() {
    const toggle = document.querySelector('.mobile-toggle');
    const menu = document.querySelector('.nav-menu');
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      menu.classList.toggle('active');
      document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });

    // Close when clicking a link
    menu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        toggle.classList.remove('active');
        menu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  /**
   * 3. Contact & Academic Consultation Form
   */
  function initContactForm() {
    const form = document.getElementById('academic-enquiry-form');
    if (!form) return;

    const nameInput = document.getElementById('enq-name');
    const emailInput = document.getElementById('enq-email');
    const phoneInput = document.getElementById('enq-phone');
    const courseSelect = document.getElementById('enq-course');
    const messageInput = document.getElementById('enq-message');
    const consentInput = document.getElementById('enq-consent');
    const alertBox = document.getElementById('enq-status-alert');
    const whatsappBtn = document.getElementById('enq-whatsapp-direct');

    // Restore draft from localStorage
    try {
      const savedDraft = JSON.parse(localStorage.getItem('coc_enquiry_draft') || '{}');
      if (savedDraft.name && nameInput) nameInput.value = savedDraft.name;
      if (savedDraft.email && emailInput) emailInput.value = savedDraft.email;
      if (savedDraft.phone && phoneInput) phoneInput.value = savedDraft.phone;
      if (savedDraft.course && courseSelect) courseSelect.value = savedDraft.course;
      if (savedDraft.message && messageInput) messageInput.value = savedDraft.message;
    } catch (e) {
      console.warn('Draft restoration error:', e);
    }

    // Auto-save draft on input
    const saveDraft = () => {
      const draft = {
        name: nameInput ? nameInput.value : '',
        email: emailInput ? emailInput.value : '',
        phone: phoneInput ? phoneInput.value : '',
        course: courseSelect ? courseSelect.value : '',
        message: messageInput ? messageInput.value : ''
      };
      try {
        localStorage.setItem('coc_enquiry_draft', JSON.stringify(draft));
      } catch (e) {}
    };

    [nameInput, emailInput, phoneInput, courseSelect, messageInput].forEach(field => {
      if (field) field.addEventListener('input', saveDraft);
    });

    // WhatsApp Direct Button Action
    if (whatsappBtn) {
      whatsappBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const name = nameInput ? nameInput.value.trim() : '';
        const course = courseSelect ? courseSelect.value : '';
        const msg = messageInput ? messageInput.value.trim() : '';

        let text = `Hello Aarushi Ma'am, I am reaching out through Chamber of Chemistry.`;
        if (name) text += ` My name is ${name}.`;
        if (course) text += ` I am interested in: ${course}.`;
        if (msg) text += ` Query: ${msg}`;

        const waUrl = `https://wa.me/918006350167?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
      });
    }

    // Form Submission Validation
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!alertBox) return;
      alertBox.className = 'form-status-alert';
      alertBox.style.display = 'none';

      const name = nameInput.value.trim();
      const email = emailInput.value.trim();
      const phone = phoneInput.value.trim();
      const course = courseSelect.value;
      const message = messageInput.value.trim();
      const consent = consentInput.checked;

      // Indian 10-digit phone regex
      const phoneRegex = /^[6-9]\d{9}$/;
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      let errorMsg = '';
      if (!name || name.length < 2) {
        errorMsg = 'Please enter your full name.';
      } else if (!email || !emailRegex.test(email)) {
        errorMsg = 'Please enter a valid email address.';
      } else if (!phone || !phoneRegex.test(phone.replace(/\D/g, ''))) {
        errorMsg = 'Please enter a valid 10-digit mobile number.';
      } else if (!course) {
        errorMsg = 'Please select a course or target examination.';
      } else if (!consent) {
        errorMsg = 'Please agree to allow Chamber of Chemistry to contact you regarding your enquiry.';
      }

      if (errorMsg) {
        alertBox.textContent = errorMsg;
        alertBox.classList.add('error');
        alertBox.style.display = 'block';
        alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
        return;
      }

      // Success State
      const refId = 'COC-' + Math.floor(100000 + Math.random() * 900000);
      alertBox.innerHTML = `
        <strong>Thank you, ${name}!</strong> Your academic enquiry has been received successfully.
        <br><span style="font-size: 0.85em; opacity: 0.9;">Enquiry Reference ID: <strong>${refId}</strong>. Our academic team will connect with you within 24 hours.</span>
      `;
      alertBox.classList.add('success');
      alertBox.style.display = 'block';

      // Clear draft & reset
      try {
        localStorage.removeItem('coc_enquiry_draft');
      } catch (e) {}
      form.reset();
      alertBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  /**
   * 4. Interactive Chemistry MCQ Practice Quiz
   */
  function initInteractiveQuiz() {
    const quizContainer = document.getElementById('interactive-chem-quiz');
    if (!quizContainer) return;

    const QUESTIONS = [
      {
        id: 1,
        topic: 'Organic Chemistry (GOC)',
        question: 'Which of the following carbocations is the most stable and why?',
        options: [
          'A) Methyl carbocation (⁺CH₃)',
          'B) Ethyl carbocation (CH₃–⁺CH₂)',
          'C) Isopropyl carbocation ((CH₃)₂⁺CH)',
          'D) Benzyl carbocation (C₆H₅–⁺CH₂)'
        ],
        correct: 3,
        explanation: 'The Benzyl carbocation (C₆H₅–⁺CH₂) is the most stable because the positive charge on the benzylic carbon is extensively delocalised into the aromatic ring across 4 resonance contributing structures.'
      },
      {
        id: 2,
        topic: 'Chemical Bonding & Structure',
        question: 'What is the geometry and hybridisation of the central Xenon atom in XeF₄?',
        options: [
          'A) Tetrahedral, sp³',
          'B) Square Planar, sp³d²',
          'C) Octahedral, sp³d²',
          'D) Trigonal Bipyramidal, sp³d'
        ],
        correct: 1,
        explanation: 'Xenon in XeF₄ has 8 valence electrons + 4 bonding electrons = 12 electrons (6 electron pairs: 4 bond pairs and 2 lone pairs). The steric number is 6, giving sp³d² hybridisation with an octahedral electron geometry and a Square Planar molecular geometry.'
      },
      {
        id: 3,
        topic: 'NEET & JEE Coordination Chemistry',
        question: 'Which ligand among the following is a strong field ligand according to the Spectrochemical Series?',
        options: [
          'A) I⁻ (Iodide)',
          'B) Cl⁻ (Chloride)',
          'C) H₂O (Aqua)',
          'D) CN⁻ (Cyanide)'
        ],
        correct: 3,
        explanation: 'CN⁻ is a carbon-donor π-acceptor ligand positioned at the high-energy end of the Spectrochemical Series, causing high crystal field splitting (Δₒ) and electron pairing.'
      }
    ];

    let currentQIdx = 0;

    const renderQuestion = () => {
      const q = QUESTIONS[currentQIdx];
      quizContainer.innerHTML = `
        <div style="background: var(--color-white); border: 1px solid var(--border-light); border-radius: var(--radius-xl); padding: 32px; box-shadow: var(--shadow-md);">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <span class="badge-tag">${q.topic}</span>
            <span style="font-size: 0.85rem; font-weight: 700; color: var(--color-academic-blue);">Question ${currentQIdx + 1} of ${QUESTIONS.length}</span>
          </div>
          <h3 style="font-size: 1.2rem; font-weight: 800; color: var(--color-navy); margin-bottom: 24px; line-height: 1.4;">${q.question}</h3>
          <div class="quiz-options-list" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
            ${q.options.map((opt, i) => `
              <button class="quiz-opt-btn" data-opt="${i}" style="text-align: left; padding: 14px 18px; border-radius: var(--radius-md); border: 1.5px solid var(--border-light); background: var(--color-soft-grey); font-size: 0.95rem; font-weight: 600; color: var(--color-navy); transition: all 0.2s ease;">
                ${opt}
              </button>
            `).join('')}
          </div>
          <div class="quiz-explanation-box" style="display: none; padding: 18px; border-radius: var(--radius-md); background: #F0FDF4; border: 1px solid #BBF7D0; margin-bottom: 20px;">
            <h4 style="font-size: 0.875rem; font-weight: 800; color: #166534; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Conceptual Explanation:</h4>
            <p style="font-size: 0.92rem; color: #15803D; line-height: 1.6;">${q.explanation}</p>
          </div>
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <button id="quiz-prev-btn" class="btn btn-outline-blue btn-sm" ${currentQIdx === 0 ? 'disabled style="opacity: 0.5; pointer-events: none;"' : ''}>← Previous</button>
            <button id="quiz-next-btn" class="btn btn-navy btn-sm" ${currentQIdx === QUESTIONS.length - 1 ? 'disabled style="opacity: 0.5; pointer-events: none;"' : ''}>Next Question →</button>
          </div>
        </div>
      `;

      // Option click handler
      const optBtns = quizContainer.querySelectorAll('.quiz-opt-btn');
      const expBox = quizContainer.querySelector('.quiz-explanation-box');

      optBtns.forEach(btn => {
        btn.addEventListener('click', () => {
          const selected = parseInt(btn.getAttribute('data-opt'), 10);
          optBtns.forEach((b, idx) => {
            b.style.pointerEvents = 'none';
            if (idx === q.correct) {
              b.style.backgroundColor = '#DCFCE7';
              b.style.borderColor = '#22C55E';
              b.style.color = '#15803D';
            } else if (idx === selected) {
              b.style.backgroundColor = '#FEE2E2';
              b.style.borderColor = '#EF4444';
              b.style.color = '#B91C1C';
            }
          });
          if (expBox) expBox.style.display = 'block';
        });
      });

      // Navigation
      const prevBtn = quizContainer.querySelector('#quiz-prev-btn');
      const nextBtn = quizContainer.querySelector('#quiz-next-btn');

      if (prevBtn) {
        prevBtn.addEventListener('click', () => {
          if (currentQIdx > 0) {
            currentQIdx--;
            renderQuestion();
          }
        });
      }
      if (nextBtn) {
        nextBtn.addEventListener('click', () => {
          if (currentQIdx < QUESTIONS.length - 1) {
            currentQIdx++;
            renderQuestion();
          }
        });
      }
    };

    renderQuestion();
  }

  /**
   * 5. Resource Preview & Download Modal
   */
  function initResourceModals() {
    const previewBtns = document.querySelectorAll('.resource-preview-btn');
    const modal = document.getElementById('resource-preview-modal');
    if (!modal) return;

    const titleEl = modal.querySelector('.modal-res-title');
    const bodyEl = modal.querySelector('.modal-res-body');
    const closeBtn = modal.querySelector('.modal-close-btn');

    const RESOURCE_CONTENT = {
      goc: {
        title: 'Organic Chemistry: General Organic Chemistry (GOC) Summary',
        content: `
          <h4 style="color: var(--color-navy); margin-bottom: 8px;">Key Concepts Covered:</h4>
          <ul style="list-style: disc; padding-left: 20px; line-height: 1.8; color: var(--text-secondary); margin-bottom: 16px;">
            <li><strong>Inductive Effect (+I / -I):</strong> Permanent polarization of σ-bonds due to electronegativity differentials. Operates up to 3 bonds.</li>
            <li><strong>Resonance (+R / -R):</strong> Delocalisation of π-electrons across conjugated systems. Increases molecule thermodynamic stability.</li>
            <li><strong>Hyperconjugation (No-bond Resonance):</strong> Interaction of electrons in σ-bonds (usually C–H) with adjacent empty or partially filled p-orbital. Direct relationship with α-hydrogens.</li>
            <li><strong>Aromaticity (Hückel's Rule):</strong> Planar, cyclic, conjugated ring systems containing (4n + 2) π-electrons.</li>
            <li><strong>Carbocation Stability Order:</strong> 3° > 2° > 1° > Methyl (stabilized by hyperconjugation and inductive effect; further stabilized by resonance in allylic/benzylic systems).</li>
          </ul>
          <p style="font-size: 0.9rem; color: var(--text-muted); font-style: italic;">Authored by Aarushi Kasturiwal, M.Sc. Organic Chemistry (Gold Medallist).</p>
        `
      },
      thermo: {
        title: 'Physical Chemistry: Thermodynamics Formula Sheet',
        content: `
          <h4 style="color: var(--color-navy); margin-bottom: 8px;">Fundamental Equations:</h4>
          <div style="background: var(--color-soft-grey); padding: 16px; border-radius: var(--radius-md); font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.9; margin-bottom: 16px;">
            • ΔU = q + w (First Law of Thermodynamics)<br>
            • w = -P_ext × ΔV (Irreversible expansion)<br>
            • w_rev = -2.303 nRT log(V₂ / V₁) (Isothermal reversible expansion)<br>
            • ΔH = ΔU + Δn_g RT<br>
            • ΔS = q_rev / T<br>
            • ΔG = ΔH - TΔS (Gibbs Free Energy criterion for spontaneity: ΔG &lt; 0)
          </div>
          <p style="font-size: 0.9rem; color: var(--text-muted); font-style: italic;">Prepared for Class 11, NEET & JEE aspirants.</p>
        `
      },
      coordination: {
        title: 'Inorganic Chemistry: Coordination Compounds Master Chart',
        content: `
          <h4 style="color: var(--color-navy); margin-bottom: 8px;">Crystal Field Theory (CFT) & Isomerism:</h4>
          <ul style="list-style: disc; padding-left: 20px; line-height: 1.8; color: var(--text-secondary); margin-bottom: 16px;">
            <li><strong>Octahedral Splitting:</strong> Degenerate d-orbitals split into t₂g (lower energy, d_xy, d_yz, d_zx) and e_g (higher energy, d_x²-y², d_z²).</li>
            <li><strong>Spectrochemical Series:</strong> I⁻ &lt; Br⁻ &lt; S²⁻ &lt; Cl⁻ &lt; NO₃⁻ &lt; F⁻ &lt; OH⁻ &lt; H₂O &lt; NH₃ &lt; en &lt; NO₂⁻ &lt; CN⁻ &lt; CO.</li>
            <li><strong>High-spin vs Low-spin:</strong> When Δₒ &gt; P (Pairing Energy), strong field ligands form low-spin diamagnetic complexes. When Δₒ &lt; P, high-spin complexes form.</li>
          </ul>
        `
      }
    };

    previewBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const key = btn.getAttribute('data-res-key') || 'goc';
        const res = RESOURCE_CONTENT[key] || RESOURCE_CONTENT.goc;
        if (titleEl) titleEl.textContent = res.title;
        if (bodyEl) bodyEl.innerHTML = res.content;
        modal.classList.add('active');
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    }
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  /**
   * 6. FAQ Accordion
   */
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll('.faq-accordion-item');
    faqItems.forEach(item => {
      const header = item.querySelector('.faq-question-btn');
      if (header) {
        header.addEventListener('click', () => {
          const isActive = item.classList.contains('active');
          faqItems.forEach(i => i.classList.remove('active'));
          if (!isActive) item.classList.add('active');
        });
      }
    });
  }
})();
