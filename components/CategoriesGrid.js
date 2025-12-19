import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const CategoriesGrid = ({
  categories = [],
  loading = false,
  emptyStateTitle = 'لا توجد أقسام متاحة',
  emptyStateDescription = 'لم يتم إضافة أي أقسام تجارية بعد. سيتم إضافة الأقسام قريباً.',
}) => {
  const router = useRouter();

  if (loading) {
    return (
      <View className="mb-8">
        {/* Loading Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View className="h-10 w-10 animate-pulse rounded-lg bg-gray-200" />
            <View className="gap-1">
              <View className="h-6 w-32 animate-pulse rounded bg-gray-200" />
              <View className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            </View>
          </View>
          <View className="h-8 w-16 animate-pulse rounded bg-gray-200" />
        </View>

        {/* Loading Categories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-3">
            {[...Array(5)].map((_, index) => (
              <View
                key={index}
                className="w-32 animate-pulse rounded-xl border border-gray-200 bg-white p-4">
                <View className="mb-3 h-12 w-12 self-center rounded-lg bg-gray-200" />
                <View className="mb-2 h-4 w-full rounded bg-gray-200" />
                <View className="h-3 w-16 self-center rounded bg-gray-200" />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <View className="mb-8">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="rounded-lg bg-gray-100 p-2">
              <Ionicons name="apps-outline" size={20} color="#6B7280" />
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">الأقسام</Text>
              <Text className="text-sm text-gray-600">استكشف مختلف الأنشطة</Text>
            </View>
          </View>
        </View>

        <View className="items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8">
          <Ionicons name="folder-open-outline" size={48} color="#9CA3AF" />
          <Text className="mt-3 text-lg font-semibold text-gray-600">{emptyStateTitle}</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">{emptyStateDescription}</Text>
        </View>
      </View>
    );
  }

  const displayCategories = categories.slice(0, 8);

  return (
    <View className="mb-8">
      {/* Section Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="rounded-lg bg-[#1E2053]/10 p-2">
            <Ionicons name="apps-outline" size={24} color="#1E2053" />
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-900">الأقسام</Text>
            <Text className="text-sm text-gray-600">استكشف مختلف الأنشطة والخدمات</Text>
          </View>
        </View>

        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={() => router.push('/categories')}>
          <Text className="text-sm font-medium text-[#CAA453]">عرض الكل</Text>
          <Ionicons name="chevron-back" size={16} color="#CAA453" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-3">
          {displayCategories.map((category) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => router.push(`/category/${category.id}`)}
              className="w-32 rounded-xl border border-gray-200 bg-white p-4 active:opacity-80"
              activeOpacity={0.7}>
              <View className="items-center">
                {/* Icon Container */}
                <View className="mb-3 h-12 w-12 items-center justify-center rounded-lg bg-[#1E2053]/5">
                  <Ionicons name="cube-outline" size={24} color="#1E2053" />
                </View>

                {/* Category Name */}
                <Text
                  className="mb-1 text-center text-sm font-semibold text-gray-900"
                  numberOfLines={2}>
                  {category.nameAr}
                </Text>

                {/* Count Badge */}
                <View className="flex-row items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                  <Text className="text-xs font-medium text-gray-700">
                    {category.merchantsCount || 0}
                  </Text>
                  <Text className="text-xs text-gray-500">نشاط</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Grid View for Larger Screens or All Categories */}
      <View className="mb-4 hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-4">
        {displayCategories.slice(0, 4).map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => router.push(`/category/${category.id}`)}
            className="flex-row items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 active:opacity-80"
            activeOpacity={0.7}>
            <View className="h-10 w-10 items-center justify-center rounded-lg bg-[#1E2053]/5">
              <Ionicons name="cube-outline" size={20} color="#1E2053" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-semibold text-gray-900" numberOfLines={1}>
                {category.nameAr}
              </Text>
              <Text className="text-xs text-gray-500">{category.merchantsCount || 0} نشاط</Text>
            </View>
            <Ionicons name="chevron-back" size={16} color="#9CA3AF" />
          </TouchableOpacity>
        ))}
      </View>

      {/* See All Button */}
      {categories.length > 8 && (
        <TouchableOpacity
          onPress={() => router.push('/categories')}
          className="flex-row items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3"
          activeOpacity={0.8}>
          <Text className="font-medium text-gray-700">عرض جميع الأقسام ({categories.length})</Text>
          <Ionicons name="chevron-back" size={16} color="#6B7280" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default CategoriesGrid;
