import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { usePathname, useRouter, useSegments } from 'expo-router';

export default function CustomDrawerContent(props) {
  const { user, isAuthenticated, logout, logoutLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const segments = useSegments();
  const currentRoute = '/' + segments.join('/');

  const handleLogout = async () => {
    props.navigation.closeDrawer();
    await logout();
  };

  const drawerItems = [
    {
      label: 'الرئيسية',
      icon: 'home-outline',
      route: '/(stacks)',
      visible: true, // Always visible
    },
    {
      label: 'إنشاء حساب',
      icon: 'person-add-outline',
      route: '/(stacks)/register',
      visible: !isAuthenticated, // Only visible when NOT logged in
    },
    {
      label: 'الإدارة',
      icon: 'settings-outline',
      route: '/(admin)',
      visible: isAuthenticated && user?.role === 'admin', // Only for admins
    },
    {
      label: 'اللوحة الشخصية',
      icon: 'apps-outline',
      route: '/(auth)/dashboard',
      visible: isAuthenticated && user?.role !== 'admin', // Only when logged in
    },
  ];

  const handleNavigation = (route) => {
    props.navigation.closeDrawer();

    if (currentRoute === route) {
      return;
    }

    router.push(route);
  };

  const isActive = (route) => {
    // Handle different route matching
    if (route === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(route);
  };

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        {/* Drawer Header */}
        <View className="border-b border-gray-200 p-4">
          {isAuthenticated ? (
            <View className="flex-row items-center gap-3">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-blue-100">
                <Ionicons name="person" size={24} color="#1E2053" />
              </View>
              <View>
                <Text className="font-bold text-gray-800">{user.name || user.email}</Text>
                <Text className="text-sm text-gray-600">{user.role || 'مستخدم'}</Text>
              </View>
            </View>
          ) : (
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                <Ionicons name="person-outline" size={24} color="#6B7280" />
              </View>
              <Text className="mr-3 text-gray-600">مرحباً بك</Text>
            </View>
          )}
        </View>

        {/* Drawer Items */}
        <View className="p-2">
          {drawerItems
            .filter((item) => item.visible)
            .map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => handleNavigation(item.route)}
                className={`my-1 flex-row items-center gap-2 rounded-lg px-4 py-3 ${
                  isActive(item.route) ? 'bg-gray-200' : ''
                }`}>
                <Ionicons
                  name={item.icon}
                  size={22}
                  color={isActive(item.route) ? '#1E2053' : '#6B7280'}
                />
                <Text
                  className={`mr-3 font-medium ${
                    isActive(item.route) ? 'text-[#1E2053]' : 'text-gray-700'
                  }`}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
        </View>
      </DrawerContentScrollView>

      {/* Logout Button (only if user is logged in) */}
      {isAuthenticated && (
        <TouchableOpacity
          onPress={handleLogout}
          disabled={logoutLoading}
          className="mx-4 flex-row items-center gap-3 border-t border-gray-200 px-4 py-3">
          <Ionicons name="log-out-outline" size={22} color="#EF4444" />
          <Text className="font-medium text-red-600">
            {logoutLoading ? 'جاري تسجيل الخروج...' : 'تسجيل الخروج'}
          </Text>
        </TouchableOpacity>
      )}

      {!isAuthenticated && (
        <TouchableOpacity
          onPress={handleLogout}
          disabled={logoutLoading}
          className="mx-4 flex-row items-center gap-3 border-t border-gray-200 px-4 py-3">
          <Ionicons name="log-in-outline" size={22} color="#EF4444" />
          <Text className="font-medium text-red-600">تسجيل الدخول</Text>
        </TouchableOpacity>
      )}

      {/* App Info */}
      <View className="border-t border-gray-200 p-4">
        <Text className="text-center text-xs text-gray-500">منصة بيتنا © 2025</Text>
      </View>
    </View>
  );
}
