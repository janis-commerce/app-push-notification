import Storage from '../../singleton';

const removeStoredNotification = ({type = '', messageId = ''}) => {
  if (!type || !messageId) return;

  const storedNotifications = Storage.get(type) || [];

  if (!storedNotifications?.length) return;

  const notificationIndex = storedNotifications?.findIndex(
    (notification) => notification.messageId === messageId,
  );

  if (notificationIndex < 0) return;

  storedNotifications.splice(notificationIndex, 1);

  Storage.set(type, storedNotifications);
};

export default removeStoredNotification;
