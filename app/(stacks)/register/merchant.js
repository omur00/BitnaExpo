import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { REGISTER_MERCHANT, GET_CATEGORIES, GET_CITIES } from '@/utils/queries';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { useMutation, useQuery } from '@apollo/client/react';
import { Picker } from '@/components/ui/picker';
import { PhoneInputField } from '@/components/ui/phone-input';
import ImageUpload from '@/components/ui/ImageUpload';
import { useRouter } from 'expo-router';

export default function MerchantRegistration() {
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAgreed, setIsAgreed] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    businessName: 'aaaaaa',
    description: 'aaaaaa',
    categoryId: '',
    cityId: '',
    phone: '243423443',
    whatsapp: '243423443',
    email: 'omurjssd@sdsd.com',
    website: '',
    instagram: '',
    password: '123123123',
    confpassword: '123123123',
    additionalNotes: 'asdasdasdasd',
    documentType: '',
    verificationDocument: null,
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { data: citiesData } = useQuery(GET_CITIES);

  const [registerMerchant, { loading, error }] = useMutation(REGISTER_MERCHANT, {
    onCompleted: async (data) => {
      if (data?.registerMerchant?.user) {
        login(data.registerMerchant.user);
      }
    },
  });

  const handleSubmit = async () => {
    try {
      if (!isAgreed) {
        Alert.alert('خطأ', 'يجب الموافقة على الشروط والأحكام للمتابعة');
        return;
      }

      if (formData.password !== formData.confpassword) {
        Alert.alert('خطأ', 'كلمة المرور وتأكيد كلمة المرور غير متطابقتان');
        return;
      }

      await registerMerchant({
        variables: {
          input: formData,
        },
      });
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleDocumentUrlChange = (url) => {
    setFormData((prev) => ({
      ...prev,
      verificationDocument: url,
    }));
  };

  const nextStep = () => {
    if (currentStep === 1 && !isStep1Valid()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة في الخطوة الأولى');
      return;
    }
    if (currentStep === 2 && !isStep2Valid()) {
      Alert.alert('خطأ', 'يرجى ملء جميع الحقول المطلوبة في الخطوة الثانية');
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const isStep1Valid = () => {
    return formData.businessName && formData.description && formData.categoryId && formData.cityId;
  };

  const isStep2Valid = () => {
    return formData.phone && formData.email && formData.password === formData.confpassword;
  };

  const isStep3Valid = () => {
    return formData.documentType && formData.verificationDocument;
  };

  // Progress bar steps
  const steps = [
    { number: 1, title: 'معلومات النشاط' },
    { number: 2, title: 'معلومات التواصل' },
    { number: 3, title: 'المستندات' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header with Progress Bar */}
      <View className="border-b border-gray-200 bg-white px-6 pb-6 pt-8">
        <View className="mb-4">
          <Text className="mt-1 text-gray-600">املأ البيانات التالية لعرض نشاطك على المنصة</Text>
        </View>

        {/* Progress Bar */}
        <View className="mb-2 flex-row items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <View className="flex-row items-center gap-2">
                <View
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    currentStep >= step.number
                      ? 'border-[#CAA453] bg-[#CAA453]'
                      : 'border-gray-300 bg-white'
                  }`}>
                  <Text
                    className={`font-medium ${
                      currentStep >= step.number ? 'text-white' : 'text-gray-500'
                    }`}>
                    {step.number}
                  </Text>
                </View>
                {currentStep === step.number && (
                  <Text className="text-sm font-medium text-[#CAA453]">{step.title}</Text>
                )}
              </View>
              {index < steps.length - 1 && (
                <View
                  className={`mx-2 h-0.5 flex-1 ${
                    currentStep > step.number ? 'bg-[#CAA453]' : 'bg-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </View>
      </View>

      {/* Form Content */}
      <View className="p-6">
        {error && (
          <View className="mb-6 rounded-xl border border-red-200 bg-red-50 p-4">
            <View className="flex-row items-start gap-2">
              <Ionicons name="alert-circle-outline" size={20} color="#DC2626" />
              <Text className="flex-1 text-red-700">{error.message}</Text>
            </View>
          </View>
        )}

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <View className="gap-6">
            <View className="gap-1">
              <View className="flex-row items-center gap-2">
                <Ionicons name="business-outline" size={20} color="#374151" />
                <Text className="text-lg font-bold text-gray-800">المعلومات الأساسية للنشاط</Text>
              </View>
              <Text className="text-sm text-gray-600">البيانات الأساسية لنشاطك التجاري</Text>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-medium text-gray-700">اسم النشاط</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <TextInput
                  value={formData.businessName}
                  onChangeText={(value) => handleChange('businessName', value)}
                  placeholder="مثال: مطعم السلام"
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-medium text-gray-700">القسم الرئيسي</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <Picker
                  options={[
                    { label: 'اختر القسم', value: '' },
                    ...(categoriesData?.categories?.map((category) => ({
                      label: category.nameAr,
                      value: category.id,
                    })) || []),
                  ]}
                  value={formData.categoryId}
                  onValueChange={(value) => handleChange('categoryId', value)}
                  placeholder="اختر القسم"
                  style={{ backgroundColor: 'white', borderRadius: 10 }}
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-medium text-gray-700">المدينة</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <Picker
                  options={[
                    { label: 'اختر المدينة', value: '' },
                    ...(citiesData?.cities?.map((city) => ({
                      label: city.nameAr,
                      value: city.id,
                    })) || []),
                  ]}
                  value={formData.cityId}
                  onValueChange={(value) => handleChange('cityId', value)}
                  placeholder="اختر المدينة"
                  style={{ backgroundColor: 'white', borderRadius: 10 }}
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-medium text-gray-700">وصف النشاط</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <TextInput
                  value={formData.description}
                  onChangeText={(value) => handleChange('description', value)}
                  multiline
                  numberOfLines={4}
                  placeholder="صف نشاطك التجاري، المنتجات أو الخدمات التي تقدمها..."
                  className="h-56 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                  textAlignVertical="top"
                />
                <Text className="text-xs text-gray-500">
                  اكتب وصفاً واضحاً وشاملاً لنشاطك التجاري
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={nextStep}
              disabled={!isStep1Valid()}
              className={`flex-row items-center justify-center gap-2 rounded-lg py-3 ${
                isStep1Valid() ? 'bg-[#CAA453]' : 'bg-gray-300'
              }`}>
              <Text className="text-lg font-bold text-white">التالي</Text>
              <Ionicons name="arrow-back-outline" size={20} color="white" />
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <View className="gap-6">
            <View className="gap-1">
              <View className="flex-row items-center gap-2">
                <Ionicons name="call-outline" size={20} color="#374151" />
                <Text className="text-lg font-bold text-gray-800">معلومات التواصل</Text>
              </View>
              <Text className="text-sm text-gray-600">وسائل التواصل التي سيظهر للعملاء</Text>
            </View>

            <View className="mb-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <View className="flex-row items-start gap-2">
                <Ionicons name="information-circle-outline" size={20} color="#1D4ED8" />
                <Text className="flex-1 text-blue-800">
                  <Text className="font-bold">ملاحظة:</Text> يرجى تقديم وسائل التواصل التي تريد أن
                  يراها العملاء على صفحتك
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-medium text-gray-700">رقم الجوال</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <PhoneInputField
                  value={formData.phone}
                  onChangeText={(value) => handleChange('phone', value)}
                  placeholder="أدخل رقم الهاتف"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700">رقم الواتساب (إختياري)</Text>
                <PhoneInputField
                  value={formData.whatsapp}
                  onChangeText={(value) => handleChange('whatsapp', value)}
                  placeholder="05XXXXXXXX"
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-medium text-gray-700">البريد الإلكتروني</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <TextInput
                  value={formData.email}
                  onChangeText={(value) => handleChange('email', value)}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700">
                  الموقع الإلكتروني (إختياري)
                </Text>
                <TextInput
                  value={formData.website}
                  onChangeText={(value) => handleChange('website', value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-medium text-gray-700" numberOfLines={1}>
                    كلمة المرور
                  </Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <TextInput
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry
                  placeholder="أدخل كلمة المرور"
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-medium text-gray-700" numberOfLines={1}>
                    تأكيد كلمة المرور
                  </Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <TextInput
                  value={formData.confpassword}
                  onChangeText={(value) => handleChange('confpassword', value)}
                  secureTextEntry
                  placeholder="أعد إدخال كلمة المرور"
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
                {formData.password !== formData.confpassword && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                    <Text className="text-sm text-red-600">
                      كلمة المرور وتأكيد كلمة المرور غير متطابقتان
                    </Text>
                  </View>
                )}
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700">حساب إنستجرام (إختياري)</Text>
                <TextInput
                  value={formData.instagram}
                  onChangeText={(value) => handleChange('instagram', value)}
                  placeholder="@username"
                  className="w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={prevStep}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3">
                <Ionicons name="arrow-forward" size={20} color="#374151" />
                <Text className="font-bold text-gray-700">السابق</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={nextStep}
                disabled={!isStep2Valid()}
                className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg py-3 ${
                  isStep2Valid() ? 'bg-[#CAA453]' : 'bg-gray-300'
                }`}>
                <Text className="text-lg font-bold text-white">التالي</Text>
                <Ionicons name="arrow-back" size={20} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 3: Documents & Additional Info */}
        {currentStep === 3 && (
          <View className="gap-6">
            <View className="gap-1">
              <View className="flex-row items-center gap-2">
                <Ionicons name="document-text-outline" size={20} color="#374151" />
                <Text className="text-lg font-bold text-gray-800">
                  المستندات والمعلومات الإضافية
                </Text>
              </View>
              <Text className="text-sm text-gray-600">المستندات المطلوبة للتحقق</Text>
            </View>

            <View className="mb-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <View className="flex-row items-start gap-2">
                <Ionicons name="information-circle-outline" size={20} color="#D97706" />
                <Text className="flex-1 text-amber-800">
                  <Text className="font-bold">ملاحظة:</Text> يرجى تحميل المستند المطلوب حسب نوع
                  النشاط.
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-medium text-gray-700">نوع المستند</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <Picker
                  options={[
                    { label: 'اختر نوع المستند', value: '' },
                    { label: 'صورة البطاقة المدنية', value: 'صورة البطاقة المدنية' },
                    { label: 'شهادة التأمينات', value: 'شهادة التأمينات' },
                    { label: 'شهادة من الشؤون', value: 'شهادة من الشؤون' },
                    { label: 'شهادة وزارة التجارة', value: 'شهادة وزارة التجارة' },
                    { label: 'شهادة إعاقة', value: 'شهادة إعاقة' },
                    { label: 'شهادة هيئة البدون', value: 'شهادة هيئة البدون' },
                  ]}
                  value={formData.documentType}
                  onValueChange={(value) => handleChange('documentType', value)}
                  placeholder="اختر نوع المستند"
                  style={{ backgroundColor: 'white', borderRadius: 10 }}
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="text-sm font-medium text-gray-700">رفع المستند</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <ImageUpload
                  label=""
                  value={formData.verificationDocument}
                  onChange={handleDocumentUrlChange}
                  type="document"
                  folder="/merchants/logos"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700">ملاحظات إضافية (إختياري)</Text>
                <TextInput
                  value={formData.additionalNotes}
                  onChangeText={(value) => handleChange('additionalNotes', value)}
                  multiline
                  numberOfLines={3}
                  placeholder="أوقات العمل، مميزات إضافية، معلومات أخرى..."
                  className="h-56 w-full rounded-lg border border-gray-300 bg-white p-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                  textAlignVertical="top"
                />
              </View>

              <View className="rounded-xl border border-gray-200 bg-white p-4">
                <TouchableOpacity
                  onPress={() => setIsAgreed(!isAgreed)}
                  className="flex-row items-start gap-3">
                  <View
                    className={`mt-1 h-6 w-6 items-center justify-center rounded border ${
                      isAgreed ? 'border-[#CAA453] bg-[#CAA453]' : 'border-gray-400 bg-white'
                    }`}>
                    {isAgreed && <Ionicons name="checkmark" size={16} color="white" />}
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-gray-700">
                      أوافق على{' '}
                      <Text
                        className="font-bold text-[#CAA453]"
                        onPress={(e) => {
                          e.stopPropagation(); // Prevent triggering parent onPress
                          router.push('/(stacks)/termsAndConditions');
                        }}
                        suppressHighlighting={true} // Remove text highlight on press
                      >
                        الشروط والأحكام العامة
                      </Text>{' '}
                      لمنصة بيتنا
                    </Text>
                    <Text className="text-sm text-gray-500">
                      بموافقتي، أقر بأني قد قرأت وفهمت جميع الشروط والأحكام المذكورة
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View className="gap-4">
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={prevStep}
                  className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3">
                  <Ionicons name="arrow-forward" size={20} color="#374151" />
                  <Text className="font-bold text-gray-700">السابق</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading || !isStep3Valid() || !isAgreed}
                  className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg py-3 ${
                    loading || !isStep3Valid() || !isAgreed ? 'bg-gray-300' : 'bg-[#CAA453]'
                  }`}>
                  {loading ? (
                    <>
                      <ActivityIndicator size="small" color="white" />
                      <Text className="font-bold text-white">جاري التسجيل...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                      <Text className="font-bold text-white">تقديم الطلب</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View className="rounded-lg bg-gray-100 p-3">
                <View className="flex-row items-start gap-2">
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text className="flex-1 text-sm text-gray-600">
                    بعد تقديم الطلب، سيتم مراجعته من قبل الإدارة وسيتم إشعارك عند الموافقة
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Bottom padding for scroll */}
      <View className="h-20" />
    </ScrollView>
  );
}
