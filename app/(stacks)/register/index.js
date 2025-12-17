import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterIndex() {
  const [selectedType, setSelectedType] = useState(null);

  const handleContinue = () => {
    if (!selectedType) return;

    if (selectedType === 'merchant') {
      router.push('/(stacks)/register/merchant');
    } else if (selectedType === 'trainer') {
      router.push('/(stacks)/register/trainer');
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50">
      <View className="p-6">
        {/* Header */}
        <View className="mb-8">
          <Text className="mb-2 text-center text-2xl font-bold text-[#1E2053]">
            اختر نوع التسجيل
          </Text>
          <Text className="text-center text-gray-600">اختر نوع الحساب الذي ترغب في إنشائه</Text>
        </View>

        {/* Selection Cards */}
        <View className="mb-8 flex-col gap-2">
          {/* Merchant Card */}
          <TouchableOpacity
            onPress={() => setSelectedType('merchant')}
            className={`rounded-xl border-2 bg-white p-6 ${
              selectedType === 'merchant' ? 'border-[#1E2053] bg-blue-50' : 'border-gray-200'
            }`}>
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    selectedType === 'merchant'
                      ? 'border-[#1E2053] bg-[#1E2053]'
                      : 'border-gray-300'
                  }`}>
                  {selectedType === 'merchant' && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text className="text-lg font-bold text-[#1E2053]">متجر</Text>
              </View>
              <Ionicons
                name="storefront-outline"
                size={32}
                color={selectedType === 'merchant' ? '#1E2053' : '#9CA3AF'}
              />
            </View>

            <Text className="mb-3 text-gray-700">مناسب لأصحاب المتاجر والمطاعم والمقاهي</Text>

            <View className="space-y-2">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text className="mr-2 text-sm text-gray-600">إضافة منتجات وخدمات</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text className="mr-2 text-sm text-gray-600">إدارة الطلبات والمبيعات</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text className="mr-2 text-sm text-gray-600">عرض المتجر على المنصة</Text>
              </View>
            </View>
          </TouchableOpacity>

          {/* Trainer Card */}
          <TouchableOpacity
            onPress={() => setSelectedType('trainer')}
            className={`rounded-xl border-2 bg-white p-6 ${
              selectedType === 'trainer' ? 'border-[#1E2053] bg-blue-50' : 'border-gray-200'
            }`}>
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View
                  className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                    selectedType === 'trainer' ? 'border-[#1E2053] bg-[#1E2053]' : 'border-gray-300'
                  }`}>
                  {selectedType === 'trainer' && (
                    <Ionicons name="checkmark" size={14} color="white" />
                  )}
                </View>
                <Text className="text-lg font-bold text-[#1E2053]">مدرب</Text>
              </View>
              <Ionicons
                name="fitness-outline"
                size={32}
                color={selectedType === 'trainer' ? '#1E2053' : '#9CA3AF'}
              />
            </View>

            <Text className="mb-3 text-gray-700">
              مناسب للمدربين الرياضيين وأصحاب المراكز التدريبية
            </Text>

            <View className="space-y-2">
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text className="mr-2 text-sm text-gray-600">إنشاء حصص وجدول تدريبي</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text className="mr-2 text-sm text-gray-600">إدارة الحجوزات والمدفوعات</Text>
              </View>
              <View className="flex-row items-center">
                <Ionicons name="checkmark-circle" size={18} color="#10B981" />
                <Text className="mr-2 text-sm text-gray-600">التواصل مع المتدربين</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedType}
          className={`rounded-lg px-4 py-3 ${!selectedType ? 'bg-gray-300' : 'bg-[#1E2053]'}`}>
          <Text className="text-center text-lg font-medium text-white">
            {selectedType ? 'متابعة' : 'اختر نوع التسجيل'}
          </Text>
        </TouchableOpacity>

        {/* Back Link */}
        <TouchableOpacity onPress={() => router.back()} className="mt-4">
          <Text className="text-center text-gray-500">العودة للخلف</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
