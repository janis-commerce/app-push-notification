import nock from 'nock';
import Request from '@janiscommerce/app-request';
import cancelNotificationsSuscription from '../../../../lib/utils/api/cancelNotificationsSuscription';
import {promiseWrapper} from '../../../../lib/utils';

describe('cancelNotificationsSuscription', () => {
  const RequestInstance = new Request({JANIS_ENV: 'local'});
  const postSpy = jest.spyOn(RequestInstance, 'post');

  const validParams = {
    events: ['picking', 'janis', 'wms', 'delivery'],
    env: 'local',
  };

  describe('returns an error', () => {
    it('when not receive a valid object as argument', async () => {
      await expect(cancelNotificationsSuscription()).rejects.toThrow(
        'invalid environment',
      );
    });

    it('when not receive a valid environment as argument', async () => {
      const {env, ...rest} = validParams;
      await expect(cancelNotificationsSuscription(rest)).rejects.toThrow(
        'invalid environment',
      );
    });

    it('when receive empty environment string', async () => {
      const {env, ...rest} = validParams;
      await expect(
        cancelNotificationsSuscription({...rest, env: ''}),
      ).rejects.toThrow('invalid environment');
    });

    it('when receive null environment', async () => {
      const {env, ...rest} = validParams;
      await expect(
        cancelNotificationsSuscription({...rest, env: null}),
      ).rejects.toThrow('invalid environment');
    });

    it('when receive undefined environment', async () => {
      const {env, ...rest} = validParams;
      await expect(
        cancelNotificationsSuscription({...rest, env: undefined}),
      ).rejects.toThrow('invalid environment');
    });
  });

  describe('cancel notifications suscription', () => {
    afterEach(() => {
      nock.cleanAll();
    });
    const server = `https://notifications.local.in/api`;

    it('api responses correctly', async () => {
      postSpy.mockResolvedValueOnce({result: {}});

      nock(server).post('/unsubscribe/push').reply(200, {success: true});

      const [response] = await promiseWrapper(
        cancelNotificationsSuscription({
          ...validParams,
          events: ['picking', 'delivery'],
        }),
      );

      await expect(response).toBeUndefined();
    });
  });
});
