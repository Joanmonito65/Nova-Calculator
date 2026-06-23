const expressionEl = document.querySelector("#expression");
const resultEl = document.querySelector("#result");
const wordCornerEl = document.querySelector("#wordCorner");
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
const confirmTitle = document.querySelector("#confirmTitle");
const confirmMessage = document.querySelector("#confirmMessage");
const cancelDeleteButton = document.querySelector("#cancelDelete");
const confirmDeleteButton = document.querySelector("#confirmDelete");

const settingsOpen = document.querySelector("#settingsOpen");
const settingsClose = document.querySelector("#settingsClose");
const settingsDrawer = document.querySelector("#settingsDrawer");
const languageSelect = document.querySelector("#languageSelect");
const themeToggle = document.querySelector("#themeToggle");
const copyResult = document.querySelector("#copyResult");

const converterType = document.querySelector("#converterType");
const converterInput = document.querySelector("#converterInput");
const converterOutput = document.querySelector("#converterOutput");
const fromUnit = document.querySelector("#fromUnit");
const toUnit = document.querySelector("#toUnit");
const swapUnits = document.querySelector("#swapUnits");

const calculationMaxInput = document.querySelector("#calculationMaxInput");
const fontSelect = document.querySelector("#fontSelect");
const mainThemeEditorSelect = document.querySelector("#mainThemeEditorSelect");
const themeEditorSelect = document.querySelector("#themeEditorSelect");
const mainThemeSelect = document.querySelector("#mainThemeSelect");
const themeSelect = document.querySelector("#themeSelect");
const resetUiSettings = document.querySelector("#resetUiSettings");
const resetAllSettings = document.querySelector("#resetAllSettings");
const uiColorInputs = [...document.querySelectorAll("[data-ui-color]")];
const appWidthInput = document.querySelector("#appWidthInput");
const appPaddingInput = document.querySelector("#appPaddingInput");
const panelGapInput = document.querySelector("#panelGapInput");
const appRadiusInput = document.querySelector("#appRadiusInput");
const buttonRadiusInput = document.querySelector("#buttonRadiusInput");
const controlHeightInput = document.querySelector("#controlHeightInput");
const keyHeightInput = document.querySelector("#keyHeightInput");
const displayHeightInput = document.querySelector("#displayHeightInput");
const displayPaddingInput = document.querySelector("#displayPaddingInput");
const displayTextInput = document.querySelector("#displayTextInput");
const keyTextInput = document.querySelector("#keyTextInput");
const titleTextInput = document.querySelector("#titleTextInput");
const bodyTextInput = document.querySelector("#bodyTextInput");
const historyAnswerTextInput = document.querySelector("#historyAnswerTextInput");
const buttonGapInput = document.querySelector("#buttonGapInput");
const borderWidthInput = document.querySelector("#borderWidthInput");
const shadowSoftnessInput = document.querySelector("#shadowSoftnessInput");
const controlShadowSoftnessInput = document.querySelector("#controlShadowSoftnessInput");
const overlaySoftnessInput = document.querySelector("#overlaySoftnessInput");
const settingsWidthInput = document.querySelector("#settingsWidthInput");
const settingsPaddingInput = document.querySelector("#settingsPaddingInput");
const settingsSectionPaddingInput = document.querySelector("#settingsSectionPaddingInput");
const cardPaddingInput = document.querySelector("#cardPaddingInput");
const converterPaddingInput = document.querySelector("#converterPaddingInput");

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
const validExpressionWords = new Set([...functions, "pi", "e", "fact"]);

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
  lastRepeatOperation: null,
  errorMessage: "",
  converterSource: "from",
};

const defaultSettings = {
  language: "en",
  fractions: false,
  improperFractions: false,
  commas: true,
  europeanSeparator: false,
  wrongAnswersOnly: false,
  wordForm: false,
  wordFormCorner: false,
  pemdas: true,
  autoMemory: true,
  appendAfterAnswer: true,
  trimAnswerBackspace: true,
  repeatEquals: false,
  autoCloseParen: true,
  notes: false,
  iteratedFactorials: false,
  zerosBeforeDecimals: true,
  decimalPrecision: 15,
  sciThreshold: 11,
  calculationMax: 1000,
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
  "--key-text": "#132034",
  "--key-bg": "#ffffff",
  "--button-bg": "#eef3f9",
  "--display-text": "#132034",
  "--display-muted": "#66758a",
  "--operator-bg": "#9ccfd0",
  "--operator-text": "#082c2d",
  "--utility-text": "#ce3f58",
  "--function-text": "#0b6f70",
  "--equals-bg": "#0f8b8d",
  "--equals-text": "#ffffff",
  "--constant-bg": "#ffe5ad",
  "--constant-text": "#835500",
  "--glow": "#ffb000",
  "--focus-ring": "#0f8b8d",
  "--overlay-bg": "#080d14",
  "--overlay-softness": "58%",
  "--danger": "#ce3f58",
  "--shadow-color": "#212d44",
  "--shadow-softness": "84%",
  "--control-shadow-color": "#16202c",
  "--control-shadow-softness": "93%",
  "--app-width": "1120px",
  "--app-padding": "22px",
  "--panel-gap": "18px",
  "--app-radius": "24px",
  "--control-radius": "16px",
  "--control-height": "44px",
  "--key-height": "72",
  "--display-height": "296px",
  "--display-padding": "24px",
  "--display-font-size": "76",
  "--key-font-size": "20",
  "--title-font-size": "54",
  "--body-font-size": "16",
  "--history-answer-font-size": "20",
  "--button-gap": "10px",
  "--border-width": "1px",
  "--settings-width": "440px",
  "--settings-padding": "22px",
  "--settings-section-padding": "16px",
  "--card-padding": "14px",
  "--converter-padding": "22px",
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
  "--key-text": "#f3f7fb",
  "--key-bg": "#171f28",
  "--button-bg": "#202a35",
  "--display-text": "#f3f7fb",
  "--display-muted": "#9aaabd",
  "--operator-bg": "#70c4bd",
  "--operator-text": "#082c2d",
  "--utility-text": "#ff6f8e",
  "--function-text": "#70dbc9",
  "--equals-bg": "#0f8b8d",
  "--equals-text": "#ffffff",
  "--constant-bg": "#ffc857",
  "--constant-text": "#251800",
  "--glow": "#ffc857",
  "--focus-ring": "#45c4b0",
  "--overlay-bg": "#000000",
  "--overlay-softness": "52%",
  "--danger": "#ff6f8e",
  "--shadow-color": "#000000",
  "--shadow-softness": "66%",
  "--control-shadow-color": "#000000",
  "--control-shadow-softness": "82%",
};

const mainThemeOrder = ["dark", "light"];

const themeOrder = [
  "originalLight",
  "originalDark",
  "red",
  "orange",
  "yellow",
  "green",
  "lime",
  "cyan",
  "blue",
  "navyBlue",
  "purple",
  "lightPurple",
  "pink",
  "brightPink",
];

const themeLabels = {
  originalLight: "Original Light",
  originalDark: "Original Dark",
  dark: "Dark",
  light: "Light",
  red: "Red",
  orange: "Orange",
  yellow: "Yellow",
  green: "Green",
  lime: "Lime",
  cyan: "Cyan",
  blue: "Blue",
  navyBlue: "Navy Blue",
  purple: "Purple",
  lightPurple: "Light Purple",
  pink: "Pink",
  brightPink: "Bright Pink",
};

function createAccentTheme(options) {
  const {
    bg,
    display,
    accent,
    accentStrong,
    operatorBg,
    operatorText,
    constantBg,
    constantText,
    glow,
    danger = "#ce3f58",
    shadow = "#212d44",
  } = options;

  return {
    ...lightUiDefaults,
    "--bg": bg,
    "--surface-strong": display,
    "--accent": accent,
    "--accent-strong": accentStrong,
    "--operator-bg": operatorBg,
    "--operator-text": operatorText,
    "--function-text": accentStrong,
    "--equals-bg": accent,
    "--constant-bg": constantBg,
    "--constant-text": constantText,
    "--glow": glow,
    "--focus-ring": accent,
    "--danger": danger,
    "--shadow-color": shadow,
    "--control-shadow-color": shadow,
  };
}

function createDarkAccentTheme(options) {
  const {
    bg,
    surface,
    display,
    accent,
    accentStrong,
    operatorBg,
    operatorText,
    constantBg,
    constantText,
    glow,
    danger = "#ff6f8e",
    shadow = "#000000",
  } = options;

  return {
    ...darkUiDefaults,
    "--bg": bg,
    "--surface": surface,
    "--surface-strong": display,
    "--accent": accent,
    "--accent-strong": accentStrong,
    "--operator-bg": operatorBg,
    "--operator-text": operatorText,
    "--function-text": accentStrong,
    "--equals-bg": accent,
    "--constant-bg": constantBg,
    "--constant-text": constantText,
    "--glow": glow,
    "--focus-ring": accent,
    "--danger": danger,
    "--shadow-color": shadow,
    "--control-shadow-color": shadow,
  };
}

const themeDefaults = {
  dark: darkUiDefaults,
  light: lightUiDefaults,
  originalLight: lightUiDefaults,
  originalDark: darkUiDefaults,
  red: createAccentTheme({
    bg: "#fff5f5",
    display: "#ffe8e8",
    accent: "#e5484d",
    accentStrong: "#b4232a",
    operatorBg: "#ffc9c9",
    operatorText: "#661016",
    constantBg: "#ffe0b8",
    constantText: "#6b3b00",
    glow: "#ffb000",
    danger: "#b4232a",
    shadow: "#6f1d1b",
  }),
  orange: createAccentTheme({
    bg: "#fff7ed",
    display: "#ffedd5",
    accent: "#f97316",
    accentStrong: "#c2410c",
    operatorBg: "#fed7aa",
    operatorText: "#5f2306",
    constantBg: "#fef3c7",
    constantText: "#684500",
    glow: "#f59e0b",
    danger: "#c2410c",
    shadow: "#7c2d12",
  }),
  yellow: createAccentTheme({
    bg: "#fffbea",
    display: "#fef9c3",
    accent: "#d99e00",
    accentStrong: "#a16207",
    operatorBg: "#fde68a",
    operatorText: "#4f3400",
    constantBg: "#dcfce7",
    constantText: "#14532d",
    glow: "#facc15",
    danger: "#b45309",
    shadow: "#713f12",
  }),
  green: createAccentTheme({
    bg: "#f0fdf4",
    display: "#dcfce7",
    accent: "#16a34a",
    accentStrong: "#166534",
    operatorBg: "#bbf7d0",
    operatorText: "#052e16",
    constantBg: "#d9f99d",
    constantText: "#365314",
    glow: "#84cc16",
    danger: "#be123c",
    shadow: "#14532d",
  }),
  lime: createAccentTheme({
    bg: "#f7fee7",
    display: "#ecfccb",
    accent: "#65a30d",
    accentStrong: "#3f6212",
    operatorBg: "#d9f99d",
    operatorText: "#1a2e05",
    constantBg: "#cffafe",
    constantText: "#164e63",
    glow: "#a3e635",
    danger: "#be123c",
    shadow: "#365314",
  }),
  cyan: createAccentTheme({
    bg: "#ecfeff",
    display: "#cffafe",
    accent: "#0891b2",
    accentStrong: "#155e75",
    operatorBg: "#a5f3fc",
    operatorText: "#083344",
    constantBg: "#e0e7ff",
    constantText: "#3730a3",
    glow: "#22d3ee",
    danger: "#e11d48",
    shadow: "#164e63",
  }),
  blue: createAccentTheme({
    bg: "#eff6ff",
    display: "#dbeafe",
    accent: "#2563eb",
    accentStrong: "#1d4ed8",
    operatorBg: "#bfdbfe",
    operatorText: "#172554",
    constantBg: "#cffafe",
    constantText: "#155e75",
    glow: "#38bdf8",
    danger: "#dc2626",
    shadow: "#1e3a8a",
  }),
  navyBlue: createDarkAccentTheme({
    bg: "#0b1220",
    surface: "#111827",
    display: "#172033",
    accent: "#60a5fa",
    accentStrong: "#93c5fd",
    operatorBg: "#1d4ed8",
    operatorText: "#eff6ff",
    constantBg: "#facc15",
    constantText: "#2f1d00",
    glow: "#38bdf8",
  }),
  purple: createDarkAccentTheme({
    bg: "#151022",
    surface: "#211833",
    display: "#2d2144",
    accent: "#a78bfa",
    accentStrong: "#c4b5fd",
    operatorBg: "#7c3aed",
    operatorText: "#f5f3ff",
    constantBg: "#f0abfc",
    constantText: "#4a044e",
    glow: "#e879f9",
    danger: "#fb7185",
  }),
  lightPurple: createAccentTheme({
    bg: "#faf5ff",
    display: "#f3e8ff",
    accent: "#8b5cf6",
    accentStrong: "#6d28d9",
    operatorBg: "#ddd6fe",
    operatorText: "#3b0764",
    constantBg: "#fbcfe8",
    constantText: "#831843",
    glow: "#c084fc",
    danger: "#be123c",
    shadow: "#581c87",
  }),
  pink: createAccentTheme({
    bg: "#fff1f2",
    display: "#ffe4e6",
    accent: "#db2777",
    accentStrong: "#be185d",
    operatorBg: "#fbcfe8",
    operatorText: "#831843",
    constantBg: "#fde68a",
    constantText: "#713f12",
    glow: "#f472b6",
    danger: "#be123c",
    shadow: "#831843",
  }),
  brightPink: createAccentTheme({
    bg: "#fff0fa",
    display: "#fce7f3",
    accent: "#ff2fa4",
    accentStrong: "#db0074",
    operatorBg: "#f9a8d4",
    operatorText: "#500724",
    constantBg: "#bfdbfe",
    constantText: "#1e3a8a",
    glow: "#fb4db8",
    danger: "#e0005a",
    shadow: "#9d174d",
  }),
};

