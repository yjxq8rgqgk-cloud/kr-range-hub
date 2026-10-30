# Halo — usage conventions

Halo is a dark-first, minimal component library. Everything renders on a black ground with a single neon-blue accent used sparingly (mainly around the `HeroInput`). All colors, fonts, radii and spacing are exposed as CSS custom properties.

## Wrap every screen in `<HaloRoot>`

`HaloRoot` sets the page background (`--halo-bg`, black), the base font (`--halo-font-body`), the base text color, and applies `box-sizing: border-box` to descendants. Without it, tokens still resolve but the ground is transparent and text may be unreadable on a light host page.

```tsx
import "@halo/design-system/styles.css";
import { HaloRoot, Nav, Brand, NavLink, Button } from "@halo/design-system";

export default function Page() {
  return (
    <HaloRoot>
      <Nav
        brand={<Brand name="Halo" />}
        links={<>
          <NavLink label="Platform" hasDropdown />
          <NavLink label="Pricing" />
        </>}
        actions={<>
          <a className="halo-btn halo-btn--ghost" href="#">Log in</a>
          <Button variant="primary">Sign up</Button>
        </>}
      />
      {/* your page */}
    </HaloRoot>
  );
}
```

## Import the stylesheet once, at the app root

```tsx
import "@halo/design-system/styles.css";
```

`styles.css` already `@import`s `tokens.css` — do not import `tokens.css` separately unless you want tokens without component styles.

## Style with CSS custom properties, not utility classes

Halo has NO utility class vocabulary (no `bg-surface-1`, no `text-body`). For your own layout glue around Halo components, style with the exposed tokens via `var(--halo-*)`:

```tsx
<section
  style={{
    background: "var(--halo-surface-1)",
    padding: "var(--halo-space-7)",
    borderRadius: "var(--halo-radius-xl)",
    boxShadow: "var(--halo-ring)",
    color: "var(--halo-fg-muted)",
  }}
>
  …
</section>
```

**Available token families** (see `dist/tokens.css` for the full list):

| Family | Names |
|---|---|
| Surface | `--halo-bg`, `--halo-surface-1`, `--halo-surface-2`, `--halo-surface-3`, `--halo-surface-hover` |
| Text | `--halo-fg`, `--halo-fg-muted`, `--halo-fg-dim` |
| Line | `--halo-hairline`, `--halo-hairline-strong` |
| Accent | `--halo-accent`, `--halo-accent-soft`, `--halo-accent-glow` |
| Semantic | `--halo-success` |
| Font | `--halo-font-display`, `--halo-font-body`, `--halo-font-mono` |
| Radius | `--halo-radius-sm/md/lg/xl/pill` (8/14/20/26/999 px) |
| Space | `--halo-space-1..8` (4/8/12/16/24/32/48/64 px) |
| Effect | `--halo-ring`, `--halo-ring-strong`, `--halo-glow` |

## Component composition patterns

- **`Button`** — three variants (`primary` = white pill, `secondary` = dark pill, `ghost` = bare link). Prefer `primary` for the single main CTA per section. Optional `leadingIcon` / `trailingIcon` slots and `href` to render as an `<a>`.
- **`Nav`** — three slots (`brand`, `links`, `actions`). Do not stuff arbitrary JSX into `links`; pass `NavLink` children. Nav is sticky by default.
- **`HeroInput`** — Halo's signature element. Use it AT MOST ONCE per screen — it is the primary interactive object. It pulses; the animation is disabled under `prefers-reduced-motion`.
- **`Card`** — the base rounded panel. Compose `FeatureCard`, `BentoCard`, mock frames, and case-study visuals on it. Add `padded` for default 24px padding.
- **`FeatureCard`** — body left, visual right; stacks under 900px. Pass any React node as `visual` — a mock, an image, an SVG.
- **`BentoCard`** — put in a CSS `grid` with `grid-template-columns: repeat(3, 1fr)` for the platform section pattern.
- **`LogoCell`** — combine 8 in a 4-column grid for the customer-logo row. Use the `variant` prop (`sans`/`serif`/`mono`/`thin`) to vary the wordmark feel.
- **`CaseCard`** — pass `thumbBackground` as any CSS background value (gradient, color, `url()`), or `thumbContent` for a rendered node.
- **`Footer`** — pass columns as `{heading, links: [{label, href}]}[]`; brand slot on the far left.

## Where the truth lives

