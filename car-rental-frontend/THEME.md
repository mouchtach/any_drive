# 🎨 AnyDrive — Theme & Design System

> **How to use this file:** it is both documentation and a ready-to-paste **AI prompt**.
> Copy the section **[AI Prompt](#10-ai-prompt-copy--paste)** into any AI tool (Claude, ChatGPT, Cursor...) together with the component or page you want styled, and it will generate UI that matches the AnyDrive brand.

---

## 1. Brand Identity

| Item         | Value                                              |
| ------------ | -------------------------------------------------- |
| **Name**     | AnyDrive                                           |
| **Tagline**  | *Drive Anywhere. Anytime.*                         |
| **Industry** | Car rental platform (Guest / Customer / Agency / Admin) |
| **Logo**     | Letter **A** in navy blue with an **orange road** curving through it. Wordmark: "Any" in navy + "Drive" in orange. |
| **Personality** | Trustworthy, modern, energetic, free, professional |
| **Keywords** | Trust • Reliability • Professionalism • Energy • Movement • Freedom |

**Brand feeling:** a clean, premium, confident product. Navy brings trust, orange brings movement and action. Everything feels smooth, rounded and light.

---

## 2. Color Palette

### 2.1 Core brand colors (from the brand board)

| Role               | Name             | HEX       | Meaning                       |
| ------------------ | ---------------- | --------- | ----------------------------- |
| **Primary**        | Primary Blue     | `#0B3D91` | Trust, reliability, professionalism |
| **Accent**         | Accent Orange    | `#FF8C00` | Energy, movement, freedom     |

### 2.2 Extended scale (derived, use for hover / backgrounds / borders)

**Primary Blue**

| Token          | HEX       | Use                                  |
| -------------- | --------- | ------------------------------------ |
| `primary-50`   | `#EEF3FC` | Soft backgrounds, icon bubbles       |
| `primary-100`  | `#DCE6F8` | Hover backgrounds, borders           |
| `primary-200`  | `#B9CDF0` | Disabled / subtle borders            |
| `primary-300`  | `#8AAAE3` | Secondary icons                      |
| `primary-400`  | `#4F7BCB` | Links on dark                        |
| `primary-500`  | `#1F55B0` | Hover on primary                     |
| **`primary-600`** | **`#0B3D91`** | **Brand primary (default)**     |
| `primary-700`  | `#093178` | Pressed state                        |
| `primary-800`  | `#07265E` | Dark sections, gradients             |
| `primary-900`  | `#051A42` | Deepest navy, hero overlays, headings|

**Accent Orange**

| Token          | HEX       | Use                                  |
| -------------- | --------- | ------------------------------------ |
| `accent-50`    | `#FFF4E5` | Soft highlight backgrounds           |
| `accent-100`   | `#FFE3BF` | Badges background                    |
| `accent-300`   | `#FFB866` | Focus ring, decorations              |
| `accent-400`   | `#FFA126` | Hover on accent                      |
| **`accent-500`** | **`#FF8C00`** | **Brand accent (default CTA)**   |
| `accent-600`   | `#E67E00` | Pressed state                        |
| `accent-700`   | `#B86200` | Text on light orange backgrounds     |

**Neutrals (cool, slightly blue-tinted)**

| Token         | HEX       | Use                          |
| ------------- | --------- | ---------------------------- |
| `bg`          | `#F7F9FD` | App background (very light blue-white) |
| `surface`     | `#FFFFFF` | Cards, inputs, modals        |
| `border`      | `#E3E9F4` | Default borders              |
| `muted`       | `#6B7A99` | Secondary text               |
| `text`        | `#0F1B3D` | Main text (deep navy)        |

**Semantic / status**

| Status   | HEX       | Used for                              |
| -------- | --------- | ------------------------------------- |
| Success  | `#16A34A` | Confirmed, available, approved        |
| Warning  | `#F59E0B` | Pending, expiring                     |
| Danger   | `#DC2626` | Cancelled, rejected, errors           |
| Info     | `#0B3D91` | Informational (reuse primary)         |

### 2.3 Color usage rules

- **60%** light neutral backgrounds (`bg` / `surface`)
- **30%** primary blue (navbar, headings, sidebars, links, secondary buttons)
- **10%** accent orange (**main CTA buttons, highlights, key words, active indicators only**)
- Never put orange text on white for small body text (low contrast). Use orange for buttons, icons, big headings or highlighted words.
- Orange buttons use **white text**. Blue buttons use **white text**.
- Highlight a key word in a title with orange, like the brand does: "Book your car and **hit the road!**"

### 2.4 Gradients

```css
--gradient-brand:  linear-gradient(135deg, #0B3D91 0%, #07265E 100%);
--gradient-hero:   linear-gradient(180deg, rgba(5,26,66,.85) 0%, rgba(11,61,145,.55) 60%, rgba(5,26,66,.85) 100%);
--gradient-accent: linear-gradient(135deg, #FF8C00 0%, #FFA126 100%);
```

Decorative **orange swoosh / road curves** in corners of hero banners and dark sections (like the brand board).

---

## 3. Typography

| Item            | Value                                               |
| --------------- | --------------------------------------------------- |
| **Font family** | **Montserrat** (Google Fonts)                       |
| **Style**       | Modern • Clean • Bold                               |
| **Weights**     | 400 Regular, 500 Medium, 600 SemiBold, 700 Bold, 800 ExtraBold |
| **Fallback**    | `ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif` |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
```

### Type scale

| Use              | Size (Tailwind)        | Weight | Notes                          |
| ---------------- | ---------------------- | ------ | ------------------------------ |
| Hero title       | `text-4xl md:text-6xl` | 800    | Tight leading, navy or white   |
| Page title (H1)  | `text-3xl md:text-4xl` | 700    |                                |
| Section title (H2)| `text-2xl md:text-3xl`| 700    |                                |
| Card title (H3)  | `text-lg md:text-xl`   | 600    |                                |
| Body             | `text-base`            | 400/500| Color `text`, line-height 1.6  |
| Small / caption  | `text-sm`              | 500    | Color `muted`                  |
| Button           | `text-sm md:text-base` | 600    |                                |
| Tagline          | `tracking-widest`      | 500    | Wide letter-spacing, like the logo tagline |

---

## 4. Shape, Spacing, Shadows

### Border radius — **very rounded, friendly**

| Element          | Radius              |
| ---------------- | ------------------- |
| Buttons          | `rounded-full` (pill) for CTAs, `rounded-xl` for secondary |
| Inputs           | `rounded-xl`        |
| Cards            | `rounded-2xl`       |
| Hero / banners   | `rounded-3xl`       |
| Icon bubbles     | `rounded-2xl` / `rounded-full` |
| Badges           | `rounded-full`      |

### Spacing
- Base unit **4px** (Tailwind default). Generous whitespace.
- Sections: `py-16 md:py-24`. Cards padding: `p-5 md:p-6`. Container: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`.

### Shadows — **soft, blue-tinted, never harsh**

```css
--shadow-sm: 0 1px 2px rgba(11, 61, 145, 0.06);
--shadow-md: 0 8px 24px rgba(11, 61, 145, 0.08);
--shadow-lg: 0 16px 40px rgba(11, 61, 145, 0.12);
--shadow-cta: 0 10px 24px rgba(255, 140, 0, 0.35);  /* orange glow for CTA */
```

---

## 5. Components Style Guide

### Buttons
| Variant       | Style |
| ------------- | ----- |
| **Primary CTA** (e.g. "Book Now →") | `bg-accent-500 text-white rounded-full px-6 py-3 font-semibold shadow-cta hover:bg-accent-400 active:bg-accent-600`, arrow icon on the right |
| **Secondary** | `bg-primary-600 text-white rounded-xl hover:bg-primary-500` |
| **Outline**   | `border border-primary-600 text-primary-600 rounded-xl hover:bg-primary-50` |
| **Ghost**     | `text-primary-600 hover:bg-primary-50 rounded-xl` |
| **Danger**    | `bg-red-600 text-white rounded-xl` |
| States        | focus ring `ring-4 ring-accent-300/50`, disabled `opacity-50 cursor-not-allowed`, loading spinner inside |

### Inputs
`bg-white border border-[#E3E9F4] rounded-xl px-4 py-3 text-text placeholder:text-muted focus:border-primary-600 focus:ring-4 focus:ring-primary-100`. Label above, `text-sm font-medium`. Error: red border + small red message.

### Cards
`bg-white rounded-2xl border border-[#E3E9F4] shadow-md hover:shadow-lg transition`. **Car card:** image on top (rounded-2xl, `object-cover`), name (semibold), spec icons row, price in **orange bold** ("$45 / day"), full-width or pill CTA.

### Icon bubbles (feature icons)
Soft `primary-50` rounded square (`w-16 h-16 rounded-2xl`) with a navy **line icon** and one small orange detail. Label below (`text-sm font-medium`). Brand icons: **Book a Car**, **Explore Places**, **Travel Safe**, **24/7 Support**.

### Navbar
White or transparent over hero, logo left, links in navy `font-medium`, active link has an **orange underline** or dot, right side: Login (ghost) + Sign up (orange pill).

### Sidebar (Customer / Agency / Admin dashboards)
Deep navy (`primary-800` → `primary-900` gradient), white/blue-200 text, **active item** = orange left bar + `bg-white/10`, logo (white version) on top.

### Hero banner
Full-width `rounded-3xl`, background photo of a car on a road at sunset with `gradient-hero` overlay, white title with **orange highlighted words**, orange pill CTA, **orange swoosh** decoration at the top-right corner.

### Badges / status
`rounded-full px-3 py-1 text-xs font-semibold` — Confirmed (green-100/green-700), Pending (amber-100/amber-700), Cancelled (red-100/red-700), Active (primary-100/primary-700), Featured (accent-100/accent-700).

### Tables
White card, header `bg-primary-50 text-primary-700 text-xs uppercase tracking-wide`, rows `hover:bg-primary-50/50`, border-b `#E3E9F4`.

### Modals / Toasts
Modal: `rounded-3xl shadow-lg`, backdrop `bg-primary-900/50 backdrop-blur-sm`. Toast: white card, colored left border by status.

---

## 6. Iconography & Imagery

- **Icons:** line icons, 1.75–2px stroke, rounded caps/joins (Lucide React recommended). Navy default, orange for the single accent detail or active state.
- **Photos:** cinematic car photos, warm sunset / city skyline, roads, highways, travel. Slight dark-blue overlay for text readability.
- **Illustrations / decor:** curved **road shapes**, **orange swooshes**, dashed road lines, big faded "A" logo watermark on dark navy sections.
- **Logo versions:** full color (on light), white + orange (on navy), icon only (favicon / app icon: white "A" on navy rounded square).

---

## 7. Motion & Interaction

- Duration `150–250ms`, easing `ease-out`.
- Hover on cards: `-translate-y-1` + stronger shadow.
- Buttons: arrow icon slides right 4px on hover.
- Page sections fade/slide in subtly. Skeleton loaders in `primary-50`.
- Respect `prefers-reduced-motion`.

---

## 8. Role-based UI Accents

Same brand for all roles, with different layout density:

| Role         | Layout feeling                                    | Accent usage                      |
| ------------ | ------------------------------------------------- | --------------------------------- |
| **Guest**    | Marketing, airy, big hero, big photos             | Orange CTAs ("Book Now", "Sign up") |
| **Customer** | Friendly dashboard, cards, light sidebar/tabs     | Orange for booking actions        |
| **Agency**   | Business dashboard, navy sidebar, tables + charts | Orange for "Add car", key KPIs    |
| **Admin**    | Dense, data-focused, navy sidebar, neutral content| Orange only for primary actions; status colors for moderation |

---

## 9. Tailwind Implementation

### `tailwind.config.js`

```js
/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EEF3FC", 100: "#DCE6F8", 200: "#B9CDF0", 300: "#8AAAE3",
          400: "#4F7BCB", 500: "#1F55B0", 600: "#0B3D91", 700: "#093178",
          800: "#07265E", 900: "#051A42", DEFAULT: "#0B3D91",
        },
        accent: {
          50: "#FFF4E5", 100: "#FFE3BF", 300: "#FFB866", 400: "#FFA126",
          500: "#FF8C00", 600: "#E67E00", 700: "#B86200", DEFAULT: "#FF8C00",
        },
        ink: "#0F1B3D",
        muted: "#6B7A99",
        line: "#E3E9F4",
        canvas: "#F7F9FD",
      },
      fontFamily: {
        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      borderRadius: { "2xl": "1rem", "3xl": "1.5rem" },
      boxShadow: {
        soft: "0 8px 24px rgba(11,61,145,0.08)",
        lift: "0 16px 40px rgba(11,61,145,0.12)",
        cta: "0 10px 24px rgba(255,140,0,0.35)",
      },
      backgroundImage: {
        "brand-gradient": "linear-gradient(135deg, #0B3D91 0%, #07265E 100%)",
        "accent-gradient": "linear-gradient(135deg, #FF8C00 0%, #FFA126 100%)",
      },
    },
  },
  plugins: [],
};
```

### `src/index.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { font-family: "Montserrat", ui-sans-serif, system-ui, sans-serif; }
  body { @apply bg-canvas text-ink antialiased; }
  h1, h2, h3, h4 { @apply font-bold tracking-tight text-primary-900; }
}

