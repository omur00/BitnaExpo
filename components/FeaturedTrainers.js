import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
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
      <View className="bg-[#F7F9FA] py-12">
        <View className="container mx-auto max-w-6xl px-4 sm:px-6">
          <View className="mb-8 flex items-center justify-between">
            <View className="h-8 w-48 animate-pulse rounded bg-gray-200"></View>
            <View className="h-6 w-20 animate-pulse rounded bg-gray-200"></View>
          </View>
          <View className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(3)].map((_, index) => (
              <View
                key={index}
                className="animate-pulse overflow-hidden rounded-lg border border-[#E5E7EB] bg-white">
                <View className="h-36 bg-gray-200"></View>
                <View className="p-4">
                  <View className="mb-2 h-5 rounded bg-gray-200"></View>
                  <View className="mb-2 h-4 w-3/4 rounded bg-gray-200"></View>
                  <View className="mb-3 h-4 rounded bg-gray-200"></View>
                  <View className="flex justify-between">
                    <View className="h-3 w-16 rounded bg-gray-200"></View>
                    <View className="h-3 w-16 rounded bg-gray-200"></View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  }

  if (!featuredTrainers || featuredTrainers.length === 0) {
    return (
      <View className="bg-[#F7F9FA] py-12">
        <View className="container mx-auto max-w-6xl px-4 sm:px-6">
          <View className="mb-8 flex items-center justify-between">
            <Text className="font-poppins border-b border-[#CAA453] pb-2 text-xl font-bold text-[#1E2053] md:text-2xl">
              مدربون متميزون
            </Text>
          </View>
          <View className="flex flex-col items-center justify-center py-12">
            <View className="mb-4 h-24 w-24 text-gray-300">
              <Ionicons name="school-outline" size={96} color="#D1D5DB" />
            </View>
            <Text className="mb-2 text-lg font-semibold text-gray-500">{emptyStateTitle}</Text>
            <Text className="max-w-md text-center text-gray-400">{emptyStateDescription}</Text>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-[#F7F9FA] py-12">
      <View className="container mx-auto max-w-6xl px-4 sm:px-6">
        <View className="mb-8 flex items-center justify-between">
          <Text className="font-poppins border-b border-[#CAA453] pb-2 text-xl font-bold text-[#1E2053] md:text-2xl">
            مدربون متميزون
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(stacks)/(feautred)/trainers')}
            className="flex-row items-center gap-2"
            activeOpacity={0.7}>
            <Text className="text-sm font-semibold text-[#CAA453]">عرض المزيد</Text>
            <Ionicons name="chevron-back" size={16} color="#CAA453" />
          </TouchableOpacity>
        </View>
        <View className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredTrainers.map((trainer) => (
            <TouchableOpacity
              key={trainer.id}
              onPress={() => router.push(`/category/trainer/${trainer.slug}`)}
              className="overflow-hidden rounded-lg border border-[#E5E7EB] bg-white"
              activeOpacity={0.7}>
              <View className="relative h-36 items-center justify-center overflow-hidden bg-[#F7F9FA]">
                {trainer.logo ? (
                  <Image
                    source={{ uri: trainer.logo.url }}
                    className="h-24 w-24 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Image
                    source={require('../assets/trainerLogo.png')}
                    className="h-24 w-24 rounded-full"
                    resizeMode="cover"
                  />
                )}
              </View>
              <View className="p-4">
                <Text
                  className="font-inter mb-2 text-base font-semibold text-[#18344A]"
                  numberOfLines={1}>
                  {trainer.fullName}
                </Text>
                <Text className="font-inter mb-2 text-sm font-medium text-[#CAA453]">
                  {trainer.specialization}
                </Text>
                <Text
                  className="font-inter mb-3 text-sm leading-relaxed text-[#4E6882]"
                  numberOfLines={2}>
                  {trainer.description}
                </Text>
                <View className="flex-row justify-between">
                  <Text className="font-inter text-xs text-[#7A8699]" numberOfLines={1}>
                    {trainer.category?.nameAr || 'لا يوجد قسم'}
                  </Text>
                  <Text className="font-inter text-xs text-[#7A8699]" numberOfLines={1}>
                    {trainer.city?.nameAr || 'لا يوجد مدينة'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default FeaturedTrainers;