- Tokens: `dist/tokens.css` (also imported from `dist/styles.css`)
- Base + component styles: `dist/styles.css`
- Component types: `dist/index.d.ts`
- Every `<Name>.prompt.md` in the synced project has the API contract and usage for that specific component.

## One idiomatic build snippet

A hero section using the signature `HeroInput`:

```tsx
import {
  HaloRoot, Card, HeroInput, Chip, Button,
} from "@halo/design-system";

<HaloRoot>
  <section style={{ padding: "96px 32px" }}>
    <h1
      className="halo-display halo-h1"
      style={{ maxWidth: "15ch", marginBottom: "var(--halo-space-7)" }}
    >
      The design agent for every step from idea to ship
    </h1>
    <div style={{ display: "flex", gap: "var(--halo-space-3)" }}>
      <Button variant="primary">Get started</Button>
      <Button variant="secondary">Download app</Button>
    </div>
  </section>

  <Card style={{ padding: "96px 32px", display: "flex", justifyContent: "center" }}>
    <HeroInput
      placeholder="Ask Halo…"
      controls={<>
        <Chip>+ Attach</Chip>
        <Chip>Canvas</Chip>
        <Chip>Auto</Chip>
      </>}
    />
  </Card>
</HaloRoot>
```

# Halo (@halo/design-system@0.1.0)

This design system is the published @halo/design-system React library, bundled as a single
browser global. All 13 components are the real upstream code.

## Where things are

- `_ds_bundle.js` — the whole-DS bundle at the project root; loads every component to `window.Halo`. First line is a `/* @ds-bundle: … */` metadata header.
- `styles.css` — the single stylesheet entry: it `@import`s the tokens, fonts, and component styles (`_ds_bundle.css`). Link this one file.
- `components/<group>/<Name>/<Name>.prompt.md` (example JSX + variants), `<Name>.d.ts` (types), `<Name>.html` (variant grid).
- `tokens/*.css` — CSS custom properties, names verbatim from upstream.
- `fonts/` — `@font-face` files + `fonts.css` (when the package ships fonts).

For a specific component, `read_file("components/<group>/<Name>/<Name>.prompt.md")`.

## Loading

Add these two lines to your page once (React must be on the page first):

```html
<link rel="stylesheet" href="styles.css">
<script src="_ds_bundle.js"></script>
```

Components are then available at `window.Halo.*`. Mount into a dedicated child node (e.g. `<div id="ds-root">`), not the host page's own React root, so the two trees don't collide:

```jsx
const { BentoCard } = window.Halo;
ReactDOM.createRoot(document.getElementById('ds-root')).render(<BentoCard />);
```

## Tokens

33 CSS custom properties from @halo/design-system. Names are
preserved verbatim from upstream. They are declared inside `_ds_bundle.css` (this DS ships one compiled stylesheet rather than separate token files).

- **color** (6): `--halo-surface-1`, `--halo-surface-2`, `--halo-surface-3`, …
- **spacing** (8): `--halo-space-1`, `--halo-space-2`, `--halo-space-3`, …
- **typography** (3): `--halo-font-display`, `--halo-font-body`, `--halo-font-mono`
- **radius** (5): `--halo-radius-sm`, `--halo-radius-md`, `--halo-radius-lg`, …
- **other** (11): `--halo-bg`, `--halo-fg`, `--halo-hairline`, …

## Components

### general
- `BentoCard` — One tile in the bento grid. Small title + optional description at top,
- `Brand` — Brand lockup  a small conic-gradient mark plus the wordmark. Used in the
- `Button` — The Halo pill button. Three variants  primary (white on dark) is the
- `Card` — The base Halo card  a rounded rectangle with a 1px inset white/10
- `CaseCard` — Case-study card  a tall thumbnail with a bottom-fade overlay and a name +
- `Chip` — A small pill chip used inside the HeroInput toolbar (e.g. Attach,
- `FeatureCard` — Split panel: body on the left (title, description, arrow link), a visual
- `Footer` — Site footer  a 5-column top row (brand + up to 4 link columns) and a
- `HaloRoot` — Root wrapper for any Halo composition. Applies the base font, background,
- `HeroInput` — Halo's signature hero chat input. Layered blue box-shadow creates the
- `LogoCell` — A single cell in the customer-logo grid. Kept monochrome (white at 72
- `Nav` — Halo's sticky top navigation. Uses a translucent black background with
- `NavLink` — A single nav link. Renders label and optional chevron.
