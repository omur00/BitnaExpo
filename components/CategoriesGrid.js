import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
      <View className="bg-white py-16">
        <View className="container mx-auto max-w-6xl px-4 sm:px-6">
          <View className="mb-12 text-center">
            <View className="mb-4 inline-flex items-center gap-3">
              <View className="h-8 w-2 animate-pulse rounded-full bg-gray-200"></View>
              <View className="mx-auto h-8 w-48 animate-pulse rounded-lg bg-gray-200"></View>
              <View className="h-8 w-2 animate-pulse rounded-full bg-gray-200"></View>
            </View>
            <View className="mx-auto mb-2 h-5 w-72 animate-pulse rounded bg-gray-200"></View>
            <View className="mx-auto h-4 w-64 animate-pulse rounded bg-gray-200"></View>
          </View>

          <View className="flex-row flex-wrap justify-center gap-4">
            {[...Array(7)].map((_, index) => (
              <View
                key={index}
                className="group relative animate-pulse rounded-2xl border border-gray-100 bg-white p-6">
                <View className="relative z-10">
                  <View className="relative mb-4">
                    <View className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-200">
                      <View className="h-7 w-7 rounded-full bg-gray-300"></View>
                    </View>

                    <View className="absolute -right-2 -top-2 h-8 w-8 rounded-full bg-gray-300"></View>
                  </View>

                  <View className="mx-auto mb-3 h-5 w-20 rounded bg-gray-200"></View>
                  <View className="flex items-center justify-center gap-2">
                    <View className="h-4 w-6 rounded bg-gray-200"></View>
                    <View className="h-4 w-8 rounded bg-gray-200"></View>
                  </View>

                  <View className="absolute bottom-1 left-4">
                    <View className="mt-5 h-5 w-5 rounded bg-gray-200"></View>
                  </View>
                </View>
              </View>
            ))}
          </View>

          <View className="mt-12 text-center">
            <View className="mx-auto inline-flex w-48 animate-pulse items-center gap-3 rounded-xl bg-gray-200 px-8 py-4">
              <View className="h-5 w-24 rounded bg-gray-300"></View>
              <View className="h-5 w-5 rounded bg-gray-300"></View>
            </View>
          </View>
        </View>
      </View>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <View className="col-span-full flex flex-col items-center justify-center py-12">
        <View className="mb-12 text-center">
          <View className="mb-4 inline-flex items-center gap-3">
            <View className="h-8 w-2 rounded-full bg-[#CAA453]"></View>
            <Text className="font-poppins text-2xl font-bold text-[#1E2053] md:text-3xl">
              الأقسام الرئيسية
            </Text>
            <View className="h-8 w-2 rounded-full bg-[#CAA453]"></View>
          </View>
          <Text className="font-inter mx-auto max-w-2xl text-lg text-[#4E6882]">
            اكتشف مجموعة متنوعة من الأنشطة والخدمات المميزة
          </Text>
        </View>
        <View className="mb-4 h-24 w-24 text-gray-300">
          <Ionicons name="bag-outline" size={96} color="#D1D5DB" />
        </View>
        <Text className="mb-2 text-lg font-semibold text-gray-500">{emptyStateTitle}</Text>
        <Text className="max-w-md text-center text-gray-400">{emptyStateDescription}</Text>
      </View>
    );
  }

  const displayCategories = categories.slice(0, 7);

  return (
    <View className="bg-white py-16">
      <View className="container mx-auto max-w-6xl px-4 sm:px-6">
        <View className="mb-12 text-center">
          <View className="mb-4 inline-flex items-center gap-3">
            <View className="h-8 w-2 rounded-full bg-[#CAA453]"></View>
            <Text className="font-poppins text-2xl font-bold text-[#1E2053] md:text-3xl">
              الأقسام الرئيسية
            </Text>
            <View className="h-8 w-2 rounded-full bg-[#CAA453]"></View>
          </View>
          <Text className="font-inter mx-auto max-w-2xl text-lg text-[#4E6882]">
            اكتشف مجموعة متنوعة من الأنشطة والخدمات المميزة
          </Text>
        </View>

        <View className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {displayCategories.map((category, index) => (
            <TouchableOpacity
              key={category.id}
              onPress={() => router.push(`/category/${category.id}`)}
              className="group relative rounded-2xl border border-gray-100 bg-white p-6 transition-all duration-500 active:scale-105"
              activeOpacity={0.7}>
              <View className="relative z-10">
                <View className="relative mb-4">
                  <View className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#1E2053]">
                    <Ionicons name="cube-outline" size={28} color="#FFFFFF" />
                  </View>

                  <View className="absolute -right-2 -top-2 flex h-8 w-8 items-center justify-center rounded-full bg-[#CAA453]">
                    <Text className="text-xs font-bold text-white">{index + 1}</Text>
                  </View>
                </View>

                <Text className="font-inter mb-2 text-center text-base font-bold text-[#1E2053]">
                  {category.nameAr}
                </Text>

                <View className="flex items-center justify-center gap-2">
                  <Text className="font-semibold text-[#CAA453]">{category.merchantsCount}</Text>
                  <Text className="text-sm text-[#7A8699]">نشاط</Text>
                </View>

                <View className="absolute bottom-1 left-4">
                  <Ionicons name="arrow-back" size={20} color="#CAA453" />
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <View className="mt-12 text-center">
          <TouchableOpacity
            onPress={() => router.push('/categories')}
            className="flex-row items-center justify-center gap-3 rounded-xl bg-[#1E2053] px-8 py-4 text-base font-semibold text-white"
            activeOpacity={0.8}>
            <Text className="text-white">استكشف جميع الأقسام</Text>
            <Ionicons name="arrow-back" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default CategoriesGrid;
