import nock from 'nock';
import Request from '@janiscommerce/app-request';
import UnSubscribeNotifications from '../../../../lib/utils/api/UnSubscribeNotifications';

describe('UnSubscribeNotifications ', () => {
  const RequestInstance = new Request({JANIS_ENV: 'local'});
  const postSpy = jest.spyOn(RequestInstance, 'post');

  const validParams = {
    events: ['picking', 'janis', 'wms', 'delivery'],
    request: RequestInstance,
  };

  describe('returns an error', () => {
    it('when not receive a valid object as argument', async () => {
      await expect(UnSubscribeNotifications()).rejects.toThrow(
        'params is not a valid object',
      );
    });

    it('when not receive a valid array events into received params', async () => {
      const {events, ...rest} = validParams;

      await expect(UnSubscribeNotifications(rest)).rejects.toThrow(
        'events to be subscribed to are null',
      );
    });

    it('when not receive Request class into received params', async () => {
      const {request, ...rest} = validParams;

      await expect(UnSubscribeNotifications(rest)).rejects.toThrow(
        'Request is not available',
      );
    });

    it('when not receive a valid array with valid topics to subscribe', async () => {
      const {events, ...rest} = validParams;

      await expect(
        UnSubscribeNotifications({...rest, events: [3, null]}),
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

      nock(server).post('/unsubscribe/push').reply(200, {});

      const response = await UnSubscribeNotifications(validParams);

      expect(response).toStrictEqual({result: {}});
    });
  });
});
