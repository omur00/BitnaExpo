import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GET_TRAINER_BY_SLUG } from '@/utils/queries';
import Loading from '@/components/Loading';
import { formatDate } from '@/utils/formatDate';
import { useQuery } from '@apollo/client/react';

export default function TrainerPage() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();

  const { data, loading, error } = useQuery(GET_TRAINER_BY_SLUG, {
    variables: { slug },
  });

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Ionicons name="alert-circle-outline" size={32} color="#7A8699" />
        <Text className="mt-2 text-sm text-[#4E6882]">
          {error.message || 'حدث خطأ في تحميل البيانات'}
        </Text>
      </View>
    );
  }

  const trainer = data?.trainerBySlug;

  if (!trainer) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Ionicons name="person-outline" size={32} color="#7A8699" />
        <Text className="mt-2 text-sm text-[#4E6882]">المدرب غير موجود</Text>
      </View>
    );
  }

  const handlePhoneCall = (phone) => {
    Linking.openURL(`tel:${phone}`).catch(() => {
      Alert.alert('خطأ', 'لا يمكن فتح تطبيق الهاتف');
    });
  };

  const handleWhatsApp = (whatsapp) => {
    Linking.openURL(`whatsapp://send?phone=${whatsapp}`).catch(() => {
      Alert.alert('خطأ', 'تطبيق واتساب غير مثبت');
    });
  };

  const handleEmail = (email) => {
    Linking.openURL(`mailto:${email}`).catch(() => {
      Alert.alert('خطأ', 'لا يمكن فتح تطبيق البريد');
    });
  };

  const handleWebsite = (url) => {
    Linking.openURL(url.startsWith('http') ? url : `https://${url}`).catch(() => {
      Alert.alert('خطأ', 'لا يمكن فتح الرابط');
    });
  };

  const handleInstagram = (username) => {
    const instagramUrl = `https://instagram.com/${username.replace('@', '')}`;
    Linking.openURL(instagramUrl).catch(() => {
      Alert.alert('خطأ', 'لا يمكن فتح حساب الانستغرام');
    });
  };

  const hasCoverImage = !!trainer.coverImage?.url;
  const hasGalleryImages = trainer.galleryImages && trainer.galleryImages.length > 0;
  const hasCourses = trainer.courses && trainer.courses.length > 0;

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* Cover Image Section */}
      {hasCoverImage && (
        <View className="h-48 w-full">
          <Image
            source={{ uri: trainer.coverImage.url }}
            className="h-full w-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/20" />
        </View>
      )}

      {/* Profile Header */}
      <View
        className={
          hasCoverImage
            ? 'relative z-10 -mt-16'
            : 'bg-gradient-to-r from-[#1E2053] to-[#2A4F68] py-6'
        }>
        <View className="px-4">
          <View className="flex-row items-center">
            {/* Profile Image */}
            <View className="mr-4">
              {trainer.logo?.url ? (
                <Image
                  source={{ uri: trainer.logo.url }}
                  className="h-24 w-24 rounded-full border-4 border-white"
                  resizeMode="cover"
                />
              ) : (
                <View
                  className={`h-24 w-24 rounded-full ${
                    hasCoverImage ? 'bg-white' : 'bg-white/10'
                  } items-center justify-center border-4 border-white`}>
                  <Ionicons
                    name="person-circle-outline"
                    size={48}
                    color={hasCoverImage ? '#4E6882' : 'white'}
                  />
                </View>
              )}
            </View>

            {/* Trainer Info */}
            <View className="flex-1">
              <Text className="text-2xl font-bold text-amber-600">{trainer.fullName}</Text>
              <Text className="mt-1 text-lg text-white opacity-90">{trainer.specialization}</Text>
              <View className="mt-2 flex-row flex-wrap gap-2">
                <View className="flex-row items-center rounded-full border border-white/30 bg-white/20 px-3 py-1 backdrop-blur-sm">
                  <Ionicons name="school-outline" size={12} color="white" />
                  <Text className="mr-1 text-sm text-white">{trainer.category.nameAr}</Text>
                </View>
                <View className="flex-row items-center rounded-full border border-white/30 bg-white/20 px-3 py-1 backdrop-blur-sm">
                  <Ionicons name="location-outline" size={12} color="white" />
                  <Text className="mr-1 text-sm text-white">{trainer.city.nameAr}</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View className="px-4 py-6">
        {/* About Section */}
        <View className="mb-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
          <View className="mb-3 flex-row items-center">
            <Ionicons name="person-outline" size={20} color="#CAA453" />
            <Text className="mr-2 text-lg font-bold text-[#18344A]">نبذة عن المدرب</Text>
          </View>
          <Text className="text-sm leading-6 text-[#4E6882]">{trainer.description}</Text>
        </View>

        {/* Gallery Images */}
        {hasGalleryImages && (
          <View className="mb-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
            <View className="mb-3 flex-row items-center">
              <Ionicons name="images-outline" size={20} color="#CAA453" />
              <Text className="mr-2 text-lg font-bold text-[#18344A]">
                معرض الصور ({trainer.galleryImages.length})
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {trainer.galleryImages.map((image) => (
                <Image
                  key={image.id}
                  source={{ uri: image.url }}
                  className="h-32 w-32 rounded-lg"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Courses & Services */}
        {hasCourses && (
          <View className="mb-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
            <View className="mb-3 flex-row items-center">
              <Ionicons name="book-outline" size={20} color="#CAA453" />
              <Text className="mr-2 text-lg font-bold text-[#18344A]">
                الدورات والخدمات ({trainer.courses.length})
              </Text>
            </View>
            <View className="space-y-3">
              {trainer.courses.map((course, index) => (
                <View key={index} className="rounded-lg border border-[#E5E7EB] bg-[#F7F9FA] p-3">
                  <View className="mb-2 flex-row items-start justify-between">
                    <Text className="flex-1 text-base font-semibold text-[#18344A]">
                      {course.name}
                    </Text>
                    <View className="rounded-full bg-[#1E2053] px-2 py-1">
                      <Text className="text-xs text-white">{course.level}</Text>
                    </View>
                  </View>

                  {course.description && (
                    <Text className="mb-2 text-sm text-[#4E6882]">{course.description}</Text>
                  )}

                  <View className="mb-2 flex-row flex-wrap gap-3">
                    {course.duration && (
                      <View className="flex-row items-center">
                        <Ionicons name="time-outline" size={12} color="#7A8699" />
                        <Text className="mr-1 text-xs text-[#7A8699]">{course.duration} دقيقة</Text>
                      </View>
                    )}
                    {course.price && (
                      <View className="flex-row items-center">
                        <Ionicons name="cash-outline" size={12} color="#7A8699" />
                        <Text className="mr-1 text-xs text-[#7A8699]">{course.price} ريال</Text>
                      </View>
                    )}
                    {course.sessions && (
                      <View className="flex-row items-center">
                        <Ionicons name="book-outline" size={12} color="#7A8699" />
                        <Text className="mr-1 text-xs text-[#7A8699]">{course.sessions} جلسة</Text>
                      </View>
                    )}
                  </View>

                  {course.includes && course.includes.length > 0 && (
                    <>
                      <Text className="mb-1 text-xs text-[#7A8699]">يشمل:</Text>
                      <View className="flex-row flex-wrap gap-1">
                        {course.includes.map((item, itemIndex) => (
                          <View
                            key={itemIndex}
                            className="flex-row items-center rounded-lg border border-[#CBD0D6] bg-white px-2 py-1">
                            <Ionicons name="checkmark-circle" size={12} color="#CAA453" />
                            <Text className="mr-1 text-xs text-[#1E2053]">{item}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact Card */}
        <View className="mb-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
          <Text className="mb-3 text-lg font-bold text-[#18344A]">معلومات التواصل</Text>

          <View className="space-y-2">
            {trainer.phone && (
              <TouchableOpacity
                onPress={() => handlePhoneCall(trainer.phone)}
                className="flex-row items-center rounded-lg border border-[#E5E7EB] bg-[#F7F9FA] p-3">
                <Ionicons name="call-outline" size={20} color="#4E6882" />
                <View className="mr-3 flex-1">
                  <Text className="text-xs text-[#7A8699]">رقم الجوال</Text>
                  <Text className="text-sm font-medium text-[#18344A]">{trainer.phone}</Text>
                </View>
              </TouchableOpacity>
            )}

            {trainer.whatsapp && (
              <TouchableOpacity
                onPress={() => handleWhatsApp(trainer.whatsapp)}
                className="flex-row items-center rounded-lg border border-[#E5E7EB] bg-[#F7F9FA] p-3">
                <Ionicons name="logo-whatsapp" size={20} color="#4E6882" />
                <View className="mr-3 flex-1">
                  <Text className="text-xs text-[#7A8699]">الواتساب</Text>
                  <Text className="text-sm font-medium text-[#18344A]">{trainer.whatsapp}</Text>
                </View>
              </TouchableOpacity>
            )}

            {trainer.email && (
              <TouchableOpacity
                onPress={() => handleEmail(trainer.email)}
                className="flex-row items-center rounded-lg border border-[#E5E7EB] bg-[#F7F9FA] p-3">
                <Ionicons name="mail-outline" size={20} color="#4E6882" />
                <View className="mr-3 flex-1">
                  <Text className="text-xs text-[#7A8699]">البريد الإلكتروني</Text>
                  <Text className="text-sm font-medium text-[#18344A]">{trainer.email}</Text>
                </View>
              </TouchableOpacity>
            )}

            {trainer.website && (
              <TouchableOpacity
                onPress={() => handleWebsite(trainer.website)}
                className="flex-row items-center rounded-lg border border-[#E5E7EB] bg-[#F7F9FA] p-3">
                <Ionicons name="globe-outline" size={20} color="#4E6882" />
                <View className="mr-3 flex-1">
                  <Text className="text-xs text-[#7A8699]">الموقع الإلكتروني</Text>
                  <Text className="text-sm font-medium text-[#18344A]">{trainer.website}</Text>
                </View>
              </TouchableOpacity>
            )}

            {trainer.instagram && (
              <TouchableOpacity
                onPress={() => handleInstagram(trainer.instagram)}
                className="flex-row items-center rounded-lg border border-[#E5E7EB] bg-[#F7F9FA] p-3">
                <Ionicons name="logo-instagram" size={20} color="#4E6882" />
                <View className="mr-3 flex-1">
                  <Text className="text-xs text-[#7A8699]">انستغرام</Text>
                  <Text className="text-sm font-medium text-[#18344A]">{trainer.instagram}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
          <Text className="mb-3 text-lg font-bold text-[#18344A]">تواصل سريع</Text>

          <View className="space-y-2">
            {trainer.whatsapp && (
              <TouchableOpacity
                onPress={() => handleWhatsApp(trainer.whatsapp)}
                className="flex-row items-center justify-center rounded-lg bg-[#1E2053] py-3">
                <Ionicons name="chatbubble-outline" size={16} color="white" />
                <Text className="mr-2 text-sm font-semibold text-white">محادثة واتساب</Text>
              </TouchableOpacity>
            )}

            {trainer.phone && (
              <TouchableOpacity
                onPress={() => handlePhoneCall(trainer.phone)}
                className="flex-row items-center justify-center rounded-lg bg-[#CAA453] py-3">
                <Ionicons name="call-outline" size={16} color="#1E2053" />
                <Text className="mr-2 text-sm font-semibold text-[#1E2053]">اتصل الآن</Text>
              </TouchableOpacity>
            )}

            {trainer.email && (
              <TouchableOpacity
                onPress={() => handleEmail(trainer.email)}
                className="flex-row items-center justify-center rounded-lg bg-[#1E2053] py-3">
                <Ionicons name="mail-outline" size={16} color="white" />
                <Text className="mr-2 text-sm font-semibold text-white">ارسل بريداً</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Additional Info */}
        <View className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <Text className="mb-3 text-lg font-bold text-[#18344A]">معلومات إضافية</Text>

          <View className="space-y-3">
            <View className="flex-row justify-between border-b border-[#F7F9FA] py-2">
              <Text className="flex-row items-center text-xs text-[#7A8699]">
                <Ionicons name="briefcase-outline" size={12} color="#7A8699" />
                <Text className="mr-1">التخصص:</Text>
              </Text>
              <Text className="text-xs font-medium text-[#18344A]">{trainer.specialization}</Text>
            </View>

            <View className="flex-row justify-between border-b border-[#F7F9FA] py-2">
              <Text className="flex-row items-center text-xs text-[#7A8699]">
                <Ionicons name="school-outline" size={12} color="#7A8699" />
                <Text className="mr-1">المجال:</Text>
              </Text>
              <Text className="text-xs font-medium text-[#18344A]">{trainer.category.nameAr}</Text>
            </View>

            <View className="flex-row justify-between border-b border-[#F7F9FA] py-2">
              <Text className="flex-row items-center text-xs text-[#7A8699]">
                <Ionicons name="location-outline" size={12} color="#7A8699" />
                <Text className="mr-1">المدينة:</Text>
              </Text>
              <Text className="text-xs font-medium text-[#18344A]">{trainer.city.nameAr}</Text>
            </View>

            <View className="flex-row justify-between py-2">
              <Text className="flex-row items-center text-xs text-[#7A8699]">
                <Ionicons name="calendar-outline" size={12} color="#7A8699" />
                <Text className="mr-1">تاريخ التسجيل:</Text>
              </Text>
              <Text className="text-xs font-medium text-[#18344A]">
                {formatDate(trainer.createdAt)}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
