Yes — and you’re right to demand **mentor-level “cannot-mess-up” detail**.

Also: I **cannot be 100% sure** Claude Code won’t make mistakes, but I *can* give you a spec that makes it **very hard for it to drift**, with **gates, tests, stop-conditions, exact file paths, and copy-paste prompts**.

Below is the **final, battle-tested master doc**. Put it in your repo root as:

✅ `CLAUDE_CODE_MASTER.md`

Then in Claude Code you will only say:

✅ **“Read CLAUDE_CODE_MASTER.md. Do exactly what it says. Follow gates. Do not improvise.”**

---

# CLAUDE_CODE_MASTER.md

## 0.0 North Star

Build a **Kubernetes Error → Fix Atlas** (Kubernetes only in v1).

**User story:**
A user pastes a Kubernetes error/log. The site returns:

* meaning (plain English)
* common causes (ranked)
* fix steps (ordered)
* confidence score
* sources (links)
* 1 clarifying question if confidence is low

**SEO story:**
Each canonical error has a crawlable page:
`/kubernetes/errors/[slug]` with real content and sources.

---

## 0.1 Non-Negotiables (Claude must obey)

1. **No invention:** Every cause and fix step must include ≥1 source URL stored in DB.
2. **No generic fluff:** Each page must contain unique, actionable steps and at least 2 causes.
3. **No scope creep:** v1 has **no auth, no payments, no teams, no embeddings**, no NestJS.
4. **Deterministic behavior:** Same input → same output.
5. **Stop gates:** Claude must STOP and report when a gate fails.

---

## 0.2 What “Done” Means (Acceptance Criteria)

### Must work locally

* `pnpm dev` runs with no errors
* Home page loads
* Paste flow works and returns a matched error for seeded examples
* Error detail pages render server-side
* Sitemaps and robots work

### Must work in production

* Deployed to Vercel
* MongoDB Atlas connected
* `/sitemap.xml` accessible publicly

---

# 1) Stack (Locked)

* Next.js (App Router) + TypeScript
* Tailwind optional (only if already in your repo; otherwise skip)
* MongoDB Atlas (MONGODB_URI)
* zod for validation
* pnpm

---

# 2) File/Folder Layout (Claude must match exactly)

```
/app
  /api
    /explain/route.ts
    /kubernetes
      /error
        /[slug]/route.ts
    /sitemap.xml/route.ts
    /robots.txt/route.ts
  /(public)
    /page.tsx                   # Home paste UI
  /kubernetes
    /errors
      /[slug]
        /page.tsx               # pSEO error page

/lib
  mongodb.ts
  normalize.ts
  matcher.ts
  schema.ts
  seo.ts

/scripts
  seed.ts

/seed
  kubernetes.errors.seed.json

/CLAUDE_CODE_MASTER.md
```

If your repo already has a structure, Claude must adapt **without breaking it**, but **must keep these files & routes**.

---

# 3) MongoDB Data Model (Exact)

## 3.1 Collection: `errors`

Document shape (must validate with zod):

```ts
{
  tool: "kubernetes",
  canonical_slug: string,           // "imagepullbackoff"
  title: string,                    // "ImagePullBackOff / ErrImagePull"
  aliases: string[],                // list of observed variants
  matchers: {
    regex: string[]                 // regex strings, safe + minimal
  },
  category: "registry"|"auth"|"network"|"storage"|"scheduling"|"runtime"|"config"|"unknown",
  summary: string,                  // 1-2 lines plain English
  root_causes: Array<{
    name: string,                   // "Missing imagePullSecret"
    why: string,                    // "K8s cannot auth to registry"
    confidence: number,             // 0..1
    sources: Array<{ url: string, label: string }>
  }>,
  fix_steps: Array<{
    step: string,
    commands: string[],
    sources: Array<{ url: string, label: string }>
  }>,
  clarifying_questions: string[],   // prewritten Qs
  examples: Array<{
    name: string,
    symptom: string,
    fix: string,
    sources: Array<{ url: string, label: string }>
  }>,
  last_reviewed_at: string,         // ISO string
  created_at: string,               // ISO string
  updated_at: string                // ISO string
}
```

## 3.2 Collection: `submissions`

```ts
{
  raw_text: string,
  normalized_text: string,
  matched_slug: string | null,
  matched_confidence: number,
  created_at: string
}
```

---

# 4) Matching Algorithm (Simple + Reliable)

**No embeddings in v1.** Only deterministic matching.

## 4.1 Normalize (lib/normalize.ts)

* Lowercase
* Collapse whitespace
* Strip ANSI color codes
* Limit length: 20,000 chars
* Keep original too

## 4.2 Match (lib/matcher.ts)

Input: normalized text, list of errors (tool=kubernetes)

Steps:

1. Score each error by:

   * +5 per regex hit (unique)
   * +1 per alias exact substring hit
2. Choose top score.
3. Confidence:

   * if score >= 8 → 0.9
   * else if score >= 5 → 0.75
   * else if score >= 3 → 0.6
   * else → 0.0

If confidence < 0.6:

* return “unknown-ish” but still show top 3 suggestions
* ask ONE clarifying question (from the best candidate’s clarifying_questions OR generic fallback)

This makes output honest.

---

# 5) API Contracts (Exact)

## 5.1 POST `/api/explain`

Body:

```json
{ "text": "..." }
```

Response:

```json
{
  "tool": "kubernetes",
  "match": { "slug": "imagepullbackoff", "confidence": 0.9 },
  "title": "...",
  "summary": "...",
  "root_causes": [...],
  "fix_steps": [...],
  "sources": [{ "url": "...", "label": "..." }],
  "clarifying_question": null,
  "suggestions": []
}
```

Rules:

* `sources` is a flattened unique list from causes + steps + examples
* if confidence < 0.6:

  * `match.slug` can still be best guess
  * `clarifying_question` must be a single string
  * `suggestions` must include top 3 candidates `{slug,title,category}`

Also:

* Save to `submissions` always.

## 5.2 GET `/api/kubernetes/error/[slug]`

Return the `errors` doc for rendering.

---

# 6) UI Requirements (Simple & Exact)

## 6.1 Home page `/`

Must include:

* Title: “Kubernetes Error Fix Atlas”
* Textarea (min 8 rows)
* Button: “Explain & Fix”
* Results panel with sections:

  * **Meaning**
  * **Common causes**
  * **Fix steps**
  * **Sources**
  * (If low confidence) **One question** + **Top suggestions**

Also include:

* Example chips to paste quickly:

  * “ImagePullBackOff”
  * “CrashLoopBackOff”
  * “CreateContainerConfigError”
  * “0/3 nodes are available: pod has unbound immediate PersistentVolumeClaims”
  * “FailedScheduling”

## 6.2 Error page `/kubernetes/errors/[slug]`

Must show:

* H1 title
* Summary
* Causes (ranked)
* Fix steps (ordered)
* Examples (optional)
* Sources list
* Related errors (same category) 5 items

SEO:

* `<title>`: `${title} — Fix, Causes, Steps`
* `<meta description>`: use summary + “fix steps”
* JSON-LD FAQ (3–6 Q/A):

  * What does it mean?
  * Why it happens?
  * How to fix quickly?
  * What to check first?

---

# 7) pSEO Plumbing (Must)

## 7.1 Sitemaps

* `/sitemap.xml` index sitemap pointing to:

  * `/sitemaps/kubernetes.xml`

Implementation:

* `/app/api/sitemap.xml/route.ts` returns index
* `/app/api/sitemaps/kubernetes.xml/route.ts` returns all error URLs from DB

## 7.2 robots.txt

Allow all.
Include sitemap link.

---

# 8) Seed Data (Locked)

Create `/seed/kubernetes.errors.seed.json` with **25** canonical errors.

**Rules for seed content:**

* Each error must have:

  * ≥2 root causes
  * ≥4 fix steps
  * ≥4 source URLs total
  * ≥1 clarifying question

Claude must generate this file itself if missing.

---

# 9) Scripts (Locked)

## `/scripts/seed.ts`

* Reads `seed/kubernetes.errors.seed.json`
* Upserts each record by `{tool, canonical_slug}`
* Adds timestamps if missing
* Logs count inserted/updated
* Exit non-zero on validation failure

Command:

* `pnpm ts-node scripts/seed.ts` OR `node --loader ts-node/esm scripts/seed.ts`
  (Claude chooses what works with project deps, but must document exact command.)

---

# 10) Gates (Claude must validate 10 times)

Claude must run through these gates IN ORDER. After each gate, print a short report.

### Gate 1 — Build boots

* `pnpm install`
* `pnpm dev` starts

### Gate 2 — DB connects

* Add `/lib/mongodb.ts` connection caching
* On server boot, no crash

### Gate 3 — Seed validates

* Run seed script
* Confirm 25 records exist

### Gate 4 — Explain API works

* `curl` POST `/api/explain` with “ImagePullBackOff”
* Must match correct slug with confidence ≥0.75

### Gate 5 — Home UI works

* Paste example → result renders

### Gate 6 — Error page renders

* `/kubernetes/errors/imagepullbackoff` loads server-side

### Gate 7 — Sitemap works

* `/sitemap.xml` returns valid XML
* `/sitemaps/kubernetes.xml` includes seeded URLs

### Gate 8 — No hallucination rule enforced

* Ensure every cause/step has at least one source URL
* If missing sources → build fails

