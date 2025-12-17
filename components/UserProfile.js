import { View, Text } from 'react-native';
import React from 'react';
import { hasAnyPermission, PERMISSION_GROUPS } from '@/utils/permissions';
import { Ionicons } from '@expo/vector-icons';

const UserProfile = () => {
  return (
    <View className="rounded-2xl border border-gray-200 bg-white p-6">
      <View className="flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <View className="flex-row items-center gap-4">
          <TouchableOpacity
            onPress={() => {
              if (hasAnyPermission(user, PERMISSION_GROUPS.ALL)) {
                router.push('/admin');
              }
            }}
            disabled={!hasAnyPermission(user, PERMISSION_GROUPS.ALL)}
            className="flex-row items-center gap-2 rounded-xl border border-gray-300 bg-gray-50 px-6 py-3">
            <Ionicons name="settings-outline" size={20} color="#6B7280" />
            <Text className="text-gray-500">اذهب للوحة الإدارة</Text>
          </TouchableOpacity>

          <View className="flex-row items-center gap-2">
            {hasAnyPermission(user, PERMISSION_GROUPS.ALL) ? (
              <>
                <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                <Text className="rounded-full bg-green-50 px-3 py-1 text-green-600">
                  مصرح بالدخول
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="warning-outline" size={20} color="#F59E0B" />
                <Text className="rounded-full bg-amber-50 px-3 py-1 text-amber-600">
                  غير مصرح بالدخول حالياً
                </Text>
              </>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserProfile;
