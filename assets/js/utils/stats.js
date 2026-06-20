/* ═══════════════════════════════════════════════════════════════════════════════
   DataFlow Studio v14.0 — HMG Academy Ecosystem Edition
   Statistics Utilities
   ═══════════════════════════════════════════════════════════════════════════════ */

const Stats = (() => {
  function mean(arr) { if (!arr.length) return NaN; return arr.reduce((a, b) => a + b, 0) / arr.length; }
  function median(arr) {
    if (!arr.length) return NaN;
    const s = [...arr].sort((a, b) => a - b);
    const mid = Math.floor(s.length / 2);
    return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
  }
  function mode(arr) {
    if (!arr.length) return NaN;
    const counts = {};
    arr.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
    let maxCount = 0, mode = null;
    for (const k in counts) if (counts[k] > maxCount) { maxCount = counts[k]; mode = k; }
    return isNaN(mode) ? NaN : Number(mode);
  }
  function std(arr, sample = true) {
    if (arr.length < 2) return NaN;
    const m = mean(arr);
    return Math.sqrt(arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / (sample ? arr.length - 1 : arr.length));
  }
  function variance(arr, sample = true) {
    if (arr.length < 2) return NaN;
    const m = mean(arr);
    return arr.reduce((sum, v) => sum + (v - m) ** 2, 0) / (sample ? arr.length - 1 : arr.length);
  }
  function quantile(arr, p) {
    if (!arr.length) return NaN;
    const s = [...arr].sort((a, b) => a - b);
    const idx = p * (s.length - 1);
    const lo = Math.floor(idx), hi = Math.ceil(idx);
    return lo === hi ? s[lo] : s[lo] + (idx - lo) * (s[hi] - s[lo]);
  }
  function iqr(arr) { return quantile(arr, 0.75) - quantile(arr, 0.25); }
  function skewness(arr) {
    if (arr.length < 3) return NaN;
    const m = mean(arr), s = std(arr, false);
    if (!s) return 0;
    const n = arr.length;
    return (n / ((n - 1) * (n - 2))) * arr.reduce((sum, v) => sum + ((v - m) / s) ** 3, 0);
  }
  function kurtosis(arr) {
    if (arr.length < 4) return NaN;
    const m = mean(arr), s = std(arr, false);
    if (!s) return 0;
    const n = arr.length;
    const k2 = arr.reduce((sum, v) => sum + ((v - m) / s) ** 4, 0) / n;
    return ((n * (n + 1)) / ((n - 1) * (n - 2) * (n - 3))) * k2 - (3 * (n - 1) ** 2) / ((n - 2) * (n - 3));
  }
  function summary(arr) {
    return {
      count: arr.length, mean: mean(arr), median: median(arr), std: std(arr),
      variance: variance(arr), min: Math.min(...arr),
      q25: quantile(arr, 0.25), q75: quantile(arr, 0.75),
      max: Math.max(...arr), iqr: iqr(arr), skewness: skewness(arr),
      kurtosis: kurtosis(arr), sum: arr.reduce((a, b) => a + b, 0)
    };
  }
  function pearson(x, y) {
    if (x.length !== y.length || x.length < 2) return NaN;
    const mx = mean(x), my = mean(y);
    let num = 0, dx = 0, dy = 0;
    for (let i = 0; i < x.length; i++) {
      num += (x[i] - mx) * (y[i] - my);
      dx += (x[i] - mx) ** 2;
      dy += (y[i] - my) ** 2;
    }
    const denom = Math.sqrt(dx * dy);
    return denom ? num / denom : NaN;
  }
  function spearman(x, y) {
    if (x.length !== y.length) return NaN;
    const rank = arr => {
      const sorted = [...arr].map((v, i) => ({ v, i })).sort((a, b) => a.v - b.v);
      const ranks = new Array(arr.length);
      sorted.forEach((item, rank) => { ranks[item.i] = rank + 1; });
      return ranks;
    };
    return pearson(rank(x), rank(y));
  }
  function normalCdf(x, mu = 0, sigma = 1) {
    if (typeof jStat !== 'undefined') return jStat.normal.cdf(x, mu, sigma);
    return 0.5 * (1 + erf(x / Math.sqrt(2)));
  }
  function chiSquareCdf(x, df) {
    if (typeof jStat !== 'undefined') return jStat.chisquare.cdf(x, df);
    return 0;
  }
  function erf(x) {
    const a1 = 0.254829592, a2 = -0.284496736, a3 = 1.421413741;
    const a4 = -1.453152027, a5 = 1.061405429, p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1.0 / (1.0 + p * x);
    const y = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
    return sign * y;
  }
  function tTest(x, y, alpha = 0.05) {
    const mx = mean(x), my = mean(y);
    const vx = variance(x), vy = variance(y);
    const nx = x.length, ny = y.length;
    const se = Math.sqrt(vx / nx + vy / ny);
    const t = (mx - my) / se;
    const df = ((vx / nx + vy / ny) ** 2) /
      (((vx / nx) ** 2) / (nx - 1) + ((vy / ny) ** 2) / (ny - 1));
    const pValue = 2 * (1 - normalCdf(Math.abs(t), 0, 1));
    return {
      test: "Welch's t-test (independent)", tStatistic: t, df, pValue,
      mean1: mx, mean2: my, significant: pValue < alpha, alpha,
      interpretation: pValue < alpha ? `Reject H₀. Means significantly differ (p=${pValue.toFixed(4)}).` : `Fail to reject H₀.`
    };
  }
  function chiSquareTest(observed, alpha = 0.05) {
    const rows = observed.length, cols = observed[0].length;
    const rowTotals = observed.map(r => r.reduce((a, b) => a + b, 0));
    const colTotals = Array(cols).fill(0);
    observed.forEach(r => r.forEach((v, j) => colTotals[j] += v));
    const total = rowTotals.reduce((a, b) => a + b, 0);
    let chi2 = 0;
    const expected = [];
    for (let i = 0; i < rows; i++) {
      expected.push([]);
      for (let j = 0; j < cols; j++) {
        const exp = (rowTotals[i] * colTotals[j]) / total;
        expected[i].push(exp);
        if (exp > 0) chi2 += (observed[i][j] - exp) ** 2 / exp;
      }
    }
    const df = (rows - 1) * (cols - 1);
    const minDim = Math.min(rows, cols);
    const cramersV = Math.sqrt(chi2 / (total * (minDim - 1)));
    const pValue = 1 - chiSquareCdf(chi2, df);
    return {
      test: 'Chi-square test', chiSquare: chi2, df, pValue, cramersV,
      expected, significant: pValue < alpha, alpha,
      interpretation: pValue < alpha ? `Association (p=${pValue.toFixed(4)}, V=${cramersV.toFixed(3)}).` : `No association.`
    };
  }
  function anova(groups, alpha = 0.05) {
    const k = groups.length;
    const all = groups.flat();
    const grandMean = mean(all);
    let ssBetween = 0, ssWithin = 0;
    groups.forEach(g => {
      const gm = mean(g);
      ssBetween += g.length * (gm - grandMean) ** 2;
      ssWithin += g.reduce((s, v) => s + (v - gm) ** 2, 0);
    });
    const dfBetween = k - 1;
    const dfWithin = all.length - k;
    const f = (ssBetween / dfBetween) / (ssWithin / dfWithin);
    return {
      test: 'One-way ANOVA', fStatistic: f, dfBetween, dfWithin,
      pValue: 1 - chiSquareCdf(f, dfBetween),
      significant: pValue < alpha, alpha,
      interpretation: pValue < alpha ? `Reject H₀.` : `Fail to reject H₀.`
    };
  }
  function mannWhitneyU(x, y, alpha = 0.05) {
    const combined = x.map(v => ({ v, g: 'x' })).concat(y.map(v => ({ v, g: 'y' })));
    combined.sort((a, b) => a.v - b.v);
    const ranks = combined.map(c => 0);
    let i = 0;
    while (i < combined.length) {
      let j = i;
      while (j < combined.length && combined[j].v === combined[i].v) j++;
      const avgRank = (i + j + 1) / 2;
      for (let k = i; k < j; k++) ranks[k] = avgRank;
      i = j;
    }
    let r1 = 0, r2 = 0;
    combined.forEach((c, idx) => { if (c.g === 'x') r1 += ranks[idx]; else r2 += ranks[idx]; });
    const n1 = x.length, n2 = y.length;
    const U1 = r1 - n1 * (n1 + 1) / 2;
    const U2 = n1 * n2 - U1;
    const U = Math.min(U1, U2);
    const muU = n1 * n2 / 2;
    const sigmaU = Math.sqrt(n1 * n2 * (n1 + n2 + 1) / 12);
    const z = (U - muU) / sigmaU;
    return {
      test: 'Mann-Whitney U', U, zStatistic: z,
      pValue: 2 * (1 - normalCdf(Math.abs(z), 0, 1)),
      significant: pValue < alpha, alpha
    };
  }
  function iqrOutliers(arr) {
    const q1 = quantile(arr, 0.25), q3 = quantile(arr, 0.75);
    const iqrVal = q3 - q1, lower = q1 - 1.5 * iqrVal, upper = q3 + 1.5 * iqrVal;
    const outliers = arr.map((v, i) => ({ index: i, value: v, isOutlier: v < lower || v > upper }));
    return { method: 'IQR', q1, q3, iqr: iqrVal, lower, upper, outliers, count: outliers.filter(o => o.isOutlier).length };
  }
  function zScoreOutliers(arr, threshold = 3) {
    const m = mean(arr), s = std(arr, false);
    const outliers = arr.map((v, i) => ({ index: i, value: v, zScore: s ? (v - m) / s : 0, isOutlier: Math.abs((v - m) / s) > threshold }));
    return { method: 'Z-Score', threshold, mean: m, std: s, outliers, count: outliers.filter(o => o.isOutlier).length };
  }
  function movingAverage(arr, window) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      const start = Math.max(0, i - window + 1);
      result.push(mean(arr.slice(start, i + 1)));
    }
    return result;
  }
  function exponentialSmoothing(arr, alpha) {
    const result = [arr[0]];
    for (let i = 1; i < arr.length; i++) result.push(alpha * arr[i] + (1 - alpha) * result[i - 1]);
    return result;
  }
  function holtWinters(arr, alpha = 0.3, beta = 0.1, gamma = 0.3, period = 7, horizon = 10) {
    if (arr.length < period * 2) return null;
    const level = [arr[0]], trend = [arr[1] - arr[0]];
    const seasonal = Array(period).fill(0).map((_, i) => arr[i] / (arr[0] || 1));
    for (let i = 1; i < arr.length; i++) {
      const si = i % period;
      const newLevel = alpha * (arr[i] / seasonal[si]) + (1 - alpha) * (level[i - 1] + trend[i - 1]);
      const newTrend = beta * (newLevel - level[i - 1]) + (1 - beta) * trend[i - 1];
      seasonal[si] = gamma * (arr[i] / newLevel) + (1 - gamma) * seasonal[si];
      level.push(newLevel); trend.push(newTrend);
    }
    const forecast = [];
    for (let h = 1; h <= horizon; h++) {
      const si = (arr.length + h - 1) % period;
      forecast.push((level[level.length - 1] + h * trend[trend.length - 1]) * seasonal[si]);
    }
    return { level, trend, seasonal, forecast, fitted: level.map((l, i) => l * seasonal[i % period]) };
  }
  function tokenize(text) {
    return (text || '').toLowerCase().replace(/[^\w\s]/g, ' ').split(/\s+/).filter(t => t.length > 2);
  }
  function tfIdf(documents) {
    const tokenized = documents.map(tokenize);
    const df = {};
    tokenized.forEach(doc => {
      const unique = new Set(doc);
      unique.forEach(t => { df[t] = (df[t] || 0) + 1; });
    });
    const N = documents.length;
    return tokenized.map((doc, di) => {
      const tf = {};
      doc.forEach(t => { tf[t] = (tf[t] || 0) + 1; });
      const tfidf = {};
      for (const term in tf) tfidf[term] = (tf[term] / doc.length) * Math.log(N / (df[term] || 1));
      const topTerms = Object.entries(tfidf).sort((a, b) => b[1] - a[1]).slice(0, 10).map(([term, score]) => ({ term, score }));
      return { docId: di, tfidf, topTerms };
    });
  }
  const AFINN = {
    good: 3, great: 3, excellent: 4, amazing: 4, wonderful: 3, fantastic: 4, awesome: 4,
    bad: -2, terrible: -3, awful: -3, horrible: -3, poor: -2, disappointing: -2,
    love: 3, hate: -3, like: 2, dislike: -1, happy: 2, sad: -2, angry: -2,
    success: 3, fail: -2, win: 2, lose: -2, positive: 2, negative: -2,
    best: 3, worst: -3, perfect: 4, broken: -2, fast: 1, slow: -1
  };
  function sentimentScore(text) {
    const tokens = tokenize(text);
    let score = 0;
    tokens.forEach(t => { score += (AFINN[t] || 0); });
    return { score, normalized: Math.tanh(score / 5), words: tokens.length };
  }
  function abTest(p1, p2, n, alpha = 0.05) {
    const p_pool = (p1 * n + p2 * n) / (2 * n);
    const se = Math.sqrt(2 * p_pool * (1 - p_pool) / n);
    const z = (p2 - p1) / se;
    const pValue = 2 * (1 - normalCdf(Math.abs(z), 0, 1));
    return {
      test: 'A/B test', p1, p2, n, zScore: z, pValue,
      lift: ((p2 - p1) / p1 * 100).toFixed(2) + '%',
      significant: pValue < alpha,
      winner: pValue < alpha ? (p2 > p1 ? 'B' : 'A') : 'Tie',
      interpretation: pValue < alpha ? `Significant (p=${pValue.toFixed(4)}).` : `No significant difference.`
    };
  }
  function jarqueBera(values) {
    const n = values.length;
    if (n < 8) return { test: 'Jarque-Bera', error: 'Need >= 8 values' };
    const s = skewness(values), k = kurtosis(values);
    const jb = (n / 6) * (s * s + ((k - 3) * (k - 3)) / 4);
    const pValue = 1 - chiSquareCdf(jb, 2);
    return {
      test: 'Jarque-Bera', statistic: jb, skewness: s, kurtosis: k,
      pValue, isNormal: pValue > 0.05,
      interpretation: pValue > 0.05 ? 'Data appears normal' : 'Data is non-normal'
    };
  }
  window.Stats = {
    mean, median, mode, std, variance, quantile, iqr, skewness, kurtosis, summary,
    pearson, spearman,
    tTest, chiSquareTest, anova, mannWhitneyU,
    iqrOutliers, zScoreOutliers,
    movingAverage, exponentialSmoothing, holtWinters,
    tokenize, tfIdf, sentimentScore, abTest, jarqueBera,
    normalCdf, chiSquareCdf, erf
  };
  return window.Stats;
})();
