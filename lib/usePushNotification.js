import {useState, useCallback} from 'react';
import SubscribeNotifications from './utils/api/SubscribeNotifications';
import {getDeviceFCMToken} from './utils/deviceInfo';
import {updateStoredToken} from './utils/token';

const usePushNotification = (events) => {
  const [notificationState, setNotificationState] = useState({
    foregroundNotification: {},
    backgroundNotification: {},
    pushEvents: events,
  });

  const {foregroundNotification, backgroundNotification, pushEvents} =
    notificationState;

  // istanbul ignore next line
  const updateNotificationState = useCallback(
    (updateState) =>
      setNotificationState((prevState) => ({...prevState, ...updateState})),
    [],
  );

  const getSubscribedEvents = () => pushEvents;

  /**
   * @function registerDeviceToNotifications
   * @description This function is responsible for registering the device to the notification microservice.
   * @returns {null}
   */

  const registerDeviceToNotifications = async (params) => {
    const {additionalInfo, token = ''} = params;
    try {
      await SubscribeNotifications({token, events: pushEvents, additionalInfo});

      await updateStoredToken(token);
      return updateNotificationState({pushEvents});
    } catch (error) {
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
      const token = await getDeviceFCMToken();

      await SubscribeNotifications({token, events: pushEvents, additionalInfo});

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
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

  const deleteReceivedNotification = ({type = ''} = {}) => {
    const allowTypes = ['foreground', 'background'];
    const deleteNotification = {
      foreground: () => updateNotificationState({foregroundNotification: {}}),
      background: () => updateNotificationState({backgroundNotification: {}}),
    };

    if (!allowTypes.includes(type)) return null;

    return deleteNotification[type]();
  };

  return {
    foregroundNotification,
    backgroundNotification,
    pushEvents,
    registerDeviceToNotifications,
    updateNotificationState,
    getSubscribedEvents,
    deleteReceivedNotification,
    updateSuscription,
  };
};

export default usePushNotification;
