import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * @function getFCMToken
 * @description This function is responsible for getting the FCM token
 * @returns {Promise<string>} The FCM token
 */

export const getFCMToken = async () => {
  try {
    const fcmToken = await messaging().getToken();
    return fcmToken;
  } catch (error) {
    return null;
  }
};

/**
 * @function getStoredToken
 * @description This function is responsible for getting the stored token from AsyncStorage
 * @returns {Promise<string>} The stored token
 */

export const getStoredToken = async () => {
  try {
    const storedToken = await AsyncStorage.getItem('currentToken');
    return storedToken;
  } catch (error) {
    return null;
  }
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
