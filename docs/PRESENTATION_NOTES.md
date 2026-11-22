# Sahay (सहाय) Presentation Notes & 5-Minute Live Demo Script
## Capstone Project for Assistive Technology Course

---

## 1. 10-Slide Presentation Deck Outline

### Slide 1: Title & Team
* **Title:** Sahay (सहाय) — Universal Assistive Technology & Empathy Hub
* **Subtitle:** An Open-Source, WCAG 2.2 Level AA Accessible Platform for Disability Awareness & Assistive Solutions
* **Course:** Assistive Technology / Human-Computer Interaction Capstone
* **Team Members & Roles:**
  * Content & RPwD Act Research
  * Full-Stack Architecture & API Design
  * Assistive Tools & Web Speech Engineering
  * UI/UX Design, WCAG 2.2 AA Compliance & Testing

---

### Slide 2: The Problem & Real-World Context
* **The Reality (WHO & NSSO Data):** Over **1.3 billion people** globally (16% of the world population) experience significant disability. In India, over **2.68 crore individuals** live with recognized disabilities under the Census.
* **The Information Gap:** Most educational resources treat disability through a purely medical or charity lens, without allowing non-disabled students, teachers, and developers to understand the *lived sensory and motor barriers*.
* **The Digital Divide:** Less than 3% of the top 1 million website homepages meet basic WCAG accessibility standards, creating unnecessary digital exclusion.

---

### Slide 3: Our Philosophy — The Social Model of Disability
* **Medical Model:** Views the person as "impaired" or needing to be "fixed".
* **Social Model (Our Foundation):** People are disabled by **barriers in society, architecture, and software design**—not by their physical differences.
* **Respectful Language:** Using identity-affirming and person-first language (e.g., *"person with visual impairment"* instead of *"blind victim"*).

---

