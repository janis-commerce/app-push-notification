import React from 'react';

export const NotificationContext = React.createContext(null);

/**
 * @function useNotification
 * @description is a hook, which returns the elements contained within the notifications context. Returns an object containing:
 *
 *  @returns {object}
 *  @example
 * import {useNotification} from '@janiscommerce/app-push-notification'
 * 
 * const {deviceToken} = useNotification()
 */
/***
 * 
 */

export const useNotification = () => React.useContext(NotificationContext);
