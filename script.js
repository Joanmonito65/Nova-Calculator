const expressionEl = document.querySelector("#expression");
const resultEl = document.querySelector("#result");
const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll(".panel")];
const angleButtons = [...document.querySelectorAll("[data-angle]")];
const memoryIndicator = document.querySelector("#memoryIndicator");
const historyList = document.querySelector("#historyList");
const historyCount = document.querySelector("#historyCount");
const clearHistoryButton = document.querySelector("#clearHistory");
const themeToggle = document.querySelector("#themeToggle");
const copyResult = document.querySelector("#copyResult");

const converterType = document.querySelector("#converterType");
const converterInput = document.querySelector("#converterInput");
const converterOutput = document.querySelector("#converterOutput");
const fromUnit = document.querySelector("#fromUnit");
const toUnit = document.querySelector("#toUnit");
const swapUnits = document.querySelector("#swapUnits");

const state = {
  expression: "0",
  angleMode: "DEG",
  memory: null,
  history: [],
  justEvaluated: false,
};

const units = {
  length: {
    base: "meter",
    units: {
      millimeter: 0.001,
      centimeter: 0.01,
      meter: 1,
      kilometer: 1000,
      inch: 0.0254,
      foot: 0.3048,
      yard: 0.9144,
      mile: 1609.344,
    },
  },
  weight: {
    base: "gram",
    units: {
      milligram: 0.001,
      gram: 1,
      kilogram: 1000,
      ounce: 28.349523125,
      pound: 453.59237,
      stone: 6350.29318,
    },
  },
  temperature: {
    base: "celsius",
    units: {
      celsius: "celsius",
      fahrenheit: "fahrenheit",
      kelvin: "kelvin",
    },
  },
  data: {
    base: "byte",
    units: {
      bit: 0.125,
      byte: 1,
      kilobyte: 1000,
      megabyte: 1000000,
      gigabyte: 1000000000,
      kibibyte: 1024,
      mebibyte: 1048576,
      gibibyte: 1073741824,
    },
  },
};

const unitLabels = {
  millimeter: "Millimeters",
  centimeter: "Centimeters",
  meter: "Meters",
  kilometer: "Kilometers",
  inch: "Inches",
  foot: "Feet",
  yard: "Yards",
  mile: "Miles",
  milligram: "Milligrams",
  gram: "Grams",
  kilogram: "Kilograms",
  ounce: "Ounces",
  pound: "Pounds",
  stone: "Stone",
  celsius: "Celsius",
  fahrenheit: "Fahrenheit",
  kelvin: "Kelvin",
  bit: "Bits",
  byte: "Bytes",
  kilobyte: "Kilobytes",
  megabyte: "Megabytes",
  gigabyte: "Gigabytes",
  kibibyte: "Kibibytes",
  mebibyte: "Mebibytes",
  gibibyte: "Gibibytes",
};

const operators = new Set(["+", "-", "*", "/", "^"]);
const functions = new Set([
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sqrt",
  "log",
  "ln",
]);

function render() {
  expressionEl.textContent = displayExpression(state.expression);

  try {
    resultEl.textContent = formatNumber(evaluateExpression(state.expression));
  } catch {
    resultEl.textContent = "Ready";
  }

  memoryIndicator.textContent =
    state.memory === null ? "MEM empty" : `MEM ${formatNumber(state.memory)}`;
}

function displayExpression(value) {
  return value
    .replaceAll("*", "x")
    .replaceAll("/", "\u00f7")
    .replaceAll("pi", "\u03c0")
    .replaceAll("sqrt", "\u221a")
    .replaceAll("Infinity", "\u221e");
}

function setExpression(value) {
  state.expression = sanitizeExpression(value);
  render();
}

function sanitizeExpression(value) {
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : "0";
}

function insertToken(token) {
  const current = state.expression;

  if (state.justEvaluated && !operators.has(token) && token !== ")") {
    state.expression = "0";
  }

  state.justEvaluated = false;

  if (state.expression === "0") {
    if (operators.has(token) && token !== "-") return;
    if (token === ".") {
      setExpression("0.");
      return;
    }
    if (token !== ")") {
      setExpression(token);
      return;
    }
  }

  if (operators.has(token)) {
    const last = current.at(-1);
    if (operators.has(last)) {
      setExpression(current.slice(0, -1) + token);
      return;
    }
  }

  if (token === "." && numberChunk(current).includes(".")) return;

  setExpression(state.expression + token);
}

