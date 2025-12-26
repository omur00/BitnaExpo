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
        screenOptions={({ navigation, route }) => ({
          headerShown: true,
          headerTitleStyle: {
            fontFamily: 'NotoKufiArabicMedium',
            fontSize: 16,
          },
          headerLeft: () => {
            if (route.name !== 'dashboard') {
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
        })}>
        <Stack.Screen
          name="index"
          options={{
            headerTitle: 'الرئيسية',
          }}
        />
        <Stack.Screen
          name="dashboard"
          options={{
            headerTitle: 'اللوحة الشخصية',
            headerShown: false,
          }}
        />
      </Stack>
    </>
  );
}
