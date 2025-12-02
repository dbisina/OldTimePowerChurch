# Design Guidelines: Old Time Power Church Website

## Design Approach
**Reference-Based Approach**: Drawing inspiration from modern church websites and spiritual platforms, blending contemporary web design with warm, revival-focused aesthetics. Think Bethel Music's visual warmth + Elevation Church's modern UX + custom liquid-glass treatments.

## Core Design Principles
1. **Warm Revival Aesthetic** - Golden glow, soft indigo depths, subtle holy ambience
2. **Liquid-Glass UI** - Backdrop-blur surfaces, translucent panels, depth layering
3. **Accessibility First** - WCAG AA contrast, semantic HTML, reduced-motion support
4. **Mobile-First Pixel Perfection** - Flawless across 320px to 1440px+

---

## Typography System

**Heading Font**: Playfair Display (serif) - for titles, headings, spiritual gravitas
- H1: 3rem (mobile) → 4.5rem (desktop), font-weight: 700
- H2: 2rem (mobile) → 3rem (desktop), font-weight: 600
- H3: 1.5rem (mobile) → 2rem (desktop), font-weight: 600

**Body Font**: Inter (sans-serif) - for content, UI elements, readability
- Body: 1rem (16px), font-weight: 400, line-height: 1.6
- Small: 0.875rem (14px)
- Captions: 0.75rem (12px)

**Special Accent**: Decorative hand-script for small sub-headings (sparingly)

---

## Layout System

**Spacing Scale**: Use Tailwind units consistently
- Primary rhythm: `p-4, p-6, p-8, p-12, p-16, p-20` (mobile → desktop)
- Component gaps: `gap-4, gap-6, gap-8`
- Section padding: `py-12` (mobile), `py-20` (tablet), `py-32` (desktop)

**Container Widths**:
- Full-width sections: `w-full` with inner `max-w-7xl mx-auto px-4`
- Content sections: `max-w-6xl mx-auto`
- Text-heavy content: `max-w-4xl mx-auto`

**Grid Patterns**:
- Sermon cards: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- Service cards: `grid-cols-1 md:grid-cols-3`
- Announcements: `grid-cols-1 lg:grid-cols-2`

---

## Color Application

**Primary Golden** (#b5621b, #efc64e): 
- CTAs, accent borders, glow effects, featured badges
- Gradients for hero overlays: `from-[#b5621b] to-[#efc64e]`

**Secondary Indigo** (#221672):
- Dark UI panels, footer, admin dashboard accents
- Deep backgrounds with transparency: `bg-[#221672]/80`

**Accent Brown** (#583922):
- Subtle borders, secondary buttons, hover states

**Neutrals**:
- Light: #f8f7fb (backgrounds, cards in light mode)
- Dark: #0b0a13 (text, dark mode backgrounds)

**Glass Effects**:
- Navbar: `bg-white/80 backdrop-blur-lg border-b border-gray-200/50`
- Cards: `bg-white/60 backdrop-blur-md`
- Modals: `bg-white/90 backdrop-blur-xl`

---

## Component Library

### Navigation
- **Sticky Header**: Glass effect, logo left, nav center, "Connect" CTA right
- **Mobile**: Hamburger menu, full-screen overlay with soft fade-in
- Items: Home | Sermons | About Us | Contact | Announcements

### Hero Carousel (3 slides)
- **Slide 1**: Radial golden glow background, centered text, dual CTAs
- **Slide 2**: Prayer/worship photo with logo watermark, service time highlight
- **Slide 3**: Open bible + dove light ray, scripture-centered messaging
- Controls: Dots below, auto-advance 6s, pause on hover
- Text overlay: Blur background behind buttons `bg-black/20 backdrop-blur-sm`

### Sermon Cards
- Thumbnail with duration badge overlay (top-right)
- Glass card: `bg-white/60 backdrop-blur-md rounded-xl p-6`
- Featured badge: Golden gradient tag
- Hover: Soft lift `hover:translate-y-[-4px]` + glow `shadow-lg shadow-[#efc64e]/20`
- Meta: Title, preacher, service day icon, date

### Announcement Cards
- **Graphic Type**: Image top, content below, glass treatment
- **Non-Graphic**: Icon + rich text, full glass card
- **Pinned**: Golden accent border-left-4

### Connect Modal
- Center overlay with backdrop blur
- Fields: Name, Email, Service preference dropdown, Subscribe checkbox
- Telegram quick-link button with icon
- Submit: Golden gradient button

### Admin Dashboard
- Dark indigo sidebar `bg-[#221672]` with golden accent highlights
- Main content: Light glass panels `bg-white/80`
- Rich-text editor: TipTap with toolbar, preview pane
- YouTube time-range inputs: Start/End seconds with preview button

---

## Animations & Effects

**Global Transitions**: 150-300ms ease-in-out for all interactive elements

**Liquid Glass**:
- Cards: `transition-all duration-300 hover:shadow-xl`
- Subtle radial gradients as pseudo-elements

**Hero Parallax**:
- Background image moves slower than foreground text
- Reduced on mobile: `md:parallax-active`

**Glow Effects**:
- CTA buttons: `shadow-lg shadow-[#efc64e]/30 hover:shadow-[#efc64e]/50`
- Featured sermon cards: Soft golden ring glow

**Performance**: All animations respect `prefers-reduced-motion`

---

## Images

### Hero Carousel Images
1. **Slide 1**: Abstract golden radial glow with soft light rays (warm, spiritual ambience)
2. **Slide 2**: Blurred photo of people in prayer/worship, hands raised, with watermark logo overlay
3. **Slide 3**: Open bible with dove and light ray from above (symbolic, reverent)

### Content Images
- **Sermon thumbnails**: YouTube auto-generated or custom uploaded (16:9 ratio)
- **Announcement graphics**: User-uploaded images (various ratios, displayed in cards)
- **About page**: Pastor/team photos, church building exterior
- **Worship/Prayer pages**: Musical instruments, prayer room, worship moments

**Image Treatment**: All images have subtle rounded corners `rounded-lg` or `rounded-xl`, lazy-loaded

---

## Responsive Behavior

**Breakpoints**: 320px, 768px (md), 1024px (lg), 1440px (xl)

**Mobile (320-767px)**:
- Single column layouts
- Stacked navigation in hamburger
- Hero text: smaller (2rem headings)
- Touch-optimized: swipeable carousel, larger tap targets (min 44x44px)

**Tablet (768-1023px)**:
- 2-column grids for sermons/announcements
- Navbar horizontal with visible items

**Desktop (1024px+)**:
- 3-column sermon grid
- Full navbar with all items visible
- Parallax effects active
- Larger spacing and typography

---

## Accessibility

- Semantic HTML5: `<nav>`, `<main>`, `<article>`, `<aside>`
- ARIA labels on carousel controls, modal, form inputs
- Contrast: All text meets WCAG AA (4.5:1 minimum)
- Keyboard navigation: Full tab order, focus rings (golden accent)
- Screen reader: `aria-live="polite"` for carousel, status messages

---

## Special Interactions

- **Sermon outline expand/collapse**: Smooth accordion with chevron rotation
- **Scripture tags**: Clickable pills that open modal with full passage
- **Video time-range**: YouTube embed starts at `start_sec`, ends at `end_sec`
- **Infinite scroll**: Sermons page auto-loads next batch on scroll bottom
- **Form validation**: Inline error messages with soft red glow