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
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="p-6">
        {/* Header */}
        <View className="mb-8 gap-2">
          <Text className="text-center text-gray-600">اختر نوع الحساب الذي ترغب في إنشائه</Text>
        </View>

        {/* Selection Cards */}
        <View className="mb-8 gap-4">
          {/* Merchant Card */}
          <TouchableOpacity
            onPress={() => setSelectedType('merchant')}
            className={`rounded-xl border-2 bg-white p-6 ${
              selectedType === 'merchant' ? 'border-[#1E2053] bg-blue-50' : 'border-gray-200'
            }`}>
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center gap-3">
                <View
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                    selectedType === 'merchant'
                      ? 'border-[#1E2053] bg-[#1E2053]'
                      : 'border-gray-300 bg-white'
                  }`}>
                  {selectedType === 'merchant' && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-lg font-bold text-[#1E2053]">متجر / تاجر</Text>
              </View>
              <View
                className={`rounded-lg p-2 ${selectedType === 'merchant' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Ionicons
                  name="storefront-outline"
                  size={28}
                  color={selectedType === 'merchant' ? '#1E2053' : '#6B7280'}
                />
              </View>
            </View>

            <Text className="mb-4 text-gray-700">
              مناسب لأصحاب المتاجر والمطاعم والمقاهي والأسر المنتجة
            </Text>

            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                <Text className="text-sm text-gray-600">إضافة منتجات وخدمات</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                <Text className="text-sm text-gray-600">إدارة الطلبات والمبيعات</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                <Text className="text-sm text-gray-600">عرض المتجر على المنصة</Text>
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
              <View className="flex-row items-center gap-3">
                <View
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 ${
                    selectedType === 'trainer'
                      ? 'border-[#1E2053] bg-[#1E2053]'
                      : 'border-gray-300 bg-white'
                  }`}>
                  {selectedType === 'trainer' && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-lg font-bold text-[#1E2053]">مدرب / مقدم خدمة</Text>
              </View>
              <View
                className={`rounded-lg p-2 ${selectedType === 'trainer' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                <Ionicons
                  name="fitness-outline"
                  size={28}
                  color={selectedType === 'trainer' ? '#1E2053' : '#6B7280'}
                />
              </View>
            </View>

            <Text className="mb-4 text-gray-700">
              مناسب للمدربين الرياضيين وأصحاب المراكز التدريبية ومقدمي الخدمات
            </Text>

            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                <Text className="text-sm text-gray-600">إنشاء حصص وجدول تدريبي</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                <Text className="text-sm text-gray-600">إدارة الحجوزات والمدفوعات</Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Ionicons name="checkmark-circle-outline" size={20} color="#10B981" />
                <Text className="text-sm text-gray-600">التواصل مع المتدربين</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        {/* Continue Button */}
        <TouchableOpacity
          onPress={handleContinue}
          disabled={!selectedType}
          className={`flex-row items-center justify-center gap-2 rounded-lg py-4 ${
            !selectedType ? 'bg-gray-300' : 'bg-[#1E2053]'
          }`}>
          <Text className="text-center text-lg font-medium text-white">
            {selectedType ? 'متابعة' : 'اختر نوع التسجيل'}
          </Text>
          <Ionicons
            name="arrow-back-circle-outline"
            size={24}
            color={!selectedType ? '#9CA3AF' : 'white'}
          />
        </TouchableOpacity>

        {/* Back Link */}
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-6 flex-row items-center justify-center gap-1">
          <Ionicons name="arrow-forward-outline" size={18} color="#6B7280" />
          <Text className="text-gray-500">العودة</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