function insertFunction(name) {
  if (state.justEvaluated) {
    state.expression = "0";
    state.justEvaluated = false;
  }

  if (state.expression === "0") {
    setExpression(`${name}(`);
    return;
  }

  const last = state.expression.at(-1);
  const separator = /[0-9.)ie]/.test(last) ? "*" : "";
  setExpression(`${state.expression}${separator}${name}(`);
}

function numberChunk(value) {
  const match = value.match(/(\d+\.?\d*|\.\d*)$/);
  return match ? match[0] : "";
}

function clearExpression() {
  state.justEvaluated = false;
  setExpression("0");
}

function backspace() {
  if (state.justEvaluated || state.expression.length <= 1) {
    clearExpression();
    return;
  }

  setExpression(state.expression.slice(0, -1));
}

function negateExpression() {
  if (state.expression === "0") return;
  setExpression(`-(${state.expression})`);
}

function wrapExpression(prefix, suffix = "") {
  if (state.expression === "0") return;
  setExpression(`${prefix}(${state.expression})${suffix}`);
}

function applyPercent() {
  wrapExpression("", "/100");
}

function applyFactorial() {
  wrapExpression("fact");
}

function applySquare() {
  wrapExpression("", "^2");
}

function applyReciprocal() {
  wrapExpression("1/");
}

function insertRandom() {
  insertToken(toExpressionNumber(Math.random()));
}

function evaluateAndStore() {
  const input = state.expression;
  const value = evaluateExpression(input);

  if (!Number.isFinite(value)) {
    throw new Error("Result is not finite");
  }

  state.history.unshift({
    expression: input,
    answer: value,
    time: new Date(),
  });
  state.history = state.history.slice(0, 30);
  state.justEvaluated = true;
  state.expression = toExpressionNumber(value);
  renderHistory();
  render();
}

function evaluateExpression(input) {
  const parser = new ExpressionParser(input, state.angleMode);
  return parser.parse();
}

function formatNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "Error";
  if (!Number.isFinite(value)) return value > 0 ? "Infinity" : "-Infinity";
  if (Object.is(value, -0)) return "0";
  const abs = Math.abs(value);

  if ((abs >= 1e10 || (abs > 0 && abs < 1e-8))) {
    return value.toExponential(8).replace(/\.?0+e/, "e");
  }

  return new Intl.NumberFormat("en-US", {
    maximumFractionDigits: 10,
  }).format(value);
}

function toExpressionNumber(value) {
  if (!Number.isFinite(value)) return String(value);
  if (Object.is(value, -0)) return "0";
  const abs = Math.abs(value);

  if (abs >= 1e12 || (abs > 0 && abs < 1e-10)) {
    return value.toExponential(12).replace(/\.?0+e/, "e");
  }

  return Number(value.toPrecision(14)).toString();
}

function renderHistory() {
  historyList.innerHTML = "";
  historyCount.textContent = state.history.length
    ? `${state.history.length} calculation${state.history.length === 1 ? "" : "s"}`
    : "No calculations yet";

  state.history.forEach((item) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "history-item";
    button.addEventListener("click", () => {
      state.expression = toExpressionNumber(item.answer);
      render();
    });

    const expression = document.createElement("span");
    expression.className = "history-expression";
    expression.textContent = displayExpression(item.expression);

    const answer = document.createElement("span");
    answer.className = "history-answer";
    answer.textContent = formatNumber(item.answer);

    button.append(expression, answer);

    const row = document.createElement("li");
    row.append(button);
    historyList.append(row);
  });
}

function setAngleMode(mode) {
  state.angleMode = mode;
  angleButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.angle === mode);
  });
  render();
}

function handleAction(action) {
  try {
    if (action === "clear") clearExpression();
    if (action === "backspace") backspace();
    if (action === "equals") evaluateAndStore();
    if (action === "negate") negateExpression();
    if (action === "percent") applyPercent();
    if (action === "factorial") applyFactorial();
    if (action === "square") applySquare();
    if (action === "reciprocal") applyReciprocal();
    if (action === "random") insertRandom();
  } catch {
    resultEl.textContent = "Error";
  }
}

