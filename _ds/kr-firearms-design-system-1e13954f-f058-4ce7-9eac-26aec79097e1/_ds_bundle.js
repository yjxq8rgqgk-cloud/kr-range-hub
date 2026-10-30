/* @ds-bundle: {"format":3,"namespace":"KRFirearmsDesignSystem_1e1395","components":[],"sourceHashes":{"ui_kits/studio-site/Footer.jsx":"c0836197dba0","ui_kits/studio-site/Header.jsx":"449354ebb464","ui_kits/studio-site/Hero.jsx":"af7c94e38b9e","ui_kits/studio-site/ProjectDetail.jsx":"518d3ba11580","ui_kits/studio-site/WorkGrid.jsx":"fa086f1c14d8"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.KRFirearmsDesignSystem_1e1395 = window.KRFirearmsDesignSystem_1e1395 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// ui_kits/studio-site/Footer.jsx
try { (() => {
/* global React */
function Footer() {
  const cols = [{
    h: 'Services',
    items: ['Brand & identity', 'Product design', 'Packaging', 'Web & UI']
  }, {
    h: 'Studio',
    items: ['About', 'Process', 'Journal', 'Careers']
  }, {
    h: 'Contact',
    items: ['Start a project', 'hello@kr.design', 'Instagram', 'LinkedIn']
  }];
  return /*#__PURE__*/React.createElement("footer", {
    style: krFoot.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: krFoot.wm
  }), /*#__PURE__*/React.createElement("div", {
    style: krFoot.inner
  }, /*#__PURE__*/React.createElement("div", {
    style: krFoot.brandCol
  }, /*#__PURE__*/React.createElement("div", {
    style: krFoot.word
  }, "KR", /*#__PURE__*/React.createElement("i", {
    style: krFoot.thin
  }, "Design")), /*#__PURE__*/React.createElement("p", {
    style: krFoot.tag
  }, "Forged once. Carried for years."), /*#__PURE__*/React.createElement("div", {
    style: krFoot.stamp
  }, "EST\xB7TARN")), /*#__PURE__*/React.createElement("div", {
    style: krFoot.links
  }, cols.map(c => /*#__PURE__*/React.createElement("div", {
    key: c.h
  }, /*#__PURE__*/React.createElement("div", {
    style: krFoot.colH
  }, c.h), c.items.map(it => /*#__PURE__*/React.createElement("a", {
    key: it,
    style: krFoot.link,
    href: "#"
  }, it)))))), /*#__PURE__*/React.createElement("div", {
    style: krFoot.legal
  }, /*#__PURE__*/React.createElement("span", null, "\xA9 1894\u20132026 KR Dienstleistungen GmbH"), /*#__PURE__*/React.createElement("span", null, "Independent design studio \xB7 Germany")));
}
const krFoot = {
  wrap: {
    position: 'relative',
    overflow: 'hidden',
    background: 'var(--ink-850)',
    borderTop: '1px solid var(--ink-600)',
    padding: '56px 32px 28px'
  },
  wm: {
    position: 'absolute',
    left: -40,
    top: -20,
    width: 300,
    height: 170,
    opacity: .08,
    background: "url('../../assets/kr-mark-line.png') center/contain no-repeat",
    pointerEvents: 'none'
  },
  inner: {
    position: 'relative',
    maxWidth: 1180,
    margin: '0 auto',
    display: 'flex',
    justifyContent: 'space-between',
    gap: 40,
    flexWrap: 'wrap'
  },
  brandCol: {
    maxWidth: 280
  },
  word: {
    fontFamily: 'var(--font-display)',
    fontSize: 26,
    color: 'var(--bone-050)',
    textTransform: 'uppercase',
    display: 'flex',
    gap: 8,
    alignItems: 'baseline'
  },
  thin: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 600,
    fontSize: 13,
    fontStyle: 'normal',
    letterSpacing: '.18em',
    color: 'var(--copper-bright)'
  },
  tag: {
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg-dim)',
    margin: '12px 0 16px'
  },
  stamp: {
    fontFamily: 'var(--font-stamp)',
    fontSize: 30,
    color: 'rgba(195,154,76,.5)',
    letterSpacing: '.12em'
  },
  links: {
    display: 'flex',
    gap: 56,
    flexWrap: 'wrap'
  },
  colH: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 700,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '.12em',
    color: 'var(--sand-200)',
    marginBottom: 14
  },
  link: {
    display: 'block',
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg-dim)',
    textDecoration: 'none',
    padding: '5px 0'
  },
  legal: {
    position: 'relative',
    maxWidth: 1180,
    margin: '40px auto 0',
    paddingTop: 18,
    borderTop: '1px solid var(--ink-600)',
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    gap: 12,
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--earth-400)'
  }
};
window.Footer = Footer;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio-site/Footer.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio-site/Header.jsx
try { (() => {
/* global React */
function Header({
  onHome,
  onNav,
  active
}) {
  const links = ['Work', 'Services', 'Studio', 'Journal', 'Contact'];
  return /*#__PURE__*/React.createElement("header", {
    style: krHeader.bar
  }, /*#__PURE__*/React.createElement("button", {
    style: krHeader.brand,
    onClick: onHome
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/kr-mark-line.png",
    alt: "KR",
    style: krHeader.logo
  }), /*#__PURE__*/React.createElement("span", {
    style: krHeader.word
  }, "KR", /*#__PURE__*/React.createElement("i", {
    style: krHeader.wordThin
  }, "Design"))), /*#__PURE__*/React.createElement("nav", {
    style: krHeader.nav
  }, links.map(l => /*#__PURE__*/React.createElement("button", {
    key: l,
    style: {
      ...krHeader.link,
      ...(l === active ? krHeader.linkActive : {})
    },
    onClick: () => onNav && onNav(l)
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: krHeader.right
  }, /*#__PURE__*/React.createElement("button", {
    style: krHeader.iconBtn,
    title: "Search"
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "search"
  })), /*#__PURE__*/React.createElement("button", {
    style: krHeader.cta,
    onClick: () => onNav && onNav('Contact')
  }, "Start a project")));
}
const krHeader = {
  bar: {
    position: 'sticky',
    top: 0,
    zIndex: 50,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '14px 32px',
    height: 64,
    boxSizing: 'border-box',
    background: 'rgba(16,14,9,.86)',
    backdropFilter: 'blur(10px)',
    borderBottom: '1px solid var(--ink-600)'
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    background: 'none',
    border: 0,
    cursor: 'pointer',
    padding: 0
  },
  logo: {
    height: 34,
    width: 46,
    objectFit: 'cover',
    objectPosition: '100% 50%'
  },
  word: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    color: 'var(--bone-050)',
    textTransform: 'uppercase',
    letterSpacing: '.02em',
    display: 'flex',
    gap: 7,
    alignItems: 'baseline'
  },
  wordThin: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 600,
    fontSize: 13,
    fontStyle: 'normal',
    letterSpacing: '.18em',
    color: 'var(--copper-bright)'
  },
  nav: {
    display: 'flex',
    gap: 4
  },
  link: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 600,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: '.1em',
    color: 'var(--sand-200)',
    background: 'none',
    border: 0,
    cursor: 'pointer',
    padding: '8px 14px',
    borderRadius: 4
  },
  linkActive: {
    color: 'var(--bone-050)',
    background: 'var(--ink-700)'
  },
  right: {
    display: 'flex',
    gap: 10,
    alignItems: 'center'
  },
  iconBtn: {
    width: 38,
    height: 38,
    display: 'grid',
    placeItems: 'center',
    background: 'none',
    border: '1px solid var(--ink-600)',
    borderRadius: 4,
    color: 'var(--sand-200)',
    cursor: 'pointer'
  },
  cta: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 700,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: '.08em',
    padding: '11px 18px',
    borderRadius: 4,
    border: 0,
    background: 'var(--copper)',
    color: '#1B130C',
    cursor: 'pointer'
  }
};
window.Header = Header;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio-site/Header.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio-site/Hero.jsx
try { (() => {
/* global React */
function Hero({
  onWork,
  onContact
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: krHero.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: krHero.watermark
  }), /*#__PURE__*/React.createElement("div", {
    style: krHero.scrim
  }), /*#__PURE__*/React.createElement("div", {
    style: krHero.inner
  }, /*#__PURE__*/React.createElement("div", {
    style: krHero.eyebrow
  }, "Independent design studio \xB7 Est. 1894"), /*#__PURE__*/React.createElement("h1", {
    style: krHero.h1
  }, "Design that", /*#__PURE__*/React.createElement("br", null), "earns its keep"), /*#__PURE__*/React.createElement("p", {
    style: krHero.lead
  }, "KR is a small studio that forges brands, products and the things around them by hand \u2014 no fluff, no filler. You get work that carries its weight, and keeps earning it."), /*#__PURE__*/React.createElement("div", {
    style: krHero.row
  }, /*#__PURE__*/React.createElement("button", {
    style: krHero.primary,
    onClick: onWork
  }, "See the work"), /*#__PURE__*/React.createElement("button", {
    style: krHero.ghost,
    onClick: onContact
  }, "Start a project \u2192")), /*#__PURE__*/React.createElement("div", {
    style: krHero.specbar
  }, /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Brand"), " & identity"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Product"), " & industrial"), /*#__PURE__*/React.createElement("span", null, /*#__PURE__*/React.createElement("b", null, "Packaging"), ", print & web"))), /*#__PURE__*/React.createElement("div", {
    style: krHero.stamp
  }, "KR"));
}
const krHero = {
  wrap: {
    position: 'relative',
    overflow: 'hidden',
    background: 'radial-gradient(120% 100% at 80% -10%, #2a2417 0%, #14110B 55%)',
    borderBottom: '1px solid var(--ink-600)',
    padding: '92px 32px 64px'
  },
  watermark: {
    position: 'absolute',
    right: -40,
    top: '50%',
    transform: 'translateY(-50%)',
    width: 640,
    height: 360,
    opacity: 0.13,
    background: "url('../../assets/kr-mark-line.png') center/contain no-repeat",
    pointerEvents: 'none'
  },
  scrim: {
    position: 'absolute',
    inset: 0,
    background: 'linear-gradient(90deg, rgba(16,14,9,.92) 30%, rgba(16,14,9,.2) 70%)'
  },
  inner: {
    position: 'relative',
    maxWidth: 720
  },
  eyebrow: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '.18em',
    color: 'var(--copper-bright)',
    marginBottom: 18
  },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 66,
    lineHeight: .96,
    textTransform: 'uppercase',
    color: 'var(--bone-050)',
    margin: 0,
    letterSpacing: '-0.01em'
  },
  lead: {
    fontFamily: 'var(--font-body)',
    fontSize: 18,
    lineHeight: 1.55,
    color: 'var(--sand-100)',
    maxWidth: 540,
    margin: '22px 0 30px'
  },
  row: {
    display: 'flex',
    gap: 14,
    flexWrap: 'wrap'
  },
  primary: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 700,
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: '.08em',
    padding: '15px 28px',
    borderRadius: 4,
    border: 0,
    background: 'var(--copper)',
    color: '#1B130C',
    cursor: 'pointer'
  },
  ghost: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 700,
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: '.08em',
    padding: '15px 26px',
    borderRadius: 4,
    border: '1px solid var(--border-strong)',
    background: 'transparent',
    color: 'var(--sand-100)',
    cursor: 'pointer'
  },
  specbar: {
    display: 'flex',
    gap: 28,
    flexWrap: 'wrap',
    marginTop: 40,
    fontFamily: 'var(--font-body)',
    fontSize: 14,
    color: 'var(--fg-dim)'
  },
  stamp: {
    position: 'absolute',
    right: 48,
    bottom: 18,
    fontFamily: 'var(--font-stamp)',
    fontSize: 120,
    color: 'rgba(210,176,90,.10)',
    letterSpacing: '.05em',
    pointerEvents: 'none'
  }
};
window.Hero = Hero;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio-site/Hero.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio-site/ProjectDetail.jsx
try { (() => {
/* global React */
function ProjectDetail({
  p,
  onBack,
  onContact
}) {
  const facts = [['Sector', p.sector], ['Year', p.year], ['Scope', p.scope.split(' · ')[0]], ['Team', 'KR + 2']];
  const deliverables = ['Strategy', 'Identity system', 'Art direction', 'Guidelines'];
  return /*#__PURE__*/React.createElement("section", {
    style: krPD.wrap
  }, /*#__PURE__*/React.createElement("button", {
    style: krPD.back,
    onClick: onBack
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "arrow-left"
  }), " Back to the work"), /*#__PURE__*/React.createElement("div", {
    style: krPD.cols
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...krPD.stage,
      background: `radial-gradient(120% 95% at 65% 25%, ${p.tint}, #121310)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: krPD.stageWm
  }), /*#__PURE__*/React.createElement("span", {
    style: krPD.stageName
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: krPD.stageNote
  }, "case imagery pending \u2014 placeholder")), /*#__PURE__*/React.createElement("div", {
    style: krPD.info
  }, /*#__PURE__*/React.createElement("div", {
    style: krPD.eyebrow
  }, p.tag, " \xB7 ", p.sector), /*#__PURE__*/React.createElement("h1", {
    style: krPD.h1
  }, p.name), /*#__PURE__*/React.createElement("p", {
    style: krPD.blurb
  }, p.blurb), /*#__PURE__*/React.createElement("div", {
    style: krPD.statRow
  }, facts.map(([k, v]) => /*#__PURE__*/React.createElement("div", {
    key: k,
    style: krPD.stat
  }, /*#__PURE__*/React.createElement("div", {
    style: krPD.statK
  }, k), /*#__PURE__*/React.createElement("div", {
    style: krPD.statV
  }, v)))), /*#__PURE__*/React.createElement("div", {
    style: krPD.field
  }, /*#__PURE__*/React.createElement("div", {
    style: krPD.label
  }, "Palette"), /*#__PURE__*/React.createElement("div", {
    style: krPD.swatches
  }, p.palette.map((c, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: krPD.sw
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      ...krPD.swDot,
      background: c
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: krPD.swHex
  }, c.toUpperCase()))))), /*#__PURE__*/React.createElement("div", {
    style: krPD.field
  }, /*#__PURE__*/React.createElement("div", {
    style: krPD.label
  }, "Deliverables"), /*#__PURE__*/React.createElement("div", {
    style: krPD.tags
  }, deliverables.map(t => /*#__PURE__*/React.createElement("span", {
    key: t,
    style: krPD.tag
  }, t)))), /*#__PURE__*/React.createElement("div", {
    style: krPD.buy
  }, /*#__PURE__*/React.createElement("button", {
    style: krPD.add,
    onClick: onContact
  }, "Start a project like this")), /*#__PURE__*/React.createElement("div", {
    style: krPD.note
  }, /*#__PURE__*/React.createElement("i", {
    "data-lucide": "shield-check"
  }), " Fixed scope, fixed price \xB7 shipped on a date we agree up front"))));
}
const krPD = {
  wrap: {
    maxWidth: 1100,
    margin: '0 auto',
    padding: '32px 32px 80px'
  },
  back: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    background: 'none',
    border: 0,
    color: 'var(--sand-200)',
    fontFamily: 'var(--font-cond)',
    fontWeight: 600,
    fontSize: 13,
    textTransform: 'uppercase',
    letterSpacing: '.08em',
    cursor: 'pointer',
    marginBottom: 24
  },
  cols: {
    display: 'grid',
    gridTemplateColumns: '1.05fr 1fr',
    gap: 36,
    alignItems: 'start'
  },
  stage: {
    position: 'relative',
    borderRadius: 8,
    border: '1px solid var(--ink-600)',
    height: 440,
    overflow: 'hidden',
    boxShadow: 'var(--shadow-lg)'
  },
  stageWm: {
    position: 'absolute',
    right: -30,
    bottom: 20,
    width: 380,
    height: 210,
    opacity: .18,
    background: "url('../../assets/kr-mark-line.png') center/contain no-repeat"
  },
  stageName: {
    position: 'absolute',
    left: 28,
    bottom: 46,
    fontFamily: 'var(--font-display)',
    fontSize: 64,
    textTransform: 'uppercase',
    color: 'rgba(239,232,214,.12)'
  },
  stageNote: {
    position: 'absolute',
    left: 30,
    bottom: 26,
    fontFamily: 'var(--font-mono)',
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '.16em',
    color: 'var(--earth-400)'
  },
  info: {
    paddingTop: 4
  },
  eyebrow: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '.16em',
    color: 'var(--copper-bright)'
  },
  h1: {
    fontFamily: 'var(--font-display)',
    fontSize: 52,
    textTransform: 'uppercase',
    color: 'var(--bone-050)',
    margin: '8px 0 0',
    lineHeight: .96
  },
  blurb: {
    fontFamily: 'var(--font-body)',
    fontSize: 16,
    lineHeight: 1.6,
    color: 'var(--sand-100)',
    margin: '14px 0 24px',
    maxWidth: 460
  },
  statRow: {
    display: 'flex',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 24
  },
  stat: {
    flex: '1 1 90px',
    background: 'var(--ink-900)',
    border: '1px solid var(--ink-600)',
    borderLeft: '3px solid var(--copper)',
    borderRadius: 3,
    padding: '9px 12px'
  },
  statK: {
    fontFamily: 'var(--font-mono)',
    fontSize: 9.5,
    textTransform: 'uppercase',
    letterSpacing: '.1em',
    color: 'var(--earth-400)'
  },
  statV: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 700,
    fontSize: 18,
    color: 'var(--bone-050)',
    marginTop: 3
  },
  field: {
    marginBottom: 22
  },
  label: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '.12em',
    color: 'var(--earth-300)',
    marginBottom: 10
  },
  swatches: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  },
  sw: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '7px 11px',
    borderRadius: 4,
    border: '1px solid var(--border-strong)',
    background: 'var(--ink-800)'
  },
  swDot: {
    width: 16,
    height: 16,
    borderRadius: 3,
    border: '1px solid rgba(255,255,255,.15)'
  },
  swHex: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--sand-200)'
  },
  tags: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap'
  },
  tag: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 600,
    fontSize: 11,
    textTransform: 'uppercase',
    letterSpacing: '.07em',
    padding: '5px 11px',
    borderRadius: 999,
    border: '1px solid var(--border-metal)',
    color: 'var(--field-tan)'
  },
  buy: {
    display: 'flex',
    alignItems: 'center',
    gap: 18,
    marginTop: 28
  },
  add: {
    flex: 1,
    fontFamily: 'var(--font-cond)',
    fontWeight: 700,
    fontSize: 15,
    textTransform: 'uppercase',
    letterSpacing: '.08em',
    padding: '15px 22px',
    borderRadius: 4,
    border: 0,
    background: 'var(--copper)',
    color: '#1B130C',
    cursor: 'pointer'
  },
  note: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    marginTop: 16,
    fontFamily: 'var(--font-body)',
    fontSize: 13,
    color: 'var(--fg-dim)'
  }
};
window.ProjectDetail = ProjectDetail;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio-site/ProjectDetail.jsx", error: String((e && e.message) || e) }); }

// ui_kits/studio-site/WorkGrid.jsx
try { (() => {
/* global React */
const KR_WORK = [{
  id: 'vantage',
  name: 'Vantage',
  tag: 'Brand',
  sector: 'Optics',
  year: '2025',
  scope: 'Identity · Web',
  tint: '#3a3324',
  blurb: 'A ground-up identity for a precision optics maker — wordmark, system, and site.',
  palette: ['#7A5E38', '#B59A6E', '#33332F', '#DCD0B5']
}, {
  id: 'halden',
  name: 'Halden',
  tag: 'Packaging',
  sector: 'Spirits',
  year: '2024',
  scope: 'Packaging · Print',
  tint: '#2e3322',
  blurb: 'Label and box system for a small-batch distillery. Built to hold a shelf.',
  palette: ['#4E4F35', '#C39A4C', '#1E1A12', '#B59A6E']
}, {
  id: 'warden',
  name: 'Warden',
  tag: 'Product',
  sector: 'Tools',
  year: '2024',
  scope: 'Industrial · CMF',
  tint: '#26241f',
  blurb: 'Industrial design and finish work for a flagship hand tool. Made to take a beating.',
  palette: ['#33332F', '#9A988F', '#B26A3E', '#14110B']
}, {
  id: 'sentinel',
  name: 'Sentinel',
  tag: 'Digital',
  sector: 'Security',
  year: '2023',
  scope: 'Product · UI',
  tint: '#3a3124',
  blurb: 'Interface system for a monitoring platform. Fast, legible, built to scale.',
  palette: ['#6A6C43', '#C9824E', '#211C13', '#DCD0B5']
}];
function WorkCard({
  p,
  onOpen
}) {
  return /*#__PURE__*/React.createElement("button", {
    style: krCard.card,
    onClick: () => onOpen(p),
    onMouseEnter: e => {
      e.currentTarget.style.borderColor = 'var(--border-metal)';
      e.currentTarget.style.transform = 'translateY(-3px)';
    },
    onMouseLeave: e => {
      e.currentTarget.style.borderColor = 'var(--ink-600)';
      e.currentTarget.style.transform = 'none';
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      ...krCard.thumb,
      background: `radial-gradient(120% 95% at 72% 18%, ${p.tint}, #141510)`
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: krCard.thumbWm
  }), /*#__PURE__*/React.createElement("span", {
    style: krCard.badge
  }, p.tag), /*#__PURE__*/React.createElement("span", {
    style: krCard.silhouette
  }, p.name), /*#__PURE__*/React.createElement("span", {
    style: krCard.photoNote
  }, "case imagery pending")), /*#__PURE__*/React.createElement("div", {
    style: krCard.body
  }, /*#__PURE__*/React.createElement("div", {
    style: krCard.name
  }, p.name), /*#__PURE__*/React.createElement("div", {
    style: krCard.spec
  }, p.sector, " \xB7 ", p.year, " \xB7 ", p.scope), /*#__PURE__*/React.createElement("div", {
    style: krCard.foot
  }, /*#__PURE__*/React.createElement("span", {
    style: krCard.dots
  }, p.palette.map((c, i) => /*#__PURE__*/React.createElement("i", {
    key: i,
    style: {
      ...krCard.dot,
      background: c
    }
  }))), /*#__PURE__*/React.createElement("span", {
    style: krCard.cta
  }, "View case \u2192"))));
}
function WorkGrid({
  onOpen
}) {
  return /*#__PURE__*/React.createElement("section", {
    style: krGrid.wrap
  }, /*#__PURE__*/React.createElement("div", {
    style: krGrid.head
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: krGrid.eyebrow
  }, "Selected work"), /*#__PURE__*/React.createElement("h2", {
    style: krGrid.h2
  }, "Things we've forged")), /*#__PURE__*/React.createElement("div", {
    style: krGrid.filters
  }, ['All', 'Brand', 'Product', 'Digital'].map((f, i) => /*#__PURE__*/React.createElement("span", {
    key: f,
    style: {
      ...krGrid.chip,
      ...(i === 0 ? krGrid.chipOn : {})
    }
  }, f)))), /*#__PURE__*/React.createElement("div", {
    style: krGrid.grid
  }, KR_WORK.map(p => /*#__PURE__*/React.createElement(WorkCard, {
    key: p.id,
    p: p,
    onOpen: onOpen
  }))));
}
const krCard = {
  card: {
    textAlign: 'left',
    padding: 0,
    cursor: 'pointer',
    background: 'var(--ink-800)',
    border: '1px solid var(--ink-600)',
    borderRadius: 6,
    overflow: 'hidden',
    transition: 'transform .2s var(--ease-out), border-color .2s',
    boxShadow: 'var(--shadow-md)'
  },
  thumb: {
    position: 'relative',
    height: 168,
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    padding: 12,
    overflow: 'hidden'
  },
  thumbWm: {
    position: 'absolute',
    right: -30,
    bottom: -20,
    width: 190,
    height: 108,
    opacity: .16,
    background: "url('../../assets/kr-mark-line.png') center/contain no-repeat"
  },
  badge: {
    position: 'relative',
    fontFamily: 'var(--font-cond)',
    fontWeight: 700,
    fontSize: 10,
    textTransform: 'uppercase',
    letterSpacing: '.1em',
    padding: '4px 9px',
    borderRadius: 3,
    background: 'rgba(178,106,62,.18)',
    color: 'var(--copper-bright)',
    border: '1px solid var(--copper-deep)'
  },
  silhouette: {
    position: 'absolute',
    left: 14,
    bottom: 30,
    fontFamily: 'var(--font-display)',
    fontSize: 40,
    textTransform: 'uppercase',
    color: 'rgba(239,232,214,.12)',
    letterSpacing: '.02em'
  },
  photoNote: {
    position: 'absolute',
    left: 16,
    bottom: 14,
    fontFamily: 'var(--font-mono)',
    fontSize: 9,
    textTransform: 'uppercase',
    letterSpacing: '.16em',
    color: 'var(--earth-400)'
  },
  body: {
    padding: 14
  },
  name: {
    fontFamily: 'var(--font-display)',
    fontSize: 22,
    textTransform: 'uppercase',
    color: 'var(--bone-050)',
    lineHeight: 1
  },
  spec: {
    fontFamily: 'var(--font-mono)',
    fontSize: 11,
    color: 'var(--earth-400)',
    marginTop: 7
  },
  foot: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 13
  },
  dots: {
    display: 'flex',
    gap: 5
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: 3,
    border: '1px solid rgba(255,255,255,.12)'
  },
  cta: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '.08em',
    color: 'var(--copper-bright)'
  }
};
const krGrid = {
  wrap: {
    padding: '64px 32px 72px',
    maxWidth: 1180,
    margin: '0 auto'
  },
  head: {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    marginBottom: 28,
    flexWrap: 'wrap',
    gap: 16
  },
  eyebrow: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '.18em',
    color: 'var(--copper-bright)',
    marginBottom: 8
  },
  h2: {
    fontFamily: 'var(--font-display)',
    fontSize: 38,
    textTransform: 'uppercase',
    color: 'var(--bone-050)',
    margin: 0
  },
  filters: {
    display: 'flex',
    gap: 8
  },
  chip: {
    fontFamily: 'var(--font-cond)',
    fontWeight: 600,
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: '.06em',
    padding: '7px 13px',
    borderRadius: 999,
    border: '1px solid var(--border-strong)',
    color: 'var(--sand-200)',
    cursor: 'pointer'
  },
  chipOn: {
    background: 'var(--ink-700)',
    color: 'var(--bone-050)',
    borderColor: 'var(--border-metal)'
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(258px, 1fr))',
    gap: 18
  }
};
window.KR_WORK = KR_WORK;
window.WorkCard = WorkCard;
window.WorkGrid = WorkGrid;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/studio-site/WorkGrid.jsx", error: String((e && e.message) || e) }); }

})();
