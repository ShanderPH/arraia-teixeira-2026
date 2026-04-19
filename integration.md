# Arraia Teixeira — Integration Guide for Claude Code

This guide walks you through integrating the animated Festa Junina landing page (prototyped in `arraia-landing.html`) into your existing Next.js 16 monorepo (`apps/web`), wired to the FastAPI backend (`apps/api`).

The prototype is a single-file React + Tailwind + GSAP build. The production port uses your existing **HeroUI v3**, **Tailwind v4**, design tokens (`globals.css`), and REST contracts (`/v1/rsvp`, `/v1/dishes`).

---

## Mapping: prototype → production

| Prototype file                     | Production target                                         |
| ---------------------------------- | --------------------------------------------------------- |
| `arraia/svgs.jsx`                  | `apps/web/src/components/arraia/svgs.tsx`                 |
| `arraia/hero-v2.jsx`               | `apps/web/src/components/arraia/Hero.tsx` + subcomponents |
| `arraia/sections.jsx` (Header)     | `apps/web/src/components/Header.tsx` (replace)            |
| `arraia/sections2.jsx` (Dishes)    | `apps/web/src/components/arraia/DishesSection.tsx`        |
| `arraia/sections2.jsx` (Confirmed) | `apps/web/src/components/arraia/ConfirmedSection.tsx`     |
| `arraia/sections2.jsx` (Gallery)   | `apps/web/src/components/arraia/Gallery.tsx`              |
| `arraia/sections2.jsx` (Footer)    | `apps/web/src/components/Footer.tsx` (replace)            |
| `arraia/sections2.jsx` (RSVPModal) | `apps/web/src/components/arraia/RSVPModal.tsx`            |
| `arraia/app.jsx`                   | `apps/web/src/app/page.tsx` (replace)                     |
| `<style>` in `arraia-landing.html` | merge into `apps/web/src/app/globals.css`                 |

---

## Step-by-step

### 1. Prepare the workspace

- [ ] Branch off `main`: `git checkout -b feat/festa-hero`
- [ ] Copy the prototype folder into the repo **read-only** for reference:
      `cp -R arraia-landing.html arraia docs/prototype/`
- [ ] Confirm these deps are installed in `apps/web`:
      `gsap`, `framer-motion` (or keep plain CSS), `react-icons`.
      Add missing: `npm install gsap` from `apps/web/`.

### 2. Extend the design system (`globals.css`)

- [ ] Append the keyframes and utility classes from the prototype's `<style>` block:
      `sway`, `float`, `floatAlt`, `flicker`, `spinSlow`, `pulseGlow`,
      `marquee`, `marqueeRev`, `drawLine`.
- [ ] Add the `.anim-*`, `.lift`, `.press`, `.star-sky`, `.wood`,
      `.bandeirinhas-border`, `.reveal`, `.font-display`, `.font-hand` utilities.
- [ ] Add the Google Fonts import for **Alfa Slab One** and **Caveat** to
      `apps/web/src/app/layout.tsx` alongside the existing Nunito font loader.
- [ ] Respect `prefers-reduced-motion` — the block is already in the prototype.

### 3. Port the SVG library

- [ ] Create `apps/web/src/components/arraia/svgs.tsx`.
- [ ] Convert each SVG component to TypeScript with prop interfaces
      (`BandeirinhasProps`, `FogueiraProps`, `IconProps`, etc).
- [ ] Keep the same named exports used by the prototype: `Bandeirinhas`,
      `Fogueira`, `Milho`, `Chapeu`, `Balao`, `IconCanjica`, `IconPamonha`,
      `IconBolo`, `IconQuentao`, `IconPacoca`, `IconPipoca`, `IconBolinho`,
      `IconArrozDoce`.

### 4. Port the Hero

