import React from 'react';
import { useRouter } from 'expo-router';
import { View, Text, TouchableOpacity } from 'react-native';

export default function AccessDenied({
  message = 'ليس لديك صلاحية الوصول إلى هذه الصفحة',
  title = 'وصول مرفوض',
}) {
  const router = useRouter();

  const handleGoBack = () => {
    if (router.canGoBack()) {
      router.back();
    } else {
      router.replace('/(stacks)');
    }
  };

  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-4">
      <View className="w-full max-w-md items-center rounded-2xl bg-white p-8 shadow-lg">
        <View className="mb-6 h-20 w-20 items-center justify-center rounded-full bg-red-100">
          <Text className="text-3xl">🚫</Text>
        </View>

        <Text className="mb-4 text-2xl font-bold text-gray-800">{title}</Text>

        <Text className="mb-6 text-center leading-relaxed text-gray-600">{message}</Text>

        <View className="mb-6 h-px w-full bg-gray-200" />

        <TouchableOpacity
          className="w-full rounded-lg bg-red-600 py-3"
          onPress={handleGoBack}
          activeOpacity={0.8}>
          <Text className="text-center font-bold text-white">العودة</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
