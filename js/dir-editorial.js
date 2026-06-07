// ════════════════════════════════════════════════════════════════════════════
// Direction A · Editorial — Corvee Paper landing
// ════════════════════════════════════════════════════════════════════════════
// shared.jsx already declared `useState`, `useEffect`, `useRef`. Babel
// standalone scripts share the global scope, so we can use them here too.

// All color tokens go through CSS vars so dark mode can swap them in.
const E_BG = 'var(--cp-bg)';
const E_BG_2 = 'var(--cp-bg-2)'; // section alt background
const E_INK = 'var(--cp-ink)';
const E_INK_SOFT = 'var(--cp-ink-soft)';
const E_INK_2 = 'var(--cp-ink-2)'; // softer, for placeholders
const E_LINE = 'var(--cp-line)';
const E_TERRA = 'var(--cp-terra)';
const E_TERRA_SOFT = 'var(--cp-terra-soft)';
const E_CARD = 'var(--cp-card)';
const E_CARD_BG = 'var(--cp-card-bg)';
const E_NAV_BG = 'var(--cp-nav-bg)';
// Inverted ("dark block") set
const E_INV_BG = 'var(--cp-inv-bg)';
const E_INV_INK = 'var(--cp-inv-ink)';
const E_INV_INK_SOFT = 'var(--cp-inv-ink-soft)';
const E_INV_LINE = 'var(--cp-inv-line)';
const E_INV_CARD = 'var(--cp-inv-card)';

// ─── one-time theme + keyframes injection ────────────────────────────────────
function ensureEditorialCSS() {
  if (document.getElementById('cp-editorial-css')) return;
  const s = document.createElement('style');
  s.id = 'cp-editorial-css';
  s.textContent = `
.cp-theme.light {
  --cp-bg:        #e7e8ea;
  --cp-bg-2:      #d8dbdf;
  --cp-ink:       #192230;
  --cp-ink-soft:  rgba(25,34,48,.62);
  --cp-ink-2:     rgba(25,34,48,.42);
  --cp-line:      rgba(25,34,48,.14);
  --cp-terra:     #365b86;
  --cp-terra-soft:#d6e0ec;
  --cp-card-bg:   #f6f7f9;
  --cp-card:      rgba(25,34,48,.05);
  --cp-nav-bg:    rgba(231,232,234,.85);
  --cp-inv-bg:        #192230;
  --cp-inv-ink:       #e7e8ea;
  --cp-inv-ink-soft:  rgba(231,232,234,.60);
  --cp-inv-line:      rgba(231,232,234,.18);
  --cp-inv-card:      rgba(231,232,234,.05);
}
.cp-theme.dark {
  --cp-bg:        #11161f;
  --cp-bg-2:      #18202c;
  --cp-ink:       #e7e8ea;
  --cp-ink-soft:  rgba(231,232,234,.60);
  --cp-ink-2:     rgba(231,232,234,.40);
  --cp-line:      rgba(231,232,234,.14);
  --cp-terra:     #6b9bd0;
  --cp-terra-soft:rgba(107,155,208,.18);
  --cp-card-bg:   #18202c;
  --cp-card:      rgba(231,232,234,.05);
  --cp-nav-bg:    rgba(17,22,31,.90);
  --cp-inv-bg:        #e7e8ea;
  --cp-inv-ink:       #192230;
  --cp-inv-ink-soft:  rgba(25,34,48,.60);
  --cp-inv-line:      rgba(25,34,48,.14);
  --cp-inv-card:      rgba(25,34,48,.05);
}
.cp-theme { transition: background-color .4s, color .4s; }
.cp-theme * { transition: background-color .35s, color .35s, border-color .35s, fill .35s; }

@keyframes cp-blob1 { 0%,100% { transform: translate3d(0,0,0) scale(1) } 50% { transform: translate3d(120px,-60px,0) scale(1.15) } }
@keyframes cp-blob2 { 0%,100% { transform: translate3d(0,0,0) scale(1) } 50% { transform: translate3d(-90px,80px,0) scale(.85) } }
@keyframes cp-blob3 { 0%,100% { transform: translate3d(0,0,0) scale(1) } 50% { transform: translate3d(80px,40px,0) scale(1.1) } }
@keyframes cp-pop { 0% { transform: scale(.4); opacity: 0 } 60% { transform: scale(1.06); opacity: 1 } 100% { transform: scale(1) } }
@keyframes cp-confetti { from { transform: translateY(0) rotate(0) } to { transform: translateY(700px) rotate(720deg) } }
@keyframes cp-ticker { from { transform: translateX(0) } to { transform: translateX(-50%) } }
@keyframes cp-success-in { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }

/* ─── Entry animations (IntersectionObserver toggles .cp-in) ───────────── */
.cp-reveal {
  opacity: 0; transform: translateY(28px);
  transition: opacity .9s cubic-bezier(.2,.7,.3,1), transform .9s cubic-bezier(.2,.7,.3,1);
  transition-delay: var(--cp-d, 0ms);
  will-change: opacity, transform;
}
.cp-reveal.cp-in { opacity: 1; transform: translateY(0); }
/* Variant: clip-path reveal — wipes up. Use on big editorial titles. */
.cp-wipe {
  opacity: 0;
  clip-path: inset(0 0 100% 0);
  transition: opacity .8s ease, clip-path 1.1s cubic-bezier(.2,.7,.3,1);
  transition-delay: var(--cp-d, 0ms);
}
.cp-wipe.cp-in { opacity: 1; clip-path: inset(0 0 0 0); }
/* Variant: scale-in for cards */
.cp-pop {
  opacity: 0; transform: scale(.96) translateY(20px);
  transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.3,1);
  transition-delay: var(--cp-d, 0ms);
}
.cp-pop.cp-in { opacity: 1; transform: scale(1) translateY(0); }
/* Variant: slide-in from sides */
.cp-slide-l {
  opacity: 0; transform: translateX(-40px);
  transition: opacity .8s ease, transform .9s cubic-bezier(.2,.7,.3,1);
  transition-delay: var(--cp-d, 0ms);
}
.cp-slide-l.cp-in { opacity: 1; transform: translateX(0); }
.cp-slide-r {
  opacity: 0; transform: translateX(40px);
  transition: opacity .8s ease, transform .9s cubic-bezier(.2,.7,.3,1);
  transition-delay: var(--cp-d, 0ms);
}
.cp-slide-r.cp-in { opacity: 1; transform: translateX(0); }

@media (prefers-reduced-motion: reduce) {
  .cp-reveal, .cp-wipe, .cp-pop, .cp-slide-l, .cp-slide-r {
    opacity: 1 !important; transform: none !important; clip-path: none !important;
  }
}

.cp-faq summary { list-style: none; cursor: pointer; }
.cp-faq summary::-webkit-details-marker { display: none; }
.cp-faq details[open] .cp-faq-plus { transform: rotate(45deg); }
.cp-faq-plus { transition: transform .3s ease; display: inline-block; }
`;
  document.head.appendChild(s);
}

// ─── Animated hero background — three slow warm blobs + grain ───────────────
function HeroBG({
  dark
}) {
  const a = dark ? '#ed6a3f' : '#365b86';
  const b = dark ? '#caa05d' : '#F4D5C4';
  const c = dark ? '#7a3b22' : '#EDE7D6';
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": true,
    style: {
      position: 'absolute',
      inset: 0,
      overflow: 'hidden',
      pointerEvents: 'none',
      zIndex: 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '-10%',
      top: '-20%',
      width: 720,
      height: 720,
      background: `radial-gradient(circle, ${a}55 0%, transparent 60%)`,
      filter: 'blur(40px)',
      animation: 'cp-blob1 18s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      right: '-5%',
      top: '10%',
      width: 620,
      height: 620,
      background: `radial-gradient(circle, ${b}88 0%, transparent 65%)`,
      filter: 'blur(50px)',
      animation: 'cp-blob2 22s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      left: '30%',
      bottom: '-20%',
      width: 580,
      height: 580,
      background: `radial-gradient(circle, ${c}88 0%, transparent 60%)`,
      filter: 'blur(50px)',
      animation: 'cp-blob3 26s ease-in-out infinite'
    }
  }), /*#__PURE__*/React.createElement("svg", {
    style: {
      position: 'absolute',
      inset: 0,
      width: '100%',
      height: '100%',
      opacity: dark ? .12 : .06,
      mixBlendMode: 'overlay'
    }
  }, /*#__PURE__*/React.createElement("filter", {
    id: "cp-noise"
  }, /*#__PURE__*/React.createElement("feTurbulence", {
    type: "fractalNoise",
    baseFrequency: "0.9",
    numOctaves: "2",
    stitchTiles: "stitch"
  })), /*#__PURE__*/React.createElement("rect", {
    width: "100%",
    height: "100%",
    filter: "url(#cp-noise)"
  })));
}

