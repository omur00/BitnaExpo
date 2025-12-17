import { Stack, useNavigation } from 'expo-router';
import React from 'react';
import { Image, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import logo from '@/assets/logo.png';
import { DrawerActions } from '@react-navigation/native';

function DashboardLayout() {
  const nav = useNavigation();
  return (
    <Stack
      screenOptions={({ navigation, route }) => ({
        headerShown: true,
        headerLeft: () => {
          if (route.name !== 'index') {
            return (
              <TouchableOpacity onPress={navigation.goBack} style={{ marginRight: 15 }}>
                <Ionicons name="arrow-forward" size={24} color="black" />
              </TouchableOpacity>
            );
          }

          return (
            <TouchableOpacity
              onPress={() => nav.dispatch(DrawerActions.openDrawer())}
              style={{ marginRight: 15 }}>
              <Ionicons name="menu" size={24} color="black" />
            </TouchableOpacity>
          );
        },
      })}>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'اللوحة الشخصية',
          headerRight: () => (
            <Image
              source={logo}
              style={{
                width: 30,
                height: 30,
                resizeMode: 'contain',
              }}
            />
          ),
        }}
      />
      <Stack.Screen
        name="edit"
        options={{
          headerTitle: 'تحديث البيانات',
        }}
      />
      <Stack.Screen
        name="profile"
        options={{
          headerTitle: 'تعديل البيانات الشخصية',
        }}
      />
    </Stack>
  );
}

export default DashboardLayout;
