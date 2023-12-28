import React from 'react';

export const NotificationContext = React.createContext(null);

export const useNotification = () => React.useContext(NotificationContext);
