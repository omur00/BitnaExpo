import { View, Text, TouchableOpacity, Image } from 'react-native';
import React from 'react';
import Loading from '@/components/Loading';
import StatusBadge from '@/utils/StatusBadge';
import InfoCard from '@/utils/InfoCard';
import InfoField from '@/utils/InfoField';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const TrainerProfile = ({ trainer, loading }) => {
  const router = useRouter();

  return (
    <View className="overflow-hidden rounded-xl border border-[#E5E7EB] bg-white">
      {trainer?.coverImage && (
        <Image
          source={{ uri: trainer.coverImage.url }}
          className="h-32 w-full"
          resizeMode="cover"
        />
      )}
      <View className="p-4">
        <Text className="mb-6 text-lg font-bold text-[#18344A]">معلومات المدرب</Text>

        {loading ? (
          <View className="py-6">
            <Loading />
          </View>
        ) : trainer ? (
          <View className="gap-4">
            <View className="flex-row items-start gap-4">
              {trainer.logo && (
                <Image
                  source={{ uri: trainer.logo.url }}
                  className="h-16 w-16 rounded-xl border-2 border-white"
                  resizeMode="cover"
                />
              )}
              <View className="flex-1">
                <View className="mb-2 flex-row justify-between">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-[#18344A]">{trainer.fullName}</Text>
                    <Text className="mt-1 text-sm text-[#4E6882]">{trainer.specialization}</Text>
                  </View>
                  <StatusBadge status={trainer.status} />
                </View>
                {trainer.category && (
                  <Text className="mt-1 text-sm text-[#7A8699]">{trainer.category.nameAr}</Text>
                )}
              </View>
            </View>

            {trainer.description && (
              <View className="gap-3 rounded-lg bg-[#F7F9FA] p-4">
                <Text className="text-sm text-[#4E6882]">{trainer.description}</Text>
                <TouchableOpacity
                  onPress={() => router.push(`/(stacks)/category/trainer/${trainer.slug}`)}
                  className="self-start rounded-md bg-[#CAA453] px-4 py-2">
                  <Text className="text-sm text-white">الصفحة الشخصية</Text>
                </TouchableOpacity>
              </View>
            )}

            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/(auth)/dashboard/edit/trainerForm',
                  params: {
                    trainer: JSON.stringify(trainer),
                  },
                });
              }}
              className="w-full flex-row items-center gap-2 self-start rounded-lg bg-[#1E2053] px-6 py-4">
              <Ionicons name="create-outline" size={16} color="#FFFFFF" />
              <Text className="text-sm text-white">تحديث البيانات</Text>
            </TouchableOpacity>

            <View className="space-y-4">
              <View className="flex-col gap-4">
                <InfoCard icon="PhoneIcon" title="معلومات التواصل">
                  <View className="space-y-3">
                    <InfoField icon="PhoneIcon" label="رقم الجوال" value={trainer.phone} />
                    <InfoField
                      icon="ChatBubbleLeftIcon"
                      label="الواتساب"
                      value={trainer.whatsapp}
                    />
                    <InfoField
                      icon="EnvelopeIcon"
                      label="البريد الإلكتروني"
                      value={trainer.email}
                    />
                  </View>
                </InfoCard>
                <InfoCard icon="GlobeAltIcon" title="وسائل التواصل">
                  <View className="space-y-3">
                    <InfoField icon="PhotoIcon" label="إنستغرام" value={trainer.instagram} />
                    <InfoField
                      icon="GlobeAltIcon"
                      label="الموقع الإلكتروني"
                      value={trainer.website}
                      href={trainer.website}
                    />
                    <InfoField icon="MapPinIcon" label="المدينة" value={trainer.city?.nameAr} />
                  </View>
                </InfoCard>
              </View>
            </View>
          </View>
        ) : (
          <View className="items-center space-y-4 py-8">
            <View className="mb-2 h-16 w-16 items-center justify-center rounded-full bg-[#F7F9FA]">
              <Ionicons name="person-outline" size={32} color="#1E2053" />
            </View>
            <Text className="mb-2 text-lg font-bold text-[#18344A]">لا توجد بيانات حساب مدرب</Text>
            <Text className="mb-6 text-center text-sm text-[#4E6882]">
              يمكنك إضافة بياناتك لعرض خدماتك على المنصة
            </Text>
            <TouchableOpacity
              onPress={() => {
                router.push({
                  pathname: '/(auth)/dashboard/edit/trainerForm',
                  params: { trainerId: null },
                });
              }}
              className="flex-row items-center gap-2 rounded-lg bg-[#1E2053] px-6 py-3">
              {/* Increased padding */}
              <Ionicons name="add-circle-outline" size={16} color="white" />
              <Text className="text-sm text-white">إضافة بيانات المدرب</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

export default TrainerProfile;