// ─── Custom cursor — terracotta dot + ring, label on hot elements ───────────
function CustomCursor({
  wrapRef
}) {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const raf = useRef(0);
  const state = useRef({
    x: -200,
    y: -200,
    tx: 0,
    ty: 0
  });
  const [labelText, setLabelText] = useState('');
  useEffect(() => {
    const tick = () => {
      const s = state.current;
      s.x += (s.tx - s.x) * 0.22;
      s.y += (s.ty - s.y) * 0.22;
      if (dotRef.current) dotRef.current.style.transform = `translate3d(${s.tx}px, ${s.ty}px, 0)`;
      if (ringRef.current) ringRef.current.style.transform = `translate3d(${s.x}px, ${s.y}px, 0)`;
      raf.current = requestAnimationFrame(tick);
    };
    const onMove = e => {
      const r = wrapRef.current?.getBoundingClientRect();
      if (!r) return;
      const sx = r.width / wrapRef.current.offsetWidth || 1;
      const sy = r.height / wrapRef.current.offsetHeight || 1;
      state.current.tx = (e.clientX - r.left) / sx;
      state.current.ty = (e.clientY - r.top) / sy;
    };
    document.addEventListener('mousemove', onMove);
    raf.current = requestAnimationFrame(tick);
    const onOver = e => {
      const hot = e.target.closest('[data-cp-hot]');
      if (hot) {
        setLabelText(hot.getAttribute('data-cp-label') || '');
        if (ringRef.current) {
          ringRef.current.style.width = '64px';
          ringRef.current.style.height = '64px';
          ringRef.current.style.opacity = '1';
        }
      }
    };
    const onOut = e => {
      const hot = e.target.closest('[data-cp-hot]');
      if (hot && !e.relatedTarget?.closest?.('[data-cp-hot]')) {
        setLabelText('');
        if (ringRef.current) {
          ringRef.current.style.width = '28px';
          ringRef.current.style.height = '28px';
          ringRef.current.style.opacity = '.5';
        }
      }
    };
    document.addEventListener('mouseover', onOver);
    document.addEventListener('mouseout', onOut);
    return () => {
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseover', onOver);
      document.removeEventListener('mouseout', onOut);
      cancelAnimationFrame(raf.current);
    };
  }, [wrapRef]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    ref: ringRef,
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 28,
      height: 28,
      borderRadius: 99,
      border: `1.5px solid ${E_TERRA}`,
      marginLeft: -14,
      marginTop: -14,
      pointerEvents: 'none',
      zIndex: 9998,
      opacity: .5,
      transition: 'width .3s cubic-bezier(.2,.7,.3,1), height .3s cubic-bezier(.2,.7,.3,1), opacity .25s',
      mixBlendMode: 'difference'
    }
  }), /*#__PURE__*/React.createElement("div", {
    ref: dotRef,
    style: {
      position: 'absolute',
      left: 0,
      top: 0,
      width: 8,
      height: 8,
      borderRadius: 99,
      background: E_TERRA,
      marginLeft: -4,
      marginTop: -4,
      pointerEvents: 'none',
      zIndex: 9999
    }
  }, labelText && /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      left: 18,
      top: -6,
      padding: '4px 10px',
      borderRadius: 99,
      background: E_TERRA,
      color: '#fff',
      fontFamily: 'Geist Mono, monospace',
      fontSize: 10,
      letterSpacing: '.1em',
      whiteSpace: 'nowrap',
      animation: 'cp-pop .25s cubic-bezier(.2,.7,.3,1)'
    }
  }, labelText)));
}

// ─── Logo (wordmark + paper-fold glyph) ─────────────────────────────────────
function Logo({
  onClick,
  color = E_INK,
  terra = E_TERRA
}) {
  return /*#__PURE__*/React.createElement("button", {
    onClick: onClick,
    "aria-label": "Corvee Paper \u2014 accueil",
    "data-cp-hot": true,
    "data-cp-label": "\u21BB click me",
    style: {
      background: 'none',
      border: 0,
      padding: 0,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      color,
      font: 'inherit'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "34",
    height: "34",
    viewBox: "0 0 36 36",
    fill: "none",
    style: {
      flexShrink: 0
    },
    "aria-hidden": "true",
    focusable: "false"
  }, /*#__PURE__*/React.createElement("rect", {
    x: "2.4",
    y: "2.4",
    width: "31.2",
    height: "31.2",
    rx: "10.5",
    fill: "none",
    stroke: color,
    strokeWidth: "1.7"
  }), /*#__PURE__*/React.createElement("text", {
    x: "14",
    y: "25",
    textAnchor: "middle",
    fontFamily: "Spectral, serif",
    fontSize: "23.5",
    fill: color,
    fontStyle: "italic"
  }, "c"), /*#__PURE__*/React.createElement("circle", {
    cx: "24.6",
    cy: "22.8",
    r: "3.1",
    fill: terra
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Spectral, serif',
      fontSize: 26,
      letterSpacing: '-.01em'
    }
  }, "Corvee Paper", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: terra
    }
  }, ".")));
}

// ─── Easter egg confetti overlay ─────────────────────────────────────────────
function EasterEgg({
  open,
  onClose
}) {
  if (!open) return null;
  const bits = Array.from({
    length: 24
  }, (_, i) => i);
  const colors = ['#365b86', '#F4D5C4', '#EDE7D6', '#9B9690'];
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      zIndex: 10001,
      background: 'rgba(15,11,5,.78)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer'
    }
  }, bits.map(i => /*#__PURE__*/React.createElement("span", {
    key: i,
    style: {
      position: 'absolute',
      left: `${i * 137 % 100}%`,
      top: -30,
      width: 10,
      height: 14,
      background: colors[i % colors.length],
      animation: `cp-confetti ${2 + i % 5 * 0.3}s linear ${i % 10 * 0.08}s infinite`,
      transform: `rotate(${i * 23}deg)`
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      textAlign: 'center',
      color: '#e7e8ea',
      maxWidth: 560,
      padding: 32,
      animation: 'cp-pop .4s cubic-bezier(.2,.7,.3,1)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      letterSpacing: '.2em',
      opacity: .6,
      marginBottom: 20
    }
  }, "\u21B3 FEUILLET CACH\xC9 \xB7 7 CLICS"), /*#__PURE__*/React.createElement("h2", {
    style: {
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 72,
      lineHeight: 1,
      margin: 0,
      letterSpacing: '-.02em'
    }
  }, "Bien vu.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: '#ed6a3f'
    }
  }, "Curieux"), ", c\u2019est bon signe."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 28,
      fontFamily: 'Spectral, serif',
      fontStyle: 'italic',
      fontSize: 22,
      opacity: .85
    }
  }, "Si vous lisez ce message, vous travaillez probablement aussi soigneusement que nous. On va bien s\u2019entendre."), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 24,
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      letterSpacing: '.1em',
      opacity: .5
    }
  }, "\u21B3 Cliquez n\u2019importe o\xF9 pour fermer")));
}

// ─── Theme toggle button ────────────────────────────────────────────────────
function ThemeToggle({
  theme,
  setTheme
}) {
  const isDark = theme === 'dark';
  return /*#__PURE__*/React.createElement("button", {
    onClick: () => setTheme(isDark ? 'light' : 'dark'),
    "aria-label": isDark ? 'Activer le mode clair' : 'Activer le mode sombre',
    "aria-pressed": isDark,
    "data-cp-hot": true,
    "data-cp-label": isDark ? 'mode clair' : 'mode sombre',
    style: {
      background: 'transparent',
      border: `1px solid ${E_LINE}`,
      width: 42,
      height: 24,
      borderRadius: 99,
      padding: 2,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 16,
      height: 16,
      borderRadius: 99,
      background: E_TERRA,
      transform: isDark ? 'translateX(16px)' : 'translateX(0)',
      transition: 'transform .3s cubic-bezier(.2,.7,.3,1)'
    }
  }));
}

// ─── Ticker (continuous marquee) ────────────────────────────────────────────
function Ticker() {
  const words = ['Praticiens bien-être', 'Artisans premium', 'Coachs & consultants', 'Studios indépendants', 'Cabinets libéraux'];
  const row = /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 48,
      paddingRight: 48,
      fontFamily: 'Spectral, serif',
      fontSize: 56,
      fontStyle: 'italic',
      letterSpacing: '-.01em',
      flexShrink: 0
    }
  }, words.map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, /*#__PURE__*/React.createElement("span", null, w), /*#__PURE__*/React.createElement("span", {
    style: {
      color: E_TERRA,
      fontStyle: 'normal'
    }
  }, "+"))));
  return /*#__PURE__*/React.createElement("section", {
    style: {
      background: E_INV_BG,
      color: E_INV_INK,
      borderTop: `1px solid ${E_INV_LINE}`,
      borderBottom: `1px solid ${E_INV_LINE}`,
      overflow: 'hidden',
      padding: '32px 0'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      whiteSpace: 'nowrap',
      animation: 'cp-ticker 32s linear infinite'
    }
  }, row, row));
}