### Slide 4: Core Architecture & Innovation
* **Frontend:** React 19, Vite, Tailwind CSS, Lucide Icons, `i18next` (English + Hindi + Marathi), Canvas Confetti.
* **Backend:** Node.js, Express REST API (`/api/v1`), Zod validation, JWT in `httpOnly` secure cookies, bcrypt password hashing, rate limiting, and Helmet security.
* **Database:** SQLite (zero-setup, portable single-file database running locally on any evaluator's machine).
* **Native Web APIs:** Web Speech API (Synthesis & Recognition), Web Audio API (real-time biquad filtering), SVG `feColorMatrix` optical transforms. Zero costly proprietary API dependencies!

---

### Slide 5: The 8 Standardized Pillars
Every disability section follows the exact same predictable 8-part learning journey:
1. **What is it?** (Plain-language overview, types, causes, and interactive Myth vs Fact cards)
2. **Daily-Life Challenges** (Real-world environmental & software friction)
3. **Experience it** (Interactive empathy simulators)
4. **Solutions & Assistive Tech** (Hardware, software, screen readers, refreshable Braille, and an **interactive 3D Smart Cane Simulator** demonstrating dual-sensor ultrasonic obstacle & pothole detection)
5. **Try it** (Hands-on working utilities)
6. **Media Gallery** (Captioned videos with full-text expandable transcripts)
7. **Interactive Knowledge Quiz** (Instant feedback with explanations)
8. **Resources & Rights** (Helplines, apex institutes, UDID Swavlamban card portal)

---

### Slide 6: The Empathy Engine (6 Live Simulators)
* **Vision Simulator:** Real-time sliders for Cataracts (blur/glare), Glaucoma (radial tunnel mask), Macular Degeneration (central blind spot), and SVG color-blindness (Protanopia, Deuteranopia, Tritanopia).
* **Hearing Simulator:** Web Audio low-pass frequency filter demonstrating high-frequency sensorineural loss + 5.5 kHz Tinnitus ringing + synchronized caption toggle.
* **Motor Tremor Simulator:** Involuntary cursor jitter mini-game comparing tiny (20px) buttons vs WCAG-compliant (48px) touch targets.
* **Dyslexia Simulator:** Real-time dynamic letter-scrambling + interactive yellow Reading Ruler overlay + Lexend font.
* **ADHD Focus Mode:** Distraction Mode (popups, blinking ads) vs clean Focus Reader.
* **Sensory Overload Awareness:** Respectful auditory/visual crowding demonstration with mandatory safety warning and Emergency Stop button.

---

### Slide 7: Working Browser-Powered Assistive Utilities
* **Text-to-Speech (TTS) Voice Reader:** Voice selector, rate/pitch sliders, and **synchronized word-by-word visual highlighting**.
* **Live Speech-to-Text Captions:** Voice transcription with large high-contrast (Yellow-on-Black) display.
* **AAC Picture Communication Board:** Tap symbols to build and vocalize phrases (*"Please water"*, *"Pain"*), plus custom card builder saved to profile.
* **Voice Navigation:** Hands-free vocal navigation (*"Go to vision"*, *"Open simulations"*, *"Open settings"*).
* **Digital Emergency Medical ID:** Critical health profile, first-responder instructions, one-tap ICE calling, and PDF print layout.

---

### Slide 8: Indian Legal Framework & Schemes
* **Rights of Persons with Disabilities (RPwD) Act, 2016:**
  * Expanded recognized disabilities from 7 to 21.
  * 4% reservation in government employment.
  * Mandatory web accessibility standards (GIGW / WCAG 2.1 AA).
* **Swavlamban Portal (UDID Card):** Unified digital disability identity for welfare schemes and railway concessions.
* **ADIP Scheme:** Free or subsidized distribution of modern aids (motorized tricycles, smart canes, pediatric cochlear implants).
* **National Helplines:** Integrated 24x7 crisis numbers (KIRAN `1800-599-0019`, Tele-MANAS `14416`).

---

### Slide 9: Inclusive Design & WCAG 2.2 AA Verification
* **POUR Principles:**
  * **Perceivable:** 4.5:1 minimum text contrast, high-contrast B&W and Yellow-on-Black themes, closed captions + transcripts.
  * **Operable:** 100% keyboard navigable (zero mouse requirement), skip-to-content link, ≥44px touch targets.
  * **Understandable:** Simple-language **Easy-Read Mode**, multi-language i18n (English, Hindi, Marathi).
  * **Robust:** Semantic HTML5, WAI-ARIA roles, PWA offline caching via Service Worker.

---

### Slide 10: Limitations & Future Work
* **Simulations are Educational Approximations:** A simulator cannot replace the lived experience of disability, but it builds empathy and demonstrates why accessibility standards matter.
* **Browser Variances:** Web Speech Recognition is natively supported in Chromium (Chrome/Edge); Firefox requires manual flags.
* **Future Roadmap:**
  * Integration with machine-learning camera-based eye-tracking (WebGazer.js).
  * Expansion of regional languages (Tamil, Bengali, Telugu).
  * Collaboration with local disability advocacy groups for co-designed content.

---

## 2. The 5-Minute Live Presentation Walkthrough Script

| Time | Action on Screen | What to Say to the Judges / Evaluators |
| :--- | :--- | :--- |
| **0:00 - 0:45** | Open `http://localhost:5173/` | *"Good morning, respected judges. This is **Sahay (सहाय)**, our full-stack assistive technology hub built to WCAG 2.2 AA standards. Notice that the interface is clean, spacious, and bilingual. As the first test of accessibility, watch as I press the **Tab key**—a prominent 'Skip to Main Content' link appears, allowing keyboard-only users to bypass navigation immediately."* |
| **0:45 - 1:30** | Click **"Access Controls"** (or press `Alt + A`) | *"Accessibility isn't one-size-fits-all. In our global Accessibility Drawer, users can scale typography up to 200%, switch to a dyslexia-friendly Lexend font, or toggle **High Contrast Yellow-on-Black**, the medical gold standard for low-vision readability. Furthermore, our **Easy-Read Mode** toggle instantly converts complex clinical jargon into simple, plain-language summaries."* |
| **1:30 - 2:30** | Open **Simulations** (`/simulations`) & Category Solutions (`/category/visual-impairment#sec-solutions`) | *"Judges, theoretical knowledge is good, but **empathy drives action**. In our Empathy Suite, we've built interactive simulators. Watch the **Vision Simulator**: I can dial up Cataracts blur, or apply a Glaucoma radial tunnel mask. In the **Color Blindness** test, notice how distinguishing a 'Red pill' from a 'Green pill' becomes impossible without text labels. Next, under **Visual Impairment Solutions**, look at our **3D Smart Cane Simulator**—inspired by IIT Delhi's SmartCane. As I step the person toward a stone or pothole, the blue front sensor and purple ground sensor detect obstacles, dynamically beeping and speaking proximity alerts through Web Audio!"* |
| **2:30 - 3:30** | Open **Tools Hub** (`/tools`) | *"Beyond awareness, Sahay includes **built-in working assistive tools**. In our **Text-to-Speech reader**, watch as words highlight in yellow in real time as they are spoken. For non-verbal users, our **AAC Picture Board** lets someone tap symbols—like 'Water' or 'Pain'—assemble a sentence, and have the browser speak it aloud. We also built an offline **Emergency Medical ID** with one-tap ICE calling for first responders."* |
| **3:30 - 4:15** | Open Category Quiz (`/category/visual-impairment#sec-quiz`) | *"Each of our 8 pillars includes an interactive knowledge quiz. When a student submits their answers, our Express backend evaluates the score, provides immediate pedagogical explanations, and triggers celebratory confetti if they pass."* |
| **4:15 - 5:00** | Log in as Admin (`/login` → `/admin`) | *"Finally, our platform is fully dynamic. I will log in as an administrator. In the **Admin Dashboard**, you can see real-time SQLite metrics—users, average quiz scores, and feedback. Without touching any source code, an admin can create a new disability category, add captioned media with transcripts, or add quiz questions that immediately appear live on the public site. Thank you, and we welcome your questions!"* |
