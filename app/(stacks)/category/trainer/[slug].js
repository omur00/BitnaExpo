import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GET_TRAINER_BY_SLUG } from '@/utils/queries';
import Loading from '@/components/Loading';
import { formatDate } from '@/utils/formatDate';
import { useQuery } from '@apollo/client/react';
import { LinearGradient } from 'expo-linear-gradient';

export default function TrainerPage() {
  const { slug } = useLocalSearchParams();

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

  // Fixed: Check if image URLs exist directly
  const hasCoverImage = !!trainer.coverImage;
  const hasLogo = !!trainer.logo;
  const hasGalleryImages = trainer.galleryImages && trainer.galleryImages.length > 0;
  const hasCourses = trainer.courses && trainer.courses.length > 0;

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* Enhanced Header Section */}
      <View className="relative">
        {/* Cover Image or Gradient Background */}
        {hasCoverImage ? (
          <View className="h-48 w-full">
            <Image
              source={{ uri: trainer.coverImage }}
              className="h-full w-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </View>
        ) : (
          <LinearGradient
            colors={['#1E2053', '#2A4F68']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="h-36 w-full"
          />
        )}

        {/* Profile Card Overlay */}
        <View className="relative z-10 mx-4 -mt-10">
          <View
            className="rounded-2xl bg-white p-5 shadow-lg"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.1,
              shadowRadius: 12,
              elevation: 5,
            }}>
            <View className="flex-row items-start">
              {/* Profile Image */}
              <View className="-mt-12 mr-4">
                {hasLogo ? (
                  <View className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white">
                    <Image
                      source={{ uri: trainer.logo }}
                      className="h-full w-full"
                      resizeMode="cover"
                    />
                  </View>
                ) : (
                  <View className="h-24 w-24 items-center justify-center rounded-2xl border-4 border-gray-200">
                    <Ionicons name="person" size={40} color="gray" />
                  </View>
                )}
              </View>

              {/* Trainer Info */}
              <View className="flex-1">
                <Text className="font-poppins text-2xl font-bold text-[#18344A]">
                  {trainer.fullName}
                </Text>
                <Text className="font-inter mt-1 text-base font-medium text-[#CAA453]">
                  {trainer.specialization}
                </Text>

                <View className="mt-3 flex-row flex-wrap gap-2">
                  <View className="flex-row items-center rounded-full bg-[#F7F9FA] px-3 py-1.5">
                    <Ionicons name="school-outline" size={14} color="#4E6882" />
                    <Text className="font-inter mr-2 text-sm text-[#4E6882]">
                      {trainer.category.nameAr}
                    </Text>
                  </View>
                  <View className="flex-row items-center rounded-full bg-[#F7F9FA] px-3 py-1.5">
                    <Ionicons name="location-outline" size={14} color="#4E6882" />
                    <Text className="font-inter mr-2 text-sm text-[#4E6882]">
                      {trainer.city.nameAr}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Stats */}
            <View className="mt-4 flex-row justify-around border-t border-[#F0F2F5] pt-4">
              <View className="items-center">
                <Text className="font-poppins text-lg font-bold text-[#1E2053]">
                  {trainer.courses?.length || 0}
                </Text>
                <Text className="font-inter text-xs text-[#7A8699]">دورات</Text>
              </View>
              <View className="items-center">
                <Text className="font-poppins text-lg font-bold text-[#1E2053]">
                  {trainer.galleryImages?.length || 0}
                </Text>
                <Text className="font-inter text-xs text-[#7A8699]">صور</Text>
              </View>
              <View className="items-center">
                <Ionicons name="star" size={20} color="#FFB800" />
                <Text className="font-inter mt-1 text-xs text-[#7A8699]">ممتاز</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Content Sections */}
      <View className="mt-6 px-4">
        {/* About Section */}
        <View
          className="mb-6 rounded-2xl bg-white p-5 shadow-sm"
          style={{
            shadowColor: 'rgba(24,52,74,0.08)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 2,
          }}>
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-8 w-1 rounded-full bg-[#CAA453]" />
            <Text className="font-poppins text-xl font-bold text-[#18344A]">نبذة عن المدرب</Text>
          </View>
          <Text className="font-inter text-sm leading-6 text-[#4E6882]">{trainer.description}</Text>
        </View>

        {/* Gallery Images */}
        {hasGalleryImages && (
          <View
            className="mb-6 rounded-2xl bg-white p-5 shadow-sm"
            style={{
              shadowColor: 'rgba(24,52,74,0.08)',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 8,
              elevation: 2,
            }}>
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="mr-3 h-8 w-1 rounded-full bg-[#CAA453]" />
                <Text className="font-poppins text-xl font-bold text-[#18344A]">معرض الصور</Text>
              </View>
              <Text className="font-inter text-sm text-[#7A8699]">
                {trainer.galleryImages.length} صورة
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {trainer.galleryImages.map((image, index) => (
                  <TouchableOpacity key={index} activeOpacity={0.8}>
                    <Image
                      source={{ uri: image }}
                      className="h-36 w-36 rounded-xl"
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        )}

        {/* Courses & Services */}
        {hasCourses && (
          <View
            className="mb-6 rounded-2xl bg-white p-5 shadow-sm"
            style={{
              shadowColor: 'rgba(24,52,74,0.08)',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 1,
              shadowRadius: 8,
              elevation: 2,
            }}>
            <View className="mb-4 flex-row items-center justify-between">
              <View className="flex-row items-center">
                <View className="mr-3 h-8 w-1 rounded-full bg-[#CAA453]" />
                <Text className="font-poppins text-xl font-bold text-[#18344A]">
                  الدورات والخدمات
                </Text>
              </View>
              <Text className="font-inter text-sm text-[#7A8699]">
                {trainer.courses.length} دورة
              </Text>
            </View>
            <View className="gap-4">
              {trainer.courses.map((course, index) => (
                <View
                  key={index}
                  className="rounded-xl border border-[#E5E7EB] bg-white p-4"
                  style={{
                    shadowColor: 'rgba(24,52,74,0.05)',
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 1,
                    shadowRadius: 6,
                    elevation: 1,
                  }}>
                  <View className="mb-3 flex-row items-start justify-between">
                    <Text className="font-inter flex-1 text-base font-semibold text-[#18344A]">
                      {course.name}
                    </Text>
                    <View className="rounded-lg bg-[#1E2053] px-3 py-1">
                      <Text className="font-inter text-xs text-white">{course.level}</Text>
                    </View>
                  </View>

                  {course.description && (
                    <Text className="font-inter mb-3 text-sm text-[#4E6882]">
                      {course.description}
                    </Text>
                  )}

                  <View className="mb-4 flex-row flex-wrap gap-4">
                    {course.duration && (
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="time-outline" size={14} color="#7A8699" />
                        <Text className="font-inter text-xs text-[#7A8699]">
                          {course.duration} دقيقة
                        </Text>
                      </View>
                    )}
                    {course.price && (
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="cash-outline" size={14} color="#7A8699" />
                        <Text className="font-inter text-xs text-[#7A8699]">
                          {course.price} ريال
                        </Text>
                      </View>
                    )}
                    {course.sessions && (
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="book-outline" size={14} color="#7A8699" />
                        <Text className="font-inter text-xs text-[#7A8699]">
                          {course.sessions} جلسة
                        </Text>
                      </View>
                    )}
                  </View>

                  {course.includes && course.includes.length > 0 && (
                    <View className="border-t border-[#F0F2F5] pt-3">
                      <Text className="font-inter mb-2 text-xs font-medium text-[#7A8699]">
                        يشمل:
                      </Text>
                      <View className="flex-row flex-wrap gap-2">
                        {course.includes.map((item, itemIndex) => (
                          <View
                            key={itemIndex}
                            className="flex-row items-center gap-1 rounded-lg bg-[#F7F9FA] px-2 py-1.5">
                            <Ionicons name="checkmark-circle" size={12} color="#CAA453" />
                            <Text className="font-inter text-xs text-[#1E2053]">{item}</Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Contact Section */}
        <View
          className="mb-6 rounded-2xl bg-white p-5 shadow-sm"
          style={{
            shadowColor: 'rgba(24,52,74,0.08)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 2,
          }}>
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-8 w-1 rounded-full bg-[#CAA453]" />
            <Text className="font-poppins text-xl font-bold text-[#18344A]">معلومات التواصل</Text>
          </View>

          <View className="gap-3">
            {trainer.phone && (
              <TouchableOpacity
                onPress={() => handlePhoneCall(trainer.phone)}
                className="flex-row items-center rounded-xl bg-[#F7F9FA] p-4 active:bg-[#EFF2F7]">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-[#1E2053]">
                  <Ionicons name="call-outline" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-inter text-xs text-[#7A8699]">رقم الجوال</Text>
                  <Text className="font-inter mt-1 text-sm font-semibold text-[#18344A]">
                    {trainer.phone}
                  </Text>
                </View>
                <Ionicons name="chevron-back" size={20} color="#CBD0D6" />
              </TouchableOpacity>
            )}

            {trainer.whatsapp && (
              <TouchableOpacity
                onPress={() => handleWhatsApp(trainer.whatsapp)}
                className="flex-row items-center rounded-xl bg-[#F7F9FA] p-4 active:bg-[#EFF2F7]">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-[#25D366]">
                  <Ionicons name="logo-whatsapp" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-inter text-xs text-[#7A8699]">الواتساب</Text>
                  <Text className="font-inter mt-1 text-sm font-semibold text-[#18344A]">
                    {trainer.whatsapp}
                  </Text>
                </View>
                <Ionicons name="chevron-back" size={20} color="#CBD0D6" />
              </TouchableOpacity>
            )}

            {trainer.email && (
              <TouchableOpacity
                onPress={() => handleEmail(trainer.email)}
                className="flex-row items-center rounded-xl bg-[#F7F9FA] p-4 active:bg-[#EFF2F7]">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-[#EA4335]">
                  <Ionicons name="mail-outline" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-inter text-xs text-[#7A8699]">البريد الإلكتروني</Text>
                  <Text className="font-inter mt-1 text-sm font-semibold text-[#18344A]">
                    {trainer.email}
                  </Text>
                </View>
                <Ionicons name="chevron-back" size={20} color="#CBD0D6" />
              </TouchableOpacity>
            )}

            {trainer.website && (
              <TouchableOpacity
                onPress={() => handleWebsite(trainer.website)}
                className="flex-row items-center rounded-xl bg-[#F7F9FA] p-4 active:bg-[#EFF2F7]">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-[#4285F4]">
                  <Ionicons name="globe-outline" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-inter text-xs text-[#7A8699]">الموقع الإلكتروني</Text>
                  <Text className="font-inter mt-1 text-sm font-semibold text-[#18344A]">
                    {trainer.website}
                  </Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CBD0D6" />
              </TouchableOpacity>
            )}

            {trainer.instagram && (
              <TouchableOpacity
                onPress={() => handleInstagram(trainer.instagram)}
                className="flex-row items-center rounded-xl bg-[#F7F9FA] p-4 active:bg-[#EFF2F7]">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-[#405DE6] via-[#833AB4] to-[#C13584]">
                  <Ionicons name="logo-instagram" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-inter text-xs text-[#7A8699]">انستغرام</Text>
                  <Text className="font-inter mt-1 text-sm font-semibold text-[#18344A]">
                    {trainer.instagram}
                  </Text>
                </View>
                <Ionicons name="chevron-back" size={20} color="#CBD0D6" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mb-6 rounded-2xl bg-gradient-to-r from-[#1E2053] to-[#2A4F68] p-5">
          <Text className="font-poppins mb-4 text-xl font-bold text-white">تواصل سريع</Text>

          <View className="flex-row gap-3">
            {trainer.whatsapp && (
              <TouchableOpacity
                onPress={() => handleWhatsApp(trainer.whatsapp)}
                className="flex-1 flex-row items-center justify-center rounded-xl bg-gray-200 py-3 active:bg-white/90">
                <Ionicons name="chatbubble-outline" size={18} color="#1E2053" />
                <Text className="font-inter mr-2 text-sm font-semibold text-[#1E2053]">واتساب</Text>
              </TouchableOpacity>
            )}

            {trainer.phone && (
              <TouchableOpacity
                onPress={() => handlePhoneCall(trainer.phone)}
                className="flex-1 flex-row items-center justify-center rounded-xl bg-[#CAA453] py-3">
                <Ionicons name="call-outline" size={18} color="#1E2053" />
                <Text className="font-inter mr-2 text-sm font-semibold text-[#1E2053]">اتصال</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Additional Info */}
        <View
          className="rounded-2xl bg-white p-5 shadow-sm"
          style={{
            shadowColor: 'rgba(24,52,74,0.08)',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 1,
            shadowRadius: 8,
            elevation: 2,
          }}>
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-8 w-1 rounded-full bg-[#CAA453]" />
            <Text className="font-poppins text-xl font-bold text-[#18344A]">معلومات إضافية</Text>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center justify-between rounded-lg bg-[#F7F9FA] p-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="briefcase-outline" size={16} color="#7A8699" />
                <Text className="font-inter text-sm text-[#7A8699]">التخصص</Text>
              </View>
              <Text className="font-inter text-sm font-semibold text-[#18344A]">
                {trainer.specialization}
              </Text>
            </View>

            <View className="flex-row items-center justify-between rounded-lg bg-[#F7F9FA] p-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="school-outline" size={16} color="#7A8699" />
                <Text className="font-inter text-sm text-[#7A8699]">المجال</Text>
              </View>
              <Text className="font-inter text-sm font-semibold text-[#18344A]">
                {trainer.category.nameAr}
              </Text>
            </View>

            <View className="flex-row items-center justify-between rounded-lg bg-[#F7F9FA] p-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="location-outline" size={16} color="#7A8699" />
                <Text className="font-inter text-sm text-[#7A8699]">المدينة</Text>
              </View>
              <Text className="font-inter text-sm font-semibold text-[#18344A]">
                {trainer.city.nameAr}
              </Text>
            </View>

            <View className="flex-row items-center justify-between rounded-lg bg-[#F7F9FA] p-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="calendar-outline" size={16} color="#7A8699" />
                <Text className="font-inter text-sm text-[#7A8699]">تاريخ التسجيل</Text>
              </View>
              <Text className="font-inter text-sm font-semibold text-[#18344A]">
                {formatDate(trainer.createdAt)}
              </Text>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-6" />
      </View>
    </ScrollView>
  );
}
