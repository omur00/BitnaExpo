import React from 'react';
import { View, Text, TouchableOpacity, Image, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const FeaturedTrainers = ({
  featuredTrainers = [],
  loading = false,
  emptyStateTitle = 'لا توجد مدربون متميزون حالياً',
  emptyStateDescription = 'لم يتم إضافة أي مدربين متميزين بعد. سيتم إضافتها قريباً.',
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

        {/* Loading Trainers */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
          <View className="flex-row gap-3">
            {[...Array(4)].map((_, index) => (
              <View
                key={index}
                className="w-64 animate-pulse rounded-xl border border-gray-200 bg-white">
                {/* Trainer Image */}
                <View className="h-40 rounded-t-xl bg-gray-200" />

                {/* Content */}
                <View className="p-4">
                  <View className="mb-3 flex-row items-start justify-between">
                    <View className="flex-1 gap-1">
                      <View className="h-5 w-32 rounded bg-gray-200" />
                      <View className="h-4 w-24 rounded bg-gray-200" />
                    </View>
                    <View className="h-6 w-6 rounded-full bg-gray-200" />
                  </View>

                  <View className="mb-2 h-3 w-full rounded bg-gray-200" />
                  <View className="mb-3 h-3 w-4/5 rounded bg-gray-200" />

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

  if (!featuredTrainers || featuredTrainers.length === 0) {
    return (
      <View className="mb-8">
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-row items-center gap-2">
            <View className="rounded-lg bg-gray-100 p-2">
              <Ionicons name="ribbon-outline" size={20} color="#6B7280" />
            </View>
            <View>
              <Text className="text-lg font-bold text-gray-900">المدربون المتميزون</Text>
              <Text className="text-sm text-gray-600">أفضل الخبراء والمتخصصين</Text>
            </View>
          </View>
        </View>

        <View className="items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-8">
          <Ionicons name="people-outline" size={48} color="#9CA3AF" />
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
          <View className="rounded-lg bg-[#1E2053]/10 p-2">
            <Ionicons name="ribbon-outline" size={24} color="#1E2053" />
          </View>
          <View>
            <Text className="text-xl font-bold text-gray-900">المدربون المتميزون</Text>
            <Text className="text-sm text-gray-600">أفضل الخبراء والمتخصصين على المنصة</Text>
          </View>
        </View>

        <TouchableOpacity
          className="flex-row items-center gap-1"
          onPress={() => router.push('/(stacks)/(feautred)/trainers')}>
          <Text className="text-sm font-medium text-[#CAA453]">عرض الكل</Text>
          <Ionicons name="chevron-back" size={16} color="#CAA453" />
        </TouchableOpacity>
      </View>

      {/* Horizontal Scroll Trainers */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-4">
        <View className="flex-row gap-3">
          {featuredTrainers.map((trainer) => (
            <TouchableOpacity
              key={trainer.id}
              onPress={() => router.push(`/category/trainer/${trainer.slug}`)}
              className="w-72 rounded-xl border border-gray-200 bg-white"
              activeOpacity={0.7}>
              {/* Trainer Header with Gradient */}
              <View className="relative h-36 overflow-hidden rounded-t-xl">
                {/* Background Gradient */}
                <View className="absolute inset-0 bg-gradient-to-br from-[#1E2053] to-[#2A4F68]" />

                {/* Trainer Image */}
                <View className="absolute -bottom-8 right-4 h-20 w-20 overflow-hidden rounded-full border-4 border-white bg-gray-100">
                  {trainer.logo ? (
                    <Image
                      source={{ uri: trainer.logo.url }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  ) : (
                    <View className="h-full w-full items-center justify-center bg-gray-200">
                      <Ionicons name="person-outline" size={32} color="#6B7280" />
                    </View>
                  )}
                </View>

                {/* Featured Badge */}
                <View className="absolute left-3 top-3 flex-row items-center gap-1 rounded-full bg-[#CAA453] px-2 py-1">
                  <Ionicons name="star" size={12} color="white" />
                  <Text className="text-xs font-medium text-white">مميز</Text>
                </View>
              </View>

              {/* Trainer Info */}
              <View className="p-4 pt-10">
                <View className="mb-2 flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                      {trainer.fullName}
                    </Text>
                    <Text className="text-sm font-medium text-[#CAA453]" numberOfLines={1}>
                      {trainer.specialization}
                    </Text>
                  </View>
                </View>

                {/* Description */}
                <Text className="mb-3 text-sm leading-relaxed text-gray-600" numberOfLines={2}>
                  {trainer.description || 'مدرب متميز على المنصة'}
                </Text>

                {/* Stats */}
                <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="location-outline" size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600" numberOfLines={1}>
                      {trainer.city?.nameAr || 'غير محدد'}
                    </Text>
                  </View>

                  <View className="flex-row items-center gap-1">
                    <Ionicons name="pricetag-outline" size={14} color="#6B7280" />
                    <Text className="text-xs text-gray-600" numberOfLines={1}>
                      {trainer.category?.nameAr || 'عام'}
                    </Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* See All Button */}
      {featuredTrainers.length > 4 && (
        <TouchableOpacity
          onPress={() => router.push('/(stacks)/(feautred)/trainers')}
          className="flex-row items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3"
          activeOpacity={0.8}>
          <Text className="font-medium text-gray-700">
            عرض جميع المدربين ({featuredTrainers.length})
          </Text>
          <Ionicons name="chevron-back" size={16} color="#6B7280" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default FeaturedTrainers;
