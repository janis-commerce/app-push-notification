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
