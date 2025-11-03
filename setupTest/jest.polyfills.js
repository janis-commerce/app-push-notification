// Polyfills for Node 18+ compatibility with React Native
// Fix the read-only performance property before React Native setup loads

// Make performance writable before React Native tries to override it
const originalPerformance = global.performance;

if (originalPerformance) {
  delete global.performance;
  Object.defineProperty(global, 'performance', {
    writable: true,
    configurable: true,
    enumerable: true,
    value: originalPerformance,
  });
}

// Load React Native setup
// Note: This will leave some async handles open (timers, etc.) which is expected
// behavior for React Native. Use --forceExit flag in package.json test scripts.
require('react-native/jest/setup');
