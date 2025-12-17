import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

// Helper function to format different error types
const formatMessage = (message) => {
  if (typeof message === 'string') return message;

  if (Array.isArray(message)) {
    return message
      .map((item) => {
        if (typeof item === 'string') return item;
        if (typeof item === 'object' && item.message) return item.message;
        return JSON.stringify(item);
      })
      .join(', ');
  }

  if (typeof message === 'object') {
    // Handle Apollo/GraphQL validation errors
    if (message.errors) {
      const values = Object.values(message.errors);
      return values.join(', ');
    }

    // If object with string values
    if (Object.values(message).every((val) => typeof val === 'string')) {
      const values = Object.values(message);
      return values.join(', ');
    }

    // Fallback: stringify the object
    return JSON.stringify(message);
  }

  return 'حدث خطأ غير معروف';
};

export const useNotification = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((notification) => notification.id !== id));
  }, []);

  const addNotification = useCallback(
    (
      type,
      message,
      title = type === 'success'
        ? 'نجاح'
        : type === 'error'
          ? 'خطأ'
          : type === 'warning'
            ? 'تحذير'
            : 'معلومة'
    ) => {
      const formattedMessage = formatMessage(message);
      const id = Date.now().toString();

      const newNotification = {
        id,
        type,
        title,
        message: formattedMessage,
        duration:
          type === 'success' ? 4000 : type === 'error' ? 6000 : type === 'warning' ? 5000 : 4000,
      };

      setNotifications((prev) => [...prev, newNotification]);

      // Auto remove after delay
      setTimeout(() => {
        removeNotification(id);
      }, newNotification.duration);

      return id;
    },
    [removeNotification]
  );

  const showSuccess = useCallback(
    (message, title) => {
      return addNotification('success', message, title);
    },
    [addNotification]
  );

  const showError = useCallback(
    (message, title) => {
      return addNotification('error', message, title);
    },
    [addNotification]
  );

  const showInfo = useCallback(
    (message, title) => {
      return addNotification('info', message, title);
    },
    [addNotification]
  );

  const showWarning = useCallback(
    (message, title) => {
      return addNotification('warning', message, title);
    },
    [addNotification]
  );

  const value = {
    notifications,
    showSuccess,
    showError,
    showInfo,
    showWarning,
    removeNotification,
  };

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
};
