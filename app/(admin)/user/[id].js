import {
  APPROVE_MERCHANT,
  APPROVE_TRAINER,
  GET_USER_DETAILS,
  REJECT_MERCHANT,
  REJECT_TRAINER,
} from '@/utils/queries';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '@/utils/formatDate';
import { useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  Modal,
  Linking,
  Image,
} from 'react-native';
import { useMutation, useQuery } from '@apollo/client/react';
import Loading from '@/components/Loading';

export default function UserApplication() {
  const params = useLocalSearchParams();
  const userId = params.id;
  const [selectedImage, setSelectedImage] = useState(null);

  const { data, loading } = useQuery(GET_USER_DETAILS, {
    variables: { id: userId },
    skip: !userId,
  });

  const user = data?.user;
  const profile = user?.merchant || user?.trainer;
  const profileType = user?.merchant ? 'merchant' : 'trainer';

  // Dynamic mutations based on profile type
  const [approveProfile] = useMutation(
    profileType === 'merchant' ? APPROVE_MERCHANT : APPROVE_TRAINER,
    {
      onCompleted: () => {
        Alert.alert('نجاح', 'تمت الموافقة بنجاح!');
      },
    }
  );

  const [rejectProfile] = useMutation(
    profileType === 'merchant' ? REJECT_MERCHANT : REJECT_TRAINER,
    {
      onCompleted: () => {
        Alert.alert('نجاح', 'تم الرفض بنجاح!');
      },
    }
  );

  const handleApprove = () => {
    const profileName = profileType === 'merchant' ? 'التاجر' : 'المدرب';
    Alert.alert('تأكيد الموافقة', `هل أنت متأكد من الموافقة على ${profileName}؟`, [
      {
        text: 'إلغاء',
        style: 'cancel',
      },
      {
        text: 'تأكيد',
        onPress: () => approveProfile({ variables: { id: profile.id } }),
      },
    ]);
  };

  const handleReject = () => {
    const profileName = profileType === 'merchant' ? 'التاجر' : 'المدرب';
    Alert.alert('تأكيد الرفض', `هل أنت متأكد من رفض ${profileName}؟`, [
      {
        text: 'إلغاء',
        style: 'cancel',
      },
      {
        text: 'تأكيد',
        onPress: () => rejectProfile({ variables: { id: profile.id } }),
      },
    ]);
  };

  // Helper function to render work hours (only for merchants)
  const renderWorkHours = () => {
    if (profileType !== 'merchant' || !profile.workHours) {
      return <Text className="text-sm text-gray-500">غير محدد</Text>;
    }

    try {
      const workHours =
        typeof profile.workHours === 'string' ? JSON.parse(profile.workHours) : profile.workHours;

      return (
        <View className="gap-4">
          {/* Regular Hours */}
          {workHours.from && workHours.to && (
            <View className="gap-2">
              <Text className="text-sm font-semibold text-gray-700">ساعات العمل العادية</Text>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">من</Text>
                <Text className="text-sm font-medium text-gray-900">{workHours.from}</Text>
              </View>
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">إلى</Text>
                <Text className="text-sm font-medium text-gray-900">{workHours.to}</Text>
              </View>
              {workHours.days && workHours.days.length > 0 && (
                <View className="gap-1">
                  <Text className="text-sm text-gray-600">الأيام: </Text>
                  <Text className="text-sm font-medium text-gray-900">
                    {workHours.days.map((day) => getDayName(day)).join('، ')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      );
    } catch (error) {
      return <Text className="text-sm text-red-500">تنسيق غير صحيح</Text>;
    }
  };

  const getDayName = (day) => {
    const days = {
      sunday: 'الأحد',
      monday: 'الإثنين',
      tuesday: 'الثلاثاء',
      wednesday: 'الأربعاء',
      thursday: 'الخميس',
      friday: 'الجمعة',
      saturday: 'السبت',
      sun: 'الأحد',
      mon: 'الإثنين',
      tue: 'الثلاثاء',
      wed: 'الأربعاء',
      thu: 'الخميس',
      fri: 'الجمعة',
      sat: 'السبت',
    };
    return days[day.toLowerCase()] || day;
  };

  // Get image URL from image object
  const getImageUrl = (imageObject) => {
    if (!imageObject) return null;
    return imageObject.url || null;
  };

  // Render image section
  const renderImageSection = (title, imageObject, alt) => {
    const imageUrl = getImageUrl(imageObject);

    if (!imageUrl) {
      return (
        <View className="items-center justify-center rounded-lg bg-gray-100 p-8">
          <Ionicons name="image-outline" size={48} color="#9CA3AF" />
          <Text className="mt-2 text-sm text-gray-500">لا يوجد {title}</Text>
        </View>
      );
    }

    return (
      <View className="rounded-lg border border-gray-200 bg-white p-4">
        <Text className="mb-3 text-sm font-medium text-gray-700">{title}</Text>
        <TouchableOpacity onPress={() => setSelectedImage(imageUrl)}>
          <Image source={{ uri: imageUrl }} className="h-48 w-full rounded-lg" resizeMode="cover" />
        </TouchableOpacity>
      </View>
    );
  };

  // Render gallery images
  const renderGallery = () => {
    if (!profile.galleryImages || profile.galleryImages.length === 0) {
      return (
        <View className="items-center justify-center rounded-lg bg-gray-100 p-8">
          <Ionicons name="images-outline" size={48} color="#9CA3AF" />
          <Text className="mt-2 text-sm text-gray-500">لا توجد صور في المعرض</Text>
        </View>
      );
    }

    return (
      <View className="flex-row flex-wrap gap-2">
        {profile.galleryImages.map((imageObject, index) => {
          const imageUrl = getImageUrl(imageObject);
          if (!imageUrl) return null;

          return (
            <TouchableOpacity
              key={imageObject.id || index}
              onPress={() => setSelectedImage(imageUrl)}
              className="aspect-square w-[31%]">
              <Image
                source={{ uri: imageUrl }}
                className="h-full w-full rounded-lg"
                resizeMode="cover"
              />
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  // Render profile-specific information
  const renderProfileSpecificInfo = () => {
    if (profileType === 'merchant') {
      return (
        <>
          {/* Business Information */}
          <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="storefront-outline" size={20} color="#374151" />
              <Text className="text-lg font-bold text-gray-900">معلومات المتجر</Text>
            </View>

            <View className="gap-4">
              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">اسم المتجر</Text>
                <Text className="text-gray-900">{profile.businessName}</Text>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">الرابط المميز</Text>
                <Text className="text-gray-900">{profile.slug}</Text>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">وصف النشاط</Text>
                <Text className="leading-relaxed text-gray-900">
                  {profile.description || 'لا يوجد وصف'}
                </Text>
              </View>
            </View>
          </View>

          {/* Location & Work Hours */}
          <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="location-outline" size={20} color="#374151" />
              <Text className="text-lg font-bold text-gray-900">الموقع وساعات العمل</Text>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-semibold text-gray-900">الموقع</Text>
                <View className="gap-1">
                  <Text className="text-sm font-medium text-gray-700">العنوان التفصيلي</Text>
                  <Text className="text-gray-900">{profile.address || 'غير متوفر'}</Text>
                </View>
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="time-outline" size={16} color="#374151" />
                  <Text className="text-sm font-semibold text-gray-900">ساعات العمل</Text>
                </View>
                <View className="gap-1">{renderWorkHours()}</View>
              </View>
            </View>
          </View>
        </>
      );
    } else {
      // Trainer specific information
      return (
        <>
          {/* Trainer Information */}
          <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="school-outline" size={20} color="#374151" />
              <Text className="text-lg font-bold text-gray-900">معلومات المدرب</Text>
            </View>

            <View className="gap-4">
              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">الاسم الكامل</Text>
                <Text className="text-gray-900">{profile.fullName}</Text>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">الرابط المميز</Text>
                <Text className="text-gray-900">{profile.slug}</Text>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">التخصص</Text>
                <Text className="text-gray-900">{profile.specialization || 'غير محدد'}</Text>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">الوصف</Text>
                <Text className="leading-relaxed text-gray-900">
                  {profile.description || 'لا يوجد وصف'}
                </Text>
              </View>
            </View>
          </View>

          {/* Location Information */}
          <View className="mb-4 rounded-xl border border-gray-200 bg-white p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="location-outline" size={20} color="#374151" />
              <Text className="text-lg font-bold text-gray-900">الموقع</Text>
            </View>

            <View className="gap-3">
              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">المدينة</Text>
                <Text className="text-gray-900">{profile.city?.nameAr}</Text>
              </View>
              {profile.address && (
                <View className="gap-1">
                  <Text className="text-sm font-medium text-gray-700">العنوان التفصيلي</Text>
                  <Text className="text-gray-900">{profile.address}</Text>
                </View>
              )}
            </View>
          </View>
        </>
      );
    }
  };

  if (loading) return <Loading />;

  if (!profile)
    return (
      <View className="flex-1 items-center justify-center p-8">
        <Text className="text-lg text-gray-900">لم يتم العثور على البيانات</Text>
      </View>
    );

  return (
    <>
      <Modal
        visible={!!selectedImage}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImage(null)}>
        <View className="flex-1 items-center justify-center bg-black/90 p-4">
          {selectedImage && (
            <>
              <Image
                source={{ uri: selectedImage }}
                className="aspect-square max-h-[80%] w-full"
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={() => setSelectedImage(null)}
                className="absolute right-4 top-10 rounded-full bg-white/20 p-2">
                <Ionicons name="close-circle-outline" size={28} color="white" />
              </TouchableOpacity>
            </>
          )}
        </View>
      </Modal>

      <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
        <View className="px-4 py-6">
          {/* Header */}
          <View className="mb-6">
            <View className="mb-4 gap-2">
              <Text className="text-2xl font-bold text-gray-900">
                {profileType === 'merchant' ? 'طلب تسجيل تاجر' : 'طلب تسجيل مدرب'}
              </Text>
              <Text className="text-sm text-gray-600">
                {profileType === 'merchant'
                  ? 'مراجعة معلومات التاجر واتخاذ الإجراء المناسب'
                  : 'مراجعة معلومات المدرب واتخاذ الإجراء المناسب'}
              </Text>
            </View>

            <View className="flex-row items-center gap-2">
              <View
                className={`flex-row items-center gap-1 rounded-full px-3 py-1.5 ${
                  profile.status === 'pending'
                    ? 'border border-amber-200 bg-amber-50'
                    : profile.status === 'approved'
                      ? 'border border-emerald-200 bg-emerald-50'
                      : 'border border-red-200 bg-red-50'
                }`}>
                <Ionicons
                  name={
                    profile.status === 'pending'
                      ? 'time-outline'
                      : profile.status === 'approved'
                        ? 'checkmark-circle-outline'
                        : 'close-circle-outline'
                  }
                  size={16}
                  color={
                    profile.status === 'pending'
                      ? '#B45309'
                      : profile.status === 'approved'
                        ? '#047857'
                        : '#DC2626'
                  }
                />
                <Text
                  className={`text-sm font-medium ${
                    profile.status === 'pending'
                      ? 'text-amber-700'
                      : profile.status === 'approved'
                        ? 'text-emerald-700'
                        : 'text-red-700'
                  }`}>
                  {profile.status === 'pending'
                    ? 'قيد المراجعة'
                    : profile.status === 'approved'
                      ? 'مقبول'
                      : 'مرفوض'}
                </Text>
              </View>
              {profile.isFeatured && (
                <View className="flex-row items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1.5">
                  <Ionicons name="star-outline" size={16} color="#92400E" />
                  <Text className="text-sm font-medium text-yellow-700">مميز</Text>
                </View>
              )}
            </View>
          </View>

          {/* Images Section */}
          <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="images-outline" size={20} color="#374151" />
              <Text className="text-lg font-bold text-gray-900">الصور والمرفقات</Text>
            </View>

            <View className="gap-4">
              {/* Logo and Cover Image */}
              <View className="gap-4">
                {renderImageSection(
                  'الشعار',
                  profile.logo,
                  `شعار ${profileType === 'merchant' ? profile.businessName : profile.fullName}`
                )}
                {renderImageSection(
                  'صورة الغلاف',
                  profile.coverImage,
                  `صورة غلاف ${profileType === 'merchant' ? profile.businessName : profile.fullName}`
                )}
              </View>

              {/* Gallery Images */}
              <View className="gap-3">
                <Text className="text-sm font-semibold text-gray-900">
                  معرض الصور ({profile.galleryImages?.length || 0})
                </Text>
                {renderGallery()}
              </View>
            </View>
          </View>

          {/* Profile Specific Information */}
          {renderProfileSpecificInfo()}

          {/* Contact Information */}
          <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="person-outline" size={20} color="#374151" />
              <Text className="text-lg font-bold text-gray-900">معلومات التواصل</Text>
            </View>

            <View className="gap-4">
              <View className="flex-row items-center gap-3">
                <Ionicons name="call-outline" size={18} color="#6B7280" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700">رقم الهاتف</Text>
                  <Text className="text-gray-900">{profile.phone}</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <Ionicons name="chatbubble-outline" size={18} color="#6B7280" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700">واتساب</Text>
                  <Text className="text-gray-900">{profile.whatsapp || 'غير متوفر'}</Text>
                </View>
              </View>

              <View className="flex-row items-center gap-3">
                <Ionicons name="mail-outline" size={18} color="#6B7280" />
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-700">البريد الإلكتروني</Text>
                  <Text className="text-gray-900">{profile.email || 'غير متوفر'}</Text>
                </View>
              </View>

              {profile.website && (
                <View className="flex-row items-center gap-3">
                  <Ionicons name="globe-outline" size={18} color="#6B7280" />
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700">الموقع الإلكتروني</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(profile.website)}>
                      <Text className="break-words text-blue-600">{profile.website}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {profile.instagram && (
                <View className="flex-row items-center gap-3">
                  <Ionicons name="logo-instagram" size={18} color="#6B7280" />
                  <View className="flex-1">
                    <Text className="text-sm font-medium text-gray-700">إنستجرام</Text>
                    <Text className="text-gray-900">{profile.instagram}</Text>
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Verification & Documents */}
          <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="document-text-outline" size={20} color="#374151" />
              <Text className="text-lg font-bold text-gray-900">المستندات والتحقق</Text>
            </View>

            <View className="gap-4">
              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">نوع المستند</Text>
                <Text className="text-gray-900">{profile.documentType}</Text>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">مستند التحقق</Text>
                {profile.verificationDocument ? (
                  <TouchableOpacity onPress={() => Linking.openURL(profile.verificationDocument)}>
                    <Text className="text-blue-600">عرض المستند</Text>
                  </TouchableOpacity>
                ) : (
                  <Text className="text-gray-900">غير متوفر</Text>
                )}
              </View>

              {profile.additionalNotes && (
                <View className="gap-1">
                  <Text className="text-sm font-medium text-gray-700">ملاحظات إضافية</Text>
                  <Text className="rounded-lg bg-gray-50 p-3 text-gray-900">
                    {profile.additionalNotes}
                  </Text>
                </View>
              )}
            </View>
          </View>

          {/* User Information */}
          <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="person-circle-outline" size={20} color="#374151" />
              <Text className="text-lg font-bold text-gray-900">معلومات حساب المستخدم</Text>
            </View>

            <View className="gap-4">
              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">الاسم الكامل</Text>
                <Text className="text-gray-900">{user.fullName}</Text>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">البريد الإلكتروني</Text>
                <Text className="text-gray-900">{user.email}</Text>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">الدور</Text>
                <Text className="capitalize text-gray-900">{user.role}</Text>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">حالة الحساب</Text>
                <View
                  className={`flex-row items-center gap-1 self-start rounded-full px-3 py-1.5 ${
                    user.isActive
                      ? 'border border-emerald-200 bg-emerald-50'
                      : 'border border-red-200 bg-red-50'
                  }`}>
                  <Text
                    className={`text-xs font-medium ${user.isActive ? 'text-emerald-700' : 'text-red-700'}`}>
                    {user.isActive ? 'نشط' : 'معطل'}
                  </Text>
                </View>
              </View>

              <View className="gap-1">
                <Text className="text-sm font-medium text-gray-700">تاريخ إنشاء الحساب</Text>
                <Text className="text-gray-900">{formatDate(user.createdAt)}</Text>
              </View>
            </View>
          </View>

          {/* Application Meta */}
          <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
            <Text className="mb-4 text-lg font-bold text-gray-900">معلومات الطلب</Text>

            <View className="gap-3">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">رقم الطلب</Text>
                <Text className="text-sm font-medium text-gray-900">#{profile.id}</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">نوع الطلب</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {profileType === 'merchant' ? 'تاجر' : 'مدرب'}
                </Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">تاريخ التقديم</Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="calendar-outline" size={14} color="#374151" />
                  <Text className="text-sm text-gray-900">{formatDate(profile.createdAt)}</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">آخر تحديث</Text>
                <View className="flex-row items-center gap-1">
                  <Ionicons name="calendar-outline" size={14} color="#374151" />
                  <Text className="text-sm text-gray-900">{formatDate(profile.updatedAt)}</Text>
                </View>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className="text-sm text-gray-600">حالة الطلب</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {profile.status === 'pending' && 'قيد المراجعة'}
                  {profile.status === 'approved' && 'مقبول'}
                  {profile.status === 'rejected' && 'مرفوض'}
                </Text>
              </View>
            </View>
          </View>

          {/* Category Info */}
          <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="pricetag-outline" size={20} color="#374151" />
              <Text className="text-lg font-bold text-gray-900">التصنيف</Text>
            </View>

            <View className="gap-3">
              <View className="gap-1">
                <Text className="text-sm text-gray-600">القسم الرئيسي</Text>
                <Text className="text-sm font-medium text-gray-900">
                  {profile.category?.nameAr}
                </Text>
              </View>
              <View className="gap-1">
                <Text className="text-sm text-gray-600">المدينة</Text>
                <Text className="text-sm font-medium text-gray-900">{profile.city?.nameAr}</Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          {profile.status === 'pending' && (
            <View className="rounded-xl border border-gray-200 bg-white p-4">
              <Text className="mb-4 text-lg font-bold text-gray-900">الإجراءات</Text>
              <View className="gap-3">
                <TouchableOpacity
                  onPress={handleApprove}
                  className="flex-row items-center justify-center gap-2 rounded-lg bg-emerald-600 px-4 py-3">
                  <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                  <Text className="text-base font-medium text-white">
                    {profileType === 'merchant' ? 'الموافقة على الطلب' : 'الموافقة على المدرب'}
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={handleReject}
                  className="flex-row items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-3">
                  <Ionicons name="close-circle-outline" size={20} color="white" />
                  <Text className="text-base font-medium text-white">
                    {profileType === 'merchant' ? 'رفض الطلب' : 'رفض المدرب'}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}
