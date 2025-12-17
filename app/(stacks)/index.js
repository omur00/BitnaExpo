import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import { GET_FEATURED_MERCHANTS, GET_CATEGORIES, GET_FEATURED_TRAINERS } from '@/utils/queries';
import { LinearGradient } from 'expo-linear-gradient';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/auth-context';
import { useQuery } from '@apollo/client/react';
import CategoriesGrid from '@/components/CategoriesGrid';
import FeaturedTrainers from '@/components/FeaturedTrainers';
import FeaturedMerchants from '@/components/FeaturedMerchants';
import { useRouter } from 'expo-router';

export default function HomePage() {
  const { user } = useAuth();
  const router = useRouter();

  const { data: featuredData, loading: featuredLoading } = useQuery(GET_FEATURED_MERCHANTS);
  const { data: featuredTrainersData, loading: featuredTrainersLoading } =
    useQuery(GET_FEATURED_TRAINERS);

  const { data: categoriesData, loading: categoriesLoading } = useQuery(GET_CATEGORIES);

  if (featuredLoading || categoriesLoading || featuredTrainersLoading) {
    return <Loading />;
  }

  return (
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
      {/* Hero Section */}
      <LinearGradient
        colors={['#1E2053', '#2A4F68', '#1E2053']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        className="relative overflow-hidden px-4 py-12 md:py-20">
        {/* Decorative Elements */}
        <View className="absolute right-0 top-0 h-24 w-24 -translate-y-12 translate-x-12 rounded-full bg-[#CAA453] opacity-20" />
        <View className="absolute bottom-0 left-0 h-20 w-20 -translate-x-10 translate-y-10 rounded-full bg-[#CAA453] opacity-15" />

        <View className="mx-auto max-w-3xl items-center">
          {/* Logo */}
          <View className="mb-6">
            <Image
              source={require('@/assets/logo.png')}
              className="h-24 w-24"
              resizeMode="contain"
            />
          </View>

          {/* Title */}
          <Text className="mb-4 text-center font-sans text-3xl font-bold leading-tight text-white md:text-4xl lg:text-5xl">
            <Text className="text-[#CAA453]">بيتنا</Text> مُنتج
          </Text>

          {/* Subtitle */}
          <View className="mb-6">
            <Text className="mb-4 max-w-2xl text-center text-lg font-light leading-relaxed text-white md:text-xl lg:text-2xl">
              نُـحيـي تـراثـنـا الخليجي العربي بـإبـداعـنـا
            </Text>
          </View>

          {/* Description */}
          <Text className="mb-6 max-w-2xl text-center text-base leading-relaxed text-gray-200 md:text-lg">
            منصة كويتية تجمع روّاد الأعمال، الأسر المنتجة، المدربين وأصحاب الحرف اليدوية
            {'\n'}
            لتعزيز الاقتصاد المحلي وتمكين المرأة والتنمية المستدامة والحفاظ على الهوية الخليجية
            العربية
          </Text>

          {/* Register Buttons for non-logged in users */}
          {!user && (
            <View className="mt-8 flex w-full max-w-md flex-col items-center gap-3 sm:flex-row">
              <TouchableOpacity
                className="w-full flex-row items-center justify-center rounded-lg bg-[#CAA453] px-6 py-3 text-base font-bold text-[#1E2053] sm:w-auto"
                onPress={() => router.push('/register/merchant')}
                activeOpacity={0.8}>
                <Text className="mr-2 text-base font-bold text-[#1E2053]">سجل نشاطك التجاري</Text>
                <Text className="text-[#1E2053]">←</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-full flex-row items-center justify-center rounded-lg border-2 border-[#CAA453] px-6 py-3 text-base font-bold text-[#CAA453] sm:w-auto"
                onPress={() => router.push('/register/trainer')}
                activeOpacity={0.8}>
                <Text className="mr-2 text-base font-bold text-[#CAA453]">سجل كمدرب</Text>
                <Text className="text-[#CAA453]">←</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Traditional Pattern Divider */}
          <View className="mt-12">
            <View className="h-1 w-24 rounded-full bg-[#CAA453] opacity-50" />
          </View>
        </View>
      </LinearGradient>

      {/* Categories Section */}
      <CategoriesGrid
        categories={categoriesData?.categories}
        loading={categoriesLoading}
        emptyStateTitle="لا توجد أقسام متاحة"
        emptyStateDescription="لم يتم إضافة أي أقسام تجارية بعد"
      />

      {/* Featured Merchants */}
      <FeaturedMerchants
        featuredMerchants={featuredData?.featuredMerchants}
        loading={featuredLoading}
        emptyStateTitle="لا توجد جهات مميزة بعد"
        emptyStateDescription="سيتم إضافة الجهات المميزة قريباً"
      />

      {/* Featured Trainers */}
      <FeaturedTrainers
        featuredTrainers={featuredTrainersData?.featuredTrainers}
        loading={featuredTrainersLoading}
        emptyStateTitle="لا توجد مدربون متميزون بعد"
        emptyStateDescription="سيتم إضافة المدربين المتميزين قريباً"
      />

      {/* CTA Section for non-logged in users */}
      {!user && (
        <View className="bg-[#F7F9FA] py-12">
          <View className="mx-auto max-w-4xl items-center px-4">
            <Text className="mb-4 text-center font-sans text-xl font-bold text-[#1E2053] md:text-2xl">
              انضم إلى منصتنا
            </Text>
            <Text className="mb-6 max-w-xl text-center text-base leading-relaxed text-[#4E6882]">
              سواء كنت تاجرًا، أسرة منتجة، مدربًا، أو مقدم خدمات - منصتنا توفر لك فرصة الوصول إلى
              جمهور أوسع
            </Text>
            <TouchableOpacity
              className="rounded-lg bg-[#1E2053] px-6 py-3 text-base font-semibold text-white"
              onPress={() => router.push('/(stacks)/register')}
              activeOpacity={0.8}>
              <Text className="text-base font-semibold text-white">ابدأ الآن</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
