import * as deviceInfo from 'react-native-device-info';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Alert} from 'react-native';
import {
  DefaultAlert,
  getDeviceData,
  getFCMToken,
  getHeaders,
  isArray,
  isFunction,
  isObject,
  isString,
  setupBackgroundMessageHandler,
  setupForegroundMessageHandler,
  formatDeviceDataForUserAgent,
  validateOauthData,
} from '../../lib/utils';

const mockGetToken = jest.fn();
const mockOnMessage = jest.fn();
const mockBackgroundMessageHandler = jest.fn();
const mockHasPermission = jest.fn();

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getMessaging: jest.fn(),
    getToken: mockGetToken,
    onMessage: mockOnMessage,
    setBackgroundMessageHandler: mockBackgroundMessageHandler,
    hasPermission: mockHasPermission,
  })),
}));

const alertSpy = jest.spyOn(Alert, 'alert');
const baseHeaders = {
  'content-Type': 'application/json',
  'janis-api-key': 'Bearer',
};

const buildNumberSpy = jest.spyOn(deviceInfo, 'getBuildNumber');
const applicationNameSpy = jest.spyOn(deviceInfo, 'getApplicationName');
const versionSpy = jest.spyOn(deviceInfo, 'getVersion');
const bundleIdSpy = jest.spyOn(deviceInfo, 'getBundleId');
const systemNameSpy = jest.spyOn(deviceInfo, 'getSystemName');
const systemVersionSpy = jest.spyOn(deviceInfo, 'getSystemVersion');
const uniqueIdSpy = jest.spyOn(deviceInfo, 'getUniqueId');
const modelSpy = jest.spyOn(deviceInfo, 'getModel');

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
    });
  });
  describe('DefaultAlert component', () => {
    it('returns null when not receive a valid object', () => {
      const AlertComponent = DefaultAlert();

      expect(AlertComponent).toBe(null);
    });

    it('returns an alert method call with the default receivedMessage when notification object isnt received', () => {
      DefaultAlert({data: {message: 'default message'}});

      expect(alertSpy).toHaveBeenCalledWith(
        'A new FCM message arrived!',
        undefined,
      );
    });

    it('returns an alert method call with the notification title and body when this is received', () => {
      DefaultAlert({
        notification: {title: 'received message', body: 'received body'},
      });

      expect(alertSpy).toHaveBeenCalledWith(
        'received message',
        'received body',
      );
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

    describe('getHeaders helper', () => {
      describe('Params', () => {
        it('should return only baseHeaders if no params are passed', () => {
          buildNumberSpy.mockReturnValueOnce(undefined);
          applicationNameSpy.mockReturnValueOnce(undefined);
          versionSpy.mockReturnValueOnce(undefined);
          bundleIdSpy.mockReturnValueOnce(undefined);
          systemNameSpy.mockReturnValueOnce(undefined);
          systemVersionSpy.mockReturnValueOnce(undefined);
          uniqueIdSpy.mockReturnValueOnce(undefined);
          modelSpy.mockReturnValueOnce(undefined);

          expect(getHeaders()).toStrictEqual(baseHeaders);
        });

        it('should return only baseHeaders if params arent valid object', () => {
          buildNumberSpy.mockReturnValueOnce(undefined);
          applicationNameSpy.mockReturnValueOnce(undefined);
          versionSpy.mockReturnValueOnce(undefined);
          bundleIdSpy.mockReturnValueOnce(undefined);
          systemNameSpy.mockReturnValueOnce(undefined);
          systemVersionSpy.mockReturnValueOnce(undefined);
          uniqueIdSpy.mockReturnValueOnce(undefined);
          modelSpy.mockReturnValueOnce(undefined);

          expect(getHeaders(1)).toStrictEqual(baseHeaders);
        });

        it('should include custom client header', () => {
          buildNumberSpy.mockReturnValueOnce(undefined);
          applicationNameSpy.mockReturnValueOnce(undefined);
          versionSpy.mockReturnValueOnce(undefined);
          bundleIdSpy.mockReturnValueOnce(undefined);
          systemNameSpy.mockReturnValueOnce(undefined);
          systemVersionSpy.mockReturnValueOnce(undefined);
          uniqueIdSpy.mockReturnValueOnce(undefined);
          modelSpy.mockReturnValueOnce(undefined);

          const params = {
            client: 'my-client',
          };
          const expectedHeaders = {
            ...baseHeaders,
            'janis-client': 'my-client',
          };

          expect(getHeaders(params)).toStrictEqual(expectedHeaders);
        });

        it('should include custom access token header', () => {
          buildNumberSpy.mockReturnValueOnce(undefined);
          applicationNameSpy.mockReturnValueOnce(undefined);
          versionSpy.mockReturnValueOnce(undefined);
          bundleIdSpy.mockReturnValueOnce(undefined);
          systemNameSpy.mockReturnValueOnce(undefined);
          systemVersionSpy.mockReturnValueOnce(undefined);
          uniqueIdSpy.mockReturnValueOnce(undefined);
          modelSpy.mockReturnValueOnce(undefined);

          const params = {
            accessToken: 'my-access-token',
          };
          const expectedHeaders = {
            ...baseHeaders,
            'janis-api-secret': 'my-access-token',
          };

          expect(getHeaders(params)).toStrictEqual(expectedHeaders);
        });

        it('should include page and page size headers', () => {
          buildNumberSpy.mockReturnValueOnce(undefined);
          applicationNameSpy.mockReturnValueOnce(undefined);
          versionSpy.mockReturnValueOnce(undefined);
          bundleIdSpy.mockReturnValueOnce(undefined);
          systemNameSpy.mockReturnValueOnce(undefined);
          systemVersionSpy.mockReturnValueOnce(undefined);
          uniqueIdSpy.mockReturnValueOnce(undefined);
          modelSpy.mockReturnValueOnce(undefined);

          const params = {
            page: 1,
            pageSize: 10,
          };
          const expectedHeaders = {
            ...baseHeaders,
            'x-janis-page': 1,
            'x-janis-page-size': 10,
          };

          expect(getHeaders(params)).toStrictEqual(expectedHeaders);
        });

        it('should include getTotals header', () => {
          buildNumberSpy.mockReturnValueOnce(undefined);
          applicationNameSpy.mockReturnValueOnce(undefined);
          versionSpy.mockReturnValueOnce(undefined);
          bundleIdSpy.mockReturnValueOnce(undefined);
          systemNameSpy.mockReturnValueOnce(undefined);
          systemVersionSpy.mockReturnValueOnce(undefined);
          uniqueIdSpy.mockReturnValueOnce(undefined);
          modelSpy.mockReturnValueOnce(undefined);

          const params = {
            getTotals: true,
          };
          const expectedHeaders = {
            ...baseHeaders,
            'x-janis-totals': true,
          };

          expect(getHeaders(params)).toStrictEqual(expectedHeaders);
        });

        it('should include getOnlyTotals header', () => {
          buildNumberSpy.mockReturnValueOnce(undefined);
          applicationNameSpy.mockReturnValueOnce(undefined);
          versionSpy.mockReturnValueOnce(undefined);
          bundleIdSpy.mockReturnValueOnce(undefined);
          systemNameSpy.mockReturnValueOnce(undefined);
          systemVersionSpy.mockReturnValueOnce(undefined);
          uniqueIdSpy.mockReturnValueOnce(undefined);
          modelSpy.mockReturnValueOnce(undefined);

          const params = {
            getOnlyTotals: true,
          };
          const expectedHeaders = {
            ...baseHeaders,
            'x-janis-only-totals': true,
          };

          expect(getHeaders(params)).toStrictEqual(expectedHeaders);
        });
      });

      describe('CustomHeaders', () => {
        it('should include all custom headers', () => {
          buildNumberSpy.mockReturnValueOnce(undefined);
          applicationNameSpy.mockReturnValueOnce(undefined);
          versionSpy.mockReturnValueOnce(undefined);
          bundleIdSpy.mockReturnValueOnce(undefined);
          systemNameSpy.mockReturnValueOnce(undefined);
          systemVersionSpy.mockReturnValueOnce(undefined);
          uniqueIdSpy.mockReturnValueOnce(undefined);
          modelSpy.mockReturnValueOnce(undefined);

          const params = {
            client: 'my-client',
            accessToken: 'my-access-token',
            page: 1,
            pageSize: 10,
            getTotals: true,
            getOnlyTotals: true,
          };
          const customHeaders = {
            'custom-header-1': 'value-1',
            'custom-header-2': 'value-2',
            'invalid-header': '',
          };
          const expectedHeaders = {
            ...baseHeaders,
            'janis-client': 'my-client',
            'janis-api-secret': 'my-access-token',
            'x-janis-page': 1,
            'x-janis-page-size': 10,
            'x-janis-totals': true,
            'x-janis-only-totals': true,
            'custom-header-1': 'value-1',
            'custom-header-2': 'value-2',
          };

          expect(getHeaders(params, customHeaders)).toStrictEqual(
            expectedHeaders,
          );
        });
      });

      describe('DeviceHeaders', () => {
        it('should handle empty device data headers and custom headers', () => {
          buildNumberSpy.mockReturnValueOnce(undefined);
          applicationNameSpy.mockReturnValueOnce(undefined);
          versionSpy.mockReturnValueOnce(undefined);
          bundleIdSpy.mockReturnValueOnce(undefined);
          systemNameSpy.mockReturnValueOnce(undefined);
          systemVersionSpy.mockReturnValueOnce(undefined);
          uniqueIdSpy.mockReturnValueOnce(undefined);
          modelSpy.mockReturnValueOnce(undefined);

          const params = {
            client: 'my-client',
          };
          const expectedHeaders = {
            ...baseHeaders,
            'janis-client': 'my-client',
          };
          expect(getHeaders(params, {})).toStrictEqual(expectedHeaders);
        });

        it('should not send user-agent when all headers are empty', () => {
          buildNumberSpy.mockReturnValueOnce('');
          applicationNameSpy.mockReturnValueOnce('');
          versionSpy.mockReturnValueOnce('');
          bundleIdSpy.mockReturnValueOnce('');
          systemNameSpy.mockReturnValueOnce('');
          systemVersionSpy.mockReturnValueOnce('');
          uniqueIdSpy.mockReturnValueOnce('');
          modelSpy.mockReturnValueOnce('');

          const headers = getHeaders({});
          expect(headers['user-agent']).toBe(undefined);
        });

        it('should include user-agent header with valid deviceDataHeaders', () => {
          buildNumberSpy.mockReturnValueOnce('1');
          applicationNameSpy.mockReturnValueOnce('MyApp');
          versionSpy.mockReturnValueOnce('1.0.0');
          bundleIdSpy.mockReturnValueOnce('janis.beta.app');
          systemNameSpy.mockReturnValueOnce('iOS');
          systemVersionSpy.mockReturnValueOnce('14.5');
          uniqueIdSpy.mockReturnValueOnce('123456789');
          modelSpy.mockReturnValueOnce('iPhone 12');

          const expectedUserAgent =
            'janis.beta.app/1.0.0 (MyApp; 1) iOS/14.5 (123456789; iPhone 12)';

          const headers = getHeaders({});
          expect(headers['user-agent']).toStrictEqual(expectedUserAgent);
        });

        it('should set user-agent unkown key when some key its not valid or missing', () => {
          buildNumberSpy.mockReturnValueOnce('1');
          applicationNameSpy.mockReturnValueOnce('MyApp');
          versionSpy.mockReturnValueOnce('1.0.0');
          bundleIdSpy.mockReturnValueOnce('janis.beta.app');
          systemNameSpy.mockReturnValueOnce('iOS');
          systemVersionSpy.mockReturnValueOnce('14.5');
          uniqueIdSpy.mockReturnValueOnce('');
          modelSpy.mockReturnValueOnce('');

          const expectedHeaders = {
            ...baseHeaders,
            'user-agent':
              'janis.beta.app/1.0.0 (MyApp; 1) iOS/14.5 (unknown janis-app-device-id; unknown janis-app-device-name)',
            'janis-app-name': 'MyApp',
            'janis-app-version': '1.0.0',
            'janis-app-package-name': 'janis.beta.app',
            'janis-app-build': '1',
            'janis-app-device-os-name': 'iOS',
            'janis-app-device-os-version': '14.5',
          };

          const headers = getHeaders({});
          expect(headers).toStrictEqual(expectedHeaders);
        });

        it('should not include user-agent header when all keys are missing or are invlid', () => {
          buildNumberSpy.mockReturnValueOnce('');
          applicationNameSpy.mockReturnValueOnce('');
          versionSpy.mockReturnValueOnce('');
          bundleIdSpy.mockReturnValueOnce('');
          systemNameSpy.mockReturnValueOnce('');
          systemVersionSpy.mockReturnValueOnce('');
          uniqueIdSpy.mockReturnValueOnce('');
          modelSpy.mockReturnValueOnce('');

          const headers = getHeaders({});

          expect(headers['user-agent']).toBe(undefined);
        });

        it('should not include user-agent header with empty deviceDataHeaders', () => {
          buildNumberSpy.mockReturnValueOnce('');
          applicationNameSpy.mockReturnValueOnce('');
          versionSpy.mockReturnValueOnce('');
          bundleIdSpy.mockReturnValueOnce('');
          systemNameSpy.mockReturnValueOnce('');
          systemVersionSpy.mockReturnValueOnce('');
          uniqueIdSpy.mockReturnValueOnce('');
          modelSpy.mockReturnValueOnce('');

          const headers = getHeaders({});

          expect(headers['user-agent']).toBe(undefined);
        });
      });
    });

    describe('getDeviceData returns an object', () => {
      it('with default device data', () => {
        buildNumberSpy.mockReturnValueOnce(undefined);
        applicationNameSpy.mockReturnValueOnce(undefined);
        versionSpy.mockReturnValueOnce(undefined);
        bundleIdSpy.mockReturnValueOnce(undefined);
        systemNameSpy.mockReturnValueOnce(undefined);
        systemVersionSpy.mockReturnValueOnce(undefined);
        uniqueIdSpy.mockReturnValueOnce(undefined);
        modelSpy.mockReturnValueOnce(undefined);

        const response = getDeviceData();
        expect(response).toStrictEqual({
          'janis-app-name': '',
          'janis-app-build': '',
          'janis-app-version': '',
          'janis-app-package-name': '',
          'janis-app-device-os-name': '',
          'janis-app-device-os-version': '',
          'janis-app-device-id': '',
          'janis-app-device-name': '',
        });
      });

      it('with formatted device data', () => {
        buildNumberSpy.mockReturnValueOnce('1');
        applicationNameSpy.mockReturnValueOnce('MyApp');
        versionSpy.mockReturnValueOnce('1.0.0');
        bundleIdSpy.mockReturnValueOnce('janis.beta.app');
        systemNameSpy.mockReturnValueOnce('iOS');
        systemVersionSpy.mockReturnValueOnce('14.5');
        uniqueIdSpy.mockReturnValueOnce('123456789');
        modelSpy.mockReturnValueOnce('iPhone 12');

        const response = getDeviceData();
        expect(response).toStrictEqual({
          'janis-app-name': 'MyApp',
          'janis-app-build': '1',
          'janis-app-version': '1.0.0',
          'janis-app-package-name': 'janis.beta.app',
          'janis-app-device-os-name': 'iOS',
          'janis-app-device-os-version': '14.5',
          'janis-app-device-id': '123456789',
          'janis-app-device-name': 'iPhone 12',
        });
      });
    });
    describe('formatDeviceDataForUserAgent', () => {
      it('returns an empty object when any key is valid', () => {
        const headers = {
          'janis-app-package-name': '',
          'janis-app-version': '',
          'janis-app-name': '',
          'janis-app-build': '',
          'janis-app-device-os-name': '',
          'janis-app-device-os-version': '',
          'janis-app-device-id': '',
          'janis-app-device-name': '',
        };

        expect(formatDeviceDataForUserAgent(headers)).toStrictEqual({});
      });
    });
    describe('validateOauthData', () => {
      describe('return false', () => {
        it('when accessToken is null ', () => {
          expect(validateOauthData(null, 'adf')).toBe(false);
        });

        it('when accessToken is invalid ', () => {
          expect(validateOauthData([], 'adf')).toBe(false);
        });

        it('when client is null ', () => {
          expect(validateOauthData('adsf', null)).toBe(false);
        });

        it('when client is invalid ', () => {
          expect(validateOauthData('adsf', [])).toBe(false);
        });
      });

      describe('return true', () => {
        it('when arguments are valid ', () => {
          expect(validateOauthData('adsf', 'fizzmod')).toBe(true);
        });
      });
    });
  });
});