// ────────────────────────────────────────────────────────────────────────────
// COPY (FR primary — EN labels for nav/cta only, content stays FR for now)
// ────────────────────────────────────────────────────────────────────────────
const E_COPY = {
  nav: [{
    label: 'Manifeste',
    href: '#manifeste'
  }, {
    label: 'Services',
    href: '#services'
  }, {
    label: 'Méthode',
    href: '#methode'
  }, {
    label: 'Travaux',
    href: '#travaux'
  }, {
    label: 'Maintenance',
    href: '#maintenance'
  }, {
    label: 'FAQ',
    href: '#faq'
  }],
  avail: 'Studio · Nouveaux projets ouverts',
  heroPre: 'Edgar Jacquemart — Corvee Paper · Paris',
  cta: 'Démarrer un projet',
  cta2: 'Voir les travaux',
  manifesto: {
    eyebrow: 'Manifeste',
    titleA: 'Le web pro mérite mieux',
    titleB: 'qu’un template Wix',
    titleC: 'de 2017.',
    p1: 'La plupart des indépendants travaillent dur, livrent un service impeccable, puis renvoient leurs prospects vers un site qui les trahit. Lent. Illisible sur mobile. Invisible sur Google. Bricolé en une après-midi par un cousin sympa, il y a six ans.',
    p2: 'Pour moi, un site n’est pas un objet décoratif. C’est votre meilleur commercial : il travaille 24/7, charge en moins de deux secondes, rassure dès la première seconde et rend la prise de contact évidente. Si l’un de ces points manque, le site ne sert à rien.',
    p3a: 'Alors je livre en 14 jours, à prix annoncé d’avance, avec un design pensé avec vous — et zéro promesse de ',
    p3strike: 'tripler votre chiffre d’affaires en 30 jours',
    p3b: '. Juste un site qui fonctionne, qui vous ressemble, et qui ne se démode pas dans six mois.'
  },
  services: {
    eyebrow: 'Services · 02',
    title: 'Trois formats.',
    titleAccent: 'Un seul niveau d’exigence.',
    note: 'Tout commence par 30 minutes d’échange gratuit pour comprendre votre activité et calibrer le bon format.',
    cards: [{
      kind: '01 · Essentiel',
      delay: '7 jours',
      t: 'La carte de visite augmentée',
      sub: 'Une page bien faite vaut mieux qu’un site mal fini. Idéal pour démarrer ou pour les indépendants en solo.',
      items: ['Page unique optimisée, mobile-first', 'Formulaire de contact intelligent', 'SEO local de base + Google Business', 'Mentions légales et RGPD inclus', 'Mise en ligne et formation 30 min'],
      price: '890',
      unit: '€ HT'
    }, {
      kind: '02 · Pro',
      delay: '14 jours',
      t: 'Le site complet',
      sub: 'Le format que je recommande pour la plupart des activités : assez complet pour transformer vos visiteurs en clients.',
      items: ['4 à 6 pages structurées', 'Prise de rendez-vous intégrée', 'SEO local renforcé + données structurées', 'Blog optionnel + 1 article modèle', 'Photos retouchées (jusqu’à 10)', 'Analytics conforme RGPD'],
      price: '1 690',
      unit: '€ HT',
      featured: true,
      badge: 'Recommandé'
    }, {
      kind: '03 · Sur mesure',
      delay: '21+ jours',
      t: 'Le projet complet',
      sub: 'Pour les activités à besoins spécifiques : boutique légère, multi-langue, intégration outils métier.',
      items: ['Tout le Pro, et au-delà', 'Boutique e-commerce simple', 'Espace administrable par vos soins', 'Intégrations sur mesure (CRM, API)', 'Site multi-langue éventuel', 'Accompagnement renforcé'],
      price: 'dès 2 900',
      unit: '€ HT'
    }],
    footnote: 'Acompte de 40 % à la signature, solde à la livraison. Possibilité de paiement en 3 fois sans frais sur demande.'
  },
  process: {
    eyebrow: 'Méthode · 03',
    title: 'Quatre étapes,',
    titleAccent: 'zéro mauvaise surprise.',
    steps: [{
      n: '01',
      t: 'Découverte',
      d: 'Un échange de 30 minutes — par appel, visio ou messages, comme vous préférez. Je cerne votre activité, vos clients, vos objectifs. Vous repartez avec un devis détaillé et une date de livraison ferme.',
      when: 'Jour 0 → 1'
    }, {
      n: '02',
      t: 'Maquette',
      d: 'Je conçois la page d’accueil et une page type sur Figma. Vous voyez tout, vous validez, j’ajuste. Je ne code rien tant que le design n’est pas net.',
      when: 'Jour 2 → 6'
    }, {
      n: '03',
      t: 'Intégration',
      d: 'Je développe le site, sans templates ni plugins WordPress capricieux. Code propre, performances au max, sécurité par défaut.',
      when: 'Jour 7 → 12'
    }, {
      n: '04',
      t: 'Mise en ligne',
      d: 'Vérification finale, mise en ligne sur votre domaine, formation de 30 minutes en visio pour que vous soyez autonome. Et je reste joignable ensuite.',
      when: 'Jour 13 → 14'
    }]
  },
  travaux: {
    eyebrow: 'Travaux · 04',
    title: 'Réalisations',
    titleAccent: '& concepts.',
    note: 'Studio en lancement. Les projets ci-dessous incluent des concepts non commandés réalisés à titre de démonstration. Mention indiquée sur chaque carte.'
  },
  maintenance: {
    eyebrow: 'Suite · 05',
    title: 'Le site est livré.',
    titleAccent: 'Et ensuite ?',
    sub: 'Trois forfaits de maintenance pour rester serein. Aucun engagement, résiliable à tout moment.',
    tiers: [{
      tag: 'Sérénité',
      badge: 'Le minimum vital',
      t: 'Hébergement et veille.',
      d: 'Hébergement rapide, SSL, sauvegardes, surveillance d’uptime, 30 minutes de modifications par mois.',
      price: '19'
    }, {
      tag: 'Évolution',
      badge: 'Celui que je conseille',
      t: 'Pour faire vivre le site.',
      d: 'Inclut Sérénité, plus 2 heures de modifications mensuelles et l’ajout de nouvelles sections sur demande.',
      price: '49',
      featured: true
    }, {
      tag: 'Croissance',
      badge: 'SEO + contenu',
      t: 'Pour gagner en visibilité.',
      d: 'Inclut Évolution, plus un article SEO mensuel rédigé, suivi des positions Google et recommandations.',
      price: '99'
    }]
  },
  faq: {
    eyebrow: 'FAQ · 06',
    title: 'Questions fréquentes,',
    titleAccent: 'réponses honnêtes.',
    items: [['C’est fait pour qui, exactement ?', 'Pour les indépendants dont le métier mérite mieux qu’une fiche Google : praticiens du bien-être (ostéos, sophrologues, coachs…), artisans, professions libérales.'], ['En quoi c’est différent d’un Wix ou d’un Squarespace ?', 'Avec un éditeur grand public, vous payez un abonnement à vie pour un site souvent lent, lourd et qui ressemble à mille autres. Je vous livre un site sur-mesure, rapide, à votre image, et dont vous êtes propriétaire.'], ['14 jours, c’est sérieux ?', 'Oui, pour le format Pro et à condition que vous me fournissiez les textes, photos et accès en début de projet. Si la collecte traîne, le compteur ne court pas. Je vous préviens d’office en cas de glissement.'], ['Je n’ai ni logo ni photos. C’est bloquant ?', 'Non. Je compose avec ce que vous avez et je vous oriente vers des solutions simples pour le reste (séance photo locale, logotype léger). Je ne vous laisse pas seul.'], ['Pourrai-je modifier le site moi-même ?', 'Selon le format choisi. En Essentiel, les modifications passent par moi. En Pro et Sur mesure, un éditeur simple vous permet de modifier textes, photos, horaires et tarifs sans toucher au code.'], ['Qui gère l’hébergement et le nom de domaine ?', 'Moi. Je commande le domaine à votre nom (vous en restez propriétaire) et je l’héberge sur une infrastructure rapide et conforme RGPD. Vous n’avez aucune ligne technique à gérer.'], ['Le référencement Google est-il garanti ?', 'Personne ne peut le garantir honnêtement. Ce que je garantis, c’est un site techniquement irréprochable : structure propre, vitesse élevée, données structurées, contenu balisé. Le reste, c’est du long terme, qu’on construit ensemble avec le forfait Croissance.'], ['Et si je ne suis pas satisfait ?', 'Un cycle d’allers-retours est inclus à chaque étape (maquette, intégration). Au-delà, j’ajuste sans facturer si la cause vient de moi. Mon objectif, c’est que vous soyez fier de votre site.']]
  },
  contact: {
    eyebrow: 'Contact · 07',
    title: 'Parlons de votre site.',
    titleAccent: '30 minutes, sans engagement.',
    sub: 'Je réponds à toutes les demandes sous 24 heures ouvrées. Si je ne suis pas le bon choix pour vous, je vous le dis franchement et je vous oriente.',
    fields: {
      name: 'Prénom et nom',
      email: 'Email',
      activite: 'Votre activité',
      activitePlaceholder: 'ostéopathe, ébéniste, coach sportif…',
      format: 'Format envisagé',
      message: 'Quelques mots sur le projet'
    },
    formats: ['Je ne sais pas encore', 'Essentiel · 890 €', 'Pro · 1 690 €', 'Sur mesure · dès 2 900 €'],
    rgpd: 'En envoyant ce formulaire vous acceptez que vos données soient utilisées uniquement pour répondre à votre demande. Aucun envoi commercial.',
    send: 'Envoyer',
    meta: [['Email', 'contact@corveepaper.fr'], ['Zone', 'France · Belgique · Suisse · Québec'], ['Délai', 'Réponse sous 24h ouvrées']]
  },
  footer: {
    blurb: 'Studio de design web pour praticiens, artisans et indépendants. Basé en France, opère dans toute la francophonie.',
    navCol: 'Navigation',
    legalCol: 'Légal',
    legalLinks: [['Mentions légales', 'mentions-legales.html'], ['Politique de confidentialité', 'confidentialite.html'], ['Conditions générales de vente', 'cgv.html']],
    note1: '© 2026 Corvee Paper · SIRET 105 561 716 00017',
    note2: 'Fait à la main · Aucun cookie · Hébergement UE'
  }
};

