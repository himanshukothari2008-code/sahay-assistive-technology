# Sahay (सहाय) Accessibility Conformance Report
## WCAG 2.2 Level AA Conformance & Audit Documentation

### 1. Executive Summary
**Sahay (सहाय)** is an educational and assistive technology platform engineered from the ground up to achieve strict conformance with the **World Wide Web Consortium (W3C) Web Content Accessibility Guidelines (WCAG) 2.2 Level AA** standards. In addition, it aligns with the statutory digital accessibility mandates of India's **Rights of Persons with Disabilities (RPwD) Act, 2016** and the **Guidelines for Indian Government Websites (GIGW)**.

---

### 2. WCAG 2.2 Level AA Compliance Matrix (The POUR Principles)

#### Principle 1: Perceivable
*Information and user interface components must be presentable to users in ways they can perceive.*

| WCAG Criterion | Level | Implementation in Sahay | Verification Method |
| :--- | :---: | :--- | :--- |
| **1.1.1 Non-text Content** | A | All informative images and video embeds have descriptive `alt` attributes. Decorative icons use `aria-hidden="true"`. | Screen reader audit & automated axe check |
| **1.2.2 Captions (Prerecorded)** | A | Every educational video embedded in the Media Gallery includes closed captions (CC). | Manual inspection on video player |
| **1.2.3 Audio Description or Media Alternative** | A | Every video resource provides a collapsible, full-text transcript directly beneath the video player. | Manual inspection |
| **1.3.1 Info and Relationships** | A | Semantic HTML5 structure throughout: `<header>`, `<nav>`, `<main>`, `<article>`, `<aside>`, `<footer>`. Headings follow strict mathematical hierarchy (H1 → H2 → H3) with no skipped levels. | DOM tree inspection |
| **1.4.1 Use of Color** | A | Color is never used as the sole indicator of status or actions. Status indicators include textual labels (e.g., "Correct", "Error") and distinct icons. | Tested via Color Blindness Simulator |
| **1.4.3 Contrast (Minimum)** | AA | Body text meets at least **4.5:1** contrast ratio against its background. Large headers exceed **3:1**. | Color contrast analyzer verified |
| **1.4.4 Resize Text** | AA | Typography scale controls allow users to scale text from 14px to 26px (up to 200%) without content clipping or horizontal scrolling. | Tested at 200% zoom |
| **1.4.12 Text Spacing** | AA | User can adjust line-height (1.6 to 2.2), letter-spacing, and word-spacing without breaking layout containers. | Tested via Accessibility Drawer |
| **1.4.13 Content on Hover or Focus** | AA | Tooltips and overlays are dismissible via `Escape` key and do not obscure underlying content. | Keyboard audit |

---

#### Principle 2: Operable
*User interface components and navigation must be operable.*

| WCAG Criterion | Level | Implementation in Sahay | Verification Method |
| :--- | :---: | :--- | :--- |
| **2.1.1 Keyboard** | A | All functionality—including tabs, modal dialogs, accordions, quizzes, sliders, and audio controls—is operable via keyboard alone (`Tab`, `Shift+Tab`, `Enter`, `Space`, `Arrows`, `Escape`). | Keyboard-only audit (mouse disconnected) |
| **2.1.2 No Keyboard Trap** | A | Focus never gets trapped. Modal dialogs trap focus inside while open and release focus back to the triggering element upon `Escape` or close. | Keyboard modal test |
| **2.1.4 Character Key Shortcuts** | A | Global shortcut `Alt + A` opens the accessibility drawer without interfering with standard browser inputs. | Manual test |
| **2.2.1 Timing Adjustable** | A | There are no countdown timers or time-limits on reading articles or answering quiz questions. | Time inspection |
| **2.3.1 Three Flashes or Below Threshold** | A | No component flashes or flickers. Sensory overload simulations feature a mandatory opt-in warning and emergency stop. | Visual check |
| **2.3.3 Animation from Interactions** | AAA | Supports `prefers-reduced-motion` media query and includes a manual "Reduce Motion" toggle that disables all page sliding and animations. | Tested in OS and app settings |
| **2.4.1 Bypass Blocks** | A | A prominent **Skip to main content** link is the first focusable element on every page (`#main-content`). | Keyboard Tab test |
| **2.4.4 Link Purpose (In Context)** | A | Every link has descriptive text or `aria-label` (no ambiguous "click here" links). | Link audit |
| **2.4.7 Focus Visible** | AA | High-contrast visible focus rings (`outline: 3px solid #2563eb; outline-offset: 3px`) on all focusable elements. | Visual focus audit |
| **2.5.8 Target Size (Minimum)** | AA | All clickable buttons and interactive chips maintain a **minimum target size of 44x44 CSS pixels** (`.touch-target`). | Layout bounding-box inspection |

