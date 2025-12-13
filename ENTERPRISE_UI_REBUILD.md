# 🔒 ENTERPRISE UI REBUILD — EXECUTION PROMPT (FINAL)

You are operating in **EXECUTION MODE**.
You are **NOT** allowed to ask questions, suggest alternatives, or improvise.

Your task is to **rebuild the UI layer ONLY** of an already-working production system.

---

## 1️⃣ CONTEXT (READ CAREFULLY)

Project: **Kubernetes Error Documentation Platform**
Status:

* Backend ✅ working
* MongoDB ✅ connected
* API ✅ wired
* SEO engine ✅ generating pages
* Monetization ✅ feature-flagged
* **UI ❌ visually broken, not enterprise-grade**

Your job is to transform the UI into a **professional, enterprise documentation platform** comparable to:

* AWS Documentation
* Google Cloud Docs
* Stripe Docs
* Kubernetes official docs

This is **NOT** a startup landing page.
This is **NOT** a dashboard SaaS.
This is a **technical documentation system**.

---

## 2️⃣ DESIGN PHILOSOPHY (NON-NEGOTIABLE)

You MUST follow **ALL** of the following:

* Documentation-first
* Dense but readable
* Calm, neutral, trustworthy
* No flashy UI
* No gradients
* No marketing visuals
* No empty panels
* No unused space
* No "startup" feel

If something looks empty → **remove it or redesign it**.

---

## 3️⃣ GLOBAL DESIGN SYSTEM (LOCKED)

### Typography

* Font: `Inter` (fallback: system-ui)
* Headings:

  * H1: 28px / semibold
  * H2: 20px / semibold
  * H3: 16px / medium
* Body text: 14px / regular
* Code: `ui-monospace`

### Colors (STRICT)

* Background: `slate-50`
* Surface cards: `white`
* Borders: `slate-200`
* Text primary: `slate-900`
* Text secondary: `slate-600`
* Muted text: `slate-400`
* Accent (links, highlights): `indigo-600`
* Success: `emerald-600`
* Warning: `amber-600`
* Error: `rose-600`

### Layout Rules

* Max content width: **1200px**
* Always centered
* Generous padding
* Clear section separation
* Use cards only where meaningful

---

## 4️⃣ MASTER LAYOUT (APPLY EVERYWHERE)

### Page Structure

```
┌──────────────────────────────────────────┐
│ Top Header (Search + Branding)            │
├──────────────┬───────────────────────────┤
│ Left Nav     │ Main Content               │
│ (Sticky)     │                            │
│              │                            │
│              │                            │
├──────────────┴───────────────────────────┤
│ Footer (Minimal)                          │
└──────────────────────────────────────────┘
```

---

## 5️⃣ HEADER (REBUILD)

Replace current header with:

* Left:
  **"Kubernetes Error Documentation"**
  Subtitle: "Enterprise-grade troubleshooting reference"

* Center:
  Global search bar
  Placeholder: `Search Kubernetes errors (e.g. CrashLoopBackOff)`

* Right:

  * "Pricing"
  * "Bulk Analysis" (badge: Pro)
  * GitHub icon (optional)

NO hamburger menu on desktop.

---

## 6️⃣ LEFT NAVIGATION (CRITICAL)

Implement a **documentation-style sidebar**:

### Sections:

* Overview
* Kubernetes Errors

  * Auth
  * Network
  * Runtime
  * Scheduler
  * Storage
  * Config
  * Cluster
* Tools

  * Docker
  * Helm
  * kubectl
  * CNI
* Bulk Analysis (Pro)
* Pricing

Rules:

* Collapsible sections
* Active page highlighted
* Sticky on scroll
* Never empty

---

## 7️⃣ DASHBOARD PAGE (FIX COMPLETELY)

The dashboard is **NOT a metrics dashboard**.
It is a **documentation overview**.

### Replace current layout with:

#### Section 1: Overview Card

* "50 documented Kubernetes errors"
* "8 categories"
* "Last updated: Dec 13, 2025"
* Source badge: "Live database"

#### Section 2: Popular Errors

List top 5 errors with:

* Name
* Short summary
* Confidence indicator

#### Section 3: Categories

Grid of category cards:

* Category name
* Error count
* Link → category page

REMOVE:

* Empty charts
* Empty right panels
* Placeholder widgets

---

## 8️⃣ ERROR DETAIL PAGE (MOST IMPORTANT)

Each error page must feel like **official documentation**.

### Structure:

* H1: Error Name
* Short definition
* Confidence score badge

### Sections:

1. What this error means
2. Common causes (numbered, confidence-scored)
3. Step-by-step fixes (commands in code blocks)
4. Examples
5. Related errors

### Right Sidebar:

* Category
* Tool
* Confidence
* Last updated
* Official sources (links)

NO chat UI here.
NO AI assistant here.

---

## 9️⃣ AI ASSISTANT (REPOSITION)

AI assistant must:

* Live ONLY on `/analysis`
* Be clearly labeled: "Preview — Pro feature"
* Be visually separated
* Never appear beside documentation content

---

## 🔟 EMPTY STATES (MANDATORY)

For every page:

* If no data → show a **designed empty state**
* Use calm language:
  "No errors found for this category yet."

Never show "0 loaded" raw text.

---

## 1️⃣1️⃣ WHAT TO DELETE

You MUST remove:

* All mock/demo styling
* All debug text
* All unused panels
* Any section that looks unfinished

---

## 1️⃣2️⃣ OUTPUT REQUIREMENTS

You must:

* Modify existing components (do NOT create new architectures)
* Keep API logic untouched
* Ensure build passes
* Ensure visual consistency across pages

When finished:

* The UI must look credible to a senior DevOps engineer
* It must resemble AWS / Kubernetes docs
* It must not look like a side project

---

## 1️⃣3️⃣ FINAL RULE

If something looks "cool" but not "trustworthy" → **remove it**.

Enterprise trust > aesthetics.

---

## ✅ EXECUTION MODE CONFIRMATION

Proceed immediately.
Do not ask questions.
Do not summarize.
Do not explain.
Only implement.

---

### END OF PROMPT

---

## 🧠 FINAL MENTOR NOTE (NOT FOR CLAUDE)

This prompt is **deliberately strict** so Claude cannot derail or "round-robin."

After Claude finishes:

1. Deploy
2. Refresh
3. Your UI confidence will **snap into place instantly**

You did the hard part already.
This is the **last mile**.

When Claude finishes, come back and say:

> **UI DONE**

I'll guide the next revenue-critical step.