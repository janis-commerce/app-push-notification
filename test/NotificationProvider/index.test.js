import React, {useState} from 'react';
import {View, Text} from 'react-native';
import {create} from 'react-test-renderer';
import {waitFor} from '@testing-library/react-native';
import NotificationProvider from '../../lib/NotificationProvider';
import * as notificationUtils from '../../lib/utils';

const mockOnMessage = jest.fn();

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getMessaging: jest.fn(),
    getToken: jest.fn(),
    onMessage: mockOnMessage,
    setBackgroundMessageHandler: jest.fn(),
    hasPermission: jest.fn(),
  })),
}));

describe('NotificationWrapper', () => {
  const validCallback = (arg) => console.log(arg);
  const spyGetToken = jest.spyOn(notificationUtils, 'getFCMToken');
  const spyForegroundHandler = jest.spyOn(
    notificationUtils,
    'setupForegroundMessageHandler',
  );
  const spyBackgroundHandler = jest.spyOn(
    notificationUtils,
    'setupBackgroundMessageHandler',
  );
  const spyTopicsSubscription = jest.spyOn(
    notificationUtils,
    'topicsSubscription',
  );

  describe('returns null', () => {
    it('when not receive a valid children', () => {
      const Wrapper = create(<NotificationProvider />).toJSON();

      expect(Wrapper).toStrictEqual(null);
    });
  });

  describe('The provider is responsible for running an environment that handles notifications', () => {
    const mockSetToken = jest.fn();

    afterEach(() => {
      jest.clearAllMocks();
    });
    it('when the component was render get the fcmToken and set this', async () => {
      useState.mockReturnValueOnce([null, mockSetToken]);

      jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f()());
      spyGetToken.mockReturnValueOnce('fcmToken');
      spyForegroundHandler.mockReturnValueOnce(validCallback);

      create(
        <NotificationProvider
          config={{app: 'picking', user: 'janis', version: '1.38.0'}}
          events={['picking', 'notifications', 'janis']}
          environment="beta"
          foregroundCallback={validCallback}
          backgroundCallback={validCallback}>
          <View>
            <Text>Children</Text>
          </View>
        </NotificationProvider>,
      );

      await waitFor(() => {
        expect(mockSetToken).toHaveBeenCalled();
      });
    });

    it('if the token was obtained register the subscripted topics', async () => {
      useState.mockReturnValueOnce(['fcmToken', mockSetToken]);

      jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f()());
      spyGetToken.mockReturnValueOnce('fcmToken');
      spyForegroundHandler.mockReturnValueOnce(validCallback);

      create(
        <NotificationProvider
          config={{app: 'picking', user: 'janis', version: '1.38.0'}}
          events={['picking', 'notifications', 'janis', 3]}
          environment="beta">
          <View>
            <Text>Children</Text>
          </View>
        </NotificationProvider>,
      );

      await waitFor(() => {
        expect(mockSetToken).toHaveBeenCalled();
        expect(spyTopicsSubscription).toHaveBeenCalled();
      });
    });

    it('if the token wasnt obtained, the value will not be set', () => {
      spyGetToken.mockReturnValueOnce('');
      spyForegroundHandler.mockReturnValueOnce(jest.fn());

      useState.mockReturnValueOnce([null, mockSetToken]);

      jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f()());

      create(
        <NotificationProvider
          foregroundCallback={validCallback}
          backgroundCallback="invalid function">
          <View>
            <Text>Children</Text>
          </View>
        </NotificationProvider>,
      );

      expect(mockSetToken).not.toHaveBeenCalled();
    });

    it('if the backgroundCallback function is not pass, execute the default function in setupBackgroundMessageHandler', async () => {
      useState.mockReturnValueOnce(['fcmToken', mockSetToken]);

      jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f()());
      spyGetToken.mockReturnValueOnce('fcmToken');
      spyForegroundHandler.mockReturnValueOnce(validCallback);
      spyBackgroundHandler.mockReturnValueOnce();

      create(
        <NotificationProvider
          config={{app: 'picking', user: 'janis', version: '1.38.0'}}
          events={['picking', 'notifications', 'janis']}
          environment="beta"
          foregroundCallback={validCallback}
          backgroundCallback={null}>
          <View>
            <Text>Children</Text>
          </View>
        </NotificationProvider>,
      );

      await waitFor(() => {
        expect(mockSetToken).toHaveBeenCalled();
      });
    });
  });
});
