import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FeaturedMerchants = ({
  featuredMerchants = [],
  loading = false,
  emptyStateTitle = 'لا توجد جهات مميزة حالياً',
  emptyStateDescription = 'لم يتم إضافة أي جهات مميزة بعد. سيتم إضافتها قريباً.',
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
              <View className="h-6 w-40 animate-pulse rounded bg-gray-200" />
              <View className="h-4 w-28 animate-pulse rounded bg-gray-200" />
            </View>
          </View>
          <View className="h-8 w-20 animate-pulse rounded bg-gray-200" />
        </View>

        {/* Loading Merchants */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-3">
            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                className="w-64 animate-pulse rounded-xl border border-gray-200 bg-white">
                {/* Merchant Image */}
                <View className="h-36 rounded-t-xl bg-gray-200" />

                {/* Logo */}
                <View className="absolute right-4 top-28 h-16 w-16 rounded-full border-4 border-white bg-gray-300" />

                {/* Content */}
                <View className="p-4 pt-8">
                  <View className="mb-3">
                    <View className="mb-1 h-5 w-32 rounded bg-gray-200" />
                    <View className="h-4 w-24 rounded bg-gray-200" />
                  </View>

                  <View className="mb-2 h-3 w-full rounded bg-gray-200" />
                  <View className="mb-4 h-3 w-4/5 rounded bg-gray-200" />

                  <View className="flex-row items-center justify-between">
                    <View className="h-4 w-16 rounded bg-gray-200" />
                    <View className="h-4 w-16 rounded bg-gray-200" />
                  </View>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }

  if (!featuredMerchants || featuredMerchants.length === 0) {
    return (
      <View className="mb-8">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="rounded-lg bg-gray-100 p-2">
              <Ionicons name="star-outline" size={20} color="#6B7280" />
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">الجهات المميزة</Text>
              <Text className="text-sm text-gray-600">أفضل المتاجر والأسر المنتجة</Text>
            </View>
          </View>
        </View>

        <View className="items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8">
          <Ionicons name="storefront-outline" size={48} color="#9CA3AF" />
          <Text className="mt-3 text-lg font-semibold text-gray-600">{emptyStateTitle}</Text>
          <Text className="mt-1 text-center text-sm text-gray-500">{emptyStateDescription}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="mb-8">
      {/* Section Header */}
      <View className="mb-4 flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <View className="rounded-lg bg-[#CAA453]/10 p-2">
            <Ionicons name="star-outline" size={24} color="#CAA453" />
          </View>
          <View>
            <Text className="font-arabic-bold text-lg text-gray-900">الجهات المميزة</Text>
            <Text className="font-arabic-regular text-xs text-gray-600">
              أفضل المتاجر والأسر المنتجة على المنصة
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={() => router.push('/(feautred)/merchants')}>
          <Text className="font-arabic-semibold text-sm text-[#CAA453]">عرض الكل</Text>
          <Ionicons name="chevron-back" size={16} color="#CAA453" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll Merchants */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-3">
          {featuredMerchants.map((merchant) => (
            <TouchableOpacity
              key={merchant.id}
              onPress={() => router.push(`/(stacks)/category/merchant/${merchant.slug}`)}
              className="w-72 overflow-hidden rounded-xl border border-gray-200 bg-white"
              activeOpacity={0.7}>
              {/* Cover Image with Gradient Overlay */}
              <View className="relative h-36">
                {merchant.coverImage ? (
                  <Image
                    source={{ uri: merchant.coverImage.url }}
                    className="h-full w-full"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-full w-full bg-[#1E2053]" />
                )}

                {/* Logo */}
                <View className="absolute -bottom-8 right-4 h-16 w-16 overflow-hidden rounded-full border-4 border-white bg-white shadow-sm">
                  {merchant.logo ? (
                    <Image
                      source={{ uri: merchant.logo.url }}
                      className="h-full w-full"
                      resizeMode="contain"
                    />
                  ) : (
                    <View className="h-full w-full items-center justify-center bg-gray-100">
                      <Ionicons name="storefront-outline" size={28} color="#6B7280" />
                    </View>
                  )}
                </View>

                {/* Featured Badge */}
                <View className="absolute left-3 top-3 flex-row items-center gap-1 rounded-full bg-[#CAA453] px-2 py-1">
                  <Ionicons name="star" size={12} color="white" />
                  <Text className="font-arabic-semibold text-xs text-white">مميز</Text>
                </View>
              </View>

              {/* Merchant Info */}
              <View className="p-4 pt-10">
                <View className="mb-2 flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="font-arabic-bold text-base text-gray-900" numberOfLines={1}>
                      {merchant.businessName}
                    </Text>
                    <View className="mt-1 flex-row items-center gap-1">
                      <Ionicons name="location-outline" size={14} color="#6B7280" />
                      <Text className="font-arabic-regular text-sm text-gray-600" numberOfLines={1}>
                        {merchant.city?.nameAr || 'غير محدد'}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Description */}
                <Text
                  className="font-arabic-regular mb-4 text-sm leading-relaxed text-gray-600"
                  numberOfLines={2}>
                  {merchant.description || 'جهة تجارية مميزة على المنصة'}
                </Text>

                {/* Category and Rating */}
                <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                  <View className="flex-row items-center gap-2">
                    <View className="flex-row items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
                      <Ionicons name="pricetag-outline" size={12} color="#6B7280" />
                      <Text
                        className="font-arabic-semibold text-xs text-gray-700"
                        numberOfLines={1}>
                        {merchant.category?.nameAr || 'عام'}
                      </Text>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Grid View for Larger Screens */}
      <View className="mb-4 hidden gap-3 md:grid md:grid-cols-2 lg:grid-cols-4">
        {featuredMerchants.slice(0, 4).map((merchant) => (
          <TouchableOpacity
            key={merchant.id}
            onPress={() => router.push(`/(stacks)/category/merchant/${merchant.slug}`)}
            className="overflow-hidden rounded-xl border border-gray-200 bg-white"
            activeOpacity={0.7}>
            {/* Compact Cover */}
            <View className="h-24 bg-gradient-to-r from-[#1E2053] to-[#2A4F68]" />

            {/* Logo */}
            <View className="absolute right-4 top-16 h-12 w-12 rounded-full border-4 border-white bg-white">
              {merchant.logo ? (
                <Image
                  source={{ uri: merchant.logo.url }}
                  className="h-full w-full"
                  resizeMode="contain"
                />
              ) : (
                <View className="h-full w-full items-center justify-center bg-gray-100">
                  <Ionicons name="storefront-outline" size={20} color="#6B7280" />
                </View>
              )}
            </View>

            {/* Content */}
            <View className="p-3 pt-6">
              <Text className="font-arabic-bold mb-1 text-sm text-gray-900" numberOfLines={1}>
                {merchant.businessName}
              </Text>
              <Text className="font-arabic-regular mb-2 text-xs text-gray-600" numberOfLines={1}>
                {merchant.category?.nameAr || 'عام'}
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-1">
                  <Ionicons name="location-outline" size={12} color="#6B7280" />
                  <Text className="font-arabic-regular text-xs text-gray-500">
                    {merchant.city?.nameAr || 'غير محدد'}
                  </Text>
                </View>
                <Ionicons name="chevron-back" size={14} color="#9CA3AF" />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* See All Button */}
      {featuredMerchants.length > 4 && (
        <TouchableOpacity
          onPress={() => router.push('/(feautred)/merchants')}
          className="flex-row items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3"
          activeOpacity={0.8}>
          <Text className="font-arabic-semibold text-sm text-gray-700">
            عرض جميع الجهات ({featuredMerchants.length})
          </Text>
          <Ionicons name="chevron-back" size={16} color="#6B7280" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FeaturedMerchants;
