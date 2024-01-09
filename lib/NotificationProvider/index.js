import React, {useEffect, useState} from 'react';
import {NotificationContext} from '../NotificationContext';
import {
  getFCMToken,
  setupBackgroundMessageHandler,
  setupForegroundMessageHandler,
  DefaultAlert,
  isFunction,
  isString,
  isObject,
  isArray,
  topicsSubscription,
} from '../utils';

/**
 * @function NotificationProvider
 * @description It is the main component of the package, it is a HOC that is responsible for handling the logic of subscribing to notifications and receiving messages from the Firebase console. The HOC contains listeners to listen to notifications in the foreground and background, so (unless we cancel the subscription), we will receive notifications from the app even when it is closed. 
 * @param {React.element} children Component that will be rendered within the HOC, and about which the notification will be displayed
 * @param {function} foregroundCallback function that will be executed when a foreground notification is received.
 * @param {function} backgroundCallback function that will be executed when a background notification is received.
 * @param {object} config It is an object that contains the user's data, which will be used to subscribe the user to notifications.
 * @param {string} config.appName name of the aplication
 * @param {string} config.accessToken accessToken provided by janis
 * @param {string} config.client client provided by janis
 * @param {Array<string>} events is an array that will contain the events to which the user wants to subscribe
 * @param {string} environment The environment is necessary for the API that we are going to use to subscribe the device to notifications.
 * @throws null when not receive a children argument
 * @returns {null | React.element}
 * @example
 * 
 * import NotificationProvider from '@janiscommerce/app-push-notification'
 * 
 * 
 * //...
 * 
 * const foregroundCallback = (remoteMessage) => console.log('a new FCM:',remoteMessage)
 * const backgrounCallback = (remoteMessage) => {
 *  console.log('a new FCM was received in background', remoteMessage)
 * }
 * 
 * return (
 *  <NotificationProvider 
 *    foregroundCallback={foregroundCallback}
 *    backgroundCallback={backgroundCallback}
 *    config={client:'fizzmod', accessToken:'access_token_push', appName:'janisAppName'}
 *    events={['Notification','events','janis']}
 *    environment='beta'
 *    >
 *    <MyComponent/>
 *  </NotificationProvider>
 * )
 */

const NotificationProvider = ({
  children,
  foregroundCallback,
  backgroundCallback,
  config,
  events,
  environment,
}) => {
  if (!children) return null;

  const [deviceToken, setDeviceToken] = useState(null);
  const validForegroundCallback = isFunction(foregroundCallback)
    ? foregroundCallback
    : DefaultAlert;
  const validBackgroundCallback = isFunction(backgroundCallback)
    ? backgroundCallback
    : /* istanbul ignore next */ (remoteMessage) => remoteMessage;
  const validConfig = config && isObject(config) ? config : {};
  const validEvents = events && isArray(events) ? events : [];

  // eslint-disable-next-line no-unused-vars
  const parsedConfig = {...validConfig, environment, events: validEvents};

  const getDeviceToken = async () => {
    const fcmToken = await getFCMToken();
    if (!fcmToken || !isString(fcmToken)) return null;

    setDeviceToken(fcmToken)
    return fcmToken;
  };

  // eslint-disable-next-line
  const registerDevice = async () => {
    const newDeviceToken = await getDeviceToken();

    if (!newDeviceToken) return null;
    // eslint-disable-next-line
    validEvents.forEach(async (event) => {
      if (!event || !isString(event)) return null;
      await topicsSubscription(event);
    });
  };

  useEffect(() => {
    registerDevice();
    const foregroundMessageHandler = setupForegroundMessageHandler(
      validForegroundCallback,
    );

    return () => {
      foregroundMessageHandler();
      setupBackgroundMessageHandler(validBackgroundCallback);
    };
  }, []);

  return (
    <NotificationContext.Provider value={{deviceToken}}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;
