import nock from 'nock';
import RequestInstance from '../../../../lib/utils/request';
import cancelNotificationsSubscription from '../../../../lib/utils/api/cancelNotificationsSubscription';
import {promiseWrapper} from '../../../../lib/utils';

describe('cancelNotificationsSubscription', () => {
  const postSpy = jest.spyOn(RequestInstance, 'post');

  const validParams = {
    events: ['picking', 'janis', 'wms', 'delivery'],
    env: 'local',
  };

  describe('returns an error', () => {
    it('when api calls fails', async () => {
      postSpy.mockRejectedValueOnce(new Error('API call failed'));

      const [, error] = await promiseWrapper(
        cancelNotificationsSubscription(validParams),
      );
      expect(error).toBeDefined();
      expect(error.message).toBe('API call failed');
    });
  });

  describe('cancel notifications subscription', () => {
    afterEach(() => {
      nock.cleanAll();
    });
    const server = `https://notifications.local.in/api`;

    it('api responses correctly', async () => {
      postSpy.mockResolvedValueOnce({result: undefined});

      nock(server).post('/unsubscribe/push').reply(200, undefined);

      const [response] = await promiseWrapper(
        cancelNotificationsSubscription({
          ...validParams,
          events: ['picking', 'delivery'],
        }),
      );

      await expect(response).toBeUndefined();
    });
    it('make request with default params', async () => {
      postSpy.mockResolvedValueOnce({result: undefined});

      nock(server).post('/unsubscribe/push').reply(200, undefined);

      const [response] = await promiseWrapper(
        cancelNotificationsSubscription(),
      );

      expect(response).toBeUndefined();
    });
  });
});
