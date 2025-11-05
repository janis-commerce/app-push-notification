import Storage from '../../singleton';

const hasNotificationStore = (notificationType = '') => {
  if (!Storage.db.contains(notificationType)) return false;

  return !!Storage.get(notificationType);
};

export default hasNotificationStore;
