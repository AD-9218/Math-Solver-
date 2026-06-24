// // Test script for normalizeMathText function
// function normalizeMathText(text) {
//   if (!text) return '';

//   // Debug log: Raw OCR
//   console.log("Raw OCR:", text);

//   // Step 1: Remove unwanted text (common OCR prefixes/suffixes)
//   let filtered = text
//     .replace(/\b(question|solve|equation|problem|find|calculate|what|is|the|value|of|answer|for)\b/gi, '')
//     .replace(/\s+/g, ' ')
//     .trim();

//   // Debug log: Filtered
//   console.log("Filtered:", filtered);

//   // Step 2: Fix common OCR mistakes
//   filtered = filtered
//     .replace(/[zZ]/g, 'x')  // z → x
//     .replace(/[Ss]/g, '5')  // S → 5
//     .replace(/[Oo]/g, '0')  // O → 0
//     .replace(/[×]/g, '*')
//     .replace(/÷/g, '/')
//     .replace(/[–−]/g, '-')
//     .replace(/x²/gi, 'x^2')
//     .replace(/[^0-9a-zA-Z^=+\-*/(). ]/g, ' ')
//     .trim();

//   // Step 3: Extract equation part (look for pattern with = and x)
//   // Find the longest substring that contains = and x (likely the equation)
//   const words = filtered.split(/\s+/);
//   let equationPart = '';
//   let maxLength = 0;

//   // Try to find equation by looking for patterns with =
//   for (let i = 0; i < words.length; i++) {
//     for (let j = i + 1; j <= words.length; j++) {
//       const candidate = words.slice(i, j).join('');
//       if (candidate.includes('=') && candidate.match(/[0-9x]/) && candidate.length > maxLength) {
//         equationPart = candidate;
//         maxLength = candidate.length;
//       }
//     }
//   }

//   // If no equation found with above method, try regex
//   if (!equationPart) {
//     const equationMatch = filtered.match(/([0-9x+\-*/=().\s]{3,})/i);
//     if (equationMatch) {
//       equationPart = equationMatch[1].trim();
//     }
//   }

//   filtered = equationPart || filtered;

//   // Step 4: Clean format
//   filtered = filtered
//     .replace(/\s*\^\s*/g, '^')
//     .replace(/\s*([+\-*/=()])\s*/g, '$1')
//     .replace(/([0-9])x/gi, '$1*x')
//     .replace(/(^|[+\-*/=])x/gi, '$11*x')
//     .replace(/\s+/g, '');

//   // Step 5: Validation
//   if (!filtered.includes('=')) {
//     console.log("Final equation:", filtered, "- No = found");
//     return '';
//   }
//   if (!filtered.includes('x')) {
//     console.log("Final equation:", filtered, "- No x variable found");
//     return '';
//   }

//   // Debug log: Final equation
//   console.log("Final equation:", filtered);

//   return filtered;
// }

// // Test cases
// console.log("=== Test Case 1: Basic OCR with extra text ===");
// normalizeMathText("Question Solve the equation 2z+5=15");

// console.log("\n=== Test Case 2: OCR mistakes ===");
// normalizeMathText("2S + O = 10");

// console.log("\n=== Test Case 3: Already clean ===");
// normalizeMathText("3x - 7 = 11");

// console.log("\n=== Test Case 4: Complex text ===");
// normalizeMathText("Please solve this equation: 4x + 2 = 18 for x");

// console.log("\n=== Test Case 5: No equation ===");
// normalizeMathText("This is just some text without equation");
// ------------------------------------------------------------------------------------
// Test script for normalizeMathText function
// function normalizeMathText(text) {
//   if (!text) return '';

//   console.log("Raw OCR:", text);

//   // Step 1: Remove unwanted text
//   let filtered = text
//     .replace(/\b(question|solve|equation|problem|find|calculate|what|is|the|value|of|answer|for)\b/gi, '')
//     .replace(/\s+/g, ' ')
//     .trim();

