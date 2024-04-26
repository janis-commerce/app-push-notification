import React, {useState} from 'react';
import nock from 'nock';
import {View} from 'react-native';
import testRenderer from 'react-test-renderer';
import {waitFor} from '@testing-library/react-native';
import NotificationProvider from '../../lib/NotificationProvider';
import * as notificationUtils from '../../lib/utils';
import * as SubscribeNotifications from '../../lib/utils/api/SubscribeNotifications';

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
  const spyGetToken = jest.spyOn(notificationUtils, 'getFCMToken');
  const useRefSpy = jest.spyOn(React, 'useRef');
  const spySubscribeNotification = jest.spyOn(
    SubscribeNotifications,
    'default',
  );

  const initialState = {
    deviceToken: null,
    foregroundNotification: {},
    backgroundNotification: {},
    pushEvents: [],
    subscribeError: null,
  };
  const mockSetState = jest.fn();
  const server = `https://notifications.local.in/api`;

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
        nock(server).post('/subscribe/push').reply(200, {});
        useState.mockReturnValueOnce([
          {
            ...initialState,
            deviceToken: 'fcmToken',
            pushEvents: ['picking', 'notifications', 'janis'],
          },
          mockSetState,
        ]);
        useRefSpy.mockReturnValueOnce({current: false});
        spySubscribeNotification.mockResolvedValueOnce({result: {}});

        jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

        testRenderer.create(
          <NotificationProvider
            appName="PickingApp"
            events={['picking', 'notifications', 'janis']}
            environment="beta">
            <View />
          </NotificationProvider>,
        );

        await waitFor(() => {
          expect(spySubscribeNotification).toHaveBeenCalled();
        });
      });

      it('call subscription api, but if an error occurs set error in the state', async () => {
        nock(server).post('/subscribe/push').reply(400, {message: 'error'});
        useState.mockReturnValueOnce([
          {...initialState, pushEvents: ['picking', 'notifications', 'janis']},
          mockSetState,
        ]);
        useRefSpy.mockReturnValueOnce({current: false});
        spySubscribeNotification.mockRejectedValueOnce({message: 'error'});

        jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

        spyGetToken.mockReturnValueOnce('fcmToken');

        testRenderer.create(
          <NotificationProvider
            appName="PickingApp"
            events={['picking', 'notifications', 'janis']}
            environment="beta">
            <View />
          </NotificationProvider>,
        );

        await waitFor(() => {
          const updatedState = {
            ...initialState,
            pushEvents: [],
            subscribeError: {message: 'error'},
          };

          expect(mockSetState).toHaveBeenCalledWith(updatedState);
        });
      });

      it('... , but the fcmtoken could not be obtained, not call the subscribe api', async () => {
        useState.mockReturnValueOnce([
          {...initialState, pushEvents: ['picking', 'notifications', 'janis']},
          mockSetState,
        ]);
        useRefSpy.mockReturnValueOnce({current: false});

        jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

        spyGetToken.mockReturnValueOnce('');

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

      it('... , but not receive valid params as [appName, events, environment], not call subscribe api', async () => {
        useState.mockReturnValueOnce([
          {...initialState, pushEvents: ['picking', 'notifications', 'janis']},
          mockSetState,
        ]);
        useRefSpy.mockReturnValueOnce({current: false});

        jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

        spyGetToken.mockReturnValueOnce('');

        testRenderer.create(
          <NotificationProvider>
            <View />
          </NotificationProvider>,
        );

        await waitFor(() => {
          expect(spySubscribeNotification).not.toHaveBeenCalled();
        });
      });
    });
  });
  // describe('when the app is first open from notification', () => {
  //   const updatedInitialState = {
  //     foregroundNotification: {},
  //     backgroundNotification: {},
  //     subscribeError: null,
  //     deviceToken: 'fcmToken',
  //     pushEvents: ['picking', 'notifications', 'janis'],
  //   };
  //   it('handleAppOpeningByNotification should obtain this data and setted in backgroundNotification state', async () => {
  //     useState.mockReturnValueOnce([updatedInitialState, mockSetState]);
  //     useRefSpy.mockReturnValueOnce({current: false});
  //     mockGetInitialNotification.mockResolvedValueOnce({
  //       message: 'message test',
  //     });

  //     jest.spyOn(React, 'useEffect').mockImplementationOnce((f) => f());

  //     testRenderer.create(
  //       <NotificationProvider
  //         appName="PickingApp"
  //         environment="local"
  //         events={['picking']}>
  //         <View />
  //       </NotificationProvider>,
  //     );

  //     await waitFor(() => {
  //       expect(mockSetState).toHaveBeenCalledWith({
  //         ...updatedInitialState,
  //         backgroundNotification: {message: 'message test'},
  //       });
  //     });
  //   });
  // });
});