function handleMemory(action) {
  let current = 0;

  try {
    current = evaluateExpression(state.expression);
  } catch {
    current = 0;
  }

  if (action === "clear") state.memory = null;
  if (action === "store") state.memory = current;
  if (action === "add") state.memory = (state.memory ?? 0) + current;
  if (action === "subtract") state.memory = (state.memory ?? 0) - current;
  if (action === "recall" && state.memory !== null) {
    insertToken(toExpressionNumber(state.memory));
  }

  render();
}

function switchPanel(name) {
  tabs.forEach((tab) => {
    tab.classList.toggle("is-active", tab.dataset.panel === name);
  });
  panels.forEach((panel) => {
    panel.classList.toggle("is-active", panel.dataset.panelName === name);
  });
}

function loadUnits() {
  const type = converterType.value;
  const unitNames = Object.keys(units[type].units);
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  unitNames.forEach((unitName, index) => {
    const fromOption = new Option(unitLabels[unitName], unitName);
    const toOption = new Option(unitLabels[unitName], unitName);
    fromUnit.add(fromOption);
    toUnit.add(toOption);

    if (index === 1) {
      toOption.selected = true;
    }
  });

  calculateConversion();
}

function calculateConversion() {
  const value = Number(converterInput.value);

  if (!Number.isFinite(value)) {
    converterOutput.textContent = "Enter a number";
    return;
  }

  const type = converterType.value;

  if (type === "temperature") {
    converterOutput.textContent = formatNumber(
      convertTemperature(value, fromUnit.value, toUnit.value),
    );
    return;
  }

  const fromFactor = units[type].units[fromUnit.value];
  const toFactor = units[type].units[toUnit.value];
  converterOutput.textContent = formatNumber((value * fromFactor) / toFactor);
}

function convertTemperature(value, from, to) {
  let celsius = value;
  if (from === "fahrenheit") celsius = (value - 32) * (5 / 9);
  if (from === "kelvin") celsius = value - 273.15;

  if (to === "fahrenheit") return celsius * (9 / 5) + 32;
  if (to === "kelvin") return celsius + 273.15;
  return celsius;
}

class ExpressionParser {
  constructor(input, angleMode) {
    this.tokens = this.tokenize(input);
    this.position = 0;
    this.angleMode = angleMode;
  }

  parse() {
    const value = this.parseExpression();
    if (this.position < this.tokens.length) {
      throw new Error("Unexpected token");
    }
    return value;
  }

  tokenize(input) {
    const tokens = [];
    let cursor = 0;

    while (cursor < input.length) {
      const char = input[cursor];

      if (/\s/.test(char)) {
        cursor += 1;
        continue;
      }

      if (/[0-9.]/.test(char)) {
        let number = char;
        cursor += 1;
        while (cursor < input.length && /[0-9.]/.test(input[cursor])) {
          number += input[cursor];
          cursor += 1;
        }
        tokens.push({ type: "number", value: Number(number) });
        continue;
      }

      if (/[a-z]/i.test(char)) {
        let word = char;
        cursor += 1;
        while (cursor < input.length && /[a-z]/i.test(input[cursor])) {
          word += input[cursor];
          cursor += 1;
        }
        tokens.push({ type: "word", value: word });
        continue;
      }

      if ("+-*/^(),".includes(char)) {
        tokens.push({ type: char, value: char });
        cursor += 1;
        continue;
      }

      throw new Error(`Invalid character: ${char}`);
    }

    return tokens;
  }

  peek(type) {
    return this.tokens[this.position]?.type === type;
  }

  consume(type) {
    if (!this.peek(type)) {
      throw new Error(`Expected ${type}`);
    }
    return this.tokens[this.position++];
  }

  match(type) {
    if (this.peek(type)) {
      this.position += 1;
      return true;
    }
    return false;
  }

  parseExpression() {
    let value = this.parseTerm();

    while (this.peek("+") || this.peek("-")) {
      if (this.match("+")) value += this.parseTerm();
      if (this.match("-")) value -= this.parseTerm();
    }

    return value;
  }

