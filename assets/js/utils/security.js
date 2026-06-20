/* ═══════════════════════════════════════════════════════════════════════════════
   DataFlow Studio v14.0 — HMG Academy Ecosystem Edition
   Security & License Gating
   Prevents subscription bypass and unauthorised module access
   ═══════════════════════════════════════════════════════════════════════════════ */

const Security = (() => {
  // Server-side license validation (HMAC-signed) would be ideal;
  // For a 100% client-side app we use multi-layer defensive checks.
  // The goal is to make casual tampering difficult, not impossible.

  // Tier definitions (each module requires a tier)
  const TIER_MAP = {
    // Pillar 1 — Ingest & Prep (FREE)
    ingest: 'free', ingest_batch: 'free', grid: 'free', sim: 'free',
    profile: 'free', profiler_pro: 'free', prof_adv: 'free',

    // Pillar 2 — Clean & Transform (FREE)
    quality: 'free', clean: 'free', transform: 'free', join: 'free',
    search: 'free',

    // Pillar 2 — Pro
    imbalance: 'pro', diff: 'pro', api_connector: 'pro',

    // Pillar 3 — Visual (mixed)
    visual: 'free', pivot: 'pro', dashboard: 'pro', whatif: 'pro',
    adv_charts: 'pro', pygwalker: 'pro', geospatial: 'pro',

    // Pillar 4 — Stats & SQL
    stats: 'pro', timeseries: 'pro', forecast: 'pro', anomaly: 'pro',
    text_nlp: 'pro', sql: 'pro',

    // Pillar 5 — ML
    feature_sel: 'pro', feature: 'pro', ml: 'pro', explain: 'pro',
    model_registry: 'pro', nnplay: 'enterprise',

    // Pillar 6 — Reporting
    notebook: 'pro', report: 'pro', story: 'pro', share: 'free',
    api_doc: 'pro', export: 'free',

    // Pillar 7 — Enterprise
    workflow: 'enterprise', lineage: 'enterprise', contracts: 'enterprise',
    expectations: 'enterprise', privacy: 'pro', govern: 'enterprise',
    catalog: 'enterprise', monitor: 'enterprise', scheduler: 'enterprise',
    versions: 'enterprise', retention: 'enterprise', disaster: 'enterprise',
    collab: 'pro',

    // Pillar 8 — Copilot
    sql_builder: 'pro', query_copilot: 'pro', hypothesis_pro: 'pro',
    data_validator: 'enterprise', outlier_3d: 'enterprise',
    model_compare: 'pro', synthetic_eval: 'enterprise', audit_export_ci: 'enterprise',

    // Pillar 9 — EdTech (HMG)
    tutor: 'free', learn_hub: 'free', roadmap: 'free', tutorials: 'free',
    projects: 'free', glossary: 'free', quiz: 'free', settings: 'free',
    help: 'free'
  };

  const TIER_NAMES = { free: 'Free Trial', essential: 'Essential', pro: 'Professional', enterprise: 'Enterprise' };
  const TIER_RANK = { free: 0, essential: 1, pro: 2, enterprise: 3 };

  // Obfuscated simple integrity hash (not real cryptography; deterrent only).
  // Prevents trivial replacement of "free" with "enterprise" in localStorage.
  function integrityHash(str) {
    let h = 5381;
    for (let i = 0; i < str.length; i++) {
      h = ((h << 5) + h) + str.charCodeAt(i);
      h = h & 0xFFFFFFFF;
    }
    return (h >>> 0).toString(16);
  }

  // Current tier is signed with both tier and a "challenge" that changes daily.
  // A determined attacker can still bypass this, but it stops casual tampering.
  function sign(tier) {
    const day = new Date().toISOString().slice(0, 10);
    const nonce = integrityHash('hmg-academy-' + tier + '-' + day);
    return tier + '.' + nonce;
  }

  function verify(signed, claimedTier) {
    if (!signed) return false;
    const [t, nonce] = signed.split('.');
    if (t !== claimedTier) return false;
    const day = new Date().toISOString().slice(0, 10);
    const expected = integrityHash('hmg-academy-' + claimedTier + '-' + day);
    return nonce === expected;
  }

  function getTier() {
    // Always start at 'free' — there is no client-side way to upgrade
    // without payment verification from the server. To upgrade, contact
    // HMG Academy (see contact.html) for a real subscription.
    return 'free';
  }

  function canAccess(moduleId) {
    const required = TIER_MAP[moduleId] || 'free';
    const userTier = getTier();
    return TIER_RANK[userTier] >= TIER_RANK[required];
  }

  function showUpgradePrompt(moduleName, requiredTier) {
    // Remove any existing overlay
    document.getElementById('upgradeOverlay')?.remove();
    const overlay = document.createElement('div');
    overlay.id = 'upgradeOverlay';
    overlay.className = 'upgrade-overlay open';
    overlay.innerHTML = `
      <div class="upgrade-modal">
        <div style="font-size:3rem;margin-bottom:1rem">🔒</div>
        <h2>Upgrade Required</h2>
        <p><strong>${moduleName}</strong> requires the <strong style="color:var(--hmg-gold)">${TIER_NAMES[requiredTier]}</strong> plan.</p>
        <p class="text-muted">You're currently on the <strong>${TIER_NAMES[getTier()]}</strong> plan (1-day trial).</p>
        <p class="text-muted">To unlock this module, contact HMG Academy to upgrade your subscription.</p>
        <div class="upgrade-modal-actions">
          <a href="./pricing.html" class="btn btn-primary">💳 See Plans</a>
          <a href="./contact.html" class="btn btn-secondary">📬 Contact HMG</a>
          <button class="btn btn-ghost" onclick="document.getElementById('upgradeOverlay').remove()">Close</button>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  // Simple anti-tampering checks (deterrent, not real security)
  function integrityCheck() {
    const checks = [];

    // Check 1: No console manipulation of modules list
    if (typeof window.Core === 'undefined') {
      checks.push({ ok: false, name: 'Core engine loaded' });
    } else {
      checks.push({ ok: true, name: 'Core engine loaded' });
    }

    // Check 2: Storage namespace intact
    try {
      const k = '__integrity_test__';
      localStorage.setItem(k, '1');
      localStorage.removeItem(k);
      checks.push({ ok: true, name: 'Storage intact' });
    } catch (e) {
      checks.push({ ok: false, name: 'Storage intact' });
    }

    // Check 3: Required CDN libraries loaded
    const libs = ['Papa', 'XLSX', 'aq', 'Plotly', 'CryptoJS', 'L'];
    libs.forEach(lib => {
      checks.push({ ok: typeof window[lib] !== 'undefined', name: `${lib} loaded` });
    });

    return checks;
  }

  // Prevent direct URL injection (e.g. ?module=enterprise)
  function sanitizeModuleId(id) {
    // Allow only alphanumeric + underscore, length 3-30
    return /^[a-z_]{3,30}$/.test(id) ? id : 'home';
  }

  // Rate-limit sensitive operations
  const rateLimits = {};
  function checkRateLimit(operation, maxPerMinute = 30) {
    const now = Date.now();
    if (!rateLimits[operation]) rateLimits[operation] = [];
    rateLimits[operation] = rateLimits[operation].filter(t => now - t < 60000);
    if (rateLimits[operation].length >= maxPerMinute) return false;
    rateLimits[operation].push(now);
    return true;
  }

  window.Security = {
    TIER_MAP, TIER_NAMES, TIER_RANK,
    canAccess, showUpgradePrompt, getTier,
    integrityCheck, sanitizeModuleId, checkRateLimit
  };

  return window.Security;
})();
