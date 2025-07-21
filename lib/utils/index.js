import messaging from '@react-native-firebase/messaging';

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
 * @function promiseWrapper
 * @param {function} fn
 * @description wrapper to execute promise and return tuple with data and error
 * @returns {array<data, error>}
 * @example
 * import {promiseWrapper} from '@janiscommerce/apps-helpers'
 * const [data, error] = await promiseWrapper(promise())
 */

export const promiseWrapper = (promise) =>
  promise
    .then((data) => [data, null])
    .catch((error) => Promise.resolve([null, error]));

/**
 * @function prepareEventsToSubscribe
 * @param {array} events
 * @description parse events to subscribe
 * @returns {array}
 * @example
 * prepareEventsToSubscribe(['event1', 'event2', 3, null]) // ['event1', 'event2']
 * prepareEventsToSubscribe(null) // []
 * prepareEventsToSubscribe('event1') // ['event1']
 */

export const prepareEventsToSubscribe = (events = []) => {
  if (!isArray(events)) {
    events = [events].filter(Boolean);
  }

  if (!events.length) return [];

  return events.filter((event) => !!event && isString(event));
};
// MESSAGING UTILS

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

export const setupBackgroundMessageHandler = (callback = () => {}) =>
  messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    callback(remoteMessage);
  });

/** *
 * @function setupNotificationOpenedHandler
 * @description This function is responsible for handling any Firebase Cloud Messaging callbacks that the app will have from the background
 * @param {Function} callback is the function that will receive the payload and render it as appropriate
 */

export const setupNotificationOpenedHandler = (callback) =>
  messaging().onNotificationOpenedApp(async (remoteMessage) => {
    callback(remoteMessage);
  });
