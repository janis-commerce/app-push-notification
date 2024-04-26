import React from 'react';
import {renderHook} from '@testing-library/react-native';
import {
  NotificationContext,
  usePushNotification,
} from '../lib/NotificationContext';

describe('usePushNotification', () => {
  it('must be a function', () => {
    expect(typeof usePushNotification).toBe('function');
  });

  it('must use notifications context', () => {
    jest.spyOn(React, 'useContext');
    renderHook(() => usePushNotification());

    expect(React.useContext).toHaveBeenCalledWith(NotificationContext);
  });

  it('must return an object', () => {
    const {result} = renderHook(() => usePushNotification());

    expect(typeof result.current).toBe('object');
  });
});
