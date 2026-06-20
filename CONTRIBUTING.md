# Contributing to DataFlow Studio v14.0 — HMG Academy Edition

Thank you for your interest in contributing! DataFlow Studio is part of the broader HMG Concepts ecosystem.

## 🌟 Ways to Contribute

- 🐛 **Report Bugs** — Open issues in the broader HMG ecosystem
- 💡 **Suggest Features** — Especially HMG Academy integrations
- 🌍 **Translations** — Yorùbá, Igbo, Hausa, French, Spanish, etc.
- 📝 **Documentation** — Improve clarity
- 💻 **Code** — New modules, bug fixes, performance

## 🎯 Platform Boundaries

**Important:** DataFlow Studio itself is a **closed-source product** of HMG Academy (subsidiary of HMG Concepts). It is provided as-is to users and does not accept code contributions for the platform itself.

However, the broader HMG Concepts ecosystem welcomes contributions:
- 🏢 HMG Concepts: https://hmgconcepts.pages.dev/
- 🎓 HMG Academy: https://hmgacademy.pages.dev/
- 💻 HMG Technologies: https://hmgtechnologies.pages.dev/
- 📢 HMG Media: https://hmgmedia.pages.dev/
- ✝️ HMG Gospel: https://hmggospel.pages.dev/

## 🚀 Quick Start (for broader HMG ecosystem)

```bash
git clone https://github.com/hmgacademyhub/datascienceflow-studio
cd datascienceflow-studio/dswf\ v3
# Edit files
# Test locally: python3 -m http.server 8000
git add .
git commit -m "feat: new module"
git push
```

## 📋 Coding Standards

- ES2022+ syntax
- 2-space indentation
- `const`/`let` only, no `var`
- Semantic HTML5
- ARIA labels for accessibility
- CSS variables for theming
- No AI API (rule-based only)

## 🧪 Testing

Test in Chrome, Firefox, Safari. Verify:
- All 70 modules load
- Charts render
- PWA installs
- Service Worker activates
- `.ipynb` exports open in Jupyter

## 📦 Adding a New Module

1. Add to `MODULE_CATALOG` in `modules.js`
2. Add sidebar link in `app.html`
3. Add render function in `modules.js`
4. Register in dispatcher
5. Update `features.html`, `modules.html`, and `README.md`
6. Test all interactions

## 🎯 Module Ideas

- Survival Analysis
- Causal Inference
- Bayesian Networks
- Audio Analysis
- Image OCR
- Time-series Forecasting (ARIMA, Prophet-like)

---

© 2026 HMG Academy · Built by Adewale Samson Adeagbo · Lagos, Nigeria
