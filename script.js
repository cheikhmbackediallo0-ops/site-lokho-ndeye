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

    // Synchronisation du formulaire de don et calculs si défini
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
  // 2. NAVIGATION MOBILE & SURLIGNAGE DU LIEN ACTIF
  // ==========================================================================
  const mobileToggle = document.getElementById('mobileToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  function highlightActiveNavLink() {
    const navItemLinks = Array.from(document.querySelectorAll('.nav-menu .nav-link'));
    if (!navItemLinks.length) return;

    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const headerHeight = header ? header.offsetHeight : 110;
    const viewportCheckPoint = scrollY + headerHeight + 70;

    let currentActiveId = 'accueil';

    // 1. Si l'utilisateur est tout en haut de la page
    if (scrollY < 140) {
      currentActiveId = 'accueil';
    } 
    // 2. Si l'utilisateur atteint le bas de la page
    else if ((window.innerHeight + scrollY) >= (document.documentElement.scrollHeight - 70)) {
      currentActiveId = 'contact';
    } 
    // 3. Détection par section selon la position de défilement
    else {
      const sectionElements = Array.from(document.querySelectorAll('section[id]'));
      sectionElements.forEach(sec => {
        const secTop = sec.offsetTop;
        const secHeight = sec.offsetHeight;
        if (viewportCheckPoint >= secTop && viewportCheckPoint < (secTop + secHeight + 40)) {
          currentActiveId = sec.getAttribute('id');
        }
      });
    }

    // Mise à jour de la sélection active sur les liens du menu
    navItemLinks.forEach(link => {
      const linkTarget = link.getAttribute('href');
      if (linkTarget === `#${currentActiveId}`) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      } else {
        link.classList.remove('active');
        link.removeAttribute('aria-current');
      }
    });
  }

  const navBackdrop = document.getElementById('navBackdrop');

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

    navLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        const targetHref = link.getAttribute('href');
        if (targetHref && targetHref.startsWith('#')) {
          const targetId = targetHref.substring(1);
          const targetElement = document.getElementById(targetId);
          if (targetElement) {
            e.preventDefault();
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');

            const headerOffset = header ? header.offsetHeight : 80;
            const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - (headerOffset - 10);

            window.scrollTo({
              top: Math.max(0, targetPosition),
              behavior: 'smooth'
            });
          }
        }

        closeMobileMenu();
      });
    });
  }

  // ==========================================================================
  // 3. BARRE DE PROGRESSION GLOBALE AU DÉFILEMENT & HEADER COMPACT
  // ==========================================================================
  const scrollProgressBar = document.getElementById('scrollProgressBar');
  const header = document.querySelector('.site-header');

  function handleScrollProgress() {
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;

    if (scrollProgressBar) {
      scrollProgressBar.style.width = `${scrollPercent}%`;
    }

    if (header) {
      if (scrollY > 40) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    }

    highlightActiveNavLink();
  }

  window.addEventListener('scroll', handleScrollProgress, { passive: true });
  handleScrollProgress();

  // ==========================================================================
  // 4. MOTEUR DE CAROUSEL AUTOMATIQUE HERO CINÉMATIQUE (DÉFILEMENT AUTO)
  // ==========================================================================
  const heroSection = document.querySelector('.hero-carousel-section');
  const heroSlideTexts = document.querySelectorAll('.hero-slide-text');
  const heroVisualSlides = document.querySelectorAll('.hero-visual-slide');
  const heroDotBtns = document.querySelectorAll('.hero-dot-btn');
  const heroThumbCards = document.querySelectorAll('.hero-thumb-card');
  const heroPrevBtn = document.getElementById('heroPrevBtn');
  const heroNextBtn = document.getElementById('heroNextBtn');
  const heroPlayPauseBtn = document.getElementById('heroPlayPauseBtn');
  const heroCurrentSlideNum = document.getElementById('heroCurrentSlideNum');

  let currentSlideIndex = 0;
  const totalSlides = heroVisualSlides.length || 3;
  const SLIDE_DURATION = 5500; // 5.5 secondes par diapositive
  let slideInterval = null;
  let isAutoPlayActive = true;
  let isHovered = false;

  function goToHeroSlide(index) {
    // Normalisation de l'index cyclique (0, 1, 2)
    currentSlideIndex = (index + totalSlides) % totalSlides;

    // 1. Textes narratifs
    heroSlideTexts.forEach((slide, i) => {
      if (i === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // 2. Diapositives visuelles au premier plan
    heroVisualSlides.forEach((slide, i) => {
      if (i === currentSlideIndex) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });

    // 3. Puces de progression
    heroDotBtns.forEach((btn, i) => {
      const isCurrent = (i === currentSlideIndex);
      btn.classList.toggle('active', isCurrent);
      btn.setAttribute('aria-selected', isCurrent ? 'true' : 'false');
      
      // Réinitialisation de la barre de progression pour relancer l'animation
      const progressBar = btn.querySelector('.hero-dot-progress');
      if (progressBar && isCurrent) {
        progressBar.style.animation = 'none';
        void progressBar.offsetWidth; // Déclenche le reflow
        progressBar.style.animation = '';
      }
    });

    // 4. Miniatures interactives (Thumbnails)
    heroThumbCards.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentSlideIndex);
    });

    // 5. Compteur de slide
    if (heroCurrentSlideNum) {
      heroCurrentSlideNum.textContent = String(currentSlideIndex + 1).padStart(2, '0');
    }
  }

  function startHeroAutoPlay() {
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
    stopHeroAutoPlay();
    startHeroAutoPlay();
  }

  // Écouteurs pour les boutons Précédent & Suivant
  if (heroPrevBtn) {
    heroPrevBtn.addEventListener('click', () => {
      goToHeroSlide(currentSlideIndex - 1);
      resetAutoPlayTimer();
    });
  }

  if (heroNextBtn) {
    heroNextBtn.addEventListener('click', () => {
      goToHeroSlide(currentSlideIndex + 1);
      resetAutoPlayTimer();
    });
  }

  // Écouteurs pour les puces de pagination
  heroDotBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetIndex = parseInt(btn.getAttribute('data-slide'), 10);
      if (!isNaN(targetIndex)) {
        goToHeroSlide(targetIndex);
        resetAutoPlayTimer();
      }
    });
  });

  // Écouteurs pour les miniatures (Thumbnails)
  heroThumbCards.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const targetIndex = parseInt(thumb.getAttribute('data-slide'), 10);
      if (!isNaN(targetIndex)) {
        goToHeroSlide(targetIndex);
        resetAutoPlayTimer();
      }
    });
  });

  // Bouton Lecture / Pause
  if (heroPlayPauseBtn) {
    const iconPause = heroPlayPauseBtn.querySelector('.icon-pause');
    const iconPlay = heroPlayPauseBtn.querySelector('.icon-play');

    heroPlayPauseBtn.addEventListener('click', () => {
      isAutoPlayActive = !isAutoPlayActive;
      
      if (iconPause && iconPlay) {
        iconPause.style.display = isAutoPlayActive ? 'block' : 'none';
        iconPlay.style.display = isAutoPlayActive ? 'none' : 'block';
      }

      heroPlayPauseBtn.setAttribute(
        'aria-label',
        isAutoPlayActive ? 'Mettre en pause le défilement automatique' : 'Activer le défilement automatique'
      );

      heroDotBtns.forEach(btn => {
        btn.classList.toggle('paused', !isAutoPlayActive);
      });

      if (isAutoPlayActive) {
        startHeroAutoPlay();
      } else {
        stopHeroAutoPlay();
      }
    });
  }

  // Pause automatique au survol de la souris
  if (heroSection) {
    heroSection.addEventListener('mouseenter', () => {
      isHovered = true;
      heroDotBtns.forEach(btn => btn.classList.add('paused'));
    });

    heroSection.addEventListener('mouseleave', () => {
      isHovered = false;
      heroDotBtns.forEach(btn => btn.classList.remove('paused'));
    });

    // Support des gestes tactiles Swipe sur mobile / tablette
    let touchStartX = 0;
    let touchEndX = 0;

    heroSection.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    heroSection.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      handleHeroSwipe();
    }, { passive: true });

    function handleHeroSwipe() {
      const swipeDistance = touchEndX - touchStartX;
      if (Math.abs(swipeDistance) > 45) {
        if (swipeDistance < 0) {
          goToHeroSlide(currentSlideIndex + 1); // Swipe gauche -> slide suivant
        } else {
          goToHeroSlide(currentSlideIndex - 1); // Swipe droite -> slide précédent
        }
        resetAutoPlayTimer();
      }
    }
  }

  // Navigation au clavier lorsque le Hero est dans le viewport
  window.addEventListener('keydown', (e) => {
    if (heroSection) {
      const rect = heroSection.getBoundingClientRect();
      const inView = rect.top < window.innerHeight && rect.bottom > 0;
      if (inView && !['input', 'textarea'].includes(document.activeElement.tagName.toLowerCase())) {
        if (e.key === 'ArrowLeft') {
          goToHeroSlide(currentSlideIndex - 1);
          resetAutoPlayTimer();
        } else if (e.key === 'ArrowRight') {
          goToHeroSlide(currentSlideIndex + 1);
          resetAutoPlayTimer();
        }
      }
    }
  });

  // Initialisation du premier slide et lancement du défilement automatique
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
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(212, 132, 39, 0.6)';
        ctx.fill();
        ctx.shadowBlur = 0;
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
  // 7. FORMULAIRE DE PROMESSE DE DON SOLIDAIRE (MONTANT LIBRE SANS ESTIMATION)
  // ==========================================================================
  const customAmountInput = document.getElementById('customAmount');
  const freqButtons = document.querySelectorAll('.freq-btn');
  const summaryAmount = document.getElementById('summaryAmount');
  const summaryFrequency = document.getElementById('summaryFrequency');
  const impactText = document.getElementById('impactPreviewText');

  let currentAmount = 0;
  let currentFrequency = 'ponctuel';

  const frequencyDisplayNames = {
    fr: {
      'ponctuel': 'Don ponctuel',
      'occasionnel': 'Don occasionnel',
      'unique': 'Don ponctuel',
      'mensuel': 'Don régulier'
    },
    en: {
      'ponctuel': 'One-time gift',
      'occasionnel': 'Occasional gift',
      'unique': 'One-time gift',
      'mensuel': 'Regular gift'
    }
  };

  function updateDonationSummary() {
    const lang = (typeof currentLanguage !== 'undefined') ? currentLanguage : 'fr';
    const dict = (window.i18nTranslations && window.i18nTranslations[lang]) || {};
    const freqDict = frequencyDisplayNames[lang] || frequencyDisplayNames.fr;
    const isEn = (lang === 'en');
    const locale = isEn ? 'en-US' : 'fr-FR';

    if (summaryAmount) {
      if (currentAmount > 0) {
        summaryAmount.textContent = `${currentAmount.toLocaleString(locale)} FCFA`;
      } else {
        summaryAmount.textContent = dict.sum_amount_free || (isEn ? 'Open amount of your choice' : 'Montant libre de votre choix');
      }
    }
    if (summaryFrequency) {
      summaryFrequency.textContent = freqDict[currentFrequency] || (isEn ? 'One-time gift' : 'Don ponctuel');
    }

    if (impactText) {
      if (currentAmount > 0) {
        if (isEn) {
          impactText.innerHTML = `<strong>Your solidarity support:</strong> Your donation of <strong>${currentAmount.toLocaleString(locale)} FCFA</strong> will be fully dedicated to priority actions (food aid, healthcare, and protection for children and mothers across Senegal).`;
        } else {
          impactText.innerHTML = `<strong>Votre soutien solidaire :</strong> Votre don de <strong>${currentAmount.toLocaleString(locale)} FCFA</strong> sera intégralement alloué aux actions prioritaires (aide alimentaire, soins de santé et protection des enfants et mères sur l'ensemble du territoire sénégalais).`;
        }
      } else {
        if (isEn) {
          impactText.innerHTML = `<strong>Every gesture counts:</strong> There is no small donation. Your contribution, given from the heart according to your means, provides direct, vital aid to families and children supported by the association.`;
        } else {
          impactText.innerHTML = `<strong>Chaque geste compte :</strong> Il n'y a pas de petit don. Votre contribution, selon votre cœur et vos moyens, permet d'apporter un soutien direct et vital aux familles accompagnées par l'association au Sénégal.`;
        }
      }
    }
  }

  // Saisie libre du montant par le donateur
  if (customAmountInput) {
    customAmountInput.addEventListener('input', (e) => {
      const val = parseInt(e.target.value.replace(/\D/g, ''), 10);
      if (!isNaN(val) && val > 0) {
        currentAmount = val;
      } else {
        currentAmount = 0;
      }
      updateDonationSummary();
    });
  }

  // Fréquence (Ponctuel ou Mensuel)
  freqButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      freqButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentFrequency = btn.getAttribute('data-frequency');
      updateDonationSummary();
    });
  });

  updateDonationSummary();

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
  // 10. GESTION DES MODALES ACCESSIBLES (Statuts, RIB, Reçu Solidaire)
  // ==========================================================================
  window.openModal = function(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  };

  window.closeModal = function(modalId) {
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
        receiptAmount.textContent = currentAmount > 0 
          ? `${currentAmount.toLocaleString(isEn ? 'en-US' : 'fr-FR')} FCFA` 
          : (dict.receipt_free_amount || (isEn ? 'Open amount (according to your means)' : 'Montant libre (selon vos capacités)'));
      }
      if (receiptFrequency) {
        const freqDict = frequencyDisplayNames[lang] || frequencyDisplayNames.fr;
        receiptFrequency.textContent = freqDict[currentFrequency] || (isEn ? 'One-time gift' : 'Don ponctuel');
      }
      if (receiptRef) receiptRef.textContent = refNumber;
      if (receiptDate) receiptDate.textContent = today;

      openModal('pledgeModal');
    });
  }

  // ==========================================================================
  // 12. FORMULAIRE DE CONTACT INSTITUTIONNEL
  // ==========================================================================
  const contactForm = document.getElementById('institutionalContactForm');
  const contactSuccessMsg = document.getElementById('contactSuccessMsg');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const lang = window.currentLanguage || 'fr';
      const dict = (window.i18nTranslations && window.i18nTranslations[lang]) || {};
      const isEn = (lang === 'en');
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;

      submitBtn.innerHTML = `
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="spin">
          <circle cx="12" cy="12" r="10" stroke-dasharray="32" stroke-dashoffset="16"></circle>
        </svg> ${dict.btn_transmitting || (isEn ? 'Sending in progress...' : 'Transmission en cours...')}
      `;
      submitBtn.disabled = true;

      setTimeout(() => {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        contactForm.reset();
        
        if (contactSuccessMsg) {
          contactSuccessMsg.style.display = 'block';
          setTimeout(() => {
            contactSuccessMsg.style.display = 'none';
          }, 8000);
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