const mainThemeDefaults = {
  dark: darkUiDefaults,
  light: lightUiDefaults,
};

const colorThemeProperties = new Set([
  "--accent",
  "--accent-strong",
  "--operator-bg",
  "--operator-text",
  "--utility-text",
  "--function-text",
  "--equals-bg",
  "--equals-text",
  "--constant-bg",
  "--constant-text",
  "--glow",
  "--focus-ring",
  "--danger",
]);

function pickThemeProperties(theme, properties) {
  return [...properties].reduce((picked, property) => {
    if (theme[property] !== undefined) picked[property] = theme[property];
    return picked;
  }, {});
}

const colorThemeDefaults = Object.fromEntries(
  themeOrder.map((themeName) => [
    themeName,
    pickThemeProperties(themeDefaults[themeName], colorThemeProperties),
  ]),
);

function createDefaultMainThemes() {
  return Object.fromEntries(
    mainThemeOrder.map((themeName) => [themeName, { ...mainThemeDefaults[themeName] }]),
  );
}

function createDefaultUiThemes() {
  return Object.fromEntries(
    themeOrder.map((themeName) => [themeName, { ...colorThemeDefaults[themeName] }]),
  );
}

const uiMainThemes = {
  ...createDefaultMainThemes(),
};

const uiThemes = {
  ...createDefaultUiThemes(),
};

const rangeDefaults = {
  appWidthInput: "1120",
  appPaddingInput: "22",
  panelGapInput: "18",
  appRadiusInput: "24",
  buttonRadiusInput: "16",
  controlHeightInput: "44",
  keyHeightInput: "72",
  displayHeightInput: "296",
  displayPaddingInput: "24",
  displayTextInput: "76",
  keyTextInput: "20",
  titleTextInput: "54",
  bodyTextInput: "16",
  historyAnswerTextInput: "20",
  buttonGapInput: "10",
  borderWidthInput: "1",
  shadowSoftnessInput: "84",
  controlShadowSoftnessInput: "93",
  overlaySoftnessInput: "58",
  settingsWidthInput: "440",
  settingsPaddingInput: "22",
  settingsSectionPaddingInput: "16",
  cardPaddingInput: "14",
  converterPaddingInput: "22",
};

let currentMainTheme = "dark";
let editingMainTheme = "dark";
let currentTheme = "originalDark";
let editingTheme = "originalDark";
let isRestoring = true;
let savedConverterState = null;

const languageLocales = {
  en: "en-US",
  es: "es-ES",
  fr: "fr-FR",
  de: "de-DE",
  pt: "pt-PT",
  it: "it-IT",
};

const languageNames = {
  en: "English",
  es: "Espanol",
  fr: "Francais",
  de: "Deutsch",
  pt: "Portugues",
  it: "Italiano",
};

