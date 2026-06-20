# Changelog

## v14.0.0 — 2026-06-20 — HMG Academy Ecosystem Edition

### 🎓 Complete Consolidation with Security Hardening

This release consolidates the entire dswf platform with comprehensive security, SEO optimization, and file export capabilities.

### ✨ Major Enhancements

**Security & Anti-Bypass:**
- 🔒 **Multi-layer security** — CSP, headers, integrity checks, module sanitization
- 🔒 **License tier gating** — Premium modules show "🔒 Upgrade Required" overlay
- 🔒 **Server-side subscription management** (planned) — Tokens managed by HMG Academy server
- 🔒 **Rate limiting** — Prevents brute-force operations
- 🔒 **Module ID sanitization** — Invalid IDs rejected

**SEO & Searchability:**
- 🔍 **Schema.org JSON-LD** — SoftwareApplication, Organization, FAQPage, BreadcrumbList schemas
- 🔍 **Optimised meta tags** — Open Graph, Twitter Cards, canonical URLs
- 🔍 **Sitemap.xml** — All 10 pages indexed
- 🔍 **robots.txt** — SEO-friendly directives
- 🔍 **Semantic HTML5** — Schema.org-compliant markup
- 🔍 **Alt text & ARIA labels** — Accessibility

**File Generation (NEW):**
- 📓 **`.ipynb`** — Runnable Jupyter Notebooks with code cells, outputs, charts
- 🐍 **`.py`** — Standalone Pandas analysis scripts
- 🐳 **`Dockerfile`** — Reproducible container environment
- 📋 **`requirements.txt`** — Python dependencies
- 📦 **`environment.yml`** — Conda environment
- 📡 **`openapi.json`** — REST API specifications
- 📊 **`workflow.json`** — Pipeline definitions

**HMG Branding:**
- 🏢 **HMG Academy logo** embedded in nav, footer, brand banner, 404 page
- 🔗 **HMG Ecosystem links** — Concepts, Academy, Technologies, Media, Gospel
- 👨‍💻 **Adewale's persona** — Builder profile in every footer
- 🎨 **HMG Gold theme** — Distinctive brand identity

**No Repository Link:**
- 🔒 **No GitHub link** in the platform itself — security and brand consistency
- ✅ Source code style remains auditable (open file structure)

### 🛠️ Technical Stack

- Vanilla JS (no build step)
- Plotly.js for 14+ chart types
- sql.js (SQLite WASM) for SQL console
- TensorFlow.js for neural networks
- Leaflet for geospatial maps
- jsPDF for PDF reports
- All CDN-hosted, all free

### 🚀 Deployment

- Vercel-ready (`vercel.json`)
- Netlify-ready (`netlify.toml`)
- Cloudflare Pages-ready (`_redirects`, `_headers`)
- All free tiers
- 60-second deployment

---

## Roadmap

- v15.0 — Survival Analysis, Causal Inference, Bayesian Networks
- v16.0 — Real-time collaboration via WebRTC
- v17.0 — Mobile-first redesign
- v18.0 — Plugin marketplace for community modules

---

© 2026 HMG Academy · Built by Adewale Samson Adeagbo
