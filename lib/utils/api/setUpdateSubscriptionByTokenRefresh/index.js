/* istanbul ignore file */
import messaging from '@react-native-firebase/messaging';
import cancelNotificationsSubscription from '../cancelNotificationsSubscription';
import SubscribeNotifications from '../SubscribeNotifications';
import {promiseWrapper} from '../..';
import {updateStoredToken} from '../../token';

/**
 * @function setUpdateSubscriptionByTokenRefresh
 * @description This function is responsible for updating the subscription to the notification service when the token is refreshed
 * @param {object} params - The parameters object
 * @param {Array<string>} params.events - The events to subscribe to
 * @param {string} params.appName - The name of the app
 * @param {string} params.env - The environment of the app. It is used to make unsubscribe and subscribe requests in case of request instance is not provided
 * @param {object} requestInstance - The request instance to make unsubscribe and subscribe requests
 * @param {function} onSubscriptionError - The function to be called when the subscription fails
 * @returns {null}
 */

const setUpdateSubscriptionByTokenRefresh = async (
  params,
  requestInstance,
  onSubscriptionError = null,
) => {
  await messaging().registerDeviceForRemoteMessages();

  const unsubscribe = messaging().onTokenRefresh(async (token) => {
    try {
      const {events, appName, env} = params || {};
      await promiseWrapper(
        cancelNotificationsSubscription({events, env}, requestInstance),
      );
      await SubscribeNotifications(
        {token, events, appName, env},
        requestInstance,
      );

      await updateStoredToken(token);
    } catch (error) {
      if (onSubscriptionError) onSubscriptionError(error);
    }
  });

  return unsubscribe;
};

export default setUpdateSubscriptionByTokenRefresh;
