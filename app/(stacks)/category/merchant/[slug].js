import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GET_MERCHANT_BY_SLUG } from '@/utils/queries';
import Loading from '@/components/Loading';
import { useQuery } from '@apollo/client/react';

export default function MerchantPage() {
  const { slug } = useLocalSearchParams();

  const { data, loading, error } = useQuery(GET_MERCHANT_BY_SLUG, {
    variables: { slug },
  });

  if (loading) return <Loading />;

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

  const merchant = data?.merchantBySlug;

  if (!merchant) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Ionicons name="storefront-outline" size={32} color="#7A8699" />
        <Text className="mt-2 text-sm text-[#4E6882]">النشاط غير موجود</Text>
      </View>
    );
  }

  const businessName = merchant.businessName || 'لا يوجد اسم للنشاط';
  const description = merchant.description || 'لا يوجد وصف متاح';
  const categoryName = merchant.category?.nameAr || 'غير محدد';
  const cityName = merchant.city?.nameAr || 'غير محدد';
  const whatsappNumber = merchant.whatsapp?.replace(/\D/g, '') || null;

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
    const instagramUrl = username.startsWith('@')
      ? `https://instagram.com/${username.slice(1)}`
      : username;
    Linking.openURL(instagramUrl).catch(() => {
      Alert.alert('خطأ', 'لا يمكن فتح حساب الانستغرام');
    });
  };

  // FIXED: Properly check image URLs
  const hasCoverImage = merchant.coverImage && merchant.coverImage.url;
  const hasLogo = merchant.logo && merchant.logo.url;
  const hasGalleryImages = merchant.galleryImages && merchant.galleryImages.length > 0;

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View className="relative">
        {/* Cover Image */}
        {hasCoverImage && (
          <View className="h-48 w-full">
            <Image
              source={{ uri: merchant.coverImage.url }}
              className="h-full w-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-black/30" />
          </View>
        )}

        {/* Business Card */}
        <View className={`px-4 ${hasCoverImage ? 'relative z-10 -mt-12' : 'pt-6'}`}>
          <View className="rounded-xl border border-[#E5E7EB] bg-white p-5">
            <View className="flex-row gap-2">
              {/* Logo */}
              <View>
                {hasLogo ? (
                  <Image
                    source={{ uri: merchant.logo.url }}
                    className="h-20 w-20 rounded-lg border-2 border-white"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-20 w-20 items-center justify-center rounded-lg border-2 border-gray-500">
                    <Ionicons name="storefront-outline" size={32} color="black" />
                  </View>
                )}
              </View>

              {/* Business Info */}
              <View className="mr-4 flex-1">
                <Text className="font-arabic-bold text-lg text-[#18344A]">{businessName}</Text>
                <Text className="font-arabic-regular mt-1 text-sm text-[#4E6882]">
                  {merchant.specialization || merchant.category?.nameAr}
                </Text>

                <View className="mt-3 flex-row flex-wrap gap-2">
                  <View className="flex-row items-center gap-2 rounded-full bg-[#F7F9FA] px-3 py-1.5">
                    <Ionicons name="business-outline" size={14} color="#4E6882" />
                    <Text className="font-arabic-regular text-xs text-[#4E6882]">
                      {categoryName}
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2 rounded-full bg-[#F7F9FA] px-3 py-1.5">
                    <Ionicons name="location-outline" size={14} color="#4E6882" />
                    <Text className="font-arabic-regular text-xs text-[#4E6882]">{cityName}</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Quick Actions */}
            <View className="mt-4 flex-row gap-3">
              {whatsappNumber && (
                <TouchableOpacity
                  onPress={() => handleWhatsApp(whatsappNumber)}
                  className="flex-1 flex-row items-center justify-center gap-1 rounded-lg bg-[#1E2053] py-3">
                  <Ionicons name="chatbubble-outline" size={16} color="white" />
                  <Text className="font-arabic-semibold mr-2 text-sm text-white">واتساب</Text>
                </TouchableOpacity>
              )}
              {merchant.phone && (
                <TouchableOpacity
                  onPress={() => handlePhoneCall(merchant.phone)}
                  className="flex-1 flex-row items-center justify-center gap-1 rounded-lg bg-[#CAA453] py-3">
                  <Ionicons name="call-outline" size={16} color="#1E2053" />
                  <Text className="font-arabic-semibold mr-2 text-sm text-[#1E2053]">اتصال</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="mt-6 px-4">
        {/* About Section */}
        <View className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Ionicons name="document-text-outline" size={20} color="#CAA453" />
            <Text className="font-arabic-bold text-base text-[#18344A]">عن النشاط</Text>
          </View>
          <Text className="font-arabic-regular text-sm leading-6 text-[#4E6882]">
            {description}
          </Text>
        </View>

        {/* Gallery Images */}
        <View className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-5">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <Ionicons name="images-outline" size={20} color="#CAA453" />
              <Text className="font-arabic-bold text-base text-[#18344A]">معرض الصور</Text>
            </View>
            <Text className="font-arabic-regular text-xs text-[#7A8699]">
              {hasGalleryImages ? `${merchant.galleryImages.length} صورة` : 'لا توجد صور'}
            </Text>
          </View>

          {hasGalleryImages ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row gap-3">
                {merchant.galleryImages.map((image, index) => (
                  <Image
                    key={image.id || index}
                    source={{ uri: image.url }}
                    className="h-36 w-36 rounded-lg"
                    resizeMode="cover"
                  />
                ))}
              </View>
            </ScrollView>
          ) : (
            <View className="items-center py-8">
              <Ionicons name="image-outline" size={40} color="#CBD0D6" />
              <Text className="font-arabic-regular mt-3 text-sm text-[#4E6882]">
                لا توجد صور إضافية
              </Text>
            </View>
          )}
        </View>

        {/* Additional Notes */}
        {merchant.additionalNotes && (
          <View className="mb-6 rounded-xl border border-l-4 border-[#CAA453] border-[#E5E7EB] bg-white p-5">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="pricetag-outline" size={20} color="#CAA453" />
              <Text className="font-arabic-bold text-base text-[#18344A]">ملاحظات إضافية</Text>
            </View>
            <Text className="font-arabic-regular text-sm text-[#4E6882]">
              {merchant.additionalNotes}
            </Text>
          </View>
        )}

        {/* Business Information */}
        <View className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Ionicons name="information-circle-outline" size={20} color="#CAA453" />
            <Text className="font-arabic-bold text-base text-[#18344A]">معلومات النشاط</Text>
          </View>

          <View className="gap-4">
            <View className="flex-row items-center justify-between rounded-lg bg-[#F7F9FA] p-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="business-outline" size={16} color="#7A8699" />
                <Text className="font-arabic-regular text-xs text-[#7A8699]">المجال</Text>
              </View>
              <Text className="font-arabic-semibold text-sm text-[#18344A]">{categoryName}</Text>
            </View>

            <View className="flex-row items-center justify-between rounded-lg bg-[#F7F9FA] p-3">
              <View className="flex-row items-center gap-2">
                <Ionicons name="location-outline" size={16} color="#7A8699" />
                <Text className="font-arabic-regular text-xs text-[#7A8699]">المدينة</Text>
              </View>
              <Text className="font-arabic-semibold text-sm text-[#18344A]">{cityName}</Text>
            </View>

            {merchant.businessType && (
              <View className="flex-row items-center justify-between rounded-lg bg-[#F7F9FA] p-3">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="briefcase-outline" size={16} color="#7A8699" />
                  <Text className="font-arabic-regular text-xs text-[#7A8699]">نوع النشاط</Text>
                </View>
                <Text className="font-arabic-semibold text-sm text-[#18344A]">
                  {merchant.businessType}
                </Text>
              </View>
            )}

            {merchant.establishedYear && (
              <View className="flex-row items-center justify-between rounded-lg bg-[#F7F9FA] p-3">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="calendar-outline" size={16} color="#7A8699" />
                  <Text className="font-arabic-regular text-xs text-[#7A8699]">سنة التأسيس</Text>
                </View>
                <Text className="font-arabic-semibold text-sm text-[#18344A]">
                  {merchant.establishedYear}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Contact Information */}
        <View className="mb-6 rounded-xl border border-[#E5E7EB] bg-white p-5">
          <View className="mb-4 flex-row items-center gap-2">
            <Ionicons name="call-outline" size={20} color="#CAA453" />
            <Text className="font-arabic-bold text-base text-[#18344A]">معلومات التواصل</Text>
          </View>

          <View className="gap-3">
            {merchant.phone && (
              <TouchableOpacity
                onPress={() => handlePhoneCall(merchant.phone)}
                className="flex-row items-center rounded-xl bg-[#F7F9FA] p-4">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-[#1E2053]">
                  <Ionicons name="call-outline" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-arabic-regular text-xs text-[#7A8699]">رقم الجوال</Text>
                  <Text
                    className="font-arabic-semibold mt-1 text-sm text-[#18344A]"
                    style={{ direction: 'ltr', textAlign: 'right' }}>
                    {merchant.phone}
                  </Text>
                </View>
                <Ionicons name="chevron-back" size={20} color="#CBD0D6" />
              </TouchableOpacity>
            )}

            {whatsappNumber && (
              <TouchableOpacity
                onPress={() => handleWhatsApp(whatsappNumber)}
                className="flex-row items-center rounded-xl bg-[#F7F9FA] p-4">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-[#25D366]">
                  <Ionicons name="logo-whatsapp" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-arabic-regular text-xs text-[#7A8699]">الواتساب</Text>
                  <Text
                    className="font-arabic-semibold mt-1 text-sm text-[#18344A]"
                    style={{ direction: 'ltr', textAlign: 'right' }}>
                    {merchant.whatsapp}
                  </Text>
                </View>
                <Ionicons name="chevron-back" size={20} color="#CBD0D6" />
              </TouchableOpacity>
            )}

            {merchant.email && (
              <TouchableOpacity
                onPress={() => handleEmail(merchant.email)}
                className="flex-row items-center rounded-xl bg-[#F7F9FA] p-4">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-[#EA4335]">
                  <Ionicons name="mail-outline" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-arabic-regular text-xs text-[#7A8699]">
                    البريد الإلكتروني
                  </Text>
                  <Text className="font-arabic-semibold mt-1 text-sm text-[#18344A]">
                    {merchant.email}
                  </Text>
                </View>
                <Ionicons name="chevron-back" size={20} color="#CBD0D6" />
              </TouchableOpacity>
            )}

            {merchant.website && (
              <TouchableOpacity
                onPress={() => handleWebsite(merchant.website)}
                className="flex-row items-center rounded-xl bg-[#F7F9FA] p-4">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-[#4285F4]">
                  <Ionicons name="globe-back" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-arabic-regular text-xs text-[#7A8699]">
                    الموقع الإلكتروني
                  </Text>
                  <Text className="font-arabic-semibold mt-1 text-sm text-[#18344A]">
                    {merchant.website}
                  </Text>
                </View>
                <Ionicons name="chevron-back" size={20} color="#CBD0D6" />
              </TouchableOpacity>
            )}

            {merchant.instagram && (
              <TouchableOpacity
                onPress={() => handleInstagram(merchant.instagram)}
                className="flex-row items-center rounded-xl bg-[#F7F9FA] p-4">
                <View className="mr-3 h-10 w-10 items-center justify-center rounded-lg bg-[#C13584]">
                  <Ionicons name="logo-instagram" size={20} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="font-arabic-regular text-xs text-[#7A8699]">انستغرام</Text>
                  <Text className="font-arabic-semibold mt-1 text-sm text-[#363636]">
                    {merchant.instagram}
                  </Text>
                </View>
                <Ionicons name="chevron-back" size={20} color="#CBD0D6" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Bottom Spacing */}
        <View className="h-4" />
      </View>
    </ScrollView>
  );
}
