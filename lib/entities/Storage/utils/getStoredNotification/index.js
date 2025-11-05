import Storage from '../../singleton';

/**
 * Retrieves a stored notification by type and messageId.
 *
 * @param {{ type: string, messageId: string|number }} params - Query parameters.
 * @param {string} params.type - Storage key (notification type/channel).
 * @param {string|number} params.messageId - Unique identifier of the notification.
 * @returns {object} The found notification object, or an empty object when not found.
 */
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
