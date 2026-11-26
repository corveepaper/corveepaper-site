function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
// Shared bits across the three direction mockups.
// All globals are namespaced (CP*) so they don't collide.

const {
  useState,
  useEffect,
  useRef,
  useCallback
} = React;

// ─── Magnetic cursor wrapper ─────────────────────────────────────────────────
// Wrap any element; on hover within `radius` px the child eases toward the
// pointer. Used for buttons / nav links / portfolio tiles.
function Magnetic({
  children,
  strength = 0.18,
  radius = 90,
  style,
  ...rest
}) {
  const ref = useRef(null);
  const raf = useRef(0);
  const pos = useRef({
    x: 0,
    y: 0,
    tx: 0,
    ty: 0
  });
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let active = true;
    const tick = () => {
      const p = pos.current;
      p.x += (p.tx - p.x) * 0.18;
      p.y += (p.ty - p.y) * 0.18;
      el.style.transform = `translate3d(${p.x.toFixed(2)}px, ${p.y.toFixed(2)}px, 0)`;
      if (Math.abs(p.tx - p.x) > 0.05 || Math.abs(p.ty - p.y) > 0.05) {
        raf.current = requestAnimationFrame(tick);
      } else {
        raf.current = 0;
      }
    };
    const onMove = e => {
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d < radius) {
        pos.current.tx = dx * strength;
        pos.current.ty = dy * strength;
      } else {
        pos.current.tx = 0;
        pos.current.ty = 0;
      }
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    };
    const onLeave = () => {
      pos.current.tx = 0;
      pos.current.ty = 0;
      if (!raf.current) raf.current = requestAnimationFrame(tick);
    };

    // Listen on document so the magnetic pull engages BEFORE the cursor
    // enters the element (the whole point of the effect).
    document.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      active = false;
      document.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(raf.current);
    };
  }, [strength, radius]);
  return /*#__PURE__*/React.createElement("span", _extends({
    ref: ref,
    style: {
      display: 'inline-block',
      willChange: 'transform',
      ...style
    }
  }, rest), children);
}

// ─── Placeholder image w/ monospace label ────────────────────────────────────
function PHImg({
  label = 'image',
  bg = '#e7decf',
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "ph",
    style: {
      '--ph-bg': bg,
      width: '100%',
      height: '100%',
      ...style
    }
  }, /*#__PURE__*/React.createElement("span", null, "\u21B3 ", label));
}

// ─── Browser frame for portfolio mockups ─────────────────────────────────────
function BrowserMock({
  url,
  accent = '#c9542e',
  bg = '#f3ece0',
  children,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      borderRadius: 10,
      overflow: 'hidden',
      background: bg,
      boxShadow: '0 30px 60px -20px rgba(60,30,10,.35), 0 0 0 1px rgba(40,20,10,.08)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'rgba(40,25,15,.06)',
      padding: '10px 14px',
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      borderBottom: '1px solid rgba(40,20,10,.06)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 99,
      background: '#e07b5d'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 99,
      background: '#e3c068'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      width: 10,
      height: 10,
      borderRadius: 99,
      background: '#9bb38a'
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      marginLeft: 12,
      padding: '3px 12px',
      borderRadius: 99,
      background: 'rgba(255,255,255,.5)',
      fontFamily: 'Geist Mono, monospace',
      fontSize: 10,
      color: 'rgba(40,20,10,.55)',
      letterSpacing: '.02em'
    }
  }, url)), /*#__PURE__*/React.createElement("div", null, children));
}

// ─── Parallax wrapper on scroll within an artboard ───────────────────────────
// Note: design-canvas artboards aren't scroll regions — parallax kicks in when
// the artboard is focused fullscreen (the focus overlay scrolls).
function useParallax(strength = 0.15) {
  const ref = useRef(null);
  const [y, setY] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // The closest scroll container — could be the focus overlay or page.
    const findScroll = node => {
      let n = node;
      while (n) {
        const cs = getComputedStyle(n);
        if (/(auto|scroll)/.test(cs.overflowY) && n.scrollHeight > n.clientHeight) return n;
        n = n.parentElement;
      }
      return window;
    };
    const scroller = findScroll(el);
    const onScroll = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const center = r.top + r.height / 2 - vh / 2;
      setY(-center * strength);
    };
    onScroll();
    (scroller === window ? window : scroller).addEventListener('scroll', onScroll, {
      passive: true
    });
    return () => (scroller === window ? window : scroller).removeEventListener('scroll', onScroll);
  }, [strength]);
  return [ref, y];
}

