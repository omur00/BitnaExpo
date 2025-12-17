import React from 'react';
import { View } from 'react-native';
import Notification from './Notification';
import { useNotification } from '@/context/notification-context';

const NotificationContainer = () => {
  const { notifications, removeNotification } = useNotification();

  if (notifications.length === 0) return null;

  return (
    <>
      <View className="absolute left-0 right-0 top-0 z-50 pt-10">
        {notifications.map((notification) => (
          <Notification
            key={notification.id}
            notification={notification}
            onClose={() => removeNotification(notification.id)}
          />
        ))}
      </View>
    </>
  );
};

export default NotificationContainer;