- [ ] Create `apps/web/src/components/arraia/Hero.tsx` (client component — add `"use client"`).
- [ ] Break it into these siblings, each in its own file for maintainability:
    - `Hero.tsx`
    - `hero/NightSky.tsx`
    - `hero/Fireworks.tsx`
    - `hero/BigFogueira.tsx`
    - `hero/DancingCouple.tsx`
    - `hero/PluckableBandeirinhas.tsx`
    - `hero/Balao3D.tsx`
    - `hero/ConfettiBurst.tsx`
    - `hero/Countdown.tsx`
- [ ] Replace `animate-hero-*` classes in `HeroSection.tsx` with the new
      interactive versions. Keep the existing `animate-hero-pulse-glow`
      token on the CTA since it already lives in `globals.css`.

### 5. Port sections

For each of `DishesSection`, `ConfirmedSection`, `Gallery`, `RSVPModal`,
`Header`, `Footer`:

- [ ] Add `"use client"` where stateful or animated.
- [ ] Swap ad-hoc Tailwind colors (`bg-[#C92A2A]`) for the design-token
      utilities already defined (`bg-accent`, `bg-corn`, `bg-junina-green`,
      `bg-fire`, `bg-earth`, `bg-straw`). Keep hard-coded hex only inside
      illustrative SVGs.
- [ ] Replace raw `<button>` CTAs with HeroUI `Button` using the classes from
      `HeroSection.tsx` (`bg-accent text-accent-foreground ...`).
- [ ] Replace the `Nunito` font reference with the existing CSS variable
      `--font-nunito` already wired up in `layout.tsx`.

### 6. Wire up the backend

The prototype keeps state local. Replace it with your existing API:

#### 6a. Dishes loading

- [ ] In `apps/web/src/lib/dishes.ts`, keep `listDishes()` hitting
      `GET /v1/dishes` and returning `{ id, name, guest_count, created_at }`.
- [ ] Merge API dishes with static illustration metadata. Create a
      `DISH_CATALOG` map keyed by normalized dish name that holds
      `{ Icon, tone, accent, desc }`. For unknown names, fall back to a
      generic icon + `tone`.

#### 6b. RSVP submission

- [ ] In `apps/web/src/lib/rsvp.ts`, expose `submitRsvp({ name, attending, dish_name })`
      POSTing to `/v1/rsvp`. The payload already matches the schema
      (`POST /v1/rsvp` accepts `name`, `attending`, `dish_name?`).
- [ ] The server side-effects: `GuestService` creates the guest and, if
      `dish_name` is provided, idempotently creates the dish via
      `DishService` and links it. No frontend change needed beyond the call.

#### 6c. Confirmed list

- [ ] Fetch `GET /v1/guests` via a new helper `listGuests()` in `lib/rsvp.ts`.
- [ ] In `ConfirmedSection`, group guests by `dish_id`, resolve dish name and
      metadata from `DISH_CATALOG`, and render one card per (dish, guest).
- [ ] Replace the prototype's hard-coded `claimed` arrays.

#### 6d. Realtime / refresh

- [ ] After a successful RSVP, `router.refresh()` the page or call SWR's
      `mutate()` on `/v1/dishes` and `/v1/guests` caches.
- [ ] (Optional) Add a Supabase Realtime subscription on the `guests` table
      to push updates without refresh — matches your README's "Future
      Improvements" list.

### 7. Data fetching pattern

Prefer Server Components for the initial load:

- [ ] `app/page.tsx` (RSC) calls `listDishes()` + `listGuests()` on the server
      and passes them as props to the sections. RSVP modal is a Client
      Component that does the write and calls `router.refresh()`.
- [ ] Read `NEXT_PUBLIC_API_URL` exactly like existing `lib/api.ts`.

### 8. Route structure

Your repo already has `/rsvp` and `/dishes` routes. Two paths:

- **Single-page** (recommended): the new landing lives at `/` and contains
  all sections with anchor scroll. `/rsvp` and `/dishes` redirect to
  `#pratos`/`#confirmados`.
