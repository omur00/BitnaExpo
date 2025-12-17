import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GET_MERCHANT_BY_SLUG } from '@/utils/queries';
import Loading from '@/components/Loading';
import { useQuery } from '@apollo/client/react';

export default function MerchantPage() {
  const { slug } = useLocalSearchParams();
  const router = useRouter();

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

  return (
    <ScrollView className="flex-1 bg-white" showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View className="border-b border-[#CBD0D6] bg-white">
        {/* Cover Image */}
        {merchant.coverImage?.url && (
          <View className="h-48 w-full">
            <Image
              source={{ uri: merchant.coverImage.url }}
              className="h-full w-full"
              resizeMode="cover"
            />
            <View className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          </View>
        )}

        {/* Business Header */}
        <View className="px-4 py-4">
          <View className="flex-row items-start">
            {/* Logo */}
            <View className="mr-4">
              {merchant.logo?.url ? (
                <Image
                  source={{ uri: merchant.logo.url }}
                  className="h-16 w-16 rounded-xl border-2 border-white md:h-20 md:w-20"
                  resizeMode="cover"
                />
              ) : (
                <View className="h-16 w-16 items-center justify-center rounded-xl border-2 border-white bg-[#F7F9FA] md:h-20 md:w-20">
                  <Ionicons name="storefront-outline" size={32} color="#4E6882" />
                </View>
              )}
            </View>

            {/* Business Info */}
            <View className="flex-1">
              <Text className="mb-2 text-xl font-bold text-[#18344A]">{businessName}</Text>
              <View className="flex-row flex-wrap gap-2">
                <View className="flex-row items-center rounded-full bg-[#F7F9FA] px-3 py-1">
                  <Ionicons name="business-outline" size={12} color="#1E2053" />
                  <Text className="mr-1 text-xs text-[#1E2053]">{categoryName}</Text>
                </View>
                <View className="flex-row items-center rounded-full bg-[#F7F9FA] px-3 py-1">
                  <Ionicons name="location-outline" size={12} color="#1E2053" />
                  <Text className="mr-1 text-xs text-[#1E2053]">{cityName}</Text>
                </View>
              </View>
            </View>
          </View>

          {/* Quick Actions */}
          <View className="mt-3 flex-row gap-2">
            {whatsappNumber && (
              <TouchableOpacity
                onPress={() => handleWhatsApp(whatsappNumber)}
                className="flex-1 flex-row items-center justify-center rounded-lg bg-[#1E2053] py-3">
                <Ionicons name="chatbubble-outline" size={16} color="white" />
                <Text className="mr-2 text-sm text-white">واتساب</Text>
              </TouchableOpacity>
            )}
            {merchant.phone && (
              <TouchableOpacity
                onPress={() => handlePhoneCall(merchant.phone)}
                className="flex-1 flex-row items-center justify-center rounded-lg bg-[#CAA453] py-3">
                <Ionicons name="call-outline" size={16} color="#1E2053" />
                <Text className="mr-2 text-sm font-semibold text-[#1E2053]">اتصال</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="px-4 py-6">
        {/* About Section */}
        <View className="mb-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
          <View className="mb-3 flex-row items-center">
            <Ionicons name="document-text-outline" size={20} color="#CAA453" />
            <Text className="mr-2 text-lg font-bold text-[#18344A]">عن النشاط</Text>
          </View>
          <Text className="text-sm leading-6 text-[#4E6882]">{description}</Text>
        </View>

        {/* Gallery Images */}
        <View className="mb-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
          <View className="mb-3 flex-row items-center">
            <Ionicons name="images-outline" size={20} color="#CAA453" />
            <Text className="mr-2 text-lg font-bold text-[#18344A]">معرض الصور</Text>
          </View>
          {merchant.galleryImages && merchant.galleryImages.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} className="gap-2">
              {merchant.galleryImages.map((image, index) => (
                <Image
                  key={index}
                  source={{ uri: image.url }}
                  className="h-32 w-32 rounded-lg"
                  resizeMode="cover"
                />
              ))}
            </ScrollView>
          ) : (
            <View className="items-center py-6">
              <Ionicons name="image-outline" size={32} color="#CBD0D6" />
              <Text className="mt-2 text-sm text-[#4E6882]">لا توجد صور إضافية</Text>
            </View>
          )}
        </View>

        {/* Additional Notes */}
        {merchant.additionalNotes && (
          <View className="mb-4 rounded-xl border border-l-4 border-[#CAA453] border-[#E5E7EB] bg-white p-4">
            <View className="mb-3 flex-row items-center">
              <Ionicons name="pricetag-outline" size={20} color="#CAA453" />
              <Text className="mr-2 text-lg font-bold text-[#18344A]">ملاحظات إضافية</Text>
            </View>
            <Text className="text-sm text-[#4E6882]">{merchant.additionalNotes}</Text>
          </View>
        )}

        {/* Business Information */}
        <View className="mb-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
          <View className="mb-3 flex-row items-center">
            <Ionicons name="information-circle-outline" size={20} color="#CAA453" />
            <Text className="mr-2 text-lg font-bold text-[#18344A]">معلومات النشاط</Text>
          </View>

          <View className="space-y-3">
            <View className="flex-row justify-between border-b border-[#F7F9FA] py-2">
              <Text className="text-xs text-[#7A8699]">المجال</Text>
              <Text className="text-xs font-medium text-[#18344A]">{categoryName}</Text>
            </View>

            <View className="flex-row justify-between border-b border-[#F7F9FA] py-2">
              <Text className="text-xs text-[#7A8699]">المدينة</Text>
              <Text className="text-xs font-medium text-[#18344A]">{cityName}</Text>
            </View>

            {merchant.businessType && (
              <View className="flex-row justify-between border-b border-[#F7F9FA] py-2">
                <Text className="text-xs text-[#7A8699]">نوع النشاط</Text>
                <Text className="text-xs font-medium text-[#18344A]">{merchant.businessType}</Text>
              </View>
            )}

            {merchant.establishedYear && (
              <View className="flex-row justify-between border-b border-[#F7F9FA] py-2">
                <Text className="text-xs text-[#7A8699]">سنة التأسيس</Text>
                <Text className="text-xs font-medium text-[#18344A]">
                  {merchant.establishedYear}
                </Text>
              </View>
            )}

            {merchant.rating && (
              <View className="flex-row justify-between py-2">
                <Text className="text-xs text-[#7A8699]">التقييم</Text>
                <View className="flex-row items-center">
                  <Ionicons name="star" size={12} color="#CAA453" />
                  <Text className="mr-1 text-xs font-medium text-[#18344A]">{merchant.rating}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {/* Contact Information */}
        <View className="rounded-xl border border-[#E5E7EB] bg-white p-4">
          <Text className="mb-3 text-lg font-bold text-[#18344A]">معلومات التواصل</Text>

          <View className="space-y-2">
            {merchant.phone && (
              <TouchableOpacity
                onPress={() => handlePhoneCall(merchant.phone)}
                className="flex-row items-center rounded-lg border border-[#E5E7EB] bg-[#F7F9FA] p-3">
                <Ionicons name="call-outline" size={20} color="#4E6882" />
                <View className="mr-3 flex-1">
                  <Text className="text-xs text-[#7A8699]">رقم الجوال</Text>
                  <Text className="text-sm font-medium text-[#18344A]">{merchant.phone}</Text>
                </View>
              </TouchableOpacity>
            )}

            {whatsappNumber && (
              <TouchableOpacity
                onPress={() => handleWhatsApp(whatsappNumber)}
                className="flex-row items-center rounded-lg border border-[#E5E7EB] bg-[#F7F9FA] p-3">
                <Ionicons name="logo-whatsapp" size={20} color="#4E6882" />
                <View className="mr-3 flex-1">
                  <Text className="text-xs text-[#7A8699]">الواتساب</Text>
                  <Text className="text-sm font-medium text-[#18344A]">{whatsappNumber}</Text>
                </View>
              </TouchableOpacity>
            )}

            {merchant.email && (
              <TouchableOpacity
                onPress={() => handleEmail(merchant.email)}
                className="flex-row items-center rounded-lg border border-[#E5E7EB] bg-[#F7F9FA] p-3">
                <Ionicons name="mail-outline" size={20} color="#4E6882" />
                <View className="mr-3 flex-1">
                  <Text className="text-xs text-[#7A8699]">البريد الإلكتروني</Text>
                  <Text className="text-sm font-medium text-[#18344A]">{merchant.email}</Text>
                </View>
              </TouchableOpacity>
            )}

            {merchant.website && (
              <TouchableOpacity
                onPress={() => handleWebsite(merchant.website)}
                className="flex-row items-center rounded-lg border border-[#E5E7EB] bg-[#F7F9FA] p-3">
                <Ionicons name="globe-outline" size={20} color="#4E6882" />
                <View className="mr-3 flex-1">
                  <Text className="text-xs text-[#7A8699]">الموقع الإلكتروني</Text>
                  <Text className="text-sm font-medium text-[#18344A]">{merchant.website}</Text>
                </View>
              </TouchableOpacity>
            )}

            {merchant.instagram && (
              <TouchableOpacity
                onPress={() => handleInstagram(merchant.instagram)}
                className="flex-row items-center rounded-lg border border-[#E5E7EB] bg-[#F7F9FA] p-3">
                <Ionicons name="logo-instagram" size={20} color="#4E6882" />
                <View className="mr-3 flex-1">
                  <Text className="text-xs text-[#7A8699]">انستغرام</Text>
                  <Text className="text-sm font-medium text-[#18344A]">{merchant.instagram}</Text>
                </View>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
