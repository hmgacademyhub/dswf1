# Security Policy

## 🔒 Security Overview

DataFlow Studio v14.0 — HMG Academy Edition is built with privacy and security as core principles:

- **100% Client-Side** — No data leaves your browser. No server uploads. No API calls.
- **No Telemetry** — No tracking, no analytics by default
- **No Cookies** — Only browser-native localStorage for preferences
- **Sandboxed Execution** — All JavaScript runs in browser sandbox
- **Open Source Style** — Auditable by anyone

## 🛡️ Multi-Layer Security Architecture

DataFlow v14.0 includes:

1. **Content Security Policy (CSP)** — Restricts script sources to known CDN
2. **Security Headers** — X-Frame-Options, X-Content-Type-Options, Referrer-Policy
3. **License Tier Gating** — Premium modules require explicit upgrade
4. **Integrity Check** — Verifies required libraries are loaded
5. **Module Sanitization** — Invalid module IDs rejected
6. **Rate Limiting** — Prevents brute-force operations

## 🔐 Subscription / License Bypass Prevention

DataFlow Studio implements **multi-layer protection** against subscription bypass:

### Client-Side (Deterrent Only)
- All premium modules check `Security.canAccess(moduleId)` before rendering
- Bypassing via localStorage tampering shows a "🔒 Upgrade Required" overlay
- Module IDs are sanitized to prevent injection
- Daily-rotating signature prevents simple value replacement

### Server-Side (Authoritative)
Subscription tokens are **ultimately managed by HMG Academy servers**. The browser-side checks are deterrents; commercial use without subscription violates the MIT License.

To upgrade legitimately:
- 📞 WhatsApp: +234 810 086 6322
- 📧 Email: adeagboadewalesamson@gmail.com
- 📋 Contact: [contact.html](./contact.html)

## 🛡️ Reporting Vulnerabilities

If you discover a security vulnerability, please report responsibly:
- **Email:** adeagboadewalesamson@gmail.com (subject: [SECURITY])
- **WhatsApp:** +234 810 086 6322 (urgent only)

Please **do not** open public GitHub issues for security vulnerabilities.

We will respond within 48 hours.

## 🔐 Security Headers

All deployments include:

| Header | Value |
|--------|-------|
| X-Content-Type-Options | nosniff |
| X-Frame-Options | SAMEORIGIN |
| X-XSS-Protection | 1; mode=block |
| Referrer-Policy | strict-origin-when-cross-origin |
| Permissions-Policy | geolocation=(), microphone=(), camera=() |
| Strict-Transport-Security | max-age=31536000; includeSubDomains |
| Content-Security-Policy | Strict (no inline scripts from non-CDN) |

## ✅ Best Practices for Deployment

1. Always deploy over HTTPS (all three platforms provide free HTTPS)
2. Verify CDN library versions are pinned in `app.html`
3. Don't expose subscription tokens in client code
4. Audit custom modifications before deployment
5. Monitor usage via server-side logs (not in browser)
6. Keep license tier validation server-side for production
7. Update Content Security Policy for your domain

## 🧪 Auditing

Open source style and auditable. Key files to review:
- `app.html` — Main application
- `assets/js/app.js` — Initialization
- `assets/js/core.js` — State management
- `assets/js/modules.js` — Module renderers
- `assets/js/utils/security.js` — License tier gating
- `assets/js/utils/*.js` — Utilities

## 📜 Compliance

DataFlow helps achieve:
- **GDPR** (General Data Protection Regulation)
- **NDPR** (Nigeria Data Protection Regulation)
- **HIPAA**-friendly features (privacy masking)
- **SOC2** audit trails

**Compliance is your responsibility** — DataFlow provides tools.

## 📞 Contact

📧 adeagboadewalesamson@gmail.com

---

© 2026 HMG Academy · Licensed under MIT
