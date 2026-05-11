const expressionEl = document.querySelector("#expression");
const resultEl = document.querySelector("#result");
const tabs = [...document.querySelectorAll(".tab")];
const panels = [...document.querySelectorAll(".panel")];
const angleButtons = [...document.querySelectorAll("[data-angle]")];
const memoryIndicator = document.querySelector("#memoryIndicator");
const notesPanel = document.querySelector("#notesPanel");
const notesInput = document.querySelector("#notesInput");

const historyList = document.querySelector("#historyList");
const historyCount = document.querySelector("#historyCount");
const clearHistoryButton = document.querySelector("#clearHistory");
const selectHistoryButton = document.querySelector("#selectHistory");
const selectAllHistoryButton = document.querySelector("#selectAllHistory");
const deleteSelectedHistoryButton = document.querySelector("#deleteSelectedHistory");
const confirmDialog = document.querySelector("#confirmDialog");
const confirmMessage = document.querySelector("#confirmMessage");
const cancelDeleteButton = document.querySelector("#cancelDelete");
const confirmDeleteButton = document.querySelector("#confirmDelete");

const settingsOpen = document.querySelector("#settingsOpen");
const settingsClose = document.querySelector("#settingsClose");
const settingsDrawer = document.querySelector("#settingsDrawer");
const themeToggle = document.querySelector("#themeToggle");
const copyResult = document.querySelector("#copyResult");

const converterType = document.querySelector("#converterType");
const converterInput = document.querySelector("#converterInput");
const converterOutput = document.querySelector("#converterOutput");
const fromUnit = document.querySelector("#fromUnit");
const toUnit = document.querySelector("#toUnit");
const swapUnits = document.querySelector("#swapUnits");

const fontSelect = document.querySelector("#fontSelect");
const themeEditorSelect = document.querySelector("#themeEditorSelect");
const resetUiSettings = document.querySelector("#resetUiSettings");
const resetAllSettings = document.querySelector("#resetAllSettings");
const uiColorInputs = [...document.querySelectorAll("[data-ui-color]")];
const appWidthInput = document.querySelector("#appWidthInput");
const appPaddingInput = document.querySelector("#appPaddingInput");
const panelGapInput = document.querySelector("#panelGapInput");
const appRadiusInput = document.querySelector("#appRadiusInput");
const buttonRadiusInput = document.querySelector("#buttonRadiusInput");
const keyHeightInput = document.querySelector("#keyHeightInput");
const displayHeightInput = document.querySelector("#displayHeightInput");
const displayTextInput = document.querySelector("#displayTextInput");
const keyTextInput = document.querySelector("#keyTextInput");
const buttonGapInput = document.querySelector("#buttonGapInput");
const borderWidthInput = document.querySelector("#borderWidthInput");

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

const state = {
  expression: "0",
  angleMode: "DEG",
  memory: null,
  history: [],
  selectedHistoryIds: new Set(),
  historySelectionMode: false,
  pendingDeleteIds: [],
  answerVisible: false,
  lastExpression: "",
  lastAnswer: null,
  errorMessage: "",
  converterSource: "from",
};

const defaultSettings = {
  fractions: false,
  improperFractions: false,
  commas: true,
  europeanSeparator: false,
  wrongAnswersOnly: false,
  wordForm: false,
  pemdas: true,
  autoCloseParen: true,
  notes: false,
  iteratedFactorials: false,
  zerosBeforeDecimals: true,
  decimalPrecision: 15,
  sciThreshold: 11,
};

const settings = { ...defaultSettings };

const STORAGE_KEY = "novaCalculatorState.v2";
const storage = window.localStorage;

const lightUiDefaults = {
  "--bg": "#f4f7fb",
  "--surface": "#ffffff",
  "--surface-strong": "#eef3f9",
  "--ink": "#132034",
  "--muted": "#66758a",
  "--line": "#d8e0ea",
  "--accent": "#0f8b8d",
  "--accent-strong": "#0b6f70",
  "--operator-bg": "#9ccfd0",
  "--equals-bg": "#0f8b8d",
  "--constant-bg": "#ffe5ad",
  "--glow": "#ffb000",
  "--danger": "#ce3f58",
  "--app-width": "1120px",
  "--app-padding": "22px",
  "--panel-gap": "18px",
  "--app-radius": "24px",
  "--control-radius": "16px",
  "--key-height": "72",
  "--display-height": "296px",
  "--display-font-size": "76",
  "--key-font-size": "20",
  "--button-gap": "10px",
  "--border-width": "1px",
  "--font-family": fontSelect.value,
};

const darkUiDefaults = {
  ...lightUiDefaults,
  "--bg": "#101419",
  "--surface": "#171f28",
  "--surface-strong": "#202a35",
  "--ink": "#f3f7fb",
  "--muted": "#9aaabd",
  "--line": "#314052",
  "--accent": "#45c4b0",
  "--accent-strong": "#70dbc9",
  "--operator-bg": "#70c4bd",
  "--equals-bg": "#0f8b8d",
  "--constant-bg": "#ffc857",
  "--glow": "#ffc857",
  "--danger": "#ff6f8e",
};

const themeDefaults = {
  light: lightUiDefaults,
  dark: darkUiDefaults,
};

const uiThemes = {
  light: { ...lightUiDefaults },
  dark: { ...darkUiDefaults },
};

const rangeDefaults = {
  appWidthInput: "1120",
  appPaddingInput: "22",
  panelGapInput: "18",
  appRadiusInput: "24",
  buttonRadiusInput: "16",
  keyHeightInput: "72",
  displayHeightInput: "296",
  displayTextInput: "76",
  keyTextInput: "20",
  buttonGapInput: "10",
  borderWidthInput: "1",
};

let currentTheme = "light";
let editingTheme = "light";
let isRestoring = true;
let savedConverterState = null;

