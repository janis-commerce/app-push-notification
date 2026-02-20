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

    it('should throw an error if the FCM token is null', async () => {
      mockGetToken.mockResolvedValueOnce(null);
      await expect(getFCMToken()).rejects.toThrow('FCM token is null');
    });

    it('should throw an error if getToken fails', async () => {
      mockGetToken.mockRejectedValueOnce(new Error('FCM token not available'));
      await expect(getFCMToken()).rejects.toThrow('FCM token not available');
    });
  });

  describe('getStoredToken', () => {
    it('should return the stored token', async () => {
      getItemSpy.mockResolvedValueOnce('testToken');
      const token = await getStoredToken();
      expect(token).toBe('testToken');
    });

    it('should return null if the stored token does not exist', async () => {
      getItemSpy.mockResolvedValueOnce(null);
      const token = await getStoredToken();
      expect(token).toBeNull();
    });

    it('should throw an error if AsyncStorage.getItem fails', async () => {
      getItemSpy.mockRejectedValueOnce(new Error('Storage error'));
      await expect(getStoredToken()).rejects.toThrow('Storage error');
    });
  });

  describe('updateStoredToken', () => {
    it('should update the stored token and return it', async () => {
      const token = await updateStoredToken('testToken');
      expect(token).toBe('testToken');
      expect(setItemSpy).toHaveBeenCalledWith('currentToken', 'testToken');
    });

    it('should return null if AsyncStorage.setItem fails', async () => {
      setItemSpy.mockRejectedValueOnce(new Error('Storage error'));
      const token = await updateStoredToken('testToken');
      expect(token).toBeNull();
    });
  });
});
