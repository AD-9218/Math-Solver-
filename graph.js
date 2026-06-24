const graphInputKeys = ['equation', 'graphInput'];
const graphErrorKeys = ['error', 'graphExplanation'];
const supportedFunctions = new Set([
  'x', 'sin', 'cos', 'tan', 'asin', 'acos', 'atan', 'sqrt', 'log', 'abs', 'exp', 'pow', 'floor', 'ceil', 'round', 'max', 'min'
]);
let graphChart = window.graphChart || null;
console.log('graph.js loaded, Chart available:', typeof window.Chart !== 'undefined');

function getGraphInputElement() {
  return graphInputKeys.map((id) => document.getElementById(id)).find(Boolean);
}

function getGraphErrorElement() {
  return graphErrorKeys.map((id) => document.getElementById(id)).find(Boolean);
}

function clearGraphError() {
  const errorEl = getGraphErrorElement();
  if (errorEl) {
    errorEl.textContent = '';
    errorEl.classList.remove('error-message');
  }
}

function showGraphError(message) {
  const errorEl = getGraphErrorElement();
  if (errorEl) {
    errorEl.textContent = message;
    errorEl.classList.add('error-message');
  }
  if (typeof showError === 'function') {
    showError(message);
  }
}

function normalizeGraphExpression(raw) {
  const trimmed = raw.trim().toLowerCase();
  if (!trimmed) {
    throw new Error('Please enter equation');
  }

  if (!/^y\s*=/.test(trimmed)) {
    throw new Error('Use format like y=x^2');
  }

  const body = trimmed.replace(/^y\s*=\s*/, '').replace(/\^/g, '**').replace(/\s+/g, '');
  if (!body) {
    throw new Error('Please enter equation');
  }
  console.log('normalizeGraphExpression -> parsed body:', body);

  if (/[^0-9a-z+\-*/().,\s]/.test(body)) {
    throw new Error('Use valid math symbols and functions');
  }

  const identifiers = body.match(/[a-zA-Z]+/g) || [];
  for (const id of identifiers) {
    if (!supportedFunctions.has(id)) {
      throw new Error(`Unsupported function or symbol: ${id}`);
    }
  }

  const openParens = (body.match(/\(/g) || []).length;
  const closeParens = (body.match(/\)/g) || []).length;
  if (openParens !== closeParens) {
    throw new Error('Check parentheses for the equation');
  }

  return body;
}

function createGraphEvaluator(expression) {
  if (window.math && typeof window.math.compile === 'function') {
    try {
      const compiled = window.math.compile(expression);
      console.log('createGraphEvaluator -> using math.js for expression:', expression);
      return (x) => compiled.evaluate({ x });
    } catch (error) {
      console.error('createGraphEvaluator math.js compile error', error);
      throw new Error('Invalid equation');
    }
  }

  const jsExpression = expression.replace(/\b(pow|sin|cos|tan|asin|acos|atan|sqrt|log|abs|exp|floor|ceil|round|max|min)\b/g, 'Math.$1');
  console.log('createGraphEvaluator -> fallback JS expression:', jsExpression);

  try {
    return new Function('x', `return ${jsExpression};`);
  } catch (error) {
    console.error('createGraphEvaluator function creation error', error);
    throw new Error('Invalid equation');
  }
}

function generateGraphPoints(expression) {
  console.log('generateGraphPoints -> expression:', expression);
  const evaluator = createGraphEvaluator(expression);
  const points = [];

  for (let index = 0; index <= 40; index += 1) {
    const x = -10 + index * 0.5;
    let y;
    try {
      y = evaluator(x);
    } catch (evaluationError) {
      console.warn('generateGraphPoints -> evaluation skipped for x=', x, evaluationError);
      continue;
    }

    if (typeof y !== 'number' || !isFinite(y)) {
      console.warn('generateGraphPoints -> invalid y at x=', x, y);
      continue;
    }

    points.push({ x: Number(x.toFixed(2)), y: Number(y.toFixed(4)) });
  }

  console.log('generateGraphPoints -> points count:', points.length);

  if (points.length === 0) {
    throw new Error('Invalid equation');
  }

  return points;
}

function prepareGraphData(rawInput) {
  console.log('prepareGraphData -> rawInput:', rawInput);
  const expression = normalizeGraphExpression(rawInput);
  const points = generateGraphPoints(expression);

  const graphData = {
    labels: points.map((point) => point.x),
    values: points.map((point) => point.y),
    expressionLabel: `y = ${rawInput.trim()}`
  };
  console.log('prepareGraphData -> prepared graph data:', graphData.labels.length, 'points');
  return graphData;
}

function drawChart(xValues, yValues, equationLabel) {
  const canvas = document.getElementById('graphCanvas');
  if (!canvas) {
    throw new Error('Graph canvas not found');
  }

  if (graphChart) {
    graphChart.destroy();
    graphChart = null;
  }

  const ctx = canvas.getContext('2d');
  console.log('drawChart -> rendering chart with', xValues.length, 'x values and', yValues.length, 'y values');
  if (!window.Chart) {
    throw new Error('Chart.js is not loaded');
  }
  graphChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: xValues,
      datasets: [
        {
          label: equationLabel,
          data: yValues,
          borderColor: '#3f72af',
          backgroundColor: 'rgba(63,114,175,0.18)',
          pointRadius: 3,
          pointBackgroundColor: '#112d4e',
          tension: 0.4,
          borderWidth: 2,
          fill: true
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        title: {
          display: true,
          text: equationLabel,
          font: { size: 18 }
        },
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label(context) {
              return `y = ${context.parsed.y}`;
            }
          }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'X-axis'
          }
        },
        y: {
          title: {
            display: true,
            text: 'Y-axis'
          }
        }
      }
    }
  });
}

function plotGraph() {
  console.log('plotGraph called');
  const inputElement = getGraphInputElement();
  if (!inputElement) {
    console.error('plotGraph -> equation input element not found');
    throw new Error('Equation input not found');
  }

  clearGraphError();
  const rawEquation = inputElement.value || '';
  console.log('plotGraph -> input value:', rawEquation);

  try {
    const graphData = prepareGraphData(rawEquation);
    console.log('plotGraph -> graphData labels:', graphData.labels.slice(0, 5), '... values:', graphData.values.slice(0, 5));
    drawChart(graphData.labels, graphData.values, graphData.expressionLabel);

    const explanation = document.getElementById('graphExplanation');
    if (explanation) {
      explanation.innerHTML = `
        <div class="explanation-panel">
          <strong>Simple explanation:</strong> This graph shows how y changes with x.<br />
          <strong>Concept:</strong> Each point is found by replacing x in the equation and calculating y.<br />
          <strong>Easy method:</strong> choose x values from -10 to 10, compute y, then plot the curve.
        </div>
      `;
    }
  } catch (error) {
    console.error('plotGraph error:', error);
    showGraphError(error.message || 'Invalid equation');
  }
}

function clearGraph() {
  if (graphChart) {
    graphChart.destroy();
    graphChart = null;
  }

  const canvas = document.getElementById('graphCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  clearGraphError();
}

window.plotGraph = plotGraph;
window.drawChart = drawChart;
window.clearGraph = clearGraph;
window.prepareGraphData = prepareGraphData;
window.parseGraphExpression = normalizeGraphExpression;
