import NotificationProvider from './NotificationProvider';
import {usePushNotification} from './NotificationContext';
import {setupBackgroundMessageHandler} from './utils';
import cancelNotificationsSubscription from './utils/api/cancelNotificationsSubscription';
import setUpdateSubscriptionByTokenRefresh from './utils/api/setUpdateSubscriptionByTokenRefresh';

export {
  usePushNotification,
  setupBackgroundMessageHandler,
  cancelNotificationsSubscription,
  setUpdateSubscriptionByTokenRefresh,
};
export default NotificationProvider;
