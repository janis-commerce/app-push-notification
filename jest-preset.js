// Custom Jest preset that extends react-native but fixes Node 18+ compatibility

const reactNativePreset = require('react-native/jest-preset');

module.exports = {
  ...reactNativePreset,
  // Remove React Native's setup - we load it with our polyfill
  setupFiles: [],
};
