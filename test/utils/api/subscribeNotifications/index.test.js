import nock from 'nock';
import Request from '@janiscommerce/app-request';
import SubscribeNotifications from '../../../../lib/utils/api/SubscribeNotifications';
import {promiseWrapper} from '../../../../lib/utils';

describe('SubscribeNotifications', () => {
  const RequestInstance = new Request({JANIS_ENV: 'local'});
  const postSpy = jest.spyOn(RequestInstance, 'post');

  const validParams = {
    deviceToken: 'janis-device',
    events: ['picking', 'janis', 'wms', 'delivery'],
    appName: 'janis-app',
  };

  describe('returns an error', () => {
    it('when api calls fails', async () => {
      postSpy.mockRejectedValueOnce(new Error('API call failed'));

      const [, error] = await promiseWrapper(
        SubscribeNotifications(validParams, RequestInstance),
      );
      expect(error).toBeDefined();
      expect(error.message).toBe('API call failed');
    });
  });

  describe('complete subscribe request', () => {
    afterEach(() => {
      nock.cleanAll();
    });
    const server = `https://notifications.local.in/api`;

    it('return correct data', async () => {
      postSpy.mockResolvedValueOnce({result: {}});

      nock(server).post('/subscribe/push').reply(200, {});

      const [response] = await promiseWrapper(SubscribeNotifications());

      expect(response).toBeUndefined();
    });

    it('make request with correct params', async () => {
      postSpy.mockResolvedValueOnce({result: {}});

      nock(server).post('/subscribe/push').reply(200, {});

      const [response] = await promiseWrapper(
        SubscribeNotifications({
          ...validParams,
          additionalInfo: {
            language: 'en-US',
          },
        }),
      );

      expect(response).toBeUndefined();
    });
  });
});