const translations = {
  en: {
    appLabel: "Nova Calculator",
    calculator: "Calculator",
    settings: "Settings",
    theme: "Theme",
    copy: "Copy",
    copied: "Copied",
    copyFailed: "Copy failed",
    close: "Close",
    expression: "Expression",
    error: "Error",
    memoryEmpty: "MEM empty",
    memoryPrefix: "MEM",
    notes: "Notes",
    notesPlaceholder: "Write notes here",
    basic: "Basic",
    scientific: "Scientific",
    convert: "Convert",
    history: "History",
    type: "Type",
    from: "From",
    to: "To",
    swap: "Swap",
    customize: "Customize",
    language: "Language",
    calculatorLanguage: "Calculator Language",
    answerFormat: "Answer Format",
    interface: "Interface",
    on: "ON",
    off: "OFF",
    fractions: "Fractions",
    improperFractions: "Improper Fractions",
    commas: "Commas",
    europeanStyle: "European Style",
    wrongAnswersOnly: "Wrong Answers Only",
    wordForm: "Number Word Form",
    wordCorner: "Appear in Corner",
    pemdas: "PEMDAS",
    autoMemory: "Auto Memory",
    appendAfterAnswer: "Append After Answer",
    trimAnswerBackspace: "Answer Backspace",
    repeatEquals: "Repeat Equals",
    autoCloseParen: "Auto-Close Parentheses",
    iteratedFactorials: "Iterated Factorials",
    zerosBeforeDecimals: "Zeros Before Decimals",
    decimalPrecision: "Decimal Precision",
    scientificMin: "Scientific Min",
    calculationMax: "Calculation Max",
    mainThemeToCustomize: "Main Theme to Customize",
    themeToCustomize: "Theme to Customize",
    mainTheme: "Main Theme",
    lightTheme: "Light Theme",
    darkTheme: "Dark Theme",
    font: "Font",
    resetUi: "Reset UI",
    resetAllSettings: "Reset All Settings",
    noCalculations: "No calculations yet",
    selectedOf: "{selected} selected of {total}",
    calculationCount: "{count} calculation",
    calculationsCount: "{count} calculations",
    done: "Done",
    select: "Select",
    selectAll: "Select All",
    clearSelection: "Clear Selection",
    delete: "Delete",
    clear: "Clear",
    deleteSelectedTitle: "Delete selected calculations?",
    deleteAllMessage: "This will delete every calculation in history.",
    deleteSelectedMessage: "This will delete {count} selected calculation.",
    deleteSelectedPluralMessage: "This will delete {count} selected calculations.",
    cancel: "Cancel",
    converterLength: "Length",
    converterWeight: "Weight",
    converterTemperature: "Temperature",
    converterTime: "Time",
    converterSpeed: "Speed",
    converterPressure: "Pressure",
    converterArea: "Area",
    converterVolume: "Volume",
    converterEnergy: "Energy",
    converterPower: "Power",
    converterData: "Data",
    converterMoney: "Money",
  },
  es: {
    appLabel: "Calculadora Nova",
    calculator: "Calculadora",
    settings: "Configuracion",
    theme: "Tema",
    copy: "Copiar",
    copied: "Copiado",
    copyFailed: "No se copio",
    close: "Cerrar",
    expression: "Expresion",
    error: "Error",
    memoryEmpty: "MEM vacia",
    memoryPrefix: "MEM",
    notes: "Notas",
    notesPlaceholder: "Escribe notas aqui",
    basic: "Basica",
    scientific: "Cientifica",
    convert: "Convertir",
    history: "Historial",
    type: "Tipo",
    from: "Desde",
    to: "A",
    swap: "Cambiar",
    customize: "Personalizar",
    language: "Idioma",
    calculatorLanguage: "Idioma de la calculadora",
    answerFormat: "Formato de respuesta",
    interface: "Interfaz",
    on: "ACT",
    off: "DES",
    fractions: "Fracciones",
    improperFractions: "Fracciones impropias",
    commas: "Comas",
    europeanStyle: "Estilo europeo",
    wrongAnswersOnly: "Solo respuestas incorrectas",
    wordForm: "Numero en palabras",
    wordCorner: "Aparecer en la esquina",
    pemdas: "PEMDAS",
    autoMemory: "Memoria automatica",
    appendAfterAnswer: "Anexar tras respuesta",
    trimAnswerBackspace: "Retroceso de respuesta",
    repeatEquals: "Repetir igual",
    autoCloseParen: "Cerrar parentesis automaticamente",
    iteratedFactorials: "Factoriales iterados",
    zerosBeforeDecimals: "Ceros antes de decimales",
    decimalPrecision: "Precision decimal",
    scientificMin: "Min. cientifico",
    calculationMax: "Maximo de calculos",
    mainThemeToCustomize: "Tema principal para personalizar",
    themeToCustomize: "Tema para personalizar",
    mainTheme: "Tema principal",
    lightTheme: "Tema claro",
    darkTheme: "Tema oscuro",
    font: "Fuente",
    resetUi: "Restablecer interfaz",
    resetAllSettings: "Restablecer todo",
    noCalculations: "Sin calculos aun",
    selectedOf: "{selected} seleccionados de {total}",
    calculationCount: "{count} calculo",
    calculationsCount: "{count} calculos",
    done: "Listo",
    select: "Seleccionar",
    selectAll: "Seleccionar todo",
    clearSelection: "Borrar seleccion",
    delete: "Eliminar",
    clear: "Borrar",
    deleteSelectedTitle: "Eliminar calculos seleccionados?",
    deleteAllMessage: "Esto eliminara todos los calculos del historial.",
    deleteSelectedMessage: "Esto eliminara {count} calculo seleccionado.",
    deleteSelectedPluralMessage: "Esto eliminara {count} calculos seleccionados.",
    cancel: "Cancelar",
    converterLength: "Longitud",
    converterWeight: "Peso",
    converterTemperature: "Temperatura",
    converterTime: "Tiempo",
    converterSpeed: "Velocidad",
    converterPressure: "Presion",
    converterArea: "Area",
    converterVolume: "Volumen",
    converterEnergy: "Energia",
    converterPower: "Potencia",
    converterData: "Datos",
    converterMoney: "Moneda",
  },
  fr: {
    appLabel: "Calculatrice Nova",
    calculator: "Calculatrice",
    settings: "Parametres",
    theme: "Theme",
    copy: "Copier",
    copied: "Copie",
    copyFailed: "Echec copie",
    close: "Fermer",
    expression: "Expression",
    error: "Erreur",
    memoryEmpty: "MEM vide",
    memoryPrefix: "MEM",
    notes: "Notes",
    notesPlaceholder: "Ecrire des notes ici",
    basic: "Basique",
    scientific: "Scientifique",
    convert: "Convertir",
    history: "Historique",
    type: "Type",
    from: "De",
    to: "Vers",
    swap: "Inverser",
    customize: "Personnaliser",
    language: "Langue",
    calculatorLanguage: "Langue de la calculatrice",
    answerFormat: "Format de reponse",
    interface: "Interface",
    on: "ON",
    off: "OFF",
    fractions: "Fractions",
    improperFractions: "Fractions impropres",
    commas: "Separateurs",
    europeanStyle: "Style europeen",
    wrongAnswersOnly: "Reponses fausses uniquement",
    wordForm: "Nombre en mots",
    wordCorner: "Afficher dans le coin",
    pemdas: "PEMDAS",
    autoMemory: "Memoire automatique",
    appendAfterAnswer: "Ajouter apres reponse",
    trimAnswerBackspace: "Retour arriere reponse",
    repeatEquals: "Repeter egal",
    autoCloseParen: "Fermer parentheses auto",
    iteratedFactorials: "Factorielles iterees",
    zerosBeforeDecimals: "Zeros avant decimales",
    decimalPrecision: "Precision decimale",
    scientificMin: "Min scientifique",
    calculationMax: "Maximum de calculs",
    mainThemeToCustomize: "Theme principal a personnaliser",
    themeToCustomize: "Theme a personnaliser",
    mainTheme: "Theme principal",
    lightTheme: "Theme clair",
    darkTheme: "Theme sombre",
    font: "Police",
    resetUi: "Reinitialiser interface",
    resetAllSettings: "Tout reinitialiser",
    noCalculations: "Aucun calcul",
    selectedOf: "{selected} selectionnes sur {total}",
    calculationCount: "{count} calcul",
    calculationsCount: "{count} calculs",
    done: "Termine",
    select: "Selectionner",
    selectAll: "Tout selectionner",
    clearSelection: "Effacer selection",
    delete: "Supprimer",
    clear: "Effacer",
    deleteSelectedTitle: "Supprimer les calculs selectionnes?",
    deleteAllMessage: "Cela supprimera tous les calculs de l'historique.",
    deleteSelectedMessage: "Cela supprimera {count} calcul selectionne.",
    deleteSelectedPluralMessage: "Cela supprimera {count} calculs selectionnes.",
    cancel: "Annuler",
    converterLength: "Longueur",
    converterWeight: "Poids",
    converterTemperature: "Temperature",
    converterTime: "Temps",
    converterSpeed: "Vitesse",
    converterPressure: "Pression",
    converterArea: "Surface",
    converterVolume: "Volume",
    converterEnergy: "Energie",
    converterPower: "Puissance",
    converterData: "Donnees",
    converterMoney: "Devise",
  },
  de: {
    appLabel: "Nova Rechner",
    calculator: "Rechner",
    settings: "Einstellungen",
    theme: "Design",
    copy: "Kopieren",
    copied: "Kopiert",
    copyFailed: "Kopieren fehlgeschlagen",
    close: "Schliessen",
    expression: "Ausdruck",
    error: "Fehler",
    memoryEmpty: "MEM leer",
    memoryPrefix: "MEM",
    notes: "Notizen",
    notesPlaceholder: "Notizen hier schreiben",
    basic: "Basis",
    scientific: "Wissenschaft",
    convert: "Umrechnen",
    history: "Verlauf",
    type: "Typ",
    from: "Von",
    to: "Nach",
    swap: "Tauschen",
    customize: "Anpassen",
    language: "Sprache",
    calculatorLanguage: "Rechnersprache",
    answerFormat: "Antwortformat",
    interface: "Oberflaeche",
    on: "AN",
    off: "AUS",
    fractions: "Brueche",
    improperFractions: "Unechte Brueche",
    commas: "Tausendertrennung",
    europeanStyle: "Europaeischer Stil",
    wrongAnswersOnly: "Nur falsche Antworten",
    wordForm: "Zahlwortform",
    wordCorner: "In Ecke anzeigen",
    pemdas: "PEMDAS",
    autoMemory: "Automatischer Speicher",
    appendAfterAnswer: "Nach Antwort anhaengen",
    trimAnswerBackspace: "Antwort-Ruecktaste",
    repeatEquals: "Gleich wiederholen",
    autoCloseParen: "Klammern automatisch schliessen",
    iteratedFactorials: "Iterierte Fakultaeten",
    zerosBeforeDecimals: "Nullen vor Dezimalen",
    decimalPrecision: "Dezimalstellen",
    scientificMin: "Wiss. Minimum",
    calculationMax: "Max. Berechnungen",
    mainThemeToCustomize: "Hauptdesign anpassen",
    themeToCustomize: "Design anpassen",
    mainTheme: "Hauptdesign",
    lightTheme: "Helles Design",
    darkTheme: "Dunkles Design",
    font: "Schriftart",
    resetUi: "Oberflaeche zuruecksetzen",
    resetAllSettings: "Alles zuruecksetzen",
    noCalculations: "Noch keine Berechnungen",
    selectedOf: "{selected} von {total} ausgewaehlt",
    calculationCount: "{count} Berechnung",
    calculationsCount: "{count} Berechnungen",
    done: "Fertig",
    select: "Auswaehlen",
    selectAll: "Alle auswaehlen",
    clearSelection: "Auswahl loeschen",
    delete: "Loeschen",
    clear: "Leeren",
    deleteSelectedTitle: "Ausgewaehlte Berechnungen loeschen?",
    deleteAllMessage: "Dies loescht jede Berechnung im Verlauf.",
    deleteSelectedMessage: "Dies loescht {count} ausgewaehlte Berechnung.",
    deleteSelectedPluralMessage: "Dies loescht {count} ausgewaehlte Berechnungen.",
    cancel: "Abbrechen",
    converterLength: "Laenge",
    converterWeight: "Gewicht",
    converterTemperature: "Temperatur",
    converterTime: "Zeit",
    converterSpeed: "Geschwindigkeit",
    converterPressure: "Druck",
    converterArea: "Flaeche",
    converterVolume: "Volumen",
    converterEnergy: "Energie",
    converterPower: "Leistung",
    converterData: "Daten",
    converterMoney: "Waehrung",
  },
  pt: {
    appLabel: "Calculadora Nova",
    calculator: "Calculadora",
    settings: "Configuracoes",
    theme: "Tema",
    copy: "Copiar",
    copied: "Copiado",
    copyFailed: "Falha ao copiar",
    close: "Fechar",
    expression: "Expressao",
    error: "Erro",
    memoryEmpty: "MEM vazia",
    memoryPrefix: "MEM",
    notes: "Notas",
    notesPlaceholder: "Escreva notas aqui",
    basic: "Basica",
    scientific: "Cientifica",
    convert: "Converter",
    history: "Historico",
    type: "Tipo",
    from: "De",
    to: "Para",
    swap: "Trocar",
    customize: "Personalizar",
    language: "Idioma",
    calculatorLanguage: "Idioma da calculadora",
    answerFormat: "Formato da resposta",
    interface: "Interface",
    on: "LIG",
    off: "DES",
    fractions: "Fracoes",
    improperFractions: "Fracoes improprias",
    commas: "Separadores",
    europeanStyle: "Estilo europeu",
    wrongAnswersOnly: "So respostas erradas",
    wordForm: "Numero por extenso",
    wordCorner: "Aparecer no canto",
    pemdas: "PEMDAS",
    autoMemory: "Memoria automatica",
    appendAfterAnswer: "Anexar apos resposta",
    trimAnswerBackspace: "Backspace da resposta",
    repeatEquals: "Repetir igual",
    autoCloseParen: "Fechar parenteses auto",
    iteratedFactorials: "Fatoriais iterados",
    zerosBeforeDecimals: "Zeros antes de decimais",
    decimalPrecision: "Precisao decimal",
    scientificMin: "Min cientifico",
    calculationMax: "Maximo de calculos",
    mainThemeToCustomize: "Tema principal para personalizar",
    themeToCustomize: "Tema para personalizar",
    mainTheme: "Tema principal",
    lightTheme: "Tema claro",
    darkTheme: "Tema escuro",
    font: "Fonte",
    resetUi: "Redefinir interface",
    resetAllSettings: "Redefinir tudo",
    noCalculations: "Nenhum calculo ainda",
    selectedOf: "{selected} selecionados de {total}",
    calculationCount: "{count} calculo",
    calculationsCount: "{count} calculos",
    done: "Pronto",
    select: "Selecionar",
    selectAll: "Selecionar tudo",
    clearSelection: "Limpar selecao",
    delete: "Excluir",
    clear: "Limpar",
    deleteSelectedTitle: "Excluir calculos selecionados?",
    deleteAllMessage: "Isto excluira todos os calculos do historico.",
    deleteSelectedMessage: "Isto excluira {count} calculo selecionado.",
    deleteSelectedPluralMessage: "Isto excluira {count} calculos selecionados.",
    cancel: "Cancelar",
    converterLength: "Comprimento",
    converterWeight: "Peso",
    converterTemperature: "Temperatura",
    converterTime: "Tempo",
    converterSpeed: "Velocidade",
    converterPressure: "Pressao",
    converterArea: "Area",
    converterVolume: "Volume",
    converterEnergy: "Energia",
    converterPower: "Potencia",
    converterData: "Dados",
    converterMoney: "Moeda",
  },
  it: {
    appLabel: "Calcolatrice Nova",
    calculator: "Calcolatrice",
    settings: "Impostazioni",
    theme: "Tema",
    copy: "Copia",
    copied: "Copiato",
    copyFailed: "Copia non riuscita",
    close: "Chiudi",
    expression: "Espressione",
    error: "Errore",
    memoryEmpty: "MEM vuota",
    memoryPrefix: "MEM",
    notes: "Note",
    notesPlaceholder: "Scrivi note qui",
    basic: "Base",
    scientific: "Scientifica",
    convert: "Converti",
    history: "Cronologia",
    type: "Tipo",
    from: "Da",
    to: "A",
    swap: "Scambia",
    customize: "Personalizza",
    language: "Lingua",
    calculatorLanguage: "Lingua calcolatrice",
    answerFormat: "Formato risposta",
    interface: "Interfaccia",
    on: "ON",
    off: "OFF",
    fractions: "Frazioni",
    improperFractions: "Frazioni improprie",
    commas: "Separatori",
    europeanStyle: "Stile europeo",
    wrongAnswersOnly: "Solo risposte errate",
    wordForm: "Numero in parole",
    wordCorner: "Mostra nell'angolo",
    pemdas: "PEMDAS",
    autoMemory: "Memoria automatica",
    appendAfterAnswer: "Aggiungi dopo risposta",
    trimAnswerBackspace: "Backspace risposta",
    repeatEquals: "Ripeti uguale",
    autoCloseParen: "Chiudi parentesi auto",
    iteratedFactorials: "Fattoriali iterati",
    zerosBeforeDecimals: "Zeri prima decimali",
    decimalPrecision: "Precisione decimale",
    scientificMin: "Min scientifico",
    calculationMax: "Massimo calcoli",
    mainThemeToCustomize: "Tema principale da personalizzare",
    themeToCustomize: "Tema da personalizzare",
    mainTheme: "Tema principale",
    lightTheme: "Tema chiaro",
    darkTheme: "Tema scuro",
    font: "Carattere",
    resetUi: "Ripristina interfaccia",
    resetAllSettings: "Ripristina tutto",
    noCalculations: "Nessun calcolo",
    selectedOf: "{selected} selezionati di {total}",
    calculationCount: "{count} calcolo",
    calculationsCount: "{count} calcoli",
    done: "Fatto",
    select: "Seleziona",
    selectAll: "Seleziona tutto",
    clearSelection: "Cancella selezione",
    delete: "Elimina",
    clear: "Cancella",
    deleteSelectedTitle: "Eliminare i calcoli selezionati?",
    deleteAllMessage: "Questo eliminera ogni calcolo dalla cronologia.",
    deleteSelectedMessage: "Questo eliminera {count} calcolo selezionato.",
    deleteSelectedPluralMessage: "Questo eliminera {count} calcoli selezionati.",
    cancel: "Annulla",
    converterLength: "Lunghezza",
    converterWeight: "Peso",
    converterTemperature: "Temperatura",
    converterTime: "Tempo",
    converterSpeed: "Velocita",
    converterPressure: "Pressione",
    converterArea: "Area",
    converterVolume: "Volume",
    converterEnergy: "Energia",
    converterPower: "Potenza",
    converterData: "Dati",
    converterMoney: "Valuta",
  },
};

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
      feet_inches: 0.3048,
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
  money: {
    defaults: ["USD", "EUR"],
    units: {
      USD: 1,
      EUR: 1,
      GBP: 1,
      JPY: 1,
      CAD: 1,
      AUD: 1,
      CHF: 1,
      CNY: 1,
      MXN: 1,
      INR: 1,
      KRW: 1,
      BRL: 1,
      NZD: 1,
    },
  },
};

const fallbackMoneyRates = {
  USD: 1,
  EUR: 0.92,
  GBP: 0.79,
  JPY: 156,
  CAD: 1.37,
  AUD: 1.51,
  CHF: 0.9,
  CNY: 7.24,
  MXN: 16.7,
  INR: 83.3,
  KRW: 1365,
  BRL: 5.15,
  NZD: 1.64,
};

const moneyRateCache = new Map();
let conversionRequestId = 0;
let moneyCurrenciesLoaded = false;

