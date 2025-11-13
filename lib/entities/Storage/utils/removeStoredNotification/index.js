import Storage from '../../instance';

/**
 * Removes a stored notification matching the given type and messageId.
 *
 * @param {{ type: string, messageId: string|number }} params - Removal parameters.
 * @param {string} params.type - Storage key (notification type/channel).
 * @param {string|number} params.messageId - Identifier of the notification to remove.
 * @returns {void}
 */
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
