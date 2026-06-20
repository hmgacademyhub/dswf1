/* ═══════════════════════════════════════════════════════════════════════════════
   DataFlow Studio v14.0 — HMG Academy Ecosystem Edition
   Core Engine — State, Routing, Data Parsing, Transformations
   ═══════════════════════════════════════════════════════════════════════════════ */

const Core = (() => {
  const state = {
    df: null,
    dfName: null,
    columns: [],
    rows: [],
    currentModule: 'home',
    history: [],
    lineage: [],
    audit: [],
    snapshots: [],
    workflows: [],
    notes: [],
    settings: {
      theme: 'auto',
      currency: 'NGN',
      language: 'en-NG',
      autoSave: true,
      role: 'admin'
    },
    trainedModels: []
  };

  const subscribers = [];
  function subscribe(fn) { subscribers.push(fn); }
  function notify() { subscribers.forEach(fn => fn(state)); }
  function setState(updates) { Object.assign(state, updates); notify(); }

  function makeId(prefix = 'id') {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  async function loadFile(file) {
    const ext = file.name.split('.').pop().toLowerCase();
    let data;
    try {
      if (ext === 'csv' || ext === 'tsv' || ext === 'txt') {
        const text = await file.text();
        const delimiter = ext === 'tsv' ? '\t' : (Papa.parse(text.slice(0, 2000)).meta.delimiter || ',');
        data = Papa.parse(text, { header: true, delimiter, dynamicTyping: true, skipEmptyLines: true }).data;
      } else if (ext === 'json') {
        const text = await file.text();
        const json = JSON.parse(text);
        data = Array.isArray(json) ? json : (json.data || [json]);
      } else if (ext === 'xlsx' || ext === 'xls') {
        const buffer = await file.arrayBuffer();
        const wb = XLSX.read(buffer);
        data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: null });
      } else {
        throw new Error('Unsupported format: ' + ext);
      }
      processData(data, file.name);
      return { rows: data.length, filename: file.name };
    } catch (e) { throw e; }
  }

  function processData(rows, name = 'Untitled') {
    if (!rows || !rows.length) throw new Error('No data found');
    const columns = Object.keys(rows[0]).map(col => {
      const values = rows.slice(0, 100).map(r => r[col]);
      const type = inferType(values);
      return { name: col, type, stats: computeStats(rows, col, type) };
    });
    state.rows = rows;
    state.columns = columns;
    state.dfName = name;
    state.history = [];
    state.lineage = [{
      step: 1, timestamp: new Date().toISOString(),
      operation: 'Load Data', rows: rows.length, columns: columns.length
    }];
    logAudit('LOAD_DATA', { filename: name, rows: rows.length, columns: columns.length });
    if (state.settings.autoSave) Storage.saveDataset(makeId('ds'), name, columns, rows, { source: 'upload' });
    notify();
    return { columns: columns.length, rows: rows.length, filename: name };
  }

  function inferType(values) {
    const nonNull = values.filter(v => v != null && v !== '');
    if (!nonNull.length) return 'text';
    const isNumeric = nonNull.every(v => !isNaN(parseFloat(v)) && isFinite(v));
    if (isNumeric) return 'numeric';
    const isDate = nonNull.every(v => !isNaN(Date.parse(v)) && /[-/]/.test(String(v)));
    if (isDate) return 'datetime';
    return 'categorical';
  }

  function computeStats(rows, col, type) {
    const values = rows.map(r => r[col]).filter(v => v != null && v !== '');
    const stats = {
      count: values.length,
      nullCount: rows.length - values.length,
      uniqueCount: new Set(values).size
    };
    if (type === 'numeric') {
      const nums = values.map(v => parseFloat(v)).filter(v => !isNaN(v));
      if (nums.length) {
        stats.min = Math.min(...nums);
        stats.max = Math.max(...nums);
        stats.mean = Stats.mean(nums);
        stats.median = Stats.median(nums);
        stats.std = Stats.std(nums);
      }
    }
    return stats;
  }

  function navigate(moduleName) {
    state.currentModule = moduleName;
    notify();
  }

  function getRows(limit = null) {
    const rows = state.rows || [];
    return limit ? rows.slice(0, limit) : rows;
  }

  function getColumn(name) {
    return (state.rows || []).map(r => r[name]);
  }

  function getNumericColumn(name) {
    return getColumn(name).filter(v => v != null && !isNaN(v)).map(v => parseFloat(v));
  }

  function clear() {
    state.rows = [];
    state.columns = [];
    state.dfName = null;
    state.history = [];
    state.lineage = [];
    logAudit('CLEAR_DATA', {});
    notify();
  }

  function logAudit(action, details) {
    state.audit.push({ timestamp: new Date().toISOString(), action, details });
    Storage.logAudit(action, details);
    if (state.audit.length > 500) state.audit.shift();
  }

  function toast(msg, type = 'info', duration = 4000) {
    const container = document.getElementById('toastContainer');
    if (!container) return;
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.innerHTML = `<span class="toast-message">${msg}</span><span class="toast-close" onclick="this.parentElement.remove()">×</span>`;
    container.appendChild(el);
    setTimeout(() => el.remove(), duration);
  }

  // Command palette commands
  const COMMANDS = [
    { id: 'home', icon: '🏠', label: 'Home / Dashboard', group: 'Navigation' },
    { id: 'ingest', icon: '📥', label: '1. Universal Data Ingest', group: 'Ingest & Prep' },
    { id: 'ingest_batch', icon: '📂', label: '2. Multi-File Batch Ingest', group: 'Ingest & Prep' },
    { id: 'grid', icon: '📋', label: '3. Data Grid Editor', group: 'Ingest & Prep' },
    { id: 'sim', icon: '🧪', label: '4. Synthetic Data Generator', group: 'Ingest & Prep' },
    { id: 'profile', icon: '🔍', label: '5. Profiler / EDA Summary', group: 'Ingest & Prep' },
    { id: 'profiler_pro', icon: '📊', label: '6. Profiler Pro EDA Matrix', group: 'Ingest & Prep' },
    { id: 'prof_adv', icon: '🔬', label: '7. Advanced Stat Profiler', group: 'Ingest & Prep' },
    { id: 'quality', icon: '🧪', label: '8. Enterprise Quality Scorecard', group: 'Clean & Transform' },
    { id: 'clean', icon: '🧹', label: '9. Cleaning & Imputation', group: 'Clean & Transform' },
    { id: 'imbalance', icon: '⚖️', label: '10. Class Imbalance Balancer', group: 'Clean & Transform' },
    { id: 'transform', icon: '🗂️', label: '11. Column Manager', group: 'Clean & Transform' },
    { id: 'join', icon: '🔗', label: '12. Multi-Dataset Join & Merge', group: 'Clean & Transform' },
    { id: 'diff', icon: '📊', label: '13. Dataset Diff Engine', group: 'Clean & Transform' },
    { id: 'api_connector', icon: '🌐', label: '14. Live REST API Connector', group: 'Clean & Transform' },
    { id: 'search', icon: '🔎', label: '15. Search & Compare', group: 'Clean & Transform' },
    { id: 'visual', icon: '📈', label: '16. Visual Explorer (14 Charts)', group: 'Visual' },
    { id: 'adv_charts', icon: '📉', label: '17. Advanced Charts', group: 'Visual' },
    { id: 'pygwalker', icon: '🎨', label: '18. Drag-Drop Builder', group: 'Visual' },
    { id: 'pivot', icon: '🧮', label: '19. Pivot Table Builder', group: 'Visual' },
    { id: 'dashboard', icon: '📊', label: '20. Interactive Dashboard', group: 'Visual' },
    { id: 'whatif', icon: '📈', label: '21. What-If Modeling', group: 'Visual' },
    { id: 'geospatial', icon: '🗺️', label: '22. Geospatial Map', group: 'Visual' },
    { id: 'stats', icon: '📐', label: '23. Inferential Stats', group: 'Stats' },
    { id: 'sql', icon: '🗄️', label: '24. SQLite3 SQL Console', group: 'Stats' },
    { id: 'timeseries', icon: '📅', label: '25. Time Series Decomposition', group: 'Stats' },
    { id: 'forecast', icon: '🔮', label: '26. Holt-Winters Forecast', group: 'Stats' },
    { id: 'anomaly', icon: '🚨', label: '27. Isolation Forest Anomalies', group: 'Stats' },
    { id: 'text_nlp', icon: '📝', label: '28. NLP & Text Analytics', group: 'Stats' },
    { id: 'feature_sel', icon: '🧬', label: '29. Feature Selection', group: 'ML' },
    { id: 'feature', icon: '⚙️', label: '30. Feature Scaling & Encoding', group: 'ML' },
    { id: 'ml', icon: '🤖', label: '31. AutoML Leaderboard', group: 'ML' },
    { id: 'nnplay', icon: '🧠', label: '32. Neural Network Trainer', group: 'ML' },
    { id: 'explain', icon: '🔎', label: '33. Permutation SHAP', group: 'ML' },
    { id: 'model_registry', icon: '📦', label: '34. Model Registry & Scoring', group: 'ML' },
    { id: 'notebook', icon: '📓', label: '35. Python REPL Console', group: 'Reporting' },
    { id: 'report', icon: '📝', label: '36. Report Builder (.ipynb)', group: 'Reporting' },
    { id: 'story', icon: '📊', label: '37. Data Storytelling', group: 'Reporting' },
    { id: 'export', icon: '📤', label: '38. Data Export', group: 'Reporting' },
    { id: 'share', icon: '🚀', label: '39. Analysis Bundle Share', group: 'Reporting' },
    { id: 'api_doc', icon: '📡', label: '40. OpenAPI Generator', group: 'Reporting' },
    { id: 'workflow', icon: '🧩', label: '41. Visual Pipeline', group: 'Enterprise' },
    { id: 'lineage', icon: '🌿', label: '42. Data Lineage', group: 'Enterprise' },
    { id: 'contracts', icon: '📜', label: '43. Data Contracts', group: 'Enterprise' },
    { id: 'expectations', icon: '✅', label: '44. Quality Expectations', group: 'Enterprise' },
    { id: 'privacy', icon: '🔐', label: '45. PII Masker', group: 'Enterprise' },
    { id: 'govern', icon: '🏢', label: '46. Governance Logs', group: 'Enterprise' },
    { id: 'catalog', icon: '📚', label: '47. Data Catalog', group: 'Enterprise' },
    { id: 'monitor', icon: '🔔', label: '48. Threshold Monitor', group: 'Enterprise' },
    { id: 'scheduler', icon: '⏱️', label: '49. Scheduler & CI/CD', group: 'Enterprise' },
    { id: 'versions', icon: '🕘', label: '50. Snapshots Rollback', group: 'Enterprise' },
    { id: 'retention', icon: '📋', label: '51. Retention Archiver', group: 'Enterprise' },
    { id: 'disaster', icon: '🔄', label: '52. Disaster Recovery', group: 'Enterprise' },
    { id: 'collab', icon: '👥', label: '53. Team Notes', group: 'Enterprise' },
    { id: 'sql_builder', icon: '🏗️', label: '62. Visual SQL Builder', group: 'Copilot' },
    { id: 'query_copilot', icon: '🤖', label: '63. SQL Copilot', group: 'Copilot' },
    { id: 'hypothesis_pro', icon: '📊', label: '64. Hypothesis Pro', group: 'Copilot' },
    { id: 'data_validator', icon: '🛡️', label: '65. JSON Schema Validator', group: 'Copilot' },
    { id: 'outlier_3d', icon: '🌌', label: '66. 3D Outliers', group: 'Copilot' },
    { id: 'model_compare', icon: '⚔️', label: '67. AutoML ROC Arena', group: 'Copilot' },
    { id: 'synthetic_eval', icon: '⚖️', label: '68. Synthetic vs Real', group: 'Copilot' },
    { id: 'audit_export_ci', icon: '📜', label: '69. SOC2 Pipeline Audit', group: 'Copilot' },
    { id: 'tutor', icon: '🧙‍♂️', label: '54. Consultative AI Tutor', group: 'EdTech' },
    { id: 'learn_hub', icon: '🎓', label: '55. Multi-Track Learning Hub', group: 'EdTech' },
    { id: 'roadmap', icon: '🗺️', label: '56. Data Science Roadmap', group: 'EdTech' },
    { id: 'tutorials', icon: '🎓', label: '57. ML Labs Tutorials', group: 'EdTech' },
    { id: 'projects', icon: '🚀', label: '58. Portfolio Blueprints', group: 'EdTech' },
    { id: 'glossary', icon: '📚', label: '59. Analytics Glossary', group: 'EdTech' },
    { id: 'quiz', icon: '🏆', label: '60. Self-Assessment Quiz', group: 'EdTech' },
    { id: 'settings', icon: '⚙️', label: '61. Settings & Admin', group: 'EdTech' },
    { id: 'help', icon: '💡', label: '70. Command Palette & Help', group: 'EdTech' }
  ];

  function openCmd() {
    document.getElementById('cmdPalette')?.classList.add('open');
    document.getElementById('cmdPaletteOverlay')?.classList.add('open');
    document.getElementById('cmdPaletteInput')?.focus();
    renderCmd('');
  }

  function closeCmd() {
    document.getElementById('cmdPalette')?.classList.remove('open');
    document.getElementById('cmdPaletteOverlay')?.classList.remove('open');
  }

  function renderCmd(query) {
    const list = document.getElementById('cmdPaletteList');
    const filtered = COMMANDS.filter(c =>
      c.label.toLowerCase().includes(query.toLowerCase()) ||
      c.group.toLowerCase().includes(query.toLowerCase())
    );
    if (!filtered.length) {
      list.innerHTML = '<div class="cmd-palette-empty">No modules found.</div>';
      return;
    }
    list.innerHTML = filtered.map(c => {
      const tier = Security.TIER_MAP[c.id] || 'free';
      const canAccess = Security.canAccess(c.id);
      return `<div class="cmd-palette-item" data-cmd="${c.id}">
        <span class="cmd-palette-item-icon">${c.icon}</span>
        <div class="cmd-palette-item-info">
          <div class="cmd-palette-item-label">${c.label}</div>
          <div class="cmd-palette-item-desc">${c.group}</div>
        </div>
        <span class="cmd-palette-item-group">${canAccess ? tier.toUpperCase() : '🔒 ' + tier.toUpperCase()}</span>
      </div>`;
    }).join('');
    list.querySelectorAll('.cmd-palette-item').forEach(el => {
      el.addEventListener('click', () => {
        const cmd = COMMANDS.find(c => c.id === el.dataset.cmd);
        if (!cmd) return;
        if (!Security.canAccess(cmd.id)) {
          Security.showUpgradePrompt(cmd.label, Security.TIER_MAP[cmd.id]);
          closeCmd();
          return;
        }
        navigate(cmd.id);
        closeCmd();
        window.dispatchEvent(new CustomEvent('dswf-render', { detail: cmd.id }));
      });
    });
  }

  function qualityScore() {
    if (!state.columns.length) return 0;
    const total = state.columns.length;
    const issues = state.columns.filter(c => {
      const nullPct = c.stats.nullCount / (c.stats.nullCount + c.stats.count);
      return nullPct > 0.1 || c.stats.uniqueCount < 2;
    }).length;
    return Math.round((1 - issues / total) * 100);
  }

  function applyTheme(theme) {
    const root = document.documentElement;
    if (theme === 'auto') {
      root.dataset.theme = window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark';
    } else {
      root.dataset.theme = theme;
    }
  }

  window.Core = {
    state, subscribe, setState,
    loadFile, processData, navigate,
    getRows, getColumn, getNumericColumn,
    clear, logAudit, toast,
    openCmd, closeCmd, renderCmd,
    qualityScore, applyTheme,
    COMMANDS, makeId
  };

  return window.Core;
})();
