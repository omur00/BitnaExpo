import React from 'react';
import { View, Text, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { GET_FEATURED_MERCHANTS, GET_CATEGORIES, GET_FEATURED_TRAINERS } from '@/utils/queries';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/auth-context';
import { useQuery } from '@apollo/client/react';
import CategoriesGrid from '@/components/CategoriesGrid';
import FeaturedTrainers from '@/components/FeaturedTrainers';
import FeaturedMerchants from '@/components/FeaturedMerchants';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

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
    <ScrollView showsVerticalScrollIndicator={false} className="flex-1 bg-white">
      {/* Hero Section - Modern Design */}
      <View className="bg-white px-4 pb-6 pt-8">
        {/* Logo and Welcome */}
        <View className="mb-8 flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <Image
              source={require('@/assets/logo.png')}
              className="h-12 w-12"
              resizeMode="contain"
            />
            <View>
              <Text className="text-2xl font-bold text-[#1E2053]">بيتنا مُنتج</Text>
              <Text className="text-sm text-gray-600">منصة كويتية للإبداع المحلي</Text>
            </View>
          </View>

          {!user && (
            <TouchableOpacity
              className="flex-row items-center gap-1"
              onPress={() => router.push('/(auth)')}>
              <Text className="text-sm font-medium text-[#CAA453]">تسجيل الدخول</Text>
              <Ionicons name="log-in-outline" size={16} color="#CAA453" />
            </TouchableOpacity>
          )}
        </View>

        {/* Hero Content */}
        <View className="mb-8">
          <Text className="mb-3 text-3xl font-bold leading-tight text-[#1E2053]">
            نُـحيـي تـراثـنـا الخليجي العربي
            {'\n'}
            بـ<Text className="text-[#CAA453]">إبـداعـنـا</Text>
          </Text>
          <Text className="mb-6 text-base text-gray-600">
            منصة تجمع روّاد الأعمال، الأسر المنتجة، والمدربين
            {'\n'}
            لتعزيز الاقتصاد المحلي والحفاظ على هويتنا الخليجية
          </Text>

          {/* Quick Actions */}
          {!user && (
            <View className="mb-4 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-[#1E2053] px-4 py-3"
                onPress={() => router.push('/register/merchant')}
                activeOpacity={0.9}>
                <Ionicons name="storefront-outline" size={20} color="white" />
                <Text className="font-semibold text-white" numberOfLines={1}>
                  تسجيل تجاري
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-1 flex-row items-center justify-center gap-2 rounded-xl border-2 border-[#CAA453] px-4 py-3"
                onPress={() => router.push('/register/trainer')}
                activeOpacity={0.9}>
                <Ionicons name="school-outline" size={20} color="#CAA453" />
                <Text className="font-semibold text-[#CAA453]" numberOfLines={1}>
                  تسجيل مدرب
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>

      {/* Stats Banner */}
      <View className="mx-4 mb-6 rounded-xl bg-gray-50 p-4">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="text-2xl font-bold text-[#1E2053]">150+</Text>
            <Text className="text-sm text-gray-600">تاجر</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-[#1E2053]">80+</Text>
            <Text className="text-sm text-gray-600">مدرب</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-[#1E2053]">20+</Text>
            <Text className="text-sm text-gray-600">قسم</Text>
          </View>
        </View>
      </View>

      {/* Categories Section */}
      <View className="mb-8 px-4">
        <CategoriesGrid
          categories={categoriesData?.categories}
          loading={categoriesLoading}
          emptyStateTitle="لا توجد أقسام"
          emptyStateDescription="لم يتم إضافة أقسام بعد"
        />
      </View>

      {/* Featured Merchants */}
      <View className="mb-8 px-4">
        <FeaturedMerchants
          featuredMerchants={featuredData?.featuredMerchants}
          loading={featuredLoading}
          emptyStateTitle="لا توجد متاجر مميزة"
          emptyStateDescription="سيتم إضافة المتاجر قريباً"
        />
      </View>

      {/* Featured Trainers */}
      <View className="mb-8 px-4">
        <FeaturedTrainers
          featuredTrainers={featuredTrainersData?.featuredTrainers}
          loading={featuredTrainersLoading}
          emptyStateTitle="لا توجد مدربون متميزون"
          emptyStateDescription="سيتم إضافة المدربين قريباً"
        />
      </View>

      {/* Features */}
      <View className="mb-8 px-4">
        <Text className="mb-4 text-center text-xl font-bold text-[#1E2053]">
          لماذا بيتنا مُنتج؟
        </Text>
        <View className="flex-row flex-wrap gap-3">
          <View className="min-w-[48%] flex-1 rounded-xl bg-gray-50 p-4">
            <View className="mb-2 self-start rounded-lg bg-[#CAA453]/10 p-2">
              <Ionicons name="shield-checkmark-outline" size={20} color="#CAA453" />
            </View>
            <Text className="mb-1 font-bold text-[#1E2053]">آمن وموثوق</Text>
            <Text className="text-sm text-gray-600">منصة آمنة لجميع المعاملات</Text>
          </View>

          <View className="min-w-[48%] flex-1 rounded-xl bg-gray-50 p-4">
            <View className="mb-2 self-start rounded-lg bg-[#1E2053]/10 p-2">
              <Ionicons name="people-outline" size={20} color="#1E2053" />
            </View>
            <Text className="mb-1 font-bold text-[#1E2053]">مجتمع نشط</Text>
            <Text className="text-sm text-gray-600">تواصل مع مجتمع متنوع</Text>
          </View>

          <View className="min-w-[48%] flex-1 rounded-xl bg-gray-50 p-4">
            <View className="mb-2 self-start rounded-lg bg-[#CAA453]/10 p-2">
              <Ionicons name="trending-up-outline" size={20} color="#CAA453" />
            </View>
            <Text className="mb-1 font-bold text-[#1E2053]">نمو متسارع</Text>
            <Text className="text-sm text-gray-600">توسع في نشاطك التجاري</Text>
          </View>

          <View className="min-w-[48%] flex-1 rounded-xl bg-gray-50 p-4">
            <View className="mb-2 self-start rounded-lg bg-[#1E2053]/10 p-2">
              <Ionicons name="heart-outline" size={20} color="#1E2053" />
            </View>
            <Text className="mb-1 font-bold text-[#1E2053]">دعم محلي</Text>
            <Text className="text-sm text-gray-600">نساهم في الاقتصاد المحلي</Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="bg-gray-50 px-4 pb-8 pt-6">
        <View className="mb-4 items-center">
          <Image
            source={require('@/assets/logo.png')}
            className="mb-3 h-16 w-16"
            resizeMode="contain"
          />
          <Text className="mb-1 text-lg font-bold text-[#1E2053]">بيتنا مُنتج</Text>
          <Text className="text-center text-sm text-gray-600">
            منصة كويتية للإبداع المحلي وتنمية الاقتصاد الوطني
          </Text>
        </View>

        <View className="mb-4 flex-row flex-wrap justify-center gap-4">
          <TouchableOpacity onPress={() => router.push('/about')}>
            <Text className="text-sm text-gray-600">عن المنصة</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/contact')}>
            <Text className="text-sm text-gray-600">اتصل بنا</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/privacy')}>
            <Text className="text-sm text-gray-600">الخصوصية</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/terms')}>
            <Text className="text-sm text-gray-600">الشروط</Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center text-xs text-gray-500">
          © {new Date().getFullYear()} بيتنا مُنتج. جميع الحقوق محفوظة.
        </Text>
      </View>
    </ScrollView>
  );
}
