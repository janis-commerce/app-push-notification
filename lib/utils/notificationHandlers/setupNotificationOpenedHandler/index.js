import messaging from '@react-native-firebase/messaging';
import {removeStoredNotification} from '../../../entities/Storage';

/**
 * @function setupNotificationOpenedHandler
 * @description This function is responsible for handling any Firebase Cloud Messaging callbacks that the app will have from the background
 * @param {Function} callback is the function that will receive the payload and render it as appropriate
 */

const setupNotificationOpenedHandler = (callback) =>
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    const {data, messageId} = remoteMessage || {};
    const {event: type = ''} = data || {};

    removeStoredNotification({type, messageId});
    await Promise.resolve(callback(remoteMessage));
  });

export default setupNotificationOpenedHandler;
