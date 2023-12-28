import {Alert} from 'react-native';
import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DeviceInfo from 'react-native-device-info';

// Helpers

/**
 * @function isFunction
 * @param {function} fn
 * @description return true or false if arg is a valid function
 * @returns {bool}
 * @example
 * import {isFunction} from '@janiscommerce/apps-helpers'
 * isFunction(() => true) // true
 */
export const isFunction = (fn) =>
  !!({}.toString.call(fn) === '[object Function]');

/**
 * @function isString
 * @param {string} str - String to validate.
 * @description If the type of the argument is a string, return true, otherwise return false.
 * @returns {bool}
 * @example
 * import {isString} from '@janiscommerce/apps-helpers'
 * isString('Janis') // true
 */

export const isString = (str) => !!(typeof str === 'string');

/**
 * @function isObject
 * @param {object} obj
 * @description return true or false if arg is a valid object
 * @returns {bool}
 * @example
 * import {isObject} from '@janiscommerce/apps-helpers'
 * isObject('Janis') // false
 */
export const isObject = (obj) => !!(obj && obj.constructor === Object);

/**
 * @function isNumber
 * @param {number} num
 * @description return true or false if arg is a valid number
 * @returns {bool}
 * @example
 * import {isNumber} from '@janiscommerce/apps-helpers'
 * isNumber('Janis') // false
 */
export const isNumber = (num) =>
  typeof num === 'number' && !Number.isNaN(Number(num));

/**
 * @function isBoolean
 * @param {boolean} fn
 * @description return true or false if arg is a valid boolean
 * @returns {bool}
 * @example
 * import {isBoolean} from '@janiscommerce/apps-helpers'
 * isBoolean((true) // true
 */
export const isBoolean = (bool) => typeof bool === 'boolean';

/**
 * @function isArray
 * @param {array} arr
 * @description return true or false if arg is a valid array
 * @returns {bool}
 * @example
 * import {isArray} from '@janiscommerce/apps-helpers'
 * isArray(['Janis']) // true
 */
export const isArray = (arr) => !!(arr instanceof Array);

/**
 * @function validateOauthData
 * @param {string} accessToken
 * @param {string} client
 * @returns {boolean} - true or false
 * @example validateOauthData([], 'fizzmodarg') => false
 * @example validateOauthData('34234sdfrdf', 'fizzmodarg') => true
 */
export const validateOauthData = (accessToken, client) => {
  if (!accessToken || !client) return false;
  if (!isString(accessToken) || !isString(client)) return false;
  return true;
};

export const formatDeviceDataForUserAgent = (deviceData) => {
  if (!isObject(deviceData) || !Object.keys(deviceData).length) return {};

  const keysToCheck = [
    'janis-app-package-name',
    'janis-app-version',
    'janis-app-name',
    'janis-app-build',
    'janis-app-device-os-name',
    'janis-app-device-os-version',
    'janis-app-device-id',
    'janis-app-device-name',
  ];

  const hasSomeValidValues = keysToCheck.some(
    (key) => isString(deviceData[key]) && !!deviceData[key],
  );

  if (!hasSomeValidValues) return {};

  const userAgentParts = [];

  keysToCheck.forEach((key) => {
    const value =
      !deviceData[key] || !isString(deviceData[key])
        ? `unknown ${key}`
        : deviceData[key];
    userAgentParts.push(value);
  });

  return {
    'user-agent': `${userAgentParts[0]}/${userAgentParts[1]} (${userAgentParts[2]}; ${userAgentParts[3]}) ${userAgentParts[4]}/${userAgentParts[5]} (${userAgentParts[6]}; ${userAgentParts[7]})`,
  };
};

/**
 * @function getDeviceData
 * @description return data from device user
 * @returns {{
 * 'application-name': string,
 * 'build-number': string,
 * 'app-version': string,
 * 'bundle-id': string,
 * 'os-name': string,
 * 'device-id': string,
 * 'device-name': string
 * }} - Object with device data
 * @example getDeviceData() => {applicationName: 'AppName', buildNumber: '434', appVersion: '1.5.0', bundleId: 'com.janis.appname', osName: 'android', osVersion: '11', deviceId: '34hf83hf89ahfjo', deviceName: 'Pixel 2'}
 */

