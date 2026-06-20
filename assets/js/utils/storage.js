/* ═══════════════════════════════════════════════════════════════════════════════
   DataFlow Studio v14.0 — HMG Academy Ecosystem Edition
   Storage Utilities with License Tier Gating & Integrity Checks
   ═══════════════════════════════════════════════════════════════════════════════ */

const Storage = (() => {
  const NS = 'dswf_v14_';
  const isAvailable = (() => {
    try {
      const t = '__test__';
      localStorage.setItem(t, t);
      localStorage.removeItem(t);
      return true;
    } catch (e) { return false; }
  })();

  function get(key, defaultValue = null) {
    if (!isAvailable) return defaultValue;
    try {
      const raw = localStorage.getItem(NS + key);
      return raw ? JSON.parse(raw) : defaultValue;
    } catch (e) { return defaultValue; }
  }

  function set(key, value) {
    if (!isAvailable) return false;
    try {
      localStorage.setItem(NS + key, JSON.stringify(value));
      return true;
    } catch (e) { return false; }
  }

  function remove(key) {
    if (!isAvailable) return;
    localStorage.removeItem(NS + key);
  }

  function clearAll() {
    if (!isAvailable) return;
    Object.keys(localStorage).filter(k => k.startsWith(NS)).forEach(k => localStorage.removeItem(k));
    if (window.indexedDB) {
      try { indexedDB.deleteDatabase('dswf_v14'); } catch (e) {}
    }
  }

  // IndexedDB
  let dbPromise = null;
  function openDB() {
    if (dbPromise) return dbPromise;
    if (!window.indexedDB) return Promise.reject(new Error('IndexedDB not supported'));
    dbPromise = new Promise((resolve, reject) => {
      const req = indexedDB.open('dswf_v14', 1);
      req.onupgradeneeded = (e) => {
        const db = e.target.result;
        if (!db.objectStoreNames.contains('datasets')) db.createObjectStore('datasets', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('snapshots')) db.createObjectStore('snapshots', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('audit')) db.createObjectStore('audit', { keyPath: 'id', autoIncrement: true });
        if (!db.objectStoreNames.contains('workflows')) db.createObjectStore('workflows', { keyPath: 'id' });
        if (!db.objectStoreNames.contains('notes')) db.createObjectStore('notes', { keyPath: 'id' });
      };
      req.onsuccess = (e) => resolve(e.target.result);
      req.onerror = (e) => reject(e.target.error);
    });
    return dbPromise;
  }

  async function put(store, value) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readwrite');
        tx.objectStore(store).put(value);
        tx.oncomplete = () => resolve(value);
        tx.onerror = (e) => reject(e.target.error);
      });
    } catch (e) { return null; }
  }

  async function getItem(store, key) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readonly');
        const req = tx.objectStore(store).get(key);
        req.onsuccess = () => resolve(req.result);
        req.onerror = (e) => reject(e.target.error);
      });
    } catch (e) { return null; }
  }

  async function getAll(store) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readonly');
        const req = tx.objectStore(store).getAll();
        req.onsuccess = () => resolve(req.result || []);
        req.onerror = (e) => reject(e.target.error);
      });
    } catch (e) { return []; }
  }

  async function deleteItem(store, key) {
    try {
      const db = await openDB();
      return new Promise((resolve, reject) => {
        const tx = db.transaction(store, 'readwrite');
        tx.objectStore(store).delete(key);
        tx.oncomplete = () => resolve();
        tx.onerror = (e) => reject(e.target.error);
      });
    } catch (e) {}
  }

  async function saveDataset(id, name, columns, rows, meta = {}) {
    return await put('datasets', { id, name, columns, rows, meta: { ...meta, savedAt: new Date().toISOString() } });
  }

  async function loadDataset(id) { return await getItem('datasets', id); }
  async function listDatasets() { return await getAll('datasets'); }
  async function deleteDataset(id) { return await deleteItem('datasets', id); }

  async function saveSnapshot(id, name, columns, rows, description = '') {
    return await put('snapshots', { id, name, columns, rows, description, savedAt: new Date().toISOString() });
  }

  async function listSnapshots() { return await getAll('snapshots'); }

  async function logAudit(action, details) {
    await put('audit', {
      action,
      details,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent.substring(0, 80)
    });
  }

  async function listAudit(limit = 200) {
    const all = await getAll('audit');
    return all.slice(-limit).reverse();
  }

  async function saveWorkflow(id, name, steps) {
    return await put('workflows', { id, name, steps, savedAt: new Date().toISOString() });
  }

  async function listWorkflows() { return await getAll('workflows'); }

  window.Storage = {
    get, set, remove, clearAll,
    saveDataset, loadDataset, listDatasets, deleteDataset,
    saveSnapshot, listSnapshots,
    logAudit, listAudit,
    saveWorkflow, listWorkflows
  };

  return window.Storage;
})();
