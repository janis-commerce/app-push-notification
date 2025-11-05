import Storage from '../../singleton';

const getStoredNotification = ({type = '', messageId}) => {
  if (!type) return {};

  const storedNotifications = Storage.get(type) || [];

  if (!storedNotifications?.length) return {};

  const foundNotification = storedNotifications.find(
    (notification) => notification.messageId === messageId,
  );

  return foundNotification || {};
};

export default getStoredNotification;