- **Multi-page**: keep `/rsvp` and `/dishes`; the new landing at `/`
  embeds compact teasers that link into those pages.
- [ ] Pick one and update `Header.tsx` nav links accordingly.

### 9. Accessibility pass

- [ ] All interactive balões and pluckable bandeirinhas need `aria-label` and
      keyboard activation (`onKeyDown` → Enter/Space) — in the prototype
      they're `<button>` which handles that by default.
- [ ] Add `role="dialog"` and focus trap to `RSVPModal`. Close on Esc.
- [ ] `NightSky` and `Fireworks` must be `aria-hidden="true"`.
- [ ] Honor `prefers-reduced-motion` by short-circuiting SMIL animations
      (wrap SMIL blocks in a `useReducedMotion` hook or gate with CSS
      `@media (prefers-reduced-motion)`).

### 10. Mobile QA checklist

- [ ] 360px width: bandeirinhas, fogueira, dancing couples all visible
      without horizontal scroll.
- [ ] Countdown tiles don't wrap awkwardly; shrink to 2×2 if needed.
- [ ] Dishes grid: 2 cols → 3 → 4 at `sm`/`md`/`lg`.
- [ ] Gallery marquee still loops seamlessly (image width × 2 = `w-max`).
- [ ] RSVPModal pins to bottom on mobile (sheet) and centers on desktop.
- [ ] Tap targets ≥ 44×44.

### 11. Performance

- [ ] SMIL animations are cheap but heavy in Safari iOS with 60+ elements.
      Cap stars to 80 and embers to 18 (already done).
- [ ] Lazy-load `<Gallery />` with `next/dynamic` + `ssr: false`.
- [ ] Convert the GSAP scroll-reveal to CSS `@starting-style` or
      `IntersectionObserver` to shed the GSAP dep if bundle size matters.

### 12. Testing

- [ ] Unit: render `DishesSection` with an empty list, one list with all
      claimed, and one with mixed.
- [ ] E2E (Playwright): submit RSVP with existing dish, submit with new
      dish, submit with `attending=false`. Assert `GET /v1/guests` reflects
      the write.

### 13. Deploy

- [ ] Verify `CORS_ORIGINS` in `apps/api/.env` includes the production web origin.
- [ ] Build: `npm run build` in `apps/web`.
- [ ] Smoke test the countdown — it targets `new Date(2026, 5, 20, 18, 0)`
      local to the browser. Confirm the event date is correct.

---

## Prompt for Claude Code

Paste the following into Claude Code inside the repo root:

