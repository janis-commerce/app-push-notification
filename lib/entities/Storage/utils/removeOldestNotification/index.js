import Storage from '../../instance';

/**
 * Removes the oldest (first) stored notification for a given event/type.
 *
 * @param {string} notificationEvent - Storage key (notification type/event).
 * @returns {void}
 */
const removeOldestNotification = (notificationEvent = '') => {
  const storedNotifications = Storage.get(notificationEvent) || [];

  if (!storedNotifications?.length) return;

  storedNotifications.shift();

  Storage.set(notificationEvent, storedNotifications);
};

export default removeOldestNotification;
