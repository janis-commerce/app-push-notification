import {useState} from 'react';
import RequestInstance from '@janiscommerce/app-request';
import {isArray, isString, promiseWrapper} from './utils';
import SubscribeNotifications from './utils/api/SubscribeNotifications';
import {getStoredToken, getFCMToken, updateStoredToken} from './utils/token';
import cancelNotificationsSubscription from './utils/api/cancelNotificationsSubscription';

const usePushNotification = (environment, events, appName) => {
  const [notificationState, setNotificationState] = useState({
    foregroundNotification: {},
    backgroundNotification: {},
    pushEvents: events,
    subscribeError: {},
  });

  const {
    foregroundNotification,
    backgroundNotification,
    pushEvents,
    subscribeError,
  } = notificationState;

  const Request = new RequestInstance({JANIS_ENV: environment});

  // istanbul ignore next line
  const updateNotificationState = (updateState) =>
    setNotificationState((prevState) => ({...prevState, ...updateState}));

  const getSubscribedEvents = () => pushEvents;

  // istanbul ignore next line
  const getDeviceToken = async () => {
    try {
      const [storedToken] = await promiseWrapper(getStoredToken());

      if (storedToken) return storedToken;

      const fcmToken = await getFCMToken();

      return fcmToken;
    } catch (error) {
      return null;
    }
  };

  /**
   * @function registerDeviceToNotifications
   * @description This function is responsible for registering the device to the notification microservice.
   * @returns {null}
   */

  const registerDeviceToNotifications = async (params) => {
    const {token = '', additionalInfo = null} = params;
    try {
      await SubscribeNotifications(
        {token, events: pushEvents, appName, additionalInfo},
        Request,
      );

      await updateStoredToken(token);
      return updateNotificationState({pushEvents});
    } catch (error) {
      updateNotificationState({pushEvents: [], subscribeError: error});
      return Promise.reject(error);
    }
  };

  /**
   * @function updateSuscription
   * @description This function is responsible for updating the subscription to the notification service
   * @param {object} additionalInfo all properties that will be sent as additional data in the subscription
   * @returns {Promise}
   */

  const updateSuscription = async (additionalInfo) => {
    try {
      const token = await getDeviceToken();

      await SubscribeNotifications(
        {token, events: pushEvents, appName, additionalInfo},
        Request,
      );

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  /**
   * @function cancelNotifications
   * @description This util is responsible for making the request to unsubscribe from all notification events. If no arguments are received, the request will be made with the previously registered events.
   * @param {Array<string>} events is the list of events to which I want to unsubscribe the device
   * @returns {Promise}
   * @deprecated Use cancelNotificationsSubscription from the main export instead
   *
   * @example
   *
   * import {usePushNotification} from '@janiscommerce/app-push-notification
   *
   * const {cancelNotifications} = usePushNotification()
   */

  const cancelNotifications = async (cancelEvents) => {
    console.warn(
      '⚠️ cancelNotifications is deprecated. Use cancelNotificationsSubscription instead.',
    );

    const eventsAreValid = cancelEvents && isArray(cancelEvents);
    const eventsToCancel = eventsAreValid ? cancelEvents : pushEvents;
    try {
      await cancelNotificationsSubscription({events: eventsToCancel}, Request);

      if (eventsAreValid) {
        const updatedEvents = pushEvents.filter(
          (e) => !eventsToCancel.includes(e),
        );

        return updateNotificationState({pushEvents: updatedEvents});
      }

      return updateNotificationState({pushEvents: []});
    } catch (unsubscribeError) {
      return Promise.reject(unsubscribeError);
    }
  };

  /**
   * @function deleteReceivedNotification
   * @description This utility allows you to reset the state corresponding to the type of notification received as an argument.
   * @param {string} notificationType the type of notification you want to delete, it can be a foreground or background notification
   * @returns {null}
   *
   * @example
   * import {usePushNotification} from '@janiscommerce/app-push-notification
   *
   * const {deleteReceivedNotification} = usePushNotification()
   *
   * const resetForegroundNotification = () => {
   *  deleteReceivedNotification('foreground')
   * }
   */

  const deleteReceivedNotification = (params = {}) => {
    const {type = ''} = params;
    const allowTypes = ['foreground', 'background'];
    const deleteNotification = {
      foreground: () => updateNotificationState({foregroundNotification: {}}),
      background: () => updateNotificationState({backgroundNotification: {}}),
    };

    if (!type || !allowTypes.includes(type)) return null;

    const restartNotification = deleteNotification[type];

    return restartNotification();
  };

  /**
   * @function addNewEvent
   * @description This function allows you to add a new event to receive notifications
   * @param {string} event
   */

  const addNewEvent = (event) => {
    if (!event || !isString(event)) return;
    if (pushEvents.includes(event)) return;

    const updatedEvents = [...pushEvents, event];
    updateNotificationState({pushEvents: updatedEvents});
  };

  return {
    foregroundNotification,
    backgroundNotification,
    subscribeError,
    cancelNotifications,
    addNewEvent,
    pushEvents,
    registerDeviceToNotifications,
    updateNotificationState,
    getSubscribedEvents,
    deleteReceivedNotification,
    updateSuscription,
  };
};

export default usePushNotification;
