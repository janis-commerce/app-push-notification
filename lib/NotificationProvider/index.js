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

    return setDeviceToken(fcmToken);
  };

  // eslint-disable-next-line
  const registerDevice = async () => {
    getDeviceToken();

    if (!deviceToken) return null;
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
