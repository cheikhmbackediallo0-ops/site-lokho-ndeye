/**
 * ASSOCIATION LOKHO NDEYE - SITE OFFICIEL & EXPÉRIENCE DIGITALE PRIMÉE
 * Moteur d'Interaction Haute-Couture :
 * 1. Curseur Magnétique & Barre de Progression de Scroll
 * 2. Scrollytelling Cinématique en 3 Actes (Hero Section)
 * 3. Générateur de Poussière d'Or (HTML5 Canvas Particles)
 * 4. Synthétiseur Acoustique Kora Africaine (Web Audio API)
 * 5. Visualiseur Dynamique de Bol Solidaire & Calculateur de Don
 * 6. Effets 3D Tilt & Micro-animations de Cartes
 * 7. Modales, Presse-papiers & Formulaire Institutionnel
 */

document.addEventListener('DOMContentLoaded', () => {

  // ==========================================================================
  // MOTEUR D'INTERNATIONALISATION BILINGUE (FR / EN) - INITIALISATION PRÉCOCE
  // ==========================================================================
  let currentLanguage = localStorage.getItem('lokho_ndeye_lang') || 'fr';
  window.currentLanguage = currentLanguage;

  function applyLanguage(lang) {
    if (!window.i18nTranslations || !window.i18nTranslations[lang]) return;
    currentLanguage = lang;
    window.currentLanguage = lang;
    localStorage.setItem('lokho_ndeye_lang', lang);
    document.documentElement.lang = lang;

    // Mise à jour de l'état actif sur tous les boutons de langue
    document.querySelectorAll('.lang-btn').forEach(btn => {
      const btnLang = btn.getAttribute('data-lang');
      const isActive = (btnLang === lang);
      btn.classList.toggle('active', isActive);
      btn.setAttribute('aria-pressed', isActive ? 'true' : 'false');
    });

    const dict = window.i18nTranslations[lang];

    // Mise à jour titre et meta description du document
    if (dict.page_title) {
      document.title = dict.page_title;
    }
    const metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc && dict.meta_description) {
      metaDesc.setAttribute('content', dict.meta_description);
    }

    // Mise à jour data-i18n (texte simple)
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key] !== undefined) {
        el.textContent = dict[key];
      }
    });

    // Mise à jour data-i18n-html (balisage HTML enrichi)
    document.querySelectorAll('[data-i18n-html]').forEach(el => {
      const key = el.getAttribute('data-i18n-html');
      if (dict[key] !== undefined) {
        el.innerHTML = dict[key];
      }
    });

    // Mise à jour placeholders
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
      const key = el.getAttribute('data-i18n-placeholder');
      if (dict[key] !== undefined) {
        el.setAttribute('placeholder', dict[key]);
      }
    });

    // Mise à jour titles
    document.querySelectorAll('[data-i18n-title]').forEach(el => {
      const key = el.getAttribute('data-i18n-title');
      if (dict[key] !== undefined) {
        el.setAttribute('title', dict[key]);
      }
    });

    // Mise à jour aria-labels
    document.querySelectorAll('[data-i18n-aria]').forEach(el => {
      const key = el.getAttribute('data-i18n-aria');
      if (dict[key] !== undefined) {
        el.setAttribute('aria-label', dict[key]);
      }
    });

    // Synchronisation du formulaire de don, de la devise et des calculs
    if (typeof updateCurrencyLabelsOnLangChange === 'function') {
      updateCurrencyLabelsOnLangChange(lang);
    }
    if (typeof updateDonationSummary === 'function') {
      updateDonationSummary();
    }
  }
  window.applyLanguage = applyLanguage;

  function initLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const targetLang = btn.getAttribute('data-lang');
        if (targetLang && targetLang !== currentLanguage) {
          applyLanguage(targetLang);
        }
      });
    });
  }
  window.initLanguageButtons = initLanguageButtons;

  // ==========================================================================
  // 1. CURSEUR MAGNÉTIQUE PERSONNALISÉ (Desktop)
  // ==========================================================================
  const cursorDot = document.getElementById('customCursor');
  const cursorFollower = document.getElementById('customCursorFollower');

  if (cursorDot && cursorFollower && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let followerX = mouseX;
    let followerY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursorDot.style.left = `${mouseX}px`;
      cursorDot.style.top = `${mouseY}px`;
    });

    // Animation fluide avec lerp (Linear Interpolation)
    function animateCursor() {
      followerX += (mouseX - followerX) * 0.15;
      followerY += (mouseY - followerY) * 0.15;
      cursorFollower.style.left = `${followerX}px`;
      cursorFollower.style.top = `${followerY}px`;
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Détection des éléments interactifs pour agrandir le curseur
    const interactiveElements = document.querySelectorAll(
      'a, button, input, textarea, .amount-btn, .freq-btn, .project-card, .domain-card, .impact-card, .stat-pill, .payment-card'
    );

    interactiveElements.forEach(el => {
      el.addEventListener('mouseenter', () => {
        cursorDot.classList.add('hover');
        cursorFollower.classList.add('hover');
      });
      el.addEventListener('mouseleave', () => {
        cursorDot.classList.remove('hover');
        cursorFollower.classList.remove('hover');
      });
    });
  }

  // ==========================================================================
  // 2. NAVIGATION STICKY PERMANENTE & SURLIGNAGE SYNCHRONE DU LIEN ACTIF
  // ==========================================================================
  const header = document.querySelector('.site-header');
  const siteHeader = header;
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');
  const navBackdrop = document.getElementById('navBackdrop');
  const scrollProgressBar = document.getElementById('scrollProgressBar');

  // Mapping des sections du site vers la rubrique correspondante dans le menu
  const SECTION_TO_NAV = {
    'accueil': 'accueil',
    'mission': 'mission',
    'domaines': 'domaines',
    'actions': 'actions',
    'pourquoi-nous-soutenir': 'pourquoi-nous-soutenir',
    'faire-un-don': 'pourquoi-nous-soutenir',
    'contact': 'contact'
  };

  const TRACKED_SECTIONS = [
    'accueil',
    'mission',
    'domaines',
    'actions',
    'pourquoi-nous-soutenir',
    'faire-un-don',
    'contact'
  ];

  let isClickScrolling = false;
  let clickScrollTimer = null;

  function highlightActiveNavLink() {
    if (isClickScrolling) return;

    const navItemLinks = Array.from(document.querySelectorAll('.nav-menu .nav-link'));
    if (!navItemLinks.length) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = header ? header.offsetHeight : 110;
    const scrollBottom = window.innerHeight + scrollY;
    const docHeight = document.documentElement.scrollHeight;

    let targetNavId = 'accueil';

    // 1. Tout en haut du site
    if (scrollY < 120) {
      targetNavId = 'accueil';
    } 
    // 2. Tout en bas du site (Contact)
    else if (scrollBottom >= docHeight - 80) {
      targetNavId = 'contact';
    } 
    // 3. Détection par position relative au viewport (getBoundingClientRect)
    else {
      const focalLine = headerHeight + 60; // Ligne d'observation sous le ruban d'en-tête
      let bestSectionId = null;

      for (const id of TRACKED_SECTIONS) {
        const sec = document.getElementById(id);
        if (!sec) continue;
        const rect = sec.getBoundingClientRect();
        
        // La section couvre la ligne d'observation
        if (rect.top <= focalLine && rect.bottom > focalLine) {
          bestSectionId = id;
          break;
        }
      }

      // Si le curseur est dans une transition, prendre la section la plus proche au-dessus
      if (!bestSectionId) {
        let maxTop = -Infinity;
        for (const id of TRACKED_SECTIONS) {
          const sec = document.getElementById(id);
          if (!sec) continue;
          const rect = sec.getBoundingClientRect();
          if (rect.top <= focalLine && rect.top > maxTop) {
            maxTop = rect.top;
            bestSectionId = id;
          }
        }
      }

      if (bestSectionId && SECTION_TO_NAV[bestSectionId]) {
        targetNavId = SECTION_TO_NAV[bestSectionId];
      }
    }

    // Mise à jour de la classe active sur toutes les rubriques
    navItemLinks.forEach(link => {
      const linkTarget = link.getAttribute('href');
      if (linkTarget === `#${targetNavId}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  function closeMobileMenu() {
    if (navMenu && navMenu.classList.contains('open')) {
      navMenu.classList.remove('open');
      if (mobileToggle) {
        mobileToggle.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
      if (navBackdrop) {
        navBackdrop.classList.remove('active');
      }
      if (siteHeader) {
        siteHeader.classList.remove('mobile-menu-active');
      }
      document.body.style.overflow = '';
    }
  }

  function openMobileMenu() {
    if (navMenu) {
      navMenu.classList.add('open');
      if (mobileToggle) {
        mobileToggle.classList.add('active');
        mobileToggle.setAttribute('aria-expanded', 'true');
      }
      if (navBackdrop) {
        navBackdrop.classList.add('active');
      }
      if (siteHeader) {
        siteHeader.classList.add('mobile-menu-active');
      }
      document.body.style.overflow = 'hidden';
    }
  }

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (navMenu.classList.contains('open')) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    if (navBackdrop) {
      navBackdrop.addEventListener('click', closeMobileMenu);
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeMobileMenu();
    });
  }

  // Clic sur les liens du menu : sélection immédiate et défilement synchronisé
  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      const targetHref = link.getAttribute('href');
      if (targetHref && targetHref.startsWith('#')) {
        const targetId = targetHref.substring(1);
        const targetElement = document.getElementById(targetId);
        if (targetElement) {
          e.preventDefault();

          // Surlignage visuel immédiat et synchrone de la rubrique sélectionnée
          navLinks.forEach(l => {
            l.classList.remove('active');
            l.removeAttribute('aria-current');
          });
          link.classList.add('active');
          link.setAttribute('aria-current', 'page');

          isClickScrolling = true;
          clearTimeout(clickScrollTimer);
          clickScrollTimer = setTimeout(() => {
            isClickScrolling = false;
            highlightActiveNavLink();
          }, 850);

          // Calcul d'offset précis avec l'en-tête compact
          const currentHeader = document.querySelector('.site-header');
          const headerOffset = currentHeader ? (currentHeader.classList.contains('scrolled') ? currentHeader.offsetHeight : 105) : 80;
          const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerOffset - 5);

          window.scrollTo({
            top: Math.max(0, targetPosition),
            behavior: 'smooth'
          });
        }
      }

      closeMobileMenu();
    });
  });

  // ==========================================================================
  // 3. BARRE DE PROGRESSION AU DÉFILEMENT & HEADER COMPACT SYNCHRONISÉ
  // ==========================================================================
  function handleScrollProgress() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (header) {
      if (scrollY > 30) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    highlightActiveNavLink();
  }

  let scrollTicking = false;
  window.addEventListener('scroll', () => {
    if (!scrollTicking) {
      window.requestAnimationFrame(() => {
        handleScrollProgress();
        scrollTicking = false;
      });
      scrollTicking = true;
    }
  }, { passive: true });

  handleScrollProgress();

  // ==========================================================================
  // 4. DIAPORAMA D'ACCUEIL DYNAMIQUE DES ENFANTS DE LA RUE (DÉFILEMENT TOUTES LES 2 SECONDES)
  // ==========================================================================
  const heroSection = document.querySelector('.hero-carousel-section');
  const heroSlideTexts = document.querySelectorAll('.hero-slide-text');
  const heroVisualSlides = document.querySelectorAll('.hero-visual-slide');
  const heroSliderDots = document.querySelectorAll('.hero-slider-dot');
  const heroDotBtns = document.querySelectorAll('.hero-dot-btn');
  const heroThumbCards = document.querySelectorAll('.hero-thumb-card');
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');
  const heroPlayPauseBtn = document.getElementById('heroPlayPauseBtn');
  const heroCurrentSlideNum = document.getElementById('heroCurrentSlideNum');
  const heroStageFrame = document.getElementById('heroMainStageFrame');

  let currentSlideIndex = 0;
  const totalSlides = heroVisualSlides.length || 1;
  const SLIDE_DURATION = 2000; // Exactement 2 secondes par image selon les consignes
  let slideInterval = null;
  let isAutoPlayActive = true;
  let isHovered = false;

  function goToHeroSlide(index) {
    if (totalSlides <= 1) {
      currentSlideIndex = 0;
      heroSlideTexts.forEach(slide => slide.classList.add('active'));
      heroVisualSlides.forEach(slide => slide.classList.add('active'));
      return;
    }

    // Normalisation cyclique de l'index
    currentSlideIndex = (index + totalSlides) % totalSlides;

    // 1. Textes narratifs (maintien permanent si texte unique, synchronisation si multi-textes)
    if (heroSlideTexts.length > 1) {
      heroSlideTexts.forEach((slide, i) => {
        slide.classList.toggle('active', i === currentSlideIndex);
      });
    } else {
      heroSlideTexts.forEach(slide => slide.classList.add('active'));
    }

    // 2. Diapositives visuelles au premier plan (défilent toutes les 2 secondes)
    heroVisualSlides.forEach((slide, i) => {
      slide.classList.toggle('active', i === currentSlideIndex);
    });

    // 3. Puces indicatrices du diaporama
    heroSliderDots.forEach((dot, i) => {
      const isCurrent = (i === currentSlideIndex);
      dot.classList.toggle('active', isCurrent);
      dot.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    // 4. Puces et miniatures de secours si présentes
    heroDotBtns.forEach((btn, i) => {
      const isCurrent = (i === currentSlideIndex);
      btn.classList.toggle('active', isCurrent);
      btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
    });

    heroThumbCards.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentSlideIndex);
    });

    // 5. Compteur de slide
    if (heroCurrentSlideNum) {
      heroCurrentSlideNum.textContent = String(currentSlideIndex + 1).padStart(2, '0');
    }
  }

  function startHeroAutoPlay() {
    if (totalSlides <= 1) return;
    if (slideInterval) clearInterval(slideInterval);
    slideInterval = setInterval(() => {
      if (isAutoPlayActive && !isHovered) {
        goToHeroSlide(currentSlideIndex + 1);
      }
    }, SLIDE_DURATION);
  }

  function stopHeroAutoPlay() {
    if (slideInterval) {
      clearInterval(slideInterval);
      slideInterval = null;
    }
  }

  function resetAutoPlayTimer() {
    if (totalSlides <= 1) return;
    stopHeroAutoPlay();
    startHeroAutoPlay();
  }

  // Écouteurs pour les puces indicatrices
  heroSliderDots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      goToHeroSlide(i);
      resetAutoPlayTimer();
    });
  });

  // Pause au survol de l'image (reprise automatique dès qu'on quitte le cadre)
  if (heroStageFrame) {
    heroStageFrame.addEventListener('mouseenter', () => { isHovered = true; });
    heroStageFrame.addEventListener('mouseleave', () => { isHovered = false; });
  }

  // Écouteurs pour boutons Précédent & Suivant si présents
  if (heroPrevBtn && totalSlides > 1) {
    heroPrevBtn.addEventListener('click', () => {
      goToHeroSlide(currentSlideIndex - 1);
      resetAutoPlayTimer();
    });
  }

  if (heroNextBtn && totalSlides > 1) {
    heroNextBtn.addEventListener('click', () => {
      goToHeroSlide(currentSlideIndex + 1);
      resetAutoPlayTimer();
    });
  }

  // Initialisation et lancement du défilement automatique à 2 secondes
  goToHeroSlide(0);
  startHeroAutoPlay();

  // ==========================================================================
  // 5. CANEVAS DE POUSSIÈRE D'OR & LUMIÈRE INTERACTIVE (HTML5 Canvas)
  // ==========================================================================
  const particleCanvas = document.getElementById('heroParticleCanvas');
  if (particleCanvas) {
    const ctx = particleCanvas.getContext('2d');
    let canvasW = (particleCanvas.width = particleCanvas.offsetWidth);
    let canvasH = (particleCanvas.height = particleCanvas.offsetHeight);

    window.addEventListener('resize', () => {
      canvasW = particleCanvas.width = particleCanvas.offsetWidth;
      canvasH = particleCanvas.height = particleCanvas.offsetHeight;
    });

    // Création des particules
    const particleCount = 45;
    const particles = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvasW,
        y: Math.random() * canvasH,
        radius: Math.random() * 2.2 + 0.8,
        alpha: Math.random() * 0.55 + 0.2,
        speedX: (Math.random() - 0.5) * 0.4,
        speedY: -Math.random() * 0.5 - 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        pulseVal: Math.random() * Math.PI
      });
    }

    let mouseParallaxX = 0;
    let mouseParallaxY = 0;

    window.addEventListener('mousemove', (e) => {
      mouseParallaxX = (e.clientX / window.innerWidth - 0.5) * 15;
      mouseParallaxY = (e.clientY / window.innerHeight - 0.5) * 15;
    });

    function renderParticles() {
      ctx.clearRect(0, 0, canvasW, canvasH);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.speedX;
        p.y += p.speedY;
        p.pulseVal += p.pulseSpeed;

        // Bouclage des coordonnées
        if (p.y < 0) {
          p.y = canvasH + 10;
          p.x = Math.random() * canvasW;
        }
        if (p.x < 0) p.x = canvasW;
        if (p.x > canvasW) p.x = 0;

        const currentAlpha = Math.max(0.1, p.alpha + Math.sin(p.pulseVal) * 0.2);

        ctx.beginPath();
        ctx.arc(p.x + mouseParallaxX, p.y + mouseParallaxY, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(240, 163, 67, ${currentAlpha})`;
        ctx.fill();
      }

      requestAnimationFrame(renderParticles);
    }
    renderParticles();
  }

  // ==========================================================================
  // 6. SYNTHÉTISEUR ACOUSTIQUE KORA AFRICAINE (Web Audio API Authentique)
  //    Généré 100% en code, sans aucun fichier externe requis
  // ==========================================================================
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  let audioCtx = null;
  let isSoundPlaying = false;
  let soundTimer = null;

  // Gamme pentatonique traditionnelle Mandingue / Sénégalaise (Kora en Fa majeur)
  const koraScale = [
    349.23, // F4
    392.00, // G4
    440.00, // A4
    523.25, // C5
    587.33, // D5
    698.46, // F5
    783.99  // G5
  ];

  function playKoraNote(freq, time) {
    if (!audioCtx) return;

    const osc = audioCtx.createOscillator();
    const osc2 = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    // Sonorité boisée et percussive de la calebasse
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2.01, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(2200, time);
    filter.frequency.exponentialRampToValueAtTime(600, time + 0.8);

    // Enveloppe d'attaque pincée puis résonance douce
    gainNode.gain.setValueAtTime(0.0001, time);
    gainNode.gain.linearRampToValueAtTime(0.07, time + 0.02);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, time + 1.6);

    osc.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc.start(time);
    osc2.start(time);
    osc.stop(time + 1.8);
    osc2.stop(time + 1.8);
  }

  function startKoraMelody() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    let noteIndex = 0;
    const pattern = [0, 2, 4, 3, 1, 5, 2, 3, 0, 4, 1, 3];

    function scheduleNotes() {
      if (!isSoundPlaying) return;
      const now = audioCtx.currentTime;
      const freq = koraScale[pattern[noteIndex % pattern.length]];
      playKoraNote(freq, now);

      // Note d'accompagnement basse occasionnelle
      if (noteIndex % 4 === 0) {
        playKoraNote(koraScale[0] / 2, now + 0.05);
      }

      noteIndex++;
      soundTimer = setTimeout(scheduleNotes, 550 + Math.random() * 200);
    }

    scheduleNotes();
  }

  function stopKoraMelody() {
    if (soundTimer) clearTimeout(soundTimer);
    if (audioCtx && audioCtx.state === 'running') {
      audioCtx.suspend();
    }
  }

  if (soundToggleBtn) {
    soundToggleBtn.addEventListener('click', () => {
      isSoundPlaying = !isSoundPlaying;
      const iconOff = soundToggleBtn.querySelector('.sound-icon-off');
      const iconOn = soundToggleBtn.querySelector('.sound-icon-on');
      const lang = window.currentLanguage || 'fr';
      const dict = (window.i18nTranslations && window.i18nTranslations[lang]) || {};

      if (isSoundPlaying) {
        startKoraMelody();
        soundToggleBtn.classList.add('playing');
        if (iconOff) iconOff.style.display = 'none';
        if (iconOn) iconOn.style.display = 'block';
        showToast(dict.toast_sound_on || "Ambiance sonore kora activée");
      } else {
        stopKoraMelody();
        soundToggleBtn.classList.remove('playing');
        if (iconOff) iconOff.style.display = 'block';
        if (iconOn) iconOn.style.display = 'none';
        showToast(dict.toast_sound_off || "Ambiance sonore coupée");
      }
    });
  }

  // ==========================================================================
  // 7. FORMULAIRE DE PROMESSE DE DON SOLIDAIRE & DEVISE ADAPTÉE AU PAYS DU DONATEUR
  // ==========================================================================
  const customAmountInput = document.getElementById('customAmount');
  const amountButtons = document.querySelectorAll('.amount-btn');
  const freqButtons = document.querySelectorAll('.freq-btn');
  const summaryAmount = document.getElementById('summaryAmount');
  const summaryFrequency = document.getElementById('summaryFrequency');
  const impactText = document.getElementById('impactPreviewText');

  let currentAmount = 0;
  let currentFrequency = 'occasionnel';

  // Configuration des devises avec parités réelles et conversion vers le FCFA
  const CURRENCIES = {
    XOF: {
      code: 'XOF',
      name: 'FCFA',
      symbol: 'FCFA',
      flag: '🇸🇳',
      countryNameFr: 'Sénégal / UEMOA (FCFA)',
      countryNameEn: 'Senegal / WAEMU (FCFA)',
      rateToXof: 1,
      minAmount: 500,
      step: 500,
      placeholderFr: 'Indiquez le montant de votre choix (en FCFA)',
      placeholderEn: 'Enter custom amount (in FCFA)'
    },
    EUR: {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      flag: '🇪🇺',
      countryNameFr: 'France / Zone Euro (€)',
      countryNameEn: 'France / Eurozone (€)',
      rateToXof: 655.957,
      minAmount: 5,
      step: 5,
      placeholderFr: 'Indiquez le montant de votre choix (en €)',
      placeholderEn: 'Enter custom amount (in €)'
    },
    USD: {
      code: 'USD',
      name: 'Dollar US',
      symbol: '$',
      flag: '🇺🇸',
      countryNameFr: 'États-Unis / International ($)',
      countryNameEn: 'United States / International ($)',
      rateToXof: 605,
      minAmount: 5,
      step: 5,
      placeholderFr: 'Indiquez le montant de votre choix (en $)',
      placeholderEn: 'Enter custom amount (in $)'
    },
    CAD: {
      code: 'CAD',
      name: 'Dollar Canadien',
      symbol: '$ CA',
      flag: '🇨🇦',
      countryNameFr: 'Canada ($ CA)',
      countryNameEn: 'Canada ($ CA)',
      rateToXof: 445,
      minAmount: 5,
      step: 5,
      placeholderFr: 'Indiquez le montant de votre choix (en $ CA)',
      placeholderEn: 'Enter custom amount (in $ CA)'
    },
    GBP: {
      code: 'GBP',
      name: 'Livre Sterling',
      symbol: '£',
      flag: '🇬🇧',
      countryNameFr: 'Royaume-Uni (£)',
      countryNameEn: 'United Kingdom (£)',
      rateToXof: 780,
      minAmount: 5,
      step: 5,
      placeholderFr: 'Indiquez le montant de votre choix (en £)',
      placeholderEn: 'Enter custom amount (in £)'
    },
    CHF: {
      code: 'CHF',
      name: 'Franc Suisse',
      symbol: 'CHF',
      flag: '🇨🇭',
      countryNameFr: 'Suisse (CHF)',
      countryNameEn: 'Switzerland (CHF)',
      rateToXof: 690,
      minAmount: 5,
      step: 5,
      placeholderFr: 'Indiquez le montant de votre choix (en CHF)',
      placeholderEn: 'Enter custom amount (in CHF)'
    }
  };
  window.CURRENCIES = CURRENCIES;

  let currentCurrency = 'XOF';
  let userManuallySelectedCurrency = false;

  const frequencyDisplayNames = {
    fr: {
      'occasionnel': 'Don occasionnel',
      'ponctuel': 'Don occasionnel',
      'unique': 'Don occasionnel',
      'regulier': 'Don régulier (mensuel)',
      'mensuel': 'Don régulier (mensuel)'
    },
    en: {
      'occasionnel': 'Occasional gift',
      'ponctuel': 'Occasional gift',
      'unique': 'Occasional gift',
      'regulier': 'Regular gift (monthly)',
      'mensuel': 'Regular gift (monthly)'
    }
  };

  function formatMoneyValue(val, locale) {
    const isInt = Number.isInteger(val);
    return val.toLocaleString(locale, {
      minimumFractionDigits: isInt ? 0 : 2,
      maximumFractionDigits: isInt ? 0 : 2
    });
  }
  window.formatMoneyValue = formatMoneyValue;

  function updateCurrencyLabelsOnLangChange(lang) {
    const curr = CURRENCIES[currentCurrency] || CURRENCIES.XOF;
    const isEn = (lang === 'en');
    const nameEl = document.getElementById('detectedCountryName');
    if (nameEl) {
      nameEl.textContent = isEn ? curr.countryNameEn : curr.countryNameFr;
    }
    if (customAmountInput) {
      customAmountInput.setAttribute('placeholder', isEn ? curr.placeholderEn : curr.placeholderFr);
    }
  }
  window.updateCurrencyLabelsOnLangChange = updateCurrencyLabelsOnLangChange;

  function setDonationCurrency(currCode, customLabel = null, isManual = true, customFlag = null) {
    if (!CURRENCIES[currCode]) currCode = 'XOF';
    currentCurrency = currCode;
    const curr = CURRENCIES[currCode];
    const lang = window.currentLanguage || 'fr';
    const isEn = (lang === 'en');

    if (isManual) {
      userManuallySelectedCurrency = true;
      try {
        localStorage.setItem('lokho_donor_currency', currCode);
        if (customLabel) localStorage.setItem('lokho_donor_country_label', customLabel);
      } catch (e) {}
    }

    // Mise à jour visuelle des boutons pilules de devises
    document.querySelectorAll('.currency-pill-btn').forEach(btn => {
      const isSelected = (btn.getAttribute('data-currency') === currCode);
      btn.classList.toggle('active', isSelected);
      btn.setAttribute('aria-checked', isSelected ? 'true' : 'false');
    });

    // Mise à jour de l'icône dans le champ de saisie
    const iconEl = document.getElementById('customAmountIcon');
    if (iconEl) {
      iconEl.textContent = curr.symbol;
    }

    // Mise à jour du champ personnalisé (placeholder, min, step)
    if (customAmountInput) {
      customAmountInput.setAttribute('placeholder', isEn ? curr.placeholderEn : curr.placeholderFr);
      customAmountInput.setAttribute('min', curr.minAmount);
      customAmountInput.setAttribute('step', curr.step);
    }

    // Mise à jour du badge de pays détecté
    const flagEl = document.getElementById('detectedCountryFlag');
    const nameEl = document.getElementById('detectedCountryName');
    if (flagEl) {
      flagEl.textContent = customFlag || curr.flag;
    }
    if (nameEl) {
      nameEl.textContent = customLabel || (isEn ? curr.countryNameEn : curr.countryNameFr);
    }

    updateDonationSummary();
  }
  window.setDonationCurrency = setDonationCurrency;

  function detectDonorCountryAndCurrency() {
    // 1. Préférence enregistrée dans localStorage si existante
    try {
      const saved = localStorage.getItem('lokho_donor_currency');
      if (saved && CURRENCIES[saved]) {
        const rawSavedLabel = localStorage.getItem('lokho_donor_country_label');
        const savedLabel = rawSavedLabel ? String(rawSavedLabel).replace(/[^\p{L}\p{N}\s\-()',.]/gu, '').slice(0, 50) : null;
        setDonationCurrency(saved, savedLabel, false);
        return;
      }
    } catch (e) {}

    // 2. Détection heuristique instantanée 0ms par timezone et langues du navigateur
    let initialCode = 'XOF';
    let initialLabelFr = 'Sénégal / UEMOA (FCFA)';
    let initialLabelEn = 'Senegal / WAEMU (FCFA)';
    let initialFlag = '🇸🇳';

    try {
      const tz = (Intl.DateTimeFormat().resolvedOptions().timeZone || '').toLowerCase();
      const navLangs = (navigator.languages || [navigator.language || '']).map(l => (l || '').toLowerCase());
      const has = (term) => tz.includes(term) || navLangs.some(l => l.includes(term));

      if (has('toronto') || has('montreal') || has('vancouver') || has('edmonton') || has('-ca')) {
        initialCode = 'CAD';
        initialLabelFr = 'Canada ($ CA)';
        initialLabelEn = 'Canada ($ CA)';
        initialFlag = '🇨🇦';
      } else if (has('london') || has('-gb')) {
        initialCode = 'GBP';
        initialLabelFr = 'Royaume-Uni (£)';
        initialLabelEn = 'United Kingdom (£)';
        initialFlag = '🇬🇧';
      } else if (has('zurich') || has('-ch')) {
        initialCode = 'CHF';
        initialLabelFr = 'Suisse (CHF)';
        initialLabelEn = 'Switzerland (CHF)';
        initialFlag = '🇨🇭';
      } else if (
        has('paris') || has('brussels') || has('berlin') || has('rome') ||
        has('madrid') || has('amsterdam') || has('vienna') || has('lisbon') ||
        has('dublin') || has('-fr') || has('-be') || has('-de') || has('-es') || has('-it')
      ) {
        initialCode = 'EUR';
        initialLabelFr = 'France / Zone Euro (€)';
        initialLabelEn = 'France / Eurozone (€)';
        initialFlag = '🇪🇺';
      } else if (
        has('new_york') || has('chicago') || has('los_angeles') ||
        has('denver') || has('phoenix') || has('-us')
      ) {
        initialCode = 'USD';
        initialLabelFr = 'États-Unis / International ($)';
        initialLabelEn = 'United States / International ($)';
        initialFlag = '🇺🇸';
      } else if (
        has('dakar') || has('abidjan') || has('bamako') || has('ouagadougou') ||
        has('lome') || has('cotonou') || has('niamey') || has('-sn') || has('-ci')
      ) {
        initialCode = 'XOF';
        initialLabelFr = 'Sénégal / UEMOA (FCFA)';
        initialLabelEn = 'Senegal / WAEMU (FCFA)';
        initialFlag = '🇸🇳';
      }
    } catch (err) {
      console.warn('Erreur détection heuristique fuseau horaire:', err);
    }

    const currentLang = window.currentLanguage || 'fr';
    setDonationCurrency(
      initialCode,
      currentLang === 'en' ? initialLabelEn : initialLabelFr,
      false,
      initialFlag
    );

    // 3. Affinement asynchrone non-bloquant par géolocalisation IP (GeoJS gratuit HTTPS)
    fetch('https://get.geojs.io/v1/ip/country.json', { cache: 'no-store' })
      .then(res => {
        if (!res.ok) throw new Error('GeoJS non accessible');
        return res.json();
      })
      .then(data => {
        if (userManuallySelectedCurrency) return; // Respect du choix explicite de l'utilisateur
        const cc = (String(data.country || '').replace(/[^A-Za-z]/g, '').slice(0, 2)).toUpperCase();
        const rawName = data.name || data.country || '';
        const countryName = String(rawName).replace(/[^\p{L}\p{N}\s\-()',.]/gu, '').slice(0, 50);
        let targetCurr = 'USD';
        let flag = '🌍';

        const westAfrica = ['SN', 'CI', 'ML', 'BF', 'BJ', 'TG', 'NE', 'GW', 'CM', 'GA', 'CG', 'TD', 'CF', 'GQ'];
        const eurozone = ['FR', 'BE', 'DE', 'ES', 'IT', 'NL', 'PT', 'AT', 'IE', 'FI', 'GR', 'LU', 'MC', 'AD', 'SM', 'VA', 'ME', 'XK', 'SK', 'SI', 'EE', 'LV', 'LT', 'CY', 'MT', 'HR'];

        if (westAfrica.includes(cc)) {
          targetCurr = 'XOF';
          flag = cc === 'SN' ? '🇸🇳' : '🌍';
        } else if (eurozone.includes(cc)) {
          targetCurr = 'EUR';
          flag = cc === 'FR' ? '🇫🇷' : '🇪🇺';
        } else if (cc === 'US') {
          targetCurr = 'USD';
          flag = '🇺🇸';
        } else if (cc === 'CA') {
          targetCurr = 'CAD';
          flag = '🇨🇦';
        } else if (cc === 'GB') {
          targetCurr = 'GBP';
          flag = '🇬🇧';
        } else if (cc === 'CH') {
          targetCurr = 'CHF';
          flag = '🇨🇭';
        }

        const sym = CURRENCIES[targetCurr] ? CURRENCIES[targetCurr].symbol : '';
        const displayLabel = countryName ? `${countryName} (${sym})` : null;
        setDonationCurrency(targetCurr, displayLabel, false, flag);
      })
      .catch(() => {
        // En cas de blocage réseau ou adblocker, l'heuristique timezone reste active
      });
  }

  function updateDonationSummary() {
    const lang = window.currentLanguage || 'fr';
    const dict = (window.i18nTranslations && window.i18nTranslations[lang]) || {};
    const freqDict = frequencyDisplayNames[lang] || frequencyDisplayNames.fr;
    const isEn = (lang === 'en');
    const locale = isEn ? 'en-US' : 'fr-FR';
    const curr = (typeof CURRENCIES !== 'undefined' && CURRENCIES[currentCurrency]) ? CURRENCIES[currentCurrency] : { code: 'XOF', symbol: 'FCFA', rateToXof: 1 };

    // Calcul de l'équivalent local au Sénégal en FCFA
    const amountInXof = Math.round(currentAmount * curr.rateToXof);

    if (summaryAmount) {
      if (currentAmount > 0) {
        const formattedCurr = `${formatMoneyValue(currentAmount, locale)} ${curr.symbol}`;
        if (curr.code === 'XOF') {
          summaryAmount.textContent = `${formatMoneyValue(currentAmount, locale)} FCFA`;
        } else {
          summaryAmount.innerHTML = `<strong>${formattedCurr}</strong> <span style="font-size: 0.85em; opacity: 0.85; font-weight: normal;">(~${formatMoneyValue(amountInXof, locale)} FCFA)</span>`;
        }
      } else {
        summaryAmount.textContent = dict.sum_amount_free || (isEn ? 'Open amount according to your means' : 'Montant libre selon vos capacités');
      }
    }
    if (summaryFrequency) {
      summaryFrequency.textContent = freqDict[currentFrequency] || (isEn ? 'Occasional gift' : 'Don occasionnel');
    }

    if (impactText) {
      if (currentAmount > 0) {
        if (curr.code === 'XOF') {
          impactText.innerHTML = isEn
            ? `<strong>Your solidarity gift:</strong> Your donation of <strong>${formatMoneyValue(currentAmount, locale)} FCFA</strong> goes 100% directly to feeding, healing, clothing, and sheltering street children in Senegal.`
            : `<strong>Votre soutien solidaire :</strong> Votre don de <strong>${formatMoneyValue(currentAmount, locale)} FCFA</strong> sera intégralement utilisé pour nourrir, vêtir, soigner et abriter les enfants de la rue au Sénégal.`;
        } else {
          impactText.innerHTML = isEn
            ? `<strong>Your solidarity gift:</strong> Your donation of <strong>${formatMoneyValue(currentAmount, locale)} ${curr.symbol}</strong> (approx. <strong>${formatMoneyValue(amountInXof, locale)} FCFA</strong>) goes 100% directly to feeding, healing, clothing, and sheltering street children in Senegal.`
            : `<strong>Votre soutien solidaire :</strong> Votre don de <strong>${formatMoneyValue(currentAmount, locale)} ${curr.symbol}</strong> (environ <strong>${formatMoneyValue(amountInXof, locale)} FCFA</strong>) sera intégralement utilisé pour nourrir, vêtir, soigner et abriter les enfants de la rue au Sénégal.`;
        }
      } else {
        impactText.innerHTML = isEn
          ? `<strong>Every donation is precious:</strong> There is no set amount or small gift. Your contribution, according to your heart and means, is entirely dedicated to feeding, clothing, healing, and sheltering street children in Senegal.`
          : `<strong>Chaque don est précieux :</strong> Il n'y a pas de montant imposé ni de petit don. Votre contribution, selon votre cœur et vos capacités, est intégralement dédiée à nourrir, vêtir, soigner et protéger les enfants de la rue au Sénégal.`;
      }
    }
  }

  // Clics sur les pilules de devises
  document.querySelectorAll('.currency-pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const code = btn.getAttribute('data-currency');
      if (code && CURRENCIES[code]) {
        setDonationCurrency(code, null, true);
      }
    });
  });

  // Sélection rapide du montant par bouton de palier (si présent)
  amountButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      amountButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const val = parseFloat(btn.getAttribute('data-amount'));
      if (!isNaN(val) && val > 0) {
        currentAmount = val;
        if (customAmountInput) customAmountInput.value = val;
      }
      updateDonationSummary();
    });
  });

  // Saisie libre du montant par le donateur (sécurisée contre les injections et saisies invalides)
  if (customAmountInput) {
    customAmountInput.addEventListener('keydown', (e) => {
      // Interdire les signes négatifs, positifs et la notation exponentielle
      if (['-', '+', 'e', 'E'].includes(e.key)) {
        e.preventDefault();
      }
    });

    customAmountInput.addEventListener('input', (e) => {
      const rawVal = e.target.value.replace(/[^0-9.]/g, '');
      let val = parseFloat(rawVal);
      amountButtons.forEach(b => b.classList.remove('active'));

      if (!isNaN(val) && val > 0) {
        // Plafond de sécurité à 100 millions pour éviter les débordements numériques
        if (val > 100000000) {
          val = 100000000;
          customAmountInput.value = val;
        }
        currentAmount = val;
        amountButtons.forEach(b => {
          if (parseFloat(b.getAttribute('data-amount')) === val) {
            b.classList.add('active');
          }
        });
      } else {
        currentAmount = 0;
      }
      updateDonationSummary();
    });
  }

  // Fréquence (Occasionnel ou Régulier)
  freqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      freqButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-pressed', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-pressed', 'true');
      currentFrequency = btn.getAttribute('data-frequency') || 'occasionnel';
      updateDonationSummary();
    });
  });

  // Détection initiale de la devise selon le pays du donateur
  detectDonorCountryAndCurrency();

  // ==========================================================================
  // 7bis. GESTIONNAIRE D'ONGLETS DE L'ESPACE DE DON (Formulaire vs Coordonnées officielles)
  // ==========================================================================
  const tabInteractiveDon = document.getElementById('tabInteractiveDon');
  const tabOfficialMethods = document.getElementById('tabOfficialMethods');
  const panelInteractiveDon = document.getElementById('panelInteractiveDon');
  const panelOfficialMethods = document.getElementById('panelOfficialMethods');
  const btnSeeCoords = document.getElementById('btnSeeCoords');
  const btnBackToPledgeForm = document.getElementById('btnBackToPledgeForm');

  function switchDonationTab(target) {
    if (target === 'methods' || target === 'coordonnees') {
      if (tabInteractiveDon) {
        tabInteractiveDon.classList.remove('active');
        tabInteractiveDon.setAttribute('aria-selected', 'false');
      }
      if (tabOfficialMethods) {
        tabOfficialMethods.classList.add('active');
        tabOfficialMethods.setAttribute('aria-selected', 'true');
      }
      if (panelInteractiveDon) {
        panelInteractiveDon.classList.remove('active');
        panelInteractiveDon.style.display = 'none';
      }
      if (panelOfficialMethods) {
        panelOfficialMethods.classList.add('active');
        panelOfficialMethods.style.display = 'block';
      }
    } else {
      if (tabOfficialMethods) {
        tabOfficialMethods.classList.remove('active');
        tabOfficialMethods.setAttribute('aria-selected', 'false');
      }
      if (tabInteractiveDon) {
        tabInteractiveDon.classList.add('active');
        tabInteractiveDon.setAttribute('aria-selected', 'true');
      }
      if (panelOfficialMethods) {
        panelOfficialMethods.classList.remove('active');
        panelOfficialMethods.style.display = 'none';
      }
      if (panelInteractiveDon) {
        panelInteractiveDon.classList.add('active');
        panelInteractiveDon.style.display = 'block';
      }
    }
  }
  window.switchDonationTab = switchDonationTab;

  if (tabInteractiveDon) {
    tabInteractiveDon.addEventListener('click', (e) => {
      e.preventDefault();
      switchDonationTab('interactive');
    });
  }

  if (tabOfficialMethods) {
    tabOfficialMethods.addEventListener('click', (e) => {
      e.preventDefault();
      switchDonationTab('methods');
    });
  }

  if (btnSeeCoords) {
    btnSeeCoords.addEventListener('click', (e) => {
      e.preventDefault();
      switchDonationTab('methods');
      const coordsSec = document.getElementById('coordonnees-officielles') || panelOfficialMethods;
      if (coordsSec) {
        coordsSec.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  if (btnBackToPledgeForm) {
    btnBackToPledgeForm.addEventListener('click', (e) => {
      e.preventDefault();
      switchDonationTab('interactive');
      const tabsHeader = document.querySelector('.donation-tabs-header');
      if (tabsHeader) {
        tabsHeader.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    });
  }

  // Boutons « Soutenir » des cartes projets : basculent sur le formulaire et ciblent le don
  document.querySelectorAll('.project-link-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      switchDonationTab('interactive');
      if (customAmountInput) {
        setTimeout(() => {
          customAmountInput.focus();
        }, 500);
      }
    });
  });

  // ==========================================================================
  // 8. EFFET 3D TILT SUR LES CARTES (Cartes Projets, Domaines & Paiement)
  // ==========================================================================
  if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    const tiltCards = document.querySelectorAll('.project-card, .domain-card, .payment-card');

    tiltCards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const cardX = e.clientX - rect.left;
        const cardY = e.clientY - rect.top;

        const rotateX = ((cardY / rect.height) - 0.5) * -10;
        const rotateY = ((cardX / rect.width) - 0.5) * 10;

        card.style.transform = `perspective(800px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // ==========================================================================
  // 9. COPIE FACILE DANS LE PRESSE-PAPIERS AVEC NOTIFICATION TOAST
  // ==========================================================================
  const toast = document.getElementById('toastNotice');
  const toastText = document.getElementById('toastNoticeText');

  window.showToast = function(message) {
    if (!toast) return;
    if (toastText) toastText.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  };

  window.copyText = function(text, labelOrKey) {
    const lang = window.currentLanguage || 'fr';
    const dict = (window.i18nTranslations && window.i18nTranslations[lang]) || {};
    let label = labelOrKey;
    if (dict[labelOrKey]) {
      label = dict[labelOrKey];
    } else if (labelOrKey === 'Coordonnées du compte' && dict.copy_label_bank) {
      label = dict.copy_label_bank;
    } else if (labelOrKey === 'Informations Wave' && dict.copy_label_wave) {
      label = dict.copy_label_wave;
    }

    const suffix = dict.toast_copied_suffix || (lang === 'en' ? 'copied to clipboard!' : 'copié dans le presse-papiers !');
    const fullMsg = label ? `${label} ${suffix}` : (dict.toast_copied_default || 'Copié dans le presse-papiers avec succès !');

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(() => {
        showToast(fullMsg);
      }).catch(() => {
        fallbackCopyText(text, label);
      });
    } else {
      fallbackCopyText(text, label);
    }
  };

  function fallbackCopyText(text, label) {
    const lang = window.currentLanguage || 'fr';
    const dict = (window.i18nTranslations && window.i18nTranslations[lang]) || {};
    const suffix = dict.toast_copied_suffix || (lang === 'en' ? 'copied to clipboard!' : 'copié dans le presse-papiers !');
    const fullMsg = label ? `${label} ${suffix}` : (dict.toast_copied_default || 'Copié dans le presse-papiers avec succès !');

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      showToast(fullMsg);
    } catch (err) {
      showToast(dict.toast_copy_error || (lang === 'en' ? 'Unable to copy automatically' : 'Impossible de copier automatiquement'));
    }
    document.body.removeChild(textArea);
  }

  // ==========================================================================
  // 10. GESTION DES MODALES ACCESSIBLES & SÉCURISÉES (Statuts, RIB, Reçu Solidaire)
  // ==========================================================================
  const ALLOWED_MODALS = new Set(['statutsModal', 'ribModal', 'waveModal', 'pledgeModal']);

  window.openModal = function(modalId) {
    if (!ALLOWED_MODALS.has(modalId)) return;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
    if (!ALLOWED_MODALS.has(modalId)) return;
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  };

  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        overlay.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.active').forEach(m => {
        m.classList.remove('active');
      });
      document.body.style.overflow = '';
    }
  });

  // ==========================================================================
  // 11. REÇU / ENGAGEMENT SOLIDAIRE EN LIGNE
  // ==========================================================================
  const btnGeneratePledge = document.getElementById('btnGeneratePledge');
  if (btnGeneratePledge) {
    btnGeneratePledge.addEventListener('click', () => {
      const receiptAmount = document.getElementById('receiptModalAmount');
      const receiptFrequency = document.getElementById('receiptModalFreq');
      const receiptRef = document.getElementById('receiptModalRef');
      const receiptDate = document.getElementById('receiptModalDate');

      const lang = window.currentLanguage || 'fr';
      const dict = (window.i18nTranslations && window.i18nTranslations[lang]) || {};
      const isEn = (lang === 'en');
      const refNumber = 'LN-' + Math.floor(100000 + Math.random() * 900000);
      const today = new Date().toLocaleDateString(isEn ? 'en-US' : 'fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });

      if (receiptAmount) {
        const curr = (typeof CURRENCIES !== 'undefined' && CURRENCIES[currentCurrency]) ? CURRENCIES[currentCurrency] : { code: 'XOF', symbol: 'FCFA', rateToXof: 1 };
        const locale = isEn ? 'en-US' : 'fr-FR';
        if (currentAmount > 0) {
          const formattedVal = (typeof formatMoneyValue === 'function') ? formatMoneyValue(currentAmount, locale) : currentAmount.toLocaleString(locale);
          if (curr.code === 'XOF') {
            receiptAmount.textContent = `${formattedVal} FCFA`;
          } else {
            const amountInXof = Math.round(currentAmount * curr.rateToXof);
            const formattedXof = (typeof formatMoneyValue === 'function') ? formatMoneyValue(amountInXof, locale) : amountInXof.toLocaleString(locale);
            receiptAmount.textContent = `${formattedVal} ${curr.symbol} (~${formattedXof} FCFA)`;
          }
        } else {
          receiptAmount.textContent = dict.receipt_free_amount || (isEn ? 'Open amount (according to your means)' : 'Montant libre (selon vos capacités)');
        }
      }
      if (receiptFrequency) {
        const freqDict = frequencyDisplayNames[lang] || frequencyDisplayNames.fr;
        receiptFrequency.textContent = freqDict[currentFrequency] || (isEn ? 'Occasional gift' : 'Don occasionnel');
      }
      if (receiptRef) receiptRef.textContent = refNumber;
      if (receiptDate) receiptDate.textContent = today;

      openModal('pledgeModal');
    });
  }

  // ==========================================================================
  // 12. FORMULAIRE DE CONTACT INSTITUTIONNEL SÉCURISÉ & ANTI-SPAM
  // ==========================================================================
  const contactForm = document.getElementById('institutionalContactForm');
  const contactSuccessMsg = document.getElementById('contactSuccessMsg');
  const contactErrorMsg = document.getElementById('contactErrorMsg');

  // Enregistrement de l'heure de chargement pour détection de robots instantanés
  const formInitTime = Date.now();
  let lastContactSubmitTime = 0;

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const lang = window.currentLanguage || 'fr';
      const dict = (window.i18nTranslations && window.i18nTranslations[lang]) || {};
      const isEn = (lang === 'en');

      if (contactErrorMsg) {
        contactErrorMsg.style.display = 'none';
        contactErrorMsg.textContent = '';
      }

      // 1. Détection bot via champ Honeypot
      const honeypot = contactForm.querySelector('input[name="contact_website_url"]');
      if (honeypot && honeypot.value.trim() !== '') {
        console.warn('Tentative de soumission automatisée bloquée.');
        contactForm.reset();
        return;
      }

      // 2. Détection bot par rapidité surhumaine (< 1.5s après chargement)
      if (Date.now() - formInitTime < 1500) {
        console.warn('Soumission trop rapide (robot suspecté).');
        contactForm.reset();
        return;
      }

      // 3. Protection anti-flood / limitation du débit (Rate Limiting : 15 secondes)
      if (Date.now() - lastContactSubmitTime < 15000) {
        if (contactErrorMsg) {
          contactErrorMsg.textContent = dict.err_rate_limit || (isEn ? "Please wait a few moments before sending another message." : "Veuillez patienter quelques instants avant de soumettre un nouveau message.");
          contactErrorMsg.style.display = 'block';
        }
        return;
      }

      // 4. Extraction et assainissement strict des champs
      const nomInput = document.getElementById('contactNom');
      const emailInput = document.getElementById('contactEmail');
      const objetSelect = document.getElementById('contactObjet');
      const messageInput = document.getElementById('contactMessage');

      const nomVal = (nomInput ? nomInput.value : '').trim().replace(/<[^>]*>/g, '');
      const emailVal = (emailInput ? emailInput.value : '').trim();
      const objetVal = (objetSelect ? objetSelect.value : '').trim();
      const messageVal = (messageInput ? messageInput.value : '').trim().replace(/<[^>]*>/g, '');

      // 5. Validation stricte des entrées utilisateur
      function showValidationError(msg) {
        if (contactErrorMsg) {
          contactErrorMsg.textContent = msg;
          contactErrorMsg.style.display = 'block';
          contactErrorMsg.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }
      }

      if (!nomVal || nomVal.length < 2 || nomVal.length > 100) {
        showValidationError(dict.err_name_required || (isEn ? "Please enter a valid name or organization (at least 2 characters)." : "Veuillez indiquer un nom ou une organisation valide (au moins 2 caractères)."));
        if (nomInput) nomInput.focus();
        return;
      }

      // RFC 5322 regex email stricte
      const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
      if (!emailVal || !emailRegex.test(emailVal) || emailVal.length > 120) {
        showValidationError(dict.err_email_invalid || (isEn ? "Please enter a valid email address." : "Veuillez indiquer une adresse email valide (ex. nom@domaine.com)."));
        if (emailInput) emailInput.focus();
        return;
      }

      const validObjets = ['don', 'partenariat', 'benevolat', 'autre'];
      if (!objetVal || !validObjets.includes(objetVal)) {
        showValidationError(dict.err_subject_required || (isEn ? "Please select the subject of your inquiry." : "Veuillez sélectionner l'objet de votre démarche."));
        if (objetSelect) objetSelect.focus();
        return;
      }

      if (!messageVal || messageVal.length < 10 || messageVal.length > 2500) {
        showValidationError(dict.err_message_short || (isEn ? "Your message is too short (at least 10 characters required)." : "Votre message est trop court (au moins 10 caractères requis)."));
        if (messageInput) messageInput.focus();
        return;
      }

      // 6. Transmission sécurisée
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="16"></circle>
        </svg> ${dict.btn_transmitting || (isEn ? 'Sending in progress...' : 'Transmission en cours...')}
      `;
      submitBtn.disabled = true;

      setTimeout(() => {
        lastContactSubmitTime = Date.now();
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        
        if (contactSuccessMsg) {
          contactSuccessMsg.style.display = 'block';
          setTimeout(() => {
            contactSuccessMsg.style.display = 'none';
          }, 9000);
        }

        showToast(dict.toast_message_sent || (isEn ? "Your solidarity message has been sent successfully!" : "Votre message solidaire a été transmis avec succès !"));
      }, 1000);
    });
  }

  // ==========================================================================
  // 13. ACTIVATION DU SÉLECTEUR DE LANGUE BILINGUE (FR / EN)
  // ==========================================================================
  initLanguageButtons();
  if (currentLanguage !== 'fr') {
    applyLanguage(currentLanguage);
  }

});
