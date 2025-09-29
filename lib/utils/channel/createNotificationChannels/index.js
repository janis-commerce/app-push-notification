import {isArray, isString} from '../..';
import {
  makeNotificationChannels,
  makeDefaultChannel,
  parseNotificationChannel,
} from '../index';

/**
 * @function createNotificationChannels
 * @description This function is responsible for creating the notification channels. It will create the default channel and the channels specified in the channelConfigs parameter.
 * @param {object} params - The parameters object
 * @param {array} params.channelConfigs - The channel configurations
 * @param {string} params.defaultChannelSound - The background notification sound
 * @returns {Promise<void>} - A promise that resolves when the notification channels are created
 * @throws {Error} - An error is thrown if the notification channels are not created
 */

const createNotificationChannels = async ({
  channelConfigs,
  defaultSound,
} = {}) => {
  try {
    const hasChannelConfigs = isArray(channelConfigs) && channelConfigs.length;

    if (hasChannelConfigs) {
      const parsedChannelConfigs = channelConfigs
        ?.map((config) => parseNotificationChannel(config))
        .filter(Boolean);

      await makeNotificationChannels(parsedChannelConfigs);
    }

    await makeDefaultChannel({
      sound: isString(defaultSound) ? defaultSound.trim() : 'default',
    });

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export default createNotificationChannels;
