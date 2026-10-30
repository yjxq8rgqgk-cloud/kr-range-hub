# KR Design — Design System

Brand & UI system for **KR Design** — an independent German design & build studio (legal entity
**KR Dienstleistungen**). KR designs brands, products and the things around them with a rugged,
field-grade sensibility. The identity centres on a forged **metallic wolf head** paired with a
flowing **"KR" script monogram**, set on dark, stone-like fields. The feel is premium and
hard-wearing: warm earthy camouflage ("Est-Tarn"), gunmetal and copper, nothing soft or
decorative for its own sake. (A firearms/tactical heritage is where the look comes from; the
studio itself works broadly, not firearms-first.)

> **Brief, verbatim (DE):** "genau wie vorgegeben erdiges warmes Est-Tarn. Markenstimme
> verspielt aber sehr konkret. Hintergründe meist in dunkleren Tönen gehalten. Schriftart
> Standard damit sie gut gelesen werden kann. meistens das Logo im Hintergrund aber eher
> dezent und klein. Ausdrucke nur in Grautönen."

Translation of the directives that drive this system:
- **Palette:** earthy, warm camouflage tones ("Est-Tarn") — exactly as supplied.
- **Voice:** playful but very concrete.
- **Backgrounds:** mostly kept in darker tones.
- **Type:** a *standard*, highly legible typeface for running text.
- **Logo:** usually present in the background, but discreet and small.
- **Print:** output in greyscale only.

## Source material provided
- `uploads/wolf_logo quer.JPG` — primary horizontal lockup (wolf + KR monogram). → `assets/kr-logo-landscape.jpg`
- `uploads/wolf-logo hochkant.JPG` — vertical lockup. → `assets/kr-logo-portrait.jpg`
- `uploads/hintergrund.jpeg` — dark slate/stone background texture. → `assets/bg-slate.jpg`
- `uploads/wolf_logo.svg` — **empty wrapper** (no embedded artwork); unusable, ignored.
- `fonts/gunplay_rg.otf` — *Gunplay*, the tactical display face (user-provided).
- `fonts/Ghost_Factory.ttf` — *Ghost Factory*, distressed stamp face (user-provided).

No codebase, Figma, or live product was supplied. The UI kit in `ui_kits/` is therefore an
**original, on-brand** realization of the most likely surface (the KR Design studio site),
built from these foundations — not a recreation of an existing build.

---

## CONTENT FUNDAMENTALS — how KR writes

**Voice: playful but very concrete.** Confident, a little wry, never gimmicky. Every claim is
backed by a hard spec or a plain fact. Swagger is earned through precision, not adjectives.

- **Person:** Speaks as "we" about the studio, addresses the reader as "you." Imperative for
  CTAs ("Start a project," "See the work").
- **Casing:** Display headlines are **UPPERCASE** (set in Gunplay). Body is sentence case.
  Labels and eyebrows are uppercase with wide tracking. Project names stay as written (e.g.
  `Vantage`, `Halden`).
- **Concreteness:** Pair personality with a fact. *"Fixed scope, fixed price — shipped on a date
  we agree up front."* Claims are backed by specifics (sector, scope, timeline), never fluff.
- **Rhythm:** Short, punchy sentences. Fragments are welcome for impact. *"Built once. Carried
  for years."*
- **German + English:** The brand operates in German ("Dienstleistungen", "Est-Tarn") and
  English. Keep names and units consistent; don't translate project names.
- **Emoji:** **None.** Not part of the brand. Use the stamp face or a small mark for emphasis
  instead.
- **Numerals & units:** Mono face for project facts and data
  (`SECTOR OPTICS · SCOPE IDENTITY+WEB · 2025`).

**Sample copy:**
- Eyebrow: `INDEPENDENT DESIGN STUDIO · EST. 1894`
- Headline: `DESIGN THAT EARNS ITS KEEP`
- Lead: "KR is a small studio that forges brands, products and the things around them by hand —
  no fluff, no filler. You get work that carries its weight, and keeps earning it."
- CTA: `Start a project →` · `See the work`

---

## VISUAL FOUNDATIONS

**Overall vibe.** Forged, field-grade, premium-tactical. Dark stone and gunmetal with warm
metal highlights. Restraint over decoration — the wolf mark does the heavy lifting, usually
small and quiet in a corner.

**Color.** Warm, earthy and dark-biased — see `colors_and_type.css`.
- *Neutrals* run a warm-earth ramp from near-black `#14110B` (primary canvas) up through
  coyote/khaki to bone `#EFE8D6`. Brown-grey, never blue-grey.
- *Camo accents ("Est-Tarn")*: olive drab, olive, coyote brown, field tan.
- *Metallics* sampled from the mark: copper `#B26A3E` (the primary action color), bronze,
  gold (the "KR" highlight), steel and gunmetal.
- *Semantic*: success olive-green, warning amber, danger brick-red, info steel.
- **Greyscale-safe:** colors are chosen for distinct luminance steps so printed (mono) output
  stays readable. Never rely on hue alone to carry meaning.

