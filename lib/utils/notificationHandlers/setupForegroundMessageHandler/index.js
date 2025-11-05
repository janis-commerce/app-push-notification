import messaging from '@react-native-firebase/messaging';

/**
 * @function setupForegroundMessageHandler
 * @description This function is responsible for handling any callbacks from Firebase cloud messaging in the foreground and rendering them using a callback
 * @param {Function} callback is the function that will receive the payload and render it as appropriate
 */

const setupForegroundMessageHandler = (callback) =>
  messaging().onMessage(async (remoteMessage) => {
    callback(remoteMessage);
  });

export default setupForegroundMessageHandler;
