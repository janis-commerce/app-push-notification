import React, {useCallback, useEffect, useMemo} from 'react';
import messaging from '@react-native-firebase/messaging';
import {NotificationContext} from '../NotificationContext';
import {
  isFunction,
  setupForegroundMessageHandler,
  setupNotificationOpenedHandler,
  isObject,
  prepareEventsToSubscribe,
} from '../utils';
import usePushNotification from '../usePushNotification';
import createNotificationChannels from '../utils/channel/createNotificationChannels';
import {getFCMToken, getStoredToken} from '../utils/token';

/**
 * @function NotificationProvider
 * @description It is the main component of the package, it is a HOC that is responsible for handling the logic of subscribing to notifications and receiving messages from the Firebase console. The HOC contains listeners to listen to notifications in the foreground and background, so (unless we cancel the subscription), we will receive notifications from the app even when it is closed.
 * @param {React.element} children Component that will be rendered within the HOC, and about which the notification will be displayed
 * @param {string} environment The environment is necessary for the API that we are going to use to subscribe the device to notifications.
 * @param {object} additionalInfo fields to be sent as part of the body of the subscription request
 * @param {Array<string | object>} channelConfigs is the configuration that will be used to create new notification channels
 * @param {string} backgroundNotificationSound is the sound that will be played when the app is in the background
 * @param {function} onSubscriptionError is a callback that will be called when the subscription fails
 * @throws null when not receive a children argument
 * @returns {null | React.element}
 * @example
 *
 * import NotificationProvider from '@janiscommerce/app-push-notification'
 *
 * return (
 *  <NotificationProvider
 *    appName='pickingApp'
 *    events={["picking:session:created","picking:session:assigned"]}
 *    environment='beta'
 *    >
 *    <MyComponent/>
 *  </NotificationProvider>
 * )
 */

const NotificationProvider = ({
  children,
  events,
  backgroundNotificationSound,
  onSubscriptionError,
  additionalInfo = {},
  channelConfigs = [],
}) => {
  if (!children) return null;

  const parsedEvents = useMemo(
    () => prepareEventsToSubscribe(events),
    [events],
  );

  const {
    registerDeviceToNotifications,
    updateNotificationState,
    pushEvents,
    ...rest
  } = usePushNotification(parsedEvents);

  const SubscribeToNotifications = async () => {
    try {
      const storedToken = await getStoredToken();
      const fcmToken = await getFCMToken();
      const isSameToken = storedToken === fcmToken;

      if (Boolean(storedToken) && isSameToken) return;

      await registerDeviceToNotifications({token: fcmToken, additionalInfo});
    } catch (error) {
      // istanbul ignore next
      if (isFunction(onSubscriptionError)) onSubscriptionError(error);
    }
  };

  // istanbul ignore next
  const handleForegroundMessage = useCallback(
    (message) => {
      if (!isObject(message)) return;
      updateNotificationState({foregroundNotification: message});
    },
    [updateNotificationState],
  );
  // istanbul ignore next
  const handleOpenedNotification = useCallback(
    (message) => {
      if (!isObject(message)) return;
      updateNotificationState({backgroundNotification: message});
    },
    [updateNotificationState],
  );

  useEffect(() => {
    if (parsedEvents.length) {
      SubscribeToNotifications();
    }

    createNotificationChannels({
      channelConfigs,
      defaultSound: backgroundNotificationSound,
    });
  }, []);

  // close state
  // istanbul ignore next
  useEffect(() => {
    const handleOpeningByNotification = async () => {
      const data = await messaging().getInitialNotification();
      if (!isObject(data)) return;
      updateNotificationState({backgroundNotification: data});
    };

    handleOpeningByNotification();
  }, [updateNotificationState]);

  // Foreground
  // istanbul ignore next
  useEffect(() => {
    const unsubscribe = setupForegroundMessageHandler(handleForegroundMessage);
    return unsubscribe;
  }, [handleForegroundMessage]);

  // open from background
  // istanbul ignore next
  useEffect(() => {
    const unsubscribe = setupNotificationOpenedHandler(
      handleOpenedNotification,
    );
    return unsubscribe;
  }, [handleOpenedNotification]);

  const contextValues = {
    ...rest,
  };

  return (
    <NotificationContext.Provider value={contextValues}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