  parseTerm() {
    let value = this.parsePower();

    while (this.peek("*") || this.peek("/") || this.startsImplicitProduct()) {
      if (this.match("*")) value *= this.parsePower();
      else if (this.match("/")) value /= this.parsePower();
      else value *= this.parsePower();
    }

    return value;
  }

  startsImplicitProduct() {
    const token = this.tokens[this.position];
    if (!token) return false;
    return token.type === "number" || token.type === "word" || token.type === "(";
  }

  parsePower() {
    let value = this.parseUnary();

    if (this.match("^")) {
      value = Math.pow(value, this.parsePower());
    }

    return value;
  }

  parseUnary() {
    if (this.match("+")) return this.parseUnary();
    if (this.match("-")) return -this.parseUnary();
    return this.parsePrimary();
  }

  parsePrimary() {
    if (this.peek("number")) return this.consume("number").value;

    if (this.peek("word")) {
      const word = this.consume("word").value;

      if (word === "pi") return Math.PI;
      if (word === "e") return Math.E;
      if (word === "fact") {
        this.consume("(");
        const value = this.parseExpression();
        this.consume(")");
        return factorial(value);
      }

      if (functions.has(word)) {
        this.consume("(");
        const value = this.parseExpression();
        this.consume(")");
        return this.applyFunction(word, value);
      }

      throw new Error(`Unknown function: ${word}`);
    }

    if (this.match("(")) {
      const value = this.parseExpression();
      this.consume(")");
      return value;
    }

    throw new Error("Expected value");
  }

  applyFunction(name, value) {
    const trigValue = this.angleMode === "DEG" ? (value * Math.PI) / 180 : value;

    if (name === "sin") return Math.sin(trigValue);
    if (name === "cos") return Math.cos(trigValue);
    if (name === "tan") return Math.tan(trigValue);
    if (name === "asin") return this.fromRadians(Math.asin(value));
    if (name === "acos") return this.fromRadians(Math.acos(value));
    if (name === "atan") return this.fromRadians(Math.atan(value));
    if (name === "sqrt") return Math.sqrt(value);
    if (name === "log") return Math.log10(value);
    if (name === "ln") return Math.log(value);
    throw new Error(`Unsupported function: ${name}`);
  }

  fromRadians(value) {
    return this.angleMode === "DEG" ? (value * 180) / Math.PI : value;
  }
}

function factorial(value) {
  if (!Number.isInteger(value) || value < 0 || value > 170) {
    throw new Error("Factorial requires an integer from 0 to 170");
  }

  let result = 1;
  for (let index = 2; index <= value; index += 1) {
    result *= index;
  }
  return result;
}

document.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button) return;

  if (button.dataset.insert) insertToken(button.dataset.insert);
  if (button.dataset.fn) insertFunction(button.dataset.fn);
  if (button.dataset.action) handleAction(button.dataset.action);
  if (button.dataset.memory) handleMemory(button.dataset.memory);
  if (button.dataset.panel) switchPanel(button.dataset.panel);
  if (button.dataset.angle) setAngleMode(button.dataset.angle);
});

document.addEventListener("keydown", (event) => {
  const allowed = "0123456789.+-*/^()";

  if (allowed.includes(event.key)) {
    event.preventDefault();
    insertToken(event.key);
  }

  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    handleAction("equals");
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    backspace();
  }

  if (event.key === "Escape") {
    event.preventDefault();
    clearExpression();
  }
});

clearHistoryButton.addEventListener("click", () => {
  state.history = [];
  renderHistory();
});

themeToggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
  themeToggle.querySelector("span").textContent = document.body.classList.contains("dark")
    ? "☼"
    : "☾";
});

copyResult.addEventListener("click", async () => {
  const text = resultEl.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyResult.title = "Copied";
    setTimeout(() => {
      copyResult.title = "Copy result";
    }, 1200);
  } catch {
    copyResult.title = "Copy failed";
  }
});

converterType.addEventListener("change", loadUnits);
converterInput.addEventListener("input", calculateConversion);
fromUnit.addEventListener("change", calculateConversion);
toUnit.addEventListener("change", calculateConversion);
swapUnits.addEventListener("click", () => {
  const previous = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = previous;
  calculateConversion();
});

loadUnits();
renderHistory();
render();
