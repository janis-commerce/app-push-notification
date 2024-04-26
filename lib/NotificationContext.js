import React from 'react';

export const NotificationContext = React.createContext(null);

/** *
 * @function setupBackgroundMessageHandler
 * @description This function is responsible for handling any callbacks from Firebase cloud messaging in the background or with the application closed
 * @param {Function} callback is the function that will receive the payload and render it as appropriate
 */

/**
 * @function usePushNotification
 * @description is a hook, which returns the elements contained within the notifications context. Returns an object containing:
 * | name | description |
 *  |----------|----------|
 *  | deviceToken | Is the token linked to the device, which we use to subscribe it to notifications. |
 *  | foregroundNotification | An object containing all data received when a foreground push notification is triggered. |
 *  | backgroundNotification | An object containing all data received when a background push notification is triggered. |
 *  | subscribeError | An object containing all data received from a notification service subscription failure. |
 *  | cancelNotifications | This util is responsible for making the request to unsubscribe from all notification events. If no arguments are received, the request will be made with the previously registered events. |
 *  | addNewEvent | This function allows you to add a new event to receive notifications. |
 *  | getSubscribedEvents | This function returns an array with the events to which the user is subscribed. |
 * @returns {object}
 * @example
 * import {usePushNotification} from '@janiscommerce/app-push-notification'
 *
 * const { deviceToken, foregroundNotification, backgroundNotification} = usePushNotification()
 */

export const usePushNotification = () => React.useContext(NotificationContext);
