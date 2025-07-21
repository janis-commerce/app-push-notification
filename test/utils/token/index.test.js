import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getFCMToken,
  getStoredToken,
  updateStoredToken,
} from '../../../lib/utils/token';

const mockGetToken = jest.fn();
jest.mock('@react-native-firebase/messaging', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    getToken: mockGetToken,
  })),
}));

const getItemSpy = jest.spyOn(AsyncStorage, 'getItem');
const setItemSpy = jest.spyOn(AsyncStorage, 'setItem');

describe('Token utils', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getFCMToken', () => {
    it('should return the FCM token', async () => {
      mockGetToken.mockResolvedValueOnce('testToken');
      const token = await getFCMToken();
      expect(token).toBe('testToken');
    });

    it('should return null if the FCM token is not available', async () => {
      mockGetToken.mockRejectedValueOnce(new Error('FCM token not available'));
      const token = await getFCMToken();
      expect(token).toBeNull();
    });
  });

  describe('getStoredToken', () => {
    it('should return the stored token', async () => {
      getItemSpy.mockResolvedValueOnce('testToken');
      const token = await getStoredToken();
      expect(token).toBe('testToken');
    });

    it('should return null if the stored token is not available', async () => {
      getItemSpy.mockRejectedValueOnce(new Error('Stored token not available'));
      const token = await getStoredToken();
      expect(token).toBeNull();
    });
  });

  describe('updateStoredToken', () => {
    it('should update the stored token', async () => {
      const token = await updateStoredToken('testToken');
      expect(token).toBeDefined();
      expect(setItemSpy).toHaveBeenCalledWith('currentToken', 'testToken');
    });

    it('should return null if the stored token is not available', async () => {
      setItemSpy.mockRejectedValueOnce(new Error('Stored token not available'));
      const token = await updateStoredToken('testToken');
      expect(token).toBeNull();
    });
  });
});