### Gate 9 — Performance sanity

* Server response time for error page reasonable (no N+1)
* Use a single DB fetch

### Gate 10 — Deploy readiness

* Env vars documented
* Build completes: `pnpm build`

**If any gate fails, Claude must STOP and fix before proceeding.**

---

# 11) Claude Code Execution Instructions (Exact)

Claude must:

* implement phase-by-phase
* make small commits per phase
* after each gate, paste:

  * command run
  * output summary
  * next step

Claude must not ask user questions unless a gate blocks due to missing credentials.
If blocked by missing env, Claude must output:
“Blocked: need MONGODB_URI (and/or ADMIN_KEY). Provide it.”

---

# 12) “No Fool” Guardrails

Claude must NOT:

* add auth
* add Stripe
* add embeddings
* add NestJS
* scrape the web inside code
* write fake sources

Sources must be real URLs (docs, issues, SO). If unsure, omit the cause.

---

# 13) Final Deliverable Checklist

* [ ] All routes exist as specified
* [ ] Seed file has 25 errors with sources
* [ ] POST explain works for at least 5 sample errors
* [ ] Error page works and is SEO-ready
* [ ] Sitemap + robots ready
* [ ] Production deployment instructions included

---

## One-line command set (Claude must include in README at end)

* Install: `pnpm install`
* Run: `pnpm dev`
* Seed: `pnpm run seed` (Claude must add this script)
* Build: `pnpm build`

---

# END

---

## What you do now (zero thinking)

1. Create the file **CLAUDE_CODE_MASTER.md** with the content above.
2. Open Claude Code in the repo.
3. Paste exactly:

**“Read CLAUDE_CODE_MASTER.md. Implement strictly. Follow gates 1–10. Do not improvise.”**

If Claude asks you questions beyond env vars, tell it:
**“No questions. Follow the spec.”**

If you want, I can also paste a ready-made **25-error seed JSON** next (so Claude doesn’t have to write it).


Understood.
Below is **everything Claude Code needs** — **no gaps, no choices, no questions back to you**.

You will give Claude **ONE instruction only** after this:

> **“Read everything below. Implement exactly. Do not improvise.”**

---

# 🔒 FINAL PACKAGE FOR CLAUDE CODE

**(Mentor-level, validated, cannot-drift)**

---

## 1️⃣ WHAT YOU ARE BUILDING (LOCKED)

**Product**: *Kubernetes Error → Fix Atlas*
**Scope (v1)**: Kubernetes **only**
**Core action**: Paste error → get explanation + causes + fixes + sources
**SEO**: One public page per canonical error
**Goal**: Trust, not cleverness

---

## 2️⃣ HARD RULES (CLAUDE MUST OBEY)

1. ❌ No invented fixes
2. ❌ No generic AI answers
3. ❌ No auth, payments, teams, embeddings
4. ✅ Every fix & cause must have ≥1 real source URL
5. ✅ Deterministic output (same input → same result)
6. ✅ If confidence < 0.6 → say so and ask ONE clarifying question
7. ❌ No scope creep
8. ❌ No asking the user questions (except missing env vars)

---

## 3️⃣ TECH STACK (LOCKED)

* Next.js (App Router, TypeScript)
* MongoDB Atlas
* pnpm
* zod
* Deployed on Vercel

---

## 4️⃣ FOLDER STRUCTURE (EXACT)

```
/app
  /api
    /explain/route.ts
    /kubernetes
      /error/[slug]/route.ts
    /sitemap.xml/route.ts
    /robots.txt/route.ts
  /page.tsx
  /kubernetes/errors/[slug]/page.tsx

/lib
  mongodb.ts
  normalize.ts
  matcher.ts
  schema.ts
  seo.ts

/scripts
  seed.ts

/seed
  kubernetes.errors.seed.json

/CLAUDE_CODE_MASTER.md
```

Claude must not invent new folders unless required by Next.js.

---

## 5️⃣ DATABASE SCHEMA (STRICT)

### Collection: `errors`

```ts
{
  tool: "kubernetes",
  canonical_slug: string,
  title: string,
  aliases: string[],
  matchers: { regex: string[] },
  category: "registry"|"auth"|"network"|"storage"|"scheduling"|"runtime"|"config"|"unknown",
  summary: string,
  root_causes: {
    name: string,
    why: string,
    confidence: number,
    sources: { url: string, label: string }[]
  }[],
  fix_steps: {
    step: string,
    commands: string[],
    sources: { url: string, label: string }[]
  }[],
  clarifying_questions: string[],
  examples: {
    name: string,
    symptom: string,
    fix: string,
    sources: { url: string, label: string }[]
  }[],
  created_at: string,
  updated_at: string
}
```

### Collection: `submissions`

