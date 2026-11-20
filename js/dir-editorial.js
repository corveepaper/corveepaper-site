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

// ─── Thème + animations (injectés une seule fois) ────────────────────────────
function ensureEditorialCSS() {
  if (document.getElementById('cp-editorial-css')) return;
  const s = document.createElement('style');
  s.id = 'cp-editorial-css';
  s.textContent = `
.cp-theme.light {
  --cp-bg:        #f5f6f8;
  --cp-bg-2:      #eceef2;
  --cp-ink:       #192230;
  --cp-ink-soft:  rgba(25,34,48,.66);
  --cp-ink-2:     rgba(25,34,48,.46);
  --cp-line:      rgba(25,34,48,.11);
  --cp-terra:     #365b86;
  --cp-terra-soft:#dfe8f2;
  --cp-card-bg:   #ffffff;
  --cp-card:      rgba(25,34,48,.05);
  --cp-nav-bg:    rgba(245,246,248,.82);
  --cp-inv-bg:        #192230;
  --cp-inv-ink:       #f5f6f8;
  --cp-inv-ink-soft:  rgba(245,246,248,.66);
  --cp-inv-line:      rgba(245,246,248,.16);
  --cp-inv-card:      rgba(245,246,248,.06);
  --cp-inv-accent:    #8fb3dc;
}
.cp-theme.dark {
  --cp-bg:        #11161f;
  --cp-bg-2:      #18202c;
  --cp-ink:       #eef0f3;
  --cp-ink-soft:  rgba(238,240,243,.64);
  --cp-ink-2:     rgba(238,240,243,.42);
  --cp-line:      rgba(238,240,243,.13);
  --cp-terra:     #6b9bd0;
  --cp-terra-soft:rgba(107,155,208,.18);
  --cp-card-bg:   #18202c;
  --cp-card:      rgba(238,240,243,.05);
  --cp-nav-bg:    rgba(17,22,31,.88);
  --cp-inv-bg:        #eef0f3;
  --cp-inv-ink:       #192230;
  --cp-inv-ink-soft:  rgba(25,34,48,.64);
  --cp-inv-line:      rgba(25,34,48,.14);
  --cp-inv-card:      rgba(25,34,48,.05);
  --cp-inv-accent:    #365b86;
}
.cp-theme { transition: background-color .4s, color .4s; }
.cp-theme * { transition: background-color .35s, color .35s, border-color .35s, fill .35s; }

@keyframes cp-blob1 { 0%,100% { transform: translate3d(0,0,0) scale(1) } 50% { transform: translate3d(120px,-60px,0) scale(1.15) } }
@keyframes cp-blob2 { 0%,100% { transform: translate3d(0,0,0) scale(1) } 50% { transform: translate3d(-90px,80px,0) scale(.85) } }
@keyframes cp-blob3 { 0%,100% { transform: translate3d(0,0,0) scale(1) } 50% { transform: translate3d(80px,40px,0) scale(1.1) } }
@keyframes cp-pop { 0% { transform: scale(.4); opacity: 0 } 60% { transform: scale(1.06); opacity: 1 } 100% { transform: scale(1) } }
@keyframes cp-confetti { from { transform: translateY(0) rotate(0) } to { transform: translateY(700px) rotate(720deg) } }
@keyframes cp-success-in { from { opacity: 0; transform: translateY(12px) } to { opacity: 1; transform: translateY(0) } }

/* ─── Entry animations (un écouteur de défilement ajoute .cp-in) ────────── */
.cp-reveal {
  opacity: 0; transform: translateY(28px);
  transition: opacity .9s cubic-bezier(.2,.7,.3,1), transform .9s cubic-bezier(.2,.7,.3,1);
  transition-delay: var(--cp-d, 0ms);
  will-change: opacity, transform;
}
.cp-reveal.cp-in { opacity: 1; transform: translateY(0); }
/* Titres : montée + mise au point. (Plus de clip-path : un élément entièrement
   rogné n'était jamais détecté comme visible, donc le titre restait caché.) */
.cp-wipe {
  opacity: 0; transform: translateY(26px); filter: blur(8px);
  transition: opacity .8s ease, transform .9s cubic-bezier(.2,.7,.3,1), filter .8s ease;
  transition-delay: var(--cp-d, 0ms);
}
.cp-wipe.cp-in { opacity: 1; transform: translateY(0); filter: blur(0); }
.cp-pop {
  opacity: 0; transform: scale(.96) translateY(20px);
  transition: opacity .7s ease, transform .7s cubic-bezier(.2,.7,.3,1);
  transition-delay: var(--cp-d, 0ms);
}
.cp-pop.cp-in { opacity: 1; transform: scale(1) translateY(0); }
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

/* ─── Motion ────────────────────────────────────────────────────────────── */
/* Titre du hero : chaque mot monte de derrière un cache. */
.cp-word { display: inline-block; overflow: hidden; vertical-align: bottom; padding-bottom: .14em; margin-bottom: -.14em; }
.cp-word > span {
  display: inline-block; transform: translateY(115%);
  animation: cp-word-up .9s cubic-bezier(.2,.7,.2,1) forwards;
  animation-delay: var(--cp-d, 0ms);
}
@keyframes cp-word-up { to { transform: translateY(0) } }
@keyframes cp-float { 0%,100% { transform: translateY(0) } 50% { transform: translateY(-10px) } }
/* Le vrai site défile tout seul dans la maquette. */
@keyframes cp-screen-scroll { 0%,10% { transform: translateY(0) } 90%,100% { transform: translateY(var(--cp-scroll, -60%)) } }
@keyframes cp-pulse { 0% { box-shadow: 0 0 0 0 rgba(54,91,134,.5) } 100% { box-shadow: 0 0 0 10px rgba(54,91,134,0) } }
[data-cp-parallax] { will-change: transform; }

.cp-card { transition: transform .35s cubic-bezier(.2,.7,.3,1), box-shadow .35s, border-color .35s !important; }
.cp-card:hover { transform: translateY(-6px); }
.cp-spot { position: relative; overflow: hidden; }
.cp-spot::before {
  content: ''; position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(440px circle at var(--mx, 50%) var(--my, 0%), rgba(107,155,208,.24), transparent 60%);
  opacity: 0; transition: opacity .3s;
}
.cp-spot:hover::before { opacity: 1; }
.cp-navlink:hover { background: var(--cp-card-bg); box-shadow: 0 1px 2px rgba(16,24,40,.10); }
.cp-arrow { display: inline-flex; transition: transform .3s cubic-bezier(.2,.7,.3,1) !important; }
a:hover > .cp-arrow, a:hover .cp-arrow { transform: translateX(5px); }
/* Méthode : pastilles qui s'allument quand la ligne les atteint. */
.cp-step-dot { transition: background .4s, color .4s, border-color .4s, transform .4s cubic-bezier(.2,.7,.3,1) !important; }
.cp-step-on .cp-step-dot { background: var(--cp-terra) !important; border-color: var(--cp-terra) !important; color: #fff !important; transform: scale(1.08); }

@media (prefers-reduced-motion: reduce) {
  .cp-reveal, .cp-wipe, .cp-pop, .cp-slide-l, .cp-slide-r {
    opacity: 1 !important; transform: none !important; filter: none !important;
  }
  .cp-word > span { transform: none !important; animation: none !important; }
  [data-cp-parallax] { transform: none !important; }
}

.cp-faq summary { list-style: none; cursor: pointer; }
.cp-faq summary::-webkit-details-marker { display: none; }
.cp-faq details[open] .cp-faq-plus { transform: rotate(45deg); }
.cp-faq-plus { transition: transform .3s ease !important; }
`;
  document.head.appendChild(s);
}

// ─── Réglages à compléter par Edgar (vide = l'élément n'est pas affiché) ─────
const E_PHONE = ''; // ex. '06 12 34 56 78' → affiche un bouton d'appel
const E_BOOKING_URL = ''; // ex. 'https://cal.com/…' → affiche « Réserver un créneau »
const E_PHOTO = ''; // ex. 'img/edgar.jpg' → remplace la carte monogramme

// Typo « display » (titres) — sans-serif nette, esprit fintech.
const E_DISPLAY = "'Geist', -apple-system, 'SF Pro Display', system-ui, sans-serif";
const E_WRAP = {
  maxWidth: 1180,
  margin: '0 auto'
};
const E_SHADOW = '0 1px 2px rgba(16,24,40,.04), 0 16px 36px -20px rgba(16,24,40,.22)';
const E_TEL_HREF = E_PHONE ? 'tel:+33' + E_PHONE.replace(/\D/g, '').replace(/^0/, '') : '';

