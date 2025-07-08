import RequestInstance from '@janiscommerce/app-request';

/**
 * Cancels push notification subscriptions for specified events
 * @param {Object} params - The parameters object
 * @param {string[]} [params.events=[]] - Array of event names to unsubscribe from
 * @param {string} params.env - Environment identifier (required)
 * @returns {Promise<Object>} Promise that resolves with the API response
 * @throws {Error} When environment is not provided or API request fails
 * @example
 * // Cancel subscription for specific events
 * await cancelNotificationsSubscription({
 *   events: ['user.login', 'order.created'],
 *   env: 'janisdev'
 * });
 */

const cancelNotificationsSubscription = async (params = {}) => {
  try {
    const {events = [], env = ''} = params;

    if (!env) throw new Error('invalid environment');

    const Request = new RequestInstance({JANIS_ENV: String(env)});

    return await Request.post({
      service: 'notification',
      namespace: 'unsubscribe',
      pathParams: ['push'],
      body: {
        events,
      },
    });
  } catch (error) {
    return Promise.reject(error);
  }
};

export default cancelNotificationsSubscription;