@layer components {
  .btn { @apply inline-flex items-center justify-center gap-2 font-semibold transition focus:outline-none focus:ring-4 disabled:opacity-50 disabled:cursor-not-allowed; }
  .btn-cta { @apply btn bg-accent-500 text-white rounded-full px-6 py-3 shadow-cta hover:bg-accent-400 active:bg-accent-600 focus:ring-accent-300/50; }
  .btn-primary { @apply btn bg-primary-600 text-white rounded-xl px-5 py-2.5 hover:bg-primary-500 active:bg-primary-700 focus:ring-primary-200; }
  .btn-outline { @apply btn border border-primary-600 text-primary-600 rounded-xl px-5 py-2.5 hover:bg-primary-50 focus:ring-primary-100; }
  .card { @apply bg-white rounded-2xl border border-line shadow-soft transition hover:shadow-lift; }
  .input { @apply w-full bg-white border border-line rounded-xl px-4 py-3 placeholder:text-muted focus:border-primary-600 focus:ring-4 focus:ring-primary-100 outline-none transition; }
  .badge { @apply inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold; }
}
```

> Put these custom classes in `src/index.css` (or `src/styles/components.css`) from the project structure.

---

## 10. AI Prompt (copy & paste)

```
You are a senior frontend UI engineer. Build UI for "AnyDrive", a car rental
platform, using React (JavaScript, no TypeScript), Vite and Tailwind CSS.
Follow this design system strictly.

