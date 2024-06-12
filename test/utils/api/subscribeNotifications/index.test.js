import nock from 'nock';
import Request from '@janiscommerce/app-request';
import SubscribeNotifications from '../../../../lib/utils/api/SubscribeNotifications';

describe('SubscribeNotifications', () => {
  const RequestInstance = new Request({JANIS_ENV: 'local'});
  const postSpy = jest.spyOn(RequestInstance, 'post');

  const validParams = {
    deviceToken: 'janis-device',
    events: ['picking', 'janis', 'wms', 'delivery'],
    appName: 'janis-app',
    request: RequestInstance,
  };
  describe('returns an error', () => {
    it('when not receive a valid object as argument', async () => {
      await expect(SubscribeNotifications()).rejects.toThrow(
        'params is not a valid object',
      );
    });

    it('when not receive a valid device token as argument', async () => {
      const {deviceToken, ...rest} = validParams;
      await expect(SubscribeNotifications(rest)).rejects.toThrow(
        'device token is invalid or null',
      );
    });

    it('when not receive a valid array events into received params', async () => {
      const {events, ...rest} = validParams;

      await expect(SubscribeNotifications(rest)).rejects.toThrow(
        'events to be subscribed to are null',
      );
    });

    it('when not receive a valid appName into reveiced params', async () => {
      const {appName, ...rest} = validParams;

      await expect(SubscribeNotifications(rest)).rejects.toThrow(
        'application name are invalid or null',
      );
    });

    it('when not receive Request class into received params', async () => {
      const {request, ...rest} = validParams;

      await expect(SubscribeNotifications(rest)).rejects.toThrow(
        'Request is not available',
      );
    });

    it('when not receive a valid array with valid topics to subscribe', async () => {
      const {events, ...rest} = validParams;

      await expect(
        SubscribeNotifications({...rest, events: [3, null]}),
      ).rejects.toThrow('events to be suscribed are invalids');
    });
  });

  describe('returns data', () => {
    afterEach(() => {
      nock.cleanAll();
    });
    const server = `https://notifications.local.in/api`;

    it('return correct data', async () => {
      postSpy.mockResolvedValueOnce({result: {}});

      nock(server).post('/subscribe/push').reply(200, {});

      const response = await SubscribeNotifications({
        ...validParams,
        additionalInfo: {
          language: 'en-US',
        },
      });

      expect(response).toStrictEqual({result: {}});
    });
  });
});
