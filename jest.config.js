const { createDefaultPreset } = require("ts-jest");
const { domainToASCII } = require("url");

const tsJestTransformCfg = createDefaultPreset().transform;

/** @type {import("jest").Config} **/
module.exports = {
  testEnvironment: "jsdom",
  transform: {
    ...tsJestTransformCfg,
  },
  setupFilesAfterEnv: ["@testing-library/jest-dom"],
};
