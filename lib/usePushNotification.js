import {useCallback, useState} from 'react';
import RequestInstance from '@janiscommerce/app-request';
import {getFCMToken, isArray, isString} from './utils';
import SubscribeNotifications from './utils/api/SubscribeNotifications';
import UnSubscribeNotifications from './utils/api/UnSubscribeNotifications';

const usePushNotification = (environment, events, appName, isRegistered) => {
  const [notificationState, setNotificationState] = useState({
    deviceToken: null,
    foregroundNotification: {},
    backgroundNotification: {},
    pushEvents: events,
    subscribeError: {},
  });

  const {
    deviceToken,
    foregroundNotification,
    backgroundNotification,
    pushEvents,
    subscribeError,
  } = notificationState;

  const Request = new RequestInstance({JANIS_ENV: environment});

  const updateNotificationState = (state) =>
    setNotificationState({...notificationState, ...state});

  const getSubscribedEvents = () => pushEvents;

  const getDeviceToken = async () => {
    if (deviceToken) return deviceToken;

    const fcmToken = await getFCMToken();
    if (!fcmToken || !isString(fcmToken)) return null;

    return fcmToken;
  };

  /**
   * @function registerDeviceToNotifications
   * @description This function is responsible for registering the device to the notification microservice.
   * @returns {null}
   */

  const registerDeviceToNotifications = useCallback(async () => {
    const token = await getDeviceToken();

    if (!token) return null;

    try {
      await SubscribeNotifications({
        appName,
        events: pushEvents,
        deviceToken: token,
        request: Request,
      });

      isRegistered.current = true;
      return updateNotificationState({deviceToken: token, pushEvents});
    } catch (error) {
      return updateNotificationState({pushEvents: [], subscribeError: error});
    }
  }, [pushEvents]);

  /**
   * @function cancelNotifications
   * @description This util is responsible for making the request to unsubscribe from all notification events. If no arguments are received, the request will be made with the previously registered events.
   * @param {Array<string>} events is the list of events to which I want to unsubscribe the device
   * @returns {Promise}
   *
   * @example
   *
   * import {usePushNotification} from '@janiscommerce/app-push-notification
   *
   * const {cancelNotifications} = usePushNotification()
   */

  const cancelNotifications = async (cancelEvents) => {
    const eventsAreValid = cancelEvents && isArray(cancelEvents);
    const eventsToCancel = eventsAreValid ? cancelEvents : pushEvents;
    try {
      await UnSubscribeNotifications({
        events: eventsToCancel,
        request: Request,
      });

      if (eventsAreValid) {
        const updatedEvents = pushEvents.filter(
          (e) => !eventsToCancel.includes(e),
        );

        isRegistered.current = true;
        return updateNotificationState({pushEvents: updatedEvents});
      }

      isRegistered.current = false;
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
    const {type = ''} = params
    const allowTypes = ['foreground','background']
    const deleteNotification = {
      foreground: () => updateNotificationState({foregroundNotification:{}}),
      background: () => updateNotificationState({backgroundNotification:{}})
    }

    if(!type || !allowTypes.includes(type)) return null;

    const restartNotification = deleteNotification[type]
    
    return restartNotification()
  }

  /**
   * @function addNewEvent
   * @description This function allows you to add a new event to receive notifications
   * @param {string} event
   */

  const addNewEvent = (event) => {
    if (!event || !isString(event)) return null;
    if (pushEvents.includes(event)) {
      return null;
    }

    const updatedEvents = [...pushEvents, event];
    isRegistered.current = false;
    return updateNotificationState({pushEvents: updatedEvents});
  };

  return {
    deviceToken,
    foregroundNotification,
    backgroundNotification,
    subscribeError,
    cancelNotifications,
    addNewEvent,
    pushEvents,
    registerDeviceToNotifications,
    updateNotificationState,
    getSubscribedEvents,
    deleteReceivedNotification
  };
};

export default usePushNotification;
