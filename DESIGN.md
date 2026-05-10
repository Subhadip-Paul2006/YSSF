# Youth-Sakti-Social-Foundation

Welcome to the frontend repository for the Youth-Sakti-Social-Foundation. This platform is designed to be a modern, accessible, and high-converting digital ecosystem for social impact.

## 🚀 Core Technology Stack

* **Framework:** Next.js (App Router, TypeScript)
* **Styling:** Tailwind CSS
* **UI Components:** React.js / shadcn/ui
* **Animations:** Framer Motion
* **3D Graphics:** Three.js

## 🎨 Color Theory: Accessible Green Palette

Green triggers psychological associations with growth, safety, and balance, making it highly effective for building donor trust. To ensure our platform is inclusive, this palette strictly adheres to the WCAG 2.1 mandated 4.5:1 minimum contrast ratio for text readability.

* **Primary Dark Green (`#004D00`):** Signals tradition and financial stability.
* **Secondary Mint Green (`#3EB489`):** Reads as modern and clean without feeling clinical.
* **Soft Green Background (`#E5F5E0`):** Breaks up white space in background sections without overwhelming the eye.
* **Contrasting Accent (`#DC582A`):** A reddish-orange that creates high visual contrast to ensure primary donation buttons immediately capture attention.
* **Off-White Surface (`#FDFDFC`):** A warm alternative to stark white for the main website background.
* **Darkest Green/Text (`#013220`):** Used for main body text to maintain the earthy theme while ensuring strict legibility and contrast.
* **Muted Gray/Green (`#94A596`):** Ideal for secondary text, subtle borders, or footer backgrounds.
* **Pure White (`#FFFFFF`):** Used for card surfaces and text placed inside dark green buttons to maximize legibility.

## 🖋 Typography: 3-Font System

* **Headings (Playfair Display):** A refined, high-contrast serif font that creates a strong sense of structure and establishment.
* **Body Text (Inter):** A highly readable, system-optimized sans-serif font that guarantees legibility across all mobile devices.
* **Accents & UI Elements (Montserrat):** A structured, geometric sans-serif font used in uppercase for navigation links and buttons.

## 🤖 Vercel v0 Generation Prompt

*If using Vercel v0, Cursor, or another AI coding assistant to bootstrap components, copy and paste the following prompt to ensure strict adherence to our UX and design guidelines:*

>
> **TECH STACK:** Next.js (App Router), Tailwind CSS, shadcn/ui, Framer Motion, Lucide React icons. Leave a designated structured `<canvas>` placeholder in the hero section for a future Three.js integration.
>
> **TYPOGRAPHY:** Headings: Playfair Display. Body Text: Inter. Buttons/Nav Links: Montserrat (Uppercase, tracking-wider).
>
> **COLOR PALETTE:** Primary: #004D00 | Secondary: #3EB489 | Accent/CTA: #DC582A | Background: #FDFDFC | Surface/Cards: #FFFFFF | Text Dark: #013220 | Text Muted: #94A596 | Light Green Section BG: #E5F5E0
>
> **UX & ACCESSIBILITY RULES (STRICT):**
> 1. NO CAROUSELS OR SLIDERS. Use static, high-impact imagery or split-screen layouts instead to prevent banner blindness.
> 2. Ensure a minimum 4.5:1 color contrast ratio for all text. Use semantic HTML and include aria-labels for all interactive elements.
> 3. Use a "layer-cake" scanning pattern—large bold headings, short paragraphs (max 3-4 lines), and plenty of whitespace.
> 4. Mobile-First: The layout must be perfectly responsive.
>
> **PAGE ARCHITECTURE:**
> 1. HEADER (Sticky): Logo on left. Links center. Prominent "Donate Now" button (#DC582A) on right.
> 2. HERO SECTION: Split-screen. Left: Bold typography "Empowering Youth, Transforming Communities." Two buttons: Primary (#004D00) and Secondary Outline. Right: Placeholder container for Three.js globe.
> 3. IMPACT BAR: Full-width (#E5F5E0 bg) with 3 animated counting-up statistics.
> 4. DONATION TIERS: "Choose Your Impact Today". 3 interactive cards side-by-side ($25, $50, $100). Highlight the $50 card as "Most Popular" with a border glow. Below cards: Wide "Proceed to Donate" button.
> 5. UPCOMING EVENTS: Clean grid showing 2 upcoming volunteer events with date badges.
> 6. FOOTER: Dark green background (#004D00) with white text. Include navigation, contact info, and minimal newsletter signup.
>
> **ANIMATION:**
> - Hero text/buttons stagger fade-in-up.
> - Use `whileInView` to smoothly fade/translate the Impact Bar and Donation Cards upwards on scroll.
> - Button scale-up on hover. "Most Popular" card gets a subtle, continuous floating/glowing animation.
