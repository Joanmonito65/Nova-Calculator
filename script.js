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
