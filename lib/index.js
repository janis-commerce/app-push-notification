import NotificationProvider from './NotificationProvider';
import {usePushNotification} from './NotificationContext';
import {setupBackgroundMessageHandler} from './utils';
import cancelNotificationsSuscription from './utils/api/cancelNotificationsSuscription';

export {
  usePushNotification,
  setupBackgroundMessageHandler,
  cancelNotificationsSuscription,
};
export default NotificationProvider;
