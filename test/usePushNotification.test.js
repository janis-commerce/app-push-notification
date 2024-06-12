import {useState} from 'react';
import {renderHook} from '@testing-library/react-native';
import usePushNotification from '../lib/usePushNotification';
import * as UnSubscribeNotifications from '../lib/utils/api/UnSubscribeNotifications';
import * as SubscribeNotifications from '../lib/utils/api/SubscribeNotifications';
import {promiseWrapper} from '../lib/utils';

describe('usePushNotification hook', () => {
  const spyUnSubscribeNotifications = jest.spyOn(
    UnSubscribeNotifications,
    'default',
  );

  const spySubscribeNotifications = jest.spyOn(
    SubscribeNotifications,
    'default',
  );

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
      it('this util call the api to suscribe to notifications service', async () => {
        spySubscribeNotifications.mockResolvedValueOnce({result: {}});
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
        const {updateSuscription} = result.current;

        const [response] = await promiseWrapper(
          updateSuscription({language: 'en-US'}),
        );

        await expect(response).toStrictEqual({result: {}});
      });

      it('this util returns an error when the suscription has an error', async () => {
        spySubscribeNotifications.mockRejectedValueOnce({message: 'error'});
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
        const {updateSuscription} = result.current;

        const [, response] = await promiseWrapper(updateSuscription());

        await expect(response).toStrictEqual({message: 'error'});
      });
    });
    describe('cancelNotifications util', () => {
      it('this utils call the api and cancel the subscription to event passed an arguments or all events', async () => {
        spyUnSubscribeNotifications.mockResolvedValueOnce({result: {}});
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
        spyUnSubscribeNotifications.mockResolvedValueOnce({result: {}});
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

        expect(mockSetState).toHaveBeenCalledWith({
          ...initialState,
          deviceToken: 'fcmToken',
          pushEvents: ['picking:session:assigned'],
        });
        await expect(response).toBeUndefined();
      });

      it('if the api calls fails, this returns an error', async () => {
        spyUnSubscribeNotifications.mockRejectedValueOnce({message: 'error'});
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

        expect(mockSetState).toHaveBeenCalledWith({
          ...initialState,
          deviceToken: 'fcmToken',
          pushEvents: ['picking:session:created', 'picking:session:assigned'],
        });
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

        expect(res).toBeNull();
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

        expect(res).toBeNull();
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

          expect(mockSetState).toHaveBeenCalledWith({
            ...mockState,
            foregroundNotification: {},
          });
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

          expect(mockSetState).toHaveBeenCalledWith({
            ...mockState,
            backgroundNotification: {},
          });
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