// ════════════════════════════════════════════════════════════════════════════
// CONTACT FORM — posts to Formspree via fetch (no page redirect).
// Inline success/error state so the rest of the page stays mounted.
// ════════════════════════════════════════════════════════════════════════════
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqejbpry';
function ContactForm({
  t
}) {
  const [status, setStatus] = useState('idle'); // idle | sending | success | error

  const onSubmit = async e => {
    e.preventDefault();
    setStatus('sending');
    try {
      const data = new FormData(e.target);
      const res = await fetch(FORMSPREE_ENDPOINT, {
        method: 'POST',
        body: data,
        headers: {
          'Accept': 'application/json'
        }
      });
      if (res.ok) {
        setStatus('success');
        e.target.reset();
      } else {
        setStatus('error');
      }
    } catch (_err) {
      setStatus('error');
    }
  };

  // ── Success state ──────────────────────────────────────────────────────────
  if (status === 'success') {
    return (
      /*#__PURE__*/
      // No cp-slide-r here — that class starts at opacity:0 and only fades in
      // when IntersectionObserver sees it. The component appears AFTER the
      // initial scroll observation, so it would stay invisible forever.
      // We use a simple inline fade-in keyframe instead.
      React.createElement("div", {
        style: {
          padding: 56,
          background: E_INV_CARD,
          border: `1px solid ${E_INV_LINE}`,
          borderRadius: 18,
          display: 'grid',
          gap: 20,
          alignContent: 'center',
          textAlign: 'center',
          minHeight: 380,
          animation: 'cp-success-in .5s cubic-bezier(.2,.7,.3,1) both'
        }
      }, /*#__PURE__*/React.createElement("div", {
        style: {
          fontFamily: 'Geist Mono, monospace',
          fontSize: 11,
          color: E_TERRA,
          letterSpacing: '.18em',
          textTransform: 'uppercase'
        }
      }, "\u21B3 Demande re\xE7ue"), /*#__PURE__*/React.createElement("h3", {
        style: {
          margin: 0,
          fontFamily: 'Spectral, serif',
          fontWeight: 400,
          fontSize: 52,
          lineHeight: 1.05,
          color: E_INV_INK,
          letterSpacing: '-.02em'
        }
      }, "Merci.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
        style: {
          fontStyle: 'italic',
          color: E_TERRA
        }
      }, "Je reviens vers vous sous 24h.")), /*#__PURE__*/React.createElement("p", {
        style: {
          margin: 0,
          fontSize: 15,
          lineHeight: 1.6,
          color: E_INV_INK_SOFT,
          fontFamily: 'Newsreader, serif'
        }
      }, "Si vous ne nous voyez pas dans votre bo\xEEte, jetez un \u0153il aux ind\xE9sirables \u2014 on \xE9crit depuis ", /*#__PURE__*/React.createElement("em", null, "contact@corveepaper.fr"), "."))
    );
  }

  // ── Form ───────────────────────────────────────────────────────────────────
  return /*#__PURE__*/React.createElement("form", {
    "data-cp-anim": true,
    className: "cp-slide-r",
    onSubmit: onSubmit,
    action: FORMSPREE_ENDPOINT,
    method: "POST",
    style: {
      padding: 36,
      background: E_INV_CARD,
      border: `1px solid ${E_INV_LINE}`,
      borderRadius: 18,
      display: 'grid',
      gap: 20,
      alignContent: 'start',
      '--cp-d': '200ms'
    }
  }, /*#__PURE__*/React.createElement("input", {
    type: "text",
    name: "_gotcha",
    tabIndex: -1,
    autoComplete: "off",
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      left: '-9999px',
      width: 1,
      height: 1,
      opacity: 0
    }
  }), /*#__PURE__*/React.createElement("input", {
    type: "hidden",
    name: "_subject",
    value: "[Corvee Paper] Nouveau lead"
  }), [{
    id: 'name',
    label: t.contact.fields.name,
    type: 'text',
    required: true
  }, {
    id: 'email',
    label: t.contact.fields.email,
    type: 'email',
    required: true
  }, {
    id: 'activite',
    label: t.contact.fields.activite,
    type: 'text',
    placeholder: t.contact.fields.activitePlaceholder,
    required: true
  }].map(f => /*#__PURE__*/React.createElement("label", {
    key: f.id,
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INV_INK_SOFT,
      letterSpacing: '.14em',
      textTransform: 'uppercase'
    }
  }, f.label), /*#__PURE__*/React.createElement("input", {
    type: f.type,
    name: f.id,
    placeholder: f.placeholder,
    required: f.required,
    style: {
      background: 'transparent',
      border: 0,
      borderBottom: `1px solid ${E_INV_LINE}`,
      padding: '10px 0',
      color: E_INV_INK,
      fontSize: 17,
      fontFamily: 'Newsreader, serif',
      outline: 'none'
    }
  }))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INV_INK_SOFT,
      letterSpacing: '.14em',
      textTransform: 'uppercase'
    }
  }, t.contact.fields.format), /*#__PURE__*/React.createElement("select", {
    name: "format",
    style: {
      background: 'transparent',
      border: 0,
      borderBottom: `1px solid ${E_INV_LINE}`,
      padding: '10px 0',
      color: E_INV_INK,
      fontSize: 17,
      fontFamily: 'Newsreader, serif',
      outline: 'none',
      appearance: 'none'
    }
  }, t.contact.formats.map(o => /*#__PURE__*/React.createElement("option", {
    key: o,
    style: {
      color: '#192230'
    }
  }, o)))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INV_INK_SOFT,
      letterSpacing: '.14em',
      textTransform: 'uppercase'
    }
  }, t.contact.fields.message), /*#__PURE__*/React.createElement("textarea", {
    name: "message",
    rows: 3,
    required: true,
    style: {
      background: 'transparent',
      border: 0,
      borderBottom: `1px solid ${E_INV_LINE}`,
      padding: '10px 0',
      color: E_INV_INK,
      fontSize: 17,
      fontFamily: 'Newsreader, serif',
      outline: 'none',
      resize: 'none'
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '4px 0 0',
      fontSize: 12,
      lineHeight: 1.55,
      color: E_INV_INK_SOFT
    }
  }, t.contact.rgpd), status === 'error' && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: '#ff8b6b',
      fontFamily: 'Geist, sans-serif'
    }
  }, "Erreur d\u2019envoi. R\xE9essayez ou \xE9crivez directement \xE0 ", /*#__PURE__*/React.createElement("strong", null, "contact@corveepaper.fr"), "."), /*#__PURE__*/React.createElement(Magnetic, {
    strength: 0.18,
    style: {
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: status === 'sending',
    "data-cp-hot": true,
    "data-cp-label": t.contact.send.toLowerCase(),
    style: {
      marginTop: 8,
      padding: '18px 24px',
      borderRadius: 99,
      background: E_TERRA,
      color: '#fff',
      border: 0,
      cursor: status === 'sending' ? 'wait' : 'pointer',
      opacity: status === 'sending' ? 0.6 : 1,
      fontFamily: 'Geist, sans-serif',
      fontSize: 15,
      fontWeight: 500,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 14,
      width: '100%'
    }
  }, status === 'sending' ? 'Envoi…' : t.contact.send, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 16
    }
  }, "\u2192"))));
}

// ════════════════════════════════════════════════════════════════════════════
// MAIN
// Lightweight viewport check. Mobile gets a light SVG preview in the Travaux
// section instead of 3 heavy live iframes (saves data + stays readable).
function useIsMobile(bp = 768) {
  const mqStr = `(max-width:${bp}px)`;
  const [m, setM] = useState(typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(mqStr).matches : false);
  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const mq = window.matchMedia(mqStr);
    const on = () => setM(mq.matches);
    on();
    if (mq.addEventListener) mq.addEventListener('change', on);else mq.addListener(on);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener('change', on);else mq.removeListener(on);
    };
  }, [mqStr]);
  return m;
}

