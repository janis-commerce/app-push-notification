import {
  getStoredNotification,
  removeOldestNotification,
  removeStoredNotification,
  hasNotificationStore,
  saveNotification,
  storeNotification,
  Storage,
} from '../../../lib/entities/Storage';

describe('Storage', () => {
  describe('getStoredNotification', () => {
    it('should return the stored notification', () => {
      Storage.get.mockReturnValueOnce([{type: 'test', messageId: '123'}]);

      const notification = getStoredNotification({
        type: 'test',
        messageId: '123',
      });
      expect(notification).toEqual({type: 'test', messageId: '123'});
    });

    it('should return an empty object if the stored notification is not found', () => {
      Storage.get.mockReturnValueOnce();

      const notification = getStoredNotification({
        type: 'test',
        messageId: '123',
      });
      expect(notification).toEqual({});
    });

    it('should return an empty object if the type is not provided', () => {
      const notification = getStoredNotification({
        messageId: '123',
      });
      expect(notification).toEqual({});
    });

    it('should return an empty object if the messageId does not match any stored notification', () => {
      Storage.get.mockReturnValueOnce([{type: 'test', messageId: '234'}]);

      const notification = getStoredNotification({
        type: 'test',
        messageId: '123',
      });
      expect(notification).toEqual({});
    });
  });

  describe('removeOldestNotification', () => {
    it('should remove the oldest notification', () => {
      Storage.get.mockReturnValueOnce([
        {type: 'test', messageId: '123'},
        {type: 'test', messageId: '234'},
      ]);

      removeOldestNotification('test');
      expect(Storage.get).toHaveBeenCalledWith('test');
      expect(Storage.set).toHaveBeenCalledWith('test', [
        {type: 'test', messageId: '234'},
      ]);
    });

    it('should return an empty object if the stored notification is not found', () => {
      Storage.get.mockReturnValueOnce();

      removeOldestNotification();
      expect(Storage.get).toHaveBeenCalledWith('');
      expect(Storage.set).not.toHaveBeenCalled();
    });
  });

  describe('removeStoredNotification', () => {
    it('should remove the stored notification', () => {
      Storage.get.mockReturnValueOnce([{type: 'test', messageId: '123'}]);

      removeStoredNotification({type: 'test', messageId: '123'});
      expect(Storage.get).toHaveBeenCalledWith('test');
      expect(Storage.set).toHaveBeenCalledWith('test', []);
    });

    it('should not remove the stored notification if the type is not provided', () => {
      removeStoredNotification({messageId: '123'});
      expect(Storage.get).not.toHaveBeenCalled();
      expect(Storage.set).not.toHaveBeenCalled();
    });

    it('should not remove the stored notification if the messageId is not provided', () => {
      removeStoredNotification({type: 'test'});
      expect(Storage.get).not.toHaveBeenCalled();
      expect(Storage.set).not.toHaveBeenCalled();
    });

    it('should not remove the stored notification if the stored notification is not found', () => {
      Storage.get.mockReturnValueOnce([{type: 'test', messageId: '234'}]);

      removeStoredNotification({type: 'test', messageId: '123'});
      expect(Storage.get).toHaveBeenCalledWith('test');
      expect(Storage.set).not.toHaveBeenCalled();
    });

    it('should not remove the stored notification if the stored notifications are not found', () => {
      Storage.get.mockReturnValueOnce();

      removeStoredNotification({type: 'test', messageId: '123'});
      expect(Storage.get).toHaveBeenCalledWith('test');
      expect(Storage.set).not.toHaveBeenCalled();
    });
  });

  describe('saveNotification', () => {
    it('should save the notification', () => {
      Storage.get.mockReturnValueOnce();

      saveNotification({type: 'test', notification: {messageId: '123'}});
      expect(Storage.get).toHaveBeenCalledWith('test');
      expect(Storage.set).toHaveBeenCalled();
    });

    it('should not save the notification if the type is not provided', () => {
      saveNotification({notification: {messageId: '123'}});
      expect(Storage.get).not.toHaveBeenCalled();
      expect(Storage.set).not.toHaveBeenCalled();
    });

    it('should not save the notification if the notification is not provided', () => {
      saveNotification({type: 'test'});
      expect(Storage.get).not.toHaveBeenCalled();
      expect(Storage.set).not.toHaveBeenCalled();
    });

    it('should not save the notification if the notification is not an object', () => {
      saveNotification({type: 'test', notification: '123'});
      expect(Storage.get).not.toHaveBeenCalled();
      expect(Storage.set).not.toHaveBeenCalled();
    });
  });

  describe('hasNotificationStore', () => {
    it('should return true if the notification store exists', () => {
      Storage.db.contains.mockReturnValueOnce(true);
      Storage.get.mockReturnValueOnce([{type: 'test', messageId: '123'}]);

      expect(hasNotificationStore('test')).toBe(true);
    });

    it('should return false if the notification store does not exist', () => {
      Storage.db.contains.mockReturnValueOnce(false);

      expect(hasNotificationStore('test')).toBe(false);
    });

    it('should return false if the type is not provided', () => {
      Storage.db.contains.mockReturnValueOnce(false);

      expect(hasNotificationStore()).toBe(false);
    });
  });

  describe('storeNotification', () => {
    it('should set storage config if the notification store does not exist', () => {
      Storage.db.contains.mockReturnValueOnce(false);

      storeNotification({
        type: 'test',
        notification: {messageId: '123'},
        storageConfig: {expiresAt: 123},
      });

      expect(Storage.set).toHaveBeenCalledWith('test', [{messageId: '123'}], {
        expiresAt: 123,
      });
    });

    it('should save the notification if the notification store exists', () => {
      Storage.db.contains.mockReturnValueOnce(true);
      Storage.get.mockReturnValueOnce([{type: 'test', messageId: '123'}]);

      storeNotification({type: 'test', notification: {messageId: '234'}});
      expect(Storage.get).toHaveBeenCalledWith('test');
      expect(Storage.set).toHaveBeenCalled();
    });

    it('should not save the notification if the notification is not provided', () => {
      storeNotification({});
      expect(Storage.get).not.toHaveBeenCalled();
      expect(Storage.set).not.toHaveBeenCalled();
    });
  });
});
