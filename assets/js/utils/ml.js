/* ═══════════════════════════════════════════════════════════════════════════════
   DataFlow Studio v14.0 — HMG Academy Ecosystem Edition
   Machine Learning Utilities
   ═══════════════════════════════════════════════════════════════════════════════ */

const ML = (() => {
  function splitTrainTest(X, y, testRatio = 0.2) {
    const n = X.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const splitIdx = Math.floor(n * (1 - testRatio));
    return {
      X_train: indices.slice(0, splitIdx).map(i => X[i]),
      X_test: indices.slice(splitIdx).map(i => X[i]),
      y_train: indices.slice(0, splitIdx).map(i => y[i]),
      y_test: indices.slice(splitIdx).map(i => y[i])
    };
  }
  function kFoldSplit(X, y, k = 5) {
    const n = X.length;
    const indices = Array.from({ length: n }, (_, i) => i);
    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }
    const folds = [];
    const foldSize = Math.floor(n / k);
    for (let f = 0; f < k; f++) {
      const start = f * foldSize;
      const end = f === k - 1 ? n : start + foldSize;
      const testIdx = indices.slice(start, end);
      const trainIdx = [...indices.slice(0, start), ...indices.slice(end)];
      folds.push({
        X_train: trainIdx.map(i => X[i]),
        X_test: testIdx.map(i => X[i]),
        y_train: trainIdx.map(i => y[i]),
        y_test: testIdx.map(i => y[i])
      });
    }
    return folds;
  }
  function standardize(X) {
    if (!X.length || !X[0].length) return { X, mean: [], std: [] };
    const cols = X[0].length;
    const means = [], stds = [];
    for (let j = 0; j < cols; j++) {
      const col = X.map(row => row[j]);
      means.push(Stats.mean(col));
      stds.push(Stats.std(col, false) || 1);
    }
    return { X: X.map(row => row.map((v, j) => (v - means[j]) / stds[j])), mean: means, std: stds };
  }
  function normalize(X) {
    if (!X.length || !X[0].length) return { X, min: [], max: [] };
    const cols = X[0].length;
    const mins = [], maxs = [];
    for (let j = 0; j < cols; j++) {
      const col = X.map(row => row[j]);
      mins.push(Math.min(...col));
      maxs.push(Math.max(...col));
    }
    return {
      X: X.map(row => row.map((v, j) => {
        const range = maxs[j] - mins[j];
        return range ? (v - mins[j]) / range : 0;
      })),
      min: mins, max: maxs
    };
  }
  function accuracy(yTrue, yPred) {
    if (!yTrue.length) return 0;
    return yTrue.filter((v, i) => v === yPred[i]).length / yTrue.length;
  }
  function precision(yTrue, yPred, positive = 1) {
    const tp = yTrue.filter((v, i) => v === positive && yPred[i] === positive).length;
    const fp = yTrue.filter((v, i) => v !== positive && yPred[i] === positive).length;
    return tp + fp ? tp / (tp + fp) : 0;
  }
  function recall(yTrue, yPred, positive = 1) {
    const tp = yTrue.filter((v, i) => v === positive && yPred[i] === positive).length;
    const fn = yTrue.filter((v, i) => v === positive && yPred[i] !== positive).length;
    return tp + fn ? tp / (tp + fn) : 0;
  }
  function f1Score(yTrue, yPred, positive = 1) {
    const p = precision(yTrue, yPred, positive);
    const r = recall(yTrue, yPred, positive);
    return p + r ? 2 * p * r / (p + r) : 0;
  }
  function confusionMatrix(yTrue, yPred, classes) {
    const cm = classes.map(() => classes.map(() => 0));
    yTrue.forEach((tv, i) => {
      const ti = classes.indexOf(tv);
      const pi = classes.indexOf(yPred[i]);
      if (ti >= 0 && pi >= 0) cm[ti][pi]++;
    });
    return cm;
  }
  function mse(yTrue, yPred) {
    if (!yTrue.length) return 0;
    return yTrue.reduce((s, v, i) => s + (v - yPred[i]) ** 2, 0) / yTrue.length;
  }
  function rmse(yTrue, yPred) { return Math.sqrt(mse(yTrue, yPred)); }
  function mae(yTrue, yPred) {
    if (!yTrue.length) return 0;
    return yTrue.reduce((s, v, i) => s + Math.abs(v - yPred[i]), 0) / yTrue.length;
  }
  function r2Score(yTrue, yPred) {
    const m = Stats.mean(yTrue);
    const ssRes = yTrue.reduce((s, v, i) => s + (v - yPred[i]) ** 2, 0);
    const ssTot = yTrue.reduce((s, v) => s + (v - m) ** 2, 0);
    return ssTot ? 1 - ssRes / ssTot : 0;
  }
  function rocAuc(yTrue, yProb, positive = 1) {
    const sorted = yTrue.map((v, i) => ({ y: v, p: yProb[i] })).sort((a, b) => b.p - a.p);
    let auc = 0;
    const totalPos = yTrue.filter(v => v === positive).length;
    const totalNeg = yTrue.length - totalPos;
    let tp = 0, fp = 0, prevFpr = 0, prevTpr = 0;
    sorted.forEach(pt => {
      if (pt.y === positive) tp++; else fp++;
      const tpr = tp / totalPos, fpr = fp / totalNeg;
      auc += (fpr - prevFpr) * (tpr + prevTpr) / 2;
      prevFpr = fpr; prevTpr = tpr;
    });
    return auc;
  }
  function logisticRegression(X, y, options = {}) {
    const lr = options.learningRate || 0.01;
    const epochs = options.epochs || 1000;
    const reg = options.regularization || 0;
    const Xb = X.map(row => [1, ...row]);
    let weights = Array(Xb[0].length).fill(0);
    const sigmoid = z => 1 / (1 + Math.exp(-Math.max(-500, Math.min(500, z))));
    for (let epoch = 0; epoch < epochs; epoch++) {
      for (let i = 0; i < Xb.length; i++) {
        const z = weights.reduce((s, w, j) => s + w * Xb[i][j], 0);
        const pred = sigmoid(z);
        const error = y[i] - pred;
        for (let j = 0; j < weights.length; j++) weights[j] += lr * error * Xb[i][j] - lr * reg * weights[j];
      }
    }
    return {
      predict: (x) => sigmoid([1, ...x].reduce((s, v, j) => s + weights[j] * v, 0)),
      predictClass: (x, t = 0.5) => sigmoid([1, ...x].reduce((s, v, j) => s + weights[j] * v, 0)) >= t ? 1 : 0,
      weights, type: 'logistic-regression'
    };
  }
  function knn(X, y, k = 3) {
    return {
      k, X, y,
      predict: (x) => {
        const dists = X.map((row, i) => ({
          dist: Math.sqrt(row.reduce((s, v, j) => s + (v - x[j]) ** 2, 0)),
          label: y[i]
        })).sort((a, b) => a.dist - b.dist).slice(0, k);
        const counts = {};
        dists.forEach(d => { counts[d.label] = (counts[d.label] || 0) + 1; });
        return Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
      },
      type: 'knn'
    };
  }
  function naiveBayes(X, y) {
    const classes = [...new Set(y)];
    const classProbs = {};
    const featureStats = {};
    classes.forEach(c => {
      const indices = y.map((v, i) => v === c ? i : -1).filter(i => i >= 0);
      classProbs[c] = indices.length / y.length;
      featureStats[c] = [];
      for (let j = 0; j < X[0].length; j++) {
        const values = indices.map(i => X[i][j]);
        featureStats[c].push({ mean: Stats.mean(values), std: Math.max(Stats.std(values, false), 1e-6) });
      }
    });
    return {
      classes, classProbs, featureStats,
      predict: (x) => {
        const scores = {};
        classes.forEach(c => {
          let logP = Math.log(classProbs[c] + 1e-10);
          for (let j = 0; j < x.length; j++) {
            const s = featureStats[c][j];
            logP += -0.5 * Math.log(2 * Math.PI * s.std * s.std) - ((x[j] - s.mean) ** 2) / (2 * s.std * s.std);
          }
          scores[c] = logP;
        });
        return Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
      },
      type: 'naive-bayes'
    };
  }
  function decisionTree(X, y, options = {}) {
    const maxDepth = options.maxDepth || 5, minSamples = options.minSamples || 2;
    function gini(labels) {
      const counts = {};
      labels.forEach(l => { counts[l] = (counts[l] || 0) + 1; });
      let imp = 1;
      for (const k in counts) imp -= (counts[k] / labels.length) ** 2;
      return imp;
    }
    function bestSplit(X, y) {
      let bestGain = -1, bestFeature = -1, bestThreshold = 0;
      const baseGini = gini(y);
      for (let j = 0; j < X[0].length; j++) {
        const values = [...new Set(X.map(row => row[j]))].slice(0, 30);
        for (const t of values) {
          const left = X.map((row, i) => row[j] <= t ? i : -1).filter(i => i >= 0);
          const right = X.map((row, i) => row[j] > t ? i : -1).filter(i => i >= 0);
          if (left.length < minSamples || right.length < minSamples) continue;
          const gain = baseGini - (left.length / y.length) * gini(left.map(i => y[i])) - (right.length / y.length) * gini(right.map(i => y[i]));
          if (gain > bestGain) { bestGain = gain; bestFeature = j; bestThreshold = t; }
        }
      }
      return { feature: bestFeature, threshold: bestThreshold };
    }
    function build(X, y, depth = 0) {
      if (depth >= maxDepth || X.length < minSamples || new Set(y).size === 1) {
        const counts = {};
        y.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
        return { leaf: Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] };
      }
      const split = bestSplit(X, y);
      if (split.feature === -1) {
        const counts = {};
        y.forEach(v => { counts[v] = (counts[v] || 0) + 1; });
        return { leaf: Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] };
      }
      const leftX = [], leftY = [], rightX = [], rightY = [];
      X.forEach((row, i) => {
        if (row[split.feature] <= split.threshold) { leftX.push(row); leftY.push(y[i]); }
        else { rightX.push(row); rightY.push(y[i]); }
      });
      return {
        feature: split.feature, threshold: split.threshold,
        left: build(leftX, leftY, depth + 1), right: build(rightX, rightY, depth + 1)
      };
    }
    const tree = build(X, y);
    return {
      tree,
      predict: (x) => {
        let node = tree;
        while (!node.leaf) node = x[node.feature] <= node.threshold ? node.left : node.right;
        return node.leaf;
      },
      type: 'decision-tree'
    };
  }
  function randomForest(X, y, options = {}) {
    const nTrees = options.nTrees || 5;
    const maxDepth = options.maxDepth || 5;
    const trees = [];
    for (let t = 0; t < nTrees; t++) {
      const sample = Array(X.length).fill(0).map(() => Math.floor(Math.random() * X.length));
      trees.push(decisionTree(sample.map(i => X[i]), sample.map(i => y[i]), { maxDepth }));
    }
    return {
      trees,
      predict: (x) => {
        const votes = {};
        trees.forEach(t => {
          const pred = t.predict(x);
          votes[pred] = (votes[pred] || 0) + 1;
        });
        return Object.entries(votes).sort((a, b) => b[1] - a[1])[0][0];
      },
      type: 'random-forest'
    };
  }
  function linearRegression(X, y) {
    const Xb = X.map(row => [1, ...row]);
    const cols = Xb[0].length;
    const XtX = Array(cols).fill(0).map(() => Array(cols).fill(0));
    const Xty = Array(cols).fill(0);
    for (let i = 0; i < Xb.length; i++) {
      for (let j = 0; j < cols; j++) {
        Xty[j] += Xb[i][j] * y[i];
        for (let k = 0; k < cols; k++) XtX[j][k] += Xb[i][j] * Xb[i][k];
      }
    }
    const w = solveLinearSystem(XtX, Xty);
    return {
      weights: w,
      predict: (x) => w[0] + w.slice(1).reduce((s, wi, j) => s + wi * x[j], 0),
      type: 'linear-regression'
    };
  }
  function solveLinearSystem(A, b) {
    const n = A.length;
    const M = A.map((row, i) => [...row, b[i]]);
    for (let i = 0; i < n; i++) {
      let maxRow = i;
      for (let k = i + 1; k < n; k++) if (Math.abs(M[k][i]) > Math.abs(M[maxRow][i])) maxRow = k;
      [M[i], M[maxRow]] = [M[maxRow], M[i]];
      for (let k = i + 1; k < n; k++) {
        const factor = M[k][i] / M[i][i];
        for (let j = i; j <= n; j++) M[k][j] -= factor * M[i][j];
      }
    }
    const x = Array(n).fill(0);
    for (let i = n - 1; i >= 0; i--) {
      let sum = M[i][n];
      for (let j = i + 1; j < n; j++) sum -= M[i][j] * x[j];
      x[i] = sum / M[i][i];
    }
    return x;
  }
  function labelEncode(arr) {
    const unique = [...new Set(arr)];
    const mapping = {};
    unique.forEach((v, i) => { mapping[v] = i; });
    return { encoded: arr.map(v => mapping[v]), mapping, classes: unique };
  }
  function oneHotEncode(arr) {
    const unique = [...new Set(arr)];
    return arr.map(v => unique.map(u => u === v ? 1 : 0));
  }
  function selectKBest(X, y, k = 5) {
    const cols = X[0].length;
    const scores = Array(cols).fill(0);
    for (let j = 0; j < cols; j++) {
      const col = X.map(row => row[j]);
      const corr = Math.abs(Stats.pearson(col, y) || 0);
      scores[j] = isNaN(corr) ? 0 : corr;
    }
    const ranked = scores.map((s, j) => ({ score: s, idx: j }))
      .sort((a, b) => b.score - a.score).slice(0, k);
    const selectedX = X.map(row => ranked.map(r => row[r.idx]));
    return { selectedX, indices: ranked.map(r => r.idx), scores: ranked.map(r => r.score) };
  }
  function smote(X, y, targetClass, k = 5, ratio = 1) {
    const minorityIdx = y.map((v, i) => v === targetClass ? i : -1).filter(i => i >= 0);
    const minority = minorityIdx.map(i => X[i]);
    const nSynthetic = Math.floor(minority.length * ratio);
    const synthetic = [];
    for (let i = 0; i < nSynthetic; i++) {
      const sample = minority[Math.floor(Math.random() * minority.length)];
      const dists = minority.map((row, j) => ({ dist: Math.sqrt(row.reduce((s, v, k) => s + (v - sample[k]) ** 2, 0)), idx: j }))
        .sort((a, b) => a.dist - b.dist).slice(1, k + 1);
      const neighbor = minority[dists[Math.floor(Math.random() * dists.length)].idx];
      const alpha = Math.random();
      synthetic.push(sample.map((v, j) => v + alpha * (neighbor[j] - v)));
    }
    return { X: [...X, ...synthetic], y: [...y, ...Array(nSynthetic).fill(targetClass)], syntheticCount: nSynthetic };
  }
  function crossValidate(modelFactory, X, y, k = 5, isRegression = false) {
    const folds = kFoldSplit(X, y, k);
    const scores = [];
    folds.forEach(fold => {
      try {
        const model = modelFactory(fold.X_train, fold.y_train);
        const preds = fold.X_test.map(x => model.predict(x));
        scores.push(isRegression ? r2Score(fold.y_test, preds) : accuracy(fold.y_test, preds));
      } catch (e) { scores.push(0); }
    });
    return { mean: Stats.mean(scores), std: Stats.std(scores), scores, folds: k };
  }
  function autoML(X, y, problemType = 'classification') {
    const models = problemType === 'classification' ? [
      { name: 'Logistic Regression', factory: (X, y) => logisticRegression(X, y, { epochs: 500 }) },
      { name: 'KNN (k=3)', factory: (X, y) => knn(X, y, 3) },
      { name: 'KNN (k=5)', factory: (X, y) => knn(X, y, 5) },
      { name: 'Naive Bayes', factory: (X, y) => naiveBayes(X, y) },
      { name: 'Decision Tree', factory: (X, y) => decisionTree(X, y, { maxDepth: 5 }) },
      { name: 'Random Forest', factory: (X, y) => randomForest(X, y, { nTrees: 5, maxDepth: 5 }) }
    ] : [
      { name: 'Linear Regression', factory: (X, y) => linearRegression(X, y) }
    ];
    const results = [];
    models.forEach(model => {
      try {
        const start = performance.now();
        const { mean, std, scores } = crossValidate(model.factory, X, y, 5, problemType === 'regression');
        results.push({ name: model.name, cvScore: mean, cvStd: std, scores, time: performance.now() - start });
      } catch (e) { results.push({ name: model.name, error: e.message }); }
    });
    results.sort((a, b) => (b.cvScore || 0) - (a.cvScore || 0));
    return results;
  }
  window.ML = {
    splitTrainTest, kFoldSplit, standardize, normalize,
    accuracy, precision, recall, f1Score, confusionMatrix,
    mse, rmse, mae, r2Score, rocAuc,
    logisticRegression, knn, naiveBayes, decisionTree, randomForest, linearRegression,
    labelEncode, oneHotEncode, selectKBest, smote,
    crossValidate, autoML, solveLinearSystem
  };
  return window.ML;
})();