// ════════════════════════════════════════════════════════════════════════════
function DirectionEditorial() {
  const [theme, setTheme] = useState('light');
  const [hoverIdx, setHoverIdx] = useState(-1);
  const [travauxFam, setTravauxFam] = useState('sante'); // 'sante' | 'resto' — switches the Travaux view
  const isMobile = useIsMobile();
  const [logoClicks, setLogoClicks] = useState(0);
  const [eggOpen, setEggOpen] = useState(false);
  const wrapRef = useRef(null);
  const t = E_COPY;
  useEffect(() => {
    ensureEditorialCSS();
    if (!window.__cpGreeted) {
      window.__cpGreeted = true;
      console.log('%c\n  Corvee Paper  \n%c  Studio indépendant · Paris\n  contact@corveepaper.fr\n  ↳ 7 clics sur le logo pour une surprise\n', 'background:#365b86;color:#e7e8ea;font:600 16px/2 "Spectral",serif;padding:6px 10px', 'color:#9B9690;font:12px/1.6 monospace');
    }
  }, []);

  // ─── Entry animations ──────────────────────────────────────────────────
  // Find every [data-cp-anim] element under the wrapper and toggle .cp-in
  // once they cross 18% into the viewport. One-shot reveal — we unobserve
  // after the first trigger so content doesn't re-animate on scroll-back.
  useEffect(() => {
    if (!wrapRef.current) return;
    // Hero items animate immediately on mount — they're above the fold.
    // (rAF can be throttled in just-loaded iframes; do it synchronously.)
    wrapRef.current.querySelectorAll('[data-cp-anim-hero]').forEach(el => {
      el.classList.add('cp-in');
    });

    // Other items animate on viewport intersection.
    const els = wrapRef.current.querySelectorAll('[data-cp-anim]');
    if (!els.length) return;
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (e.isIntersecting) {
          e.target.classList.add('cp-in');
          io.unobserve(e.target);
        }
      }
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -8% 0px'
    });
    els.forEach(el => io.observe(el));
    return () => io.disconnect();
  }, []);

  // When the Travaux family is switched, React mounts brand-new cards that the
  // one-shot observer above never saw — so reveal them explicitly here. Without
  // this, the switched-in family stays invisible (opacity:0).
  useEffect(() => {
    if (!wrapRef.current) return;
    const grid = wrapRef.current.querySelector('#cp-travaux-grid');
    if (!grid) return;
    grid.querySelectorAll('[data-cp-anim]').forEach(el => el.classList.add('cp-in'));
  }, [travauxFam]);
  const onLogo = () => {
    const next = logoClicks + 1;
    if (next >= 7) {
      setEggOpen(true);
      setLogoClicks(0);
    } else {
      setLogoClicks(next);
    }
  };
  return /*#__PURE__*/React.createElement("div", {
    ref: wrapRef,
    className: `cp-theme ${theme} ab`,
    style: {
      width: '100%',
      height: '100%',
      background: E_BG,
      color: E_INK,
      fontFamily: 'Geist, -apple-system, system-ui, sans-serif',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement(EasterEgg, {
    open: eggOpen,
    onClose: () => setEggOpen(false)
  }), /*#__PURE__*/React.createElement("nav", {
    style: {
      position: 'sticky',
      top: 0,
      zIndex: 5,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '18px 56px',
      background: E_NAV_BG,
      backdropFilter: 'blur(14px)',
      borderBottom: `1px solid ${E_LINE}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement(Logo, {
    onClick: onLogo,
    color: E_INK,
    terra: E_TERRA
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 6,
      paddingLeft: 14,
      borderLeft: `1px solid ${E_LINE}`,
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INK_SOFT,
      letterSpacing: '.06em'
    }
  }, "\u21B3 ", t.avail, logoClicks > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 12,
      color: E_TERRA
    }
  }, logoClicks, "/7"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 26,
      alignItems: 'center',
      fontSize: 14
    }
  }, t.nav.map(item => /*#__PURE__*/React.createElement(Magnetic, {
    key: item.label,
    strength: 0.12
  }, /*#__PURE__*/React.createElement("a", {
    href: item.href,
    "data-cp-hot": true,
    onClick: e => {
      // Smooth-scroll the host page (the design-canvas overlay
      // doesn't carry anchor scrolls itself, so we resolve and
      // scroll manually). Falls back to default if section is
      // missing.
      const target = document.querySelector(item.href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    },
    style: {
      color: E_INK,
      textDecoration: 'none',
      cursor: 'pointer'
    }
  }, item.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 1,
      height: 16,
      background: E_LINE
    }
  }), /*#__PURE__*/React.createElement(ThemeToggle, {
    theme: theme,
    setTheme: setTheme
  }), /*#__PURE__*/React.createElement(Magnetic, {
    strength: 0.18
  }, /*#__PURE__*/React.createElement("a", {
    "data-cp-hot": true,
    "data-cp-label": "\u2192 on en parle",
    href: "#contact",
    onClick: e => {
      const target = document.querySelector('#contact');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
    },
    style: {
      padding: '10px 18px',
      background: E_INK,
      color: E_BG,
      borderRadius: 99,
      fontSize: 13,
      fontWeight: 500,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8
    }
  }, "Discutons", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "\u2192"))))), /*#__PURE__*/React.createElement("section", {
    id: "top",
    style: {
      padding: '120px 56px 100px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(HeroBG, {
    dark: theme === 'dark'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim-hero": true,
    className: "cp-reveal",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '6px 14px',
      border: `1px solid ${E_LINE}`,
      borderRadius: 99,
      background: E_BG,
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INK_SOFT,
      letterSpacing: '.08em',
      textTransform: 'uppercase',
      marginBottom: 56,
      '--cp-d': '50ms'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 99,
      background: E_TERRA,
      boxShadow: `0 0 0 4px ${E_TERRA}22`
    }
  }), t.heroPre), /*#__PURE__*/React.createElement("h1", {
    "data-cp-anim-hero": true,
    className: "cp-wipe",
    style: {
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 180,
      lineHeight: .92,
      letterSpacing: '-.028em',
      margin: 0,
      color: E_INK,
      maxWidth: 1180,
      '--cp-d': '200ms'
    }
  }, "Des sites web", /*#__PURE__*/React.createElement("br", null), "pour les ind\xE9pendants", /*#__PURE__*/React.createElement("br", null), "qui ont ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: E_TERRA
    }
  }, "mieux \xE0 faire"), "."), /*#__PURE__*/React.createElement("div", {
    "data-cp-anim-hero": true,
    className: "cp-reveal",
    style: {
      marginTop: 64,
      display: 'grid',
      gridTemplateColumns: '1fr auto',
      alignItems: 'end',
      gap: 60,
      '--cp-d': '500ms'
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      maxWidth: 620,
      margin: 0,
      fontSize: 22,
      lineHeight: 1.5,
      color: E_INK
    }
  }, "Corvee Paper con\xE7oit et livre des sites web rapides, sobres et bien pens\xE9s pour les ", /*#__PURE__*/React.createElement("em", {
    style: {
      fontFamily: 'Spectral, serif',
      color: E_TERRA,
      fontSize: 24
    }
  }, "praticiens, artisans et professionnels ind\xE9pendants"), ". En 14 jours, sur devis personnalis\xE9 \xE0 partir de 890 \u20AC, sans jargon ni promesses fumeuses."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 12,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement(Magnetic, {
    strength: 0.2,
    radius: 100
  }, /*#__PURE__*/React.createElement("a", {
    "data-cp-hot": true,
    "data-cp-label": "go \u2192",
    href: "#contact",
    onClick: e => {
      const tg = document.querySelector('#contact');
      if (tg) {
        e.preventDefault();
        tg.scrollIntoView({
          behavior: 'smooth'
        });
      }
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 14,
      padding: '20px 30px',
      background: E_INK,
      color: E_BG,
      borderRadius: 99,
      textDecoration: 'none',
      cursor: 'pointer',
      fontSize: 15,
      fontWeight: 500
    }
  }, t.cta, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: 99,
      background: E_TERRA,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 14,
      color: '#fff'
    }
  }, "\u2192"))), /*#__PURE__*/React.createElement(Magnetic, {
    strength: 0.16
  }, /*#__PURE__*/React.createElement("a", {
    "data-cp-hot": true,
    href: "#travaux",
    onClick: e => {
      setTravauxFam('sante');
      const tg = document.querySelector('#travaux');
      if (tg) {
        e.preventDefault();
        tg.scrollIntoView({
          behavior: 'smooth'
        });
      }
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '20px 26px',
      color: E_INK,
      border: `1.5px solid ${E_INK}`,
      borderRadius: 99,
      textDecoration: 'none',
      cursor: 'pointer',
      fontSize: 15,
      fontWeight: 500
    }
  }, "Sites sant\xE9")), /*#__PURE__*/React.createElement(Magnetic, {
    strength: 0.16
  }, /*#__PURE__*/React.createElement("a", {
    "data-cp-hot": true,
    href: "#travaux",
    onClick: e => {
      setTravauxFam('resto');
      const tg = document.querySelector('#travaux');
      if (tg) {
        e.preventDefault();
        tg.scrollIntoView({
          behavior: 'smooth'
        });
      }
    },
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '20px 26px',
      color: E_INK,
      border: `1.5px solid ${E_INK}`,
      borderRadius: 99,
      textDecoration: 'none',
      cursor: 'pointer',
      fontSize: 15,
      fontWeight: 500
    }
  }, "Sites restauration")))), /*#__PURE__*/React.createElement("div", {
    "data-cp-anim-hero": true,
    className: "cp-reveal",
    style: {
      marginTop: 96,
      paddingTop: 40,
      borderTop: `1px solid ${E_LINE}`,
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 0,
      '--cp-d': '700ms'
    }
  }, [['14', 'jours · livraison'], ['100', 'mobile · responsive', '%'], ['24', 'délai de réponse', 'h'], ['0', 'jargon · inutile', '€']].map(([n, l, suffix], i) => /*#__PURE__*/React.createElement("div", {
    key: l,
    style: {
      paddingRight: 32,
      borderRight: i < 3 ? `1px solid ${E_LINE}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Spectral, serif',
      fontSize: 84,
      lineHeight: 1,
      color: E_INK,
      letterSpacing: '-.025em'
    }
  }, n, /*#__PURE__*/React.createElement("span", {
    style: {
      color: E_TERRA,
      fontStyle: 'italic'
    }
  }, suffix || '.')), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INK_SOFT,
      letterSpacing: '.14em',
      marginTop: 10,
      textTransform: 'uppercase'
    }
  }, l)))))), /*#__PURE__*/React.createElement(Ticker, null), /*#__PURE__*/React.createElement("section", {
    id: "manifeste",
    style: {
      padding: '120px 56px',
      borderBottom: `1px solid ${E_LINE}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.6fr',
      gap: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-slide-l"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INK_SOFT,
      letterSpacing: '.18em',
      marginBottom: 28,
      textTransform: 'uppercase'
    }
  }, "\u21B3 ", t.manifesto.eyebrow, " \xB7 01"), /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 64,
      letterSpacing: '-.02em',
      lineHeight: 1.02
    }
  }, t.manifesto.titleA, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: E_TERRA
    }
  }, t.manifesto.titleB), /*#__PURE__*/React.createElement("br", null), t.manifesto.titleC)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 28,
      alignContent: 'start',
      paddingTop: 14
    }
  }, /*#__PURE__*/React.createElement("p", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      margin: 0,
      fontSize: 22,
      lineHeight: 1.5,
      color: E_INK,
      fontFamily: 'Newsreader, Georgia, serif',
      '--cp-d': '100ms'
    }
  }, t.manifesto.p1), /*#__PURE__*/React.createElement("p", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      margin: 0,
      fontSize: 20,
      lineHeight: 1.55,
      color: E_INK_SOFT,
      fontFamily: 'Newsreader, Georgia, serif',
      '--cp-d': '200ms'
    }
  }, t.manifesto.p2), /*#__PURE__*/React.createElement("p", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      margin: 0,
      fontSize: 20,
      lineHeight: 1.55,
      color: E_INK_SOFT,
      fontFamily: 'Newsreader, Georgia, serif',
      '--cp-d': '300ms'
    }
  }, t.manifesto.p3a, /*#__PURE__*/React.createElement("span", {
    style: {
      textDecoration: 'line-through',
      textDecorationColor: E_TERRA,
      textDecorationThickness: '2px'
    }
  }, t.manifesto.p3strike), t.manifesto.p3b)))), /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      padding: '120px 56px',
      background: E_INV_BG,
      color: E_INV_INK
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'end',
      gap: 80,
      marginBottom: 80,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-reveal"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INV_INK_SOFT,
      letterSpacing: '.18em',
      marginBottom: 24,
      textTransform: 'uppercase'
    }
  }, "\u21B3 ", t.services.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 88,
      letterSpacing: '-.025em',
      lineHeight: 1,
      maxWidth: 880,
      '--cp-d': '150ms'
    }
  }, t.services.title, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: E_TERRA
    }
  }, t.services.titleAccent))), /*#__PURE__*/React.createElement("p", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      margin: 0,
      color: E_INV_INK_SOFT,
      maxWidth: 360,
      fontSize: 16,
      lineHeight: 1.55,
      '--cp-d': '350ms'
    }
  }, t.services.note)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 20,
      alignItems: 'stretch'
    }
  }, t.services.cards.map((c, i) => {
    const featured = c.featured;
    return /*#__PURE__*/React.createElement("article", {
      key: c.t,
      "data-cp-hot": true,
      "data-cp-anim": true,
      className: "cp-pop",
      style: {
        position: 'relative',
        padding: 36,
        borderRadius: 20,
        '--cp-d': `${100 + i * 120}ms`,
        // Featured tier: cream card on dark bg → it "lifts off" and
        // inverts colors instead of using a subtle warm tint that
        // doesn't read in dark mode.
        background: featured ? E_BG : E_INV_CARD,
        color: featured ? E_INK : E_INV_INK,
        border: `1px solid ${featured ? E_BG : E_INV_LINE}`,
        boxShadow: featured ? `0 24px 60px -20px ${E_TERRA}` : 'none',
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        minHeight: 560,
        cursor: 'pointer',
        transition: 'transform .35s cubic-bezier(.2,.7,.3,1), box-shadow .35s'
      },
      onMouseEnter: e => {
        e.currentTarget.style.transform = featured ? 'translateY(-10px)' : 'translateY(-6px)';
      },
      onMouseLeave: e => {
        e.currentTarget.style.transform = 'translateY(0)';
      }
    }, featured && /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: -14,
        left: '50%',
        transform: 'translateX(-50%)',
        background: E_TERRA,
        color: '#fff',
        fontFamily: 'Geist Mono, monospace',
        fontSize: 10,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        padding: '7px 14px',
        borderRadius: 99,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 4,
        height: 4,
        borderRadius: 99,
        background: '#fff'
      }
    }), c.badge), /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: 11,
        fontFamily: 'Geist Mono, monospace',
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        opacity: featured ? .6 : .8
      }
    }, /*#__PURE__*/React.createElement("span", null, c.kind), /*#__PURE__*/React.createElement("span", null, "\u21B3 ", c.delay)), /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: '8px 0 4px',
        fontFamily: 'Spectral, serif',
        fontWeight: 400,
        fontSize: 38,
        letterSpacing: '-.015em',
        lineHeight: 1.05
      }
    }, c.t), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 15,
        lineHeight: 1.55,
        color: featured ? E_INK_SOFT : E_INV_INK_SOFT,
        fontFamily: 'Newsreader, Georgia, serif'
      }
    }, c.sub), /*#__PURE__*/React.createElement("ul", {
      style: {
        margin: '12px 0 0',
        padding: 0,
        listStyle: 'none',
        display: 'grid',
        gap: 10,
        fontSize: 14,
        flex: 1
      }
    }, c.items.map(item => /*#__PURE__*/React.createElement("li", {
      key: item,
      style: {
        display: 'flex',
        gap: 12
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        color: E_TERRA,
        fontWeight: 700
      }
    }, "\xB7"), /*#__PURE__*/React.createElement("span", null, item)))), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 'auto',
        paddingTop: 24,
        borderTop: `1px solid ${featured ? E_LINE : E_INV_LINE}`,
        display: 'flex',
        alignItems: 'baseline',
        justifyContent: 'space-between'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral, serif',
        fontSize: 48,
        letterSpacing: '-.02em',
        lineHeight: 1,
        color: featured ? E_TERRA : 'inherit'
      }
    }, c.price, ' ', /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 16,
        opacity: .55,
        fontFamily: 'Geist, sans-serif',
        color: featured ? E_INK_SOFT : 'inherit'
      }
    }, c.unit)), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 22,
        color: E_TERRA
      }
    }, "\u2192")));
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '48px 0 0',
      textAlign: 'center',
      fontFamily: 'Newsreader, serif',
      fontStyle: 'italic',
      fontSize: 16,
      color: E_INV_INK_SOFT
    }
  }, t.services.footnote)), /*#__PURE__*/React.createElement("section", {
    id: "methode",
    style: {
      padding: '120px 56px',
      background: E_BG
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'end',
      marginBottom: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-slide-l"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INK_SOFT,
      letterSpacing: '.18em',
      marginBottom: 24,
      textTransform: 'uppercase'
    }
  }, "\u21B3 ", t.process.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 88,
      letterSpacing: '-.025em',
      lineHeight: 1,
      '--cp-d': '150ms'
    }
  }, t.process.title, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: E_TERRA
    }
  }, t.process.titleAccent))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INK_SOFT,
      letterSpacing: '.16em'
    }
  }, "~ 14 jours \xB7 LIVRAISON")), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    "aria-hidden": true,
    width: "100%",
    height: "2",
    style: {
      position: 'absolute',
      left: 24,
      right: 24,
      top: 27,
      width: 'calc(100% - 48px)'
    }
  }, /*#__PURE__*/React.createElement("line", {
    x1: "0",
    y1: "1",
    x2: "100%",
    y2: "1",
    stroke: "currentColor",
    strokeOpacity: ".3",
    strokeWidth: "1",
    strokeDasharray: "3 4"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap: 32,
      position: 'relative'
    }
  }, t.process.steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    "data-cp-anim": true,
    className: "cp-pop",
    style: {
      '--cp-d': `${i * 120}ms`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 56,
      height: 56,
      borderRadius: 99,
      background: E_BG,
      border: `1.5px solid ${E_INK}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: E_INK,
      fontFamily: 'Spectral, serif',
      fontSize: 28,
      fontStyle: 'italic',
      position: 'relative',
      zIndex: 1,
      transition: 'transform .3s, background .3s, color .3s',
      cursor: 'default'
    },
    onMouseEnter: e => {
      e.currentTarget.style.background = E_TERRA;
      e.currentTarget.style.color = '#fff';
      e.currentTarget.style.borderColor = E_TERRA;
      e.currentTarget.style.transform = 'scale(1.1)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.background = E_BG;
      e.currentTarget.style.color = E_INK;
      e.currentTarget.style.borderColor = E_INK;
      e.currentTarget.style.transform = 'scale(1)';
    }
  }, s.n.replace(/^0/, '')), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '28px 0 12px',
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 36,
      letterSpacing: '-.015em',
      lineHeight: 1
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 15,
      lineHeight: 1.55,
      color: E_INK_SOFT,
      paddingRight: 12,
      fontFamily: 'Newsreader, serif'
    }
  }, s.d), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 16,
      paddingTop: 12,
      borderTop: `1px solid ${E_LINE}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      letterSpacing: '.14em'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: E_TERRA
    }
  }, s.when), i < t.process.steps.length - 1 && /*#__PURE__*/React.createElement("span", {
    style: {
      color: E_INK_SOFT,
      fontSize: 14
    }
  }, "\u2192"))))))), /*#__PURE__*/React.createElement("section", {
    id: "travaux",
    style: {
      padding: '120px 56px',
      borderTop: `1px solid ${E_LINE}`,
      borderBottom: `1px solid ${E_LINE}`,
      background: E_BG_2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'end',
      gap: 60,
      marginBottom: 80,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-slide-l"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INK_SOFT,
      letterSpacing: '.18em',
      marginBottom: 24,
      textTransform: 'uppercase'
    }
  }, "\u21B3 ", t.travaux.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 96,
      letterSpacing: '-.025em',
      lineHeight: 1,
      '--cp-d': '150ms'
    }
  }, t.travaux.title, " ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: E_TERRA
    }
  }, t.travaux.titleAccent))), /*#__PURE__*/React.createElement("p", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      margin: 0,
      color: E_INK_SOFT,
      maxWidth: 420,
      fontSize: 14,
      lineHeight: 1.6,
      '--cp-d': '300ms'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      color: E_INK
    }
  }, "Transparence \xB7"), ' ', t.travaux.note)), /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-reveal",
    role: "tablist",
    "aria-label": "Filtrer les r\xE9alisations par famille de m\xE9tier",
    style: {
      display: 'flex',
      gap: 14,
      flexWrap: 'wrap',
      marginBottom: 72
    }
  }, [['sante', 'Santé'], ['resto', 'Restauration & commerce']].map(([fam, label]) => {
    const active = travauxFam === fam;
    return /*#__PURE__*/React.createElement("button", {
      key: fam,
      type: "button",
      "data-cp-hot": true,
      "aria-pressed": active,
      onClick: () => setTravauxFam(fam),
      style: {
        fontFamily: 'Geist Mono, monospace',
        fontSize: 15,
        letterSpacing: '.14em',
        textTransform: 'uppercase',
        cursor: 'pointer',
        padding: '20px 38px',
        borderRadius: 99,
        border: `2px solid ${active ? E_INK : E_LINE}`,
        background: active ? E_INK : 'transparent',
        color: active ? E_BG : E_INK,
        transition: 'all .2s',
        fontWeight: 500
      }
    }, label);
  })), /*#__PURE__*/React.createElement("div", {
    id: "cp-travaux-grid",
    style: {
      display: 'grid',
      gap: 96
    }
  }, (CP_PROJECTS.filter(p => p.fam === travauxFam).length > 0 ? CP_PROJECTS.filter(p => p.fam === travauxFam) : CP_PROJECTS).map((p, i) => {
    const flip = i % 2 === 1;
    const isHover = hoverIdx === i;
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      "data-cp-anim": true,
      className: flip ? 'cp-slide-r' : 'cp-slide-l',
      onMouseEnter: () => setHoverIdx(i),
      onMouseLeave: () => setHoverIdx(-1),
      style: {
        display: 'grid',
        gridTemplateColumns: flip ? '1fr 1.3fr' : '1.3fr 1fr',
        gap: 56,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: p.href,
      "aria-label": `Voir le concept ${p.name} dans le portfolio`,
      "data-cp-hot": true,
      "data-cp-label": "voir \u2192",
      style: {
        order: flip ? 2 : 1,
        position: 'relative',
        display: 'block',
        textDecoration: 'none',
        transform: isHover ? `perspective(1400px) rotateY(${flip ? -3 : 3}deg) rotateX(2deg) translateY(-8px)` : 'perspective(1400px) rotateY(0) rotateX(0) translateY(0)',
        transition: 'transform .6s cubic-bezier(.2,.7,.3,1)',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement(BrowserMock, {
      url: p.url,
      accent: p.accent,
      bg: p.bg,
      style: {
        width: '100%'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        aspectRatio: '16 / 10',
        overflow: 'hidden',
        position: 'relative',
        background: p.bg
      }
    }, isMobile ?
    /*#__PURE__*/
    /* Mobile: light branded card (avoid loading 6 full sites on a phone). */
    React.createElement("div", {
      style: {
        position: 'absolute',
        inset: 0,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        padding: 24,
        textAlign: 'center',
        background: p.bg
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Spectral, serif',
        fontSize: 'clamp(28px, 7vw, 40px)',
        lineHeight: 1,
        color: p.accent
      }
    }, p.name), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Geist Mono, monospace',
        fontSize: 10,
        letterSpacing: '.18em',
        textTransform: 'uppercase',
        color: p.accent,
        opacity: 0.82
      }
    }, p.type.fr.replace('Concept · ', '')), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6,
        fontFamily: 'Geist Mono, monospace',
        fontSize: 10,
        letterSpacing: '.12em',
        textTransform: 'uppercase',
        color: p.accent,
        border: `1px solid ${p.accent}`,
        borderRadius: 99,
        padding: '6px 14px',
        opacity: 0.9
      }
    }, "Voir le site \u2192")) :
    /*#__PURE__*/
    /* Desktop: real live preview of the concept site, scaled to fit the frame. */
    React.createElement("iframe", {
      src: p.href,
      title: `Aperçu du site ${p.name}`,
      "aria-hidden": "true",
      tabIndex: -1,
      scrolling: "no",
      loading: "lazy",
      style: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '250%',
        height: '250%',
        transform: 'scale(0.4)',
        transformOrigin: 'top left',
        border: 0,
        pointerEvents: 'none'
      }
    }))), /*#__PURE__*/React.createElement("span", {
      style: {
        position: 'absolute',
        top: 18,
        left: 18,
        background: '#192230',
        color: '#e7e8ea',
        fontFamily: 'Geist Mono, monospace',
        fontSize: 10,
        letterSpacing: '.16em',
        textTransform: 'uppercase',
        padding: '5px 10px',
        borderRadius: 99
      }
    }, "Concept")), /*#__PURE__*/React.createElement("div", {
      style: {
        order: flip ? 1 : 2,
        paddingLeft: flip ? 0 : 24,
        paddingRight: flip ? 24 : 0
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: 'Geist Mono, monospace',
        fontSize: 11,
        letterSpacing: '.18em',
        color: E_INK_SOFT,
        marginBottom: 18,
        textTransform: 'uppercase'
      }
    }, "0", i + 1, " \u2014 ", p.year), /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontFamily: 'Spectral, serif',
        fontWeight: 400,
        fontSize: 72,
        letterSpacing: '-.025em',
        lineHeight: .98,
        color: isHover ? E_TERRA : E_INK,
        transition: 'color .3s'
      }
    }, p.name, /*#__PURE__*/React.createElement("span", {
      style: {
        color: E_TERRA,
        fontStyle: 'italic'
      }
    }, ".")), /*#__PURE__*/React.createElement("p", {
      style: {
        marginTop: 16,
        fontSize: 20,
        color: E_INK,
        fontFamily: 'Newsreader, serif',
        fontStyle: 'italic'
      }
    }, p.type.fr), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 28,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, p.tags.map(tg => /*#__PURE__*/React.createElement("span", {
      key: tg,
      style: {
        padding: '6px 12px',
        borderRadius: 99,
        background: E_CARD,
        fontSize: 12,
        color: E_INK,
        fontFamily: 'Geist Mono, monospace',
        letterSpacing: '.06em',
        textTransform: 'uppercase'
      }
    }, tg))), /*#__PURE__*/React.createElement(Magnetic, {
      strength: 0.16
    }, /*#__PURE__*/React.createElement("a", {
      href: p.href,
      "data-cp-hot": true,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 10,
        marginTop: 32,
        fontSize: 15,
        color: E_TERRA,
        textDecoration: 'none',
        cursor: 'pointer',
        borderBottom: `1px solid ${E_TERRA}`,
        paddingBottom: 4
      }
    }, "Voir le concept \u2197"))));
  }))), /*#__PURE__*/React.createElement("section", {
    id: "maintenance",
    style: {
      padding: '120px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1.6fr',
      gap: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-slide-l"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INK_SOFT,
      letterSpacing: '.18em',
      marginBottom: 24,
      textTransform: 'uppercase'
    }
  }, "\u21B3 ", t.maintenance.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 72,
      letterSpacing: '-.025em',
      lineHeight: 1.02,
      '--cp-d': '150ms'
    }
  }, t.maintenance.title, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: E_TERRA
    }
  }, t.maintenance.titleAccent)), /*#__PURE__*/React.createElement("p", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      marginTop: 24,
      fontSize: 18,
      color: E_INK_SOFT,
      lineHeight: 1.5,
      fontFamily: 'Newsreader, serif',
      '--cp-d': '300ms'
    }
  }, t.maintenance.sub)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: 16
    }
  }, t.maintenance.tiers.map((m, i) => /*#__PURE__*/React.createElement("div", {
    key: m.tag,
    "data-cp-hot": true,
    "data-cp-anim": true,
    className: "cp-slide-r",
    style: {
      background: E_CARD_BG,
      border: `1px solid ${m.featured ? E_TERRA : E_LINE}`,
      borderRadius: 18,
      padding: '28px 32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 24,
      flexWrap: 'wrap',
      position: 'relative',
      cursor: 'pointer',
      transition: 'transform .25s, border-color .25s',
      '--cp-d': `${i * 120}ms`
    },
    onMouseEnter: e => {
      e.currentTarget.style.transform = 'translateX(8px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.transform = 'translateX(0)';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: '1 1 280px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      marginBottom: 6
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INK_SOFT,
      letterSpacing: '.14em',
      textTransform: 'uppercase'
    }
  }, m.tag), /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 10,
      color: E_TERRA,
      letterSpacing: '.14em',
      textTransform: 'uppercase'
    }
  }, m.badge)), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '4px 0 8px',
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 32,
      letterSpacing: '-.01em',
      lineHeight: 1.05
    }
  }, m.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 14,
      color: E_INK_SOFT,
      lineHeight: 1.55
    }
  }, m.d)), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Spectral, serif',
      fontSize: 48,
      letterSpacing: '-.02em',
      lineHeight: 1
    }
  }, m.price, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 14,
      color: E_INK_SOFT,
      fontFamily: 'Geist, sans-serif',
      marginLeft: 8
    }
  }, "\u20AC HT / mois"))))))), /*#__PURE__*/React.createElement("section", {
    id: "faq",
    className: "cp-faq",
    style: {
      padding: '120px 56px',
      background: E_BG_2,
      borderTop: `1px solid ${E_LINE}`,
      borderBottom: `1px solid ${E_LINE}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 980,
      margin: '0 auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      marginBottom: 64
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INK_SOFT,
      letterSpacing: '.18em',
      marginBottom: 24,
      textTransform: 'uppercase'
    }
  }, "\u21B3 ", t.faq.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 88,
      letterSpacing: '-.025em',
      lineHeight: 1,
      '--cp-d': '150ms'
    }
  }, t.faq.title, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: E_TERRA
    }
  }, t.faq.titleAccent))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid'
    }
  }, t.faq.items.map(([q, a], i) => /*#__PURE__*/React.createElement("details", {
    key: q,
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      borderTop: i === 0 ? `1px solid ${E_LINE}` : 'none',
      borderBottom: `1px solid ${E_LINE}`,
      padding: '28px 0',
      '--cp-d': `${i * 80}ms`
    }
  }, /*#__PURE__*/React.createElement("summary", {
    "data-cp-hot": true,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 32
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 32,
      letterSpacing: '-.015em',
      lineHeight: 1.15,
      color: E_INK
    }
  }, q), /*#__PURE__*/React.createElement("span", {
    className: "cp-faq-plus",
    style: {
      color: E_TERRA,
      fontSize: 36,
      lineHeight: 1,
      fontFamily: 'Spectral, serif',
      flexShrink: 0
    }
  }, "+")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '16px 0 0',
      fontSize: 17,
      lineHeight: 1.6,
      color: E_INK_SOFT,
      fontFamily: 'Newsreader, serif',
      maxWidth: 720
    }
  }, a)))))), /*#__PURE__*/React.createElement("section", {
    id: "contact",
    style: {
      padding: '120px 56px',
      background: E_INV_BG,
      color: E_INV_INK
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 80
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-slide-l"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INV_INK_SOFT,
      letterSpacing: '.18em',
      marginBottom: 24,
      textTransform: 'uppercase'
    }
  }, "\u21B3 ", t.contact.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: 'Spectral, serif',
      fontWeight: 400,
      fontSize: 80,
      letterSpacing: '-.025em',
      lineHeight: 1,
      '--cp-d': '150ms'
    }
  }, t.contact.title, /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontStyle: 'italic',
      color: E_TERRA
    }
  }, t.contact.titleAccent)), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 28,
      fontSize: 19,
      lineHeight: 1.55,
      color: E_INV_INK_SOFT,
      maxWidth: 480,
      fontFamily: 'Newsreader, serif'
    }
  }, t.contact.sub), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 48,
      padding: 28,
      border: `1px solid ${E_INV_LINE}`,
      borderRadius: 14,
      background: E_INV_CARD,
      display: 'grid',
      gap: 14,
      fontSize: 14
    }
  }, t.contact.meta.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'flex',
      gap: 24
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INV_INK_SOFT,
      letterSpacing: '.14em',
      textTransform: 'uppercase',
      width: 80,
      flexShrink: 0
    }
  }, k), /*#__PURE__*/React.createElement("span", {
    style: {
      color: E_INV_INK
    }
  }, v))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 6,
      paddingTop: 14,
      borderTop: `1px solid ${E_INV_LINE}`,
      display: 'flex',
      gap: 16,
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INV_INK_SOFT,
      letterSpacing: '.1em',
      textTransform: 'uppercase'
    }
  }, /*#__PURE__*/React.createElement(Magnetic, null, /*#__PURE__*/React.createElement("a", {
    "data-cp-hot": true,
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "X / Twitter")), /*#__PURE__*/React.createElement(Magnetic, null, /*#__PURE__*/React.createElement("a", {
    "data-cp-hot": true,
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "LinkedIn")), /*#__PURE__*/React.createElement(Magnetic, null, /*#__PURE__*/React.createElement("a", {
    "data-cp-hot": true,
    style: {
      color: 'inherit',
      textDecoration: 'none'
    }
  }, "Instagram"))))), /*#__PURE__*/React.createElement(ContactForm, {
    t: t
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 120,
      paddingTop: 56,
      borderTop: `1px solid ${E_INV_LINE}`,
      display: 'grid',
      gridTemplateColumns: '1.4fr 1fr 1fr',
      gap: 56
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Spectral, serif',
      fontSize: 36
    }
  }, "Corvee Paper", /*#__PURE__*/React.createElement("span", {
    style: {
      color: E_TERRA,
      fontStyle: 'italic'
    }
  }, ".")), /*#__PURE__*/React.createElement("p", {
    style: {
      marginTop: 14,
      fontSize: 14,
      color: E_INV_INK_SOFT,
      lineHeight: 1.55,
      maxWidth: 360
    }
  }, t.footer.blurb)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      letterSpacing: '.16em',
      color: E_INV_INK_SOFT,
      textTransform: 'uppercase',
      marginBottom: 18
    }
  }, t.footer.navCol), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'grid',
      gap: 8
    }
  }, t.nav.map(n => /*#__PURE__*/React.createElement("li", {
    key: n.label
  }, /*#__PURE__*/React.createElement(Magnetic, null, /*#__PURE__*/React.createElement("a", {
    href: n.href,
    "data-cp-hot": true,
    style: {
      color: E_INV_INK,
      textDecoration: 'none',
      fontSize: 14,
      cursor: 'pointer'
    }
  }, n.label)))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      letterSpacing: '.16em',
      color: E_INV_INK_SOFT,
      textTransform: 'uppercase',
      marginBottom: 18
    }
  }, t.footer.legalCol), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'grid',
      gap: 8
    }
  }, t.footer.legalLinks.map(([label, href]) => /*#__PURE__*/React.createElement("li", {
    key: label
  }, /*#__PURE__*/React.createElement(Magnetic, null, /*#__PURE__*/React.createElement("a", {
    href: href,
    "data-cp-hot": true,
    style: {
      color: E_INV_INK,
      textDecoration: 'none',
      fontSize: 14,
      cursor: 'pointer'
    }
  }, label))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 56,
      paddingTop: 24,
      borderTop: `1px solid ${E_INV_LINE}`,
      display: 'flex',
      justifyContent: 'space-between',
      fontFamily: 'Geist Mono, monospace',
      fontSize: 11,
      color: E_INV_INK_SOFT,
      letterSpacing: '.08em'
    }
  }, /*#__PURE__*/React.createElement("span", null, t.footer.note1), /*#__PURE__*/React.createElement("span", null, t.footer.note2))));
}
window.DirectionEditorial = DirectionEditorial;
