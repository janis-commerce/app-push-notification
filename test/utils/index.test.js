import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFCMToken,
  isArray,
  isFunction,
  isObject,
  isString,
  setupBackgroundMessageHandler,
  setupForegroundMessageHandler,
  setupNotificationOpenedHandler,
  isBoolean,
  isNumber,
  promiseWrapper,
} from '../../lib/utils';

const mockGetToken = jest.fn();
const mockOnMessage = jest.fn();
const mockBackgroundMessageHandler = jest.fn();
const mockOnNotificationOpenedApp = jest.fn();
const mockHasPermission = jest.fn();

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getMessaging: jest.fn(),
    getToken: mockGetToken,
    onMessage: mockOnMessage,
    setBackgroundMessageHandler: mockBackgroundMessageHandler,
    onNotificationOpenedApp: mockOnNotificationOpenedApp,
    hasPermission: mockHasPermission,
  })),
}));

describe('utils', () => {
  describe('messaging utils', () => {
    const fakeRemoteMessage = {data: {key: 'value'}};
    const getItemSpy = jest.spyOn(AsyncStorage, 'getItem');

    describe('getFCMToken function is responsible for obtaining the Firebase cloud messaging token from the device:', () => {
      describe('return an empty string when:', () => {
        it('async storage throws an error', async () => {
          getItemSpy.mockRejectedValueOnce(new Error('error'));

          expect(await getFCMToken()).toStrictEqual('');
        });

        it('async storage returns empty or null fcmToken and messaging throws an error', async () => {
          getItemSpy.mockResolvedValueOnce('');
          mockGetToken.mockRejectedValueOnce(new Error('error'));

          expect(await getFCMToken()).toStrictEqual('');
        });

        it('async storage and getToken method from messaging returns empty or null fcmToken', async () => {
          getItemSpy.mockResolvedValueOnce(null);
          mockGetToken.mockResolvedValueOnce(null);

          expect(await getFCMToken()).toStrictEqual('');
        });
      });

      describe('return FCM TOKEN when:', () => {
        it('async storage return the fcm token from storage', async () => {
          getItemSpy.mockResolvedValueOnce('storageFCMToken');

          expect(await getFCMToken()).toStrictEqual('storageFCMToken');
        });

        it('async storage hasnt token stored but this is obtain from getToken method', async () => {
          getItemSpy.mockResolvedValueOnce('');
          mockGetToken.mockResolvedValueOnce('newFCMToken');

          expect(await getFCMToken()).toStrictEqual('newFCMToken');
        });
      });
    });

    describe('setupForegroundMessageHandler provides the listener with foreground notifications', () => {
      it('returns the listener and call the function when this is listened', () => {
        const mockCallback = jest.fn();
        setupForegroundMessageHandler(mockCallback);

        mockOnMessage.mock.calls[0][0](fakeRemoteMessage);

        expect(mockOnMessage).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(fakeRemoteMessage);
      });
    });

    describe('setupBackgroundMessageHandler provides the listener with background notifications', () => {
      it('calls setBackgroundMessageHandler with remoteMessage', () => {
        const mockCallback = jest.fn();
        setupBackgroundMessageHandler(mockCallback);

        mockBackgroundMessageHandler.mock.calls[0][0](fakeRemoteMessage);

        expect(mockBackgroundMessageHandler).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(fakeRemoteMessage);
      });
      it('calls setBackgroundMessageHandler with remoteMessage', () => {
        setupBackgroundMessageHandler();

        mockBackgroundMessageHandler.mock.calls[0][0](fakeRemoteMessage);

        expect(mockBackgroundMessageHandler).toHaveBeenCalledTimes(1);
      });
    });

    describe('setupNotificationOpenedHandler provides the listener that listens for the opening of the app from the background through a notification', () => {
      it('calls setBackgroundMessageHandler with remoteMessage', () => {
        const mockCallback = jest.fn();
        setupNotificationOpenedHandler(mockCallback);

        mockOnNotificationOpenedApp.mock.calls[0][0](fakeRemoteMessage);

        expect(mockOnNotificationOpenedApp).toHaveBeenCalledTimes(1);
        expect(mockCallback).toHaveBeenCalledWith(fakeRemoteMessage);
      });
    });
  });
  describe('utils from apps helpers', () => {
    describe('isArray returns a boolean', () => {
      it('returns true if receive a valid array', () => {
        expect(isArray(['array', 1])).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isArray('array')).toBe(false);
      });
    });

    describe('isFunction returns a boolean', () => {
      it('returns true if receive a valid function', () => {
        const mockedFunction = jest.fn();

        expect(isFunction(mockedFunction)).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isFunction('function')).toBe(false);
      });
    });

    describe('isObject returns a boolean', () => {
      it('returns true if receive a valid object', () => {
        const mockedObject = {name: 'push-notification', version: '1.0.0'};

        expect(isObject(mockedObject)).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isObject('object')).toBe(false);
      });
    });

    describe('isString returns a boolean', () => {
      it('returns true if receive a valid object', () => {
        expect(isString('string')).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isString(null)).toBe(false);
      });
    });

    describe('isNumber returns a boolean', () => {
      it('returns true if receive a valid number', () => {
        expect(isNumber(10)).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isNumber(null)).toBe(false);
      });
    });

    describe('isBoolean returns a boolean', () => {
      it('returns true if receive a valid number', () => {
        expect(isBoolean(true)).toBe(true);
      });

      it('otherwise returns false', () => {
        expect(isBoolean(null)).toBe(false);
      });
    });

    describe('promiseWrapper', () => {
      describe('return error', () => {
        it('with promise called catch', async () => {
          const promise = await promiseWrapper(
            Promise.reject(new Error('called catch')),
          );
          expect(promise).toEqual(expect.any(Array));
          const [data, error] = promise;
          expect(data).toBe(null);
          expect(error).toEqual(expect.any(Object));
        });
      });

      describe('return data', () => {
        it('with promise correct', async () => {
          const prom = () =>
            new Promise((resolve) => resolve({name: 'Janis Picking'}));
          const promise = await promiseWrapper(prom());
          const [data, error] = promise;
          expect(promise).toEqual(expect.any(Array));
          expect(data).toEqual(expect.any(Object));
          expect(error).toBe(null);
        });
      });
    });
  });
});
