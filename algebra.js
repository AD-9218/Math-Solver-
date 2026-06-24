function safeEvalExpression(expr) {
  const sanitized = expr.replace(/\s+/g, '').replace(/\^/g, '**');
  if (/[^0-9xX\+\-\*\/\^\.\=\(\) ]/.test(expr)) {
    throw new Error('Invalid characters in expression');
  }
  return sanitized;
}

function solveLinearEquation(equation) {
  const clean = equation.replace(/\s+/g, '').toLowerCase();
  if (!clean.includes('=')) {
    return { error: 'Equation must include an equals sign (=).' };
  }
  const [left, right] = clean.split('=');
  const termValues = (side) => {
    let xcoeff = 0;
    let constant = 0;
    const parts = side.replace(/-/g, '+-').split('+').filter(Boolean);
    parts.forEach((part) => {
      if (part.includes('x')) {
        const value = part.replace('x', '') || '1';
        if (value === '-') xcoeff -= 1;
        else xcoeff += parseFloat(value);
      } else {
        constant += parseFloat(part);
      }
    });
    return { xcoeff, constant };
  };

  const leftTerms = termValues(left);
  const rightTerms = termValues(right);
  const combinedX = leftTerms.xcoeff - rightTerms.xcoeff;
  const combinedConst = rightTerms.constant - leftTerms.constant;
  if (combinedX === 0) {
    return { error: 'No unique solution available.' };
  }
  const solution = combinedConst / combinedX;
  return {
    step1: `Move constants: (${clean}) -> ${combinedX}x = ${combinedConst}`,
    step2: `Solve variable: x = ${combinedConst} ÷ ${combinedX}`,
    final: `x = ${Number(solution.toFixed(4))}`,
    value: Number(solution.toFixed(4))
  };
}

function simplifyLinearExpression(expr) {
  const clean = expr.replace(/\s+/g, '').replace(/\-/, '+-');
  const parts = clean.replace(/-/g, '+-').split('+').filter(Boolean);
  let xcoeff = 0;
  let constant = 0;
  parts.forEach((part) => {
    if (part.includes('x')) {
      const value = part.replace('x', '') || '1';
      xcoeff += parseFloat(value);
    } else {
      constant += parseFloat(part);
    }
  });
  const xpart = xcoeff === 0 ? '' : `${xcoeff === 1 ? '' : xcoeff}x`;
  const cpart = constant === 0 ? '' : `${constant > 0 ? '+' : ''}${constant}`;
  const result = xpart + cpart;
  return {
    original: expr,
    simplified: result || '0',
    steps: [
      `Separate similar terms in ${expr}`,
      `Combine x terms and constants`,
      `Simplified result: ${result || '0'}`
    ]
  };
}

function formatAlgebraExplanation(solution, type) {
  if (type === 'equation') {
    return `<div class=\"step-card\"><strong>Step 1:</strong> ${solution.step1}</div>
      <div class=\"step-card\"><strong>Step 2:</strong> ${solution.step2}</div>
      <div class=\"step-card\"><strong>Final Answer:</strong> ${solution.final}</div>
      <div class=\"explanation-panel\"><strong>Simple explanation:</strong> Move all terms to isolate x, then divide by coefficient.<br><strong>Concept:</strong> Balance both sides of the equation. <br><strong>Easy method:</strong> keep x terms on one side and constants on the other.</div>`;
  }
  return `<div class=\"step-card\"><strong>Steps:</strong> ${solution.steps.join(' → ')}</div>
      <div class=\"explanation-panel\"><strong>Simple explanation:</strong> Combine like terms to simplify the expression. <br><strong>Concept:</strong> Add or subtract coefficients for the same variable.<br><strong>Easy method:</strong> group x terms and constants separately.</div>`;
}

window.solveLinearEquation = solveLinearEquation;
window.simplifyLinearExpression = simplifyLinearExpression;
window.formatAlgebraExplanation = formatAlgebraExplanation;
