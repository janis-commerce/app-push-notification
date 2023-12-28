// jest.setup.js

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');

jest.mock('react', () => {
  const react = jest.requireActual('react');

  return {
    ...react,
    useState: jest.fn(react.useState),
    useEffect: jest.fn(react.useEffect),
    useContext: jest.fn(react.useContext),
  };
});

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getToken: jest.fn(),
    onMessage: jest.fn(),
    onBackgroundMessage: jest.fn(),
    requestPermission: jest.fn(),
    hasPermission: jest.fn(),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
  })),
}));

jest.mock(
  '@react-native-async-storage/async-storage',
  () =>
    require('@react-native-async-storage/async-storage/jest/async-storage-mock'), // eslint-disable-line global-require
);

jest.mock('react-native-device-info', () => {
  const RNDeviceInfo = jest.requireActual(
    'react-native-device-info/jest/react-native-device-info-mock',
  );
  return {
    ...RNDeviceInfo,
  };
});
