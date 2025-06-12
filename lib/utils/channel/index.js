import notifee, {AndroidImportance} from '@notifee/react-native';
import DEFAULT_CHANNEL_CONFIGS from '../../constants/defaultChannelConfigs';
import {isObject, isString} from '..';

export const parseChannelConfiguration = (params = {}) => {
  if (!params || !isObject(params)) return null;

  const {name, id = '', description = '', ...restConfigs} = params;

  if (!name || !isString(name)) return null;

  const isValidDescription = !!description && isString(description);
  const hasValidId = !!id && isString(id);

  return {
    ...DEFAULT_CHANNEL_CONFIGS,
    ...restConfigs,
    name,
    id: hasValidId ? id : name,
    importance: AndroidImportance.HIGH,
    ...(isValidDescription && {
      description,
    }),
  };
};

export const parseNotificationChannel = (channel) => {
  const channelType = typeof channel;
  const allowedConfigs = ['string', 'object'];

  if (!allowedConfigs.includes(channelType)) return null;
  const channelData = channelType === 'string' ? {name: channel} : channel;

  const parsedChannel = parseChannelConfiguration(channelData);

  return parsedChannel;
};

/* eslint-disable consistent-return */
export const makeNotificationChannel = async (channelConfig = {}) => {
  const {id, name} = channelConfig;

  if (!id || !name || !isString(id) || !isString(name)) return null;

  try {
    await notifee.createChannel(channelConfig);
  } catch (error) {
    return Promise.reject(error);
  }
};

/* eslint-disable consistent-return */
export const makeNotificationChannels = async (channelConfigs) => {
  try {
    await notifee.createChannels(channelConfigs);
  } catch (error) {
    return Promise.reject(error);
  }
};

/* eslint-disable consistent-return */
export const makeDefaultChannel = async () => {
  try {
    const parsedChannel = parseChannelConfiguration({
      id: 'channel_default',
      name: 'Operational notifications',
      description: 'Default channel to receive operational notifications',
    });

    await makeNotificationChannel(parsedChannel);
  } catch (error) {
    return Promise.reject(error);
  }
};
