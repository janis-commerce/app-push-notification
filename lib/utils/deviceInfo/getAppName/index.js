import {getApplicationName} from '@janiscommerce/app-device-info';

const getAppName = () => {
  const appName = getApplicationName();

  if (!appName) return '';

  if (appName.toLowerCase().includes('order')) return 'PickingApp';
  if (appName.toLowerCase().includes('delivery')) return 'DeliveryApp';

  return '';
};

export default getAppName;