const units = {
  length: {
    defaults: ["centimeter", "meter"],
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
    defaults: ["pound", "kilogram"],
    units: {
      milligram: 0.001,
      gram: 1,
      kilogram: 1000,
      ounce: 28.349523125,
      pound: 453.59237,
      stone: 6350.29318,
      ton_us: 907184.74,
    },
  },
  temperature: {
    defaults: ["fahrenheit", "celsius"],
    units: {
      celsius: "celsius",
      fahrenheit: "fahrenheit",
      kelvin: "kelvin",
    },
  },
  time: {
    defaults: ["minute", "second"],
    units: {
      millisecond: 0.001,
      second: 1,
      minute: 60,
      hour: 3600,
      day: 86400,
      week: 604800,
      year: 31557600,
    },
  },
  speed: {
    defaults: ["mile_per_hour", "kilometer_per_hour"],
    units: {
      meter_per_second: 1,
      kilometer_per_hour: 0.2777777777777778,
      mile_per_hour: 0.44704,
      foot_per_second: 0.3048,
      knot: 0.5144444444444445,
    },
  },
  pressure: {
    defaults: ["psi", "pascal"],
    units: {
      pascal: 1,
      kilopascal: 1000,
      bar: 100000,
      atmosphere: 101325,
      psi: 6894.757293168,
      torr: 133.3223684211,
    },
  },
  area: {
    defaults: ["square_foot", "square_meter"],
    units: {
      square_millimeter: 0.000001,
      square_centimeter: 0.0001,
      square_meter: 1,
      square_kilometer: 1000000,
      square_inch: 0.00064516,
      square_foot: 0.09290304,
      acre: 4046.8564224,
      hectare: 10000,
    },
  },
  volume: {
    defaults: ["gallon_us", "liter"],
    units: {
      milliliter: 0.001,
      liter: 1,
      cubic_meter: 1000,
      teaspoon_us: 0.00492892159375,
      tablespoon_us: 0.01478676478125,
      fluid_ounce_us: 0.0295735295625,
      cup_us: 0.2365882365,
      pint_us: 0.473176473,
      quart_us: 0.946352946,
      gallon_us: 3.785411784,
    },
  },
  energy: {
    defaults: ["kilowatt_hour", "joule"],
    units: {
      joule: 1,
      kilojoule: 1000,
      calorie: 4.184,
      kilocalorie: 4184,
      watt_hour: 3600,
      kilowatt_hour: 3600000,
      btu: 1055.05585262,
    },
  },
  power: {
    defaults: ["horsepower", "watt"],
    units: {
      watt: 1,
      kilowatt: 1000,
      megawatt: 1000000,
      horsepower: 745.699871582,
      btu_per_hour: 0.293071070172,
    },
  },
  data: {
    defaults: ["megabyte", "byte"],
    units: {
      bit: 0.125,
      byte: 1,
      kilobyte: 1000,
      megabyte: 1000000,
      gigabyte: 1000000000,
      terabyte: 1000000000000,
      kibibyte: 1024,
      mebibyte: 1048576,
      gibibyte: 1073741824,
      tebibyte: 1099511627776,
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
  ton_us: "US Tons",
  celsius: "Celsius",
  fahrenheit: "Fahrenheit",
  kelvin: "Kelvin",
  millisecond: "Milliseconds",
  second: "Seconds",
  minute: "Minutes",
  hour: "Hours",
  day: "Days",
  week: "Weeks",
  year: "Years",
  meter_per_second: "Meters/second",
  kilometer_per_hour: "Kilometers/hour",
  mile_per_hour: "Miles/hour",
  foot_per_second: "Feet/second",
  knot: "Knots",
  pascal: "Pascals",
  kilopascal: "Kilopascals",
  bar: "Bars",
  atmosphere: "Atmospheres",
  psi: "PSI",
  torr: "Torr",
  square_millimeter: "Square millimeters",
  square_centimeter: "Square centimeters",
  square_meter: "Square meters",
  square_kilometer: "Square kilometers",
  square_inch: "Square inches",
  square_foot: "Square feet",
  acre: "Acres",
  hectare: "Hectares",
  milliliter: "Milliliters",
  liter: "Liters",
  cubic_meter: "Cubic meters",
  teaspoon_us: "US teaspoons",
  tablespoon_us: "US tablespoons",
  fluid_ounce_us: "US fluid ounces",
  cup_us: "US cups",
  pint_us: "US pints",
  quart_us: "US quarts",
  gallon_us: "US gallons",
  joule: "Joules",
  kilojoule: "Kilojoules",
  calorie: "Calories",
  kilocalorie: "Kilocalories",
  watt_hour: "Watt-hours",
  kilowatt_hour: "Kilowatt-hours",
  btu: "BTU",
  watt: "Watts",
  kilowatt: "Kilowatts",
  megawatt: "Megawatts",
  horsepower: "Horsepower",
  btu_per_hour: "BTU/hour",
  bit: "Bits",
  byte: "Bytes",
  kilobyte: "Kilobytes",
  megabyte: "Megabytes",
  gigabyte: "Gigabytes",
  terabyte: "Terabytes",
  kibibyte: "Kibibytes",
  mebibyte: "Mebibytes",
  gibibyte: "Gibibytes",
  tebibyte: "Tebibytes",
};

function render() {
  angleButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.angle === state.angleMode);
  });

  if (state.errorMessage) {
    expressionEl.textContent = "Error";
    resultEl.textContent = state.errorMessage;
    resultEl.setAttribute("aria-readonly", "true");
  } else if (state.answerVisible) {
    expressionEl.textContent = `${displayExpression(state.lastExpression)} =`;
    resultEl.textContent = formatAnswer(state.lastAnswer);
    resultEl.setAttribute("aria-readonly", "true");
  } else {
    expressionEl.textContent = "Expression";
    resultEl.textContent = displayExpression(state.expression);
    resultEl.removeAttribute("aria-readonly");
  }

  memoryIndicator.textContent =
    state.memory === null ? "MEM empty" : `MEM ${formatAnswer(state.memory)}`;
  notesPanel.classList.toggle("is-hidden", !settings.notes);
  updateToggleUi();
  saveAppState();
}