const extraMoneyCurrencies = [
  "AED", "AFN", "ALL", "AMD", "ANG", "AOA", "ARS", "AWG", "AZN", "BAM",
  "BBD", "BDT", "BHD", "BIF", "BMD", "BND", "BOB", "BSD", "BTN", "BWP",
  "BYN", "BZD", "CDF", "CLP", "CNH", "COP", "CRC", "CUP", "CVE", "CZK",
  "DJF", "DKK", "DOP", "DZD", "EGP", "ERN", "ETB", "FJD", "FKP", "GEL",
  "GGP", "GHS", "GIP", "GMD", "GNF", "GTQ", "GYD", "HKD", "HNL", "HTG",
  "HUF", "IDR", "ILS", "IMP", "IQD", "IRR", "ISK", "JEP", "JMD", "JOD",
  "KES", "KGS", "KHR", "KMF", "KPW", "KWD", "KYD", "KZT", "LAK", "LBP",
  "LKR", "LRD", "LSL", "LYD", "MAD", "MDL", "MGA", "MKD", "MMK", "MNT",
  "MOP", "MRO", "MRU", "MUR", "MVR", "MWK", "MYR", "MZN", "NAD", "NGN",
  "NIO", "NOK", "NPR", "OMR", "PAB", "PEN", "PGK", "PHP", "PKR", "PLN",
  "PYG", "QAR", "RON", "RSD", "RUB", "RWF", "SAR", "SBD", "SCR", "SDG",
  "SEK", "SGD", "SHP", "SLE", "SOS", "SRD", "SSP", "STN", "SVC", "SYP",
  "SZL", "THB", "TJS", "TMT", "TND", "TOP", "TRY", "TTD", "TWD", "TZS",
  "UAH", "UGX", "UYU", "UZS", "VES", "VND", "VUV", "WST", "XAF", "XAG",
  "XAU", "XCD", "XCG", "XDR", "XOF", "XPD", "XPF", "XPT", "YER", "ZAR",
  "ZMW", "ZWG",
];

extraMoneyCurrencies.forEach((currencyCode) => {
  units.money.units[currencyCode] = 1;
});

const fallbackMoneyNames = {
  AED: "United Arab Emirates Dirham",
  AFN: "Afghan Afghani",
  ALL: "Albanian Lek",
  AMD: "Armenian Dram",
  ANG: "Netherlands Antillean Gulden",
  AOA: "Angolan Kwanza",
  ARS: "Argentine Peso",
  AUD: "Australian Dollar",
  AWG: "Aruban Florin",
  AZN: "Azerbaijani Manat",
  BAM: "Bosnia and Herzegovina Convertible Mark",
  BBD: "Barbadian Dollar",
  BDT: "Bangladeshi Taka",
  BHD: "Bahraini Dinar",
  BIF: "Burundian Franc",
  BMD: "Bermudian Dollar",
  BND: "Brunei Dollar",
  BOB: "Bolivian Boliviano",
  BRL: "Brazilian Real",
  BSD: "Bahamian Dollar",
  BTN: "Bhutanese Ngultrum",
  BWP: "Botswana Pula",
  BYN: "Belarusian Ruble",
  BZD: "Belize Dollar",
  CAD: "Canadian Dollar",
  CDF: "Congolese Franc",
  CHF: "Swiss Franc",
  CLP: "Chilean Peso",
  CNH: "Chinese Renminbi Yuan Offshore",
  CNY: "Chinese Renminbi Yuan",
  COP: "Colombian Peso",
  CRC: "Costa Rican Colon",
  CUP: "Cuban Peso",
  CVE: "Cape Verdean Escudo",
  CZK: "Czech Koruna",
  DJF: "Djiboutian Franc",
  DKK: "Danish Krone",
  DOP: "Dominican Peso",
  DZD: "Algerian Dinar",
  EGP: "Egyptian Pound",
  ERN: "Eritrean Nakfa",
  ETB: "Ethiopian Birr",
  EUR: "Euro",
  FJD: "Fijian Dollar",
  FKP: "Falkland Pound",
  GBP: "British Pound",
  GEL: "Georgian Lari",
  GGP: "Guernsey Pound",
  GHS: "Ghanaian Cedi",
  GIP: "Gibraltar Pound",
  GMD: "Gambian Dalasi",
  GNF: "Guinean Franc",
  GTQ: "Guatemalan Quetzal",
  GYD: "Guyanese Dollar",
  HKD: "Hong Kong Dollar",
  HNL: "Honduran Lempira",
  HTG: "Haitian Gourde",
  HUF: "Hungarian Forint",
  IDR: "Indonesian Rupiah",
  ILS: "Israeli New Shekel",
  IMP: "Isle of Man Pound",
  INR: "Indian Rupee",
  IQD: "Iraqi Dinar",
  IRR: "Iranian Rial",
  ISK: "Icelandic Krona",
  JEP: "Jersey Pound",
  JMD: "Jamaican Dollar",
  JOD: "Jordanian Dinar",
  JPY: "Japanese Yen",
  KES: "Kenyan Shilling",
  KGS: "Kyrgyzstani Som",
  KHR: "Cambodian Riel",
  KMF: "Comorian Franc",
  KPW: "North Korean Won",
  KRW: "South Korean Won",
  KWD: "Kuwaiti Dinar",
  KYD: "Cayman Islands Dollar",
  KZT: "Kazakhstani Tenge",
  LAK: "Lao Kip",
  LBP: "Lebanese Pound",
  LKR: "Sri Lankan Rupee",
  LRD: "Liberian Dollar",
  LSL: "Lesotho Loti",
  LYD: "Libyan Dinar",
  MAD: "Moroccan Dirham",
  MDL: "Moldovan Leu",
  MGA: "Malagasy Ariary",
  MKD: "Macedonian Denar",
  MMK: "Myanmar Kyat",
  MNT: "Mongolian Togrog",
  MOP: "Macanese Pataca",
  MRO: "Mauritanian Ouguiya",
  MRU: "Mauritanian Ouguiya",
  MUR: "Mauritian Rupee",
  MVR: "Maldivian Rufiyaa",
  MWK: "Malawian Kwacha",
  MXN: "Mexican Peso",
  MYR: "Malaysian Ringgit",
  MZN: "Mozambican Metical",
  NAD: "Namibian Dollar",
  NGN: "Nigerian Naira",
  NIO: "Nicaraguan Cordoba",
  NOK: "Norwegian Krone",
  NPR: "Nepalese Rupee",
  NZD: "New Zealand Dollar",
  OMR: "Omani Rial",
  PAB: "Panamanian Balboa",
  PEN: "Peruvian Sol",
  PGK: "Papua New Guinean Kina",
  PHP: "Philippine Peso",
  PKR: "Pakistani Rupee",
  PLN: "Polish Zloty",
  PYG: "Paraguayan Guarani",
  QAR: "Qatari Riyal",
  RON: "Romanian Leu",
  RSD: "Serbian Dinar",
  RUB: "Russian Ruble",
  RWF: "Rwandan Franc",
  SAR: "Saudi Riyal",
  SBD: "Solomon Islands Dollar",
  SCR: "Seychellois Rupee",
  SDG: "Sudanese Pound",
  SEK: "Swedish Krona",
  SGD: "Singapore Dollar",
  SHP: "Saint Helenian Pound",
  SLE: "Sierra Leonean Leone",
  SOS: "Somali Shilling",
  SRD: "Surinamese Dollar",
  SSP: "South Sudanese Pound",
  STN: "Sao Tome and Principe Dobra",
  SVC: "Salvadoran Colon",
  SYP: "Syrian Pound",
  SZL: "Swazi Lilangeni",
  THB: "Thai Baht",
  TJS: "Tajikistani Somoni",
  TMT: "Turkmenistani Manat",
  TND: "Tunisian Dinar",
  TOP: "Tongan Pa'anga",
  TRY: "Turkish Lira",
  TTD: "Trinidad and Tobago Dollar",
  TWD: "New Taiwan Dollar",
  TZS: "Tanzanian Shilling",
  UAH: "Ukrainian Hryvnia",
  UGX: "Ugandan Shilling",
  USD: "United States Dollar",
  UYU: "Uruguayan Peso",
  UZS: "Uzbekistan Som",
  VES: "Venezuelan Bolivar",
  VND: "Vietnamese Dong",
  VUV: "Vanuatu Vatu",
  WST: "Samoan Tala",
  XAF: "Central African CFA Franc",
  XAG: "Silver",
  XAU: "Gold",
  XCD: "East Caribbean Dollar",
  XCG: "Caribbean Guilder",
  XDR: "Special Drawing Rights",
  XOF: "West African CFA Franc",
  XPD: "Palladium",
  XPF: "CFP Franc",
  XPT: "Platinum",
  YER: "Yemeni Rial",
  ZAR: "South African Rand",
  ZMW: "Zambian Kwacha",
  ZWG: "Zimbabwe Gold",
};

const unitLabels = {
  millimeter: "Millimeters",
  centimeter: "Centimeters",
  meter: "Meters",
  kilometer: "Kilometers",
  inch: "Inches",
  foot: "Feet",
  feet_inches: "Feet and inches",
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
  USD: "US Dollar",
  EUR: "Euro",
  GBP: "British Pound",
  JPY: "Japanese Yen",
  CAD: "Canadian Dollar",
  AUD: "Australian Dollar",
  CHF: "Swiss Franc",
  CNY: "Chinese Yuan",
  MXN: "Mexican Peso",
  INR: "Indian Rupee",
  KRW: "South Korean Won",
  BRL: "Brazilian Real",
  NZD: "New Zealand Dollar",
};

Object.assign(unitLabels, fallbackMoneyNames);

const converterTypeTranslationKeys = {
  length: "converterLength",
  weight: "converterWeight",
  temperature: "converterTemperature",
  time: "converterTime",
  speed: "converterSpeed",
  pressure: "converterPressure",
  area: "converterArea",
  volume: "converterVolume",
  energy: "converterEnergy",
  power: "converterPower",
  data: "converterData",
  money: "converterMoney",
};

function getLanguage() {
  return translations[settings.language] ? settings.language : "en";
}

function getLocale() {
  return languageLocales[getLanguage()] || languageLocales.en;
}

function t(key, values = {}) {
  const language = getLanguage();
  const dictionary = translations[language] || translations.en;
  let text = dictionary[key] ?? translations.en[key] ?? key;

  Object.entries(values).forEach(([name, value]) => {
    text = text.replaceAll(`{${name}}`, String(value));
  });

  return text;
}

function setText(selector, text) {
  const element = document.querySelector(selector);
  if (element) element.textContent = text;
}

function setButtonLabel(button, text) {
  if (!button) return;
  button.textContent = text;
  button.title = text;
  button.setAttribute("aria-label", text);
}

function setSettingsControlLabel(controlSelector, text) {
  const control = document.querySelector(controlSelector);
  const label = control?.closest(".settings-input-btn");
  const textElement = label?.querySelector("span");
  if (textElement) textElement.textContent = text;
}

function populateThemeOptions(select, selectedTheme) {
  if (!select) return;
  const normalizedTheme = normalizeThemeName(selectedTheme);
  select.innerHTML = "";
  themeOrder.forEach((themeName) => {
    select.add(new Option(themeLabels[themeName], themeName));
  });
  select.value = normalizedTheme;
}

function populateMainThemeOptions(select, selectedTheme) {
  if (!select) return;
  const normalizedTheme = normalizeMainThemeName(selectedTheme);
  select.innerHTML = "";
  mainThemeOrder.forEach((themeName) => {
    select.add(new Option(themeLabels[themeName], themeName));
  });
  select.value = normalizedTheme;
}

function updateConverterTypeLabels() {
  [...converterType.options].forEach((option) => {
    option.textContent = t(converterTypeTranslationKeys[option.value] || option.value);
  });
}

