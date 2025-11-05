import {Storage} from '../../../lib/entities/Storage/index';
import {
  setupBackgroundMessageHandler,
  setupForegroundMessageHandler,
  setupNotificationOpenedHandler,
} from '../../../lib/utils/notificationHandlers';

const fakeRemoteMessage = {data: {event: 'test'}};

const mockGetToken = jest.fn();
const mockOnMessage = jest.fn();
const mockBackgroundMessageHandler = jest.fn();
const mockOnNotificationOpenedApp = jest.fn();
const mockHasPermission = jest.fn();

jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getMessaging: jest.fn(),
    getToken: mockGetToken,
    onMessage: mockOnMessage,
    setBackgroundMessageHandler: mockBackgroundMessageHandler,
    onNotificationOpenedApp: mockOnNotificationOpenedApp,
    hasPermission: mockHasPermission,
  })),
}));

describe('message handlers utils', () => {
  describe('setupForegroundMessageHandler provides the listener with foreground notifications', () => {
    it('returns the listener and call the function when this is listened', () => {
      const mockCallback = jest.fn();
      setupForegroundMessageHandler(mockCallback);

      mockOnMessage.mock.calls[0][0](fakeRemoteMessage);

      expect(mockOnMessage).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(fakeRemoteMessage);
    });
  });

  describe('setupBackgroundMessageHandler provides the listener with background notifications', () => {
    it('calls setBackgroundMessageHandler with remoteMessage', () => {
      const mockCallback = jest.fn();
      setupBackgroundMessageHandler(mockCallback);

      mockBackgroundMessageHandler.mock.calls[0][0]();

      expect(mockBackgroundMessageHandler).toHaveBeenCalledTimes(1);
    });
    it('calls setBackgroundMessageHandler with remoteMessage', () => {
      setupBackgroundMessageHandler();

      mockBackgroundMessageHandler.mock.calls[0][0](fakeRemoteMessage);

      expect(mockBackgroundMessageHandler).toHaveBeenCalledTimes(1);
    });

    it('removes the oldest notification if the stored quantity is greater than the max storage quantity', () => {
      Storage.get.mockReturnValueOnce([
        {type: 'test', messageId: '123'},
        {type: 'test', messageId: '234'},
      ]);

      setupBackgroundMessageHandler({test: {maxStorageQuantity: 1}});

      mockBackgroundMessageHandler.mock.calls[0][0](fakeRemoteMessage);

      expect(mockBackgroundMessageHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('setupNotificationOpenedHandler provides the listener that listens for the opening of the app from the background through a notification', () => {
    it('calls setBackgroundMessageHandler with remoteMessage', () => {
      const mockCallback = jest.fn();
      setupNotificationOpenedHandler(mockCallback);

      mockOnNotificationOpenedApp.mock.calls[0][0](fakeRemoteMessage);

      expect(mockOnNotificationOpenedApp).toHaveBeenCalledTimes(1);
      expect(mockCallback).toHaveBeenCalledWith(fakeRemoteMessage);
    });

    it('calls setBackgroundMessageHandler with remoteMessage', () => {
      const mockCallback = jest.fn();
      setupNotificationOpenedHandler(mockCallback);

      mockOnNotificationOpenedApp.mock.calls[0][0]();

      expect(mockOnNotificationOpenedApp).toHaveBeenCalledTimes(1);
    });
  });
});