function syncEditableDisplay() {
  state.errorMessage = "";
  state.answerVisible = false;
  state.expression = sanitizeExpression(resultEl.textContent);
  resultEl.textContent = displayExpression(state.expression);
  expressionEl.textContent = "Expression";
  moveCaretToEnd(resultEl);
  saveAppState();
}

function moveCaretToEnd(element) {
  const selection = window.getSelection();
  if (!selection) return;

  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  selection.removeAllRanges();
  selection.addRange(range);
}

function displayExpression(value) {
  return String(value)
    .replaceAll("*", "x")
    .replaceAll("/", "÷")
    .replaceAll("sqrt", "√")
    .replaceAll("pi", "π")
    .replaceAll("Infinity", "inf");
}

function setExpression(value) {
  state.errorMessage = "";
  state.answerVisible = false;
  state.expression = sanitizeExpression(value);
  render();
}

function sanitizeExpression(value) {
  const trimmed = String(value)
    .trim()
    .replaceAll(",", "")
    .replaceAll("÷", "/")
    .replaceAll("√", "sqrt")
    .replaceAll("π", "pi")
    .replaceAll("x", "*")
    .replaceAll("X", "*");
  return trimmed.length ? trimmed : "0";
}

function insertToken(token) {
  if (state.answerVisible) {
    if (operators.has(token)) {
      state.answerVisible = false;
    } else {
      state.expression = "0";
      state.answerVisible = false;
    }
  }

  state.errorMessage = "";
  const current = state.expression;

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
  if (state.answerVisible) {
    state.expression = "0";
    state.answerVisible = false;
  }

  state.errorMessage = "";

  if (state.expression === "0") {
    setExpression(`${name}(`);
    return;
  }

  const last = state.expression.at(-1);
  const separator = /[0-9.)!ie]/.test(last) ? "*" : "";
  setExpression(`${state.expression}${separator}${name}(`);
}

function numberChunk(value) {
  const match = value.match(/(\d+\.?\d*|\.\d*)$/);
  return match ? match[0] : "";
}

function clearExpression() {
  state.errorMessage = "";
  state.answerVisible = false;
  state.lastExpression = "";
  state.lastAnswer = null;
  state.expression = "0";
  render();
}

