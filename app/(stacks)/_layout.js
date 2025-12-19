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
          headerTitle: 'الرئيسية',
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

      {/* Category Directory */}
      <Stack.Screen
        name="category/[id]"
        options={{
          headerTitle: 'الأقسام',
        }}
      />

      {/* Merchant Detail */}
      <Stack.Screen
        name="category/merchant/[slug]"
        options={{
          headerTitle: 'تفاصيل المتجر',
        }}
      />

      {/* Trainer Detail */}
      <Stack.Screen
        name="category/trainer/[slug]"
        options={{
          headerTitle: 'تفاصيل المدرب',
        }}
      />

      <Stack.Screen
        name="categories/index"
        options={{
          headerTitle: 'جميع الأقسام',
        }}
      />
      <Stack.Screen
        name="(feautred)"
        options={{
          headerTitle: 'الجهات المميزة',
        }}
      />

      <Stack.Screen
        name="register"
        options={{
          headerTitle: 'إنشاء حساب',
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="termsAndConditions"
        options={{
          headerTitle: 'الشروط والأحكام العامة',
          headerShown: false,
        }}
      />
    </Stack>
  );
};

export default StacksLayout;
