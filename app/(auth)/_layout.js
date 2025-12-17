import { Ionicons } from '@expo/vector-icons';
import { Stack, useNavigation } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import logo from '@/assets/logo.png';

export default function AuthLayout() {
  const nav = useNavigation();

  return (
    <>
      <Stack
        screenOptions={() => ({
          headerShown: false,
        })}>
        <Stack.Screen
          name="dashboard"
          options={{
            headerTitle: 'اللوحة الشخصية',
          }}
        />
      </Stack>
    </>
  );
}