// ─── Language toggle (FR / EN) ───────────────────────────────────────────────
function LangToggle({
  lang,
  setLang,
  color = 'currentColor'
}) {
  const Btn = ({
    v,
    children
  }) => /*#__PURE__*/React.createElement("button", {
    onClick: () => setLang(v),
    style: {
      background: 'transparent',
      border: 0,
      padding: '4px 6px',
      color,
      opacity: lang === v ? 1 : 0.4,
      cursor: 'pointer',
      font: 'inherit',
      letterSpacing: '.04em'
    }
  }, children);
  return /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: 'Geist Mono, monospace',
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement(Btn, {
    v: "fr"
  }, "FR"), /*#__PURE__*/React.createElement("span", {
    style: {
      opacity: .3,
      color
    }
  }, "/"), /*#__PURE__*/React.createElement(Btn, {
    v: "en"
  }, "EN"));
}

// ─── Sample portfolio data — Corvee Paper concepts ──────────────────────────
// All three are explicitly labelled "Concept" since the studio is launching
// and these are speculative case studies, not commissioned work.
const CP_PROJECTS = [
// ── Famille Santé ──────────────────────────────────────────────────────────
{
  id: 'lacombe',
  fam: 'sante',
  name: 'Cabinet Lacombe',
  type: {
    fr: 'Concept · Ostéopathe D.O. · Bordeaux',
    en: 'Concept · Osteopath · Bordeaux'
  },
  year: '2026',
  url: 'cabinet-lacombe.fr',
  href: 'portfolio/lacombe/index.html',
  tags: ['Bien-être', 'Format Pro', 'Prise de RDV'],
  bg: '#EFE6D6',
  accent: '#5A6F5E'
}, {
  id: 'marchand',
  fam: 'sante',
  name: 'Adèle Marchand',
  type: {
    fr: 'Concept · Psychologue clinicienne · Paris 11e',
    en: 'Concept · Clinical psychologist · Paris'
  },
  year: '2026',
  url: 'adele-marchand.fr',
  href: 'portfolio/marchand/index.html',
  tags: ['Bien-être', 'Format Pro', 'Éditorial'],
  bg: '#10161B',
  accent: '#D4936D'
}, {
  id: 'lune',
  fam: 'sante',
  name: 'Studio Lune',
  type: {
    fr: 'Concept · Yoga & Pilates · Lyon',
    en: 'Concept · Yoga & Pilates · Lyon'
  },
  year: '2026',
  url: 'studio-lune.fr',
  href: 'portfolio/lune/index.html',
  tags: ['Bien-être', 'Sur mesure', 'Planning'],
  bg: '#F2EBE0',
  accent: '#C0855A'
},
// ── Famille Restauration & commerce ────────────────────────────────────────
{
  id: 'brasa',
  fam: 'resto',
  name: 'Brasa',
  type: {
    fr: 'Concept · Smash burger · Marseille',
    en: 'Concept · Smash burger · Marseille'
  },
  year: '2026',
  url: 'brasa-marseille.fr',
  href: 'portfolio/brasa/index.html',
  tags: ['Restauration', 'Click & Collect', 'Carte'],
  bg: '#16130F',
  accent: '#F0541E'
}, {
  id: 'comptoir',
  fam: 'resto',
  name: 'Comptoir Vauban',
  type: {
    fr: 'Concept · Bistrot gastronomique · Paris',
    en: 'Concept · Bistro · Paris'
  },
  year: '2026',
  url: 'comptoir-vauban.fr',
  href: 'portfolio/comptoir/index.html',
  tags: ['Restauration', 'Réservation', 'Carte'],
  bg: '#16241C',
  accent: '#C6A24C'
}, {
  id: 'petrin',
  fam: 'resto',
  name: 'Pétrin',
  type: {
    fr: 'Concept · Boulangerie · Nantes',
    en: 'Concept · Bakery · Nantes'
  },
  year: '2026',
  url: 'petrin-nantes.fr',
  href: 'portfolio/petrin/index.html',
  tags: ['Commerce', 'Click & Collect', 'Carte'],
  bg: '#2C2118',
  accent: '#C98A3C'
}];

