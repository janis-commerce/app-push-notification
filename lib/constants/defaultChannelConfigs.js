import {AndroidImportance, AndroidVisibility} from '@notifee/react-native';

const DEFAULT_CHANNEL_CONFIGS = {
  badge: true,
  importance: AndroidImportance.HIGH,
  lights: true,
  sound: 'default',
  vibration: true,
  vibrationPattern: [500, 1000, 500, 1000],
  visibility: AndroidVisibility.PUBLIC,
};

export default DEFAULT_CHANNEL_CONFIGS;