function applyLanguage() {
  settings.language = getLanguage();
  document.documentElement.lang = settings.language;

  if (languageSelect) {
    [...languageSelect.options].forEach((option) => {
      option.textContent = languageNames[option.value] || option.textContent;
    });
    languageSelect.value = settings.language;
  }

  document.querySelector(".app-shell")?.setAttribute("aria-label", t("appLabel"));
  document.querySelector(".calculator")?.setAttribute("aria-label", t("calculator"));
  document.querySelector(".tabs")?.setAttribute("aria-label", t("calculator"));
  document.querySelector(".display")?.setAttribute("aria-live", "polite");

  setText(".topbar .eyebrow", t("calculator"));
  setButtonLabel(settingsOpen, t("settings"));
  setButtonLabel(themeToggle, t("theme"));
  setButtonLabel(copyResult, t("copy"));

  setText('label[for="notesInput"]', t("notes"));
  notesInput.placeholder = t("notesPlaceholder");

  tabs.forEach((tab) => {
    const key = tab.dataset.panel;
    if (key) tab.textContent = t(key);
  });

  setText('label[for="converterType"]', t("type"));
  converterInput.closest(".input-card")?.querySelector("span").replaceChildren(t("from"));
  converterOutput.closest(".input-card")?.querySelector("span").replaceChildren(t("to"));
  setButtonLabel(swapUnits, t("swap"));
  updateConverterTypeLabels();

  setText(".settings-header .eyebrow", t("settings"));
  setText("#settingsTitle", t("customize"));
  setButtonLabel(settingsClose, t("close"));
  setText("#languageSectionTitle", t("language"));
  setText("#languageSelectLabel", t("calculatorLanguage"));

  const sectionTitles = [...document.querySelectorAll(".settings-section > h3")];
  if (sectionTitles[1]) sectionTitles[1].textContent = t("answerFormat");
  if (sectionTitles[2]) sectionTitles[2].textContent = t("interface");

  setSettingsControlLabel("#decimalPrecisionInput", t("decimalPrecision"));
  setSettingsControlLabel("#sciThresholdInput", t("scientificMin"));
  setSettingsControlLabel("#calculationMaxInput", t("calculationMax"));
  setSettingsControlLabel("#mainThemeEditorSelect", t("mainThemeToCustomize"));
  setSettingsControlLabel("#themeEditorSelect", t("themeToCustomize"));
  setSettingsControlLabel("#mainThemeSelect", t("mainTheme"));
  setSettingsControlLabel("#themeSelect", t("theme"));
  setSettingsControlLabel("#fontSelect", t("font"));

  populateMainThemeOptions(mainThemeEditorSelect, editingMainTheme);
  populateThemeOptions(themeEditorSelect, editingTheme);
  populateMainThemeOptions(mainThemeSelect, currentMainTheme);
  populateThemeOptions(themeSelect, currentTheme);
  resetUiSettings.textContent = t("resetUi");
  resetAllSettings.textContent = t("resetAllSettings");

  clearHistoryButton.textContent = t("clear");
  deleteSelectedHistoryButton.textContent = t("delete");
  if (confirmTitle) confirmTitle.textContent = t("deleteSelectedTitle");
  cancelDeleteButton.textContent = t("cancel");
  confirmDeleteButton.textContent = t("delete");

  updateToggleUi();
}

function render() {
  angleButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.angle === state.angleMode);
  });

  wordCornerEl.classList.add("is-hidden");
  wordCornerEl.textContent = "";

  if (state.errorMessage) {
    expressionEl.textContent = t("error");
    resultEl.textContent = state.errorMessage;
    resultEl.setAttribute("aria-readonly", "true");
  } else if (state.answerVisible) {
    expressionEl.textContent = `${displayExpression(state.lastExpression)} =`;
    resultEl.textContent = formatDisplayAnswer(state.lastAnswer);
    if (shouldShowWordCorner(state.lastAnswer)) {
      wordCornerEl.textContent = numberToWords(state.lastAnswer);
      wordCornerEl.classList.remove("is-hidden");
    }
    if (settings.appendAfterAnswer) {
      resultEl.removeAttribute("aria-readonly");
    } else {
      resultEl.setAttribute("aria-readonly", "true");
    }
  } else {
    expressionEl.textContent = t("expression");
    resultEl.textContent = displayExpression(state.expression);
    resultEl.removeAttribute("aria-readonly");
  }

  memoryIndicator.textContent =
    state.memory === null ? t("memoryEmpty") : `${t("memoryPrefix")} ${formatAnswer(state.memory)}`;
  notesPanel.classList.toggle("is-hidden", !settings.notes);
  updateToggleUi();
  saveAppState();
}

function syncEditableDisplay() {
  state.errorMessage = "";
  state.answerVisible = false;
  state.expression = sanitizeExpression(resultEl.textContent);
  resultEl.textContent = displayExpression(state.expression);
  expressionEl.textContent = t("expression");
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
  return formatExpressionDisplayNumberStyle(formatExpressionNumbers(String(value)))
    .replaceAll("*", "×")
    .replaceAll("/", "÷")
    .replaceAll("sqrt", "√")
    .replaceAll("pi", "π")
    .replaceAll("Infinity", "inf");
}

function formatExpressionDisplayNumberStyle(value) {
  if (settings.zerosBeforeDecimals) return value;
  return value.replace(/(^|[^0-9.])0\./g, "$1.");
}

function formatExpressionNumbers(value) {
  if (!settings.commas) return value;
  return value.replace(/(\d+\.?\d*|\.\d+)(e[+-]?\d+)?/gi, (match, number, exponent = "") => {
    if (exponent) return match;
    const [integerPart, decimalPart] = number.split(".");
    const groupedInteger = integerPart.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return decimalPart === undefined ? groupedInteger : `${groupedInteger}.${decimalPart}`;
  });
}

function setExpression(value) {
  state.errorMessage = "";
  state.answerVisible = false;
  state.expression = sanitizeExpression(value);
  render();
}

function sanitizeExpression(value) {
  const normalized = normalizeExpressionText(value);
  const trimmed = filterExpressionText(normalized);
  return trimmed.length ? trimmed : "0";
}

function normalizeExpressionText(value) {
  return String(value)
    .trim()
    .replaceAll(",", "")
    .replaceAll("×", "*")
    .replaceAll("÷", "/")
    .replaceAll("√", "sqrt")
    .replaceAll("π", "pi")
    .replaceAll("−", "-")
    .replaceAll("x", "*")
    .replaceAll("X", "*");
}

function filterExpressionText(value) {
  let output = "";
  let cursor = 0;

  while (cursor < value.length) {
    const char = value[cursor];

    if (/\s/.test(char)) {
      cursor += 1;
      continue;
    }

    if (/[0-9.+\-*/^()!]/.test(char)) {
      output += char;
      cursor += 1;
      continue;
    }

    if (/[a-z]/i.test(char)) {
      let word = char;
      cursor += 1;
      while (cursor < value.length && /[a-z]/i.test(value[cursor])) {
        word += value[cursor];
        cursor += 1;
      }

      const normalizedWord = word.toLowerCase();
      if (validExpressionWords.has(normalizedWord)) output += normalizedWord;
      continue;
    }

    cursor += 1;
  }

  return output;
}

function isAllowedEditableText(value) {
  const normalized = normalizeExpressionText(value);
  const compact = normalized.replace(/\s+/g, "");
  if (!compact.length) return true;
  return filterExpressionText(normalized) === compact;
}

