# 🚀 DataFlow Studio v14.0 — Complete Deployment Guide

**HMG Academy Edition · 70 Browser-Native Modules · 100% Client-Side · Secured**

This guide provides **step-by-step instructions** to deploy DataFlow Studio to **Vercel, Netlify, and Cloudflare Pages** — all on free tiers.

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Prerequisites](#prerequisites)
3. [Deploy to Vercel](#deploy-to-vercel)
4. [Deploy to Netlify](#deploy-to-netlify)
5. [Deploy to Cloudflare Pages](#deploy-to-cloudflare-pages)
6. [Custom Domain Setup](#custom-domain-setup)
7. [Post-Deployment](#post-deployment)
8. [Security Checklist](#security-checklist)
9. [Troubleshooting](#troubleshooting)

---

## Overview

DataFlow Studio v14.0 is a **pure static site**. No server-side code, no build process, no runtime. Just HTML, CSS, and JavaScript files.

**Deployment time: 60 seconds. Cost: $0 forever.**

---

## Prerequisites

1. The `dswf v3/` folder (downloaded from your workspace)
2. **GitHub account** (recommended for auto-deploys)
3. **Account on one of:** Vercel, Netlify, or Cloudflare Pages (all free)

---

## Deploy to Vercel (Recommended)

Vercel offers the fastest deployment experience.

### Method A: Via Dashboard (Easiest — 30 seconds)

1. Go to [vercel.com/new](https://vercel.com/new)
2. **Drag the `dswf v3/` folder** onto the upload area
   - OR click "Import Git Repository" and select your GitHub repo
3. Configure:
   - **Project Name:** `dataflow-studio` (or your choice)
   - **Framework Preset:** Other (NOT Next.js, NOT any framework)
   - **Build Command:** (leave empty)
   - **Output Directory:** `.` (root)
   - **Install Command:** (leave empty)
4. Click **Deploy**
5. Wait 30 seconds
6. ✅ Site live at `https://dataflow-studio.vercel.app`

### Method B: Via Vercel CLI

```bash
cd "dswf v3"
npm install -g vercel    # One-time
vercel login
vercel --prod
```

### Method C: GitHub Auto-Deploy

```bash
cd "dswf v3"
git init
git add .
git commit -m "DataFlow Studio v14.0 — HMG Academy Edition"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO.git
git push -u origin main
# Connect repo on Vercel → auto-deploys on every push
```

The included `vercel.json` automatically configures:
- Clean URLs (e.g. `/features` instead of `/features.html`)
- Security headers (CSP, X-Frame-Options, etc.)
- Cache headers (1 year for assets, no cache for HTML)
- URL rewrites (e.g. `/dashboard` → `/app.html`)

---

## Deploy to Netlify

### Method A: Via Dashboard

1. Go to [app.netlify.com/start](https://app.netlify.com/start)
2. Drag `dswf v3/` folder
3. Configure:
   - **Build command:** (leave empty)
   - **Publish directory:** `.` (root)
4. Click **Deploy site**

### Method B: Via Netlify CLI

```bash
cd "dswf v3"
npm install -g netlify-cli
netlify login
netlify deploy --prod --dir=.
```

The included `netlify.toml` is auto-detected.

---

## Deploy to Cloudflare Pages

**Best global CDN performance + unlimited bandwidth on free tier.**

### Method A: Via Dashboard

1. Cloudflare → Workers & Pages → Create application → Pages
2. Connect to Git (or drag folder via "Upload assets")
3. Configure:
   - **Build command:** (leave empty)
   - **Build output directory:** `.` (root)
4. Save and Deploy

### Method B: Via Wrangler

```bash
cd "dswf v3"
npm install -g wrangler
wrangler login
wrangler pages deploy . --project-name=dataflow
```

The `_redirects` and `_headers` files are auto-applied.

---

## 🌐 Local Testing

Test before deploying:

```bash
cd "dswf v3"
python3 -m http.server 8000
# OR
npx serve .
# OR
php -S localhost:8000
```

Open `http://localhost:8000/` in your browser.

---

## Custom Domain Setup

All three platforms support custom domains.

### Vercel
1. Project → Settings → Domains → Add domain
2. Configure DNS (CNAME or A record)
3. HTTPS is automatic

### Netlify
1. Site settings → Domain management → Add custom domain
2. Configure DNS
3. HTTPS automatic (Let's Encrypt)

### Cloudflare (best — if domain already on Cloudflare)
1. Pages project → Custom domains → Set up
2. DNS is automatic if domain is on Cloudflare
3. Done in 30 seconds

---

## Post-Deployment

After successful deployment:

1. **Update SEO URLs:** Edit `sitemap.xml` with your actual domain
2. **Update robots.txt:** Set sitemap URL
3. **Submit sitemap** to [Google Search Console](https://search.google.com/search-console)
4. **Verify PWA:** Chrome DevTools → Application → Manifest should show HMG Academy logo
5. **Run Lighthouse audit:** Aim for 90+ scores
6. **Test structured data:** Use [Google Rich Results Test](https://search.google.com/test/rich-results)

---

## Security Checklist

Production security essentials:

- ✅ Always deploy over HTTPS (all three platforms provide free HTTPS)
- ✅ Verify CDN library versions are pinned in `app.html`
- ✅ Don't expose subscription tokens in client code
- ✅ Audit custom modifications before deployment
- ✅ Monitor usage via server-side logs (not in browser)
- ✅ Keep license tier validation server-side for production
- ✅ Update Content Security Policy for your domain
- ✅ Enable HSTS (already in `netlify.toml` and `_headers`)
- ✅ Test all modules load correctly
- ✅ Test premium module lock works as expected
- ✅ Test `.ipynb` export opens correctly in Jupyter

---

## 💰 Cost Comparison

| Platform | Free Tier | Bandwidth | Build Minutes | Custom Domain |
|----------|-----------|-----------|---------------|---------------|
| Vercel | ✅ Unlimited sites | 100 GB/mo | 6,000 min | Free + HTTPS |
| Netlify | ✅ Unlimited sites | 100 GB/mo | 300 min | Free + HTTPS |
| Cloudflare | ✅ Unlimited sites | **Unlimited** | 500 builds | Free + HTTPS |

**For under 100K visitors/month, all three are 100% FREE.**

---

## 🐛 Troubleshooting

### Charts not rendering
Open DevTools → Network tab → check for failed requests to `cdn.jsdelivr.net`.

### SQL Console not working
`sql.js` requires WebAssembly (all modern browsers support it).

### Service Worker not registering
Service workers require HTTPS (or localhost). All three platforms provide free HTTPS.

### Premium module shows lock
That's intentional. See [pricing.html](./pricing.html) or [contact.html](./contact.html) to upgrade.

### 404 errors on page refresh
Config files handle this. Ensure they're deployed (visible in platform dashboard).

### Bot trying to bypass subscription
The platform detects and blocks premium module access for free tier. Subscription tokens are ultimately verified server-side. Casual tampering with localStorage is detected via integrity checks.

---

## 🔄 Continuous Deployment

All three platforms support automatic deployments from Git:

1. Push code to GitHub
2. Platform detects changes
3. Site rebuilds and deploys automatically (usually <1 minute)
4. Preview deployments for every pull request

---

## ✅ Production Verification Checklist

Before going live:

- [ ] Site deployed successfully
- [ ] HTTPS works (no mixed content warnings)
- [ ] All 11 HTML pages load
- [ ] Landing page → "Launch Studio" → app loads
- [ ] Upload sample data works
- [ ] All charts render
- [ ] AutoML runs without errors
- [ ] SQL Console executes queries
- [ ] `.ipynb` report downloads
- [ ] PDF report generates
- [ ] PWA installable on mobile
- [ ] Lighthouse scores 90+
- [ ] sitemap.xml accessible
- [ ] robots.txt accessible
- [ ] Custom domain configured (if applicable)
- [ ] Search Console verified
- [ ] sitemap.xml submitted
- [ ] Premium modules show lock overlay (security test)

---

**Built by Adewale Samson Adeagbo · HMG Academy (Subsidiary of HMG Concepts) · Lagos, Nigeria**
