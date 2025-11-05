import Storage from '../../singleton';
import {isObject} from '../../../../utils';

/**
 * Appends a notification to the stored list for a given type.
 *
 * When a storageConfig is provided, it will be forwarded to the underlying
 * storage set operation.
 *
 * @param {{ type: string, notification: object, storageConfig?: object }} params - Save parameters.
 * @param {string} params.type - Storage key (notification type/channel).
 * @param {object} params.notification - Notification payload to store.
 * @param {object} [params.storageConfig] - Optional storage configuration.
 * @returns {void}
 */
const saveNotification = ({type = '', notification = {}, storageConfig}) => {
  if (!type || !isObject(notification) || !Object?.keys(notification).length)
    return;

  const storedNotifications = Storage.get(type) || [];
  const notifications = [...storedNotifications, notification];

  Storage.set(type, notifications, storageConfig);
};

export default saveNotification;
