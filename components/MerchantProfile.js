import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Loading from './Loading';
import StatusBadge from '@/utils/StatusBadge';
import { Ionicons } from '@expo/vector-icons';
import InfoCard from '@/utils/InfoCard';
import InfoField from '@/utils/InfoField';
import { useRouter } from 'expo-router';

const MerchantProfile = ({ merchant, loading }) => {
  const router = useRouter();

  return (
    <View className="flex-col gap-5">
      {/* Store Header Card */}
      <View className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
        {merchant?.coverImage && (
          <Image
            source={{ uri: merchant.coverImage.url }}
            className="h-32 w-full"
            resizeMode="cover"
          />
        )}
        <View className="p-4">
          <View className="mb-4 flex-col items-start justify-between gap-2 md:flex-row">
            <View className="flex-row items-start gap-3">
              {merchant?.logo && (
                <Image
                  source={{ uri: merchant.logo.url }}
                  className="h-16 w-16 rounded-xl border-2 border-white"
                  resizeMode="cover"
                />
              )}
              <View>
                <Text className="font-inter mb-1 text-lg font-bold text-[#18344A]">
                  {merchant?.businessName || 'اسم المتجر'}
                </Text>
                <View className="flex-row items-center gap-2">
                  {merchant?.category?.nameAr && (
                    <Text className="rounded-full bg-[#F7F9FA] px-2 py-1 text-xs text-[#1E2053]">
                      {merchant.category.nameAr}
                    </Text>
                  )}
                  {merchant?.city?.nameAr && (
                    <View className="flex-row items-center gap-1">
                      <Ionicons name="location-outline" size={12} color="#4E6882" />
                      <Text className="text-xs text-[#4E6882]">{merchant.city.nameAr}</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>
            {merchant && <StatusBadge status={merchant.status} />}
          </View>

          <View className="flex-col items-start justify-between gap-3 pt-3 md:flex-row">
            {merchant?.description && (
              <Text className="flex-1 text-sm text-[#4E6882]">{merchant.description}</Text>
            )}
            <TouchableOpacity
              onPress={() => router.push(`/(stacks)/category/merchant/${merchant?.slug}`)}
              className="rounded-md bg-[#CAA453] px-3 py-1">
              <Text className="text-sm text-white">الصفحة الشخصية</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {loading ? (
        <View className="items-center py-8">
          <Loading />
          <Text className="mt-2 text-sm text-[#4E6882]">جاري تحميل معلومات المتجر...</Text>
        </View>
      ) : merchant ? (
        <>
          <TouchableOpacity
            onPress={() => {
              router.push({
                pathname: '/(auth)/dashboard/edit/merchantForm',
                params: {
                  merchant: JSON.stringify(merchant),
                },
              });
            }}
            className="flex w-full flex-row items-center gap-2 self-start rounded-lg border border-[#1E2053] px-6 py-4">
            <Ionicons name="pencil" size={16} color="#1E2053" />
            <Text className="font-inter flex-shrink text-sm text-[#1E2053]" numberOfLines={1}>
              تحديث بيانات المتجر
            </Text>
          </TouchableOpacity>

          <View className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <InfoCard icon="PhoneIcon" title="معلومات التواصل">
              <InfoField icon="PhoneIcon" label="رقم الجوال" value={merchant.phone} />
              <InfoField icon="ChatBubbleLeftIcon" label="رقم الواتساب" value={merchant.whatsapp} />
              <InfoField icon="EnvelopeIcon" label="البريد الإلكتروني" value={merchant.email} />
              <InfoField
                icon="GlobeAltIcon"
                label="الموقع الإلكتروني"
                value={merchant.website}
                href={merchant.website}
              />
              <InfoField icon="PhotoIcon" label="حساب انستغرام" value={merchant.instagram} />
            </InfoCard>

            <InfoCard icon="DocumentTextIcon" title="تفاصيل النشاط">
              <InfoField
                icon="BuildingStorefrontIcon"
                label="نوع المستند"
                value={merchant.documentType}
              />
              {merchant.verificationDocument && (
                <InfoField
                  icon="DocumentTextIcon"
                  label="مستند التحقق"
                  value="عرض المستند"
                  href={merchant.verificationDocument}
                />
              )}
              <InfoField
                icon="CheckBadgeIcon"
                label="مميز"
                value={merchant.isFeatured ? 'نعم' : 'لا'}
              />
            </InfoCard>

            <InfoCard icon="MapPinIcon" title="الموقع وساعات العمل">
              <InfoField icon="MapPinIcon" label="العنوان" value={merchant.address} />
              {merchant.workHours && (
                <InfoField
                  icon="ClockIcon"
                  label="ساعات العمل"
                  value={`من ${merchant.workHours.from} إلى ${merchant.workHours.to}`}
                />
              )}
            </InfoCard>
          </View>
        </>
      ) : (
        <View className="items-center rounded-xl border border-[#E5E7EB] bg-white py-8">
          <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-[#F7F9FA]">
            <Ionicons name="business-outline" size={32} color="#1E2053" />
          </View>
          <Text className="mb-2 text-lg font-bold text-[#18344A]">لا توجد بيانات متجر</Text>
          <Text className="mb-6 text-center text-sm text-[#4E6882]">
            يمكنك إضافة بيانات متجرك لعرضه على المنصة والوصول إلى العملاء
          </Text>
          <TouchableOpacity
            onPress={() => router.push('/(auth)/dashboard/edit/merchantForm')}
            className="rounded-lg bg-[#1E2053] px-6 py-4 w-[90%]">
            <Text className="text-center text-sm text-white">إضافة بيانات المتجر</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default MerchantProfile;
