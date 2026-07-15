/* =========================================================
   Calculator - JavaScript
   Handles: number/operator input, real-time display,
            clearing, backspace, keyboard support
   ========================================================= */

// ---------------------------------------------------------
// 1. State variables
// ---------------------------------------------------------
let firstOperand = null;     // number entered before the operator
let operator = null;         // "add" | "subtract" | "multiply" | "divide"
let secondOperand = "";      // digits typed after the operator (as a string)
let currentInput = "";       // digits typed before an operator is chosen
let justEvaluated = false;   // true right after pressing "="

// ---------------------------------------------------------
// 2. DOM references
// ---------------------------------------------------------
const expressionEl = document.getElementById("expression");
const resultEl = document.getElementById("result");
const buttons = document.querySelectorAll(".btn");

// Symbols shown on screen for each operator
const operatorSymbols = {
  add: "+",
  subtract: "\u2212",
  multiply: "\u00d7",
  divide: "\u00f7",
};

// ---------------------------------------------------------
// 3. Display update
// ---------------------------------------------------------
function updateDisplay() {
  // Build the small expression line, e.g. "12 + 4"
  if (operator) {
    const symbol = operatorSymbols[operator];
    expressionEl.textContent = `${firstOperand} ${symbol} ${secondOperand}`;
  } else {
    expressionEl.textContent = "";
  }

  // Big result line shows whatever is currently being typed
  if (operator) {
    resultEl.textContent = secondOperand === "" ? "0" : secondOperand;
  } else {
    resultEl.textContent = currentInput === "" ? "0" : currentInput;
  }
}

// ---------------------------------------------------------
// 4. Input handling
// ---------------------------------------------------------
function inputDigit(digit) {
  if (justEvaluated) {
    // Start a fresh calculation after pressing "="
    resetAll();
  }

  if (operator === null) {
    // Still typing the first number
    if (digit === "." && currentInput.includes(".")) return; // no double decimals
    currentInput += digit;
  } else {
    // Typing the second number
    if (digit === "." && secondOperand.includes(".")) return;
    secondOperand += digit;
  }

  updateDisplay();
}

function chooseOperator(action) {
  justEvaluated = false;

  // If an operator was already chosen and a second number typed,
  // evaluate first (supports chained calculations like 5 + 3 + 2)
  if (operator !== null && secondOperand !== "") {
    evaluate();
  }

  if (currentInput !== "") {
    firstOperand = parseFloat(currentInput);
  } else if (firstOperand === null) {
    firstOperand = 0;
  }

  operator = action;
  currentInput = "";
  secondOperand = "";
  updateDisplay();
}

function evaluate() {
  if (operator === null || secondOperand === "") return;

  const a = firstOperand;
  const b = parseFloat(secondOperand);
  let value;

  switch (operator) {
    case "add":
      value = a + b;
      break;
    case "subtract":
      value = a - b;
      break;
    case "multiply":
      value = a * b;
      break;
    case "divide":
      value = b === 0 ? "Error" : a / b;
      break;
    default:
      value = b;
  }

  // Round off small floating point errors (e.g. 0.1 + 0.2)
  if (typeof value === "number") {
    value = Math.round((value + Number.EPSILON) * 1e10) / 1e10;
  }

  expressionEl.textContent = `${a} ${operatorSymbols[operator]} ${b} =`;
  resultEl.textContent = value;

  // Store the result so it can be used if the user keeps typing an operator
  firstOperand = value === "Error" ? 0 : value;
  operator = null;
  secondOperand = "";
  currentInput = "";
  justEvaluated = true;
}

function clearAll() {
  resetAll();
  updateDisplay();
}

function clearEntry() {
  // Clears only the number currently being typed
  if (operator === null) {
    currentInput = "";
  } else {
    secondOperand = "";
  }
  updateDisplay();
}

function backspace() {
  if (operator === null) {
    currentInput = currentInput.slice(0, -1);
  } else {
    secondOperand = secondOperand.slice(0, -1);
  }
  updateDisplay();
}

function resetAll() {
  firstOperand = null;
  operator = null;
  secondOperand = "";
  currentInput = "";
  justEvaluated = false;
}

// ---------------------------------------------------------
// 5. Button click handling
// ---------------------------------------------------------
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    const value = button.getAttribute("data-value");
    const action = button.getAttribute("data-action");

    if (value !== null) {
      inputDigit(value);
    } else if (action) {
      handleAction(action);
    }
  });
});

function handleAction(action) {
  switch (action) {
    case "add":
    case "subtract":
    case "multiply":
    case "divide":
      chooseOperator(action);
      break;
    case "equals":
      evaluate();
      break;
    case "clear":
      clearAll();
      break;
    case "clear-entry":
      clearEntry();
      break;
    case "backspace":
      backspace();
      break;
  }
}

// ---------------------------------------------------------
// 6. Keyboard support (bonus feature)
// ---------------------------------------------------------
const keyToAction = {
  "+": "add",
  "-": "subtract",
  "*": "multiply",
  "/": "divide",
  "Enter": "equals",
  "=": "equals",
  "Backspace": "backspace",
  "Escape": "clear",
};

document.addEventListener("keydown", (event) => {
  const key = event.key;

  if (!isNaN(key) || key === ".") {
    inputDigit(key);
    flashButton(`[data-value="${key}"]`);
    return;
  }

  if (key in keyToAction) {
    event.preventDefault();
    const action = keyToAction[key];
    handleAction(action);
    flashButton(`[data-action="${action}"]`);
  }
});

// Briefly highlight the on-screen button matching a key press
function flashButton(selector) {
  const btn = document.querySelector(selector);
  if (!btn) return;
  btn.classList.add("pressed");
  setTimeout(() => btn.classList.remove("pressed"), 120);
}

// ---------------------------------------------------------
// 7. Initial render
// ---------------------------------------------------------
updateDisplay();