export const getDeviceData = () => {
  const applicationName = DeviceInfo.getApplicationName() || '';
  const buildNumber = DeviceInfo.getBuildNumber() || '';
  const appVersion = DeviceInfo.getVersion() || '';
  const bundleId = DeviceInfo.getBundleId() || '';
  const osName = DeviceInfo.getSystemName() || '';
  const osVersion = DeviceInfo.getSystemVersion() || '';
  const deviceId = DeviceInfo.getUniqueId() || '';
  const deviceName = DeviceInfo.getModel() || '';

  return {
    'janis-app-name': applicationName,
    'janis-app-build': buildNumber,
    'janis-app-version': appVersion,
    'janis-app-package-name': bundleId,
    'janis-app-device-os-name': osName,
    'janis-app-device-os-version': osVersion,
    'janis-app-device-id': deviceId,
    'janis-app-device-name': deviceName,
  };
};

const filterValidHeaders = (headers) => {
  if (!headers || !isObject(headers) || !Object.keys(headers).length) return {};

  return Object.fromEntries(
    Object.entries(headers).filter(([, value]) => !!value && !!isString(value)),
  );
};

/**
 * @function getHeaders
 * @param {object} [params={}] - object with params
 * @param {object} [deviceDataHeaders={}] - headers with the device info
 * @param {object} [customHeaders={}] - extra custom headers
 * @param {string} params.client - client name for janis api
 * @param {string} params.accessToken - access token for janis api
 * @param {number} params.page - number of page
 * @param {number} params.pageSize - quantity per page
 * @param {boolean} params.getTotals - request api totals
 * @param {boolean} params.getOnlyTotals - request api totals without body response
 * @description get correct headers for janis api
 * @returns {object}
 * @example
 * const params = {
 *   client: 'my-client',
 *   accessToken: 'my-access-token',
 *   page: 1,
 *   pageSize: 10,
 *   getTotals: true,
 *   getOnlyTotals: false
 * };
 * const deviceDataHeaders = {
 *   'janis-app-name': 'MyApp',
 *   'janis-app-version': '1.0.0',
 *   'janis-app-device-os-name': 'iOS',
 *   'janis-app-device-os-version': '14.5',
 *   'janis-app-device-name': 'iPhone 12',
 *   'janis-app-device-id': '123456789'
 * };
 * const customHeaders = {
 *   'custom-header': 'custom-value'
 * };
 * const headers = getHeaders(params, deviceDataHeaders, customHeaders);
 * // {
 * //   'content-Type': 'application/json',
 * //   'janis-api-key': 'Bearer',
 * //   'janis-client': 'my-client',
 * //   'janis-api-secret': 'my-access-token',
 * //   'x-janis-page': 1,
 * //   'x-janis-page-size': 10,
 * //   'x-janis-totals': true,
 * //   'x-janis-only-totals': false,
 * //   'user-agent': 'MyApp/1.0.0 (iOS 14.5; iPhone 12; 123456789)',
 * //   'custom-header': 'custom-value'
 * // }
 */

export const getHeaders = (params = {}, customHeaders = {}) => {
  const deviceDataHeaders = getDeviceData();

  const validCustomHeaders = filterValidHeaders(customHeaders);
  const validDeviceDataHeaders = filterValidHeaders(deviceDataHeaders);
  const validUserAgentHeader = formatDeviceDataForUserAgent(
    validDeviceDataHeaders,
  );

  const baseHeaders = {
    'content-Type': 'application/json',
    'janis-api-key': 'Bearer',
    ...validUserAgentHeader,
    ...validDeviceDataHeaders,
    ...validCustomHeaders,
  };

  if (!isObject(params)) return baseHeaders;
  const {client, accessToken, page, pageSize, getTotals, getOnlyTotals} =
    params;

  return {
    ...baseHeaders,
    ...(isString(client) && client && {'janis-client': client}),
    ...(isString(accessToken) &&
      accessToken && {'janis-api-secret': accessToken}),
    ...(isNumber(page) && page && {'x-janis-page': page}),
    ...(isNumber(pageSize) && pageSize && {'x-janis-page-size': pageSize}),
    ...(isBoolean(getTotals) && getTotals && {'x-janis-totals': getTotals}),
    ...(isBoolean(getOnlyTotals) &&
      getOnlyTotals && {'x-janis-only-totals': getOnlyTotals}),
  };
};

