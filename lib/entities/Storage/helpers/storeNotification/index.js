import saveNotification from '../../utils/saveNotification';
import hasNotificationStore from '../../utils/hasNotificationStore';

const storeNotification = ({
  type = '',
  notification = {},
  storageConfig = {},
}) => {
  if (!hasNotificationStore(type)) {
    console.log('storageConfig', storageConfig);
    saveNotification({
      type,
      notification,
      storageConfig,
    });
    return;
  }
  saveNotification({type, notification});
};

export default storeNotification;