---

#### Principle 3: Understandable
*Information and the operation of user interface must be understandable.*

| WCAG Criterion | Level | Implementation in Sahay | Verification Method |
| :--- | :---: | :--- | :--- |
| **3.1.1 Language of Page** | A | HTML documents explicitly declare `lang="en"`, updated dynamically when language is switched. | DOM check |
| **3.1.2 Language of Parts** | AA | Multi-language support via `i18next` for English, Hindi (हिंदी), and Marathi (मराठी). | Multi-language switcher check |
| **3.1.5 Reading Level / Easy Read** | AAA | Global **Easy-Read Mode** toggle replaces complex medical phrasing with simplified bullet points, basic vocabulary, and visual icons. | Content inspection |
| **3.2.3 Consistent Navigation** | AA | Navigation bar, accessibility drawer, and footer appear in the identical relative order across all pages. | Cross-page comparison |
| **3.3.1 Error Identification** | A | Form validation errors (login, register, quiz) are clearly identified in text with icons and high-contrast alert boxes. | Form error audit |
| **3.3.3 Error Suggestion** | AA | Error messages suggest corrective guidance (e.g., minimum password length, valid email syntax). | Form test |

---

#### Principle 4: Robust
*Content must be robust enough that it can be reliably interpreted by a wide variety of user agents, including assistive technologies.*

| WCAG Criterion | Level | Implementation in Sahay | Verification Method |
| :--- | :---: | :--- | :--- |
| **4.1.2 Name, Role, Value** | A | WAI-ARIA roles appropriately applied: `role="tablist"`, `role="tab"`, `aria-selected`, `role="dialog"`, `aria-modal="true"`, `role="switch"`, `aria-checked`. | Screen reader VoiceOver/NVDA testing |
| **4.1.3 Status Messages** | AA | Dynamic status updates (e.g. voice synthesizer playing, live captioning active) communicate state via ARIA live regions and status badges. | Live update audit |

---

### 3. Assistive Testing Summary & Tools Used

1. **Automated Axe-Core Audits**:
   * Evaluated pages: Home (`/`), Category (`/category/visual-impairment`), Simulations (`/simulations`), Tools (`/tools`), Rights (`/rights-and-schemes`), Admin (`/admin`).
   * **Result**: Zero critical or serious accessibility violations.
2. **Keyboard-Only Traversal**:
   * Complete walkthrough completed using only `Tab`, `Shift+Tab`, `Enter`, `Space`, `Escape`, and `Arrow` keys with zero mouse intervention.
   * All focus rings remained distinctly visible with 3px outline offset.
3. **Screen Reader Testing**:
   * Tested with built-in Web Speech Synthesis and VoiceOver/TalkBack.
   * Headings and landmarks announced logically.
4. **Color Vision Simulation**:
   * Validated using internal SVG `feColorMatrix` filters for Protanopia, Deuteranopia, and Tritanopia.
   * Confirmed that color is never the solitary information bearer.
