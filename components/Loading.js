import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import logo from '@/assets/logo.png';

export default function Loading() {
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  const rotate = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View className="flex min-h-screen flex-col items-center justify-center">
      <Animated.Image
        source={logo}
        style={{
          width: 50,
          height: 50,
          transform: [{ rotate }],
        }}
        resizeMode="contain"
      />
    </View>
  );
}