// Défilement doux vers une section ; peut présélectionner le format du formulaire.
const cpGoTo = (id, format) => e => {
  if (format) {
    const sel = document.querySelector('select[name="format"]');
    if (sel) sel.value = format;
  }
  const tg = document.querySelector(id);
  if (tg) {
    e.preventDefault();
    tg.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
};

// Halo qui suit la souris sur les cartes (.cp-spot).
const cpSpot = e => {
  const r = e.currentTarget.getBoundingClientRect();
  e.currentTarget.style.setProperty('--mx', `${e.clientX - r.left}px`);
  e.currentTarget.style.setProperty('--my', `${e.clientY - r.top}px`);
};
function Eyebrow({
  children,
  inv
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      fontSize: 13,
      fontWeight: 600,
      letterSpacing: '.02em',
      color: inv ? 'var(--cp-inv-accent)' : E_TERRA,
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 18,
      height: 2,
      borderRadius: 2,
      background: 'currentColor'
    }
  }), children);
}
function Check({
  color
}) {
  return /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      marginTop: 2
    }
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "9",
    cy: "9",
    r: "9",
    fill: color || E_TERRA,
    opacity: ".16"
  }), /*#__PURE__*/React.createElement("path", {
    d: "M5.2 9.3l2.5 2.5 5-5.4",
    stroke: color || E_TERRA,
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
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
  }, "Si vous lisez ce message, vous travaillez probablement aussi soigneusement que moi. On va bien s\u2019entendre."), /*#__PURE__*/React.createElement("p", {
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

// ────────────────────────────────────────────────────────────────────────────
// TEXTES — tout le contenu de la page d'accueil est ici.
// ────────────────────────────────────────────────────────────────────────────
const E_COPY = {
  nav: [{
    label: 'Qui je suis',
    href: '#apropos'
  }, {
    label: 'Services',
    href: '#services'
  }, {
    label: 'Méthode',
    href: '#methode'
  }, {
    label: 'Exemples',
    href: '#travaux'
  }, {
    label: 'Suivi',
    href: '#maintenance'
  }, {
    label: 'FAQ',
    href: '#faq'
  }],
  avail: 'Nouveaux projets ouverts',
  hero: {
    pill: 'Nouveaux projets ouverts · Clamart (92)',
    h1a: ['Votre', 'site', 'professionnel,', 'sur', 'mesure,'],
    h1b: ['en', 'ligne', 'en', '14', 'jours.'],
    sub: 'Je crée des sites clairs, rapides et parfaits sur téléphone pour les praticiens, artisans et restaurateurs indépendants. Le prix est annoncé avant de commencer : à partir de 890 €.',
    cta: 'Parler de votre projet',
    cta2: 'Voir des exemples',
    reassure: ['30 minutes d’échange offertes', 'Devis gratuit', 'Réponse sous 24 h'],
    caption: 'Concept de démonstration — Cabinet Lacombe',
    quote: {
      label: 'Votre devis',
      price: 'dès 890 €',
      rows: [['Acompte', '40 %'], ['Paiement', '3 fois sans frais']]
    },
    clear: {
      title: 'Tout est clair avant de commencer.',
      stepsTitle: 'Votre projet, étape par étape',
      badge: '14 jours',
      priceLabel: 'Prix fixé à l’avance',
      priceNote: 'Acompte de 40 % à la signature',
      payLabel: 'Paiement',
      payBig: '3 fois',
      payNote: 'sans frais, si vous le souhaitez',
      tiles: [['Parfait sur téléphone', 'Vos clients vous cherchent depuis leur téléphone. Le site est pensé pour eux en premier.'], ['Un seul interlocuteur', 'Du premier échange à la mise en ligne, vous savez à qui vous parlez.'], ['Réponse sous 24 h', 'Je réponds à chaque demande sous 24 heures ouvrées.']]
    }
  },
  about: {
    eyebrow: 'Qui je suis',
    titleA: 'Un seul interlocuteur,',
    titleB: 'du premier échange à la mise en ligne.',
    p1: 'Je m’appelle Edgar Jacquemart. Corvee Paper, c’est moi : je m’occupe de tout, du design à la mise en ligne. Vous savez toujours à qui vous parlez.',
    p2: 'Beaucoup d’indépendants font un travail impeccable, puis renvoient leurs clients vers un site lent, illisible sur téléphone ou introuvable. Mon travail : un site clair et rapide, qui rassure et donne envie de vous appeler.',
    points: [['Basé à Clamart', 'Je me déplace dans les Hauts-de-Seine et à Paris. Ailleurs, on se parle par téléphone ou en visio.'], ['Pas de mauvaise surprise', 'Le prix et la date de livraison sont fixés avant de commencer.'], ['Le site est à vous', 'Nom de domaine à votre nom, site remis à la fin : vous en restez propriétaire.']],
    cardName: 'Edgar Jacquemart',
    cardRole: 'Créateur de sites web',
    cardPlace: 'Clamart · Hauts-de-Seine'
  },
  services: {
    eyebrow: 'Services',
    title: 'Trois formules, un prix clair.',
    cards: [{
      t: 'Refonte',
      s: 'Vous avez déjà un site',
      d: 'Il a vieilli, s’affiche mal sur téléphone ou ne vous amène personne. Je le reprends entièrement.',
      from: 'dès 890 €',
      format: 'Refonte · dès 890 €',
      cta: 'Demander un devis',
      feats: ['Textes, design et technique repris', 'Parfait sur téléphone', 'Le site reste à vous']
    }, {
      t: 'Création',
      s: 'Vous partez de zéro',
      d: 'Vous vous lancez ou vous n’avez jamais eu de site. Je m’occupe de tout.',
      from: 'dès 890 €',
      format: 'Création · dès 890 €',
      cta: 'Demander un devis',
      featured: true,
      badge: 'Clé en main',
      feats: ['Du nom de domaine à la mise en ligne', 'Maquette validée avant la construction', 'Parfait sur téléphone']
    }, {
      t: 'Application',
      s: 'Un outil sur mesure',
      d: 'Prise de rendez-vous, espace client, outil interne : un outil pensé pour votre façon de travailler.',
      from: 'sur devis',
      format: 'Application · sur devis',
      cta: 'En parler',
      feats: ['On en parle d’abord, sans engagement', 'Prix annoncé avant de commencer', 'Un seul interlocuteur']
    }],
    payLine: 'Acompte de 40 % · Paiement en 3 fois sans frais possible',
    includedTitle: 'Compris dans chaque site, dès 890 €',
    included: ['Un design sur mesure, pas un modèle', 'Une version ordinateur et une version téléphone', 'Un formulaire de contact et un bouton d’appel', 'Un nom de domaine à votre nom', 'La mise en ligne', 'Une base propre pour être trouvé sur Google', '30 minutes de prise en main', 'Un aller-retour de corrections à chaque étape'],
    footnote: 'Acompte de 40 % à la signature, solde à la livraison. Paiement en 3 fois sans frais possible.'
  },
  process: {
    eyebrow: 'Méthode',
    title: 'Quatre étapes, zéro mauvaise surprise.',
    steps: [{
      n: '1',
      t: 'On en parle',
      d: '30 minutes, par téléphone, en visio ou autour d’un café à Clamart. Vous repartez avec un devis et une date de livraison.',
      when: 'Jour 1'
    }, {
      n: '2',
      t: 'La maquette',
      d: 'Je vous montre à quoi ressemblera votre site avant de le construire. Vous validez, j’ajuste.',
      when: 'Jours 2 à 6'
    }, {
      n: '3',
      t: 'La construction',
      d: 'Je construis le site : rapide, sécurisé, parfait sur téléphone.',
      when: 'Jours 7 à 12'
    }, {
      n: '4',
      t: 'La mise en ligne',
      d: 'Je mets le site en ligne à votre nom et je vous montre comment il marche. Je reste joignable ensuite.',
      when: 'Jours 13 et 14'
    }]
  },
  travaux: {
    eyebrow: 'Exemples',
    title: 'Six exemples à parcourir.',
    note: 'Ce sont des concepts de démonstration, pas des commandes de clients : de vrais sites, navigables, pour voir concrètement ce que je peux faire pour vous.',
    all: 'Voir toute la galerie'
  },
  maintenance: {
    eyebrow: 'Suivi',
    title: 'Le site est en ligne. Et ensuite ?',
    sub: 'Trois forfaits pour rester tranquille. Sans engagement, résiliable à tout moment.',
    tiers: [{
      tag: 'Sérénité',
      badge: 'L’essentiel',
      t: 'Le site reste en ligne et protégé.',
      d: 'Hébergement, sauvegardes, surveillance du site et 30 minutes de modifications par mois.',
      price: '19'
    }, {
      tag: 'Évolution',
      badge: 'Celui que je conseille',
      t: 'Pour faire vivre le site.',
      d: 'Tout Sérénité, plus 2 heures de modifications par mois et l’ajout de nouvelles sections à la demande.',
      price: '49',
      featured: true
    }, {
      tag: 'Croissance',
      badge: 'Visibilité Google',
      t: 'Pour être trouvé plus souvent.',
      d: 'Tout Évolution, plus un article par mois rédigé pour Google, le suivi de vos positions et mes recommandations.',
      price: '99'
    }],
    cta: 'En parler'
  },
  faq: {
    eyebrow: 'Questions fréquentes',
    title: 'Les questions qu’on me pose.',
    items: [['C’est fait pour qui, exactement ?', 'Pour les indépendants dont le métier mérite mieux qu’une fiche Google : praticiens du bien-être (ostéos, sophrologues, coachs…), artisans, restaurateurs, professions libérales.'], ['En quoi c’est différent d’un Wix ou d’un Squarespace ?', 'Avec un éditeur grand public, vous payez un abonnement à vie pour un site souvent lent, qui ressemble à mille autres. Je vous livre un site sur mesure, rapide, à votre image, et dont vous êtes propriétaire.'], ['14 jours, c’est sérieux ?', 'Oui, pour une refonte ou une création classique, à condition que vous me fournissiez les textes, photos et accès en début de projet. Si la collecte traîne, le compteur ne court pas. Je vous préviens d’office en cas de retard.'], ['Je n’ai ni logo ni photos. C’est bloquant ?', 'Non. Je compose avec ce que vous avez et je vous oriente vers des solutions simples pour le reste (séance photo locale, logo simple). Je ne vous laisse pas seul.'], ['Pourrai-je modifier le site moi-même ?', 'Selon le projet, je peux prévoir un espace simple pour modifier vous-même textes, photos, horaires et tarifs. Sinon, je fais les modifications pour vous avec un forfait de suivi.'], ['Qui gère l’hébergement et le nom de domaine ?', 'Moi. Je commande le nom de domaine à votre nom (vous en restez propriétaire) et je m’occupe de l’hébergement. Vous n’avez rien de technique à gérer.'], ['Le référencement Google est-il garanti ?', 'Personne ne peut le garantir honnêtement. Ce que je garantis, c’est une base saine : pages rapides, structure propre, textes bien organisés. Le reste se construit dans la durée, avec le forfait Croissance.'], ['Et si je ne suis pas satisfait ?', 'Un aller-retour de corrections est compris à chaque étape (maquette, construction). Au-delà, j’ajuste sans facturer si la cause vient de moi. Mon objectif : que vous soyez fier de votre site.']]
  },
  contact: {
    eyebrow: 'Contact',
    title: 'Parlons de votre projet.',
    titleAccent: '30 minutes, sans engagement.',
    sub: 'Je réponds à toutes les demandes sous 24 heures ouvrées. Si je ne suis pas le bon choix pour vous, je vous le dis franchement.',
    fields: {
      name: 'Prénom et nom',
      email: 'Email',
      activite: 'Votre activité',
      activitePlaceholder: 'ostéopathe, ébéniste, restaurateur…',
      format: 'Type de projet',
      message: 'Quelques mots sur le projet'
    },
    formats: ['Je ne sais pas encore', 'Refonte · dès 890 €', 'Création · dès 890 €', 'Application · sur devis', 'Forfait de suivi'],
    rgpd: 'En envoyant ce formulaire vous acceptez que vos données soient utilisées uniquement pour répondre à votre demande. Aucun envoi commercial.',
    send: 'Envoyer ma demande',
    zone: 'Clamart · Hauts-de-Seine · Paris — et à distance partout en France',
    delay: 'Réponse sous 24 h ouvrées',
    call: 'Appeler',
    book: 'Réserver un créneau'
  },
  footer: {
    blurb: 'Sites web sur mesure pour praticiens, artisans et restaurateurs indépendants. Basé à Clamart (92), j’interviens en Île-de-France et à distance partout en France.',
    navCol: 'Navigation',
    legalCol: 'Légal',
    legalLinks: [['Mentions légales', 'mentions-legales.html'], ['Politique de confidentialité', 'confidentialite.html'], ['Conditions générales de vente', 'cgv.html']],
    note1: '© 2026 Corvee Paper · SIRET 105 561 716 00017',
    note2: 'Fait à Clamart · Aucun cookie'
  }
};

// ════════════════════════════════════════════════════════════════════════════
// FORMULAIRE DE CONTACT — envoi vers Formspree sans quitter la page.
// ════════════════════════════════════════════════════════════════════════════
const FORMSPREE_ENDPOINT = 'https://formspree.io/f/mqejbpry';
const E_FIELD = {
  background: E_INV_CARD,
  border: `1px solid ${E_INV_LINE}`,
  borderRadius: 12,
  padding: '14px 16px',
  color: E_INV_INK,
  fontSize: 16,
  fontFamily: 'inherit',
  outline: 'none',
  width: '100%',
  boxSizing: 'border-box'
};
const E_LABEL = {
  fontSize: 13,
  fontWeight: 500,
  color: E_INV_INK_SOFT
};
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
  if (status === 'success') {
    return /*#__PURE__*/React.createElement("div", {
      style: {
        padding: 48,
        background: E_INV_CARD,
        border: `1px solid ${E_INV_LINE}`,
        borderRadius: 24,
        display: 'grid',
        gap: 16,
        alignContent: 'center',
        textAlign: 'center',
        minHeight: 380,
        animation: 'cp-success-in .5s cubic-bezier(.2,.7,.3,1) both'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        fontWeight: 600,
        color: 'var(--cp-inv-accent)'
      }
    }, "Demande re\xE7ue"), /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontFamily: E_DISPLAY,
        fontWeight: 600,
        fontSize: 34,
        lineHeight: 1.1,
        color: E_INV_INK,
        letterSpacing: '-.03em'
      }
    }, "Merci. Je reviens vers vous sous 24 h."), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 15,
        lineHeight: 1.6,
        color: E_INV_INK_SOFT
      }
    }, "Si vous ne voyez pas ma r\xE9ponse, jetez un \u0153il aux ind\xE9sirables : j\u2019\xE9cris depuis contact@corveepaper.fr."));
  }
  return /*#__PURE__*/React.createElement("form", {
    "data-cp-anim": true,
    className: "cp-reveal",
    onSubmit: onSubmit,
    action: FORMSPREE_ENDPOINT,
    method: "POST",
    style: {
      padding: 32,
      background: E_INV_CARD,
      border: `1px solid ${E_INV_LINE}`,
      borderRadius: 24,
      display: 'grid',
      gap: 18,
      alignContent: 'start',
      '--cp-d': '150ms'
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
    required: true,
    ac: 'name'
  }, {
    id: 'email',
    label: t.contact.fields.email,
    type: 'email',
    required: true,
    ac: 'email'
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
    style: E_LABEL
  }, f.label), /*#__PURE__*/React.createElement("input", {
    type: f.type,
    name: f.id,
    placeholder: f.placeholder,
    required: f.required,
    autoComplete: f.ac,
    style: E_FIELD
  }))), /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'grid',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: E_LABEL
  }, t.contact.fields.format), /*#__PURE__*/React.createElement("select", {
    name: "format",
    style: {
      ...E_FIELD,
      appearance: 'none',
      WebkitAppearance: 'none',
      cursor: 'pointer',
      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1.5l5 5 5-5' fill='none' stroke='%238a94a3' stroke-width='1.8' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E\")",
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'right 16px center',
      paddingRight: 40
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
    style: E_LABEL
  }, t.contact.fields.message), /*#__PURE__*/React.createElement("textarea", {
    name: "message",
    rows: 4,
    required: true,
    style: {
      ...E_FIELD,
      resize: 'vertical'
    }
  })), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 12,
      lineHeight: 1.55,
      color: E_INV_INK_SOFT
    }
  }, t.contact.rgpd), status === 'error' && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      fontSize: 13,
      color: '#ff8b6b'
    }
  }, "Erreur d\u2019envoi. R\xE9essayez ou \xE9crivez directement \xE0 ", /*#__PURE__*/React.createElement("strong", null, "contact@corveepaper.fr"), "."), /*#__PURE__*/React.createElement("button", {
    type: "submit",
    disabled: status === 'sending',
    style: {
      padding: '17px 24px',
      borderRadius: 99,
      background: 'var(--cp-inv-accent)',
      color: 'var(--cp-inv-bg)',
      border: 0,
      cursor: status === 'sending' ? 'wait' : 'pointer',
      opacity: status === 'sending' ? 0.6 : 1,
      fontFamily: 'inherit',
      fontSize: 15,
      fontWeight: 600,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      width: '100%'
    }
  }, status === 'sending' ? 'Envoi…' : t.contact.send, /*#__PURE__*/React.createElement("span", {
    className: "cp-arrow"
  }, "\u2192")));
}

