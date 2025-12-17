import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const Notification = ({ notification, onClose }) => {
  const slideAnim = useRef(new Animated.Value(-100)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Slide in and fade in animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const getNotificationColors = () => {
    switch (notification.type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          icon: 'checkmark-circle',
          iconColor: '#10B981',
          titleColor: 'text-green-800',
          textColor: 'text-green-700',
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: 'close-circle',
          iconColor: '#EF4444',
          titleColor: 'text-red-800',
          textColor: 'text-red-700',
        };
      case 'warning':
        return {
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: 'warning',
          iconColor: '#F59E0B',
          titleColor: 'text-yellow-800',
          textColor: 'text-yellow-700',
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          icon: 'information-circle',
          iconColor: '#3B82F6',
          titleColor: 'text-blue-800',
          textColor: 'text-blue-700',
        };
    }
  };

  const colors = getNotificationColors();

  const handleClose = () => {
    // Slide out and fade out animation
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  return (
    <Animated.View
      style={{
        transform: [{ translateY: slideAnim }],
        opacity: fadeAnim,
      }}
      className={`${colors.bg} ${colors.border} border-l-4 border-l-[${
        colors.iconColor
      }] mx-4 mb-3 rounded-lg shadow-lg`}>
      <View className="p-4">
        <View className="flex-row items-start">
          <Ionicons
            name={colors.icon}
            size={24}
            color={colors.iconColor}
            style={{ marginTop: 2 }}
          />

          <View className="mr-3 flex-1">
            <Text className={`mb-1 text-base font-bold ${colors.titleColor}`}>
              {notification.title}
            </Text>
            <Text className={`text-sm ${colors.textColor}`}>{notification.message}</Text>
          </View>

          <TouchableOpacity onPress={handleClose} className="p-1">
            <Ionicons name="close" size={20} color="#6B7280" />
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  );
};

export default Notification;
