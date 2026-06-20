# 🏢 DataFlow Studio Ultimate v14.0 — HMG Academy Ecosystem Edition

**70 Browser-Native Modules · 100% Client-Side · No AI API · No Server · Secured**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)]()
[![HMG Academy](https://img.shields.io/badge/HMG-Academy-gold)](https://hmgacademy.pages.dev/)
[![No AI API](https://img.shields.io/badge/AI_API-$0-success)]()
[![PWA Ready](https://img.shields.io/badge/PWA-100%25_Offline-purple)]()
[![SEO Optimized](https://img.shields.io/badge/SEO-Optimized-blue)]()
[![Security Hardened](https://img.shields.io/badge/Security-Hardened-red)]()

Built by **[Adewale Samson Adeagbo](https://cssadewale.pages.dev/)** for **[HMG Academy](https://hmgacademy.pages.dev/)**, a subsidiary of **[HMG Concepts](https://hmgconcepts.pages.dev/)**, Lagos, Nigeria.

*AI-Augmented Solutions Developer · Data Scientist · EdTech Builder · Virtual Tutor · Founder, HMG Concepts (est. 2015)*

---

## 🚀 What's New in v14.0 — HMG Academy Ecosystem Edition

This release is a complete consolidation, security hardening, and SEO-optimised version of the DataFlow platform.

### ✨ Key Improvements

- 🎓 **HMG Academy Branding Throughout** — Logo, gold accent, ecosystem links everywhere
- 🏢 **HMG Ecosystem Integration** — Links to HMG Concepts, Academy, Technologies, Media, Gospel
- 👨‍💻 **Adewale's Persona** — Builder profile prominently credited
- 🔒 **Security Hardened** — CSP, headers, license tier gating, integrity checks
- 🔍 **SEO Optimised** — Schema.org JSON-LD (SoftwareApplication, Organization, FAQPage, BreadcrumbList)
- 📓 **`.ipynb` Export** — Generate runnable Jupyter Notebooks
- 📦 **15+ File Types Generated** — `.ipynb`, `.py`, `.csv`, `.xlsx`, `.pdf`, `Dockerfile`, `requirements.txt`, `environment.yml`, etc.
- 🌐 **No Repo Link** — Platform deliberately does not link to source code
- 🔍 **Searchable** — Rich structured data + sitemap.xml + robots.txt + meta tags

### 🛡️ Security Features (Multi-Layer)

1. **Content Security Policy (CSP)** — Restricts script sources to known CDN
2. **Security Headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy
3. **License Tier Gating** — Premium modules show "🔒 Upgrade Required" overlay
4. **Integrity Check** — Verifies required libraries are loaded
5. **Module Sanitization** — Invalid module IDs rejected
6. **Rate Limiting** — Prevents brute-force operations
7. **Server-Side Subscription Management** — Tokens managed by HMG Academy server
8. **No Console Tampering of Tier** — Client-side checks are deterrents; subscription ultimately verified server-side

### 📦 What's in this folder

```
dswf v3/
├── index.html              ← Landing page (SEO-optimized)
├── app.html                ← Interactive studio (70 modules)
├── features.html           ← Feature catalog (70 modules explained)
├── modules.html            ← All 70 modules catalog
├── pricing.html            ← 4-tier pricing
├── about.html              ← About + HMG ecosystem
├── docs.html               ← Technical documentation
├── faq.html                ← 15+ FAQs
├── contact.html            ← Contact form
├── deployment.html         ← Step-by-step deployment
├── 404.html                ← Custom 404
│
├── static/
│   ├── manifest.webmanifest  ← PWA manifest
│   └── service-worker.js    ← Offline support
│
├── assets/
│   ├── css/
│   │   ├── style.css       ← Design system (HMG gold)
│   │   └── app.css         ← App-specific styles
│   ├── js/
│   │   ├── utils/
│   │   │   ├── storage.js  ← localStorage + IndexedDB
│   │   │   ├── security.js ← License tier gating & integrity checks
│   │   │   ├── stats.js    ← Statistical functions
│   │   │   ├── ml.js       ← ML algorithms (Logistic, KNN, RF, etc.)
│   │   │   └── export.js   ← Export utilities (.ipynb, .py, .pdf, etc.)
│   │   ├── core.js         ← State management + routing
│   │   ├── modules.js      ← All 70 module renderers
│   │   └── app.js          ← Initialization + actions
│   └── images/
│       └── hmg-academy-logo.png  ← HMG Academy branding
│
├── vercel.json             ← Vercel config
├── netlify.toml            ← Netlify config
├── _redirects              ← Cloudflare redirects
├── _headers                ← Cloudflare headers
│
├── robots.txt              ← SEO
├── sitemap.xml             ← XML sitemap
├── package.json            ← NPM scripts
├── .gitignore
│
├── README.md               ← This file
├── DEPLOYMENT.md           ← Detailed deployment guide
├── SECURITY.md             ← Security policy
├── CONTRIBUTING.md         ← Contribution guidelines
└── LICENSE                 ← MIT license
```

### 📊 70 Modules Across 9 Pillars

#### Pillar 1: Universal Ingest & Prep (7)
1. Universal Data Ingest · 2. Multi-File Batch Ingest · 3. Data Grid Editor · 4. Synthetic Data Generator · 5. Profiler · 6. Profiler Pro · 7. Advanced Stat Profiler

#### Pillar 2: Clean & Transform (8)
8. Quality Audit · 9. Cleaning & Imputation · 10. Class Imbalance (SMOTE) · 11. Column Manager · 12. Join & Merge · 13. Diff Engine · 14. REST API Connector · 15. Search & Compare

#### Pillar 3: Visual Analytics (7)
16. Visual Explorer (14 charts) · 17. Advanced Charts · 18. Drag-Drop Builder · 19. Pivot Tables · 20. Dashboard · 21. What-If · 22. Geospatial Map

#### Pillar 4: Stats & SQL (6)
23. Inferential Stats · 24. SQLite3 SQL Console · 25. Time Series · 26. Holt-Winters Forecast · 27. Isolation Forest Anomalies · 28. NLP Engine

#### Pillar 5: ML & AutoML (6)
29. Feature Selection · 30. Feature Engineering · 31. AutoML Leaderboard · 32. Neural Network · 33. SHAP · 34. Model Registry

#### Pillar 6: Reporting (6) — **NOW INCLUDES `.ipynb` EXPORT**
35. Python REPL · 36. Report Builder (.ipynb) · 37. Storytelling · 38. Data Export · 39. Bundle Share · 40. OpenAPI

#### Pillar 7: Enterprise Governance (13)
41. Pipeline · 42. Data Lineage · 43. Data Contracts · 44. Quality Expectations · 45. PII Masker · 46. Governance Logs · 47. Data Catalog · 48. Monitor · 49. Scheduler · 50. Snapshots · 51. Retention · 52. DR · 53. Team Notes

#### Pillar 8: AI Copilot & Visual SQL (8)
62. SQL Builder · 63. SQL Copilot · 64. Hypothesis Pro · 65. Schema Validator · 66. 3D Outliers · 67. ROC Arena · 68. Synthetic vs Real · 69. SOC2 Audit

#### Pillar 9: HMG Academy EdTech (9)
54. AI Tutor · 55. Learning Hub · 56. Roadmap · 57. ML Labs · 58. Portfolio Specs · 59. Glossary · 60. CBT Quiz · 61. Settings · 70. Help & ⌘K

### 📝 Export File Types

The platform can **generate and download** these file types:

- `.ipynb` (Jupyter Notebook) — **RUNNABLE** with code cells, outputs, charts
- `.py` (Python script) — Standalone Pandas analysis
- `.csv`, `.tsv`, `.json`, `.xlsx` (Excel)
- `.html`, `.md` (Markdown), `.pdf`
- `Dockerfile` — Containerise the analysis environment
- `requirements.txt` — Python dependencies
- `environment.yml` — Conda environment
- `workflow.json` — Pipeline definition
- `openapi.json` — REST API spec
- `audit_log.json` — SOC2 audit trail

### 🚀 Deployment (60 seconds)

#### Vercel (Recommended)
```bash
cd "dswf v3"
npx vercel --prod
```

#### Netlify
```bash
cd "dswf v3"
npx netlify-cli deploy --prod --dir=.
```

#### Cloudflare Pages
```bash
cd "dswf v3"
npx wrangler pages deploy . --project-name=dataflow
```

#### Local Test
```bash
cd "dswf v3"
python3 -m http.server 8000
# Open http://localhost:8000
```

See [DEPLOYMENT.md](./DEPLOYMENT.md) for step-by-step instructions.

### 💰 Pricing

| Plan | Price | Modules |
|------|-------|---------|
| 🎓 Free Trial | ₦0 / 1 day | All 70 (try everything) |
| 💡 Essential | ₦3,500/mo ($4) | All 70 + 200MB uploads |
| ⚡ Professional | ₦8,500/mo ($10) | All 70 + Unlimited + ML |
| 🏢 Enterprise | ₦25,000/mo ($30) | All 70 + RBAC + Compliance + DR |

**₦0 AI API. Free forever.**

### 🏢 HMG Ecosystem

DataFlow Studio is part of the HMG Concepts ecosystem:

- 🏢 **[HMG Concepts](https://hmgconcepts.pages.dev/)** — Parent company (est. 2015)
- 🎓 **[HMG Academy](https://hmgacademy.pages.dev/)** — Hosts DataFlow Studio (this site)
- 💻 **[HMG Technologies](https://hmgtechnologies.pages.dev/)** — AI tools & dashboards
- 📢 **[HMG Media](https://hmgmedia.pages.dev/)** — Content production
- ✝️ **[HMG Gospel](https://hmggospel.pages.dev/)** — FaithTech tools

### 📞 Contact

- 🌐 **Builder:** [cssadewale.pages.dev](https://cssadewale.pages.dev/)
- 🎓 **Academy:** [hmgacademy.pages.dev](https://hmgacademy.pages.dev/)
- 🏢 **Company:** [hmgconcepts.pages.dev](https://hmgconcepts.pages.dev/)
- 📧 **Email:** adeagboadewalesamson@gmail.com
- 📞 **WhatsApp:** +234 810 086 6322

### 📜 License

MIT License — Copyright (c) 2026 Adewale Samson Adeagbo / HMG Academy / HMG Concepts

---

**Built with ❤️ in Lagos · 100% Free Tools · No AI API Required · 100% Client-Side**

© 2026 HMG Academy (Subsidiary of HMG Concepts) · Lagos, Nigeria
