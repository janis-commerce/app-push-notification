import NotificationProvider from './NotificationProvider';
import {usePushNotification} from './NotificationContext';
import {setupBackgroundMessageHandler} from './utils';
import cancelNotificationSuscription from './utils/api/cancelNotificationsSuscription';

export {
  usePushNotification,
  setupBackgroundMessageHandler,
  cancelNotificationSuscription,
};
export default NotificationProvider;