// Chiffre qui compte jusqu'à sa valeur quand il apparaît à l'écran.
function CountUp({
  to,
  prefix = '',
  suffix = ''
}) {
  const ref = useRef(null);
  const [v, setV] = useState(to);
  useEffect(() => {
    const el = ref.current;
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!el || reduce || !('IntersectionObserver' in window) || to < 5) return;
    let raf = 0,
      safety = 0,
      started = false;
    setV(0);
    const io = new IntersectionObserver(entries => {
      if (started || !entries.some(e => e.isIntersecting)) return;
      started = true;
      io.disconnect();
      const t0 = performance.now(),
        dur = 1300;
      const tick = now => {
        const p = Math.min(1, (now - t0) / dur);
        setV(Math.round(to * (1 - Math.pow(1 - p, 3))));
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      // Filet de sécurité : la valeur finale s'affiche quoi qu'il arrive.
      safety = setTimeout(() => setV(to), dur + 600);
    }, {
      threshold: 0.2
    });
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      clearTimeout(safety);
    };
  }, [to]);
  return /*#__PURE__*/React.createElement("span", {
    ref: ref,
    style: {
      fontVariantNumeric: 'tabular-nums'
    }
  }, prefix, v, suffix);
}

// Fond du haut de page : deux halos + une grille de points, en parallaxe.
function HeroBG({
  dark
}) {
  const a = dark ? 'rgba(107,155,208,.30)' : 'rgba(54,91,134,.26)';
  const b = dark ? 'rgba(154,130,112,.20)' : 'rgba(154,130,112,.22)';
  const dot = dark ? 'rgba(231,232,234,.10)' : 'rgba(25,34,48,.10)';
  return /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
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
      inset: 0,
      backgroundImage: `radial-gradient(${dot} 1px, transparent 1px)`,
      backgroundSize: '26px 26px',
      WebkitMaskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 20%, transparent 75%)',
      maskImage: 'radial-gradient(ellipse 70% 60% at 50% 30%, #000 20%, transparent 75%)'
    }
  }), /*#__PURE__*/React.createElement("div", {
    "data-cp-parallax": "0.22",
    style: {
      position: 'absolute',
      left: '-12%',
      top: '-24%',
      width: 700,
      height: 700
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: `radial-gradient(circle, ${a} 0%, transparent 62%)`,
      filter: 'blur(40px)',
      animation: 'cp-blob1 18s ease-in-out infinite'
    }
  })), /*#__PURE__*/React.createElement("div", {
    "data-cp-parallax": "-0.16",
    style: {
      position: 'absolute',
      right: '-8%',
      top: '18%',
      width: 620,
      height: 620
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      height: '100%',
      background: `radial-gradient(circle, ${b} 0%, transparent 64%)`,
      filter: 'blur(50px)',
      animation: 'cp-blob2 22s ease-in-out infinite'
    }
  })));
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [eggOpen, setEggOpen] = useState(false);
  const wrapRef = useRef(null);
  const t = E_COPY;
  useEffect(() => {
    ensureEditorialCSS();
    if (!window.__cpGreeted) {
      window.__cpGreeted = true;
      console.log('%c\n  Corvee Paper  \n%c  Studio indépendant · Clamart\n  contact@corveepaper.fr\n  ↳ 7 clics sur le logo pour une surprise\n', 'background:#365b86;color:#e7e8ea;font:600 16px/2 "Spectral",serif;padding:6px 10px', 'color:#9B9690;font:12px/1.6 monospace');
    }
  }, []);

  // ─── Animations au défilement ──────────────────────────────────────────
  // Un seul écouteur de défilement fait trois choses :
  //  1. révèle les éléments [data-cp-anim] dès qu'ils entrent dans l'écran
  //     (simple mesure de position : fiable partout, contrairement à
  //     l'ancien IntersectionObserver qui ratait les titres) ;
  //  2. parallaxe : décale les éléments [data-cp-parallax] selon leur vitesse ;
  //  3. méthode : fait avancer la ligne et allume les étapes.
  useEffect(() => {
    const root = wrapRef.current;
    if (!root) return;
    // Le haut de page s'anime tout de suite.
    root.querySelectorAll('[data-cp-anim-hero]').forEach(el => el.classList.add('cp-in'));
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let ticking = false;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight || 800;
      root.querySelectorAll('[data-cp-anim]:not(.cp-in)').forEach(el => {
        if (el.getBoundingClientRect().top < vh * 0.9) el.classList.add('cp-in');
      });
      if (!reduce) {
        root.querySelectorAll('[data-cp-parallax]').forEach(el => {
          const host = el.parentElement.getBoundingClientRect();
          if (host.bottom < -200 || host.top > vh + 200) return;
          const speed = parseFloat(el.getAttribute('data-cp-parallax')) || 0;
          const delta = host.top + host.height / 2 - vh / 2;
          el.style.transform = `translate3d(0, ${(delta * speed).toFixed(1)}px, 0)`;
        });
      }
      const method = root.querySelector('#cp-method-steps');
      if (method) {
        const r = method.getBoundingClientRect();
        const p = Math.max(0, Math.min(1, (vh * 0.78 - r.top) / (r.height + vh * 0.18)));
        const line = method.querySelector('[data-cp-line]');
        if (line) {
          line.style.transform = line.getAttribute('data-cp-line') === 'y' ? `scaleY(${p})` : `scaleX(${p})`;
        }
        const steps = method.querySelectorAll('[data-cp-step]');
        steps.forEach((s, i) => s.classList.toggle('cp-step-on', p > (i + 0.35) / steps.length));
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    update();
    // Filet de sécurité : si requestAnimationFrame est ralenti (onglet en
    // arrière-plan), on refait une passe directe peu après le chargement.
    const t1 = setTimeout(update, 400);
    window.addEventListener('scroll', onScroll, {
      passive: true
    });
    window.addEventListener('resize', onScroll);
    return () => {
      clearTimeout(t1);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [isMobile]);

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
      position: 'relative',
      overflowX: 'clip'
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
      padding: isMobile ? '14px 20px' : '18px 56px',
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
  }), !isMobile && logoClicks > 0 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: E_TERRA
    }
  }, logoClicks, "/7")), isMobile ? /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(ThemeToggle, {
    theme: theme,
    setTheme: setTheme
  }), /*#__PURE__*/React.createElement("button", {
    type: "button",
    "aria-label": menuOpen ? 'Fermer le menu' : 'Ouvrir le menu',
    "aria-expanded": menuOpen,
    onClick: () => setMenuOpen(o => !o),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: 42,
      height: 42,
      borderRadius: 12,
      padding: 0,
      border: `1px solid ${E_LINE}`,
      background: E_BG,
      color: E_INK,
      cursor: 'pointer'
    }
  }, /*#__PURE__*/React.createElement("svg", {
    width: "18",
    height: "18",
    viewBox: "0 0 18 18",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.6",
    strokeLinecap: "round"
  }, menuOpen ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "3",
    y1: "3",
    x2: "15",
    y2: "15"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "15",
    y1: "3",
    x2: "3",
    y2: "15"
  })) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("line", {
    x1: "2",
    y1: "5",
    x2: "16",
    y2: "5"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "2",
    y1: "9",
    x2: "16",
    y2: "9"
  }), /*#__PURE__*/React.createElement("line", {
    x1: "2",
    y1: "13",
    x2: "16",
    y2: "13"
  }))))) : /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 16,
      alignItems: 'center',
      fontSize: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 2,
      padding: 5,
      borderRadius: 99,
      background: E_CARD
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
    className: "cp-navlink",
    style: {
      color: E_INK,
      textDecoration: 'none',
      cursor: 'pointer',
      display: 'inline-block',
      padding: '8px 14px',
      borderRadius: 99,
      fontWeight: 500
    }
  }, item.label)))), /*#__PURE__*/React.createElement(ThemeToggle, {
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
  }, "\u2192")))), isMobile && menuOpen && /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: '100%',
      left: 0,
      right: 0,
      background: E_BG,
      borderBottom: `1px solid ${E_LINE}`,
      boxShadow: '0 24px 40px -24px rgba(16, 22, 31, .5)',
      display: 'flex',
      flexDirection: 'column',
      padding: '4px 20px 20px'
    }
  }, t.nav.map(item => /*#__PURE__*/React.createElement("a", {
    key: item.label,
    href: item.href,
    "data-cp-hot": true,
    onClick: e => {
      const target = document.querySelector(item.href);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
      setMenuOpen(false);
    },
    style: {
      color: E_INK,
      textDecoration: 'none',
      cursor: 'pointer',
      fontSize: 17,
      padding: '15px 0',
      borderBottom: `1px solid ${E_LINE}`
    }
  }, item.label)), /*#__PURE__*/React.createElement("a", {
    "data-cp-hot": true,
    href: "#contact",
    onClick: e => {
      const target = document.querySelector('#contact');
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: 'smooth'
        });
      }
      setMenuOpen(false);
    },
    style: {
      marginTop: 18,
      padding: '16px 22px',
      background: E_INK,
      color: E_BG,
      borderRadius: 99,
      fontSize: 15,
      fontWeight: 500,
      cursor: 'pointer',
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8
    }
  }, "Discutons ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 13
    }
  }, "\u2192")))), /*#__PURE__*/React.createElement("section", {
    id: "top",
    style: {
      padding: isMobile ? '56px 18px' : '84px 56px 72px',
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement(HeroBG, {
    dark: theme === 'dark'
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      ...E_WRAP,
      position: 'relative',
      zIndex: 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      maxWidth: 900,
      margin: '0 auto',
      textAlign: 'center',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim-hero": true,
    className: "cp-reveal",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      padding: '7px 14px 7px 12px',
      borderRadius: 99,
      background: E_CARD_BG,
      border: `1px solid ${E_LINE}`,
      fontSize: 13,
      fontWeight: 500,
      color: E_INK,
      boxShadow: E_SHADOW
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 8,
      height: 8,
      borderRadius: 99,
      background: E_TERRA,
      animation: 'cp-pulse 1.8s ease-out infinite'
    }
  }), t.hero.pill), /*#__PURE__*/React.createElement("h1", {
    style: {
      margin: isMobile ? '22px 0 0' : '28px 0 0',
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      fontSize: 76,
      lineHeight: 1.03,
      letterSpacing: '-.045em',
      color: E_INK
    }
  }, t.hero.h1a.map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: 'a' + i
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-word"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      '--cp-d': `${80 + i * 70}ms`
    }
  }, w)), ' ')), /*#__PURE__*/React.createElement("span", {
    style: {
      color: E_TERRA
    }
  }, t.hero.h1b.map((w, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: 'b' + i
  }, /*#__PURE__*/React.createElement("span", {
    className: "cp-word"
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      '--cp-d': `${80 + (i + t.hero.h1a.length) * 70}ms`
    }
  }, w)), ' ')))), /*#__PURE__*/React.createElement("p", {
    "data-cp-anim-hero": true,
    className: "cp-reveal",
    style: {
      margin: '24px 0 0',
      fontSize: isMobile ? 17 : 19,
      lineHeight: 1.55,
      color: E_INK_SOFT,
      maxWidth: 620,
      '--cp-d': '500ms'
    }
  }, t.hero.sub), /*#__PURE__*/React.createElement("div", {
    "data-cp-anim-hero": true,
    className: "cp-reveal",
    style: {
      marginTop: 30,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: 12,
      '--cp-d': '650ms'
    }
  }, /*#__PURE__*/React.createElement(Magnetic, {
    strength: 0.16
  }, /*#__PURE__*/React.createElement("a", {
    href: "#contact",
    onClick: cpGoTo('#contact'),
    style: {
      padding: '17px 28px',
      borderRadius: 99,
      background: E_TERRA,
      color: E_BG,
      fontSize: 16,
      fontWeight: 600,
      textDecoration: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      boxShadow: '0 14px 30px -14px rgba(54,91,134,.7)'
    }
  }, t.hero.cta, " ", /*#__PURE__*/React.createElement("span", {
    className: "cp-arrow"
  }, "\u2192"))), /*#__PURE__*/React.createElement("a", {
    href: "#travaux",
    onClick: cpGoTo('#travaux'),
    style: {
      padding: '17px 26px',
      borderRadius: 99,
      background: E_CARD_BG,
      color: E_INK,
      border: `1px solid ${E_LINE}`,
      fontSize: 16,
      fontWeight: 600,
      textDecoration: 'none',
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10
    }
  }, t.hero.cta2)), /*#__PURE__*/React.createElement("ul", {
    "data-cp-anim-hero": true,
    className: "cp-reveal",
    style: {
      listStyle: 'none',
      margin: '26px 0 0',
      padding: 0,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'center',
      gap: isMobile ? '8px 18px' : '10px 22px',
      fontSize: 14,
      color: E_INK_SOFT,
      '--cp-d': '800ms'
    }
  }, t.hero.reassure.map(r => /*#__PURE__*/React.createElement("li", {
    key: r,
    style: {
      display: 'inline-flex',
      alignItems: 'flex-start',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(Check, null), " ", r)))), /*#__PURE__*/React.createElement("div", {
    "data-cp-anim-hero": true,
    className: "cp-pop",
    style: {
      marginTop: isMobile ? 40 : 64,
      '--cp-d': '350ms'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      overflow: 'hidden',
      background: E_TERRA_SOFT,
      borderRadius: isMobile ? 24 : 36,
      padding: isMobile ? '20px 16px 0' : '56px 56px 0',
      display: 'flex',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: '100%',
      maxWidth: 860,
      background: E_CARD_BG,
      borderRadius: isMobile ? '14px 14px 0 0' : '18px 18px 0 0',
      overflow: 'hidden',
      boxShadow: '0 30px 80px -20px rgba(16,24,40,.35)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 7,
      padding: isMobile ? '9px 12px' : '12px 16px',
      borderBottom: `1px solid ${E_LINE}`
    }
  }, [0, 1, 2].map(k => /*#__PURE__*/React.createElement("span", {
    key: k,
    style: {
      width: 9,
      height: 9,
      borderRadius: 99,
      background: E_LINE
    }
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 10,
      flex: 1,
      padding: '5px 13px',
      borderRadius: 99,
      background: E_CARD,
      fontSize: 12,
      color: E_INK_SOFT
    }
  }, "cabinet-lacombe.fr")), /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: isMobile ? '4 / 3.3' : '16 / 8.6',
      overflow: 'hidden',
      background: '#f8f6f1'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "img/demo-lacombe-ordinateur.jpg",
    alt: "Aper\xE7u du site de d\xE9monstration Cabinet Lacombe sur ordinateur",
    width: "960",
    height: "1950",
    style: {
      display: 'block',
      width: '100%',
      height: 'auto',
      '--cp-scroll': '-67%',
      animation: 'cp-screen-scroll 16s ease-in-out 1.2s infinite alternate'
    }
  }))), !isMobile && /*#__PURE__*/React.createElement("div", {
    "data-cp-parallax": "-0.06",
    style: {
      position: 'absolute',
      left: 40,
      bottom: 56,
      width: 250
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: E_CARD_BG,
      borderRadius: 20,
      padding: 20,
      border: `1px solid ${E_LINE}`,
      boxShadow: '0 20px 50px -12px rgba(16,24,40,.35)',
      display: 'grid',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      fontWeight: 500,
      color: E_INK_SOFT
    }
  }, t.hero.quote.label), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: E_DISPLAY,
      fontSize: 30,
      fontWeight: 600,
      letterSpacing: '-.03em',
      color: E_INK
    }
  }, t.hero.quote.price), /*#__PURE__*/React.createElement("div", {
    style: {
      height: 1,
      background: E_LINE
    }
  }), t.hero.quote.rows.map(([a, b]) => /*#__PURE__*/React.createElement("div", {
    key: a,
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      gap: 10,
      fontSize: 13.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      color: E_INK_SOFT
    }
  }, a), /*#__PURE__*/React.createElement("span", {
    style: {
      fontWeight: 600,
      color: E_INK
    }
  }, b))))), /*#__PURE__*/React.createElement("div", {
    "data-cp-parallax": isMobile ? '-0.03' : '-0.08',
    style: {
      position: 'absolute',
      right: isMobile ? 14 : 56,
      bottom: isMobile ? -18 : -24,
      width: isMobile ? 92 : 190
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      animation: 'cp-float 6s ease-in-out infinite'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: isMobile ? 18 : 30,
      padding: isMobile ? 4 : 7,
      background: '#141b27',
      boxShadow: '0 30px 60px -22px rgba(16,24,40,.6)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: isMobile ? 14 : 23,
      overflow: 'hidden',
      aspectRatio: '780 / 1688',
      background: '#f8f6f1'
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "img/demo-lacombe-telephone.jpg",
    alt: "Le m\xEAme site sur t\xE9l\xE9phone",
    width: "780",
    height: "1688",
    style: {
      display: 'block',
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      objectPosition: 'top'
    }
  })))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      fontSize: 12.5,
      color: E_INK_2
    }
  }, t.hero.caption)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: isMobile ? 56 : 104
    }
  }, /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      maxWidth: 720,
      fontSize: 48,
      lineHeight: 1.06,
      letterSpacing: '-.035em'
    }
  }, t.hero.clear.title), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: isMobile ? 24 : 40,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1.3fr 1fr',
      gap: isMobile ? 12 : 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-pop",
    style: {
      display: 'flex'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: E_CARD_BG,
      border: `1px solid ${E_LINE}`,
      borderRadius: 24,
      padding: isMobile ? 20 : 28,
      boxShadow: E_SHADOW
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: E_DISPLAY,
      fontSize: isMobile ? 17 : 19,
      fontWeight: 600,
      letterSpacing: '-.01em'
    }
  }, t.hero.clear.stepsTitle), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: '5px 11px',
      borderRadius: 8,
      background: E_TERRA_SOFT,
      color: E_TERRA,
      fontSize: 12.5,
      fontWeight: 600,
      whiteSpace: 'nowrap'
    }
  }, t.hero.clear.badge)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 10
    }
  }, t.process.steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 14,
      padding: isMobile ? '13px 0' : '15px 0',
      borderBottom: i < t.process.steps.length - 1 ? `1px solid ${E_LINE}` : 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      width: 30,
      height: 30,
      borderRadius: 99,
      flexShrink: 0,
      background: E_TERRA,
      color: E_BG,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 13,
      fontWeight: 600
    }
  }, s.n), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      fontSize: isMobile ? 15 : 16,
      fontWeight: 500
    }
  }, s.t), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13.5,
      color: E_INK_SOFT,
      whiteSpace: 'nowrap'
    }
  }, s.when)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gap: isMobile ? 12 : 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-pop",
    style: {
      display: 'flex',
      '--cp-d': '90ms'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: E_INV_BG,
      color: E_INV_INK,
      borderRadius: 24,
      padding: isMobile ? 22 : 28,
      display: 'grid',
      gap: 6,
      alignContent: 'center',
      boxShadow: '0 30px 60px -30px rgba(16,24,40,.5)'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: E_INV_INK_SOFT
    }
  }, t.hero.clear.priceLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: E_DISPLAY,
      fontSize: isMobile ? 34 : 42,
      fontWeight: 600,
      letterSpacing: '-.04em',
      lineHeight: 1.1
    }
  }, /*#__PURE__*/React.createElement(CountUp, {
    to: 890,
    prefix: "d\xE8s ",
    suffix: " \u20AC"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: E_INV_INK_SOFT
    }
  }, t.hero.clear.priceNote))), /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-pop",
    style: {
      display: 'flex',
      '--cp-d': '180ms'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: E_CARD_BG,
      border: `1px solid ${E_LINE}`,
      borderRadius: 24,
      padding: isMobile ? 22 : 28,
      display: 'grid',
      gap: 6,
      alignContent: 'center',
      boxShadow: E_SHADOW
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: E_INK_SOFT
    }
  }, t.hero.clear.payLabel), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: E_DISPLAY,
      fontSize: isMobile ? 34 : 42,
      fontWeight: 600,
      letterSpacing: '-.04em',
      lineHeight: 1.1
    }
  }, t.hero.clear.payBig), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 14,
      color: E_INK_SOFT
    }
  }, t.hero.clear.payNote))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: isMobile ? 12 : 20,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
      gap: isMobile ? 12 : 20
    }
  }, t.hero.clear.tiles.map(([a, b], i) => /*#__PURE__*/React.createElement("div", {
    key: a,
    "data-cp-anim": true,
    className: "cp-pop",
    style: {
      display: 'flex',
      '--cp-d': `${i * 90}ms`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      background: E_CARD,
      borderRadius: 24,
      padding: isMobile ? 22 : 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: E_DISPLAY,
      fontSize: isMobile ? 19 : 21,
      fontWeight: 600,
      letterSpacing: '-.02em'
    }
  }, a), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 8,
      fontSize: 15,
      lineHeight: 1.5,
      color: E_INK_SOFT
    }
  }, b)))))))), /*#__PURE__*/React.createElement("section", {
    id: "apropos",
    style: {
      padding: '110px 56px',
      background: E_BG_2,
      borderTop: `1px solid ${E_LINE}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...E_WRAP,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '.8fr 1.2fr',
      gap: isMobile ? 32 : 72,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-pop",
    style: {
      order: isMobile ? 2 : 1
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-parallax": isMobile ? '0' : '0.05'
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-spot",
    onMouseMove: cpSpot,
    style: {
      borderRadius: 28,
      background: E_INV_BG,
      color: E_INV_INK,
      padding: isMobile ? 24 : 32,
      boxShadow: '0 40px 80px -36px rgba(16,24,40,.55)',
      display: 'grid',
      gap: isMobile ? 20 : 28
    }
  }, E_PHOTO ? /*#__PURE__*/React.createElement("img", {
    src: E_PHOTO,
    alt: "Edgar Jacquemart",
    style: {
      width: '100%',
      aspectRatio: '4 / 3',
      objectFit: 'cover',
      borderRadius: 18,
      display: 'block'
    }
  }) : /*#__PURE__*/React.createElement("div", {
    style: {
      aspectRatio: isMobile ? '16 / 7' : '16 / 9',
      borderRadius: 18,
      position: 'relative',
      overflow: 'hidden',
      background: 'linear-gradient(135deg, rgba(107,155,208,.34), rgba(154,130,112,.20))',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Spectral, serif',
      fontStyle: 'italic',
      fontSize: isMobile ? 64 : 96,
      lineHeight: 1,
      color: E_INV_INK
    }
  }, "c", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--cp-inv-accent)'
    }
  }, "."))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      fontSize: 22,
      letterSpacing: '-.02em'
    }
  }, t.about.cardName), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 4,
      fontSize: 14,
      color: E_INV_INK_SOFT
    }
  }, t.about.cardRole, " \xB7 ", t.about.cardPlace)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: 10
    }
  }, E_PHONE && /*#__PURE__*/React.createElement("a", {
    href: E_TEL_HREF,
    style: {
      padding: '11px 18px',
      borderRadius: 99,
      background: 'var(--cp-inv-accent)',
      color: 'var(--cp-inv-bg)',
      fontSize: 14,
      fontWeight: 600,
      textDecoration: 'none'
    }
  }, E_PHONE), /*#__PURE__*/React.createElement("a", {
    href: "mailto:contact@corveepaper.fr",
    style: {
      padding: '11px 18px',
      borderRadius: 99,
      border: `1px solid ${E_INV_LINE}`,
      color: E_INV_INK,
      fontSize: 14,
      fontWeight: 500,
      textDecoration: 'none'
    }
  }, "contact@corveepaper.fr"))))), /*#__PURE__*/React.createElement("div", {
    style: {
      order: isMobile ? 1 : 2
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, t.about.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      fontSize: 48,
      lineHeight: 1.08,
      letterSpacing: '-.035em'
    }
  }, t.about.titleA, ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      color: E_TERRA
    }
  }, t.about.titleB)), /*#__PURE__*/React.createElement("p", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      margin: '24px 0 0',
      fontSize: isMobile ? 16 : 18,
      lineHeight: 1.6,
      color: E_INK
    }
  }, t.about.p1), /*#__PURE__*/React.createElement("p", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      margin: '14px 0 0',
      fontSize: isMobile ? 16 : 18,
      lineHeight: 1.6,
      color: E_INK_SOFT
    }
  }, t.about.p2), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '28px 0 0',
      padding: 0,
      display: 'grid',
      gap: 14
    }
  }, t.about.points.map(([a, b], i) => /*#__PURE__*/React.createElement("li", {
    key: a,
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      '--cp-d': `${i * 90}ms`
    }
  }, /*#__PURE__*/React.createElement(Check, null), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 15.5,
      lineHeight: 1.5,
      color: E_INK_SOFT
    }
  }, /*#__PURE__*/React.createElement("strong", {
    style: {
      color: E_INK,
      fontWeight: 600
    }
  }, a, "."), " ", b))))))), /*#__PURE__*/React.createElement("section", {
    id: "services",
    style: {
      padding: '110px 56px',
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...E_WRAP,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: isMobile ? 12 : 24
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, t.services.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      maxWidth: 720,
      fontSize: 52,
      lineHeight: 1.06,
      letterSpacing: '-.035em'
    }
  }, t.services.title)), /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      fontSize: 15,
      color: E_INK_SOFT,
      paddingBottom: 6
    }
  }, t.services.payLine)), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: isMobile ? 28 : 48,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
      gap: isMobile ? 14 : 20
    }
  }, t.services.cards.map((c, i) => {
    const on = !!c.featured;
    return /*#__PURE__*/React.createElement("div", {
      key: c.t,
      "data-cp-anim": true,
      className: "cp-pop",
      style: {
        display: 'flex',
        '--cp-d': `${i * 110}ms`
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#contact",
      onClick: cpGoTo('#contact', c.format),
      onMouseMove: cpSpot,
      className: "cp-card cp-spot",
      "aria-label": `${c.t} : ${c.cta}`,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: 20,
        padding: isMobile ? 24 : 32,
        borderRadius: 24,
        background: on ? E_INV_BG : E_CARD_BG,
        border: `1px solid ${on ? 'transparent' : E_LINE}`,
        color: on ? E_INV_INK : E_INK,
        boxShadow: on ? '0 30px 70px -28px rgba(16,24,40,.55)' : E_SHADOW,
        textDecoration: 'none',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontFamily: E_DISPLAY,
        fontWeight: 600,
        fontSize: 21,
        letterSpacing: '-.02em'
      }
    }, c.t), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6,
        fontSize: 14.5,
        color: on ? E_INV_INK_SOFT : E_INK_SOFT
      }
    }, c.s)), c.badge && /*#__PURE__*/React.createElement("span", {
      style: {
        padding: '5px 10px',
        borderRadius: 8,
        whiteSpace: 'nowrap',
        background: 'var(--cp-inv-accent)',
        color: E_INV_BG,
        fontSize: 12.5,
        fontWeight: 600
      }
    }, c.badge)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontFamily: E_DISPLAY,
        fontWeight: 600,
        fontSize: isMobile ? 36 : 40,
        letterSpacing: '-.04em',
        lineHeight: 1
      }
    }, c.from), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        fontSize: 15,
        lineHeight: 1.55,
        color: on ? E_INV_INK_SOFT : E_INK_SOFT
      }
    }, c.d), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 1,
        background: on ? E_INV_LINE : E_LINE
      }
    }), /*#__PURE__*/React.createElement("ul", {
      style: {
        listStyle: 'none',
        margin: 0,
        padding: 0,
        display: 'grid',
        gap: 12,
        flex: 1,
        alignContent: 'start'
      }
    }, c.feats.map(f => /*#__PURE__*/React.createElement("li", {
      key: f,
      style: {
        display: 'flex',
        gap: 10,
        alignItems: 'flex-start',
        fontSize: 15,
        lineHeight: 1.4
      }
    }, /*#__PURE__*/React.createElement(Check, {
      color: on ? 'var(--cp-inv-accent)' : undefined
    }), " ", f))), /*#__PURE__*/React.createElement("span", {
      style: {
        padding: '15px 18px',
        borderRadius: 14,
        textAlign: 'center',
        background: on ? E_INV_INK : E_CARD,
        color: on ? E_INV_BG : E_INK,
        fontSize: 15.5,
        fontWeight: 600,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8
      }
    }, c.cta, " ", /*#__PURE__*/React.createElement("span", {
      className: "cp-arrow"
    }, "\u2192"))));
  })), /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      marginTop: isMobile ? 14 : 20,
      padding: isMobile ? 24 : 36,
      borderRadius: 24,
      background: E_CARD_BG,
      border: `1px solid ${E_LINE}`,
      boxShadow: E_SHADOW
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      fontSize: isMobile ? 20 : 24,
      letterSpacing: '-.02em'
    }
  }, t.services.includedTitle), /*#__PURE__*/React.createElement("ul", {
    style: {
      listStyle: 'none',
      margin: '22px 0 0',
      padding: 0,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? 12 : '14px 40px'
    }
  }, t.services.included.map(it => /*#__PURE__*/React.createElement("li", {
    key: it,
    style: {
      display: 'flex',
      gap: 12,
      alignItems: 'flex-start',
      fontSize: 15.5,
      lineHeight: 1.45,
      color: E_INK
    }
  }, /*#__PURE__*/React.createElement(Check, null), " ", it))), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '24px 0 0',
      fontSize: 14,
      lineHeight: 1.55,
      color: E_INK_SOFT
    }
  }, t.services.footnote)))), /*#__PURE__*/React.createElement("section", {
    id: "methode",
    style: {
      padding: '110px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: E_WRAP
  }, /*#__PURE__*/React.createElement(Eyebrow, null, t.process.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      maxWidth: 720,
      fontSize: 52,
      lineHeight: 1.06,
      letterSpacing: '-.035em'
    }
  }, t.process.title), /*#__PURE__*/React.createElement("div", {
    id: "cp-method-steps",
    style: {
      position: 'relative',
      marginTop: isMobile ? 32 : 64,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr 1fr',
      gap: isMobile ? 26 : 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: isMobile ? {
      position: 'absolute',
      left: 19,
      top: 20,
      bottom: 20,
      width: 2,
      background: E_LINE,
      borderRadius: 2
    } : {
      position: 'absolute',
      left: 22,
      right: 22,
      top: 21,
      height: 2,
      background: E_LINE,
      borderRadius: 2
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-line": isMobile ? 'y' : 'x',
    style: {
      width: '100%',
      height: '100%',
      background: E_TERRA,
      borderRadius: 2,
      transformOrigin: isMobile ? 'top' : 'left',
      transform: isMobile ? 'scaleY(0)' : 'scaleX(0)'
    }
  })), t.process.steps.map(s => /*#__PURE__*/React.createElement("div", {
    key: s.n,
    "data-cp-step": true,
    style: {
      position: 'relative',
      display: isMobile ? 'grid' : 'block',
      gridTemplateColumns: isMobile ? '40px 1fr' : undefined,
      gap: isMobile ? 16 : undefined
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "cp-step-dot",
    style: {
      width: isMobile ? 40 : 44,
      height: isMobile ? 40 : 44,
      borderRadius: 99,
      background: E_BG,
      border: `2px solid ${E_LINE}`,
      color: E_INK_SOFT,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      fontSize: 16,
      boxSizing: 'border-box'
    }
  }, s.n), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: isMobile ? 0 : 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 500,
      color: E_TERRA
    }
  }, s.when), /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: '6px 0 0',
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      fontSize: isMobile ? 20 : 22,
      letterSpacing: '-.02em'
    }
  }, s.t), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '8px 0 0',
      fontSize: 15.5,
      lineHeight: 1.55,
      color: E_INK_SOFT
    }
  }, s.d))))))), /*#__PURE__*/React.createElement("section", {
    id: "travaux",
    style: {
      padding: '110px 56px',
      borderTop: `1px solid ${E_LINE}`,
      borderBottom: `1px solid ${E_LINE}`,
      background: E_BG_2
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: E_WRAP
  }, /*#__PURE__*/React.createElement(Eyebrow, null, t.travaux.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      fontSize: 52,
      lineHeight: 1.06,
      letterSpacing: '-.035em'
    }
  }, t.travaux.title), /*#__PURE__*/React.createElement("p", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      margin: '18px 0 0',
      color: E_INK_SOFT,
      maxWidth: 620,
      fontSize: isMobile ? 15.5 : 17,
      lineHeight: 1.6
    }
  }, t.travaux.note), /*#__PURE__*/React.createElement("div", {
    "data-cp-anim": true,
    className: "cp-reveal",
    role: "tablist",
    "aria-label": "Filtrer les exemples par famille de m\xE9tier",
    style: {
      display: 'inline-flex',
      gap: 4,
      padding: 5,
      borderRadius: 99,
      background: E_CARD_BG,
      border: `1px solid ${E_LINE}`,
      margin: isMobile ? '26px 0 32px' : '34px 0 56px',
      maxWidth: '100%'
    }
  }, [['sante', 'Santé'], ['resto', isMobile ? 'Restauration' : 'Restauration & commerce']].map(([fam, label]) => {
    const active = travauxFam === fam;
    return /*#__PURE__*/React.createElement("button", {
      key: fam,
      type: "button",
      "aria-pressed": active,
      onClick: () => setTravauxFam(fam),
      style: {
        fontFamily: 'inherit',
        fontSize: isMobile ? 14 : 15,
        fontWeight: 500,
        cursor: 'pointer',
        padding: isMobile ? '10px 18px' : '11px 22px',
        borderRadius: 99,
        border: 0,
        background: active ? E_INK : 'transparent',
        color: active ? E_BG : E_INK_SOFT
      }
    }, label);
  })), /*#__PURE__*/React.createElement("div", {
    id: "cp-travaux-grid",
    style: {
      display: 'grid',
      gap: isMobile ? 40 : 80
    }
  }, (CP_PROJECTS.filter(p => p.fam === travauxFam).length > 0 ? CP_PROJECTS.filter(p => p.fam === travauxFam) : CP_PROJECTS).map((p, i) => {
    const flip = i % 2 === 1 && !isMobile;
    const isHover = hoverIdx === i;
    return /*#__PURE__*/React.createElement("div", {
      key: p.id,
      "data-cp-anim": true,
      className: flip ? 'cp-slide-r' : 'cp-slide-l',
      onMouseEnter: () => setHoverIdx(i),
      onMouseLeave: () => setHoverIdx(-1),
      style: {
        display: 'grid',
        gridTemplateColumns: isMobile ? '1fr' : flip ? '1fr 1.3fr' : '1.3fr 1fr',
        gap: isMobile ? 18 : 56,
        alignItems: 'center'
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: p.href,
      "aria-label": `Voir le concept ${p.name}`,
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
    /* Téléphone : carte légère (on ne charge pas 6 sites entiers). */
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
        fontSize: 12,
        fontWeight: 500,
        color: p.accent,
        opacity: 0.82
      }
    }, p.type.fr.replace('Concept · ', '')), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 6,
        fontSize: 12,
        fontWeight: 500,
        color: p.accent,
        border: `1px solid ${p.accent}`,
        borderRadius: 99,
        padding: '6px 14px',
        opacity: 0.9
      }
    }, "Voir le site \u2192")) :
    /*#__PURE__*/
    /* Ordinateur : aperçu réel du site, réduit pour tenir dans le cadre. */
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
        top: 16,
        left: 16,
        background: '#192230',
        color: '#f5f6f8',
        fontSize: 11.5,
        fontWeight: 500,
        padding: '5px 11px',
        borderRadius: 99
      }
    }, "Concept de d\xE9monstration")), /*#__PURE__*/React.createElement("div", {
      style: {
        order: flip ? 1 : 2
      }
    }, /*#__PURE__*/React.createElement("h3", {
      style: {
        margin: 0,
        fontFamily: E_DISPLAY,
        fontWeight: 600,
        fontSize: isMobile ? 26 : 40,
        letterSpacing: '-.035em',
        lineHeight: 1.05,
        color: isHover ? E_TERRA : E_INK
      }
    }, p.name), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '8px 0 0',
        fontSize: isMobile ? 15 : 17,
        color: E_INK_SOFT
      }
    }, p.type.fr.replace('Concept · ', '')), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: isMobile ? 14 : 22,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 8
      }
    }, p.tags.map(tg => /*#__PURE__*/React.createElement("span", {
      key: tg,
      style: {
        padding: '6px 12px',
        borderRadius: 99,
        background: E_CARD_BG,
        border: `1px solid ${E_LINE}`,
        fontSize: 12.5,
        color: E_INK_SOFT
      }
    }, tg))), /*#__PURE__*/React.createElement("a", {
      href: p.href,
      style: {
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        marginTop: isMobile ? 16 : 26,
        fontSize: 15,
        fontWeight: 600,
        color: E_TERRA,
        textDecoration: 'none',
        cursor: 'pointer'
      }
    }, "Voir le site ", /*#__PURE__*/React.createElement("span", {
      className: "cp-arrow"
    }, "\u2192"))));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: isMobile ? 36 : 64,
      textAlign: 'center'
    }
  }, /*#__PURE__*/React.createElement("a", {
    href: "portfolio/",
    style: {
      padding: '14px 24px',
      borderRadius: 99,
      background: E_CARD_BG,
      color: E_INK,
      border: `1px solid ${E_LINE}`,
      fontSize: 15,
      fontWeight: 500,
      textDecoration: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10
    }
  }, t.travaux.all, " ", /*#__PURE__*/React.createElement("span", {
    className: "cp-arrow"
  }, "\u2192"))))), /*#__PURE__*/React.createElement("section", {
    id: "maintenance",
    style: {
      padding: '110px 56px'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: E_WRAP
  }, /*#__PURE__*/React.createElement(Eyebrow, null, t.maintenance.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      fontSize: 52,
      lineHeight: 1.06,
      letterSpacing: '-.035em'
    }
  }, t.maintenance.title), /*#__PURE__*/React.createElement("p", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      margin: '18px 0 0',
      color: E_INK_SOFT,
      maxWidth: 560,
      fontSize: isMobile ? 15.5 : 17,
      lineHeight: 1.6
    }
  }, t.maintenance.sub), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: isMobile ? 28 : 52,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr',
      gap: isMobile ? 14 : 20,
      alignItems: 'stretch'
    }
  }, t.maintenance.tiers.map((m, i) => {
    const f = !!m.featured;
    return /*#__PURE__*/React.createElement("div", {
      key: m.tag,
      "data-cp-anim": true,
      className: "cp-pop",
      style: {
        display: 'flex',
        '--cp-d': `${i * 110}ms`
      }
    }, /*#__PURE__*/React.createElement("a", {
      href: "#contact",
      onClick: cpGoTo('#contact', 'Forfait de suivi'),
      onMouseMove: cpSpot,
      className: "cp-card cp-spot",
      "aria-label": `Forfait ${m.tag} : en parler`,
      style: {
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: isMobile ? 24 : 30,
        borderRadius: 24,
        background: f ? E_INV_BG : E_CARD_BG,
        color: f ? E_INV_INK : E_INK,
        border: `1px solid ${f ? 'transparent' : E_LINE}`,
        boxShadow: f ? '0 36px 70px -34px rgba(16,24,40,.6)' : E_SHADOW,
        textDecoration: 'none',
        cursor: 'pointer'
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 10
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: E_DISPLAY,
        fontWeight: 600,
        fontSize: 18,
        letterSpacing: '-.01em'
      }
    }, m.tag), /*#__PURE__*/React.createElement("span", {
      style: {
        padding: '5px 11px',
        borderRadius: 99,
        fontSize: 12,
        fontWeight: 500,
        background: f ? 'var(--cp-inv-accent)' : E_TERRA_SOFT,
        color: f ? 'var(--cp-inv-bg)' : E_TERRA
      }
    }, m.badge)), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 22,
        display: 'flex',
        alignItems: 'baseline',
        gap: 6
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: E_DISPLAY,
        fontWeight: 600,
        fontSize: isMobile ? 40 : 48,
        letterSpacing: '-.04em',
        lineHeight: 1
      }
    }, m.price, " \u20AC"), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 14,
        color: f ? E_INV_INK_SOFT : E_INK_SOFT
      }
    }, "/ mois")), /*#__PURE__*/React.createElement("div", {
      style: {
        marginTop: 18,
        fontSize: 16,
        fontWeight: 600
      }
    }, m.t), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: '8px 0 0',
        fontSize: 15,
        lineHeight: 1.55,
        color: f ? E_INV_INK_SOFT : E_INK_SOFT,
        flex: 1
      }
    }, m.d), /*#__PURE__*/React.createElement("span", {
      style: {
        marginTop: 24,
        fontSize: 14,
        fontWeight: 600,
        color: f ? 'var(--cp-inv-accent)' : E_TERRA,
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8
      }
    }, t.maintenance.cta, " ", /*#__PURE__*/React.createElement("span", {
      className: "cp-arrow"
    }, "\u2192"))));
  })))), /*#__PURE__*/React.createElement("section", {
    id: "faq",
    style: {
      padding: '110px 56px',
      background: E_BG_2,
      borderTop: `1px solid ${E_LINE}`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...E_WRAP,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '.8fr 1.2fr',
      gap: isMobile ? 24 : 72,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: isMobile ? {} : {
      position: 'sticky',
      top: 110
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, null, t.faq.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      fontSize: 48,
      lineHeight: 1.08,
      letterSpacing: '-.035em'
    }
  }, t.faq.title)), /*#__PURE__*/React.createElement("div", {
    className: "cp-faq",
    style: {
      display: 'grid',
      gap: 10
    }
  }, t.faq.items.map(([q, a], i) => /*#__PURE__*/React.createElement("details", {
    key: q,
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      background: E_CARD_BG,
      border: `1px solid ${E_LINE}`,
      borderRadius: 18,
      '--cp-d': `${Math.min(i, 4) * 60}ms`
    }
  }, /*#__PURE__*/React.createElement("summary", {
    style: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 16,
      padding: isMobile ? '16px 18px' : '20px 24px',
      fontSize: isMobile ? 16 : 17,
      fontWeight: 600,
      letterSpacing: '-.01em',
      color: E_INK
    }
  }, q, /*#__PURE__*/React.createElement("span", {
    className: "cp-faq-plus",
    "aria-hidden": "true",
    style: {
      flexShrink: 0,
      width: 28,
      height: 28,
      borderRadius: 99,
      background: E_TERRA_SOFT,
      color: E_TERRA,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 18,
      lineHeight: 1
    }
  }, "+")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      padding: isMobile ? '0 18px 18px' : '0 24px 22px',
      fontSize: 15.5,
      lineHeight: 1.6,
      color: E_INK_SOFT,
      maxWidth: 640
    }
  }, a)))))), /*#__PURE__*/React.createElement("section", {
    id: "contact",
    style: {
      padding: '110px 56px 40px',
      background: E_INV_BG,
      color: E_INV_INK,
      position: 'relative',
      overflow: 'hidden'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "aria-hidden": "true",
    style: {
      position: 'absolute',
      inset: 0,
      pointerEvents: 'none'
    }
  }, /*#__PURE__*/React.createElement("div", {
    "data-cp-parallax": "0.14",
    style: {
      position: 'absolute',
      left: '-12%',
      top: '-6%',
      width: 620,
      height: 620,
      background: 'radial-gradient(circle, rgba(107,155,208,.22) 0%, transparent 62%)',
      filter: 'blur(40px)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      ...E_WRAP,
      position: 'relative'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr',
      gap: isMobile ? 32 : 72,
      alignItems: 'start'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, {
    inv: true
  }, t.contact.eyebrow), /*#__PURE__*/React.createElement("h2", {
    className: "cp-wipe",
    "data-cp-anim": true,
    style: {
      margin: 0,
      fontFamily: E_DISPLAY,
      fontWeight: 600,
      fontSize: 52,
      lineHeight: 1.06,
      letterSpacing: '-.035em'
    }
  }, t.contact.title, ' ', /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--cp-inv-accent)'
    }
  }, t.contact.titleAccent)), /*#__PURE__*/React.createElement("p", {
    "data-cp-anim": true,
    className: "cp-reveal",
    style: {
      margin: '20px 0 0',
      fontSize: isMobile ? 16 : 18,
      lineHeight: 1.6,
      color: E_INV_INK_SOFT,
      maxWidth: 460
    }
  }, t.contact.sub), (E_PHONE || E_BOOKING_URL) && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 26,
      display: 'flex',
      flexWrap: 'wrap',
      gap: 12
    }
  }, E_PHONE && /*#__PURE__*/React.createElement("a", {
    href: E_TEL_HREF,
    style: {
      padding: '15px 24px',
      borderRadius: 99,
      background: 'var(--cp-inv-accent)',
      color: 'var(--cp-inv-bg)',
      fontSize: 16,
      fontWeight: 600,
      textDecoration: 'none'
    }
  }, t.contact.call, " \xB7 ", E_PHONE), E_BOOKING_URL && /*#__PURE__*/React.createElement("a", {
    href: E_BOOKING_URL,
    target: "_blank",
    rel: "noopener noreferrer",
    style: {
      padding: '15px 24px',
      borderRadius: 99,
      border: `1px solid ${E_INV_LINE}`,
      color: E_INV_INK,
      fontSize: 16,
      fontWeight: 500,
      textDecoration: 'none'
    }
  }, t.contact.book)), /*#__PURE__*/React.createElement("dl", {
    style: {
      margin: '32px 0 0',
      display: 'grid',
      gap: 0
    }
  }, [['Email', /*#__PURE__*/React.createElement("a", {
    key: "m",
    href: "mailto:contact@corveepaper.fr",
    style: {
      color: E_INV_INK,
      textDecoration: 'none'
    }
  }, "contact@corveepaper.fr")], ...(E_PHONE ? [['Téléphone', /*#__PURE__*/React.createElement("a", {
    key: "p",
    href: E_TEL_HREF,
    style: {
      color: E_INV_INK,
      textDecoration: 'none'
    }
  }, E_PHONE)]] : []), ['Zone', t.contact.zone], ['Délai', t.contact.delay]].map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: {
      display: 'grid',
      gridTemplateColumns: '96px 1fr',
      gap: 16,
      padding: '14px 0',
      borderTop: `1px solid ${E_INV_LINE}`,
      fontSize: 15,
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("dt", {
    style: {
      color: E_INV_INK_SOFT
    }
  }, k), /*#__PURE__*/React.createElement("dd", {
    style: {
      margin: 0
    }
  }, v))))), /*#__PURE__*/React.createElement(ContactForm, {
    t: t
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: isMobile ? 56 : 96,
      paddingTop: isMobile ? 36 : 48,
      borderTop: `1px solid ${E_INV_LINE}`,
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr 1fr' : '1.4fr .8fr 1fr',
      gap: isMobile ? 28 : 56
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: isMobile ? '1 / -1' : 'auto'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: 'Spectral, serif',
      fontSize: 28
    }
  }, "Corvee Paper", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--cp-inv-accent)',
      fontStyle: 'italic'
    }
  }, ".")), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: '12px 0 0',
      fontSize: 14,
      color: E_INV_INK_SOFT,
      lineHeight: 1.55,
      maxWidth: 380
    }
  }, t.footer.blurb)), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: E_INV_INK_SOFT,
      marginBottom: 14
    }
  }, t.footer.navCol), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'grid',
      gap: 9
    }
  }, t.nav.map(n => /*#__PURE__*/React.createElement("li", {
    key: n.label
  }, /*#__PURE__*/React.createElement("a", {
    href: n.href,
    onClick: cpGoTo(n.href),
    style: {
      color: E_INV_INK,
      textDecoration: 'none',
      fontSize: 14,
      cursor: 'pointer'
    }
  }, n.label))))), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      fontWeight: 600,
      color: E_INV_INK_SOFT,
      marginBottom: 14
    }
  }, t.footer.legalCol), /*#__PURE__*/React.createElement("ul", {
    style: {
      margin: 0,
      padding: 0,
      listStyle: 'none',
      display: 'grid',
      gap: 9
    }
  }, t.footer.legalLinks.map(([label, href]) => /*#__PURE__*/React.createElement("li", {
    key: label
  }, /*#__PURE__*/React.createElement("a", {
    href: href,
    style: {
      color: E_INV_INK,
      textDecoration: 'none',
      fontSize: 14,
      cursor: 'pointer'
    }
  }, label)))))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: isMobile ? 32 : 48,
      paddingTop: 22,
      borderTop: `1px solid ${E_INV_LINE}`,
      display: 'flex',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 8,
      fontSize: 12.5,
      color: E_INV_INK_SOFT
    }
  }, /*#__PURE__*/React.createElement("span", null, t.footer.note1), /*#__PURE__*/React.createElement("span", null, t.footer.note2)))));
}
window.DirectionEditorial = DirectionEditorial;
