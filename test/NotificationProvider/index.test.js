import React, {useState} from 'react';
import nock from 'nock';
import {View} from 'react-native';
import testRenderer from 'react-test-renderer';
import {waitFor} from '@testing-library/react-native';
import RequestInstance from '../../lib/utils/request';
import NotificationProvider from '../../lib/NotificationProvider';
import * as tokenUtils from '../../lib/utils/token';
import * as SubscribeNotifications from '../../lib/utils/api/SubscribeNotifications';

const postSpy = jest.spyOn(RequestInstance, 'post');

const mockOnMessage = jest.fn();
const mockOnNotificationOpenedApp = jest.fn();
const mockGetInitialNotification = jest.fn();

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getMessaging: jest.fn(),
    getToken: jest.fn(),
    onMessage: mockOnMessage,
    setBackgroundMessageHandler: jest.fn(),
    getInitialNotification: mockGetInitialNotification,
    onNotificationOpenedApp: mockOnNotificationOpenedApp,
    hasPermission: jest.fn(),
  })),
}));

describe('NotificationWrapper', () => {
  const spyGetFCMToken = jest.spyOn(tokenUtils, 'getFCMToken');
  const spyGetStoredToken = jest.spyOn(tokenUtils, 'getStoredToken');
  const spySubscribeNotification = jest.spyOn(
    SubscribeNotifications,
    'default',
  );

  const initialState = {
    foregroundNotification: {},
    backgroundNotification: {},
    pushEvents: [],
    subscribeError: null,
  };
  const mockSetState = jest.fn();

  describe('returns null', () => {
    it('when not receive a valid children', () => {
      const Wrapper = testRenderer.create(<NotificationProvider />).toJSON();

      expect(Wrapper).toStrictEqual(null);
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
    nock.cleanAll();
  });

  describe('The provider is responsible for running an environment that handles notifications', () => {
    describe('when the provider was render...', () => {
      afterEach(() => {
        jest.clearAllMocks();
      });

      it('call subscription api', async () => {
        postSpy.mockResolvedValueOnce({result: {}});
        useState.mockReturnValueOnce([
          {
            ...initialState,
            pushEvents: ['picking', 'notifications', 'janis'],
          },
          mockSetState,
        ]);

        jest
          .spyOn(React, 'useEffect')
          .mockImplementationOnce((f) => f())
          .mockImplementationOnce((f) => f());

        testRenderer.create(
          <NotificationProvider
            appName="PickingApp"
            events={['picking', 'notifications', 'janis']}
            environment="beta"
            channelConfigs={[
              'channel',
              {
                name: 'common channel 2',
                id: 'channel_2',
                description: 'second channel',
              },
            ]}>
            <View />
          </NotificationProvider>,
        );

        await waitFor(() => {
          expect(spySubscribeNotification).toHaveBeenCalled();
        });
      });

      it('calls subscription api, but if an error occurs and the user provided a onSubscriptionError callback, the callback is called', async () => {
        const onSubscriptionError = jest.fn();
        useState.mockReturnValueOnce([
          {...initialState, pushEvents: ['picking', 'notifications', 'janis']},
          mockSetState,
        ]);
        spySubscribeNotification.mockRejectedValueOnce({message: 'error'});

        jest
          .spyOn(React, 'useEffect')
          .mockImplementationOnce((f) => f())
          .mockImplementationOnce((f) => f());

        spyGetFCMToken.mockReturnValueOnce('fcmToken');

        testRenderer.create(
          <NotificationProvider
            appName="PickingApp"
            events={['picking', 'notifications', 'janis']}
            environment="beta"
            channelConfigs={{}}
            backgroundNotificationSound="test"
            onSubscriptionError={onSubscriptionError}>
            <View />
          </NotificationProvider>,
        );

        await waitFor(() => {
          expect(onSubscriptionError).toHaveBeenCalled();
        });
      });

      it('call subscription api , but the fcmtoken could not be obtained, not call the subscribe api', async () => {
        useState.mockReturnValueOnce([
          {...initialState, pushEvents: ['picking', 'notifications', 'janis']},
          mockSetState,
        ]);

        jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

        spyGetFCMToken.mockReturnValueOnce('');

        testRenderer.create(
          <NotificationProvider
            appName="PickingApp"
            environment="local"
            events={['picking']}>
            <View />
          </NotificationProvider>,
        );

        await waitFor(() => {
          expect(spySubscribeNotification).not.toHaveBeenCalled();
        });
      });

      it('call subscription api, but not receive valid params as [appName, events, environment], not call subscribe api', async () => {
        useState.mockReturnValueOnce([
          {...initialState, pushEvents: ['picking', 'notifications', 'janis']},
          mockSetState,
        ]);

        jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

        spyGetFCMToken.mockReturnValueOnce('');

        testRenderer.create(
          <NotificationProvider>
            <View />
          </NotificationProvider>,
        );

        await waitFor(() => {
          expect(spySubscribeNotification).not.toHaveBeenCalled();
        });
      });

      it('call subscription api, but the fcmtoken is the same as the stored token, not make a request', async () => {
        useState.mockReturnValueOnce([
          {...initialState, pushEvents: ['picking', 'notifications', 'janis']},
          mockSetState,
        ]);

        spyGetFCMToken.mockResolvedValueOnce('fcmToken');
        spyGetStoredToken.mockResolvedValueOnce('fcmToken');

        jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

        testRenderer.create(
          <NotificationProvider
            appName="PickingApp"
            events={['picking']}
            environment="local">
            <View />
          </NotificationProvider>,
        );

        await waitFor(() => {
          expect(spySubscribeNotification).not.toHaveBeenCalled();
        });
      });
    });
  });
});
