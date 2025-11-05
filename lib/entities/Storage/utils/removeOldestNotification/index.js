import Storage from '../../singleton';

const removeOldestNotification = (notificationEvent = '') => {
  const storedNotifications = Storage.get(notificationEvent) || [];

  if (!storedNotifications?.length) return;

  storedNotifications.shift();

  Storage.set(notificationEvent, storedNotifications);
};

export default removeOldestNotification;