function backspace() {
  if (state.answerVisible || state.expression.length <= 1) {
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
  if (state.expression === "0") return;
  setExpression(`${state.expression}!`);
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
  const input = prepareExpressionForEvaluation(state.expression);
  const actualValue = evaluateExpression(input);

  if (!Number.isFinite(actualValue)) {
    throw new Error("Result is not finite");
  }

  const shownValue = settings.wrongAnswersOnly
    ? makeWrongAnswer(actualValue)
    : actualValue;

  state.history.unshift({
    id: crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    expression: input,
    answer: shownValue,
    actualAnswer: actualValue,
    createdAt: new Date().toISOString(),
  });
  state.history = state.history.slice(0, 10000);
  state.lastExpression = input;
  state.lastAnswer = shownValue;
  state.expression = toExpressionNumber(shownValue);
  state.answerVisible = true;
  state.errorMessage = "";
  renderHistory();
  render();
}

function prepareExpressionForEvaluation(input) {
  if (!settings.autoCloseParen) return input;
  const opens = [...input].filter((char) => char === "(").length;
  const closes = [...input].filter((char) => char === ")").length;
  if (opens <= closes) return input;
  return `${input}${")".repeat(opens - closes)}`;
}

function evaluateExpression(input) {
  const parser = new ExpressionParser(input, {
    angleMode: state.angleMode,
    usePemdas: settings.pemdas,
    iteratedFactorials: settings.iteratedFactorials,
  });
  return parser.parse();
}

function makeWrongAnswer(value) {
  if (!Number.isFinite(value)) return value;
  const nudge = Math.max(1, Math.abs(value) * 0.07);
  return value + nudge;
}

function formatAnswer(value) {
  if (settings.wordForm) return numberToWords(value);
  if (settings.fractions && Number.isFinite(value)) {
    return toFractionString(value, settings.improperFractions);
  }
  return formatNumber(value);
}

function formatNumber(value) {
  if (typeof value !== "number" || Number.isNaN(value)) return "Error";
  if (!Number.isFinite(value)) return value > 0 ? "Infinity" : "-Infinity";
  if (Object.is(value, -0)) return "0";

  const precision = clamp(settings.decimalPrecision, 0, 15);
  const abs = Math.abs(value);
  const sciLimit = Math.pow(10, clamp(settings.sciThreshold, 1, 20));
  let text;

  if (abs >= sciLimit || (abs > 0 && abs < Math.pow(10, -Math.max(precision, 1)))) {
    text = value.toExponential(precision).replace(/\.?0+e/, "e");
    if (settings.europeanSeparator) text = text.replace(".", ",");
  } else {
    text = new Intl.NumberFormat(settings.europeanSeparator ? "de-DE" : "en-US", {
      useGrouping: settings.commas,
      maximumFractionDigits: precision,
    }).format(value);
  }

  if (!settings.zerosBeforeDecimals) {
    const decimalMark = settings.europeanSeparator ? "," : ".";
    if (text.startsWith(`0${decimalMark}`)) text = text.slice(1);
    if (text.startsWith(`-0${decimalMark}`)) text = `-${text.slice(2)}`;
  }

  return text;
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

function toInputNumber(value) {
  if (!Number.isFinite(value)) return "";
  if (Object.is(value, -0)) return "0";
  return Number(value.toPrecision(14)).toString();
}

function toFractionString(value, improper) {
  const sign = value < 0 ? "-" : "";
  const fraction = approximateFraction(Math.abs(value), 10000);
  if (!fraction) return formatNumber(value);

  const [numerator, denominator] = fraction;
  if (denominator === 1) return `${sign}${numerator}`;
  if (improper || numerator < denominator) {
    return `${sign}${numerator}/${denominator}`;
  }

  const whole = Math.floor(numerator / denominator);
  const remainder = numerator % denominator;
  if (remainder === 0) return `${sign}${whole}`;
  return `${sign}${whole} ${remainder}/${denominator}`;
}

function approximateFraction(value, maxDenominator) {
  if (!Number.isFinite(value)) return null;
  const roundedInteger = Math.round(value);
  if (Math.abs(value - roundedInteger) < 1e-12) return [roundedInteger, 1];

  const normalized = Number(value.toPrecision(14));
  const decimal = normalized.toString();
  const decimalFraction = decimal.includes("e") ? null : fractionFromDecimalString(decimal);

  let h1 = 1;
  let h2 = 0;
  let k1 = 0;
  let k2 = 1;
  let b = normalized;

  for (let index = 0; index < 32; index += 1) {
    const a = Math.floor(b);
    const h = a * h1 + h2;
    const k = a * k1 + k2;
    if (k > maxDenominator) break;

    h2 = h1;
    h1 = h;
    k2 = k1;
    k1 = k;

    const remainder = b - a;
    if (Math.abs(normalized - h1 / k1) < 1e-12 || remainder === 0) break;
    b = 1 / remainder;
  }

  const continued = reduceFraction(h1, k1);
  if (!decimalFraction) return continued;
  const decimalError = Math.abs(normalized - decimalFraction[0] / decimalFraction[1]);
  const continuedError = Math.abs(normalized - continued[0] / continued[1]);
  if (continued[1] <= maxDenominator && continuedError < 1e-10) return continued;
  return continuedError <= decimalError ? continued : decimalFraction;
}

function fractionFromDecimalString(text) {
  const [wholeText, decimalText = ""] = text.split(".");
  if (!decimalText.length) return [Number(wholeText), 1];

  const denominator = 10 ** decimalText.length;
  const numerator = Math.round(Number(text) * denominator);
  return reduceFraction(numerator, denominator);
}

function reduceFraction(numerator, denominator) {
  const divisor = gcd(Math.abs(numerator), Math.abs(denominator));
  return [numerator / divisor, denominator / divisor];
}

function gcd(a, b) {
  while (b) {
    const next = a % b;
    a = b;
    b = next;
  }
  return a || 1;
}

function numberToWords(value) {
  if (!Number.isFinite(value)) return formatNumber(value);
  if (Math.abs(value) >= 1e15) return formatNumber(value);

  const sign = value < 0 ? "negative " : "";
  const normalized = toExpressionNumber(Math.abs(value));
  if (normalized.includes("e")) return formatNumber(value);

  const [integerText, decimalText = ""] = normalized.split(".");
  const integerWords = integerToWords(Number(integerText));

  if (!decimalText.length) return `${sign}${integerWords}`;
  const digitWords = decimalText
    .replace(/0+$/, "")
    .split("")
    .map((digit) => smallNumberWords[Number(digit)])
    .join(" ");
  return `${sign}${integerWords} point ${digitWords || "zero"}`;
}

const smallNumberWords = [
  "zero",
  "one",
  "two",
  "three",
  "four",
  "five",
  "six",
  "seven",
  "eight",
  "nine",
  "ten",
  "eleven",
  "twelve",
  "thirteen",
  "fourteen",
  "fifteen",
  "sixteen",
  "seventeen",
  "eighteen",
  "nineteen",
];

const tensWords = [
  "",
  "",
  "twenty",
  "thirty",
  "forty",
  "fifty",
  "sixty",
  "seventy",
  "eighty",
  "ninety",
];

function integerToWords(value) {
  if (value < 20) return smallNumberWords[value];
  if (value < 100) {
    const tens = Math.floor(value / 10);
    const rest = value % 10;
    return rest ? `${tensWords[tens]}-${smallNumberWords[rest]}` : tensWords[tens];
  }
  if (value < 1000) {
    const hundreds = Math.floor(value / 100);
    const rest = value % 100;
    return rest
      ? `${smallNumberWords[hundreds]} hundred ${integerToWords(rest)}`
      : `${smallNumberWords[hundreds]} hundred`;
  }

  const scales = [
    [1000000000000, "trillion"],
    [1000000000, "billion"],
    [1000000, "million"],
    [1000, "thousand"],
  ];

  for (const [scaleValue, scaleName] of scales) {
    if (value >= scaleValue) {
      const major = Math.floor(value / scaleValue);
      const rest = value % scaleValue;
      return rest
        ? `${integerToWords(major)} ${scaleName} ${integerToWords(rest)}`
        : `${integerToWords(major)} ${scaleName}`;
    }
  }

  return String(value);
}

function renderHistory() {
  historyList.innerHTML = "";
  const selectedCount = state.selectedHistoryIds.size;
  historyCount.textContent = state.historySelectionMode
    ? `${selectedCount} selected of ${state.history.length}`
    : state.history.length
      ? `${state.history.length} calculation${state.history.length === 1 ? "" : "s"}`
      : "No calculations yet";

  selectHistoryButton.textContent = state.historySelectionMode ? "Done" : "Select";
  selectAllHistoryButton.classList.toggle("is-hidden", !state.historySelectionMode);
  deleteSelectedHistoryButton.classList.toggle("is-hidden", !state.historySelectionMode);
  selectAllHistoryButton.textContent =
    selectedCount === state.history.length && state.history.length ? "Clear Selection" : "Select All";

  state.history.forEach((item) => {
    const row = document.createElement("li");
    row.className = "history-row";
    row.classList.toggle("is-selecting", state.historySelectionMode);

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "history-checkbox";
    checkbox.checked = state.selectedHistoryIds.has(item.id);
    checkbox.addEventListener("change", () => toggleHistorySelection(item.id));

    const button = document.createElement("button");
    button.type = "button";
    button.className = "history-item";
    button.addEventListener("click", () => {
      if (state.historySelectionMode) {
        toggleHistorySelection(item.id);
        return;
      }

      state.expression = toExpressionNumber(item.answer);
      state.lastExpression = item.expression;
      state.lastAnswer = item.answer;
      state.answerVisible = true;
      state.errorMessage = "";
      render();
    });

    const date = document.createElement("span");
    date.className = "history-date";
    date.textContent = formatHistoryDate(item.createdAt);

    const expression = document.createElement("span");
    expression.className = "history-expression";
    expression.textContent = displayExpression(item.expression);

    const answer = document.createElement("span");
    answer.className = "history-answer";
    answer.textContent = formatAnswer(item.answer);

    button.append(date, expression, answer);
    row.append(checkbox, button);
    historyList.append(row);
  });
  saveAppState();
}

function formatHistoryDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function toggleHistorySelection(id) {
  if (state.selectedHistoryIds.has(id)) state.selectedHistoryIds.delete(id);
  else state.selectedHistoryIds.add(id);
  renderHistory();
}

function setHistorySelectionMode(enabled) {
  state.historySelectionMode = enabled;
  if (!enabled) state.selectedHistoryIds.clear();
  renderHistory();
}

function openDeleteDialog(ids) {
  if (!ids.length) return;
  state.pendingDeleteIds = ids;
  confirmMessage.textContent =
    ids.length === state.history.length
      ? "This will delete every calculation in history."
      : `This will delete ${ids.length} selected calculation${ids.length === 1 ? "" : "s"}.`;
  confirmDialog.classList.remove("is-hidden");
}

function closeDeleteDialog() {
  state.pendingDeleteIds = [];
  confirmDialog.classList.add("is-hidden");
}

function deletePendingHistory() {
  const ids = new Set(state.pendingDeleteIds);
  state.history = state.history.filter((item) => !ids.has(item.id));
  state.selectedHistoryIds.clear();
  state.historySelectionMode = false;
  closeDeleteDialog();
  renderHistory();
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
  } catch (error) {
    state.errorMessage = error.message || "Could not calculate";
    state.answerVisible = false;
    render();
  }
}

function handleMemory(action) {
  let current = 0;

  try {
    current = evaluateExpression(prepareExpressionForEvaluation(state.expression));
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
  saveAppState();
}

function loadUnits() {
  const type = converterType.value;
  const unitNames = Object.keys(units[type].units);
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  unitNames.forEach((unitName) => {
    fromUnit.add(new Option(unitLabels[unitName], unitName));
    toUnit.add(new Option(unitLabels[unitName], unitName));
  });

  const [defaultFrom, defaultTo] = units[type].defaults;
  fromUnit.value = defaultFrom;
  toUnit.value = defaultTo;
  state.converterSource = "from";
  updateConversion("from");
}

function updateConversion(source) {
  state.converterSource = source;
  const type = converterType.value;
  const sourceInput = source === "from" ? converterInput : converterOutput;
  const targetInput = source === "from" ? converterOutput : converterInput;
  const sourceUnit = source === "from" ? fromUnit.value : toUnit.value;
  const targetUnit = source === "from" ? toUnit.value : fromUnit.value;
  const value = Number(sourceInput.value);

  if (!Number.isFinite(value)) {
    targetInput.value = "";
    saveAppState();
    return;
  }

  targetInput.value = toInputNumber(convertUnit(value, type, sourceUnit, targetUnit));
  saveAppState();
}

function convertUnit(value, type, from, to) {
  if (type === "temperature") return convertTemperature(value, from, to);
  const fromFactor = units[type].units[from];
  const toFactor = units[type].units[to];
  return (value * fromFactor) / toFactor;
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
  constructor(input, options) {
    this.tokens = this.tokenize(input);
    this.position = 0;
    this.angleMode = options.angleMode;
    this.usePemdas = options.usePemdas;
    this.iteratedFactorials = options.iteratedFactorials;
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
        const number = this.readNumber(input, cursor);
        tokens.push({ type: "number", value: Number(number.text) });
        cursor = number.cursor;
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

      if ("+-*/^(),!".includes(char)) {
        tokens.push({ type: char, value: char });
        cursor += 1;
        continue;
      }

      throw new Error(`Invalid character: ${char}`);
    }

    return tokens;
  }

  readNumber(input, start) {
    let cursor = start;
    let text = "";
    let hasDot = false;

    while (cursor < input.length && /[0-9.]/.test(input[cursor])) {
      if (input[cursor] === ".") {
        if (hasDot) throw new Error("Invalid number");
        hasDot = true;
      }
      text += input[cursor];
      cursor += 1;
    }

    if ((input[cursor] === "e" || input[cursor] === "E") && /[+\-0-9]/.test(input[cursor + 1] || "")) {
      text += input[cursor];
      cursor += 1;
      if (input[cursor] === "+" || input[cursor] === "-") {
        text += input[cursor];
        cursor += 1;
      }
      if (!/[0-9]/.test(input[cursor] || "")) throw new Error("Invalid exponent");
      while (cursor < input.length && /[0-9]/.test(input[cursor])) {
        text += input[cursor];
        cursor += 1;
      }
    }

    if (text === ".") throw new Error("Invalid number");
    return { text, cursor };
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
    return this.usePemdas ? this.parsePemdasExpression() : this.parseLinearExpression();
  }

  parsePemdasExpression() {
    let value = this.parseTerm();

    while (this.peek("+") || this.peek("-")) {
      if (this.match("+")) value += this.parseTerm();
      else if (this.match("-")) value -= this.parseTerm();
    }

    return value;
  }

  parseLinearExpression() {
    let value = this.parseUnary();

    while (
      this.peek("+") ||
      this.peek("-") ||
      this.peek("*") ||
      this.peek("/") ||
      this.peek("^") ||
      this.startsImplicitProduct()
    ) {
      if (this.match("+")) value += this.parseUnary();
      else if (this.match("-")) value -= this.parseUnary();
      else if (this.match("*")) value *= this.parseUnary();
      else if (this.match("/")) value /= this.parseUnary();
      else if (this.match("^")) value = Math.pow(value, this.parseUnary());
      else value *= this.parseUnary();
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
    return this.parsePostfix();
  }

  parsePostfix() {
    let value = this.parsePrimary();
    let factorialCount = 0;

    while (this.match("!")) {
      factorialCount += 1;
      if (factorialCount > 1 && !this.iteratedFactorials) {
        throw new Error("Turn on iterated factorials first");
      }
      value = factorial(value);
    }

    return value;
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

function updateToggleUi() {
  setToggle("fractionToggle", "fractionToggleText", "Fractions", settings.fractions);
  setToggle("improperToggle", "improperToggleText", "Improper Fractions", settings.improperFractions);
  setToggle("commasToggle", "commasToggleText", "Commas", settings.commas);
  setToggle("separatorToggle", "separatorToggleText", "European Style", settings.europeanSeparator);
  setToggle("wrongAnswersToggle", "wrongAnswersToggleText", "Wrong Answers Only", settings.wrongAnswersOnly);
  setToggle("wordFormToggle", "wordFormToggleText", "Number Word Form", settings.wordForm);
  setToggle("pedmasToggle", "pedmasToggleText", "PEMDAS", settings.pemdas);
  setToggle("autoCloseParenToggle", "autoCloseParenToggleText", "Auto-Close Parentheses", settings.autoCloseParen);
  setToggle("notesToggle", "notesToggleText", "Notes", settings.notes);
  setToggle("factorialToggle", "factorialToggleText", "Iterated Factorials", settings.iteratedFactorials);
  setToggle("zerosToggle", "zerosToggleText", "Zeros Before Decimals", settings.zerosBeforeDecimals);

  document.querySelector("#improperToggle").style.display = settings.fractions ? "flex" : "none";
  document.querySelector("#decimalPrecisionInput").value = settings.decimalPrecision;
  document.querySelector("#sciThresholdInput").value = settings.sciThreshold;
}

function setToggle(buttonId, textId, label, active) {
  const button = document.querySelector(`#${buttonId}`);
  const text = document.querySelector(`#${textId}`);
  if (!button || !text) return;
  button.classList.toggle("on", active);
  text.textContent = `${label}: ${active ? "ON" : "OFF"}`;
}

function toggleFractions() {
  settings.fractions = !settings.fractions;
  if (settings.fractions) settings.wordForm = false;
  render();
  renderHistory();
}

function toggleImproper() {
  settings.improperFractions = !settings.improperFractions;
  render();
  renderHistory();
}

function toggleCommas() {
  settings.commas = !settings.commas;
  render();
  renderHistory();
}

function toggleSeparator() {
  settings.europeanSeparator = !settings.europeanSeparator;
  render();
  renderHistory();
}

function toggleWrongAnswers() {
  settings.wrongAnswersOnly = !settings.wrongAnswersOnly;
  render();
}

function toggleWordForm() {
  settings.wordForm = !settings.wordForm;
  if (settings.wordForm) settings.fractions = false;
  render();
  renderHistory();
}

function togglePemdas() {
  settings.pemdas = !settings.pemdas;
  render();
}

function toggleAutoCloseParen() {
  settings.autoCloseParen = !settings.autoCloseParen;
  render();
}

function toggleNotes() {
  settings.notes = !settings.notes;
  render();
}

function toggleFactorialMode() {
  settings.iteratedFactorials = !settings.iteratedFactorials;
  render();
}

function toggleZerosBeforeDecimals() {
  settings.zerosBeforeDecimals = !settings.zerosBeforeDecimals;
  render();
  renderHistory();
}

function updateDecimalPrecision(value) {
  settings.decimalPrecision = clamp(Number(value), 0, 15);
  render();
  renderHistory();
}

function updateSciThreshold(value) {
  settings.sciThreshold = clamp(Number(value), 1, 20);
  render();
  renderHistory();
}

const rangeBindings = [
  { input: appWidthInput, property: "--app-width", unit: "px" },
  { input: appPaddingInput, property: "--app-padding", unit: "px" },
  { input: panelGapInput, property: "--panel-gap", unit: "px" },
  { input: appRadiusInput, property: "--app-radius", unit: "px" },
  { input: buttonRadiusInput, property: "--control-radius", unit: "px" },
  { input: keyHeightInput, property: "--key-height", unit: "" },
  { input: displayHeightInput, property: "--display-height", unit: "px" },
  { input: displayTextInput, property: "--display-font-size", unit: "" },
  { input: keyTextInput, property: "--key-font-size", unit: "" },
  { input: buttonGapInput, property: "--button-gap", unit: "px" },
  { input: borderWidthInput, property: "--border-width", unit: "px" },
];

function applyUiSetting(name, value) {
  document.body.style.setProperty(name, value);
}

function applyThemeToDocument(themeName = currentTheme) {
  currentTheme = themeName === "dark" ? "dark" : "light";
  document.body.classList.toggle("dark", currentTheme === "dark");

  Object.entries(uiThemes[currentTheme]).forEach(([name, value]) => {
    applyUiSetting(name, value);
  });
}

function setEditingTheme(themeName) {
  editingTheme = themeName === "dark" ? "dark" : "light";
  themeEditorSelect.value = editingTheme;
  syncThemeControls();
  saveAppState();
}

function syncThemeControls() {
  const theme = uiThemes[editingTheme];
  uiColorInputs.forEach((input) => {
    input.value = theme[input.dataset.uiColor] || themeDefaults[editingTheme][input.dataset.uiColor];
  });

  fontSelect.value = theme["--font-family"] || themeDefaults[editingTheme]["--font-family"];

  rangeBindings.forEach(({ input, property }) => {
    const value = theme[property] || themeDefaults[editingTheme][property];
    input.value = String(value).replace("px", "");
  });
}

function setThemeValue(name, value) {
  uiThemes[editingTheme][name] = value;
  if (editingTheme === currentTheme) applyUiSetting(name, value);
  saveAppState();
}

function applyRangeSettings() {
  rangeBindings.forEach(({ input, property, unit }) => {
    setThemeValue(property, `${input.value}${unit}`);
  });
}

function resetUi() {
  uiThemes[editingTheme] = { ...themeDefaults[editingTheme] };
  if (editingTheme === currentTheme) applyThemeToDocument(currentTheme);
  syncThemeControls();
  saveAppState();
}

function resetAll() {
  Object.assign(settings, defaultSettings);
  uiThemes.light = { ...lightUiDefaults };
  uiThemes.dark = { ...darkUiDefaults };
  currentTheme = "light";
  editingTheme = "light";
  document.body.classList.remove("dark");
  applyThemeToDocument(currentTheme);
  syncThemeControls();
  render();
  renderHistory();
  saveAppState();
}

function saveAppState() {
  if (isRestoring) return;

  const activeTab = tabs.find((tab) => tab.classList.contains("is-active"))?.dataset.panel || "basic";
  const data = {
    settings,
    uiThemes,
    currentTheme,
    editingTheme,
    notes: notesInput.value,
    activePanel: activeTab,
    calculator: {
      expression: state.expression,
      angleMode: state.angleMode,
      memory: state.memory,
      history: state.history,
      answerVisible: state.answerVisible,
      lastExpression: state.lastExpression,
      lastAnswer: state.lastAnswer,
      errorMessage: state.errorMessage,
    },
    converter: {
      type: converterType.value,
      fromUnit: fromUnit.value,
      toUnit: toUnit.value,
      input: converterInput.value,
      output: converterOutput.value,
      source: state.converterSource,
    },
  };

  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
    // Saving is best-effort so the calculator still works in private or restricted contexts.
  }
}

function loadSavedState() {
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return;

    const data = JSON.parse(raw);
    Object.assign(settings, { ...defaultSettings, ...(data.settings || {}) });
    Object.assign(uiThemes.light, { ...lightUiDefaults, ...(data.uiThemes?.light || {}) });
    Object.assign(uiThemes.dark, { ...darkUiDefaults, ...(data.uiThemes?.dark || {}) });

    currentTheme = data.currentTheme === "dark" ? "dark" : "light";
    editingTheme = data.editingTheme === "dark" ? "dark" : currentTheme;
    notesInput.value = data.notes || "";

    if (data.calculator) {
      state.expression = sanitizeExpression(data.calculator.expression || "0");
      state.angleMode = data.calculator.angleMode === "RAD" ? "RAD" : "DEG";
      state.memory = typeof data.calculator.memory === "number" ? data.calculator.memory : null;
      state.history = Array.isArray(data.calculator.history) ? data.calculator.history : [];
      state.answerVisible = Boolean(data.calculator.answerVisible);
      state.lastExpression = data.calculator.lastExpression || "";
      state.lastAnswer =
        typeof data.calculator.lastAnswer === "number" ? data.calculator.lastAnswer : null;
      state.errorMessage = data.calculator.errorMessage || "";
    }

    if (data.converter) {
      savedConverterState = data.converter;
      if (units[data.converter.type]) converterType.value = data.converter.type;
    }

    if (data.activePanel) switchPanel(data.activePanel);
  } catch {
    savedConverterState = null;
  }
}

function restoreConverterState() {
  if (!savedConverterState) return;

  if (fromUnit.querySelector(`option[value="${CSS.escape(savedConverterState.fromUnit || "")}"]`)) {
    fromUnit.value = savedConverterState.fromUnit;
  }
  if (toUnit.querySelector(`option[value="${CSS.escape(savedConverterState.toUnit || "")}"]`)) {
    toUnit.value = savedConverterState.toUnit;
  }

  converterInput.value = savedConverterState.input ?? converterInput.value;
  converterOutput.value = savedConverterState.output ?? converterOutput.value;
  state.converterSource = savedConverterState.source === "to" ? "to" : "from";
  updateConversion(state.converterSource);
}

function openSettings() {
  settingsDrawer.classList.add("is-open");
  settingsDrawer.setAttribute("aria-hidden", "false");
}

function closeSettings() {
  settingsDrawer.classList.remove("is-open");
  settingsDrawer.setAttribute("aria-hidden", "true");
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) return min;
  return Math.min(max, Math.max(min, value));
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

resultEl.addEventListener("beforeinput", (event) => {
  if (event.inputType === "insertLineBreak") {
    event.preventDefault();
    handleAction("equals");
    return;
  }

  if ((state.answerVisible || state.errorMessage) && event.inputType.startsWith("insert")) {
    state.expression = "0";
    state.answerVisible = false;
    state.errorMessage = "";
    resultEl.textContent = "";
  }
});

resultEl.addEventListener("input", syncEditableDisplay);

resultEl.addEventListener("paste", (event) => {
  event.preventDefault();
  const text = event.clipboardData.getData("text/plain");
  document.execCommand("insertText", false, text);
});

document.addEventListener("keydown", (event) => {
  const isFormField = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName);
  const isDisplayField = event.target === resultEl;

  if (event.key === "Escape") {
    if (settingsDrawer.classList.contains("is-open")) closeSettings();
    if (!confirmDialog.classList.contains("is-hidden")) closeDeleteDialog();
    if (!isFormField) clearExpression();
    return;
  }

  if (event.ctrlKey || event.metaKey || event.altKey) return;
  if (isFormField || settingsDrawer.classList.contains("is-open")) return;

  if (event.key === "Enter" || event.key === "=") {
    event.preventDefault();
    handleAction("equals");
    return;
  }

  if (event.key === "Backspace") {
    event.preventDefault();
    backspace();
    return;
  }

  const key = event.key;
  const lowerKey = key.toLowerCase();
  const keyInsertMap = {
    "×": "*",
    "÷": "/",
    "π": "pi",
  };
  const allowed = "0123456789.+-*/^()";

  if (lowerKey === "c") {
    event.preventDefault();
    clearExpression();
    return;
  }

  if (lowerKey === "r" || key === "√") {
    event.preventDefault();
    insertFunction("sqrt");
    return;
  }

  if (lowerKey === "n") {
    event.preventDefault();
    insertToken("pi");
    return;
  }

  if (lowerKey === "e") {
    event.preventDefault();
    insertToken("e");
    return;
  }

  if (key === "!") {
    event.preventDefault();
    applyFactorial();
    return;
  }

  if (key === "%") {
    event.preventDefault();
    applyPercent();
    return;
  }

  if (allowed.includes(key) || keyInsertMap[key]) {
    event.preventDefault();
    insertToken(keyInsertMap[key] || key);
    return;
  }
});

clearHistoryButton.addEventListener("click", () => {
  openDeleteDialog(state.history.map((item) => item.id));
});

selectHistoryButton.addEventListener("click", () => {
  setHistorySelectionMode(!state.historySelectionMode);
});

selectAllHistoryButton.addEventListener("click", () => {
  if (state.selectedHistoryIds.size === state.history.length) {
    state.selectedHistoryIds.clear();
  } else {
    state.selectedHistoryIds = new Set(state.history.map((item) => item.id));
  }
  renderHistory();
});

deleteSelectedHistoryButton.addEventListener("click", () => {
  openDeleteDialog([...state.selectedHistoryIds]);
});

cancelDeleteButton.addEventListener("click", closeDeleteDialog);
confirmDeleteButton.addEventListener("click", deletePendingHistory);

confirmDialog.addEventListener("click", (event) => {
  if (event.target === confirmDialog) closeDeleteDialog();
});

settingsOpen.addEventListener("click", openSettings);
settingsClose.addEventListener("click", closeSettings);
settingsDrawer.addEventListener("click", (event) => {
  if (event.target === settingsDrawer) closeSettings();
});

themeToggle.addEventListener("click", () => {
  currentTheme = currentTheme === "dark" ? "light" : "dark";
  editingTheme = currentTheme;
  applyThemeToDocument(currentTheme);
  syncThemeControls();
  saveAppState();
});

copyResult.addEventListener("click", async () => {
  const text = resultEl.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyResult.title = "Copied";
    setTimeout(() => {
      copyResult.title = "Copy display";
    }, 1200);
  } catch {
    copyResult.title = "Copy failed";
  }
});

