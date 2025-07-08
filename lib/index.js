import NotificationProvider from './NotificationProvider';
import {usePushNotification} from './NotificationContext';
import {setupBackgroundMessageHandler} from './utils';
import cancelNotificationsSubscription from './utils/api/cancelNotificationsSubscription';

export {
  usePushNotification,
  setupBackgroundMessageHandler,
  cancelNotificationsSubscription,
};
export default NotificationProvider;
