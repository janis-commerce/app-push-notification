import {useState} from 'react';
import {renderHook, waitFor} from '@testing-library/react-native';
import usePushNotification from '../lib/usePushNotification';
import * as cancelNotificationsSubscription from '../lib/utils/api/cancelNotificationsSubscription';
import * as SubscribeNotifications from '../lib/utils/api/SubscribeNotifications';
import * as tokenUtils from '../lib/utils/token';
import {promiseWrapper} from '../lib/utils';

describe('usePushNotification hook', () => {
  const spyCancelNotificationsSubscription = jest.spyOn(
    cancelNotificationsSubscription,
    'default',
  );

  const spySubscribeNotifications = jest.spyOn(
    SubscribeNotifications,
    'default',
  );

  const spyGetStoredToken = jest.spyOn(tokenUtils, 'getStoredToken');
  const spyGetFCMToken = jest.spyOn(tokenUtils, 'getFCMToken');

  const initialState = {
    deviceToken: null,
    foregroundNotification: {},
    backgroundNotification: {},
    pushEvents: [],
    subscribeError: {},
  };

  const mockSetState = jest.fn();

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('returns an object', async () => {
    const {result} = renderHook(() =>
      usePushNotification('local', ['picking:session:created'], 'PickingApp', {
        current: false,
      }),
    );

    const context = typeof result.current === 'object';

    expect(context).toBeTruthy();
  });

  describe('the object contains:', () => {
    describe('updateSuscription util', () => {
      it('should return null when additionalInfo is not valid', async () => {
        useState.mockReturnValueOnce([
          {
            ...initialState,
            pushEvents: ['picking:session:created'],
          },
          mockSetState,
        ]);

        const {result} = renderHook(() =>
          usePushNotification(
            'local',
            ['picking:session:created'],
            'PickingApp',
          ),
        );
        const {updateSuscription} = result.current;

        const response = await updateSuscription('invalid');

        expect(response).toBeNull();
        expect(spySubscribeNotifications).not.toHaveBeenCalled();
      });

      it('should use FCM token when stored token does not exist', async () => {
        spyGetStoredToken.mockResolvedValueOnce(null);
        spyGetFCMToken.mockResolvedValueOnce('fcmToken');
        spySubscribeNotifications.mockResolvedValueOnce({result: {}});

        useState.mockReturnValueOnce([
          {
            ...initialState,
            pushEvents: ['picking:session:created'],
          },
          mockSetState,
        ]);

        const {result} = renderHook(() =>
          usePushNotification(
            'local',
            ['picking:session:created'],
            'PickingApp',
          ),
        );
        const {updateSuscription} = result.current;

        await updateSuscription({language: 'en-US'});

        await waitFor(() => {
          expect(spyGetStoredToken).toHaveBeenCalled();
          expect(spyGetFCMToken).toHaveBeenCalled();
          expect(spySubscribeNotifications).toHaveBeenCalledWith(
            expect.objectContaining({
              token: 'fcmToken',
              additionalInfo: {language: 'en-US'},
            }),
            expect.anything(),
          );
        });
      });

      it('should call the api to subscribe to notifications service', async () => {
        spyGetStoredToken.mockResolvedValueOnce('storedToken');
        spySubscribeNotifications.mockResolvedValueOnce({result: {}});

        useState.mockReturnValueOnce([
          {
            ...initialState,
            pushEvents: ['picking:session:created'],
          },
          mockSetState,
        ]);

        const {result} = renderHook(() =>
          usePushNotification(
            'local',
            ['picking:session:created'],
            'PickingApp',
          ),
        );
        const {updateSuscription} = result.current;

        await updateSuscription({language: 'en-US'});

        await waitFor(() => {
          expect(spySubscribeNotifications).toHaveBeenCalledWith(
            expect.objectContaining({
              token: 'storedToken',
              additionalInfo: {language: 'en-US'},
            }),
            expect.anything(),
          );
        });
      });

      it('should return an error when the subscription fails', async () => {
        spyGetStoredToken.mockResolvedValueOnce('storedToken');
        spySubscribeNotifications.mockRejectedValueOnce({message: 'error'});

        useState.mockReturnValueOnce([
          {
            ...initialState,
            pushEvents: ['picking:session:created'],
          },
          mockSetState,
        ]);

        const {result} = renderHook(() =>
          usePushNotification(
            'local',
            ['picking:session:created'],
            'PickingApp',
          ),
        );
        const {updateSuscription} = result.current;

        const [, response] = await promiseWrapper(
          updateSuscription({language: 'en-US'}),
        );

        await expect(response).toStrictEqual({message: 'error'});
      });
    });
    describe('cancelNotifications util', () => {
      it('this utils call the api and cancel the subscription to event passed an arguments or all events', async () => {
        spyCancelNotificationsSubscription.mockResolvedValueOnce({result: {}});
        useState.mockReturnValueOnce([
          {
            ...initialState,
            deviceToken: 'fcmToken',
            pushEvents: ['picking:session:created'],
          },
          mockSetState,
        ]);

        const {result} = renderHook(() =>
          usePushNotification(
            'local',
            ['picking:session:created'],
            'PickingApp',
            {current: false},
          ),
        );
        const {cancelNotifications} = result.current;
        const [response] = await promiseWrapper(cancelNotifications());

        await expect(response).toBeUndefined();
      });

      it('if pass an array of events, this utils cancel the events into the array and update pushEvents state', async () => {
        spyCancelNotificationsSubscription.mockResolvedValueOnce({result: {}});
        useState.mockReturnValueOnce([
          {
            ...initialState,
            deviceToken: 'fcmToken',
            pushEvents: ['picking:session:created', 'picking:session:assigned'],
          },
          mockSetState,
        ]);

        const {result} = renderHook(() =>
          usePushNotification(
            'local',
            ['picking:session:created', 'picking:session:assigned'],
            'PickingApp',
            {current: false},
          ),
        );

        const {cancelNotifications} = result.current;

        const [response] = await promiseWrapper(
          cancelNotifications(['picking:session:created']),
        );

        expect(mockSetState).toHaveBeenCalled();
        await expect(response).toBeUndefined();
      });

      it('if the api calls fails, this returns an error', async () => {
        spyCancelNotificationsSubscription.mockRejectedValueOnce({
          message: 'error',
        });
        useState.mockReturnValueOnce([
          {
            ...initialState,
            deviceToken: 'fcmToken',
            pushEvents: ['picking:session:created'],
          },
          mockSetState,
        ]);

        const {result} = renderHook(() =>
          usePushNotification(
            'local',
            ['picking:session:created'],
            'PickingApp',
            {current: false},
          ),
        );

        const {cancelNotifications} = result.current;

        const [, error] = await promiseWrapper(cancelNotifications());

        await expect(error).toStrictEqual({message: 'error'});
      });
    });

    describe('addNewEvent util', () => {
      it('which allows including a new event if it is not in the pushEvents array', () => {
        useState.mockReturnValueOnce([
          {
            ...initialState,
            deviceToken: 'fcmToken',
            pushEvents: ['picking:session:created'],
          },
          mockSetState,
        ]);

        const {result} = renderHook(() =>
          usePushNotification(
            'local',
            ['picking:session:created'],
            'PickingApp',
            {current: false},
          ),
        );
        const {addNewEvent} = result.current;

        addNewEvent('picking:session:assigned');

        expect(mockSetState).toHaveBeenCalled();
      });

      it('which allows including a new event if it is not in the pushEvents array', () => {
        useState.mockReturnValueOnce([
          {
            ...initialState,
            deviceToken: 'fcmToken',
            pushEvents: ['picking:session:created'],
          },
          mockSetState,
        ]);

        const {result} = renderHook(() =>
          usePushNotification(
            'local',
            ['picking:session:created'],
            'PickingApp',
            {current: false},
          ),
        );
        const {addNewEvent} = result.current;
        const res = addNewEvent();

        expect(res).toBeUndefined();
      });

      it('which allows including a new event if it is not in the pushEvents array', () => {
        useState.mockReturnValueOnce([
          {
            ...initialState,
            deviceToken: 'fcmToken',
            pushEvents: ['picking:session:created'],
          },
          mockSetState,
        ]);

        const {result} = renderHook(() =>
          usePushNotification(
            'local',
            ['picking:session:created'],
            'PickingApp',
            {current: false},
          ),
        );
        const {addNewEvent} = result.current;
        const res = addNewEvent('picking:session:created');

        expect(res).toBeUndefined();
      });
    });

    describe('getSubscribedEvent util', () => {
      it('return an array with the subscribed events', async () => {
        useState.mockReturnValueOnce([
          {
            ...initialState,
            deviceToken: 'fcmToken',
            pushEvents: ['picking:session:created'],
          },
          mockSetState,
        ]);

        const {result} = renderHook(() =>
          usePushNotification(
            'local',
            ['picking:session:created'],
            'PickingApp',
            {current: false},
          ),
        );
        const {getSubscribedEvents} = result.current;

        const response = getSubscribedEvents();

        expect(response).toStrictEqual(['picking:session:created']);
      });
    });

    describe('deleteReceivedNotification util', () => {
      describe('should remove the information of the selected notification type from the notification status', () => {
        const mockState = {
          foregroundNotification: {data: {}, notification: {}},
          backgroundNotification: {data: {}, notification: {}},
          deviceToken: 'fcmToken',
          pushEvents: ['picking:session:created'],
        };

        it('if the selected type is foreground then should reset the foreground notification information', () => {
          useState.mockReturnValueOnce([mockState, mockSetState]);

          const {result} = renderHook(() =>
            usePushNotification(
              'local',
              ['picking:session:created'],
              'PickingApp',
              {current: false},
            ),
          );
          const {deleteReceivedNotification} = result.current;
          deleteReceivedNotification({type: 'foreground'});

          expect(mockSetState).toHaveBeenCalled();
        });

        it('if the selected type is background then should reset the background notification information', () => {
          useState.mockReturnValueOnce([mockState, mockSetState]);

          const {result} = renderHook(() =>
            usePushNotification(
              'local',
              ['picking:session:created'],
              'PickingApp',
              {current: false},
            ),
          );
          const {deleteReceivedNotification} = result.current;

          deleteReceivedNotification({type: 'background'});

          expect(mockSetState).toHaveBeenCalled();
        });

        it('if type is not pass return null', () => {
          useState.mockReturnValueOnce([mockState, mockSetState]);

          const {result} = renderHook(() =>
            usePushNotification(
              'local',
              ['picking:session:created'],
              'PickingApp',
              {current: false},
            ),
          );
          const {deleteReceivedNotification} = result.current;

          deleteReceivedNotification();

          expect(mockSetState).not.toHaveBeenCalled();
        });
      });
    });
  });
});