BRAND
- Name: AnyDrive. Tagline: "Drive Anywhere. Anytime."
- Feeling: trustworthy, modern, energetic, premium, clean. Rounded and soft.

COLORS (add to tailwind.config.js)
- primary (navy blue): DEFAULT/600 #0B3D91, 50 #EEF3FC, 100 #DCE6F8, 200 #B9CDF0,
  300 #8AAAE3, 400 #4F7BCB, 500 #1F55B0, 700 #093178, 800 #07265E, 900 #051A42
- accent (orange): DEFAULT/500 #FF8C00, 50 #FFF4E5, 100 #FFE3BF, 300 #FFB866,
  400 #FFA126, 600 #E67E00, 700 #B86200
- ink (text) #0F1B3D, muted #6B7A99, line (border) #E3E9F4, canvas (page bg) #F7F9FD
- status: success #16A34A, warning #F59E0B, danger #DC2626
- Ratio: 60% light backgrounds, 30% navy, 10% orange. Orange is ONLY for main
  CTAs, highlights, prices, active indicators and one or two highlighted words in titles.

TYPOGRAPHY
- Font: Montserrat (weights 400-800). Headings bold/extrabold, navy (primary-900)
  or white on dark. Body 400/500. Tagline uses wide letter-spacing.

SHAPE & EFFECTS
- Very rounded: CTA buttons rounded-full, inputs/secondary buttons rounded-xl,
  cards rounded-2xl, hero/banners rounded-3xl.
