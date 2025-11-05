import Storage from '../../singleton';
import {isObject} from '../../../../utils';

const saveNotification = ({type = '', notification = {}, storageConfig}) => {
  if (!type || !isObject(notification) || !Object?.keys(notification).length)
    return;

  const storedNotifications = Storage.get(type) || [];
  const notifications = [...storedNotifications, notification];

  Storage.set(type, notifications, storageConfig);
};

export default saveNotification;