// ─── Shared sample SVG previews for portfolio (light, no logos) ──────────────
// Each preview is a tiny abstract composition that hints at a real screen —
// the layouts now match the 3 Corvee Paper concept projects (osteopathy
// clinic / artisan cabinetmaker / yoga studio).
function PreviewArt({
  kind,
  w = 600,
  h = 380,
  accent = '#c9542e',
  bg = '#f3ece0'
}) {
  if (kind === 'gallery') {
    // "Cabinet Lacombe" — osteopathy clinic: warm cream background, headline,
    // 3 panel cards (services blocks), booking strip below.
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${w} ${h}`,
      role: "img",
      "aria-label": "Aper\xE7u du concept Cabinet Lacombe \u2014 ost\xE9opathe \xE0 Bordeaux : page d'accueil chaleureuse avec trois blocs de service et un bandeau de prise de rendez-vous.",
      style: {
        width: '100%',
        height: '100%',
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("title", null, "Cabinet Lacombe \u2014 concept ost\xE9opathie"), /*#__PURE__*/React.createElement("rect", {
      width: w,
      height: h,
      fill: bg
    }), /*#__PURE__*/React.createElement("text", {
      x: "40",
      y: "64",
      fill: accent,
      fontFamily: "Spectral, serif",
      fontSize: "44",
      fontStyle: "italic"
    }, "Cabinet Lacombe"), /*#__PURE__*/React.createElement("line", {
      x1: "40",
      y1: "86",
      x2: w - 40,
      y2: "86",
      stroke: accent,
      strokeOpacity: ".35"
    }), /*#__PURE__*/React.createElement("g", {
      opacity: ".95"
    }, /*#__PURE__*/React.createElement("rect", {
      x: "40",
      y: "120",
      width: "160",
      height: "160",
      fill: accent,
      opacity: ".18",
      rx: "6"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "220",
      y: "120",
      width: "160",
      height: "160",
      fill: accent,
      opacity: ".28",
      rx: "6"
    }), /*#__PURE__*/React.createElement("rect", {
      x: "400",
      y: "120",
      width: "160",
      height: "160",
      fill: accent,
      opacity: ".12",
      rx: "6"
    })), /*#__PURE__*/React.createElement("rect", {
      x: "40",
      y: h - 56,
      width: w - 80,
      height: "28",
      rx: "14",
      fill: accent,
      opacity: ".9"
    }), /*#__PURE__*/React.createElement("text", {
      x: w / 2,
      y: h - 37,
      fill: bg,
      fontFamily: "Geist Mono, monospace",
      fontSize: "10",
      textAnchor: "middle",
      letterSpacing: "2"
    }, "PRENDRE RENDEZ-VOUS \u2192"));
  }
  if (kind === 'saas') {
    // "Adèle Marchand" — psychologist: dark intimate editorial, big quote block,
    // a calm row of section markers at the bottom.
    return /*#__PURE__*/React.createElement("svg", {
      viewBox: `0 0 ${w} ${h}`,
      role: "img",
      "aria-label": "Aper\xE7u du concept Ad\xE8le Marchand \u2014 psychologue clinicienne \xE0 Paris : mise en page sombre et \xE9ditoriale avec une grande citation centrale.",
      style: {
        width: '100%',
        height: '100%',
        display: 'block'
      }
    }, /*#__PURE__*/React.createElement("title", null, "Ad\xE8le Marchand \u2014 concept psychologue"), /*#__PURE__*/React.createElement("rect", {
      width: w,
      height: h,
      fill: bg
    }), /*#__PURE__*/React.createElement("text", {
      x: "40",
      y: "50",
      fill: accent,
      fontFamily: "Spectral, serif",
      fontSize: "28",
      fontStyle: "italic"
    }, "Ad\xE8le Marchand"), /*#__PURE__*/React.createElement("text", {
      x: w - 40,
      y: "50",
      fill: accent,
      opacity: ".5",
      fontFamily: "Geist Mono, monospace",
      fontSize: "9",
      textAnchor: "end",
      letterSpacing: "2"
    }, "PSYCHOLOGUE \xB7 PARIS 11E"), /*#__PURE__*/React.createElement("rect", {
      x: "40",
      y: "80",
      width: w - 80,
      height: "190",
      fill: accent,
      opacity: ".22",
      rx: "4"
    }), /*#__PURE__*/React.createElement("text", {
      x: w / 2,
      y: "190",
      fill: accent,
      fontFamily: "Spectral, serif",
      fontSize: "32",
      fontStyle: "italic",
      textAnchor: "middle",
      opacity: ".85"
    }, "Un espace pour penser."), /*#__PURE__*/React.createElement("g", {
      transform: "translate(40, 290)"
    }, [0, 1, 2, 3].map(i => /*#__PURE__*/React.createElement("rect", {
      key: i,
      x: i * 130,
      y: "0",
      width: "115",
      height: "60",
      rx: "4",
      fill: accent,
      opacity: 0.15 + i * 0.05
    }))));
  }
  // "Studio Lune" — yoga & pilates: terracotta background, calligraphic
  // headline, schedule chips below.
  return /*#__PURE__*/React.createElement("svg", {
    viewBox: `0 0 ${w} ${h}`,
    role: "img",
    "aria-label": "Aper\xE7u du concept Studio Lune \u2014 studio de yoga et pilates \xE0 Lyon : fond terracotta, titre calligraphique central et bandeau d'horaires de s\xE9ances.",
    style: {
      width: '100%',
      height: '100%',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("title", null, "Studio Lune \u2014 concept yoga & pilates"), /*#__PURE__*/React.createElement("rect", {
    width: w,
    height: h,
    fill: accent
  }), /*#__PURE__*/React.createElement("text", {
    x: w / 2,
    y: h / 2 - 30,
    fill: bg,
    fontFamily: "Spectral, serif",
    fontSize: "84",
    fontStyle: "italic",
    textAnchor: "middle",
    letterSpacing: "-2"
  }, "Studio Lune"), /*#__PURE__*/React.createElement("text", {
    x: w / 2,
    y: h / 2 + 8,
    fill: bg,
    fontFamily: "Geist Mono, monospace",
    fontSize: "10",
    textAnchor: "middle",
    letterSpacing: "6",
    opacity: ".85"
  }, "YOGA \xB7 PILATES \xB7 LYON"), /*#__PURE__*/React.createElement("g", {
    transform: `translate(${w / 2 - 200}, ${h - 80})`
  }, ['LUN 08H', 'MAR 19H', 'MER 12H', 'JEU 19H', 'SAM 10H'].map((label, i) => /*#__PURE__*/React.createElement("g", {
    key: i,
    transform: `translate(${i * 84}, 0)`
  }, /*#__PURE__*/React.createElement("rect", {
    width: "76",
    height: "32",
    rx: "16",
    fill: bg,
    opacity: ".18"
  }), /*#__PURE__*/React.createElement("text", {
    x: "38",
    y: "20",
    fill: bg,
    fontFamily: "Geist Mono, monospace",
    fontSize: "9",
    textAnchor: "middle",
    letterSpacing: "1.5"
  }, label)))));
}

// Expose globals
Object.assign(window, {
  Magnetic,
  PHImg,
  BrowserMock,
  useParallax,
  LangToggle,
  PreviewArt,
  CP_PROJECTS
});
