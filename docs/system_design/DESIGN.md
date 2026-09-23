# Vibe Learn Design System & UI Guidelines

A unified design language for the Vibe Learn learning platform. Clean, modern, and focused on clarity, consistency, and intuitive learning experiences.  
*Derived strictly from `docs/design/design-system.png` and reference page mockups.*

---

## 01. Colors

### Primary Palette
| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Primary 500** | `#10B981` | Base primary color, buttons, active highlights, key brand accents |
| **Primary 400** | `#34D399` | Hover states, bright accents, focus rings |
| **Primary 300** | `#6EE7B7` | Secondary accents, soft highlights |
| **Primary 200** | `#A7F3D0` | Subtle background highlights, border accents |
| **Primary 100** | `#D1FAE5` | Badge backgrounds, tag pills, active light containers |
| **Primary 50**  | `#F0FDF4` | Subtle section backgrounds ("Why Vibe Learn?" container) |

### Neutral Palette
| Token | Hex Value | Usage |
| :--- | :--- | :--- |
| **Neutral 900** | `#0F172A` | Primary text, dark display headings, slate dark accents |
| **Neutral 700** | `#334155` | Secondary text, module subtitles, darker borders |
| **Neutral 500** | `#64748B` | Supporting text, metadata (durations, student counts) |
| **Neutral 300** | `#CBD5E1` | Muted borders, inactive icons, divider lines |
| **Neutral 200** | `#E2E8F0` | Default card borders, input borders, progress bar tracks |
| **Neutral 100** | `#F1F5F9` | Card background hovers, subtle table/item backgrounds |
| **Neutral 50**  | `#FAFAFC` | Page background, container fills |
| **White**       | `#FFFFFF` | Card surfaces, modal surfaces, primary button text |

---

## 02. Typography

### Font Families
- **Display & Headings (Titles):** `Playfair Display`, serif (Elegant, Readable, Timeless).
- **Interface & Body:** `Inter`, sans-serif (Clean, Modern, Highly legible).

### Type Scale
| Style | Font | Size / Line Height | Weight | Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display 1** | Playfair Display | 48px / 56px (3rem / 3.5rem) | Bold (700) | Main hero page titles |
| **Display 2** | Playfair Display | 36px / 44px (2.25rem / 2.75rem) | Bold (700) | Section titles, feature headlines |
| **Heading 1** | Inter | 28px / 36px (1.75rem / 2.25rem) | Semi Bold (600) | Card titles, course detail headings |
| **Heading 2** | Inter | 22px / 30px (1.375rem / 1.875rem) | Semi Bold (600) | Sub-sections, drawer headers |
| **Heading 3** | Inter | 18px / 26px (1.125rem / 1.625rem) | Medium (500) | Small titles, accordion headers |
| **Body Large** | Inter | 16px / 24px (1rem / 1.5rem) | Regular (400) | Primary body copy, descriptions |
| **Body** | Inter | 14px / 20px (0.875rem / 1.25rem) | Regular (400) | Supporting text, sidebar lessons |
| **Small** | Inter | 12px / 16px (0.75rem / 1rem) | Regular (400) | Badges, captions, timestamps, meta |

---

## 03. Spacing System
Base unit: **4px**

| Token | Value | Tailwind Equivalent |
| :--- | :--- | :--- |
| 4 | 4px (0.25rem) | `p-1`, `m-1`, `gap-1` |
| 8 | 8px (0.5rem) | `p-2`, `m-2`, `gap-2` |
| 12 | 12px (0.75rem) | `p-3`, `m-3`, `gap-3` |
| 16 | 16px (1rem) | `p-4`, `m-4`, `gap-4` |
| 24 | 24px (1.5rem) | `p-6`, `m-6`, `gap-6` |
| 32 | 32px (2rem) | `p-8`, `m-8`, `gap-8` |
| 40 | 40px (2.5rem) | `p-10`, `m-10`, `gap-10` |
| 48 | 48px (3rem) | `p-12`, `m-12`, `gap-12` |
| 64 | 64px (4rem) | `p-16`, `m-16`, `gap-16` |

---

## 04. Radius & Shadows

### Border Radius
- **xs:** `4px` (`rounded-sm`)
- **sm:** `8px` (`rounded-md`)
- **md:** `12px` (`rounded-xl`)
- **lg:** `16px` (`rounded-2xl`)
- **xl:** `24px` (`rounded-3xl`)
- **Full:** `9999px` (`rounded-full`)

### Box Shadows
- **Sm:** `0 1px 2px 0 rgba(0, 0, 0, 0.05)`
- **Md:** `0 4px 12px -2px rgba(0, 0, 0, 0.08)`
- **Lg:** `0 12px 24px -4px rgba(0, 0, 0, 0.10)`
- **XL:** `0 20px 40px -8px rgba(0, 0, 0, 0.12)`

---

## 05. Icons
- Standard: 24x24px grid (can scale to 16x16px or 20x20px for inline meta).
- 2px stroke width (outline style).
- Rounded line caps and corners.

---

## 06. Component Specifications

### Buttons
- **Primary:** Background `#10B981`, text `#FFFFFF`, height `44px`, padding `0 16px` (md) or `0 20px` (lg), radius `12px`, font `Inter 500`. Hover `#059669`.
- **Secondary / Outline:** Background `#FFFFFF`, border `1px solid #E2E8F0`, text `#10B981` or `#0F172A`, height `44px`, radius `12px`. Hover bg `#F1F5F9`.
- **Text / Action:** Transparent background, text `#10B981`, inline play icon.

### Badges / Tags
- Height: `24px`, padding `2px 10px`, radius `9999px` (pill).
- Background: `#D1FAE5` (Primary 100), Text: `#10B981` (Primary 500), font `Inter 600`, text size `12px`.
- Video badge includes small outline play icon.

### Form Inputs
- Height: `44px`, border `1px solid #E2E8F0`, radius `12px`, padding `0 16px`, background `#FFFFFF`.
- Focus state: Border color `#10B981`, ring `2px rgba(16, 185, 129, 0.2)`.

### Progress Bar
- Track: Height `8px`, background `#E2E8F0`, radius `9999px`.
- Fill: Background `#10B981`, radius `9999px`.

### Course Cards
- Background `#FFFFFF`, border `1px solid #E2E8F0`, radius `16px`, shadow `Md`.
- Header with course icon square (48x48px) and navigation action button.
- Title in `Inter 600`, description in `Inter 400` `#64748B`.
- Footer metadata row with icons (Level, duration, module count).
- Bottom highlight bar in `#10B981` on active/featured cards.

### Curriculum & Accordion
- Module headers with numbered circular badges (`1`, `2`, `3`), title, duration, and expand/collapse chevron.
- Lessons listing with completed checkmarks, duration, and "Now playing" pulse indicators.

---

## 07. Core Principles
1. **Clarity First:** Every element communicates clearly without cognitive noise.
2. **Consistency:** Use tokens and reusable component classes across every page.
3. **Focus & Calm:** Generous whitespace, clean contrast, soothing green accents.
4. **Accessible:** Legible type scale, high contrast ratios, keyboard-friendly states.