converterType.addEventListener("change", loadUnits);
converterInput.addEventListener("input", () => updateConversion("from"));
converterOutput.addEventListener("input", () => updateConversion("to"));
fromUnit.addEventListener("change", () => updateConversion(state.converterSource));
toUnit.addEventListener("change", () => updateConversion(state.converterSource));
swapUnits.addEventListener("click", () => {
  const previousUnit = fromUnit.value;
  fromUnit.value = toUnit.value;
  toUnit.value = previousUnit;

  const previousValue = converterInput.value;
  converterInput.value = converterOutput.value;
  converterOutput.value = previousValue;
  state.converterSource = state.converterSource === "from" ? "to" : "from";
  saveAppState();
});

fontSelect.addEventListener("change", () => {
  setThemeValue("--font-family", fontSelect.value);
});

uiColorInputs.forEach((input) => {
  input.addEventListener("input", () => {
    setThemeValue(input.dataset.uiColor, input.value);
  });
});

[
  appWidthInput,
  appPaddingInput,
  panelGapInput,
  appRadiusInput,
  buttonRadiusInput,
  keyHeightInput,
  displayHeightInput,
  displayTextInput,
  keyTextInput,
  buttonGapInput,
  borderWidthInput,
].forEach((input) => {
  input.addEventListener("input", applyRangeSettings);
});

resetUiSettings.addEventListener("click", resetUi);
resetAllSettings.addEventListener("click", resetAll);
themeEditorSelect.addEventListener("change", () => setEditingTheme(themeEditorSelect.value));
notesInput.addEventListener("input", saveAppState);
window.addEventListener("beforeunload", saveAppState);
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "hidden") saveAppState();
});

Object.assign(window, {
  toggleFractions,
  toggleImproper,
  toggleCommas,
  toggleSeparator,
  toggleWrongAnswers,
  toggleWordForm,
  togglePemdas,
  toggleAutoCloseParen,
  toggleNotes,
  toggleFactorialMode,
  toggleZerosBeforeDecimals,
  updateDecimalPrecision,
  updateSciThreshold,
});

loadSavedState();
applyThemeToDocument(currentTheme);
themeEditorSelect.value = editingTheme;
syncThemeControls();
loadUnits();
restoreConverterState();
renderHistory();
render();
isRestoring = false;
saveAppState();
