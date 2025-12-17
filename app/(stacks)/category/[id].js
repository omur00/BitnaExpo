// app/categories/[id].jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  GET_APPROVED_MERCHANTS_BY_CATEGORY,
  GET_CATEGORIES,
  GET_APPROVED_TRAINERS_BY_CATEGORY,
} from '@/utils/queries';
import { useAuth } from '@/context/auth-context';
import { useQuery } from '@apollo/client/react';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '@/components/Loading';

export default function CategoryDirectoryPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [categoryId, setCategoryId] = useState(id);

  const { data: merchantsData, loading: merchantsLoading } = useQuery(
    GET_APPROVED_MERCHANTS_BY_CATEGORY,
    {
      variables: { categoryId: categoryId },
    }
  );

  const { data: trainersData, loading: trainersLoading } = useQuery(
    GET_APPROVED_TRAINERS_BY_CATEGORY,
    {
      variables: { categoryId: categoryId },
    }
  );

  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  const currentCategory = categoriesData?.categories?.find((cat) => cat.id === id);

  const loading = merchantsLoading || trainersLoading;

  const merchants = merchantsData?.approvedMerchantsByCategory?.merchants || [];
  const trainers = trainersData?.approvedTrainersByCategory?.trainers || [];
  const categories = categoriesData?.categories || [];

  const hasMerchants = merchants.length > 0;
  const hasTrainers = trainers.length > 0;

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={['#1E2053', '#2A4F68']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        className="px-4 py-8">
        <View className="items-center">
          <Text className="font-poppins mb-3 text-2xl font-bold text-white md:text-3xl">
            {currentCategory?.nameAr || ''}
          </Text>
          <Text className="font-inter max-w-md text-center text-base text-white opacity-90 md:text-lg">
            {currentCategory?.description || ''}
          </Text>
        </View>
      </LinearGradient>

      {/* Categories Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-[#CBD0D6] bg-white"
        contentContainerClassName="px-4 py-3 flex-row gap-2">
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setCategoryId(category.id)}
            className={`rounded-lg px-4 py-2 ${
              category.id === categoryId ? 'bg-[#1E2053]' : 'bg-[#F7F9FA]'
            }`}>
            <Text
              className={`font-inter text-sm ${
                category.id === categoryId ? 'text-white' : 'text-[#4E6882]'
              }`}>
              {category.nameAr}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}

      {loading ? (
        <Loading />
      ) : (
        <View className="px-4 py-6">
          {/* Merchants Section */}
          {hasMerchants && (
            <View className="mb-8">
              <View className="mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="storefront-outline" size={20} color="#1E2053" />
                  <Text className="font-poppins text-xl font-bold text-[#18344A]">
                    التجار والأسر المنتجة
                  </Text>
                </View>
                <View className="rounded-full bg-[#F7F9FA] px-3 py-1">
                  <Text className="font-inter text-sm font-medium text-[#1E2053]">
                    {merchants.length} نشاط
                  </Text>
                </View>
              </View>

              <View className="gap-4">
                {merchants.map((merchant) => (
                  <TouchableOpacity
                    key={merchant.id}
                    onPress={() => router.push(`/category/merchant/${merchant.slug}`)}
                    className="rounded-xl border border-[#E5E7EB] bg-white shadow-lg"
                    style={{
                      shadowColor: 'rgba(24,52,74,0.10)',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 1,
                      shadowRadius: 18,
                      elevation: 4,
                    }}>
                    <View className="h-36 items-center justify-center bg-[#F7F9FA]">
                      {merchant.logo?.url ? (
                        <Image
                          source={{ uri: merchant.logo.url }}
                          className="h-20 w-20 rounded-xl"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="h-20 w-20 items-center justify-center rounded-xl bg-[#1E2053]">
                          <Ionicons name="storefront-outline" size={32} color="white" />
                        </View>
                      )}
                    </View>
                    <View className="border-l-4 border-[#CAA453] p-4">
                      <Text
                        className="font-inter mb-2 text-base font-bold text-[#18344A]"
                        numberOfLines={1}>
                        {merchant.businessName}
                      </Text>
                      <Text className="font-inter mb-3 text-sm text-[#4E6882]" numberOfLines={2}>
                        {merchant.description}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="location-outline" size={12} color="#7A8699" />
                          <Text className="font-inter text-xs text-[#7A8699]">
                            {merchant.city.nameAr}
                          </Text>
                        </View>
                        {merchant.whatsapp && (
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="chatbubble-outline" size={12} color="#2A4F68" />
                            <Text className="font-inter text-xs text-[#2A4F68]">واتساب</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Trainers Section */}
          {hasTrainers && (
            <View className="mb-8">
              <View className="mb-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="school-outline" size={20} color="#1E2053" />
                  <Text className="font-poppins text-xl font-bold text-[#18344A]">
                    المدربون ومقدمو الخدمات
                  </Text>
                </View>
                <View className="rounded-full bg-[#F7F9FA] px-3 py-1">
                  <Text className="font-inter text-sm font-medium text-[#1E2053]">
                    {trainers.length} مدرب
                  </Text>
                </View>
              </View>

              <View className="gap-4">
                {trainers.map((trainer) => (
                  <TouchableOpacity
                    key={trainer.id}
                    onPress={() => router.push(`/trainer/${trainer.slug}`)}
                    className="rounded-xl border border-[#E5E7EB] bg-white shadow-lg"
                    style={{
                      shadowColor: 'rgba(24,52,74,0.10)',
                      shadowOffset: { width: 0, height: 4 },
                      shadowOpacity: 1,
                      shadowRadius: 18,
                      elevation: 4,
                    }}>
                    <View className="h-36 items-center justify-center bg-[#F7F9FA]">
                      {trainer.logo?.url ? (
                        <Image
                          source={{ uri: trainer.logo.url }}
                          className="h-20 w-20 rounded-xl"
                          resizeMode="cover"
                        />
                      ) : (
                        <View className="h-20 w-20 items-center justify-center rounded-xl bg-[#1E2053]">
                          <Ionicons name="school-outline" size={32} color="white" />
                        </View>
                      )}
                    </View>
                    <View className="border-l-4 border-[#CAA453] p-4">
                      <Text
                        className="font-inter mb-1 text-base font-bold text-[#18344A]"
                        numberOfLines={1}>
                        {trainer.fullName}
                      </Text>
                      <Text className="font-inter mb-2 text-sm text-[#4E6882]">
                        {trainer.specialization}
                      </Text>
                      <Text className="font-inter mb-3 text-sm text-[#4E6882]" numberOfLines={2}>
                        {trainer.description}
                      </Text>
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="location-outline" size={12} color="#7A8699" />
                          <Text className="font-inter text-xs text-[#7A8699]">
                            {trainer.city.nameAr}
                          </Text>
                        </View>
                        {trainer.whatsapp && (
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="chatbubble-outline" size={12} color="#2A4F68" />
                            <Text className="font-inter text-xs text-[#2A4F68]">واتساب</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          {/* Empty State */}
          {!hasMerchants && !hasTrainers && (
            <View className="items-center py-12">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-[#F7F9FA]">
                <Ionicons name="file-tray-outline" size={32} color="#1E2053" />
              </View>
              <Text className="font-poppins mb-2 text-xl font-bold text-[#18344A]">
                لا توجد أنشطة
              </Text>
              <Text className="font-inter mb-6 max-w-xs text-center text-sm text-[#4E6882]">
                لا توجد أنشطة مسجلة في هذا القسم بعد
              </Text>
              {!user && (
                <TouchableOpacity
                  onPress={() => router.push('/register')}
                  className="rounded-lg bg-[#1E2053] px-6 py-3">
                  <Text className="font-inter text-sm font-semibold text-white">
                    كن أول من يسجل في هذا القسم
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}
