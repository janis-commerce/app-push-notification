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
 * @param {function} onSubscriptionError - The function to be called when the subscription fails
 * @returns {null}
 */

const setUpdateSubscriptionByTokenRefresh = async (
  params,
  onSubscriptionError = null,
) => {
  await messaging().registerDeviceForRemoteMessages();

  const unsubscribe = messaging().onTokenRefresh(async (token) => {
    try {
      const {events} = params || {};
      await promiseWrapper(cancelNotificationsSubscription({events}));
      await SubscribeNotifications({token, events});

      await updateStoredToken(token);
    } catch (error) {
      if (onSubscriptionError) onSubscriptionError(error);
    }
  });

  return unsubscribe;
};

export default setUpdateSubscriptionByTokenRefresh;
