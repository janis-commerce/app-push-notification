import AsyncStorage from '@react-native-async-storage/async-storage';
import Request from '../../request';

/**
 * Cancels push notification subscriptions for specified events
 * @param {Object} params - The parameters object
 * @param {string[]} [params.events=[]] - Array of event names to unsubscribe from
 * @returns {Promise<Object>} Promise that resolves with the API response
 * @throws {Error} When API request fails
 * @example
 * // Cancel subscription for specific events
 * await cancelNotificationsSubscription({
 *   events: ['user.login', 'order.created'],
 *   env: 'janisdev'
 * });
 */

const cancelNotificationsSubscription = async ({events = []} = {}) => {
  try {
    await Request.post({
      service: 'notification',
      namespace: 'unsubscribe',
      pathParams: ['push'],
      body: {
        events,
      },
    });

    await AsyncStorage.removeItem('currentToken');

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export default cancelNotificationsSubscription;
