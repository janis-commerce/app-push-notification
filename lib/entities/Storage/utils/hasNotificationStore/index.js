import Storage from '../../instance';

/**
 * Checks whether there is an existing store entry for the given notification type.
 *
 * @param {string} notificationType - Storage key (notification type/channel).
 * @returns {boolean} True if the key exists and a value is set; otherwise false.
 */
const hasNotificationStore = (notificationType = '') => {
  if (!Storage.db.contains(notificationType)) return false;

  return !!Storage.get(notificationType);
};

export default hasNotificationStore;