```markdown
# Task: Integrate the Festa Junina landing prototype into `apps/web`

You are working in an existing monorepo (`arraia-teixeira`). The prototype is
in `docs/prototype/` (files: `arraia-landing.html` and `arraia/*.jsx`). The
production app is `apps/web` (Next.js 16, App Router, React 19, TypeScript,
Tailwind v4, HeroUI v3). The backend is `apps/api` (FastAPI + Supabase) and
already exposes `POST /v1/rsvp`, `GET /v1/dishes`, `POST /v1/dishes`,
`GET /v1/guests`.

## Before writing code

1. Read `apps/web/src/app/globals.css` to learn the existing tokens
   (`--accent`, `--corn`, `--royal`, `--junina-green`, `--fire`, `--earth`,
   `--straw`) and existing keyframes (`heroFloat`, `heroFlicker`,
   `heroPulseGlow`, `bandeiraSway`, `spin-slow`).
2. Read `apps/web/src/components/{Header,Footer,HeroSection,WhatsAppButton,MobileBottomBar}.tsx`
   to learn the component style and idioms already in use.
3. Read `apps/web/src/lib/{api,dishes,rsvp}.ts` to learn the existing fetch helpers.
4. Read `AGENTS.md` and follow its Next.js rules — this is Next.js 16 with
   breaking changes; check `node_modules/next/dist/docs/` before using any
   API you're unsure about.

## Deliverables

Port the prototype into production-quality TypeScript. Target files:

- `apps/web/src/components/arraia/svgs.tsx`
- `apps/web/src/components/arraia/hero/{NightSky,Fireworks,BigFogueira,DancingCouple,PluckableBandeirinhas,Balao3D,ConfettiBurst,Countdown}.tsx`
- `apps/web/src/components/arraia/Hero.tsx`
- `apps/web/src/components/arraia/DishesSection.tsx`
- `apps/web/src/components/arraia/ConfirmedSection.tsx`
- `apps/web/src/components/arraia/Gallery.tsx`
- `apps/web/src/components/arraia/RSVPModal.tsx`
- Replace `apps/web/src/components/Header.tsx` and `Footer.tsx`
- Replace `apps/web/src/app/page.tsx` so `/` is the new landing

## Constraints

- Use **only** the color tokens already in `globals.css`. Do not inline hex
  codes in Tailwind classes — use `bg-accent`, `text-corn`, etc. Exception:
  inside illustrative SVGs you may keep literal hex for fidelity.
- All animated keyframes (`sway`, `float`, `flicker`, `marquee`, `pulseGlow`,
  `drawLine`) must live in `globals.css` under `@theme inline` following the
  same pattern as the existing `--animate-hero-*` tokens. Expose them as
  `.anim-sway`, `.anim-float`, `.anim-flicker`, `.anim-marquee`, etc.
- Add Google Fonts `Alfa Slab One` and `Caveat` to `layout.tsx` via
  `next/font/google` beside the existing `Nunito`. Expose as
  `--font-display` and `--font-hand`.
- Respect `prefers-reduced-motion`. Short-circuit SMIL and CSS animations
  for users who request reduced motion.
- Every stateful/animated component needs `"use client"`.
- Use HeroUI `Button` for all CTAs, matching the existing
  `HeroSection.tsx` classes.

## Data wiring

- `page.tsx` must be a Server Component that calls `listDishes()` and
  `listGuests()` on the server and passes props down.
- Build a `DISH_CATALOG` map keyed by normalized dish name
  (`name.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu,"")`)
  holding `{ Icon, tone, accent, desc }` for the 8 known dishes
  (canjica, pamonha, bolo de fubá, quentão, paçoca, pipoca doce,
  bolinho de chuva, arroz doce). Unknown dishes fall back to
  `IconBolinho` with neutral tone.
- `RSVPModal` is a Client Component that posts to `/v1/rsvp` via the
  existing `submitRsvp()` helper, then calls `router.refresh()`.
- `ConfirmedSection` groups guests by `dish_id` and renders one card per
  (dish, guest) pair.

## Out of scope

- Do not touch `apps/api` except to verify schemas still match.
- Do not add new npm deps besides `gsap` (if not present). Prefer native CSS
  animations over Framer Motion for this task.

## Verification

After writing code, run:

1. `npm run lint` in `apps/web` — no errors.
2. `npm run build` in `apps/web` — no type errors.
3. Manually verify in dev (`npm run dev`) at widths 360, 768, 1280:
    - Hero shows stars, fireworks, central fogueira, 2 dancing couples,
      pluckable bandeirinhas, 3 balões, moon, mountains, countdown, CTAs.
    - Clicking a balão bursts confetti.
    - Clicking a flag makes it drop and respawn.
    - Clicking a dish opens the RSVP modal preselected.
    - Submitting RSVP persists to Supabase and the confirmed list updates
      on next refresh.

Report back with a summary of files changed, any deviations from the plan,
and remaining follow-ups.
```

---

## Follow-ups (not in the Claude Code prompt, for you)

- Point `NEXT_PUBLIC_API_URL` at your deployed FastAPI.
- Replace gallery placeholder patterns with real photos when ready —
  drop them in `apps/web/public/gallery/` and swap the `Photo` component
  to render `<Image>`.
- Consider Supabase Realtime for a live-updating confirmed list.
- Pick a final event date and update the `Countdown` target.
