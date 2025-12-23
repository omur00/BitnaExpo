import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
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
        {/* App Name Header */}
        <View className="mb-8 items-center">
          <Text className="font-arabic-bold text-3xl text-[#1E2053]">بيتنا مُنتج</Text>
          <Text className="font-arabic-regular mt-1 text-sm text-gray-600">
            منصة كويتية للإبداع المحلي
          </Text>
        </View>

        {/* Hero Content */}
        <View className="mb-8 items-center">
          <Text className="font-arabic-bold mb-3 text-center text-2xl leading-tight text-[#1E2053]">
            نُـحيـي تـراثـنـا الخليجي العربي بـ<Text className="text-[#CAA453]">إبـداعـنـا</Text>
          </Text>
          <Text className="font-arabic-regular mb-6 text-center text-sm text-gray-600">
            منصة تجمع روّاد الأعمال، الأسر المنتجة، والمدربين لتعزيز الاقتصاد المحلي والحفاظ على
            هويتنا الخليجية
          </Text>

          {/* Main CTA Button */}
          {!user && (
            <TouchableOpacity
              className="w-full flex-row items-center justify-center gap-2 rounded-xl bg-[#1E2053] px-4 py-4"
              onPress={() => router.push('/register/role')}
              activeOpacity={0.9}>
              <Ionicons name="rocket-outline" size={20} color="white" />
              <Text className="font-arabic-semibold text-base text-white" numberOfLines={1}>
                ابدأ رحلتك الآن
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Rest of the component remains the same... */}
      {/* Stats Banner */}
      <View className="mx-4 mb-6 rounded-xl bg-gray-50 p-4">
        <View className="flex-row justify-around">
          <View className="items-center">
            <Text className="font-arabic-extrabold text-xl text-[#1E2053]">150+</Text>
            <Text className="font-arabic-regular text-xs text-gray-600">تاجر</Text>
          </View>
          <View className="items-center">
            <Text className="font-arabic-extrabold text-xl text-[#1E2053]">80+</Text>
            <Text className="font-arabic-regular text-xs text-gray-600">مدرب</Text>
          </View>
          <View className="items-center">
            <Text className="font-arabic-extrabold text-xl text-[#1E2053]">20+</Text>
            <Text className="font-arabic-regular text-xs text-gray-600">قسم</Text>
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
        <Text className="font-arabic-bold mb-4 text-center text-lg text-[#1E2053]">
          لماذا بيتنا مُنتج؟
        </Text>
        <View className="flex-row flex-wrap gap-3">
          <View className="min-w-[48%] flex-1 rounded-xl bg-gray-50 p-4">
            <View className="mb-2 self-start rounded-lg bg-[#CAA453]/10 p-2">
              <Ionicons name="shield-checkmark-outline" size={20} color="#CAA453" />
            </View>
            <Text className="font-arabic-semibold mb-1 text-sm text-[#1E2053]">آمن وموثوق</Text>
            <Text className="font-arabic-regular text-xs text-gray-600">
              منصة آمنة لجميع المعاملات
            </Text>
          </View>

          <View className="min-w-[48%] flex-1 rounded-xl bg-gray-50 p-4">
            <View className="mb-2 self-start rounded-lg bg-[#1E2053]/10 p-2">
              <Ionicons name="people-outline" size={20} color="#1E2053" />
            </View>
            <Text className="font-arabic-semibold mb-1 text-sm text-[#1E2053]">مجتمع نشط</Text>
            <Text className="font-arabic-regular text-xs text-gray-600">تواصل مع مجتمع متنوع</Text>
          </View>

          <View className="min-w-[48%] flex-1 rounded-xl bg-gray-50 p-4">
            <View className="mb-2 self-start rounded-lg bg-[#CAA453]/10 p-2">
              <Ionicons name="trending-up-outline" size={20} color="#CAA453" />
            </View>
            <Text className="font-arabic-semibold mb-1 text-sm text-[#1E2053]">نمو متسارع</Text>
            <Text className="font-arabic-regular text-xs text-gray-600">توسع في نشاطك التجاري</Text>
          </View>

          <View className="min-w-[48%] flex-1 rounded-xl bg-gray-50 p-4">
            <View className="mb-2 self-start rounded-lg bg-[#1E2053]/10 p-2">
              <Ionicons name="heart-outline" size={20} color="#1E2053" />
            </View>
            <Text className="font-arabic-semibold mb-1 text-sm text-[#1E2053]">دعم محلي</Text>
            <Text className="font-arabic-regular text-xs text-gray-600">
              نساهم في الاقتصاد المحلي
            </Text>
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="bg-gray-50 px-4 pb-8 pt-6">
        <View className="mb-4 items-center">
          <Text className="font-arabic-bold mb-1 text-lg text-[#1E2053]">بيتنا مُنتج</Text>
          <Text className="font-arabic-regular text-center text-sm text-gray-600">
            منصة كويتية للإبداع المحلي وتنمية الاقتصاد الوطني
          </Text>
        </View>

        <View className="mb-4 flex-row flex-wrap justify-center gap-4">
          <TouchableOpacity
            onPress={() => {
              Linking.openURL('mailto:info@biitna.com').catch(() => {
                Alert.alert('خطأ', 'لا يمكن فتح تطبيق البريد الإلكتروني');
              });
            }}>
            <Text className="font-arabic-regular text-sm text-gray-600">اتصل بنا</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/(stacks)/termsAndConditions')}>
            <Text className="font-arabic-regular text-sm text-gray-600">الشروط والأحكام</Text>
          </TouchableOpacity>
        </View>

        <Text className="font-arabic-light text-center text-xs text-gray-500">
          © {new Date().getFullYear()} بيتنا مُنتج. جميع الحقوق محفوظة.
        </Text>
      </View>
    </ScrollView>
  );
}