**Type.** Three roles (full spec in `colors_and_type.css`):
- **Display — Gunplay** (self-hosted): blocky, military, uppercase. Headlines, hero, big
  numerals. Tracking slightly negative.
- **Stamp — Ghost Factory** (self-hosted): distressed/eroded. *Impact moments only* — stamps,
  watermark numerals, a single hero word. Never paragraphs.
- **Body & UI — Barlow** (Google Fonts): the "standard, legible" face the brief asks for. Warm,
  faintly technical, excellent at small sizes. Carries all running text, labels, buttons, forms.
- **Mono — JetBrains Mono** (Google Fonts): spec readouts, model codes, data tables.

**Backgrounds.** Mostly dark. Three treatments: flat warm-black `#14110B`; the supplied
**slate texture** (`assets/bg-slate.jpg`) at low brightness; and a **quiet logo watermark** —
the wolf mark at ~8–12% opacity, small, tucked lower-right. No bright/light page backgrounds,
no bluish-purple gradients, no busy patterns.

**Imagery.** Warm, low-key, slightly desaturated with a hint of grain — gunmetal and earth, lit
hard from one side. The supplied renders set the reference: dark stone, copper and steel.
Greyscale conversions should hold up (for print).

**Borders & cards.** Cards are `--ink-800` surfaces with a 1px warm border (`--ink-600`),
small radius (4–6px) and a deep, low, warm-black shadow used sparingly. A 3px **copper
left-accent** marks spec/stat blocks. Edges are hard and squared — tactical, not rounded-soft.

**Radii.** Small and hard: `0 / 2 / 4 / 8px`, plus a pill for tags only. Default is `4px`.

**Shadows.** Deep and warm-black (`0 18px 48px rgba(0,0,0,.55)` at the top end), used only to
lift key surfaces. One special **copper glow** for the primary focused/active state.

**Spacing & layout.** 4px base grid (`4 8 12 16 24 32 48 64 96 128`). Generous outer margins,
tight internal rhythm. Fixed elements: a slim sticky header; the logo watermark sits fixed in a
section corner, not scrolling busily.

**Motion.** Minimal and purposeful. Short fades/translates (120–360ms) on `cubic-bezier(.2,.7,.2,1)`.
No bounces, no infinite decorative loops. Reveal-on-active for hero content; honor
`prefers-reduced-motion`.

**Interaction states.**
- *Hover*: lighten one step (copper → copper-bright) or fill a ghost control with `--ink-600`.
- *Press*: deepen the color (copper → copper-deep) and nudge down 1px; no scale-bounce.
- *Focus*: 3px copper ring at ~20% alpha, or the full copper glow on primary controls.
- *Disabled*: 40% opacity, `not-allowed`.

**Transparency & blur.** Sparingly — a subtle dark scrim over imagery so text stays legible,
and low-opacity for the watermark. No frosted-glass everywhere.

---

## ICONOGRAPHY

No proprietary icon set was supplied. The system uses **Lucide** (https://lucide.dev) from CDN
as the substitute — its even, geometric **stroke** style (≈2px, square-ish joins) matches the
forged, technical feel and pairs cleanly with Gunplay/Barlow. **→ Substitution flagged: confirm
or supply KR's own icons if one exists.**

Rules:
- **Stroke icons only**, ~1.75–2px, currentColor — never filled/duotone, never multicolor.
- Tint with text colors (`--fg-dim`, `--steel`) or `--copper` for active/emphasis.
- Sizes 16 / 20 / 24px aligned to the grid.
- **No emoji. No unicode-as-icon.** For brand emphasis use the wolf mark or the Ghost Factory
  stamp, not a glyph.
- The **wolf mark** (in `assets/`) is the only "illustration" — used as logo and watermark, not
  decoration. Do not redraw or recolor it.

---

## INDEX — what's in this system

| Path | What it is |
|---|---|
| `README.md` | This file — context, content, visual foundations, iconography. |
| `colors_and_type.css` | All design tokens: colors, type, spacing, radii, shadows, motion + semantic helper classes. Import this in any build. |
| `SKILL.md` | Agent-Skill manifest so this folder works as a downloadable Claude skill. |
| `fonts/` | Self-hosted brand faces: `gunplay_rg.otf` (Gunplay), `Ghost_Factory.ttf` (Ghost Factory). |
| `assets/` | Brand artwork: `kr-mark-line.png` (transparent line mark, "FIREARMS" removed — primary), `kr-logo-landscape.jpg`, `kr-logo-portrait.jpg`, `bg-slate.jpg`. |
| `preview/` | Design-system cards shown in the Design System tab (type, color, spacing, components, brand). |
| `ui_kits/studio-site/` | KR Design studio-site UI kit — `index.html` + JSX components. |

**Substitutions to confirm:** Barlow & JetBrains Mono (body/mono, Google Fonts) and Lucide
(icons, CDN) are stand-ins chosen to fit — swap if KR has house equivalents.