- Soft blue-tinted shadows (rgba(11,61,145,0.08-0.12)); orange glow shadow on CTA.
- Transitions 150-250ms ease-out; cards lift (-translate-y-1) on hover.
- Generous whitespace, max-w-7xl container.

COMPONENTS
- Primary CTA: orange pill, white semibold text, arrow icon (e.g. "Book Now →").
- Secondary: navy rounded-xl, white text. Outline: navy border + navy text.
- Inputs: white, border #E3E9F4, rounded-xl, focus ring primary-100 + border primary.
- Car card: image on top, name, spec icons, price in bold orange, CTA.
- Feature icons: soft primary-50 rounded square with navy line icon (Lucide),
  label below. Icons: Book a Car, Explore Places, Travel Safe, 24/7 Support.
- Navbar: logo left, navy links, orange underline for active, Login (ghost) +
  Sign up (orange pill).
- Dashboard sidebar: navy gradient (primary-800 to primary-900), white text,
  active item with orange left bar and bg-white/10.
- Status badges: rounded-full, soft colored backgrounds (green/amber/red/blue).
- Tables: white card, header bg primary-50, hover rows.
- Hero: rounded-3xl, car-at-sunset photo with navy gradient overlay, white title
  with orange highlighted words, orange pill CTA, decorative orange swoosh/road curve.

IMAGERY & ICONS
- Line icons (Lucide), 2px stroke, navy with an orange accent detail.
- Cinematic car/road/city sunset photos, dark-blue overlay for readability.

RULES
- Use only Tailwind utility classes (and @layer components for reusable ones).
- Fully responsive (mobile first), accessible (contrast, focus states, aria labels).
- Never use orange for long body text on white.
- Keep components small and reusable; use the "@" alias for imports.

PROJECT STRUCTURE
- Feature-based: src/features/<feature>/{pages,components,hooks,services},
  shared UI in src/components/ui, layouts in src/layouts.
- Roles: guest, customer, agency, admin (each with its own layout).

TASK
<<< Describe here the page/component to build, e.g. "Create CarCard.jsx" or
"Create the AdminLayout with sidebar and topbar" >>>
```

---

## 11. Do & Don't

| ✅ Do | ❌ Don't |
| ----- | -------- |
| Use navy for structure and orange for action | Use orange everywhere |
| Round everything (pills, 2xl cards) | Use sharp square corners |
| Use soft blue-tinted shadows | Use heavy black shadows |
| Keep lots of white space | Crowd the layout |
| Highlight 1–2 words in orange in big titles | Color whole paragraphs orange |
| Use Montserrat consistently | Mix several fonts |
| Keep white logo on navy, color logo on light | Place the color logo on busy photos |