//   console.log("Filtered:", filtered);

//   // Step 2: Fix common mistakes
//   filtered = filtered
//     .replace(/[zZ]/g, 'x')  // z → x
//     .replace(/[Ss]/g, '5')  // S → 5
//     .replace(/[Oo]/g, '0')  // O → 0
//     .replace(/[×]/g, '*')
//     .replace(/÷/g, '/')
//     .replace(/[–−]/g, '-')
//     .replace(/x²/gi, 'x^2')
//     .replace(/[^0-9a-zA-Z^=+\-*/(). ]/g, ' ')
//     .trim();

//   // Step 3: Extract equation part
//   const words = filtered.split(/\s+/);
//   let equationPart = '';
//   let maxLength = 0;

//   for (let i = 0; i < words.length; i++) {
//     for (let j = i + 1; j <= words.length; j++) {
//       const candidate = words.slice(i, j).join('');
//       if (candidate.includes('=') && candidate.match(/[0-9x]/) && candidate.length > maxLength) {
//         equationPart = candidate;
//         maxLength = candidate.length;
//       }
//     }
//   }

//   if (!equationPart) {
//     const equationMatch = filtered.match(/([0-9x+\-*/=().\s]{3,})/i);
//     if (equationMatch) {
//       equationPart = equationMatch[1].trim();
//     }
//   }

//   filtered = equationPart || filtered;

//   // Step 4: Clean format
//   filtered = filtered
//     .replace(/\s*\^\s*/g, '^')
//     .replace(/\s*([+\-*/=()])\s*/g, '$1')
//     .replace(/([0-9])x/gi, '$1*x')
//     .replace(/(^|[+\-*/=])x/gi, '$11*x')
//     .replace(/\s+/g, '');

//   // Step 5: Validation
//   if (!filtered.includes('=')) {
//     console.log("Final equation:", filtered, "- No = found");
//     return filtered; // Fallback to raw string text for alternative expression calculation
//   }
  
//   console.log("Final equation:", filtered);
//   return filtered;
// }

//-------------------------------------------------------

// Test script for normalizeMathText function
function normalizeMathText(text) {
  if (!text) return '';

  console.log("Raw OCR:", text);

  // Step 1: બિનજરૂરી અંગ્રેજી શબ્દો દૂર કરો
  let filtered = text
    .replace(/\b(question|solve|equation|problem|find|calculate|what|is|the|value|of|answer|for)\b/gi, '')
    .replace(/\s+/g, ' ')
    .trim();

  console.log("Filtered:", filtered);

  // Step 2: OCR ની ભૂલો સુધારો (ખાસ કરીને x2 ને x^2 માં બદલો)
  filtered = filtered
    .replace(/[zZ]/g, 'x')  // z → x
    .replace(/[Ss]/g, '5')  // S → 5
    .replace(/[Oo]/g, '0')  // O → 0
    .replace(/[×]/g, '*')
    .replace(/÷/g, '/')
    .replace(/[–−]/g, '-')
    .replace(/x²/gi, 'x^2')
    // જો OCR ભૂલથી ઘાત કાઢીને x2 લખે, તો તેને x^2 માં કન્વર્ટ કરો
    .replace(/x2/gi, 'x^2') 
    .replace(/[^0-9a-zA-Z^=+\-*/(). ]/g, ' ')
    .trim();

  // Step 3: સ્પેસિંગ અને ગુણાકાર ચિહ્ન (*) બરાબર ગોઠવો
  filtered = filtered
    .replace(/\s*\^\s*/g, '^')
    .replace(/\s*([+\-*/=()])\s*/g, '$1')
    // સંખ્યા અને x વચ્ચે ગુણાકાર મૂકો, પણ x^2 ને અસર ન થાય તેનું ધ્યાન રાખશે
    .replace(/([0-9])x([^0-9^]|$)/gi, '$1*x$2')
    .replace(/\s+/g, '');

  console.log("Final equation:", filtered);
  return filtered;
}