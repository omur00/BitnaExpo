// app/featured-trainers.jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GET_ALL_FEATURED_TRAINERS } from '@/utils/queries';
import { useQuery } from '@apollo/client/react';
import Loading from '@/components/Loading';

export default function FeaturedTrainersPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_ALL_FEATURED_TRAINERS, {
    variables: { page: currentPage, limit: 12 },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F9FA]">
        <Text className="text-red-600">حدث خطأ في تحميل المدربين المتميزين</Text>
      </View>
    );
  }

  const {
    trainers = [],
    totalPages = 0,
    hasNextPage = false,
    hasPreviousPage = false,
  } = data?.getAllFeaturedTrainers || {};

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
      <View className="mt-8 flex-row items-center justify-center gap-2">
        {/* Previous Button */}
        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => prev - 1)}
          disabled={!hasPreviousPage}
          className={`flex-row items-center rounded-lg border bg-white px-4 py-2 ${
            !hasPreviousPage ? 'border-gray-300 opacity-50' : 'border-gray-300'
          }`}>
          <Ionicons name="chevron-forward" size={16} color="#6B7280" />
          <Text className="mr-1 text-sm font-medium text-gray-700">السابق</Text>
        </TouchableOpacity>

        {/* Page Numbers */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row gap-1 px-2">
          {pages.map((page) => (
            <TouchableOpacity
              key={page}
              onPress={() => setCurrentPage(page)}
              className={`h-10 w-10 items-center justify-center rounded-lg ${
                currentPage === page ? 'bg-[#CAA453]' : 'border border-gray-300 bg-white'
              }`}>
              <Text
                className={`text-sm font-medium ${
                  currentPage === page ? 'text-white' : 'text-gray-700'
                }`}>
                {page}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Next Button */}
        <TouchableOpacity
          onPress={() => setCurrentPage((prev) => prev + 1)}
          disabled={!hasNextPage}
          className={`flex-row items-center rounded-lg border bg-white px-4 py-2 ${
            !hasNextPage ? 'border-gray-300 opacity-50' : 'border-gray-300'
          }`}>
          <Text className="ml-1 text-sm font-medium text-gray-700">التالي</Text>
          <Ionicons name="chevron-back" size={16} color="#6B7280" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-[#F7F9FA]" showsVerticalScrollIndicator={false}>
      {/* Featured Trainers Grid */}
      <View className="px-4 py-6">
        <View className="flex-col flex-wrap gap-4">
          {trainers.map((trainer) => (
            <TouchableOpacity
              key={trainer.id}
              onPress={() => router.push(`/(stacks)/category/trainer/${trainer.slug}`)}
              className="mb-4 rounded-lg border border-[#E5E7EB] bg-white"
              style={{
                shadowColor: 'rgba(24,52,74,0.08)',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 1,
                shadowRadius: 12,
                elevation: 3,
              }}>
              <View className="h-32 items-center justify-center bg-[#F7F9FA]">
                {trainer.logo?.url ? (
                  <Image
                    source={{ uri: trainer.logo.url }}
                    className="h-20 w-20 rounded-full"
                    resizeMode="cover"
                  />
                ) : (
                  <Text className="text-2xl">🎓</Text>
                )}
              </View>
              <View className="p-3">
                <Text className="mb-1 text-base font-semibold text-[#18344A]" numberOfLines={1}>
                  {trainer.fullName}
                </Text>
                <Text className="mb-2 text-sm font-medium text-[#CAA453]" numberOfLines={1}>
                  {trainer.specialization}
                </Text>
                <Text
                  className="mb-3 text-sm text-[#4E6882]"
                  numberOfLines={2}
                  style={{ lineHeight: 20 }}>
                  {trainer.description}
                </Text>
                <View className="flex-row justify-between">
                  <Text className="text-xs text-[#7A8699]" numberOfLines={1} style={{ flex: 1 }}>
                    {trainer.category.nameAr}
                  </Text>
                  <Text
                    className="mr-2 text-xs text-[#7A8699]"
                    numberOfLines={1}
                    style={{ flex: 1 }}>
                    {trainer.city.nameAr}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pagination */}
        {renderPagination()}
      </View>
    </ScrollView>
  );
}
