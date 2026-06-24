import { pathsToModuleNameMapper } from "ts-jest";
// Load tsconfig to access compilerOptions.paths
import tsconfig from "./tsconfig.json";

/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */

import type { Config } from "jest";

// 👇 GARANTE QUE PATHS SEMPRE EXISTE
const paths = tsconfig.compilerOptions?.paths ?? {};

// 👇 GARANTE QUE NUNCA VAI SER UNDEFINED
const moduleNameMapper = pathsToModuleNameMapper(paths, {
  prefix: "<rootDir>/",
}) as Record<string, string | string[]>;

const config: Config = {
  // All imported modules in your tests should be mocked automatically
  // automock: false,

  // Stop running tests after `n` failures
  // bail: 0,

  // The directory where Jest should store its cached dependency information
  // cacheDirectory: "C:\\Users\\Andre\\AppData\\Local\\Temp\\jest",

  // Automatically clear mock calls, instances, contexts and results before every test
  clearMocks: true,

  // Indicates whether the coverage information should be collected while executing the test
  collectCoverage: true,

  // An array of glob patterns indicating a set of files for which coverage information should be collected
  // collectCoverageFrom: undefined,

  // The directory where Jest should output its coverage files
  coverageDirectory: "coverage",

  // An array of regexp pattern strings used to skip coverage collection
  // coveragePathIgnorePatterns: [
  //   "\\node_modules\\"
  // ],

  // Indicates which provider should be used to instrument code for coverage
  coverageProvider: "v8",

  // A list of reporter names that Jest uses when writing coverage reports
  // coverageReporters: [
  //   "json",
  //   "text",
  //   "lcov",
  //   "clover"
  // ],

  // An object that configures minimum threshold enforcement for coverage results
  // coverageThreshold: undefined,

  // A path to a custom dependency extractor
  // dependencyExtractor: undefined,

  // Make calling deprecated APIs throw helpful error messages
  // errorOnDeprecated: false,

  // The default configuration for fake timers
  // fakeTimers: {
  //   enableGlobally: false
  // },

  // Force coverage collection from ignored files using an array of glob patterns
  // forceCoverageMatch: [],

  // globalSetup: undefined,
  // globalTeardown: undefined,
  // globals: {},

  // maxWorkers: "50%",

  // moduleDirectories: [
  //   "node_modules"
  // ],

  // An array of file extensions your modules use
  // moduleFileExtensions: [
  //   "js",
  //   "ts",
  //   "json"
  // ],

  // ✅ FIX PRINCIPAL AQUI
  moduleNameMapper,

  // modulePathIgnorePatterns: [],

  // A preset that is used as a base for Jest's configuration
  preset: "ts-jest",

  // projects: undefined,
  // reporters: undefined,
  // resetMocks: false,
  // resetModules: false,
  // resolver: undefined,

  // rootDir: undefined,

  // roots: [
  //   ""
  // ],

  // runner: "jest-runner",

  // setupFiles: [],
  // setupFilesAfterEnv: [],

  // slowTestThreshold: 5,

  // snapshotSerializers: [],

  // testEnvironment: "node",

  // testEnvironmentOptions: {},

  // testLocationInResults: false,

  // Glob de testes
  testMatch: ["**/*.spec.ts"],

  // testPathIgnorePatterns: [
  //   "\\node_modules\\"
  // ],

  // testRegex: [],
  // testResultsProcessor: undefined,
  // testRunner: "jest-circus/runner",

  // transform: undefined,

  // transformIgnorePatterns: [
  //   "\\node_modules\\",
  //   "\\.pnp\\.[^\\]+$"
  // ],

  // unmockedModulePathPatterns: undefined,

  // verbose: undefined,

  // watchPathIgnorePatterns: [],

  // watchman: true,
};

export default config;
