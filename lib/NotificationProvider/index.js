import React, {useEffect, useRef} from 'react';
import messaging from '@react-native-firebase/messaging';
import {NotificationContext} from '../NotificationContext';
import {
  isString,
  isArray,
  setupForegroundMessageHandler,
  setupNotificationOpenedHandler,
  isObject,
} from '../utils';
import usePushNotification from '../usePushNotification';
import {
  makeDefaultChannel,
  makeNotificationChannels,
  parseNotificationChannel,
} from '../utils/channel';

/**
 * @function NotificationProvider
 * @description It is the main component of the package, it is a HOC that is responsible for handling the logic of subscribing to notifications and receiving messages from the Firebase console. The HOC contains listeners to listen to notifications in the foreground and background, so (unless we cancel the subscription), we will receive notifications from the app even when it is closed.
 * @param {React.element} children Component that will be rendered within the HOC, and about which the notification will be displayed
 * @param {string} appName name of the aplication
 * @param {Array<string>} events is an array that will contain the events to which the user wants to subscribe
 * @param {string} environment The environment is necessary for the API that we are going to use to subscribe the device to notifications.
 * @param {object} additionalInfo fields to be sent as part of the body of the subscription request
 * @param {Array<string | object>} channelConfigs is the configuration that will be used to create new notification channels
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
  appName,
  events,
  environment,
  additionalInfo,
  channelConfigs = [],
  backgroundNotificationSound = 'default',
}) => {
  if (!children) return null;

  const validAppName = !!appName && isString(appName) ? appName : '';
  const validEnvironment =
    !!environment && isString(environment) ? environment : '';
  const validEvents = !!events && isArray(events) ? events : [];
  const validChannelConfigs =
    !!channelConfigs && isArray(channelConfigs) ? channelConfigs : [];

  const isRegistered = useRef(false);
  const {
    registerDeviceToNotifications,
    updateNotificationState,
    pushEvents,
    ...rest
  } = usePushNotification(
    validEnvironment,
    validEvents,
    validAppName,
    isRegistered,
    additionalInfo,
  );

  // @function handlerForegroundData
  // @description This function is responsible for updating the state corresponding to 'foregroundNotification' with the data it receives as an argument

  /* istanbul ignore next */
  const handlerForegroundData = (data) => {
    if (!data || !isObject(data)) return null;

    return updateNotificationState({foregroundNotification: data});
  };

  // @function handlerBackgroundData
  // @description This function is responsible for updating the state corresponding to 'backgroundNotification' with the data it receives as an argument

  /* istanbul ignore next */
  const handlerBackgroundData = (data) => {
    if (!data || !isObject(data)) return null;

    return updateNotificationState({backgroundNotification: data});
  };

  // @function handleAppOpeningByNotification
  // @description This function is responsible for saving the information of the notification that forced the opening of the app in the 'backgroundNotification' state

  /* istanbul ignore next */
  const handleAppOpeningByNotification = async () => {
    const data = await messaging().getInitialNotification();

    if (!data || !isObject(data)) return null;

    return updateNotificationState({backgroundNotification: data});
  };

  const createNotificationChannels = async () => {
    /* istanbul ignore else */
    if (validChannelConfigs) {
      const parsedChannelConfigs = validChannelConfigs
        ?.map((config) => parseNotificationChannel(config))
        .filter(Boolean);

      await makeNotificationChannels(parsedChannelConfigs);
    }
    await makeDefaultChannel({sound: backgroundNotificationSound});
  };

  useEffect(() => {
    const alreadySuscribed = isRegistered.current;
    if (environment && appName && !!pushEvents.length && !alreadySuscribed) {
      registerDeviceToNotifications();
    }
  }, [pushEvents]);

  useEffect(() => {
    createNotificationChannels();
  }, []);

  /* istanbul ignore next */
  useEffect(() => {
    const foregroundMessageHandler = setupForegroundMessageHandler(
      handlerForegroundData,
    );
    const backgroundMessageHandler = setupNotificationOpenedHandler(
      handlerBackgroundData,
    );
    handleAppOpeningByNotification();

    return () => {
      foregroundMessageHandler();
      backgroundMessageHandler();
    };
  }, []);

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
