import {getFCMToken, getStoredToken} from '../../token';

/**
 * @function getDeviceFCMToken
 * @description This function is responsible for getting the FCM token of the device
 * @returns {Promise<string>} The FCM token
 */

const getDeviceFCMToken = async () => {
  try {
    const storedToken = await getStoredToken();

    if (storedToken) return storedToken;

    const fcmToken = await getFCMToken();

    return fcmToken;
  } catch (error) {
    return null;
  }
};

export default getDeviceFCMToken;
