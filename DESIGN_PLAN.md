# Venkatesh & Brindha — Wedding Web Invite
### Design & Product Plan

> **Status: built.** The site is implemented in `/site` (open `/site/index.html` via a local server, or deploy the folder as-is). Sections below are kept as the design record; where the build diverged from the original plan, that's called out inline.

---

## 0. What shipped vs. the original plan

A few decisions were made or revised during the build — noted here so the rest of this doc (written before build) can be read as design intent, not a literal spec of the final code.

- **The ribbon-tied invitation card replaces the old "Date" pull-quote section (§4.2)** entirely. It's a real interactive component: tap the ribbon/bow, it unties (slides off both sides, rotates, fades), a frosted veil clears, and the full card — names, both event dates as one combined hero numeral, venue — is revealed. A live countdown (to the Reception) fades in beneath it once revealed.
- **The card section sits on a plain neutral backdrop**, not a full-bleed photo (per your call) — `DS_00692` (the silhouette shot) moved into the gallery instead.
- **Gallery has 12 photos, not 10** — both `DS_00692` and `DS_00702` (originally slated for the old Date section) were reassigned into the gallery grid.
- **Family line stayed generic** ("Together with our families") and **A Few Words copy was drafted by me** — both per your sign-off. Edit the text directly in `index.html` if you want changes.
- **Images shipped as optimized JPEG, not WebP** — this Mac's `sips` can't write WebP, only read it. JPEG at 78% quality after resizing still took the photo set from 104MB → ~3MB, so the performance goal in §11 is met; switch to WebP later with a proper image tool if you want the extra savings.
- **Animations use zero external dependencies** — no GSAP/ScrollTrigger/Flip. The build uses plain CSS (Ken Burns hero zoom, name stagger), `IntersectionObserver` (scroll reveals, the itinerary line draw), and the native Web Animations API (the gallery lightbox's "grow from grid tile to full-screen" transition). Same visual beats as §6 intended, lighter and with nothing to load from a CDN. The more ambitious pinned-scroll/parallax scrubbing from the original §6 draft was not built — can be layered in later with GSAP if you want that extra layer of motion.
- **Photo manifest**: `site/data/photos.js` (a plain `window.PHOTOS` object, not JSON — see below) drives the gallery grid (file, alt text, layout span, focal point) — add next week's photos by dropping optimized files into `site/images/optimized/` and adding entries there, no HTML editing needed.
- **`data/photos.json` was replaced with `data/photos.js`** after launch — `fetch()` of a local JSON file is blocked by browsers under `file://`, so the manifest became a plain `<script>` that sets `window.PHOTOS` instead. Same content, just loaded without `fetch`.
- **A landing/gate page was added in front of the main page** (post-launch addition, §4.0 below). `site/index.html` is now a small, separate "unlock" screen; the full page that used to be `index.html` was renamed to `site/invite.html`. The shareable link guests get is still the bare `index.html` (or the domain root) — it just shows the gate first.

---

## 1. Summary

A single-page, mobile-first wedding invitation website, shared primarily via WhatsApp link. Visual direction is **Modern Editorial Luxe** — a calm, high-end "wedding magazine spread" feel, deliberately different from the gold/skeuomorphic reference site we benchmarked (no hourglass gate, no scratch-card, no busy widget stack). Built as a lightweight static site (HTML/CSS/JS, no backend, no CMS) so it loads fast and costs nothing to host.

**Non-goals:** this is not a photography-studio portfolio page, not a guest-RSVP database, not a multi-event microsite with social-share gimmicks. It's one focused, beautiful page.

---

## 2. Confirmed content

| Field | Value |
|---|---|
| Groom | Venkatesh R |
| Bride | Brindha S |
| Event 1 | **Reception** — 22.08.2026, 6:30 PM onwards |
| Event 2 | **Muhurtham** — 23.08.2026, 7:30 AM – 9:00 AM |
| Venue (both events) | Shri Kalpana Mahal, Pethuchettypet, Lawspet, Puducherry, 605008 |
| Map | [Google Maps link provided](https://www.google.com/maps?ll=11.953766,79.820266&z=15&t=m&hl=en-GB&gl=US&mapclient=embed&cid=13458931660469966044) |
| Phone/WhatsApp on page | **Not included** — guests already have your number |
| Photos | 19 engagement photos supplied in `/assets` (studio shoot, floral double-ring backdrop, teal-and-gold silk saree, ivory zari sherwani, warm indoor lighting). **More photos coming next week** — site is built so adding them later is a config change, not a rebuild (see §5 and §8) |

**Open items I need from you before/while building** (flagged again in §10):
- Family names / "son of... daughter of..." line — include or skip?
- A short couple quote, hashtag, or story blurb for the "About" section (or should I draft something generic for you to edit?)
- Dress code or any guest instructions?
- Since Reception (22nd) happens *before* Muhurtham (23rd) chronologically — confirm that's correct and not swapped.

---

## 3. Visual direction — Modern Editorial Luxe

| Element | Direction |
|---|---|
| Palette | Warm ivory `#F7F3EC`, charcoal ink `#262220`, muted sage `#8A9A7E` accent, a single deep teal pulled from the saree `#1F5C5C` used sparingly (not gold — deliberately avoids reference site's palette) |
| Typography | A tall thin serif (e.g. "Fraunces" or "Cormorant") for display names/headers; a clean grotesk (e.g. "Inter" or "Neue Montreal") for body/meta text. No script/cursive font — that's the reference site's signature, we're avoiding it |
| Imagery treatment | Full-bleed, generously cropped, desaturated very slightly for cohesion across 19 photos shot in different rooms; consistent duotone-free color grade so the gallery feels like one shoot, not a phone dump |
| Motion language | Quiet: opacity + 8–12px upward drift on scroll-into-view, no bounce/elastic easing, no confetti/emoji animations, no scratch/reveal gimmicks |
| Iconography | None, or hairline-stroke custom icons only (calendar, pin, arrow) — no emoji in the UI |

This is the core differentiator from the reference site: that one leans ornate/festive/skeuomorphic (gold foil, hourglass, scratch card, emoji blessing wall). This one leans restrained/editorial/photo-led — same "top-class" bar, opposite mood.

---

## 4. Page structure & wireframes (one page, 6 sections)

Low-fidelity wireframes below — boxes are layout regions, not final styling. Desktop and mobile shown for each section so the structure is unambiguous before any code is written.

### 4.0 — Landing Gate *(post-launch addition, separate file: `site/index.html`)*

```
DESKTOP / MOBILE (full-bleed, same layout both sizes)
┌──────────────────────────────────────┐
│   YOU ARE INVITED TO THE WEDDING OF   │   ← dark top scrim band, always legible
│         Venkatesh & Brindha           │      regardless of photo content behind it
│                                        │
│        (silhouette photo,             │
│      darkened ~38% + soft blur        │   ← uniform filter on the photo itself,
│       so the whole frame reads        │      not a spot-fix — guarantees contrast
│        as one moody backdrop)         │      everywhere, on every device
│                                        │
│                🔒                     │   ← hand-coded inline SVG, currentColor
│        UNLOCK THE E-INVITE            │
│         22–23 AUGUST 2026             │
│                                        │
└──────────────────────────────────────┘
   ↑ the entire screen is the tap target — no button chrome.
   Tap/click anywhere → an ivory circle expands ("iris open") from the
   exact point tapped, covering the screen, then navigates to invite.html.
```

**Why this exists:** going straight from a shared link into the full page felt abrupt — guests should arrive somewhere deliberate first. The mechanic had to be distinct from the ribbon-untie already used inside the invite card (§4.2) and from the reference site's hourglass/scratch-card trope.

**Mechanic — "tap to unlock," not a labeled button.** Earlier drafts used a bordered circular button reading "Open" — rejected as generic SaaS-button language sitting on top of a deeply personal photo. The fix: remove all UI chrome. The whole photo is clickable; the only affordances are a quiet pulsing line-art lock icon and the words "Unlock the E-Invite." Tapping anywhere triggers an iris/aperture-style reveal that originates from the guest's own tap point (not a fixed spot), then hands off to `invite.html`.

**Why a separate file, not an overlay on the existing page:** keeps the gate genuinely lightweight (one photo, no fonts/JS beyond what the gate needs) so guests who just peek at the link load a fraction of the data; the gallery/itinerary photos on the main page only load once the guest actually unlocks. `index.html` (the gate) is renamed; the previous `index.html` is now `invite.html`. Shareable link stays the bare root URL.

**Image:** `DS_00692 copy.jpg`, re-exported separately as `images/optimized/landing.jpg` at 1920×1280 (the gallery's copy of this shot, `gallery-04.jpg`, is downsized for thumbnail use and too low-res for a full-bleed background).

**Contrast, the honest version:** the first pass tried to dodge the photo's bright/dark regions by positioning text precisely over the naturally dark chest/shoulder area. That's fragile — it depends on exact crop and viewport, and broke down in practice. The shipped version instead applies `filter: brightness(0.62) blur(1.5px)` to the photo itself plus a flat dark scrim, so text is guaranteed legible everywhere rather than at one lucky spot.

**Accessibility / reduced motion:** the gate `<div>` has `role="button" tabindex="0"`, Enter/Space triggers it from keyboard focus, and `prefers-reduced-motion` skips the iris animation and navigates immediately.

**Optional upgrade — richer lock icon:** the shipped lock is a minimal inline SVG (thin stroke, `currentColor`, zero extra asset weight). If you want a more illustrated version matching the floral/flourish assets' richness, generate one and drop it in as `images/graphics/lock.png`, swapping the `<svg class="gate__lock">` in `index.html` for an `<img>`. Prompt to use:

> Create a minimal, elegant line-art illustration of a small padlock, in the style of fine wedding stationery iconography — thin, delicate single-line stroke, no fill, no shading, monochrome. Color: warm antique gold/bronze line only, on a transparent background. The lock should be simple and refined — a rounded rectangular body with a thin curved shackle, optionally one tiny decorative flourish or keyhole detail, nothing ornate or busy. High resolution, transparent PNG, centered composition, square aspect ratio (e.g. 500×500).

### 4.1 — Entry

```
DESKTOP (1280+)                              MOBILE (375–414)
┌──────────────────────────────────────┐     ┌───────────────────┐
│                                        │     │                    │
│         (full-bleed photo,            │     │   (full-bleed      │
│          couple turned toward         │     │    photo, same     │
│          camera over shoulder)        │     │    crop, vertical) │
│                                        │     │                    │
│                                        │     │                    │
│                                        │     │                    │
│                                        │     │                    │
│                                        │     │                    │
│         VENKATESH                     │     │    VENKATESH       │
│            &                          │     │       &            │
│         BRINDHA                       │     │    BRINDHA         │
│                                        │     │                    │
│         22 — 23 AUG 2026               │     │  22—23 AUG 2026    │
│                                        │     │                    │
│              ↓ scroll                  │     │     ↓ scroll       │
└──────────────────────────────────────┘     └───────────────────┘
```
Names sit low-center over the photo (not dead-center) with heavy bottom padding so the crop breathes. Photo: **DS_00757** (bride glancing back over her shoulder, braid + saree back detail, groom looking at camera) — the most editorial/"cover" shot of the set.

### 4.2 — The Date

```
DESKTOP                                       MOBILE
┌──────────────────────────────────────┐     ┌───────────────────┐
│  (full-bleed silhouette photo,        │     │  (same silhouette  │
│   couple in profile, backlit circle)  │     │   photo, cropped   │
│                                        │     │   tighter)         │
│                                        │     │                    │
│            22 · 23                     │     │      22 · 23       │
│         ─────────────                  │     │    ───────────     │
│           AUGUST 2026                  │     │    AUGUST 2026     │
│                                        │     │                    │
│   Reception, then the Muhurtham —      │     │  Reception, then   │
│   two days, one beginning.             │     │  the Muhurtham.    │
│                                        │     │                    │
│      138 DAYS · 04 HRS · 12 MIN        │     │  138d · 04h · 12m  │
│                                        │     │                    │
│         ┌──────────────┐              │     │   ┌────────────┐   │
│         │  ring detail │ (small inset │     │   │ ring detail│    │
│         │  photo, btm- │  card, desk- │     │   │ (full-width│    │
│         │  right corner)│  top only)  │     │   │  below)    │    │
│         └──────────────┘              │     │   └────────────┘   │
└──────────────────────────────────────┘     └───────────────────┘
```
Background: **DS_00692** (the circular backlit silhouette — already monochrome/graphic, so bold serif numerals sit on it cleanly without competing). Inset detail card: **DS_00702** (macro of the rings on henna palm) — floats as a small accent on desktop, stacks full-width below the text on mobile.

### 4.2.5 — The Bride & Groom *(post-launch addition)*

Added right after the ribbon-reveal card, once a second batch of photos (`assets/pre-wedding-shoot/`) came in. A simple two-up section: solo portrait + first name + role label ("The Bride" / "The Groom") for each, in a rounded 3:4 frame, Fraunces italic name beneath. Stacks to one column on mobile.

**Source photos:** `assets/pre-wedding-shoot/solo/Copy of BAGHAVAN (284).JPG` (bride) and `assets/pre-wedding-shoot/solo/DS_00782 copy.jpg` (groom) → exported as `images/optimized/bride-solo.jpg` and `images/optimized/groom-solo.jpg`.

The bride's source photo had no EXIF orientation tag and was shot at roughly a 68° dutch angle (not a clean 90° rotation) — sips' angle-by-trial approach kept either clipping her face or leaving black canvas corners after rotation, so the fix was a proper rotation-geometry calculation (Pillow, `rotate(expand=True)` + computing the rotated content polygon precisely) to find a crop rectangle guaranteed to avoid the black corners while keeping her face well-framed. The groom's photo needed only a light crop to tighten the framing and trim chair clutter at the bottom.

### 4.2.7 — Our Pre-Wedding Story *(post-launch addition)*

Added after Bride & Groom, once a full pre-wedding shoot came in across three locations: `assets/pre-wedding-shoot/temple/` (9 photos), `indoor/` (11, a heritage Chettinad mansion), `outdoor/` (10, forest + beach). Rather than dumping all 30 into the existing "favourites" grid, this became its own section, structured as three narrative chapters — **Where It Began** (temple), **At Home With Each Other** (heritage home), **Into the Open** (beach/forest) — each with a short caption setting the mood, followed by a horizontally swipeable filmstrip of 5 curated photos (scroll-snap, native touch scroll, peek-next-photo hint). Curated 15 of the 30 photos total, dropping near-duplicate frames per location.

**Why a filmstrip, not a grid:** explicitly mobile-first per your ask — large, immersive portrait photos one can swipe through read as a photo-essay rather than a cramped thumbnail wall, and it stays visually distinct from the existing masonry gallery further down the page. Photos stagger into view (100ms apart) via `IntersectionObserver` as each filmstrip scrolls into the viewport.

**EXIF handling:** unlike the bride's solo photo, this whole batch *does* carry EXIF orientation tags (mostly value `8`, a few `1`) — so correcting them was a single `ImageOps.exif_transpose()` pass in Pillow rather than the manual rotation-geometry work the solo photo needed. Each exported photo also carries a per-image `--focal` CSS custom property (same technique as the gallery) so `object-fit:cover` crops toward faces rather than the geometric center.

### 4.3 — The Itinerary

```
DESKTOP                                                  MOBILE
┌────────────────────────────────────────────────┐      ┌───────────────────┐
│                  OUR ITINERARY                  │      │   OUR ITINERARY    │
│                                                  │      │                    │
│  ┌────────────────┐        ┌────────────────┐   │      │ ┌───────────────┐  │
│  │ (photo:         │   ●    │ (photo:         │  │      │ │ RECEPTION      │  │
│  │  DS_00745,      │   │    │  DS_00779,      │  │      │ │ 22 Aug · 6:30PM│  │
│  │  embrace)       │   │    │  affectionate)  │  │      │ │ (DS_00745)     │  │
│  │                 │   │    │                 │  │      │ └───────────────┘  │
│  │ RECEPTION       │   │    │ MUHURTHAM       │  │      │        │           │
│  │ 22 Aug 2026     │   │    │ 23 Aug 2026     │  │      │        ●  (line     │
│  │ 6:30 PM onwards │   │    │ 7:30–9:00 AM    │  │      │        │   animates │
│  └────────────────┘   │    └────────────────┘   │      │ ┌───────────────┐  │
│                        │                          │      │ │ MUHURTHAM      │  │
│         a vertical line connects both              │      │ │ 23 Aug · 7:30AM│  │
│         event nodes down the center                │      │ │ (DS_00779)     │  │
│                                                  │      │ └───────────────┘  │
│         Shri Kalpana Mahal, Pethuchettypet,      │      │                    │
│         Lawspet, Puducherry, 605008              │      │  Shri Kalpana Mahal│
│                                                  │      │  Puducherry 605008 │
│         [ map embed, single, shared by both ]    │      │  [ map embed ]     │
│         [ View on Google Maps →  ]               │      │  [ View on Maps →] │
└────────────────────────────────────────────────┘      └───────────────────┘
```
One venue, two event cards side-by-side on desktop (stacked on mobile) joined by a connecting line/timeline — and **one** map below, not duplicated per event.

### 4.4 — Photo Gallery

```
DESKTOP (asymmetric masonry, varying spans)               MOBILE (2-col masonry)
┌───────────┬───────┬───────────┬───────┐                ┌─────────┬─────────┐
│           │       │           │ tall  │                │  photo  │  photo  │
│  wide     │ tall  │  square   │ photo │                │ (full)  │ (full)  │
│  photo    │ photo ├───────────┤       │                ├─────────┴─────────┤
│           │       │  square   │       │                │     wide photo     │
├───────────┴───────┼───────────┴───────┤                ├─────────┬─────────┤
│   tall photo      │     wide photo    │                │  photo  │  photo  │
│                    ├───────┬──────────┤                ├─────────┴─────────┤
│                    │square │  tall    │                │     tall photo     │
├────────────────────┴───────┤  photo   │                ├─────────┬─────────┤
│        wide photo          │          │                │  photo  │  photo  │
└────────────────────────────┴──────────┘                └─────────┴─────────┘
        tap any tile → full-screen lightbox                 tap → lightbox
```
10 curated photos (see §5 photo map). Grid uses CSS `grid-template-areas` or column-span classes — genuinely asymmetric, not a uniform thumbnail wall. No "View All" link out.

### 4.5 — A Few Words *(optional — pending your input)*

```
DESKTOP                                       MOBILE
┌──────────────────────────────────────┐     ┌───────────────────┐
│   ┌────────────┐                      │     │     (photo,       │
│   │  photo      │   "Two families,    │     │   DS_00775)        │
│   │  DS_00775   │    one beginning.   │     │                    │
│   │  (formal    │    We can't wait    │     │  "Two families,    │
│   │   portrait) │    to celebrate     │     │   one beginning."  │
│   │             │    with you."       │     │                    │
│   └────────────┘   — V & B            │     │   — V & B          │
└──────────────────────────────────────┘     └───────────────────┘
```
Two-column on desktop (photo left, short note right), stacked on mobile. Skippable entirely if you'd rather end at the gallery.

### 4.6 — Close

```
DESKTOP & MOBILE (same, centered, lots of negative space)
┌──────────────────────────────────────┐
│                                        │
│        (background: DS_00704,         │
│         macro of henna-painted        │
│         hands reading "V · B" —       │
│         their own initials, already   │
│         in the photo)                 │
│                                        │
│              V  ·  B                  │
│         22 — 23 AUGUST 2026            │
│                                        │
└──────────────────────────────────────┘
```
**DS_00704** is the macro shot where the henna artist literally wrote "V" and "B" on the bride's palms — using it here means the monogram isn't a designed graphic, it's *their actual photo*. No social links, no footer nav. Page just ends.

---

## 5. Photo placement map (all 19 photos accounted for)

| # | File | Used in | Why |
|---|---|---|---|
| 1 | `DS_00757 copy.jpg` | **Entry hero** | Best "cover" shot — editorial back-turn pose, shows saree + braid detail, strong composition |
| 2 | `DS_00692 copy.jpg` | **The Date** (background) | Graphic silhouette, already monochrome — lets bold typography sit on top cleanly |
| 3 | `DS_00702 copy.jpg` | **The Date** (inset detail) | Macro of rings, ties the "date" moment to the engagement ring visually |
| 4 | `DS_00745 copy.jpg` | **Itinerary** — Reception card | Intimate embrace, warm tone for the evening event |
| 5 | `DS_00779 copy.jpg` | **Itinerary** — Muhurtham card | Tender, quieter moment for the morning ceremony |
| 6 | `DS_00775 copy.jpg` | **A Few Words** | Formal frontal portrait, suits a direct "note to guests" tone |
| 7 | `DS_00704 copy.jpg` | **Close** | Henna literally spells "V · B" — the real monogram, not a designed one |
| 8 | `DS_00629 copy.jpg` | Gallery | Candid clasped-hands moment, floral arch |
| 9 | `DS_00660 copy.jpg` | Gallery | Confident formal portrait, ballroom chandelier |
| 10 | `DS_00675 copy.jpg` | Gallery | Playful candid (finger-point), shows personality/fun side |
| 11 | `DS_00735 copy.jpg` | Gallery | Wide formal portrait, gold ornate bench |
| 12 | `DS_00739 copy.jpg` | Gallery | Eyes-closed embrace, soft/emotional |
| 13 | `DS_00769 copy.jpg` | Gallery | Side-by-side formal-candid mix |
| 14 | `DS_00782 copy.jpg` | Gallery | Groom solo portrait |
| 15 | `DS_00796-Recovered.jpg` | Gallery | Bride solo, contemplative, banquet-chair background |
| 16 | `DS_00800 copy.jpg` | Gallery | Artistic macro, both henna palms raised, serene expression |
| 17 | `LC_00655 copy.jpg` | Gallery | Wide couple portrait, floral double-ring arch |
| 18 | `DS_00757-Recovered.jpg` | **Held in reserve** | Near-duplicate of #1 (same pose/series) — swap candidate once next week's photos arrive |
| 19 | `DS_00763 copy.jpg` | **Held in reserve** | Near-duplicate of #1/#18 (same pose series) — swap candidate |

**Adding next week's photos:** the gallery (and any future "held in reserve" swaps) will be driven by a single JSON manifest (`/data/photos.json`) listing filename, section/role, and alt text — so integrating new photos is *editing one JSON file*, not touching HTML/CSS. Details in §8.

---

## 6. Animation system — top-notch, but restrained

The brief is "premium," not "busy." Every animation below earns its place because it reinforces editorial pacing (one idea reveals at a time) rather than decoration. We'll use **GSAP + ScrollTrigger** (via CDN `<script>` tags, ~45KB gzipped combined, no build step — still a static site) because hand-rolled `IntersectionObserver` fades can't do the scrubbed/pinned effects below.

| Section | Animation | Detail |
|---|---|---|
| **Entry** | Slow Ken Burns + split-text reveal | Hero photo does an 8–10s slow scale `1.0 → 1.06` (`ease: none`, runs once, never loops jarringly). Names animate in word-by-word with a 0.4s stagger, `y: 20px → 0` + opacity, `power3.out`. Scroll cue fades in last, then gently bobs (`y: 0→6→0`, infinite, 2s, very subtle) |
| **Entry → Date transition** | Parallax depth | As you scroll past the hero, the photo moves at `0.5x` scroll speed (background drifts slower than foreground text) via `ScrollTrigger scrub: true` — standard premium-editorial parallax, not gimmicky |
| **The Date** | Pinned scroll-scrub | Section pins (`ScrollTrigger pin: true`) while the date numerals scale from `0.8 → 1` and the silhouette photo's circular vignette grows slightly — tied directly to scroll position (`scrub: 0.5`), so it feels controlled by the user's scroll, not autoplaying. Countdown digits use an odometer-style roll (each digit is a small vertical strip that slides to its value) on first reveal, then ticks normally |
| **Itinerary** | Drawing line + alternating slide-in | The vertical connector line between event cards animates with `stroke-dashoffset` (SVG) "drawing" downward as the section scrolls into view. The Reception card slides in from the left (`x: -40 → 0`), Muhurtham from the right, both with a 0.15s stagger and a slight `rotate: -1deg → 0` settle for a tactile, non-linear feel |
| **Gallery** | Staggered masonry reveal + hover zoom + FLIP lightbox | Tiles fade/scale in (`scale: 0.94→1`, opacity) staggered by row as the grid scrolls into view. On hover (desktop only), image scales to `1.04` with a slow `0.6s` cubic-bezier — never instant, never bouncy. Opening the lightbox animates the tapped tile growing from its exact grid position to full-screen (a FLIP-technique transition, ~10 lines with GSAP's `Flip` plugin) rather than a plain fade — this is the single highest-impact "feels expensive" detail on the page. Swipe/drag on mobile has momentum + rubber-band edges |
| **A Few Words** | Simple fade/drift | Standard `opacity + 12px drift`, no scrub — this section is intentionally calm after the gallery's energy |
| **Close** | Slow reveal + letter-draw | Background henna photo fades in under a soft vignette; "V · B" monogram draws on with a brief `letter-spacing: 0.4em → 0.2em` contraction as it fades in — a quiet, confident final beat |
| **Global** | Custom cursor (desktop ≥1024px only) | A small soft-edged circle follows the pointer, scales up subtly over photos/links (`scale: 1 → 2.2`) to hint interactivity, disabled entirely on touch devices — never blocks tap targets |
| **Global** | Smooth scroll | Lenis or GSAP `ScrollSmoother` for inertia-based smooth scrolling site-wide, so every scroll-linked effect above feels fluid rather than tied to the browser's default scroll jitter |

**Guardrails (so "top-notch" doesn't become "busy"):**
- Every animation plays **once** per element (no re-triggering loop spam on re-scroll) except the two intentionally subtle infinite ones (scroll-cue bob, cursor)
- `prefers-reduced-motion: reduce` disables parallax/pin/Ken-Burns and falls back to simple fades — accessibility-respecting by default
- Nothing blocks first paint — animations attach after the hero image is visible, never before
- Mobile gets the same *intent* (stagger, fade, slide) but skips pin/scrub effects that feel janky on touch scroll — see §7

---

## 7. Responsive plan

Mobile-first (most guests open this from a WhatsApp share link on a phone):

- Single column throughout on mobile; the masonry gallery and the side-by-side itinerary block expand to multi-column only above ~768px
- Touch targets ≥44px; lightbox swipe-friendly
- Pin/scrub/parallax animations (§6) are **desktop/tablet only** (≥768px) — on mobile they downgrade to simple staggered fade/slide so scrolling stays light and native-feeling
- Test at 375px (small phone), 414px (large phone), 768px (tablet), 1280px+ (desktop)

---

## 8. Tech plan (static HTML/CSS/JS)

```
/invite
  index.html
  /css
    style.css
  /js
    main.js            → section logic, lightbox controller, countdown
    animations.js       → all GSAP/ScrollTrigger/Flip timelines, in one place
  /data
    photos.json          → manifest: {file, section, alt, order} for every photo —
                            this is the file you edit when next week's photos arrive
  /images
    /optimized           → WebP, multiple widths (480/768/1200/1920), generated from /assets
  /assets                → original source photos (not deployed; build input only)
```

- **No framework, no build step required** — plain HTML/CSS/JS. (A tiny optional step: a one-time image-resize script using `sharp` or `squoosh-cli` to generate the `/optimized` set — see §9.)
- **Animation libraries**: GSAP core + ScrollTrigger + Flip plugins, loaded via CDN `<script>` tags (no npm/bundler needed) — see §6 for what each is used for
- **Photo manifest, not hard-coded HTML**: the gallery and the "held in reserve" swap photos are rendered from `/data/photos.json` by a small loop in `main.js`. **This is how next week's new photos get integrated** — drop the new files into `/images/optimized`, add their entries to `photos.json`, done. No HTML editing, no risk of breaking layout
- **Map**: a single Google Maps iframe embed (using the link you provided) or a static styled map image linking out to Maps — avoids loading heavy map JS twice
- **Hosting**: deploy `/invite` to Netlify, Vercel, or GitHub Pages — free, custom domain optional, share the resulting URL same way as the reference site's link
- **Fonts**: self-hosted or Google Fonts `<link>` for the serif + grotesk pairing, with `font-display: swap`

---

## 9. Image pipeline (important — current assets are too heavy)

Current `/assets` folder: **104MB across 19 JPEGs**, several at **13–14MB each** (full DSLR exports). Shipping these as-is would make the page take 10+ seconds to load on mobile data — unacceptable for a "top-class" feel.

Plan:
1. Cull to ~12–14 best photos (hero, date-spread, gallery)
2. Resize to max practical display width (1920px for hero/full-bleed, 1200px for gallery tiles) and re-export as **WebP** at ~75–80% quality, with a JPEG fallback
3. Generate 2–3 responsive widths per image for `srcset`
4. Target: every image **under ~200KB**, total page weight **under ~3MB** even with the full gallery
5. Lazy-load every image below the first viewport (`loading="lazy"`)

This single step will likely matter more for "feels premium" than any animation — the reference site's biggest weakness was unrelated load-blocking JS errors; ours should be a fast, clean load.

---

## 10. Open questions before development starts

1. Family names line — include or skip?
2. Short couple note/story for §4.5 — you write it, or I draft a placeholder for you to edit?
3. Dress code / guest instructions to include?
4. Confirm Reception (22nd) before Muhurtham (23rd) is correct order
5. Photo placements in §5 — approve as-is, or swap any?
6. Domain — custom domain, or fine with a Netlify/Vercel default `*.vercel.app` style URL?
7. Rough timing for "next week's photos" — should the build wait for them, or ship now with the current 19 and swap in later via the `photos.json` manifest (§8)?

---

## 11. What "top-class quality" means here, concretely

- Loads in **under 2 seconds** on mobile data (vs. heavy WordPress stack + 100MB of source images)
- **Zero console errors** (the reference site threw `oceanwpLocalize is not defined` and similar WordPress/cache errors — ours has no CMS to misfire)
- Animations that feel **expensive because they're restrained, deliberate, and scroll-controlled** (§6) — not because there are many of them
- Photography presented like an **editorial spread**, not a thumbnail wall
- Works identically well on a 5-year-old Android phone and a new iPhone

---

*Next step: review this doc, answer the open questions in §10, and I'll move to building the actual page.*
