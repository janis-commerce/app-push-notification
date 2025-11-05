import saveNotification from '../../utils/saveNotification';
import hasNotificationStore from '../../utils/hasNotificationStore';

/**
 * Stores a notification under a type, initializing storage when needed.
 *
 * If the store does not exist for the given type, it saves the notification
 * using the provided storageConfig (if any). Otherwise, it appends without
 * passing storageConfig.
 *
 * @param {{ type: string, notification: object, storageConfig?: object }} params - Store parameters.
 * @param {string} params.type - Storage key (notification type/channel).
 * @param {object} params.notification - Notification payload to store.
 * @param {object} [params.storageConfig] - Optional storage configuration for initialization.
 * @returns {void}
 */
const storeNotification = ({
  type = '',
  notification = {},
  storageConfig = {},
}) => {
  if (!hasNotificationStore(type)) {
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
