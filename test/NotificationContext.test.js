import React from 'react';
import {renderHook} from '@testing-library/react-native';
import {
  NotificationContext,
  useNotification,
} from '../lib/NotificationContext';

describe('useNotification', () => {
  it('must be a function', () => {
    expect(typeof useNotification).toBe('function');
  });

  it('must use notifications context', () => {
    jest.spyOn(React, 'useContext');
    renderHook(() => useNotification());

    expect(React.useContext).toBeCalledWith(NotificationContext);
  });

  it('must return an object', () => {
    const {result} = renderHook(() => useNotification());

    expect(typeof result.current).toBe('object');
  });
});
