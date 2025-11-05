import messaging from '@react-native-firebase/messaging';
import {
  DEFAULT_STORAGE_CONFIG,
  storeNotification,
  removeOldestNotification,
  Storage,
} from '../../../entities/Storage/index';

/**
 * @function setupBackgroundMessageHandler
 * @description This function is responsible for handling any callbacks from Firebase cloud messaging in the background or with the application closed
 * @param {Function} callback is the function that will receive the payload and render it as appropriate
 */

const setupBackgroundMessageHandler = (
  storageConfigs = {},
  callback = () => {},
) =>
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    const {event: type} = remoteMessage?.data || {};
    const {maxStorageQuantity, expirationTime} =
      storageConfigs[type] || DEFAULT_STORAGE_CONFIG;
    const storedQuantity = Storage.get(type)?.length || 0;

    if (storedQuantity >= maxStorageQuantity) {
      removeOldestNotification(type);
    }

    storeNotification({
      type,
      notification: remoteMessage,
      storageConfig: {expiresAt: expirationTime},
    });

    await Promise.resolve(callback(remoteMessage));
  });

export default setupBackgroundMessageHandler;
