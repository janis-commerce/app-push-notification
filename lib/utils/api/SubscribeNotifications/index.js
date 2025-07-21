import RequestInstance from '@janiscommerce/app-request';
import {prepareEventsToSubscribe} from '../../index';

/**
 * @function SubscribeNotifications
 * @description This function is responsible for subscribing to the notification service
 * @param {object} params - The parameters object
 * @param {string} params.token - The token to subscribe to
 * @param {Array<string>} params.events - The events to subscribe to
 * @param {string} params.appName - The name of the app
 * @param {object} params.additionalInfo - The additional information to subscribe to
 * @param {string} params.env - The environment of the app. It is used to make subscribe request in case of request instance is not provided
 * @param {object} requestInstance - The request instance to make subscribe request
 * @returns {Promise<void>} The response from the subscribe request
 * @throws {Error} When the request fails
 */

const SubscribeNotifications = async (params, requestInstance = null) => {
  const {
    token = '',
    events = [],
    appName = '',
    additionalInfo = null,
    env = '',
  } = params || {};
  const Request = requestInstance || new RequestInstance({JANIS_ENV: env});
  const parsedEvents = prepareEventsToSubscribe(events);

  try {
    await Request.post({
      service: 'notification',
      namespace: 'subscribe',
      pathParams: ['push'],
      body: {
        token,
        events: parsedEvents,
        platformApplicationName: appName,
        ...(additionalInfo && {
          additionalInfo,
        }),
      },
    });

    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};

export default SubscribeNotifications;