// MESSAGING UTILS

/**
 * @function getFCMToken
 * @description This function is responsible for generating an fmc token or obtaining it from storage if one already exists. If it cannot be obtained, it will return an empty string
 * @returns {string}
 * @example
 *
 * getFCMToken() => JDF6GJS364uhaGGe384gJHIQs23nbRNFG2859gJSD9gBivajeSJD
 */

export const getFCMToken = async () => {
  try {
    const fcmToken = await AsyncStorage.getItem('fcmtoken');

    if (!fcmToken) {
      const newFcmToken = await messaging().getToken();

      if (newFcmToken) {
        await AsyncStorage.setItem('fcmtoken', newFcmToken);
        return newFcmToken;
      }
    }

    return fcmToken || '';
  } catch (error) {
    console.error('error', error.message);

    return '';
  }
};

// esto actualmente no funciona con la versión RN de picking. Pero será necesario eventualemnte.
// A partir de la versión 13 (api >= 33 ) de android el usuario tiene que otorgar los permisos manualmente.
// por lo que deberemos agregarlo dentro del package futuro y sumarlo a picking una vez que esté actualizado.

// export const requestUserPermission = async () => {
//   const permission = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

//   return permission;
// };

/** *
 * @function setupForegroundMessageHandler
 * @description This function is responsible for handling any callbacks from Firebase cloud messaging in the foreground and rendering them using a callback
 * @param {Function} callback is the function that will receive the payload and render it as appropriate
 */

export const setupForegroundMessageHandler = (callback) =>
  messaging().onMessage(async (remoteMessage) => {
    callback(remoteMessage);
  });

/** *
 * @function setupBackgroundMessageHandler
 * @description This function is responsible for handling any callbacks from Firebase cloud messaging in the background or with the application closed
 * @param {Function} callback is the function that will receive the payload and render it as appropriate
 */

export const setupBackgroundMessageHandler = (callback) =>
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    callback(remoteMessage);
  });

/** *
 * @name DefaultAlert
 * @description a default alert component to be used when a foregroundCallback function is not passed by parameters
 * @param {object} remoteMessage the object that was received from fcm
 * @throws null when not receive a valid object as remoteMessage
 * @returns an alert with title and body received from FCM remoteMessage
 *
 */

export const DefaultAlert = (remoteMessage = {}) => {
  if (!remoteMessage || !Object.keys(remoteMessage).length) return null;

  const {notification = {}} = remoteMessage;
  const {title, body} = notification;

  const validTitle = isString(title) ? title : 'A new FCM message arrived!';
  const validateBody = isString(body) ? body : undefined;

  return Alert.alert(validTitle, validateBody);
};

/* istanbul ignore next */
export const topicsSubscription = async (topics) => {
  try {
    if (!topics || !isArray(topics)) return null;

    await messaging().subscribeToTopic(topics);

    return {message: `suscribed to ${topics} topic!`};
  } catch (reason) {
    console.error(reason?.message);

    return Promise.reject(reason?.message);
  }
};

/* istanbul ignore next */
export const topicsUnsubscription = async (topic) => {
  try {
    if (!topic || !isString(topic)) return null;

    await messaging().unsubscribeFromTopic(topic);

    return {message: `unsuscribed to ${topic} topic!`};
  } catch (reason) {
    console.error(reason?.message);

    return Promise.reject(reason?.message);
  }
};
