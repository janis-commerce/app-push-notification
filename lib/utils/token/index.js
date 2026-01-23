import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @function getFCMToken
 * @description This function is responsible for getting the FCM token
 * @returns {Promise<string>} The FCM token
 */

export const getFCMToken = async () => {
  const fcmToken = await messaging().getToken();
  if (!fcmToken) throw new Error('FCM token is null');
  return fcmToken;
};

/**
 * @function getStoredToken
 * @description This function is responsible for getting the stored token from AsyncStorage
 * @returns {Promise<string|null>} The stored token or null if not found
 */

export const getStoredToken = async () => {
  const storedToken = await AsyncStorage.getItem('currentToken');
  return storedToken;
};

/**
 * @function updateStoredToken
 * @description This function is responsible for updating the stored token in AsyncStorage
 * @param {string} token - The token to be stored
 * @returns {Promise<string>} The stored token
 */

export const updateStoredToken = async (token) => {
  try {
    await AsyncStorage.setItem('currentToken', token);
    return token;
  } catch (error) {
    return null;
  }
};
