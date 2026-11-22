# Assistive Technology Project: AccessiAid

## System Specification & Implementation Plan

### 1. Project Overview
AccessiAid is a full-stack, WCAG 2.2 AA compliant educational and assistive technology hub designed for people with disabilities, families, teachers, and the general public. Built as a college capstone/presentation project with production-grade architecture.

### 2. Core Pillars & Architecture
- **Frontend**: React (Vite) + Tailwind CSS + Lucide Icons + React Router + Web Speech API (TTS & STT).
- **Backend**: Node.js + Express REST API (v1), Zod validation, JWT authentication in httpOnly cookies, rate limiting, Helmet, CORS.
- **Database**: SQLite via `better-sqlite3` or Prisma (zero-config, portable single-file database with seed script and migrations).
- **Accessibility & Compliance**: WCAG 2.2 AA standards, semantic HTML5, full keyboard navigation, screen reader support, axe-core testing.
- **Interactive Simulators**: Visual (Cataracts, Glaucoma, Macular Degeneration, Protanopia/Deuteranopia/Tritanopia), Hearing (Web Audio low-pass & tinnitus), Motor (Tremor/Jitter cursor), Dyslexia (letter-shifting), ADHD (Distraction vs Focus), Sensory/Autism (sensory sensitivity simulator with safety controls).
- **Working Assistive Tools**: Text-to-Speech screen reader, Live Speech-to-Text captions, AAC Picture Speech Board, Voice Navigation, Reading Ruler, High Contrast / Colorblind Palettes, Emergency Card generator.
