import React from 'react';
import { Stack, useNavigation } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { DrawerActions } from '@react-navigation/native';
import { Image, TouchableOpacity } from 'react-native';
import logo from '@/assets/logo.png';

const StacksLayout = () => {
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
      {/* Home Screen */}
      <Stack.Screen
        name="index"
        options={{
          headerTitle: 'لوحة تحكم المشرف',
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
        name="merchantReq"
        options={{
          headerTitle: 'إدارة طلبات التجار',
        }}
      />

      <Stack.Screen
        name="trainerReq"
        options={{
          headerTitle: 'إدارة طلبات المدربين',
        }}
      />

      <Stack.Screen
        name="users"
        options={{
          headerTitle: 'إجمالي المستخدمين',
        }}
      />

      <Stack.Screen
        name="user/[id]"
        options={{
          headerTitle: 'طلب تسجيل',
        }}
      />

      <Stack.Screen
        name="generateRestEmails"
        options={{
          headerTitle: 'مولد إعادة كلمة المرور',
        }}
      />

      <Stack.Screen
        name="categories"
        options={{
          headerTitle: 'إدارة الأقسام والدول',
        }}
      />
    </Stack>
  );
};

export default StacksLayout;
