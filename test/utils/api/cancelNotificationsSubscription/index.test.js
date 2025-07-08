import nock from 'nock';
import Request from '@janiscommerce/app-request';
import cancelNotificationsSubscription from '../../../../lib/utils/api/cancelNotificationsSubscription';
import {promiseWrapper} from '../../../../lib/utils';

describe('cancelNotificationsSubscription', () => {
  const RequestInstance = new Request({JANIS_ENV: 'local'});
  const postSpy = jest.spyOn(RequestInstance, 'post');

  const validParams = {
    events: ['picking', 'janis', 'wms', 'delivery'],
    env: 'local',
  };

  describe('returns an error', () => {
    it('when not receive a valid object as argument', async () => {
      await expect(cancelNotificationsSubscription()).rejects.toThrow(
        'invalid environment',
      );
    });

    it('when not receive a valid environment as argument', async () => {
      const {env, ...rest} = validParams;
      await expect(cancelNotificationsSubscription(rest)).rejects.toThrow(
        'invalid environment',
      );
    });

    it('when receive empty environment string', async () => {
      const {env, ...rest} = validParams;
      await expect(
        cancelNotificationsSubscription({...rest, env: ''}),
      ).rejects.toThrow('invalid environment');
    });

    it('when receive null environment', async () => {
      const {env, ...rest} = validParams;
      await expect(
        cancelNotificationsSubscription({...rest, env: null}),
      ).rejects.toThrow('invalid environment');
    });

    it('when receive undefined environment', async () => {
      const {env, ...rest} = validParams;
      await expect(
        cancelNotificationsSubscription({...rest, env: undefined}),
      ).rejects.toThrow('invalid environment');
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
  });
});