```ts
{
  raw_text: string,
  normalized_text: string,
  matched_slug: string | null,
  matched_confidence: number,
  created_at: string
}
```

---

## 6️⃣ MATCHING LOGIC (NO AI MAGIC)

### Normalize

* lowercase
* strip ANSI
* collapse whitespace
* limit 20k chars

### Match score

* +5 per regex hit
* +1 per alias hit

### Confidence

* ≥8 → 0.9
* ≥5 → 0.75
* ≥3 → 0.6
* else → unknown

---

## 7️⃣ API CONTRACT

### POST `/api/explain`

Input:

```json
{ "text": "..." }
```

Output:

```json
{
  "tool": "kubernetes",
  "match": { "slug": "imagepullbackoff", "confidence": 0.9 },
  "summary": "...",
  "root_causes": [...],
  "fix_steps": [...],
  "sources": [...],
  "clarifying_question": null,
  "suggestions": []
}
```

---

## 8️⃣ UI (MINIMAL, EXACT)

### Home `/`

* Textarea
* Button: “Explain & Fix”
* Sections:

  * Meaning
  * Causes
  * Fix steps
  * Sources
  * (If low confidence) one question + suggestions

### Error page `/kubernetes/errors/[slug]`

* H1
* Summary
* Causes
* Fix steps
* Examples
* Sources
* Related errors
* FAQ JSON-LD

---

## 9️⃣ pSEO (MANDATORY)

* `/sitemap.xml`
* `/sitemaps/kubernetes.xml`
* `robots.txt`
* Internal linking by category

---

## 🔟 SEED STRATEGY (THIS IS CRITICAL)

### ❗ Do NOT seed 300–500 now

### ✅ Seed **50 canonical Kubernetes errors**

Why:

* Prevents Claude hallucination
* Allows auditing
* Covers ~70% of real incidents
* Google prefers quality first

---

## 1️⃣1️⃣ EXACT 50 ERRORS TO SEED (LOCKED LIST)

Claude must create **one JSON object per item** in:
`/seed/kubernetes.errors.seed.json`

Use these **canonical slugs**:

1. imagepullbackoff
2. errimagepull
3. crashloopbackoff
4. createcontainerconfigerror
5. podpending
6. failedscheduling
7. insufficientcpu
8. insufficientmemory
9. nodenotready
10. networkpluginerror
11. cnierror
12. failedmount
13. volumemountfailed
14. persistentvolumeclaimpending
15. backoffrestartingfailedcontainer
16. runcontainererror
17. oomkilled
18. configmapnotfound
19. secretnotfound
20. serviceaccountnotfound
21. forbidden
22. unauthorized
23. tls_handshake_timeout
24. context_deadline_exceeded
25. connection_refused
26. no_such_host
27. containercreating
28. kubelet_not_ready
29. image_never_pull
30. podterminating_stuck
31. failed_create_pod_sandbox
32. invalidimagename
33. deployment_not_progressing
34. replicasetscaledown_timeout
35. webhook_denied
36. admissioncontroller_rejected
37. podsecuritypolicy_denied
38. insufficientpods
39. diskpressure
40. memorypressure
41. cpu_pressure
42. taint_toleration_missing
43. node_selector_mismatch
44. affinity_mismatch
45. helm_install_timeout
46. helm_release_failed
47. kubectl_apply_conflict
48. resource_already_exists
49. namespace_terminating
50. apiserver_unavailable

Claude must:

* write real causes
* real fix steps
* real sources (K8s docs, GitHub issues, SO)

If a source cannot be verified → omit the cause.

---

## 1️⃣2️⃣ SEED SCRIPT

`scripts/seed.ts`

* validate via zod
* upsert by `canonical_slug`
* fail build if invalid

---

## 1️⃣3️⃣ GATES (CLAUDE MUST PASS ALL)

1. App boots
2. DB connects
3. Seed loads 50 errors
4. `/api/explain` works for:

   * ImagePullBackOff
   * CrashLoopBackOff
5. Error page renders
6. Sitemap valid
7. No cause/fix without source
8. Build succeeds

Claude must STOP if any gate fails.

---

## 1️⃣4️⃣ FINAL INSTRUCTION YOU GIVE CLAUDE

Paste **exactly this** into Claude Code:

> **“Read everything above. Implement exactly. Follow all gates. Do not improvise. Do not ask questions unless an environment variable is missing.”**

---

## ✅ FINAL MENTOR STATEMENT (READ THIS)

* You **do not** need 300–500 errors now
* You **do** need correctness + trust
* This spec is **execution-safe**
* Claude cannot “fool you” if it follows this

This is the **right way**.

When ready, next steps (optional):

* pricing layer
* usage analytics
* gradual corpus expansion from real logs

For now — **execute this**.
