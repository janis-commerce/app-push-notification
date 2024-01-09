import React from 'react';

export const NotificationContext = React.createContext(null);

/**
 * @function useNotification
 * @description is a hook, which returns the elements contained within the notifications context. Returns an object containing:
 * | name | description |
 *  |----------|----------|
 *  | deviceToken  | is the token linked to the device, which we use to subscribe it to notifications. |
 * @returns {object}
 * @example
 * import {useNotification} from '@janiscommerce/app-push-notification'
 * 
 * const {} = useNotification()
 */

export const useNotification = () => React.useContext(NotificationContext);
