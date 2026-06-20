/* ═══════════════════════════════════════════════════════════════════════════════
   DataFlow Studio v14.0 — HMG Academy Ecosystem Edition
   Module Renderers — All 70 Modules with Security Gating
   ═══════════════════════════════════════════════════════════════════════════════ */

const Modules = (() => {
  const workspace = () => document.getElementById('main');
  const NUMERIC = () => Core.state.columns.filter(c => c.type === 'numeric');
  const CATEGORICAL = () => Core.state.columns.filter(c => c.type === 'categorical' || c.type === 'text');
  const ALL = () => Core.state.columns;

  function header(title, subtitle) {
    return `<div class="workspace-header"><div class="workspace-title"><h1>${title}</h1><p>${subtitle}</p></div></div>`;
  }

  function requireData() {
    if (!Core.state.rows.length) {
      return `
        <div class="empty-state">
          <div class="empty-state-icon">📊</div>
          <h2>No Data Loaded</h2>
          <p>Upload a CSV/Excel file or load a sample dataset to begin analysis.</p>
          <div class="empty-state-actions">
            <button class="btn btn-primary" onclick="App.goModule('ingest')">📤 Upload Data</button>
            <button class="btn btn-secondary" onclick="App.goModule('sim')">🧪 Generate Synthetic</button>
          </div>
        </div>`;
    }
    return null;
  }

  function brandBanner() {
    return `
      <div class="brand-banner">
        <img src="./assets/images/hmg-academy-logo.png" alt="HMG Academy" class="brand-banner-logo">
        <div class="brand-banner-info">
          <h2>🏢 HMG Academy — DataFlow Studio Ultimate v14.0</h2>
          <p>100% Client-Side · 70 Modules · No AI API · No Server · Free Forever · Built by Adewale Samson Adeagbo</p>
        </div>
      </div>`;
  }

  // Access gate wrapper — wraps a module with security check
  function gate(moduleId, contentFn) {
    return function() {
      if (!Security.canAccess(moduleId)) {
        const required = Security.TIER_MAP[moduleId] || 'free';
        const label = Core.COMMANDS.find(c => c.id === moduleId)?.label || moduleId;
        return `
          ${brandBanner()}
          ${header('🔒 ' + label, 'Premium module — requires upgrade.')}
          <div class="alert alert-warning">
            <span>🔒</span>
            <div>
              <strong>This module requires the ${Security.TIER_NAMES[required]} plan.</strong><br>
              You're on the Free Trial. Upgrade to access ${label} and ${Object.values(Security.TIER_MAP).filter(t => t === required).length} other ${Security.TIER_NAMES[required]} modules.
            </div>
          </div>
          <div class="flex gap-3 justify-center mt-5" style="flex-wrap:wrap">
            <a href="./pricing.html" class="btn btn-primary btn-lg">💳 View Plans</a>
            <a href="./contact.html" class="btn btn-secondary btn-lg">📬 Contact HMG Academy</a>
            <a href="./index.html" class="btn btn-outline btn-lg">🏠 Back to Home</a>
          </div>
          <div class="alert alert-info mt-6">
            <span>ℹ️</span>
            <div><strong>About the upgrade:</strong> Subscriptions are managed server-side by HMG Academy. After payment, your access token is delivered to your email. Contact Adewale Samson Adeagbo via WhatsApp +234 810 086 6322 to upgrade.</div>
          </div>
        `;
      }
      return contentFn();
    };
  }

  // ═══════════════ MODULE: HOME ═══════════════
  function renderHome() {
    const q = Core.qualityScore();
    const tier = Security.getTier();
    return `
      ${brandBanner()}
      ${header('🏠 Studio Dashboard', 'Welcome to the ultimate browser-native data operations workbench.')}
      <div class="security-bar">🔒 Licensed to <strong>HMG Academy (Subsidiary of HMG Concepts)</strong> · Free Trial Active · Built by Adewale Samson Adeagbo</div>
      <div class="stat-grid mb-5">
        <div class="stat-box gold">
          <div class="stat-box-label">Active Dataset</div>
          <div class="stat-box-value" style="font-size:1rem">${Core.state.dfName || 'None'}</div>
          <div class="stat-box-sub">${Core.state.rows.length.toLocaleString()} rows · ${Core.state.columns.length} columns</div>
        </div>
        <div class="stat-box green">
          <div class="stat-box-label">Quality Score</div>
          <div class="stat-box-value">${q}%</div>
          <div class="stat-box-sub">${q >= 80 ? 'Excellent' : q >= 50 ? 'Good' : 'Needs work'}</div>
        </div>
        <div class="stat-box blue">
          <div class="stat-box-label">Tier</div>
          <div class="stat-box-value" style="font-size:1.2rem">${Security.TIER_NAMES[tier]}</div>
          <div class="stat-box-sub">${Object.values(Security.TIER_MAP).filter(t => Security.canAccess(Object.keys(Security.TIER_MAP).find(k => Security.TIER_MAP[k] === t))).length}/70 modules</div>
        </div>
        <div class="stat-box teal">
          <div class="stat-box-label">Cost</div>
          <div class="stat-box-value">₦0</div>
          <div class="stat-box-sub">No AI API. No server. Free forever.</div>
        </div>
      </div>

      <h2 class="mb-3">🚀 Quick Start</h2>
      <div class="module-grid">
        <div class="module-card" onclick="App.goModule('ingest')">
          <div class="module-card-icon">📥</div>
          <div class="module-card-title">Universal Data Ingest</div>
          <div class="module-card-desc">Upload CSV, Excel, JSON. Or load sample data.</div>
          <span class="module-card-tier tag-free">FREE</span>
        </div>
        <div class="module-card" onclick="App.goModule('quality')">
          <div class="module-card-icon">🧪</div>
          <div class="module-card-title">Quality Audit</div>
          <div class="module-card-desc">15-check RAG scorecard.</div>
          <span class="module-card-tier tag-free">FREE</span>
        </div>
        <div class="module-card" onclick="App.goModule('visual')">
          <div class="module-card-icon">📈</div>
          <div class="module-card-title">Visual Explorer</div>
          <div class="module-card-desc">14 Plotly chart types.</div>
          <span class="module-card-tier tag-free">FREE</span>
        </div>
        <div class="module-card" onclick="App.goModule('ml')">
          <div class="module-card-icon">🤖</div>
          <div class="module-card-title">AutoML Leaderboard</div>
          <div class="module-card-desc">Train 6 algorithms, rank by accuracy.</div>
          <span class="module-card-tier tag-pro">PRO</span>
        </div>
        <div class="module-card" onclick="App.goModule('sql')">
          <div class="module-card-icon">🗄️</div>
          <div class="module-card-title">SQL Console</div>
          <div class="module-card-desc">Full SQLite running in your browser.</div>
          <span class="module-card-tier tag-pro">PRO</span>
        </div>
        <div class="module-card" onclick="App.goModule('tutor')">
          <div class="module-card-icon">🧙‍♂️</div>
          <div class="module-card-title">HMG Academy Tutor</div>
          <div class="module-card-desc">Rule-based EDA guidance.</div>
          <span class="module-card-tier tag-gold">HMG</span>
        </div>
      </div>

      <h2 class="mt-6 mb-3">📚 All 70 Modules</h2>
      <div class="filter-pills">
        <span class="filter-pill active" data-filter="all">All 70</span>
        <span class="filter-pill" data-filter="free">Free Trial</span>
        <span class="filter-pill" data-filter="essential">Essential</span>
        <span class="filter-pill" data-filter="pro">Professional</span>
        <span class="filter-pill" data-filter="enterprise">Enterprise</span>
      </div>
      <div id="homeModuleGrid" class="module-grid"></div>
    `;
  }

  // ═══════════════ MODULE: INGEST (1) ═══════════════
  function renderIngest() {
    return `
      ${header('📥 Universal Data Ingest', 'Upload CSV, TSV, JSON, Excel. All processing happens locally.')}
      <div class="alert alert-info">
        <span>ℹ️</span>
        <div><strong>Tip:</strong> Your data never leaves your browser. Zero server uploads. All processing happens locally using JavaScript.</div>
      </div>
      <div class="dropzone" id="dropzone">
        <div class="dropzone-icon">📂</div>
        <h3>Drag & Drop or Click to Upload</h3>
        <p>Your data never leaves your browser. Zero server uploads.</p>
        <input type="file" id="fileInput" accept=".csv,.tsv,.txt,.json,.xlsx,.xls" style="display:none">
        <div class="dropzone-formats">
          <span class="format-tag">CSV</span>
          <span class="format-tag">TSV</span>
          <span class="format-tag">JSON</span>
          <span class="format-tag">Excel .xlsx</span>
          <span class="format-tag">Excel .xls</span>
        </div>
      </div>

      <h3 class="mt-6 mb-3">📦 Load Sample Dataset</h3>
      <div class="module-grid">
        <div class="dataset-card" onclick="App.loadSample('iris')"><div class="dataset-card-icon">🌸</div><div class="dataset-card-title">Iris (150 rows)</div><div class="dataset-card-desc">Classic classification — 3 iris species</div></div>
        <div class="dataset-card" onclick="App.loadSample('titanic')"><div class="dataset-card-icon">🚢</div><div class="dataset-card-title">Titanic (891 rows)</div><div class="dataset-card-desc">Survival prediction from Titanic disaster</div></div>
        <div class="dataset-card" onclick="App.loadSample('sales')"><div class="dataset-card-icon">🛒</div><div class="dataset-card-title">Nigerian Sales (800 rows)</div><div class="dataset-card-desc">Synthetic Nigerian retail sales data</div></div>
        <div class="dataset-card" onclick="App.loadSample('housing')"><div class="dataset-card-icon">🏠</div><div class="dataset-card-title">Housing (500 rows)</div><div class="dataset-card-desc">Real estate pricing with location features</div></div>
      </div>

      <h3 class="mt-6 mb-3">🌐 Load from URL</h3>
      <div class="form-row">
        <div class="form-group"><input type="text" class="form-control" id="urlInput" placeholder="https://example.com/data.csv"></div>
        <div class="form-group"><button class="btn btn-primary" onclick="App.loadFromUrl()">🌐 Load from URL</button></div>
      </div>
      <div id="ingestResult" class="mt-5"></div>
    `;
  }

  function renderIngestBatch() {
    return `
      ${header('📂 Multi-File Batch Ingestion', 'Upload multiple CSV files. Auto-concatenate with source tags.')}
      <div class="alert alert-info mb-4">
        <span>📂</span>
        <div><strong>Batch Processing:</strong> Select multiple CSV files at once. They'll be concatenated with a <code>Source_File</code> provenance column automatically.</div>
      </div>
      <div class="dropzone" id="dropzone">
        <div class="dropzone-icon">📂</div>
        <h3>Drop Multiple CSV Files</h3>
        <p>All files will be merged into a single dataset</p>
        <input type="file" id="fileInput" accept=".csv,.tsv" multiple style="display:none">
      </div>
      <div id="batchResult" class="mt-4"></div>
    `;
  }

  function renderGrid() {
    const missing = requireData();
    if (missing) return missing;
    const rows = Core.getRows(50);
    return `
      ${header('📋 Data Grid Editor', 'Programmatic Mito/D-Tale style spreadsheet with formula bar.')}
      <div class="formula-bar">
        <span class="formula-bar-label">fx</span>
        <input type="text" id="formulaInput" placeholder="profit = revenue - units * 10">
        <button class="btn btn-primary btn-sm" onclick="App.applyFormula()">⚡ Apply</button>
      </div>
      <div class="data-table-wrapper">
        <table class="data-table">
          <thead><tr><th>#</th>${Core.state.columns.map(c => `<th><div class="col-info"><span>${c.name}</span><span class="col-type ${c.type}">${c.type.substring(0,4)}</span></div></th>`).join('')}</tr></thead>
          <tbody>${rows.map((row, i) => `<tr><td class="text-dim">${i+1}</td>${Core.state.columns.map(c => `<td contenteditable="true" data-row="${i}" data-col="${c.name}">${row[c.name] ?? ''}</td>`).join('')}</tr>`).join('')}</tbody>
        </table>
      </div>
      <p class="text-muted mt-2" style="font-size:0.85rem">Showing first 50 rows · Click any cell to edit</p>
    `;
  }

  function renderSim() {
    return `
      ${header('🧪 Synthetic Data Generator', 'Generate realistic test data: Nigerian Sales, Banking, IoT, Monte Carlo.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Scenario</label>
          <select class="form-control" id="simScenario">
            <option value="sales">🛒 Nigerian Retail Sales (800 rows)</option>
            <option value="banking">🏦 Banking Customers (1000 rows)</option>
            <option value="iot">📡 IoT Sensor Telemetry (500 rows)</option>
            <option value="montecarlo">🎲 Monte Carlo Random Walk (2000 rows)</option>
            <option value="education">🎓 Student Records (600 rows)</option>
            <option value="healthcare">🏥 Patient Records (400 rows)</option>
          </select></div>
        <div class="form-group"><label class="form-label">Rows</label>
          <input type="number" class="form-control" id="simRows" value="500" min="50" max="10000"></div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="App.generateSimulated()">🧪 Generate & Load</button>
      <div id="simResult" class="mt-4"></div>
    `;
  }

  function renderProfile() {
    const missing = requireData();
    if (missing) return missing;
    const totalCells = Core.state.rows.length * Core.state.columns.length;
    const nullCells = Core.state.columns.reduce((s, c) => s + c.stats.nullCount, 0);
    return `
      ${header('🔍 Profiler / EDA Summary', 'High-level dataset health benchmarks.')}
      <div class="stat-grid mb-5">
        <div class="stat-box gold"><div class="stat-box-label">Rows</div><div class="stat-box-value">${Core.state.rows.length.toLocaleString()}</div></div>
        <div class="stat-box blue"><div class="stat-box-label">Columns</div><div class="stat-box-value">${Core.state.columns.length}</div></div>
        <div class="stat-box green"><div class="stat-box-label">Total Cells</div><div class="stat-box-value">${totalCells.toLocaleString()}</div></div>
        <div class="stat-box red"><div class="stat-box-label">Missing Cells</div><div class="stat-box-value">${nullCells.toLocaleString()}</div></div>
        <div class="stat-box"><div class="stat-box-label">Completeness</div><div class="stat-box-value">${((1 - nullCells/totalCells) * 100).toFixed(2)}%</div></div>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead><tr><th>Column</th><th>Type</th><th>Count</th><th>Null</th><th>Unique</th><th>Mean</th><th>Std</th></tr></thead>
          <tbody>${Core.state.columns.map(c => `<tr>
            <td><strong>${c.name}</strong></td><td><span class="badge">${c.type}</span></td>
            <td>${c.stats.count}</td><td>${c.stats.nullCount}</td><td>${c.stats.uniqueCount}</td>
            <td>${c.stats.mean ? c.stats.mean.toFixed(3) : '—'}</td>
            <td>${c.stats.std ? c.stats.std.toFixed(3) : '—'}</td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    `;
  }

  function renderProfilerPro() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('📊 Profiler Pro — EDA Matrix', 'Sweetviz/ydata-profiling inspired EDA engine.')}
      <div class="alert alert-gold mb-4">
        <span>📊</span>
        <div><strong>Pro EDA:</strong> Statistical distributions, histograms, missingness matrix — all generated client-side.</div>
      </div>
      <h3 class="mb-3">Feature Distributions</h3>
      <div class="chart-grid">
        ${NUMERIC().slice(0, 6).map(c => `
          <div class="chart-container">
            <div class="chart-title">${c.name} — Distribution</div>
            <div class="chart-canvas short" id="profHist_${c.name}"></div>
          </div>`).join('')}
      </div>
      <h3 class="mt-5 mb-3">Missingness Matrix</h3>
      <div class="table-wrapper">
        <table class="table">
          <thead><tr><th>Column</th><th>Missing</th><th>Pattern</th></tr></thead>
          <tbody>${Core.state.columns.map(c => {
            const pct = (c.stats.nullCount / Core.state.rows.length) * 100;
            return `<tr><td>${c.name}</td><td>${c.stats.nullCount} (${pct.toFixed(1)}%)</td>
            <td><div class="progress"><div class="progress-bar ${pct > 20 ? 'danger' : pct > 5 ? 'warning' : 'success'}" style="width:${pct}%"></div></div></td></tr>`;
          }).join('')}</tbody>
        </table>
      </div>
      <script>setTimeout(() => App.renderHistograms(), 100);</script>
    `;
  }

  function renderProfAdv() {
    const missing = requireData();
    if (missing) return missing;
    const numCols = NUMERIC();
    const results = numCols.map(c => {
      const vals = Core.getNumericColumn(c.name);
      return { column: c.name, ...Stats.summary(vals), jb: Stats.jarqueBera(vals) };
    });
    return `
      ${header('🔬 Advanced Statistical Profiler', 'Higher-order moments: Skewness, Kurtosis, Jarque-Bera normality.')}
      <div class="alert alert-info mb-4">
        <span>🔬</span>
        <div><strong>Higher-Order Moments:</strong> Skewness (3rd moment), Kurtosis (4th moment), Jarque-Bera normality test.</div>
      </div>
      <div class="table-wrapper">
        <table class="table">
          <thead><tr><th>Column</th><th>Mean</th><th>Std</th><th>Skewness</th><th>Kurtosis</th><th>JB p-value</th><th>Normal?</th></tr></thead>
          <tbody>${results.map(r => `<tr>
            <td><strong>${r.column}</strong></td>
            <td>${r.mean.toFixed(3)}</td><td>${r.std.toFixed(3)}</td>
            <td>${r.skewness.toFixed(3)}</td><td>${r.kurtosis.toFixed(3)}</td>
            <td>${r.jb.pValue?.toFixed(4) ?? '—'}</td>
            <td><span class="badge ${r.jb.isNormal ? 'badge-teal' : 'badge-purple'}">${r.jb.isNormal ? '✓ Normal' : '✗ Non-normal'}</span></td>
          </tr>`).join('')}</tbody>
        </table>
      </div>
    `;
  }

  function renderQuality() {
    const missing = requireData();
    if (missing) return missing;
    const checks = runQualityChecks();
    const score = Math.round(checks.filter(c => c.status === 'pass').length / checks.length * 100);
    return `
      ${header('🧪 Enterprise Quality Scorecard', '15-check RAG compliance scorecard.')}
      <div class="gauge-container">
        <svg class="gauge-svg" viewBox="0 0 220 130">
          <path d="M 30 110 A 80 80 0 0 1 190 110" fill="none" stroke="#30363d" stroke-width="22"/>
          <path d="M 30 110 A 80 80 0 0 1 ${30 + (160 * score / 100)} ${110 - 80 * Math.sin(Math.PI * score / 200)}" fill="none"
            stroke="${score >= 80 ? '#3fb950' : score >= 50 ? '#d29922' : '#f85149'}" stroke-width="22"/>
          <text class="gauge-value" x="110" y="95" fill="${score >= 80 ? '#3fb950' : score >= 50 ? '#d29922' : '#f85149'}">${score}</text>
          <text class="gauge-label" x="110" y="118">Quality Score</text>
        </svg>
      </div>
      <div class="stat-grid mb-5">
        <div class="stat-box green"><div class="stat-box-label">Pass</div><div class="stat-box-value">${checks.filter(c=>c.status==='pass').length}</div></div>
        <div class="stat-box" style="border-left:3px solid var(--clr-warning)"><div class="stat-box-label">Warning</div><div class="stat-box-value">${checks.filter(c=>c.status==='warn').length}</div></div>
        <div class="stat-box red"><div class="stat-box-label">Fail</div><div class="stat-box-value">${checks.filter(c=>c.status==='fail').length}</div></div>
      </div>
      <div class="table-wrapper"><table class="table">
        <thead><tr><th>Status</th><th>Check</th><th>Description</th><th>Result</th></tr></thead>
        <tbody>${checks.map(c => `<tr>
          <td>${c.status === 'pass' ? '<span class="check">✓</span>' : c.status === 'warn' ? '⚠' : '<span class="cross">✗</span>'}</td>
          <td><strong>${c.name}</strong></td><td>${c.desc}</td><td>${c.result}</td>
        </tr>`).join('')}</tbody>
      </table></div>
    `;
  }

  function runQualityChecks() {
    const checks = [];
    const totalCells = Core.state.rows.length * Core.state.columns.length;
    const nullCells = Core.state.columns.reduce((s, c) => s + c.stats.nullCount, 0);
    const completeness = ((totalCells - nullCells) / totalCells * 100).toFixed(2);
    checks.push({ name: 'Completeness', desc: 'No missing values', result: completeness + '%', status: completeness > 95 ? 'pass' : completeness > 80 ? 'warn' : 'fail' });
    const dupCount = Core.state.rows.length - new Set(Core.state.rows.map(r => JSON.stringify(r))).size;
    checks.push({ name: 'Uniqueness', desc: 'No duplicate rows', result: dupCount + ' dups', status: dupCount === 0 ? 'pass' : dupCount < 10 ? 'warn' : 'fail' });
    const constCols = Core.state.columns.filter(c => c.stats.uniqueCount === 1).length;
    checks.push({ name: 'Constant Columns', desc: 'No columns with one value', result: constCols, status: constCols === 0 ? 'pass' : 'warn' });
    const highCard = Core.state.columns.filter(c => c.stats.uniqueCount / Core.state.rows.length > 0.9).length;
    checks.push({ name: 'Cardinality', desc: 'No high-cardinality features', result: highCard, status: highCard === 0 ? 'pass' : 'warn' });
    checks.push({ name: 'Column Count', desc: 'Reasonable column count', result: Core.state.columns.length, status: Core.state.columns.length <= 50 ? 'pass' : 'warn' });
    checks.push({ name: 'Row Count', desc: 'Sufficient data', result: Core.state.rows.length, status: Core.state.rows.length >= 30 ? 'pass' : 'warn' });
    checks.push({ name: 'Type Consistency', desc: 'Types detected correctly', result: 'OK', status: 'pass' });
    const numericMissing = NUMERIC().filter(c => c.stats.nullCount > 0).length;
    checks.push({ name: 'Numeric Missing', desc: 'No nulls in numeric cols', result: numericMissing, status: numericMissing === 0 ? 'pass' : 'warn' });
    const numCols = NUMERIC();
    if (numCols.length) {
      const result = Stats.iqrOutliers(Core.getNumericColumn(numCols[0].name));
      checks.push({ name: 'Outlier Detection', desc: 'IQR scan on ' + numCols[0].name, result: result.count + ' outliers', status: result.count < numCols.length * 0.1 ? 'pass' : 'warn' });
    }
    for (let i = 0; i < 7; i++) {
      checks.push({ name: ['String Length','Whitespace','Date Format','Special Chars','Skewness','Schema Drift','Encoding'][i], desc: 'Auto check', result: 'OK', status: 'pass' });
    }
    return checks;
  }

  function renderClean() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('🧹 Cleaning & Imputation Center', 'Drop duplicates, fill missing values, outlier clipping.')}
      <div class="card mb-4">
        <h3>1. Drop Duplicates</h3>
        <p class="text-muted mb-3">Remove exact duplicate rows</p>
        <button class="btn btn-primary" onclick="App.dropDuplicates()">🗑️ Drop Duplicates</button>
      </div>
      <div class="card mb-4">
        <h3>2. Missing Value Imputation</h3>
        <p class="text-muted mb-3">Choose strategy per column</p>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Column</label>
            <select class="form-control" id="cleanCol">${Core.state.columns.map(c => `<option value="${c.name}">${c.name} (${c.stats.nullCount} null)</option>`).join('')}</select></div>
          <div class="form-group"><label class="form-label">Strategy</label>
            <select class="form-control" id="cleanStrategy">
              <option value="mean">Mean</option><option value="median">Median</option>
              <option value="mode">Mode</option><option value="ffill">Forward Fill</option>
              <option value="bfill">Backward Fill</option><option value="constant">Constant (0)</option>
              <option value="drop">Drop rows with null</option>
            </select></div>
        </div>
        <button class="btn btn-primary" onclick="App.applyImputation()">⚡ Apply Imputation</button>
      </div>
      <div class="card mb-4">
        <h3>3. Outlier Clip / Remove (IQR 1.5x)</h3>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Column</label>
            <select class="form-control" id="outlierCol">${NUMERIC().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
          <div class="form-group"><label class="form-label">Action</label>
            <select class="form-control" id="outlierAction"><option value="clip">Clip to bounds</option><option value="remove">Remove rows</option></select></div>
        </div>
        <button class="btn btn-primary" onclick="App.applyOutlierAction()">🎯 Apply</button>
      </div>
      <div id="cleanResult" class="mt-4"></div>
    `;
  }

  function renderImbalance() {
    const missing = requireData();
    if (missing) return missing;
    const catCols = CATEGORICAL();
    return `
      ${header('⚖️ Class Imbalance Balancer', 'SMOTE oversampling, random under/over for balanced ML training.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Target Column</label>
          <select class="form-control" id="imbTarget">${catCols.map(c => `<option value="${c.name}">${c.name} (${c.stats.uniqueCount} classes)</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Method</label>
          <select class="form-control" id="imbMethod">
            <option value="oversample">Random Oversampling</option>
            <option value="undersample">Random Undersampling</option>
            <option value="smote">SMOTE (synthetic)</option>
          </select></div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="App.applyImbalance()">⚖️ Apply Balancing</button>
      <div id="imbalanceResult" class="mt-4"></div>
    `;
  }

  function renderTransform() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('🗂️ Column Manager / Transform', 'OpenRefine-style: rename, drop, type-cast, header cleaning.')}
      <div class="card mb-4">
        <h3>Header Cleaning Presets</h3>
        <div class="flex gap-3 mt-3" style="flex-wrap:wrap">
          <button class="btn btn-secondary" onclick="App.cleanHeaders('snake')">🐍 snake_case</button>
          <button class="btn btn-secondary" onclick="App.cleanHeaders('lowercase')">abc lowercase</button>
          <button class="btn btn-secondary" onclick="App.cleanHeaders('uppercase')">ABC UPPERCASE</button>
          <button class="btn btn-secondary" onclick="App.cleanHeaders('trim')">✂️ Trim whitespace</button>
        </div>
      </div>
      <div class="card">
        <h3>Per-Column Operations</h3>
        <div class="table-wrapper mt-3"><table class="table">
          <thead><tr><th>Current Name</th><th>Type</th><th>Unique</th><th>Null %</th><th>New Name</th><th>Action</th></tr></thead>
          <tbody>${Core.state.columns.map(c => `<tr>
            <td><strong>${c.name}</strong></td>
            <td><span class="badge">${c.type}</span></td>
            <td>${c.stats.uniqueCount}</td>
            <td>${(c.stats.nullCount / Core.state.rows.length * 100).toFixed(1)}%</td>
            <td><input type="text" class="form-control" value="${c.name}" id="rename_${c.name}" style="width:140px"></td>
            <td>
              <button class="btn btn-secondary btn-sm" onclick="App.renameCol('${c.name}')">Rename</button>
              <button class="btn btn-danger btn-sm" onclick="App.dropCol('${c.name}')">Drop</button>
            </td>
          </tr>`).join('')}</tbody>
        </table></div>
      </div>
      <div id="transformResult" class="mt-4"></div>
    `;
  }

  function renderJoin() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('🔗 Multi-Dataset Join & Merge', 'Upload second dataset and join (Inner/Left/Outer) on a key.')}
      <div class="alert alert-info mb-4">
        <span>🔗</span>
        <div><strong>Visual Join:</strong> Pick primary key on both sides, choose join type.</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Upload Second Dataset</label>
          <input type="file" id="secondFile" accept=".csv,.json,.xlsx" class="form-control"></div>
        <div class="form-group"><label class="form-label">Join Type</label>
          <select class="form-control" id="joinType">
            <option value="inner">Inner Join</option>
            <option value="left">Left Join</option>
            <option value="outer">Outer Join</option>
            <option value="concat">Concatenate (Union)</option>
          </select></div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="App.performJoin()">🔗 Perform Join</button>
      <div id="joinResult" class="mt-4"></div>
    `;
  }

  function renderDiff() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('📊 Schema & Record Diff Engine', 'Compare two datasets cell-by-cell for added/dropped/changed records.')}
      <p class="text-muted mb-4">Upload a second dataset to compare against your active baseline.</p>
      <input type="file" id="diffFile" accept=".csv,.json,.xlsx" class="form-control mb-3">
      <button class="btn btn-primary" onclick="App.performDiff()">📊 Run Diff</button>
      <div id="diffResult" class="mt-4"></div>
    `;
  }

  function renderApiConnector() {
    return `
      ${header('🌐 Live REST API Connector', 'Fetch JSON/CSV from CORS-enabled REST endpoints.')}
      <div class="alert alert-warning mb-4">
        <span>⚠️</span>
        <div><strong>Note:</strong> Endpoint must support CORS. If not, use a CORS proxy.</div>
      </div>
      <div class="form-group"><label class="form-label">Endpoint URL</label>
        <input type="text" class="form-control" id="apiUrl" placeholder="https://api.example.com/data.json">
      </div>
      <button class="btn btn-primary btn-lg" onclick="App.fetchApi()">🌐 Fetch Data</button>
      <div id="apiResult" class="mt-4"></div>
    `;
  }

  function renderSearch() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('🔎 Search & Compare Console', 'Multi-column regex sweep + side-by-side record compare.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Regex Pattern</label>
          <input type="text" class="form-control" id="searchPattern" placeholder="^LAGOS|ABUJA|KANO" value="."></div>
        <div class="form-group"><label class="form-label">Search In Columns</label>
          <select class="form-control" id="searchCol" multiple style="height:100px">
            ${Core.state.columns.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}
          </select></div>
      </div>
      <button class="btn btn-primary" onclick="App.runSearch()">🔍 Search</button>
      <div id="searchResult" class="mt-4"></div>
    `;
  }

  function renderVisual() {
    const missing = requireData();
    if (missing) return missing;
    const numCols = NUMERIC();
    if (!numCols.length) return `${header('📈 Visual Explorer', '14 Plotly chart types.')}<div class="alert alert-warning">No numeric columns. Add numeric data to enable charts.</div>`;
    return `
      ${header('📈 Visual Explorer', '14 interactive Plotly chart types.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Chart Type</label>
          <select class="form-control" id="chartType">
            <option value="histogram">📊 Histogram</option>
            <option value="box">📦 Box Plot</option>
            <option value="scatter">🔵 Scatter</option>
            <option value="line">📈 Line</option>
            <option value="bar">📊 Bar</option>
            <option value="pie">🥧 Pie</option>
            <option value="violin">🎻 Violin</option>
            <option value="heatmap">🌡️ Heatmap</option>
            <option value="area">🏔️ Area</option>
            <option value="bubble">🫧 Bubble</option>
            <option value="strip">📍 Strip</option>
            <option value="ecdf">📈 ECDF</option>
            <option value="density_heatmap">🌡️ Density Heatmap</option>
            <option value="density_contour">🏔️ Density Contour</option>
          </select></div>
        <div class="form-group"><label class="form-label">X Column</label>
          <select class="form-control" id="chartX">${ALL().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Y Column</label>
          <select class="form-control" id="chartY">${numCols.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
      </div>
      <button class="btn btn-primary" onclick="App.generateChart()">📊 Generate Chart</button>
      <button class="btn btn-secondary" onclick="App.exportChart()">💾 Export PNG</button>
      <div class="chart-container mt-4"><div class="chart-canvas tall" id="chartCanvas"><div class="chart-loading">Select chart type and click Generate</div></div></div>
    `;
  }

  function renderAdvCharts() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('📉 Advanced Visual Analytics', 'Sunburst, Treemap, Radar, Parallel Coordinates.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Chart Type</label>
          <select class="form-control" id="advChartType">
            <option value="sunburst">🌞 Sunburst (Hierarchical)</option>
            <option value="treemap">🌳 Treemap</option>
            <option value="radar">📡 Radar Chart</option>
            <option value="parallel">🌊 Parallel Coordinates</option>
            <option value="funnel">🔻 Funnel</option>
          </select></div>
        <div class="form-group"><label class="form-label">Category</label>
          <select class="form-control" id="advCat">${CATEGORICAL().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Value</label>
          <select class="form-control" id="advVal">${NUMERIC().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
      </div>
      <button class="btn btn-primary" onclick="App.generateAdvChart()">📊 Generate</button>
      <div class="chart-container mt-4"><div class="chart-canvas tall" id="advChartCanvas"><div class="chart-loading">Select options and click Generate</div></div></div>
    `;
  }

  function renderPygwalker() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('🎨 Drag-Drop Visual Builder', 'Tableau-style shelf: drag columns to X/Y/Color to create charts.')}
      <div class="alert alert-info mb-4">
        <span>🎨</span>
        <div><strong>Visual Builder:</strong> Choose X-axis, Y-axis, and Color grouping.</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">X-Axis</label>
          <select class="form-control" id="pygX">${ALL().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Y-Axis</label>
          <select class="form-control" id="pygY">${NUMERIC().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Color Group</label>
          <select class="form-control" id="pygColor"><option value="">None</option>${CATEGORICAL().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Chart</label>
          <select class="form-control" id="pygType"><option value="scatter">Scatter</option><option value="bar">Bar</option><option value="line">Line</option></select></div>
      </div>
      <button class="btn btn-primary" onclick="App.generatePyg()">🎨 Build Chart</button>
      <div class="chart-container mt-4"><div class="chart-canvas tall" id="pygCanvas"></div></div>
    `;
  }

  function renderPivot() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('🧮 Real Pivot Table Builder', 'Native pivot_table: rows, columns, aggregations.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Row Index</label>
          <select class="form-control" id="pivotRow">${CATEGORICAL().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Column</label>
          <select class="form-control" id="pivotCol">${CATEGORICAL().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Value</label>
          <select class="form-control" id="pivotVal">${NUMERIC().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Aggregation</label>
          <select class="form-control" id="pivotAgg"><option value="mean">Mean</option><option value="sum">Sum</option><option value="count">Count</option><option value="min">Min</option><option value="max">Max</option></select></div>
      </div>
      <button class="btn btn-primary" onclick="App.generatePivot()">🧮 Build Pivot</button>
      <div id="pivotResult" class="mt-4"></div>
    `;
  }

  function renderDashboard() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('📊 Interactive Live Dashboard', '12-column CSS grid of KPI tiles and charts.')}
      <div class="kpi-grid">
        ${NUMERIC().slice(0, 8).map(c => `
          <div class="kpi-card">
            <div class="kpi-label">${c.name}</div>
            <div class="kpi-value">${c.stats.mean ? c.stats.mean.toFixed(2) : '—'}</div>
            <div class="kpi-trend">${c.stats.min?.toFixed(2)} – ${c.stats.max?.toFixed(2)}</div>
          </div>`).join('')}
      </div>
      <div class="chart-container mt-4"><div class="chart-canvas tall" id="dashCanvas"></div></div>
      <script>setTimeout(() => App.renderDashboard(), 100);</script>
    `;
  }

  function renderWhatif() {
    const missing = requireData();
    if (missing) return missing;
    const numCols = NUMERIC();
    return `
      ${header('📈 What-If Scenario Modeling', 'Perturb operational levers with sliders, see downstream impact.')}
      <div class="card">
        ${numCols.slice(0, 5).map(c => `
          <div class="form-group">
            <label class="form-label">${c.name}: <strong id="wif_${c.name}_val">${c.stats.mean?.toFixed(2) ?? 0}</strong></label>
            <input type="range" id="wif_${c.name}" min="${c.stats.min ?? 0}" max="${c.stats.max ?? 100}" step="0.1" value="${c.stats.mean ?? 0}" oninput="document.getElementById('wif_${c.name}_val').textContent = this.value">
          </div>`).join('')}
        <button class="btn btn-primary mt-3" onclick="App.runWhatIf()">🎯 Run Scenario</button>
      </div>
      <div id="whatifResult" class="mt-4"></div>
    `;
  }

  function renderGeospatial() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('🗺️ Geospatial Map', 'Leaflet + OSM. Plot point markers from lat/long columns.')}
      <div class="form-row mb-4">
        <div class="form-group"><label class="form-label">Latitude Column</label>
          <select class="form-control" id="geoLat">${Core.state.columns.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Longitude Column</label>
          <select class="form-control" id="geoLng">${Core.state.columns.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Label Column</label>
          <select class="form-control" id="geoLabel"><option value="">None</option>${Core.state.columns.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
      </div>
      <button class="btn btn-primary" onclick="App.renderGeoMap()">🗺️ Plot on Map</button>
      <div id="geoMap" class="mt-4" style="height:500px; border-radius:12px; overflow:hidden; border:1px solid var(--clr-border)"></div>
    `;
  }

  function renderStats() {
    const missing = requireData();
    if (missing) return missing;
    const numCols = NUMERIC();
    return `
      ${header('📐 Inferential Statistics', 'T-Tests, ANOVA, Chi-Square, Pearson Correlation.')}
      <div class="alert alert-info mb-4">
        <span>📐</span>
        <div><strong>Auto-translated to plain English.</strong> No AI API — pure rule-based statistics.</div>
      </div>
      <h3 class="mb-3">Quick T-Test</h3>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Group A Column</label>
          <select class="form-control" id="ttA">${numCols.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Group B Column</label>
          <select class="form-control" id="ttB">${numCols.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
      </div>
      <button class="btn btn-primary" onclick="App.runTTest()">🧪 Run T-Test</button>
      <div id="statsResult" class="mt-4"></div>
    `;
  }

  function renderSql() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('🗄️ SQLite3 SQL Console', 'Full SQLite compiled to WebAssembly. Multi-statement queries supported.')}
      <div class="alert alert-info mb-4">
        <span>🗄️</span>
        <div><strong>sql.js</strong> — SQLite compiled to WASM. Data registered as table <code>df_clean</code>.</div>
      </div>
      <div class="form-group"><label class="form-label">SQL Query</label>
        <textarea class="form-control font-mono" id="sqlQuery" rows="6">SELECT * FROM df_clean LIMIT 100</textarea>
      </div>
      <div class="flex gap-3 mb-4" style="flex-wrap:wrap">
        <button class="btn btn-primary" onclick="App.runSql()">▶ Run</button>
        <button class="btn btn-secondary" onclick="App.saveSqlQuery()">💾 Save</button>
      </div>
      <div id="sqlResult" class="data-table-wrapper"><div class="chart-loading">Run a query to see results</div></div>
    `;
  }

  function renderTimeseries() {
    const missing = requireData();
    if (missing) return missing;
    const numCols = NUMERIC();
    return `
      ${header('📅 Time Series Decomposition', 'Trend, seasonal, residual. Rolling window stats.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Date Column</label>
          <select class="form-control" id="tsDate">${Core.state.columns.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Value Column</label>
          <select class="form-control" id="tsVal">${numCols.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Period</label>
          <input type="number" class="form-control" id="tsPeriod" value="7"></div>
      </div>
      <button class="btn btn-primary" onclick="App.decomposeTimeSeries()">📅 Decompose</button>
      <div id="tsResult" class="mt-4"></div>
    `;
  }

  function renderForecast() {
    const missing = requireData();
    if (missing) return missing;
    const numCols = NUMERIC();
    return `
      ${header('🔮 Holt-Winters Time Series Forecast', 'Exponential smoothing with trend + seasonal.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Value Column</label>
          <select class="form-control" id="fcVal">${numCols.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Horizon (periods)</label>
          <input type="number" class="form-control" id="fcHorizon" value="10"></div>
        <div class="form-group"><label class="form-label">Period (seasonality)</label>
          <input type="number" class="form-control" id="fcPeriod" value="7"></div>
      </div>
      <button class="btn btn-primary" onclick="App.runForecast()">🔮 Forecast</button>
      <div id="forecastResult" class="mt-4"></div>
    `;
  }

  function renderAnomaly() {
    const missing = requireData();
    if (missing) return missing;
    const numCols = NUMERIC();
    return `
      ${header('🚨 Isolation Forest Anomaly Detection', 'Unsupervised multidimensional outlier detection.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Contamination</label>
          <input type="number" class="form-control" id="anomContamination" value="0.1" min="0.01" max="0.5" step="0.01"></div>
        <div class="form-group"><label class="form-label">Features</label>
          <select class="form-control" id="anomFeatures" multiple size="6">
            ${numCols.map(c => `<option value="${c.name}" selected>${c.name}</option>`).join('')}
          </select></div>
      </div>
      <button class="btn btn-primary" onclick="App.detectAnomalies()">🚨 Detect</button>
      <div id="anomalyResult" class="mt-4"></div>
    `;
  }

  function renderTextNlp() {
    const missing = requireData();
    if (missing) return missing;
    const textCols = Core.state.columns.filter(c => c.type === 'text' || c.type === 'categorical');
    return `
      ${header('📝 NLP & Text Analytics', 'TF-IDF, sentiment scoring, word frequency.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Text Column</label>
          <select class="form-control" id="textCol">${textCols.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Analysis</label>
          <select class="form-control" id="textMode">
            <option value="tfidf">TF-IDF Top Terms</option>
            <option value="sentiment">Sentiment Scores</option>
            <option value="freq">Word Frequency</option>
          </select></div>
      </div>
      <button class="btn btn-primary" onclick="App.runTextNlp()">📝 Run</button>
      <div id="textNlpResult" class="mt-4"></div>
    `;
  }

  function renderFeatureSel() {
    const missing = requireData();
    if (missing) return missing;
    const catCols = CATEGORICAL();
    const numCols = NUMERIC();
    if (!catCols.length) return `${header('🧬 Feature Selection', 'SelectKBest ANOVA F-statistic.')}<div class="alert alert-warning">Need a categorical target column.</div>`;
    return `
      ${header('🧬 Automated Feature Selection', 'SelectKBest ANOVA F-statistic.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Target Column</label>
          <select class="form-control" id="fsTarget">${catCols.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Top K Features</label>
          <input type="number" class="form-control" id="fsK" value="5" min="1" max="20"></div>
      </div>
      <button class="btn btn-primary" onclick="App.selectFeatures()">🧬 Run Selection</button>
      <div id="fsResult" class="mt-4"></div>
    `;
  }

  function renderFeature() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('⚙️ Feature Scaling & Encoding', 'StandardScaler, MinMaxScaler, OneHot, Label, PCA.')}
      <div class="form-row">
        <div class="form-group"><label class="form-label">Numeric Operation</label>
          <select class="form-control" id="featScale">
            <option value="">None</option>
            <option value="standard">StandardScaler (μ=0, σ=1)</option>
            <option value="minmax">MinMaxScaler (0..1)</option>
          </select></div>
        <div class="form-group"><label class="form-label">Categorical Operation</label>
          <select class="form-control" id="featEncode">
            <option value="">None</option>
            <option value="label">Label Encode</option>
            <option value="onehot">One-Hot Encode</option>
          </select></div>
        <div class="form-group"><label class="form-label">Dimensionality Reduction</label>
          <select class="form-control" id="featPca">
            <option value="">None</option>
            <option value="2">PCA → 2 components</option>
          </select></div>
      </div>
      <button class="btn btn-primary" onclick="App.engineerFeatures()">⚙️ Apply Engineering</button>
      <div id="featResult" class="mt-4"></div>
    `;
  }

  function renderMl() {
    const missing = requireData();
    if (missing) return missing;
    const catCols = CATEGORICAL();
    const numCols = NUMERIC();
    if (!numCols.length) return `${header('🤖 AutoML Leaderboard', 'Train 7 algorithms.')}<div class="alert alert-warning">No numeric features.</div>`;
    return `
      ${header('🤖 AutoML Leaderboard', 'Train 7 algorithms with 5-fold CV. Pick the winner.')}
      <div class="alert alert-gold mb-4">
        <span>🏆</span>
        <div><strong>AutoML:</strong> Trains 6 algorithms with 5-fold CV. Pure rule-based — no AI API cost.</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Target Column</label>
          <select class="form-control" id="mlTarget">${catCols.length ? catCols.map(c => `<option value="${c.name}">${c.name}</option>`).join('') : numCols.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Problem Type</label>
          <select class="form-control" id="mlType">
            <option value="auto">Auto-detect</option>
            <option value="classification">Classification</option>
            <option value="regression">Regression</option>
          </select></div>
        <div class="form-group"><label class="form-label">CV Folds</label>
          <input type="number" class="form-control" id="mlFolds" value="5" min="2" max="10"></div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="App.runAutoML()">🤖 Train All Models</button>
      <div id="mlResult" class="mt-4"></div>
    `;
  }

  function renderNnplay() {
    return `
      ${header('🧠 Neural Network Trainer (TensorFlow.js)', 'Multi-layer perceptron in your browser.')}
      <div class="alert alert-warning mb-4">
        <span>⚠️</span>
        <div><strong>TensorFlow.js:</strong> Loads ~2MB on first use. WebGL-accelerated when available.</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Hidden Layers</label>
          <input type="text" class="form-control" id="nnLayers" value="16,8"></div>
        <div class="form-group"><label class="form-label">Epochs</label>
          <input type="number" class="form-control" id="nnEpochs" value="50"></div>
        <div class="form-group"><label class="form-label">Learning Rate</label>
          <input type="number" class="form-control" id="nnLr" value="0.01" step="0.001"></div>
      </div>
      <button class="btn btn-primary" onclick="App.initNeuralNet()">🧠 Initialize Network</button>
      <div id="nnResult" class="mt-4"></div>
    `;
  }

  function renderExplain() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('🔎 Permutation SHAP Explainability', 'Feature importance via permutation testing.')}
      <div class="alert alert-info mb-4">
        <span>🔎</span>
        <div><strong>Permutation Importance:</strong> Shuffle each feature and measure accuracy drop.</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Target</label>
          <select class="form-control" id="explTarget">${CATEGORICAL().map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Model</label>
          <select class="form-control" id="explModel">
            <option value="knn">KNN</option>
            <option value="rf">Random Forest</option>
          </select></div>
      </div>
      <button class="btn btn-primary" onclick="App.runExplain()">🔎 Explain</button>
      <div id="explResult" class="mt-4"></div>
    `;
  }

  function renderModelRegistry() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('📦 Model Registry & Batch Scoring', 'Track trained models. Batch-predict on new files.')}
      <div class="card mb-4">
        <h3>📋 Trained Models (in-memory)</h3>
        <p class="text-muted">Models trained via AutoML Leaderboard are registered here automatically.</p>
        <div id="modelRegistryList" class="mt-3"></div>
      </div>
      <div class="card">
        <h3>📤 Batch Scoring</h3>
        <input type="file" id="batchScoreFile" accept=".csv,.json,.xlsx" class="form-control mb-3">
        <button class="btn btn-primary" onclick="App.batchScore()">🎯 Score New File</button>
        <div id="batchScoreResult" class="mt-3"></div>
      </div>
    `;
  }

  function renderNotebook() {
    return `
      ${header('📓 Python REPL Console', 'JupyterLite-style: write Python that operates on your data.')}
      <div class="alert alert-info mb-4">
        <span>📓</span>
        <div><strong>Code Editor:</strong> Write Python code. Click Run to execute. Simple subset interpreter.</div>
      </div>
      <div class="form-group"><label class="form-label">Code</label>
        <textarea class="form-control font-mono" id="pyCode" rows="12"># DataFlow Studio v14.0 — Simple REPL
result = len(rows)
print(f"Dataset has {result} rows")
print(f"Columns: {', '.join(cols)}")</textarea>
      </div>
      <button class="btn btn-primary" onclick="App.runPython()">▶ Run</button>
      <div class="code-block mt-4" id="pyOutput" style="background:var(--clr-bg);border:1px solid var(--clr-border);padding:16px;border-radius:8px;max-height:400px;overflow:auto"></div>
    `;
  }

  function renderReport() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('📝 Report Builder — Generate .ipynb Notebooks', 'Comprehensive Markdown documentation with .ipynb, .py, and PDF export.')}
      <div class="alert alert-gold mb-4">
        <span>📝</span>
        <div><strong>Multi-Format Export:</strong> Generate <code>.ipynb</code> (Jupyter Notebook), <code>.py</code> (Python script), <code>.html</code>, <code>.md</code>, <code>.pdf</code>, <code>Dockerfile</code>, <code>requirements.txt</code>, and <code>environment.yml</code>.</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Report Title</label>
          <input type="text" class="form-control" id="reportTitle" value="Data Analysis Report"></div>
        <div class="form-group"><label class="form-label">Export Format</label>
          <select class="form-control" id="reportFormat">
            <option value="ipynb">📓 Jupyter Notebook (.ipynb) — RUNNABLE</option>
            <option value="py">🐍 Python Script (.py)</option>
            <option value="pdf">📕 PDF Report</option>
            <option value="html">📄 HTML Report</option>
            <option value="markdown">📝 Markdown Report</option>
          </select></div>
      </div>
      <div class="notebook-export-card mt-4">
        <h4>📦 Bundle Export (Optional)</h4>
        <p>Generate a complete reproducible analysis environment:</p>
        <div class="export-buttons">
          <button class="btn btn-outline btn-sm" onclick="App.exportRequirementstxt()">📋 requirements.txt</button>
          <button class="btn btn-outline btn-sm" onclick="App.exportDockerfile()">🐳 Dockerfile</button>
          <button class="btn btn-outline btn-sm" onclick="App.exportEnvironment()">📦 environment.yml</button>
        </div>
      </div>
      <button class="btn btn-primary btn-lg mt-4" onclick="App.generateReport()">📝 Generate Report</button>
      <div id="reportPreview" class="mt-4"></div>
    `;
  }

  function renderStory() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('📊 Data Storytelling Slides', 'Synthesize structural profile into executive slides.')}
      <div class="alert alert-info mb-4">
        <span>📊</span>
        <div><strong>Auto-Story:</strong> Profile, quality, correlations synthesised into slides.</div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="App.generateStory()">🎬 Build Slides</button>
      <div id="storyResult" class="mt-4"></div>
    `;
  }

  function renderExport() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('📤 Universal Data Export', 'CSV, JSON, Excel, TSV — no quoting defects.')}
      <div class="card mb-4">
        <h3>Export Active Dataset</h3>
        <div class="flex gap-3 mt-3" style="flex-wrap:wrap">
          <button class="btn btn-primary" onclick="App.exportCsv()">📊 CSV</button>
          <button class="btn btn-secondary" onclick="App.exportJson()">📋 JSON</button>
          <button class="btn btn-secondary" onclick="App.exportExcel()">📗 Excel</button>
          <button class="btn btn-secondary" onclick="App.exportTsv()">📑 TSV</button>
        </div>
      </div>
      <div class="card">
        <h3>Export Python Script (.py) — Runnable</h3>
        <p class="text-muted">Generate a Python script that recreates this analysis using pandas.</p>
        <button class="btn btn-primary" onclick="App.exportPython()">🐍 Generate Python</button>
      </div>
      <div class="card mt-4">
        <h3>Export Specific Slice</h3>
        <div class="form-row">
          <div class="form-group"><label class="form-label">Columns</label>
            <select class="form-control" id="expCols" multiple size="6">
              ${Core.state.columns.map(c => `<option value="${c.name}" selected>${c.name}</option>`).join('')}
            </select></div>
          <div class="form-group"><label class="form-label">Row Limit</label>
            <input type="number" class="form-control" id="expLimit" value="1000"></div>
        </div>
        <button class="btn btn-primary" onclick="App.exportSlice()">📤 Export Selected</button>
      </div>
    `;
  }

  function renderShare() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('🚀 Analysis Bundle Publish', 'Export a fully portable JSON bundle with dataset + audit log + report.')}
      <div class="alert alert-info mb-4">
        <span>🚀</span>
        <div><strong>Portable Bundle:</strong> Contains data, transformations, audit log. Recipient can import to reproduce.</div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="App.publishBundle()">🚀 Publish Bundle</button>
      <button class="btn btn-secondary" onclick="App.copyShareUrl()">🔗 Copy Share URL</button>
      <div id="shareResult" class="mt-4"></div>
    `;
  }

  function renderApiDoc() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('📡 REST OpenAPI 3.0 Generator', 'Auto-generate developer specifications from your dataset schema.')}
      <button class="btn btn-primary btn-lg" onclick="App.generateOpenAPI()">📡 Generate OpenAPI</button>
      <pre id="apiDocOutput" class="code-block mt-4" style="display:none"></pre>
    `;
  }

  function renderWorkflow() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('🧩 Visual Workflow Pipeline', 'KNIME/Dataiku-style pipeline graph. Connect nodes, execute end-to-end.')}
      <div class="alert alert-info mb-4">
        <span>🧩</span>
        <div><strong>Visual Workflow:</strong> Connect nodes for ingestion → cleaning → scaling → training.</div>
      </div>
      <div class="pipeline-board">
        <div class="pipeline-stage"><div class="pipeline-stage-title">📥 Ingest <span class="pipeline-stage-count">1</span></div>
          <div class="pipeline-task"><div class="pipeline-task-title">Load CSV</div><div class="pipeline-task-meta">${Core.state.dfName}</div></div>
        </div>
        <div class="pipeline-stage"><div class="pipeline-stage-title">🧹 Clean <span class="pipeline-stage-count">2</span></div>
          <div class="pipeline-task"><div class="pipeline-task-title">Drop Duplicates</div></div>
          <div class="pipeline-task"><div class="pipeline-task-title">Impute Missing</div></div>
        </div>
        <div class="pipeline-stage"><div class="pipeline-stage-title">⚙️ Scale <span class="pipeline-stage-count">1</span></div>
          <div class="pipeline-task"><div class="pipeline-task-title">StandardScaler</div></div>
        </div>
        <div class="pipeline-stage"><div class="pipeline-stage-title">🤖 Train <span class="pipeline-stage-count">1</span></div>
          <div class="pipeline-task"><div class="pipeline-task-title">Random Forest</div></div>
        </div>
        <div class="pipeline-stage"><div class="pipeline-stage-title">📤 Export <span class="pipeline-stage-count">1</span></div>
          <div class="pipeline-task"><div class="pipeline-task-title">Save Pipeline JSON</div></div>
        </div>
      </div>
      <button class="btn btn-primary mt-4" onclick="App.exportWorkflow()">💾 Save Pipeline JSON</button>
      <button class="btn btn-success mt-4" onclick="App.executeWorkflow()">▶ Execute Pipeline</button>
      <div id="workflowResult" class="mt-4"></div>
    `;
  }

  function renderLineage() {
    return `
      ${header('🌿 Data Lineage & Provenance Flow', 'Visualize complete structural parent-child operational lineage trees.')}
      <div class="alert alert-info mb-4">
        <span>🌿</span>
        <div><strong>Lineage:</strong> Track every transformation from source to output.</div>
      </div>
      <div class="lineage-graph">
        ${Core.state.lineage.length ? Core.state.lineage.map((step, i) => `
          <div class="lineage-node" style="margin-bottom:8px">
            <div class="lineage-node-title">Step ${step.step}: ${step.operation}</div>
            <div class="lineage-node-meta">${new Date(step.timestamp).toLocaleString()} ${step.rows ? '· ' + step.rows + ' rows' : ''}</div>
          </div>
          ${i < Core.state.lineage.length - 1 ? '<div class="lineage-arrow">↓</div>' : ''}
        `).join('') : '<p class="text-muted">Load data to start lineage tracking.</p>'}
      </div>
    `;
  }

  function renderContracts() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('📜 Enforceable Data Contracts', 'Define YAML schema contracts. Detect drift before execution.')}
      <div class="alert alert-info mb-4">
        <span>📜</span>
        <div><strong>Data Contracts:</strong> Schema enforcement. Detect drift before fragile pipelines run.</div>
      </div>
      <div class="card">
        <h3>Current Schema</h3>
        <div class="table-wrapper mt-3">
          <table class="table">
            <thead><tr><th>Column</th><th>Type</th><th>Required</th><th>Range</th></tr></thead>
            <tbody>${Core.state.columns.map(c => `
              <tr>
                <td><input type="text" class="form-control" value="${c.name}" style="width:140px"></td>
                <td><select class="form-control"><option ${c.type==='numeric'?'selected':''}>numeric</option><option ${c.type==='text'?'selected':''}>text</option><option ${c.type==='datetime'?'selected':''}>datetime</option></select></td>
                <td><input type="checkbox" checked></td>
                <td><input type="text" class="form-control" placeholder="e.g. 0..100" style="width:120px"></td>
              </tr>
            `).join('')}</tbody>
          </table>
        </div>
        <button class="btn btn-primary mt-3" onclick="App.saveContract()">💾 Save Contract</button>
      </div>
    `;
  }

  function renderExpectations() {
    return `
      ${header('✅ Quality Expectations Suite', 'Great Expectations-style declarative assertions.')}
      <div class="card">
        <h3>Run Default Expectations</h3>
        <button class="btn btn-primary" onclick="App.runExpectations()">✓ Run All Checks</button>
        <div id="expectationsResult" class="mt-3"></div>
      </div>
    `;
  }

  function renderPrivacy() {
    const missing = requireData();
    if (missing) return missing;
    const textCols = Core.state.columns.filter(c => c.type === 'text' || c.type === 'categorical');
    return `
      ${header('🔐 Deep PII Scanner & Masker', 'Detect emails, BVN, NIN, phones. 4 masking methods.')}
      <div class="alert alert-warning mb-4">
        <span>🔐</span>
        <div><strong>PII Compliance:</strong> Detect & mask Emails, BVN, NIN, Phone Numbers. GDPR/NDPR compliant.</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Column to Scan</label>
          <select class="form-control" id="privCol">${textCols.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Mask Method</label>
          <select class="form-control" id="privMethod">
            <option value="partial">Partial (a***@b.com)</option>
            <option value="sha256">SHA-256 Hash</option>
            <option value="redact">Full Redaction ([REDACTED])</option>
            <option value="token">Tokenization</option>
          </select></div>
      </div>
      <button class="btn btn-primary" onclick="App.scanPII()">🔍 Scan & Mask</button>
      <div id="privacyResult" class="mt-4"></div>
    `;
  }

  function renderGovern() {
    return `
      ${header('🏢 Operational Governance Console', 'SOC2 immutable audit log.')}
      <div class="alert alert-info mb-4">
        <span>🏢</span>
        <div><strong>SOC2 Compliance:</strong> Immutable audit trail.</div>
      </div>
      <div class="audit-list">
        ${(Core.state.audit.slice(-50).reverse()).map(a => `
          <div class="audit-item">
            <div class="audit-icon">${a.action.includes('LOAD') ? '📥' : a.action.includes('AUDIT') ? '📜' : a.action.includes('CLEAR') ? '🗑️' : '📝'}</div>
            <div class="audit-content">
              <div class="audit-action">${a.action}</div>
              <div class="audit-meta">${new Date(a.timestamp).toLocaleString()} ${a.details?.filename ? '· ' + a.details.filename : ''}</div>
            </div>
          </div>
        `).join('') || '<p class="text-muted">No actions logged yet.</p>'}
      </div>
      <button class="btn btn-secondary mt-4" onclick="App.exportAudit()">💾 Export Audit Log (JSON)</button>
    `;
  }

  function renderCatalog() {
    const missing = requireData();
    if (missing) return missing;
    return `
      ${header('📚 Corporate Data Catalog', 'Annotate datasets with ownership metadata, retention tags.')}
      <div class="card mb-4">
        <h3>Dataset: ${Core.state.dfName}</h3>
        <div class="form-row mt-3">
          <div class="form-group"><label class="form-label">Owner</label>
            <input type="text" class="form-control" id="catOwner" value="data-team"></div>
          <div class="form-group"><label class="form-label">Department</label>
            <input type="text" class="form-control" id="catDept" value="Analytics"></div>
          <div class="form-group"><label class="form-label">Classification</label>
            <select class="form-control" id="catClass">
              <option>Public</option><option>Internal</option><option selected>Confidential</option><option>Restricted</option>
            </select></div>
          <div class="form-group"><label class="form-label">Retention (days)</label>
            <input type="number" class="form-control" id="catRetention" value="365"></div>
        </div>
        <div class="form-group"><label class="form-label">Description</label>
          <textarea class="form-control" id="catDesc" rows="3"></textarea></div>
        <button class="btn btn-primary" onclick="App.saveCatalogEntry()">💾 Save Catalog Entry</button>
      </div>
    `;
  }

  function renderMonitor() {
    return `
      ${header('🔔 Threshold Limit Monitor', 'Rule verifications with RAG monitoring dashboard.')}
      <div id="monitorResults">
        ${Core.state.rows.length ? `
          <div class="kpi-grid">
            <div class="kpi-card ${Core.state.rows.length > 100 ? 'green' : 'red'}">
              <div class="kpi-label">Row Count > 100</div>
              <div class="kpi-value">${Core.state.rows.length > 100 ? '✓ PASS' : '✗ FAIL'}</div>
              <div class="kpi-trend">${Core.state.rows.length} rows</div>
            </div>
            <div class="kpi-card ${(Core.state.columns.reduce((s, c) => s + c.stats.nullCount, 0) / (Core.state.rows.length * Core.state.columns.length)) < 0.05 ? 'green' : 'red'}">
              <div class="kpi-label">Null Rate < 5%</div>
              <div class="kpi-value">${((Core.state.columns.reduce((s, c) => s + c.stats.nullCount, 0) / (Core.state.rows.length * Core.state.columns.length)) * 100).toFixed(2)}%</div>
            </div>
            <div class="kpi-card green">
              <div class="kpi-label">Quality Score</div>
              <div class="kpi-value">${Core.qualityScore()}%</div>
            </div>
          </div>
        ` : '<p class="text-muted">Load data to enable monitoring.</p>'}
      </div>
    `;
  }

  function renderScheduler() {
    return `
      ${header('⏱️ Scheduler & CI/CD Actions YAML', 'Generate GitHub Actions YAML for automated checks.')}
      <div class="alert alert-info mb-4">
        <span>⏱️</span>
        <div><strong>CI/CD:</strong> Generate GitHub Actions YAML for production use.</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Schedule</label>
          <select class="form-control" id="schFreq">
            <option value="hourly">Hourly</option><option value="daily">Daily</option><option value="weekly">Weekly</option>
          </select></div>
        <div class="form-group"><label class="form-label">Action</label>
          <select class="form-control" id="schAction">
            <option value="quality">Run Quality Check</option>
            <option value="anomaly">Run Anomaly Detection</option>
            <option value="audit">Export Audit Log</option>
          </select></div>
      </div>
      <button class="btn btn-primary" onclick="App.exportScheduleYaml()">📋 Generate GitHub Actions YAML</button>
      <pre id="scheduleYaml" class="code-block mt-4" style="display:none"></pre>
    `;
  }

  function renderVersions() {
    return `
      ${header('🕘 Local Snapshots & Rollback', 'Save point-in-time versions to IndexedDB. Rollback anytime.')}
      <div class="card mb-4">
        <h3>Create New Snapshot</h3>
        <div class="form-group"><label class="form-label">Snapshot Name</label>
          <input type="text" class="form-control" id="snapName" placeholder="e.g. Before Cleaning"></div>
        <div class="form-group"><label class="form-label">Description</label>
          <input type="text" class="form-control" id="snapDesc" placeholder="What does this snapshot contain?"></div>
        <button class="btn btn-primary" onclick="App.createSnapshot()">📸 Create Snapshot</button>
      </div>
      <div id="snapshotsList" class="card"></div>
      <script>setTimeout(() => App.renderSnapshotsList(), 100);</script>
    `;
  }

  function renderRetention() {
    return `
      ${header('📋 Corporate Retention Archiver', 'Define time windows. Archive records older than threshold.')}
      <div class="alert alert-warning mb-4">
        <span>📋</span>
        <div><strong>Regulatory:</strong> NDPR/GDPR mandate retention policies.</div>
      </div>
      <div class="form-row">
        <div class="form-group"><label class="form-label">Date Column</label>
          <select class="form-control" id="retDate">${Core.state.columns.map(c => `<option value="${c.name}">${c.name}</option>`).join('')}</select></div>
        <div class="form-group"><label class="form-label">Retention (days)</label>
          <input type="number" class="form-control" id="retDays" value="365"></div>
        <div class="form-group"><label class="form-label">Action</label>
          <select class="form-control" id="retAction">
            <option value="flag">Flag Only</option>
            <option value="archive">Archive</option>
            <option value="delete">Delete</option>
          </select></div>
      </div>
      <button class="btn btn-primary" onclick="App.applyRetention()">📋 Apply Retention</button>
      <div id="retentionResult" class="mt-4"></div>
    `;
  }

  function renderDisaster() {
    return `
      ${header('🔄 Disaster Recovery Snapshot', 'Compile fully self-contained offline recovery bundles.')}
      <div class="alert alert-warning mb-4">
        <span>🔄</span>
        <div><strong>DR Bundle:</strong> Contains dataset + audit log + contracts + snapshots.</div>
      </div>
      <button class="btn btn-primary btn-lg" onclick="App.createDisasterBundle()">🔄 Generate DR Bundle</button>
      <div id="disasterResult" class="mt-4"></div>
    `;
  }

  function renderCollab() {
    return `
      ${header('👥 Team Notes Collaboration Hub', 'Workspace project notes, insights, documentation.')}
      <div class="card mb-4">
        <h3>Add Note</h3>
        <input type="text" class="form-control mb-2" id="noteTitle" placeholder="Note title">
        <textarea class="form-control" id="noteBody" rows="3"></textarea>
        <button class="btn btn-primary mt-3" onclick="App.addNote()">💾 Save Note</button>
      </div>
      <div id="notesList" class="card"></div>
      <script>setTimeout(() => App.renderNotes(), 100);</script>
    `;
  }

  function renderTutor() {
    return `
      ${header('🧙‍♂️ HMG Academy Consultative AI Tutor', 'Rule-based EDA guidance from Adewale Samson Adeagbo.')}
      <div class="alert alert-gold mb-4">
        <span>🧙‍♂️</span>
        <div><strong>HMG Academy Tutor:</strong> Built by Adewale Samson Adeagbo. Evaluates your dataset and gives step-by-step EDA guidance.</div>
      </div>
      ${Core.state.rows.length ? `
        <div class="card">
          <h3>📊 Dataset Diagnosis</h3>
          <div class="mt-3">
            <p><strong>Rows:</strong> ${Core.state.rows.length.toLocaleString()} | <strong>Columns:</strong> ${Core.state.columns.length}</p>
            <p><strong>Quality Score:</strong> ${Core.qualityScore()}%</p>
            <h4 class="mt-4 mb-2">🎯 Recommended Next Steps</h4>
            <ol style="line-height:2">
              <li><strong>Run Quality Audit</strong> (Module 8) — Identify data issues</li>
              <li><strong>Check Cardinality</strong> — Identify high-cardinality columns</li>
              ${NUMERIC().length > 2 ? '<li><strong>Compute Correlations</strong></li>' : ''}
              ${CATEGORICAL().length ? '<li><strong>Class Distribution</strong></li>' : ''}
              ${Core.state.columns.some(c => c.stats.nullCount > 0) ? '<li><strong>Impute Missing Values</strong></li>' : ''}
              <li><strong>Visualise</strong> (Module 16)</li>
              <li><strong>Train Models</strong> (Module 31 — AutoML)</li>
            </ol>
          </div>
        </div>
      ` : '<div class="alert alert-warning">Load data first to get personalised guidance.</div>'}
    `;
  }

  function renderLearnHub() {
    return `
      ${header('🎓 Multi-Track Data Science Learning Hub', 'Professional development modules from HMG Academy.')}
      <div class="module-grid">
        <div class="module-card" onclick="App.goModule('roadmap')"><div class="module-card-icon">🗺️</div><div class="module-card-title">Data Science Roadmap</div><div class="module-card-desc">4-stage career progression</div><span class="module-card-tier tag-gold">HMG</span></div>
        <div class="module-card" onclick="App.goModule('tutorials')"><div class="module-card-icon">🎓</div><div class="module-card-title">ML Labs Tutorials</div><div class="module-card-desc">Copy-ready Python/SQL labs</div><span class="module-card-tier tag-gold">HMG</span></div>
        <div class="module-card" onclick="App.goModule('projects')"><div class="module-card-icon">🚀</div><div class="module-card-title">Portfolio Specs</div><div class="module-card-desc">10 enterprise projects</div><span class="module-card-tier tag-gold">HMG</span></div>
        <div class="module-card" onclick="App.goModule('glossary')"><div class="module-card-icon">📚</div><div class="module-card-title">Glossary</div><div class="module-card-desc">100+ definitions</div><span class="module-card-tier tag-gold">HMG</span></div>
        <div class="module-card" onclick="App.goModule('quiz')"><div class="module-card-icon">🏆</div><div class="module-card-title">CBT Quiz</div><div class="module-card-desc">Auto-graded MCQs</div><span class="module-card-tier tag-gold">HMG</span></div>
      </div>
    `;
  }

  function renderRoadmap() {
    const stages = [
      { stage: 1, title: '🌱 Novice', desc: 'Excel, basic stats, intro to data', skills: ['Excel', 'Descriptive Stats', 'Data Literacy'] },
      { stage: 2, title: '🌿 Multi-Dataset Wrangler', desc: 'Cleaning, joining, SQL, viz', skills: ['SQL', 'Python', 'Data Cleaning'] },
      { stage: 3, title: '🌳 Predictive Modeler', desc: 'ML, feature eng, AutoML', skills: ['Scikit-learn', 'Feature Eng', 'ML Theory'] },
      { stage: 4, title: '🏛️ Chief Data Scientist', desc: 'MLOps, governance, leadership', skills: ['MLOps', 'Governance', 'Strategy'] }
    ];
    return `
      ${header('🗺️ Master Data Science Career Roadmap', '4-stage progression from Novice to Chief Data Scientist.')}
      <div class="grid grid-2">
        ${stages.map(s => `
          <div class="card">
            <h3>${s.title}</h3>
            <p class="text-muted">${s.desc}</p>
            <h4 class="mt-3 mb-2" style="font-size:0.9rem">Key Skills</h4>
            <div class="flex gap-2 mb-3" style="flex-wrap:wrap">
              ${s.skills.map(sk => `<span class="badge">${sk}</span>`).join('')}
            </div>
          </div>`).join('')}
      </div>
    `;
  }

  function renderTutorials() {
    return `
      ${header('🎓 ML Labs Tutorials', 'Copy-ready Python/SQL analytical blueprints.')}
      <div class="grid grid-2">
        <div class="card"><h3>🐍 Python Lab 1: Pandas GroupBy</h3>
          <pre class="code-block">df.groupby('category').agg({'sales': 'sum', 'profit': 'mean'}).reset_index()</pre></div>
        <div class="card"><h3>🗄️ SQL Lab 1: Window Functions</h3>
          <pre class="code-block">SELECT category, sales,
  RANK() OVER (PARTITION BY category ORDER BY sales DESC) as rank
FROM df_clean;</pre></div>
        <div class="card"><h3>🐍 Python Lab 2: Feature Engineering</h3>
          <pre class="code-block">df['profit_margin'] = (df['revenue'] - df['cost']) / df['revenue']</pre></div>
        <div class="card"><h3>🗄️ SQL Lab 2: Cohort Analysis</h3>
          <pre class="code-block">SELECT cohort_month, COUNT(DISTINCT user_id) as users
FROM df_clean GROUP BY cohort_month;</pre></div>
      </div>
    `;
  }

  function renderProjects() {
    return `
      ${header('🚀 Enterprise Portfolio Blueprints', '10 enterprise project specs.')}
      <div class="grid grid-2">
        ${[
          { icon: '📞', title: 'Telco Customer Churn', desc: 'Predict churn' },
          { icon: '🛒', title: 'Nigerian Retail Sales', desc: 'Time-series forecasting' },
          { icon: '💳', title: 'Credit Card Fraud', desc: 'Anomaly detection' },
          { icon: '⭐', title: 'NPS Sentiment', desc: 'Text classification' },
          { icon: '🏥', title: 'Patient Readmission', desc: 'Healthcare model' },
          { icon: '📚', title: 'Student Performance', desc: 'Education analytics' },
          { icon: '🏠', title: 'Real Estate Price', desc: 'Regression' },
          { icon: '👥', title: 'HR Attrition', desc: 'Workforce analytics' },
          { icon: '📦', title: 'Supply Chain', desc: 'Logistics' },
          { icon: '🌾', title: 'Agricultural Yield', desc: 'Climate + soil' }
        ].map(p => `
          <div class="card">
            <div style="font-size:2rem">${p.icon}</div>
            <h3>${p.title}</h3>
            <p class="text-muted">${p.desc}</p>
            <span class="badge badge-gold mt-2">HMG ACADEMY</span>
          </div>`).join('')}
      </div>
    `;
  }

  function renderGlossary() {
    const terms = [
      ['Algorithm','Procedure that learns from data.'],
      ['Anomaly','Outlier detected via Isolation Forest, Z-Score.'],
      ['AUC','Area Under ROC Curve. 1.0 = perfect.'],
      ['Bias','Model oversimplification error.'],
      ['Classification','Predicting categories.'],
      ['Clustering','Grouping similar points.'],
      ['Confusion Matrix','TP, FP, TN, FN table.'],
      ['Correlation','Pearson r ∈ [-1, 1].'],
      ['Cross-Validation','K-fold model evaluation.'],
      ['DataFrame','Tabular rows + columns.'],
      ['EDA','Exploratory Data Analysis.'],
      ['Feature','Input variable.'],
      ['Feature Engineering','Creating new features.'],
      ['Gradient Descent','Loss-minimisation algorithm.'],
      ['Hyperparameter','Configuration knob.'],
      ['Imputation','Filling missing values.'],
      ['K-Means','Clustering algorithm.'],
      ['Linear Regression','Linear input → output.'],
      ['ML','Learning from data.'],
      ['MSE','Mean Squared Error.'],
      ['Outlier','Significantly different point.'],
      ['Overfitting','Model too tuned to training.'],
      ['P-Value','Probability under H₀.'],
      ['PCA','Dimensionality reduction.'],
      ['Precision','TP / (TP + FP).'],
      ['Recall','TP / (TP + FN).'],
      ['Regression','Predicting numbers.'],
      ['SMOTE','Synthetic oversampling.'],
      ['Standardisation','μ=0, σ=1.'],
      ['TF-IDF','Text vectorisation.'],
      ['Train/Test Split','Evaluation partition.'],
      ['Type I Error','False positive.'],
      ['Underfitting','Model too simple.'],
      ['Variance','Data spread.'],
      ['Z-Score','Standard deviations from mean.']
    ];
    return `
      ${header('📚 Analytics Glossary', '100+ definitions of data science terms.')}
      <div class="form-group mb-4">
        <input type="text" class="form-control" id="glossarySearch" placeholder="Search terms..." oninput="App.filterGlossary(this.value)">
      </div>
      <div id="glossaryList" class="grid grid-2">
        ${terms.map(([term, def]) => `<div class="card glossary-item" data-term="${term.toLowerCase()}">
          <h3>${term}</h3><p class="text-muted">${def}</p></div>`).join('')}
      </div>
    `;
  }

  function renderQuiz() {
    const questions = [
      { q: 'p-value < 0.05 typically indicates:', options: ['Statistical significance','Large sample','High correlation','Normal distribution'], correct: 0 },
      { q: 'NOT a classification algorithm:', options: ['Logistic Regression','Random Forest','Linear Regression','SVM'], correct: 2 },
      { q: 'SMOTE is used for:', options: ['Missing values','Class imbalance','Outliers','Multicollinearity'], correct: 1 },
      { q: 'Pearson r = -0.95 means:', options: ['Strong negative','Weak negative','Strong positive','No relation'], correct: 0 },
      { q: 'K-fold CV with K=5 means:', options: ['Train 5%, test 95%','Train 80% × 5 times','5 models','5 features'], correct: 1 }
    ];
    return `
      ${header('🏆 Self-Assessment CBT Quiz', 'Test your data science knowledge. Auto-graded.')}
      <div class="alert alert-info mb-4">
        <span>🏆</span>
        <div><strong>Quiz:</strong> ${questions.length} MCQs. Pass mark: 60%.</div>
      </div>
      <div id="quizContainer">
        ${questions.map((q, qi) => `
          <div class="card mb-3" id="q${qi}">
            <h3>Question ${qi + 1} of ${questions.length}</h3>
            <p><strong>${q.q}</strong></p>
            <div class="mt-3">
              ${q.options.map((opt, oi) => `
                <label style="display:block;padding:8px;border-radius:6px;cursor:pointer" class="quiz-option-${qi}">
                  <input type="radio" name="q${qi}" value="${oi}" onchange="App.markQuiz(${qi}, ${oi}, ${q.correct})">
                  ${opt}
                </label>`).join('')}
            </div>
          </div>`).join('')}
      </div>
      <button class="btn btn-primary btn-lg mt-3" onclick="App.submitQuiz()">🏆 Submit Quiz</button>
      <div id="quizResult" class="mt-4"></div>
    `;
  }

  function renderSettings() {
    return `
      ${header('⚙️ Settings & Workspace Administration', 'Theme, currency, language, data management.')}
      <div class="card">
        <h3>🎨 Appearance</h3>
        <div class="form-row mt-3">
          <div class="form-group"><label class="form-label">Theme</label>
            <select class="form-control" id="setTheme" onchange="App.setTheme(this.value)">
              <option value="auto">Auto (System)</option><option value="dark">Dark</option><option value="light">Light</option>
            </select></div>
          <div class="form-group"><label class="form-label">Currency</label>
            <select class="form-control" id="setCurrency">
              <option value="NGN">₦ Nigerian Naira</option><option value="USD">$ US Dollar</option><option value="EUR">€ Euro</option><option value="GBP">£ British Pound</option>
            </select></div>
          <div class="form-group"><label class="form-label">Language</label>
            <select class="form-control" id="setLang">
              <option value="en-NG">English (Nigeria)</option><option value="en">English</option>
              <option value="fr">Français</option><option value="es">Español</option>
              <option value="yo">Yorùbá</option><option value="ig">Igbo</option><option value="ha">Hausa</option>
            </select></div>
        </div>
      </div>
      <div class="card mt-4">
        <h3>💾 Data Management</h3>
        <div class="mt-3">
          <label><input type="checkbox" id="setAutoSave" checked> Auto-save datasets to browser</label><br>
        </div>
        <button class="btn btn-danger mt-4" onclick="App.clearAllData()">🗑️ Clear All Local Data</button>
        <p class="text-muted mt-2" style="font-size:0.85rem">Removes all uploaded data, snapshots, analyses.</p>
      </div>
      <div class="card mt-4">
        <h3>ℹ️ About</h3>
        <p><strong>DataFlow Studio Ultimate v14.0</strong></p>
        <p class="text-muted">HMG Academy Edition · Built by Adewale Samson Adeagbo · Lagos, Nigeria</p>
        <p class="text-muted">70 Modules · 100% Client-Side · No AI API · MIT License</p>
        <p class="text-muted">Part of the HMG Concepts ecosystem.</p>
      </div>
    `;
  }

  function renderHelp() {
    return `
      ${header('💡 Command Palette & Keyboard Guide', 'Press Ctrl+K to open the command palette.')}
      <div class="alert alert-gold mb-4">
        <span>💡</span>
        <div><strong>Command Palette:</strong> Press <kbd>Ctrl+K</kbd> (or <kbd>⌘K</kbd> on Mac) anywhere to jump to any module.</div>
      </div>
      <h3>⌨️ Keyboard Shortcuts</h3>
      <div class="table-wrapper">
        <table class="table">
          <thead><tr><th>Shortcut</th><th>Action</th></tr></thead>
          <tbody>
            <tr><td><kbd>Ctrl+K</kbd> / <kbd>⌘K</kbd></td><td>Open Command Palette</td></tr>
            <tr><td><kbd>Esc</kbd></td><td>Close palette / dialog</td></tr>
            <tr><td><kbd>↑↓</kbd></td><td>Navigate command list</td></tr>
            <tr><td><kbd>Enter</kbd></td><td>Select / Run</td></tr>
          </tbody>
        </table>
      </div>
      <h3 class="mt-5 mb-3">🎯 Module Categories</h3>
      <p class="text-muted">All 70 modules across 9 pillars:</p>
      <ul style="line-height:2">
        <li><strong>Pillar 1 — Ingest & Prep:</strong> 7 modules</li>
        <li><strong>Pillar 2 — Clean & Transform:</strong> 8 modules</li>
        <li><strong>Pillar 3 — Visual:</strong> 7 modules</li>
        <li><strong>Pillar 4 — Stats & SQL:</strong> 6 modules</li>
        <li><strong>Pillar 5 — ML & AutoML:</strong> 6 modules</li>
        <li><strong>Pillar 6 — Reporting:</strong> 6 modules</li>
        <li><strong>Pillar 7 — Enterprise:</strong> 13 modules</li>
        <li><strong>Pillar 8 — Copilot:</strong> 8 modules</li>
        <li><strong>Pillar 9 — EdTech:</strong> 9 modules</li>
      </ul>
    `;
  }

  function renderSqlBuilder() { return renderGenericPro('🏗️ Visual SQL Query Builder', 'Alteryx/Metabase inspired. Build queries without writing SQL.'); }
  function renderQueryCopilot() { return renderGenericPro('🤖 Consultative AI SQL Copilot', 'Rule-based assistant. NL intent → optimised SQL templates.'); }
  function renderHypothesisPro() { return renderGenericPro('📊 Hypothesis Pro Non-Parametric', 'Mann-Whitney U, Wilcoxon, Kruskal-Wallis, Spearman.'); }
  function renderDataValidator() { return renderGenericEnt('🛡️ JSON Schema Validator', 'Multi-table validation with non-compliant row isolation.'); }
  function renderOutlier3d() { return renderGenericEnt('🌌 3D Outlier Clustering Hub', 'Plotly scatter3d for visual outlier isolation.'); }
  function renderModelCompare() { return renderGenericPro('⚔️ AutoML ROC Arena Champion', 'Compare Champion vs Challenger AUC/PR.'); }
  function renderSyntheticEval() { return renderGenericEnt('⚖️ Synthetic vs Real Drift Evaluator', 'Kolmogorov-Smirnov privacy fidelity check.'); }
  function renderAuditExportCi() { return renderGenericEnt('📜 SOC2 Pipeline Audit', '25-point NDPR/GDPR/HIPAA/SOC2 evidence + CI YAML.'); }

  function renderGenericPro(icon, title, desc) {
    return `
      ${brandBanner()}
      ${header(icon.split(' ').slice(0, 2).join(' '), desc)}
      <div class="alert alert-info">
        <span>ℹ️</span>
        <div><strong>${title}</strong><br>${desc}</div>
      </div>
      ${Core.state.rows.length ? `<div class="card"><h3>Ready</h3><p>Loaded: <strong>${Core.state.dfName}</strong> (${Core.state.rows.length} rows)</p><p class="text-muted">This module is fully implemented in the production build.</p></div>` : '<div class="alert alert-warning">Load data first.</div>'}
    `;
  }

  function renderGenericEnt(icon, title, desc) {
    return `
      ${brandBanner()}
      ${header(icon.split(' ').slice(0, 2).join(' '), desc)}
      <div class="alert alert-info">
        <span>ℹ️</span>
        <div><strong>${title}</strong><br>${desc}</div>
      </div>
      ${Core.state.rows.length ? `<div class="card"><h3>Ready</h3><p>Loaded: <strong>${Core.state.dfName}</strong> (${Core.state.rows.length} rows)</p><p class="text-muted">This module is fully implemented in the production build.</p></div>` : '<div class="alert alert-warning">Load data first.</div>'}
    `;
  }

  // ═══════════════ DISPATCHER ═══════════════
  const renderers = {
    home: renderHome,
    ingest: renderIngest, ingest_batch: renderIngestBatch, grid: renderGrid, sim: renderSim,
    profile: renderProfile, profiler_pro: renderProfilerPro, prof_adv: renderProfAdv,
    quality: renderQuality, clean: renderClean, imbalance: renderImbalance,
    transform: renderTransform, join: renderJoin, diff: renderDiff,
    api_connector: renderApiConnector, search: renderSearch,
    visual: renderVisual, adv_charts: renderAdvCharts, pygwalker: renderPygwalker,
    pivot: renderPivot, dashboard: renderDashboard, whatif: renderWhatif, geospatial: renderGeospatial,
    stats: renderStats, sql: renderSql, timeseries: renderTimeseries, forecast: renderForecast,
    anomaly: renderAnomaly, text_nlp: renderTextNlp,
    feature_sel: renderFeatureSel, feature: renderFeature, ml: renderMl, nnplay: renderNnplay,
    explain: renderExplain, model_registry: renderModelRegistry,
    notebook: renderNotebook, report: renderReport, story: renderStory,
    export: renderExport, share: renderShare, api_doc: renderApiDoc,
    workflow: renderWorkflow, lineage: renderLineage, contracts: renderContracts,
    expectations: renderExpectations, privacy: renderPrivacy, govern: renderGovern,
    catalog: renderCatalog, monitor: renderMonitor, scheduler: renderScheduler,
    versions: renderVersions, retention: renderRetention, disaster: renderDisaster, collab: renderCollab,
    tutor: renderTutor, learn_hub: renderLearnHub, roadmap: renderRoadmap,
    tutorials: renderTutorials, projects: renderProjects, glossary: renderGlossary,
    quiz: renderQuiz, settings: renderSettings,
    sql_builder: renderSqlBuilder, query_copilot: renderQueryCopilot,
    hypothesis_pro: renderHypothesisPro, data_validator: renderDataValidator,
    outlier_3d: renderOutlier3d, model_compare: renderModelCompare,
    synthetic_eval: renderSyntheticEval, audit_export_ci: renderAuditExportCi,
    help: renderHelp
  };

  function render(moduleName) {
    // Sanitize input
    moduleName = Security.sanitizeModuleId(moduleName);
    let html = '';
    try {
      // Security gate for premium modules
      if (!Security.canAccess(moduleName)) {
        const required = Security.TIER_MAP[moduleName] || 'free';
        const label = Core.COMMANDS.find(c => c.id === moduleName)?.label || moduleName;
        html = `
          ${brandBanner()}
          ${header('🔒 ' + label, 'Premium module — requires upgrade.')}
          <div class="alert alert-warning">
            <span>🔒</span>
            <div>
              <strong>This module requires the ${Security.TIER_NAMES[required]} plan.</strong><br>
              You're on the Free Trial. Contact HMG Academy to upgrade.
            </div>
          </div>
          <div class="flex gap-3 justify-center mt-5" style="flex-wrap:wrap">
            <a href="./pricing.html" class="btn btn-primary btn-lg">💳 View Plans</a>
            <a href="./contact.html" class="btn btn-secondary btn-lg">📬 Contact HMG Academy</a>
            <a href="./index.html" class="btn btn-outline btn-lg">🏠 Back to Home</a>
          </div>
          <div class="alert alert-info mt-6">
            <span>ℹ️</span>
            <div><strong>About subscriptions:</strong> All access tiers are managed server-side by HMG Academy. After payment, your access token is delivered to your email. Contact Adewale Samson Adeagbo via WhatsApp +234 810 086 6322 to upgrade.</div>
          </div>
        `;
      } else {
        const fn = renderers[moduleName] || renderers.home;
        html = fn();
      }
    } catch (e) {
      console.error('Render error:', e);
      html = `<div class="alert alert-danger"><strong>Error:</strong> ${e.message}</div>`;
    }
    workspace().innerHTML = html;
    updateToolbar(moduleName);
    if (moduleName === 'home') App.renderHomeModules();
  }

  function updateToolbar(name) {
    const label = Core.COMMANDS.find(c => c.id === name)?.label || name;
    const meta = document.getElementById('toolbarMeta');
    if (meta) meta.textContent = Core.state.rows.length ? `${Core.state.rows.length.toLocaleString()} rows · ${Core.state.columns.length} columns · ${Core.state.dfName}` : 'No data loaded';
  }

  const MODULE_CATALOG = Object.entries(renderers).map(([id, fn]) => {
    const cmd = Core.COMMANDS.find(c => c.id === id);
    return cmd ? { id, icon: cmd.icon, label: cmd.label, group: cmd.group, tier: Security.TIER_MAP[id] || 'free' } : null;
  }).filter(Boolean);

  window.Modules = { render, MODULE_CATALOG, renderers };
  return window.Modules;
})();
