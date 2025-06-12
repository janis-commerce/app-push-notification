import notifee, {
  AndroidImportance,
  AndroidVisibility,
} from '@notifee/react-native';
import {promiseWrapper} from '../../../lib/utils';
import {
  makeDefaultChannel,
  makeNotificationChannel,
  makeNotificationChannels,
  parseChannelConfiguration,
  parseNotificationChannel,
} from '../../../lib/utils/channel';
import DEFAULT_CHANNEL_CONFIGS from '../../../lib/constants/defaultChannelConfigs';

const validChannel = {
  id: 'channel_id',
  name: 'channel',
  description: 'notification channel',
};

const mockCreateChannel = jest.spyOn(notifee, 'createChannel');
const mockCreateChannels = jest.spyOn(notifee, 'createChannels');

describe('channel utils', () => {
  describe('parseChannelConfiguration', () => {
    describe('return null when', () => {
      it('not receive an argument', () => {
        const response = parseChannelConfiguration();

        expect(response).toBeNull();
      });

      it('receive invalid object as argument', () => {
        const response = parseChannelConfiguration('channel');

        expect(response).toBeNull();
      });

      it('the received object hasnt a name key', () => {
        const response = parseChannelConfiguration({id: 'channel'});

        expect(response).toBeNull();
      });
    });

    describe('return parse object', () => {
      it('when receive a valid channel configuration', () => {
        const response = parseChannelConfiguration(validChannel);

        expect(response).toStrictEqual({
          ...DEFAULT_CHANNEL_CONFIGS,
          id: 'channel_id',
          name: 'channel',
          description: 'notification channel',
          importance: 4,
        });
      });
      it('with the same name and id when the object not contains id key', () => {
        const response = parseChannelConfiguration({name: 'channel'});

        expect(response).toStrictEqual({
          ...DEFAULT_CHANNEL_CONFIGS,
          id: 'channel',
          name: 'channel',
          importance: 4,
        });
      });
    });

    it('creates a channel that replaces all default values', () => {
      const response = parseChannelConfiguration({
        id: 'channel_id',
        name: 'channel',
        description: 'notification channel',
        importance: AndroidImportance.LOW,
        vibration: false,
        lights: false,
        sound: undefined,
        vibrationPattern: [1000],
        visibility: AndroidVisibility.PRIVATE,
      });

      console.log('response', response);

      expect(response).toStrictEqual({
        ...DEFAULT_CHANNEL_CONFIGS,
        id: 'channel_id',
        name: 'channel',
        description: 'notification channel',
        vibration: false,
        lights: false,
        sound: undefined,
        vibrationPattern: [1000],
        visibility: AndroidVisibility.PRIVATE,
      });
    });
  });

  describe('parseNotificationChannel', () => {
    it('return null when not receive an argument with valid type', () => {
      const response = parseNotificationChannel(1);

      expect(response).toBeNull();
    });
    it('return an object when receive an string or object as argument', () => {
      const parsedChannel1 = parseNotificationChannel('channel');
      const parsedChannel2 = parseNotificationChannel(validChannel);

      expect(parsedChannel1).toStrictEqual({
        ...DEFAULT_CHANNEL_CONFIGS,
        name: 'channel',
        id: 'channel',
        importance: 4,
      });

      expect(parsedChannel2).toStrictEqual({
        ...DEFAULT_CHANNEL_CONFIGS,
        id: 'channel_id',
        name: 'channel',
        description: 'notification channel',
        importance: 4,
      });
    });
  });

  describe('makeNotificationChannel', () => {
    describe('return null when', () => {
      it('receive an object without id or name', async () => {
        const response = await makeNotificationChannel();

        expect(response).toBeNull();
      });
    });

    describe('create a channel when', () => {
      it('has a valid channelConfig', async () => {
        mockCreateChannel.mockResolvedValueOnce();
        const [response] = await promiseWrapper(
          makeNotificationChannel({...validChannel, importance: 4}),
        );

        await expect(response).toBeUndefined();
      });
    });

    describe('return an error when', () => {
      it('the channel maker fails', async () => {
        mockCreateChannel.mockRejectedValueOnce('error');
        const [, error] = await promiseWrapper(
          makeNotificationChannel({...validChannel, importance: 4}),
        );

        await expect(error).toStrictEqual('error');
      });
    });
  });

  describe('makeDefaultChannel', () => {
    describe('return an error when', () => {
      it('the default channel maker fails', async () => {
        mockCreateChannel.mockRejectedValueOnce('error');

        const [, error] = await promiseWrapper(makeDefaultChannel());

        await expect(error).toStrictEqual('error');
      });
    });

    describe('create default channel', () => {
      it('when the function is called', async () => {
        mockCreateChannel.mockResolvedValueOnce();

        const [response] = await promiseWrapper(makeDefaultChannel());

        await expect(response).toBeUndefined();
      });
    });
  });

  describe('makeNotificationChannels', () => {
    it('create channels when receive array of configs', async () => {
      mockCreateChannels.mockResolvedValueOnce();

      const [response] = await promiseWrapper(
        makeNotificationChannels([{...validChannel, importance: 4}]),
      );

      await expect(response).toBeUndefined();
    });

    it('return an error when channels maker fails', async () => {
      mockCreateChannels.mockRejectedValueOnce('error');

      const [, error] = await promiseWrapper(makeNotificationChannels([]));

      await expect(error).toStrictEqual('error');
    });
  });
});