function insertToken(token) {
  if (state.answerVisible) {
    if (operators.has(token)) {
      state.answerVisible = false;
    } else if (settings.appendAfterAnswer) {
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
  state.lastRepeatOperation = null;
  state.expression = "0";
  render();
}

function backspace() {
  if (state.answerVisible) {
    if (settings.trimAnswerBackspace && Number.isFinite(state.lastAnswer)) {
      const answerText = toExpressionNumber(state.lastAnswer);
      const trimmed = answerText.slice(0, -1);
      setExpression(trimmed && trimmed !== "-" ? trimmed : "0");
      return;
    }

    clearExpression();
    return;
  }

  if (state.expression.length <= 1) {
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
  const repeatedInput = getRepeatedEqualsInput();
  const input = prepareExpressionForEvaluation(repeatedInput || state.expression);
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
  if (settings.autoMemory) state.memory = shownValue;
  state.history = state.history.slice(0, getCalculationMax());
  state.lastExpression = input;
  state.lastAnswer = shownValue;
  state.lastRepeatOperation = repeatedInput
    ? state.lastRepeatOperation
    : getRepeatOperation(input);
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

function getRepeatedEqualsInput() {
  if (!settings.repeatEquals || !state.answerVisible || !state.lastRepeatOperation) return null;
  if (!Number.isFinite(state.lastAnswer)) return null;
  return `${toExpressionNumber(state.lastAnswer)}${state.lastRepeatOperation.operator}${state.lastRepeatOperation.operand}`;
}

function getRepeatOperation(input) {
  const operatorIndex = findRepeatOperatorIndex(input);
  if (operatorIndex < 0) return null;

  const operand = input.slice(operatorIndex + 1).trim();
  if (!operand) return null;

  try {
    evaluateExpression(operand);
  } catch {
    return null;
  }

  return {
    operator: input[operatorIndex],
    operand,
  };
}

function findRepeatOperatorIndex(input) {
  let depth = 0;

  for (let index = input.length - 1; index >= 0; index -= 1) {
    const char = input[index];
    if (char === ")") {
      depth += 1;
      continue;
    }
    if (char === "(") {
      depth -= 1;
      continue;
    }
    if (depth !== 0 || !operators.has(char)) continue;
    if ((char === "+" || char === "-") && isUnaryOperator(input, index)) continue;
    return index;
  }

  return -1;
}

function isUnaryOperator(input, index) {
  let cursor = index - 1;
  while (cursor >= 0 && /\s/.test(input[cursor])) cursor -= 1;
  if (cursor < 0) return true;
  return operators.has(input[cursor]) || input[cursor] === "(";
}

function isValidRepeatOperation(operation) {
  return Boolean(
    operation &&
    operators.has(operation.operator) &&
    typeof operation.operand === "string" &&
    operation.operand.trim(),
  );
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

function formatDisplayAnswer(value) {
  if (shouldShowWordCorner(value)) return formatNumber(value);
  return formatAnswer(value);
}

function shouldShowWordCorner(value) {
  return settings.wordForm && settings.wordFormCorner && Number.isFinite(value);
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
    ? t("selectedOf", { selected: selectedCount, total: state.history.length })
    : state.history.length
      ? t(state.history.length === 1 ? "calculationCount" : "calculationsCount", {
          count: state.history.length,
        })
      : t("noCalculations");

  selectHistoryButton.textContent = state.historySelectionMode ? t("done") : t("select");
  selectAllHistoryButton.classList.toggle("is-hidden", !state.historySelectionMode);
  deleteSelectedHistoryButton.classList.toggle("is-hidden", !state.historySelectionMode);
  selectAllHistoryButton.textContent =
    selectedCount === state.history.length && state.history.length ? t("clearSelection") : t("selectAll");

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
  return new Intl.DateTimeFormat(getLocale(), {
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
      ? t("deleteAllMessage")
      : t(ids.length === 1 ? "deleteSelectedMessage" : "deleteSelectedPluralMessage", {
          count: ids.length,
        });
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
  state.angleMode = ["DEG", "RAD", "GRAD"].includes(mode) ? mode : "DEG";
  angleButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.angle === state.angleMode);
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
  populateUnitOptions(type);
  state.converterSource = "from";
  updateConversion("from");

  if (type === "money" && !moneyCurrenciesLoaded) {
    loadMoneyCurrencies().then(() => {
      if (converterType.value !== "money") return;
      const previousFrom = fromUnit.value;
      const previousTo = toUnit.value;
      populateUnitOptions("money", previousFrom, previousTo);
      updateConversion(state.converterSource);
    });
  }
}

function populateUnitOptions(type, preferredFrom = units[type].defaults[0], preferredTo = units[type].defaults[1]) {
  const unitNames = Object.keys(units[type].units).sort((a, b) =>
    getUnitOptionLabel(a, type).localeCompare(getUnitOptionLabel(b, type)),
  );
  fromUnit.innerHTML = "";
  toUnit.innerHTML = "";

  unitNames.forEach((unitName) => {
    const label = getUnitOptionLabel(unitName, type);
    fromUnit.add(new Option(label, unitName));
    toUnit.add(new Option(label, unitName));
  });

  const [defaultFrom, defaultTo] = units[type].defaults;
  fromUnit.value = unitNames.includes(preferredFrom) ? preferredFrom : defaultFrom;
  toUnit.value = unitNames.includes(preferredTo) ? preferredTo : defaultTo;
}

async function loadMoneyCurrencies() {
  if (moneyCurrenciesLoaded) return;

  try {
    const response = await fetch("https://api.frankfurter.dev/v2/currencies");
    if (!response.ok) throw new Error("Currencies unavailable");
    const data = await response.json();
    const currencies = Array.isArray(data.value) ? data.value : [];

    currencies.forEach((currency) => {
      const code = currency.iso_code;
      if (!/^[A-Z]{3}$/.test(code)) return;
      units.money.units[code] = 1;
      unitLabels[code] = currency.name || unitLabels[code] || code;
    });
  } catch {
    // The local fallback list keeps Money usable when rates metadata cannot load.
  }

  moneyCurrenciesLoaded = true;
}

function getUnitOptionLabel(unitName, type) {
  const label = unitLabels[unitName] || unitName;
  return type === "money" ? `${unitName} - ${label}` : label;
}

async function updateConversion(source) {
  state.converterSource = source;
  const requestId = ++conversionRequestId;
  const type = converterType.value;
  const sourceInput = source === "from" ? converterInput : converterOutput;
  const targetInput = source === "from" ? converterOutput : converterInput;
  const sourceUnit = source === "from" ? fromUnit.value : toUnit.value;
  const targetUnit = source === "from" ? toUnit.value : fromUnit.value;
  const value = parseConverterInput(sourceInput.value, sourceUnit);

  if (!Number.isFinite(value)) {
    targetInput.value = "";
    saveAppState();
    return;
  }

  let converted;
  try {
    converted = await convertUnit(value, type, sourceUnit, targetUnit);
  } catch {
    if (requestId === conversionRequestId) targetInput.value = "";
    saveAppState();
    return;
  }
  if (requestId !== conversionRequestId) return;
  targetInput.value = formatConverterNumber(converted, targetUnit);
  saveAppState();
}

function bindConverterInput(input, source) {
  input.addEventListener("keydown", (event) => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;

    const key = event.key.toLowerCase();
    if (key === "n") {
      event.preventDefault();
      insertConverterConstant(input, source, "pi");
      return;
    }

    if (key === "e") {
      event.preventDefault();
      insertConverterConstant(input, source, "e");
    }
  });

  input.addEventListener("beforeinput", (event) => {
    if (event.inputType === "insertLineBreak") {
      event.preventDefault();
      return;
    }

    if (!event.inputType.startsWith("insert")) return;
    const unitName = getConverterInputUnit(source);
    const text = event.data || "";
    const lowerText = text.toLowerCase();
    if ((text === "." || text === ",") && !isFeetInchesUnit(unitName)) {
      event.preventDefault();
      insertConverterText(input, source, getConverterDecimalSeparator());
      return;
    }

    if (lowerText === "n" || lowerText === "e") {
      event.preventDefault();
      insertConverterConstant(input, source, lowerText === "n" ? "pi" : "e");
      return;
    }

    const nextValue = getInputValueAfterEdit(input, text);
    if (!isValidConverterInput(nextValue, unitName)) event.preventDefault();
  });

  input.addEventListener("paste", (event) => {
    event.preventDefault();
    const text = event.clipboardData.getData("text/plain");
    const unitName = getConverterInputUnit(source);
    const nextValue = getInputValueAfterEdit(input, text);
    if (!isValidConverterInput(nextValue, unitName)) return;
    input.setRangeText(text, input.selectionStart ?? input.value.length, input.selectionEnd ?? input.value.length, "end");
    formatConverterInputElement(input, { unitName });
    updateConversion(source);
  });

  input.addEventListener("input", () => {
    formatConverterInputElement(input, { unitName: getConverterInputUnit(source) });
    updateConversion(source);
  });

  input.addEventListener("blur", () => {
    formatConverterInputElement(input, {
      preserveCaret: false,
      unitName: getConverterInputUnit(source),
      normalizeCompound: true,
    });
    updateConversion(source);
  });
}

function getInputValueAfterEdit(input, text) {
  const start = input.selectionStart ?? input.value.length;
  const end = input.selectionEnd ?? input.value.length;
  return `${input.value.slice(0, start)}${text}${input.value.slice(end)}`;
}

function getConverterInputUnit(source) {
  return source === "from" ? fromUnit.value : toUnit.value;
}

function isFeetInchesUnit(unitName) {
  return unitName === "feet_inches";
}

function isValidConverterInput(value, unitName = null) {
  if (isFeetInchesUnit(unitName)) return /^[+\-]?[0-9a-z\s.,'"′″+-]*$/i.test(String(value));
  return isValidConverterCanonical(canonicalizeConverterText(value));
}

function sanitizeConverterInput(value) {
  const canonical = canonicalizeConverterText(value);
  return isValidConverterCanonical(canonical) ? canonical : "";
}

function parseConverterInput(value, unitName = null) {
  if (isFeetInchesUnit(unitName)) return parseFeetInchesInput(value);
  return parseConverterNumberInput(value);
}

function parseConverterNumberInput(value) {
  const canonical = sanitizeConverterInput(value);
  const sign = canonical.startsWith("-") ? -1 : 1;
  const body = canonical.replace(/^[+-]/, "");

  if (body === "pi") return sign * Math.PI;
  if (body === "e") return sign * Math.E;
  if (!body || body === ".") return NaN;

  const number = Number(canonical);
  return Number.isFinite(number) ? number : NaN;
}

function parseFeetInchesInput(value) {
  let text = String(value)
    .trim()
    .toLowerCase()
    .replaceAll("′", "'")
    .replaceAll("″", "\"");

  if (!text) return NaN;

  const sign = text.startsWith("-") ? -1 : 1;
  text = text.replace(/^[+-]/, "").trim();

  if (!/[a-df-z'"\s]/i.test(text)) {
    const decimalFeet = parseConverterNumberInput(`${sign < 0 ? "-" : ""}${text}`);
    return Number.isFinite(decimalFeet) ? decimalFeet : NaN;
  }

  let feet = 0;
  let inches = 0;
  let foundPart = false;
  const feetMatch = text.match(/([0-9][0-9.,]*)\s*(?:ft|feet|foot|')/i);
  const inchMatch = text.match(/([0-9][0-9.,]*)\s*(?:in|inch|inches|")/i);

  if (feetMatch) {
    feet = parseConverterNumberInput(feetMatch[1]);
    foundPart = true;
  }

  if (inchMatch) {
    inches = parseConverterNumberInput(inchMatch[1]);
    foundPart = true;
  }

  if (!foundPart) {
    const numbers = text.match(/[0-9][0-9.,]*/g) || [];
    if (numbers.length >= 2) {
      feet = parseConverterNumberInput(numbers[0]);
      inches = parseConverterNumberInput(numbers[1]);
      foundPart = true;
    } else if (numbers.length === 1) {
      feet = parseConverterNumberInput(numbers[0]);
      foundPart = true;
    }
  }

  if (!foundPart || !Number.isFinite(feet) || !Number.isFinite(inches)) return NaN;
  return sign * (feet + inches / 12);
}

function insertConverterConstant(input, source, constant) {
  const unitName = getConverterInputUnit(source);
  const nextValue = getInputValueAfterEdit(input, constant);

  if (isValidConverterInput(nextValue, unitName)) {
    input.setRangeText(
      constant,
      input.selectionStart ?? input.value.length,
      input.selectionEnd ?? input.value.length,
      "end",
    );
  } else {
    const existing = canonicalizeConverterText(input.value);
    const sign = existing.startsWith("-") ? "-" : existing.startsWith("+") ? "+" : "";
    input.value = `${sign}${constant}`;
  }

  formatConverterInputElement(input, { unitName });
  updateConversion(source);
}

function insertConverterText(input, source, text) {
  const unitName = getConverterInputUnit(source);
  const nextValue = getInputValueAfterEdit(input, text);
  if (!isValidConverterInput(nextValue, unitName)) return;

  input.setRangeText(
    text,
    input.selectionStart ?? input.value.length,
    input.selectionEnd ?? input.value.length,
    "end",
  );
  formatConverterInputElement(input, { unitName });
  updateConversion(source);
}

function refreshConverterFormatting() {
  formatConverterInputElement(converterInput, {
    preserveCaret: document.activeElement === converterInput,
    unitName: fromUnit.value,
  });
  formatConverterInputElement(converterOutput, {
    preserveCaret: document.activeElement === converterOutput,
    unitName: toUnit.value,
  });
  updateConversion(state.converterSource);
}

function getConverterCanonicalValues() {
  return {
    input: converterInput.value,
    output: converterOutput.value,
  };
}

function restoreConverterCanonicalValues(values) {
  converterInput.value = values.input;
  converterOutput.value = values.output;
  formatConverterInputElement(converterInput, { preserveCaret: false, unitName: fromUnit.value });
  formatConverterInputElement(converterOutput, { preserveCaret: false, unitName: toUnit.value });
  updateConversion(state.converterSource);
}

function handleConverterUnitChange(source) {
  const input = source === "from" ? converterInput : converterOutput;
  const unitName = getConverterInputUnit(source);

  if (isFeetInchesUnit(unitName)) {
    formatConverterInputElement(input, { preserveCaret: false, unitName, normalizeCompound: true });
  } else if (/[a-z'"′″]/i.test(input.value)) {
    const feetValue = parseFeetInchesInput(input.value);
    if (Number.isFinite(feetValue)) input.value = formatConverterNumber(feetValue, unitName);
  } else {
    formatConverterInputElement(input, { preserveCaret: false, unitName });
  }

  updateConversion(state.converterSource);
}

function formatConverterInputElement(input, options = {}) {
  const { preserveCaret = true, unitName = null, normalizeCompound = false } = options;
  if (isFeetInchesUnit(unitName)) {
    if (normalizeCompound) {
      const value = parseFeetInchesInput(input.value);
      if (Number.isFinite(value)) input.value = formatFeetInches(value);
    }
    return;
  }

  const caretStart = input.selectionStart ?? input.value.length;
  const canonicalBeforeCaret = canonicalizeConverterText(input.value.slice(0, caretStart));
  const canonical = sanitizeConverterInput(input.value);
  input.value = formatConverterCanonical(canonical);

  if (preserveCaret && document.activeElement === input) {
    const caret = getFormattedCaretIndex(input.value, canonicalBeforeCaret.length);
    input.setSelectionRange(caret, caret);
  }
}

function getFormattedCaretIndex(value, canonicalLength) {
  if (canonicalLength <= 0) return 0;

  const decimalSeparator = getConverterDecimalSeparator();
  const groupSeparator = getConverterGroupSeparator();
  let seenCanonicalCharacters = 0;

  for (let index = 0; index < value.length; index += 1) {
    const char = value[index];
    if (/[0-9a-z+-]/i.test(char) || char === decimalSeparator) {
      seenCanonicalCharacters += 1;
    } else if (char !== groupSeparator) {
      seenCanonicalCharacters += 1;
    }

    if (seenCanonicalCharacters >= canonicalLength) return index + 1;
  }

  return value.length;
}

function formatConverterNumber(value, unitName = null) {
  if (isFeetInchesUnit(unitName)) return formatFeetInches(value);
  return formatConverterCanonical(toInputNumber(value));
}

function formatFeetInches(decimalFeet) {
  if (!Number.isFinite(decimalFeet)) return "";

  const sign = decimalFeet < 0 ? "-" : "";
  const absFeet = Math.abs(decimalFeet);
  let wholeFeet = Math.floor(absFeet);
  let inches = (absFeet - wholeFeet) * 12;
  const precision = clamp(settings.decimalPrecision, 0, 15);
  const inchPrecision = Math.min(precision, 6);
  inches = Number(inches.toFixed(inchPrecision));

  if (Math.abs(inches - 12) < 10 ** -inchPrecision) {
    wholeFeet += 1;
    inches = 0;
  }

  const feetText = formatConverterCanonical(String(wholeFeet));
  const inchesText = formatConverterCanonical(toInputNumber(inches));
  return `${sign}${feetText} ft ${inchesText} in`;
}

function formatConverterCanonical(canonical) {
  if (!canonical) return "";

  const decimalSeparator = getConverterDecimalSeparator();
  const groupSeparator = getConverterGroupSeparator();
  const sign = canonical.startsWith("-") || canonical.startsWith("+") ? canonical[0] : "";
  const body = sign ? canonical.slice(1) : canonical;

  if (body === "p" || body === "pi" || body === "e") return `${sign}${body}`;
  if (body.includes("e")) return `${sign}${body.replace(".", decimalSeparator)}`;

  const hasTrailingDecimal = body.endsWith(".");
  const [integer = "", decimal = ""] = body.split(".");
  const groupedInteger = settings.commas
    ? integer.replace(/\B(?=(\d{3})+(?!\d))/g, groupSeparator)
    : integer;

  if (body.includes(".")) {
    return `${sign}${groupedInteger || "0"}${decimalSeparator}${hasTrailingDecimal ? "" : decimal}`;
  }

  return `${sign}${groupedInteger}`;
}

function canonicalizeConverterText(value) {
  let text = String(value)
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "")
    .replaceAll("π", "pi")
    .replaceAll("−", "-");

  if (text === "n" || text === "+n" || text === "-n") {
    return text.replace("n", "pi");
  }

  const sign = text.startsWith("-") || text.startsWith("+") ? text[0] : "";
  if (sign) text = text.slice(1);

  if (/^[a-z]+$/.test(text)) return `${sign}${text}`;

  const decimalSeparator = pickConverterDecimalSeparator(text);
  let output = sign;
  let hasDecimal = false;

  for (const char of text) {
    if (/[0-9]/.test(char)) {
      output += char;
      continue;
    }

    if ((char === "." || char === ",") && char === decimalSeparator && !hasDecimal) {
      output += ".";
      hasDecimal = true;
    }
  }

  return output;
}

function isValidConverterCanonical(value) {
  if (/^[+-]?$/.test(value)) return true;

  const body = value.replace(/^[+-]/, "");
  if ("pi".startsWith(body)) return true;
  if (body === "e") return true;

  return /^\d*(?:\.\d*)?$/.test(body);
}

function pickConverterDecimalSeparator(text) {
  const lastComma = text.lastIndexOf(",");
  const lastDot = text.lastIndexOf(".");

  if (lastComma >= 0 && lastDot >= 0) return lastComma > lastDot ? "," : ".";
  if (lastComma >= 0) return pickSingleConverterSeparator(text, ",");
  if (lastDot >= 0) return pickSingleConverterSeparator(text, ".");
  return "";
}

function pickSingleConverterSeparator(text, separator) {
  const activeDecimal = getConverterDecimalSeparator();
  const activeGroup = getConverterGroupSeparator();

  if (separator === activeDecimal) return separator;
  if (separator === activeGroup) return "";
  return separator;
}

function getConverterDecimalSeparator() {
  return settings.europeanSeparator ? "," : ".";
}

function getConverterGroupSeparator() {
  return settings.europeanSeparator ? "." : ",";
}

async function convertUnit(value, type, from, to) {
  if (type === "money") return convertMoney(value, from, to);
  if (type === "temperature") return convertTemperature(value, from, to);
  const fromFactor = units[type].units[from];
  const toFactor = units[type].units[to];
  return (value * fromFactor) / toFactor;
}

async function convertMoney(value, from, to) {
  if (from === to) return value;
  const rate = await getMoneyRate(from, to);
  return value * rate;
}

async function getMoneyRate(from, to) {
  const key = `${from}-${to}`;
  if (moneyRateCache.has(key)) return moneyRateCache.get(key);

  try {
    const response = await fetch(`https://api.frankfurter.dev/v2/rate/${from}/${to}`);
    if (!response.ok) throw new Error("Rate unavailable");
    const data = await response.json();
    const rate = Number(data.rate);
    if (!Number.isFinite(rate)) throw new Error("Rate unavailable");
    moneyRateCache.set(key, rate);
    return rate;
  } catch {
    const fallbackRate = fallbackMoneyRates[to] / fallbackMoneyRates[from];
    if (!Number.isFinite(fallbackRate)) throw new Error("Rate unavailable");
    moneyRateCache.set(key, fallbackRate);
    return fallbackRate;
  }
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

    while (this.peek("!")) {
      const factorialCount = this.consumeFactorialRun();

      if (this.iteratedFactorials) {
        for (let index = 0; index < factorialCount; index += 1) {
          value = factorial(value);
        }
        continue;
      }

      value = factorialCount === 1 ? factorial(value) : multifactorial(value, factorialCount);
    }

    return value;
  }

  consumeFactorialRun() {
    let count = 0;
    while (this.match("!")) count += 1;
    return count;
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
    const trigValue =
      this.angleMode === "DEG" ? (value * Math.PI) / 180 :
      this.angleMode === "GRAD" ? (value * Math.PI) / 200 :
      value;

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
    if (this.angleMode === "DEG") return (value * 180) / Math.PI;
    if (this.angleMode === "GRAD") return (value * 200) / Math.PI;
    return value;
  }
}

function factorial(value) {
  if (!Number.isFinite(value) || value < 0 || value > 170) {
    throw new Error("Factorial requires a number from 0 to 170");
  }

  let result;
  if (Number.isInteger(value)) {
    result = 1;
    for (let index = 2; index <= value; index += 1) {
      result *= index;
    }
  } else {
    result = gamma(value + 1);
  }

  if (!Number.isFinite(result)) throw new Error("Result is too large");
  return result;
}

function multifactorial(value, step) {
  if (!Number.isFinite(value) || value < 0 || value > 300) {
    throw new Error("Multifactorial requires a number from 0 to 300");
  }

  if (value === 0 || value === 1) return 1;

  let result = 1;
  for (let index = value; index > 0; index -= step) {
    result *= index;
    if (!Number.isFinite(result)) throw new Error("Result is too large");
  }
  return result;
}

function gamma(value) {
  const coefficients = [
    676.5203681218851,
    -1259.1392167224028,
    771.3234287776531,
    -176.6150291621406,
    12.507343278686905,
    -0.13857109526572012,
    9.984369578019572e-6,
    1.5056327351493116e-7,
  ];

  if (value < 0.5) {
    return Math.PI / (Math.sin(Math.PI * value) * gamma(1 - value));
  }

  let adjusted = value - 1;
  let series = 0.9999999999998099;
  for (let index = 0; index < coefficients.length; index += 1) {
    series += coefficients[index] / (adjusted + index + 1);
  }

  const t = adjusted + coefficients.length - 0.5;
  return Math.sqrt(2 * Math.PI) * Math.pow(t, adjusted + 0.5) * Math.exp(-t) * series;
}

function updateToggleUi() {
  setToggle("fractionToggle", "fractionToggleText", "fractions", settings.fractions);
  setToggle("improperToggle", "improperToggleText", "improperFractions", settings.improperFractions);
  setToggle("commasToggle", "commasToggleText", "commas", settings.commas);
  setToggle("separatorToggle", "separatorToggleText", "europeanStyle", settings.europeanSeparator);
  setToggle("wrongAnswersToggle", "wrongAnswersToggleText", "wrongAnswersOnly", settings.wrongAnswersOnly);
  setToggle("wordFormToggle", "wordFormToggleText", "wordForm", settings.wordForm);
  setToggle("wordCornerToggle", "wordCornerToggleText", "wordCorner", settings.wordFormCorner);
  setToggle("pedmasToggle", "pedmasToggleText", "pemdas", settings.pemdas);
  setToggle("autoMemoryToggle", "autoMemoryToggleText", "autoMemory", settings.autoMemory);
  setToggle(
    "appendAfterAnswerToggle",
    "appendAfterAnswerToggleText",
    "appendAfterAnswer",
    settings.appendAfterAnswer,
  );
  setToggle(
    "trimAnswerBackspaceToggle",
    "trimAnswerBackspaceToggleText",
    "trimAnswerBackspace",
    settings.trimAnswerBackspace,
  );
  setToggle("repeatEqualsToggle", "repeatEqualsToggleText", "repeatEquals", settings.repeatEquals);
  setToggle("autoCloseParenToggle", "autoCloseParenToggleText", "autoCloseParen", settings.autoCloseParen);
  setToggle("notesToggle", "notesToggleText", "notes", settings.notes);
  setToggle("factorialToggle", "factorialToggleText", "iteratedFactorials", settings.iteratedFactorials);
  setToggle("zerosToggle", "zerosToggleText", "zerosBeforeDecimals", settings.zerosBeforeDecimals);

  document.querySelector("#improperToggle").style.display = settings.fractions ? "flex" : "none";
  document.querySelector("#wordCornerToggle").style.display = settings.wordForm ? "flex" : "none";
  document.querySelector("#decimalPrecisionInput").value = settings.decimalPrecision;
  document.querySelector("#sciThresholdInput").value = settings.sciThreshold;
  calculationMaxInput.value = getCalculationMax();
}

function setToggle(buttonId, textId, labelKey, active) {
  const button = document.querySelector(`#${buttonId}`);
  const text = document.querySelector(`#${textId}`);
  if (!button || !text) return;
  button.classList.toggle("on", active);
  text.textContent = `${t(labelKey)}: ${active ? t("on") : t("off")}`;
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
  refreshConverterFormatting();
  render();
  renderHistory();
}

function toggleSeparator() {
  const converterValues = getConverterCanonicalValues();
  settings.europeanSeparator = !settings.europeanSeparator;
  restoreConverterCanonicalValues(converterValues);
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

function toggleWordFormCorner() {
  settings.wordFormCorner = !settings.wordFormCorner;
  render();
  renderHistory();
}

function togglePemdas() {
  settings.pemdas = !settings.pemdas;
  render();
}

function toggleAutoMemory() {
  settings.autoMemory = !settings.autoMemory;
  render();
}

function toggleAppendAfterAnswer() {
  settings.appendAfterAnswer = !settings.appendAfterAnswer;
  render();
}

function toggleTrimAnswerBackspace() {
  settings.trimAnswerBackspace = !settings.trimAnswerBackspace;
  render();
}

function toggleRepeatEquals() {
  settings.repeatEquals = !settings.repeatEquals;
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

function getCalculationMax() {
  return clamp(Math.round(Number(settings.calculationMax)), 1, 5000);
}

function updateCalculationMax(value) {
  settings.calculationMax = clamp(Math.round(Number(value)), 1, 5000);
  state.history = state.history.slice(0, settings.calculationMax);
  renderHistory();
  render();
}

const rangeBindings = [
  { input: appWidthInput, property: "--app-width", unit: "px" },
  { input: appPaddingInput, property: "--app-padding", unit: "px" },
  { input: panelGapInput, property: "--panel-gap", unit: "px" },
  { input: appRadiusInput, property: "--app-radius", unit: "px" },
  { input: buttonRadiusInput, property: "--control-radius", unit: "px" },
  { input: controlHeightInput, property: "--control-height", unit: "px" },
  { input: keyHeightInput, property: "--key-height", unit: "" },
  { input: displayHeightInput, property: "--display-height", unit: "px" },
  { input: displayPaddingInput, property: "--display-padding", unit: "px" },
  { input: displayTextInput, property: "--display-font-size", unit: "" },
  { input: keyTextInput, property: "--key-font-size", unit: "" },
  { input: titleTextInput, property: "--title-font-size", unit: "" },
  { input: bodyTextInput, property: "--body-font-size", unit: "" },
  { input: historyAnswerTextInput, property: "--history-answer-font-size", unit: "" },
  { input: buttonGapInput, property: "--button-gap", unit: "px" },
  { input: borderWidthInput, property: "--border-width", unit: "px" },
  { input: shadowSoftnessInput, property: "--shadow-softness", unit: "%" },
  { input: controlShadowSoftnessInput, property: "--control-shadow-softness", unit: "%" },
  { input: overlaySoftnessInput, property: "--overlay-softness", unit: "%" },
  { input: settingsWidthInput, property: "--settings-width", unit: "px" },
  { input: settingsPaddingInput, property: "--settings-padding", unit: "px" },
  { input: settingsSectionPaddingInput, property: "--settings-section-padding", unit: "px" },
  { input: cardPaddingInput, property: "--card-padding", unit: "px" },
  { input: converterPaddingInput, property: "--converter-padding", unit: "px" },
];

function applyUiSetting(name, value) {
  document.body.style.setProperty(name, value);
}

function normalizeMainThemeName(themeName, fallback = "light") {
  if (mainThemeDefaults[themeName]) return themeName;
  return mainThemeDefaults[fallback] ? fallback : "light";
}

function normalizeThemeName(themeName, fallback = "originalDark") {
  if (colorThemeDefaults[themeName]) return themeName;
  return colorThemeDefaults[fallback] ? fallback : "originalDark";
}

function resetUiMainThemes(savedThemes = {}) {
  Object.keys(uiMainThemes).forEach((themeName) => {
    delete uiMainThemes[themeName];
  });

  mainThemeOrder.forEach((themeName) => {
    uiMainThemes[themeName] = {
      ...mainThemeDefaults[themeName],
      ...(savedThemes[themeName] || {}),
    };
  });
}

function resetUiThemes(savedThemes = {}) {
  Object.keys(uiThemes).forEach((themeName) => {
    delete uiThemes[themeName];
  });

  themeOrder.forEach((themeName) => {
    uiThemes[themeName] = {
      ...colorThemeDefaults[themeName],
      ...pickThemeProperties(savedThemes[themeName] || {}, colorThemeProperties),
    };
  });
}

function getCombinedTheme(mainThemeName = currentMainTheme, themeName = currentTheme) {
  const normalizedMainTheme = normalizeMainThemeName(mainThemeName, currentMainTheme);
  const normalizedTheme = normalizeThemeName(themeName, currentTheme);
  return {
    ...uiMainThemes[normalizedMainTheme],
    ...uiThemes[normalizedTheme],
  };
}

function applyThemeToDocument(themeName = currentTheme, mainThemeName = currentMainTheme) {
  currentMainTheme = normalizeMainThemeName(mainThemeName, currentMainTheme);
  currentTheme = normalizeThemeName(themeName, currentTheme);
  document.body.classList.toggle("dark", currentMainTheme === "dark");
  if (mainThemeSelect) mainThemeSelect.value = currentMainTheme;
  if (themeSelect) themeSelect.value = currentTheme;

  Object.entries(getCombinedTheme(currentMainTheme, currentTheme)).forEach(([name, value]) => {
    applyUiSetting(name, value);
  });
}

function setEditingMainTheme(themeName) {
  editingMainTheme = normalizeMainThemeName(themeName, editingMainTheme);
  mainThemeEditorSelect.value = editingMainTheme;
  syncThemeControls();
  saveAppState();
}

function setEditingTheme(themeName) {
  editingTheme = normalizeThemeName(themeName, editingTheme);
  themeEditorSelect.value = editingTheme;
  syncThemeControls();
  saveAppState();
}

function syncThemeControls() {
  editingMainTheme = normalizeMainThemeName(editingMainTheme);
  editingTheme = normalizeThemeName(editingTheme);
  const mainTheme = uiMainThemes[editingMainTheme] || mainThemeDefaults[editingMainTheme];
  const colorTheme = uiThemes[editingTheme] || colorThemeDefaults[editingTheme];
  const combinedTheme = { ...mainTheme, ...colorTheme };
  uiColorInputs.forEach((input) => {
    input.value =
      combinedTheme[input.dataset.uiColor] ||
      mainThemeDefaults[editingMainTheme][input.dataset.uiColor] ||
      colorThemeDefaults[editingTheme][input.dataset.uiColor] ||
      lightUiDefaults[input.dataset.uiColor];
  });

  mainThemeEditorSelect.value = editingMainTheme;
  themeEditorSelect.value = editingTheme;
  if (mainThemeSelect) mainThemeSelect.value = currentMainTheme;
  if (themeSelect) themeSelect.value = currentTheme;
  fontSelect.value = mainTheme["--font-family"] || mainThemeDefaults[editingMainTheme]["--font-family"];

  rangeBindings.forEach(({ input, property }) => {
    if (!input) return;
    const value = combinedTheme[property] || mainThemeDefaults[editingMainTheme][property] || lightUiDefaults[property];
    input.value = String(value).replace("px", "").replace("%", "");
  });
}

function setThemeValue(name, value) {
  editingMainTheme = normalizeMainThemeName(editingMainTheme);
  editingTheme = normalizeThemeName(editingTheme);
  const targetTheme = colorThemeProperties.has(name) ? uiThemes[editingTheme] : uiMainThemes[editingMainTheme];
  targetTheme[name] = value;

  if (
    (colorThemeProperties.has(name) && editingTheme === currentTheme) ||
    (!colorThemeProperties.has(name) && editingMainTheme === currentMainTheme)
  ) {
    applyThemeToDocument(currentTheme, currentMainTheme);
  }
  saveAppState();
}

function applyRangeSettings() {
  rangeBindings.forEach(({ input, property, unit }) => {
    setThemeValue(property, `${input.value}${unit}`);
  });
}

function resetUi() {
  editingMainTheme = normalizeMainThemeName(editingMainTheme);
  editingTheme = normalizeThemeName(editingTheme);
  uiMainThemes[editingMainTheme] = { ...mainThemeDefaults[editingMainTheme] };
  uiThemes[editingTheme] = { ...colorThemeDefaults[editingTheme] };
  if (editingMainTheme === currentMainTheme || editingTheme === currentTheme) {
    applyThemeToDocument(currentTheme, currentMainTheme);
  }
  syncThemeControls();
  saveAppState();
}

function resetAll() {
  Object.assign(settings, defaultSettings);
  resetUiMainThemes();
  resetUiThemes();
  currentMainTheme = "dark";
  editingMainTheme = "dark";
  currentTheme = "originalDark";
  editingTheme = "originalDark";
  applyThemeToDocument(currentTheme, currentMainTheme);
  syncThemeControls();
  applyLanguage();
  refreshConverterFormatting();
  render();
  renderHistory();
  saveAppState();
}

function saveAppState() {
  if (isRestoring) return;

  const activeTab = tabs.find((tab) => tab.classList.contains("is-active"))?.dataset.panel || "basic";
  const data = {
    settings,
    uiMainThemes,
    uiThemes,
    currentMainTheme,
    editingMainTheme,
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
      lastRepeatOperation: state.lastRepeatOperation,
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
    settings.language = translations[settings.language] ? settings.language : defaultSettings.language;
    resetUiMainThemes(data.uiMainThemes || data.uiThemes || {});
    resetUiThemes(data.uiThemes || {});

    currentMainTheme = normalizeMainThemeName(
      data.currentMainTheme,
      mainThemeDefaults[data.currentTheme] ? data.currentTheme : "dark",
    );
    editingMainTheme = normalizeMainThemeName(
      data.editingMainTheme,
      mainThemeDefaults[data.editingTheme] ? data.editingTheme : currentMainTheme,
    );
    currentTheme = normalizeThemeName(
      data.currentTheme,
      colorThemeDefaults[data.currentTheme] ? data.currentTheme : "originalDark",
    );
    editingTheme = normalizeThemeName(
      data.editingTheme,
      colorThemeDefaults[data.editingTheme] ? data.editingTheme : currentTheme,
    );
    notesInput.value = data.notes || "";

    if (data.calculator) {
      state.expression = sanitizeExpression(data.calculator.expression || "0");
      state.angleMode = ["DEG", "RAD", "GRAD"].includes(data.calculator.angleMode)
        ? data.calculator.angleMode
        : "DEG";
      state.memory = typeof data.calculator.memory === "number" ? data.calculator.memory : null;
      state.history = Array.isArray(data.calculator.history) ? data.calculator.history : [];
      state.answerVisible = Boolean(data.calculator.answerVisible);
      state.lastExpression = data.calculator.lastExpression || "";
      state.lastAnswer =
        typeof data.calculator.lastAnswer === "number" ? data.calculator.lastAnswer : null;
      state.lastRepeatOperation = isValidRepeatOperation(data.calculator.lastRepeatOperation)
        ? data.calculator.lastRepeatOperation
        : null;
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
  formatConverterInputElement(converterInput, { preserveCaret: false });
  formatConverterInputElement(converterOutput, { preserveCaret: false });
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
    if (!isAllowedEditableText(event.data || "")) {
      event.preventDefault();
      return;
    }
    const shouldAppend = state.answerVisible && settings.appendAfterAnswer;
    state.expression = shouldAppend ? toExpressionNumber(state.lastAnswer) : "0";
    state.answerVisible = false;
    state.errorMessage = "";
    if (!shouldAppend) resultEl.textContent = "";
    return;
  }

  if (event.inputType.startsWith("insert") && !isAllowedEditableText(event.data || "")) {
    event.preventDefault();
  }
});

resultEl.addEventListener("input", syncEditableDisplay);

resultEl.addEventListener("paste", (event) => {
  event.preventDefault();
  const text = event.clipboardData.getData("text/plain");
  if (!isAllowedEditableText(text)) return;
  if (state.answerVisible || state.errorMessage) {
    const shouldAppend = state.answerVisible && settings.appendAfterAnswer;
    state.expression = shouldAppend ? toExpressionNumber(state.lastAnswer) : "0";
    state.answerVisible = false;
    state.errorMessage = "";
    if (!shouldAppend) resultEl.textContent = "";
  }
  document.execCommand("insertText", false, displayExpression(sanitizeExpression(text)));
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
    "−": "-",
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

  if (lowerKey === "x") {
    event.preventDefault();
    insertToken("*");
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

  if (isDisplayField && key.length === 1) {
    event.preventDefault();
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
languageSelect.addEventListener("change", () => {
  settings.language = translations[languageSelect.value] ? languageSelect.value : "en";
  applyLanguage();
  renderHistory();
  render();
});

themeToggle.addEventListener("click", () => {
  currentMainTheme = currentMainTheme === "dark" ? "light" : "dark";
  editingMainTheme = currentMainTheme;
  applyThemeToDocument(currentTheme, currentMainTheme);
  syncThemeControls();
  saveAppState();
});

copyResult.addEventListener("click", async () => {
  const text = resultEl.textContent;
  try {
    await navigator.clipboard.writeText(text);
    copyResult.title = t("copied");
    setTimeout(() => {
      copyResult.title = t("copy");
    }, 1200);
  } catch {
    copyResult.title = t("copyFailed");
  }
});

converterType.addEventListener("change", loadUnits);
bindConverterInput(converterInput, "from");
bindConverterInput(converterOutput, "to");
fromUnit.addEventListener("change", () => handleConverterUnitChange("from"));
toUnit.addEventListener("change", () => handleConverterUnitChange("to"));
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
  controlHeightInput,
  keyHeightInput,
  displayHeightInput,
  displayPaddingInput,
  displayTextInput,
  keyTextInput,
  titleTextInput,
  bodyTextInput,
  historyAnswerTextInput,
  buttonGapInput,
  borderWidthInput,
  shadowSoftnessInput,
  controlShadowSoftnessInput,
  overlaySoftnessInput,
  settingsWidthInput,
  settingsPaddingInput,
  settingsSectionPaddingInput,
  cardPaddingInput,
  converterPaddingInput,
].forEach((input) => {
  if (input) input.addEventListener("input", applyRangeSettings);
});

resetUiSettings.addEventListener("click", resetUi);
resetAllSettings.addEventListener("click", resetAll);
mainThemeEditorSelect.addEventListener("change", () => setEditingMainTheme(mainThemeEditorSelect.value));
themeEditorSelect.addEventListener("change", () => setEditingTheme(themeEditorSelect.value));
mainThemeSelect.addEventListener("change", () => {
  currentMainTheme = normalizeMainThemeName(mainThemeSelect.value, currentMainTheme);
  applyThemeToDocument(currentTheme, currentMainTheme);
  saveAppState();
});
themeSelect.addEventListener("change", () => {
  currentTheme = normalizeThemeName(themeSelect.value, currentTheme);
  applyThemeToDocument(currentTheme, currentMainTheme);
  saveAppState();
});
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
  toggleWordFormCorner,
  togglePemdas,
  toggleAutoMemory,
  toggleAppendAfterAnswer,
  toggleTrimAnswerBackspace,
  toggleRepeatEquals,
  toggleAutoCloseParen,
  toggleNotes,
  toggleFactorialMode,
  toggleZerosBeforeDecimals,
  updateDecimalPrecision,
  updateSciThreshold,
  updateCalculationMax,
});

loadSavedState();
applyThemeToDocument(currentTheme, currentMainTheme);
mainThemeEditorSelect.value = editingMainTheme;
themeEditorSelect.value = editingTheme;
syncThemeControls();
applyLanguage();
loadUnits();
restoreConverterState();
renderHistory();
render();
isRestoring = false;
saveAppState();
