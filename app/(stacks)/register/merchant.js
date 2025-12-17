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

export default function MerchantRegistration() {
  const { login } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAgreed, setIsAgreed] = useState(false);

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

  const documentTypes = [
    { value: 'صورة البطاقة المدنية', label: 'صورة البطاقة المدنية' },
    { value: 'شهادة التأمينات', label: 'شهادة التأمينات' },
    { value: 'شهادة من الشؤون', label: 'شهادة من الشؤون' },
    { value: 'شهادة وزارة التجارة', label: 'شهادة وزارة التجارة' },
    { value: 'شهادة إعاقة', label: 'شهادة إعاقة' },
    { value: 'شهادة هيئة البدون', label: 'شهادة هيئة البدون' },
  ];

  return (
    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="bg-white px-6 pt-8">
        <Text className="text-gray-600">املأ البيانات التالية لعرض نشاطك على المنصة</Text>
      </View>

      {/* Form Content */}
      <View className="px-6 py-8">
        {error && (
          <View className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <Text className=" text-red-700">{error.message}</Text>
          </View>
        )}

        {/* Step 1: Basic Information */}
        {currentStep === 1 && (
          <View className="flex flex-col gap-8">
            <View>
              <Text className="mb-6 text-xl font-bold text-gray-800">
                المعلومات الأساسية للنشاط
              </Text>

              <View className="flex flex-col gap-5">
                <View>
                  <Text className="mb-2 font-medium text-gray-700">
                    اسم النشاط <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    value={formData.businessName}
                    onChangeText={(value) => handleChange('businessName', value)}
                    placeholder="مثال: مطعم السلام"
                    className="w-full rounded-xl border border-gray-300 bg-white p-4  text-gray-800"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View>
                  <Text className="mb-2  font-medium text-gray-700">
                    القسم الرئيسي <Text className="text-red-500">*</Text>
                  </Text>
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
                    style={{ borderRadius: 10, backgroundColor: 'none' }}
                  />
                </View>

                <View>
                  <Text className="mb-2  font-medium text-gray-700">
                    المدينة <Text className="text-red-500">*</Text>
                  </Text>
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
                    style={{ borderRadius: 10, backgroundColor: 'none' }}
                  />
                </View>

                <View>
                  <Text className="mb-2  font-medium text-gray-700">
                    وصف النشاط <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    value={formData.description}
                    onChangeText={(value) => handleChange('description', value)}
                    multiline
                    numberOfLines={4}
                    placeholder="صف نشاطك التجاري، المنتجات أو الخدمات التي تقدمها..."
                    className="w-full rounded-xl border border-gray-300 bg-white p-4  text-gray-800"
                    placeholderTextColor="#9CA3AF"
                    textAlignVertical="top"
                  />
                  <Text className="mt-2  text-xs text-gray-500">
                    اكتب وصفاً واضحاً وشاملاً لنشاطك التجاري
                  </Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              onPress={nextStep}
              disabled={!isStep1Valid()}
              className={`rounded-xl py-4 ${isStep1Valid() ? 'bg-[#CAA453]' : 'bg-gray-300'}`}>
              <Text className="text-center font-bold text-white">التالي</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Step 2: Contact Information */}
        {currentStep === 2 && (
          <View className="flex flex-col gap-8">
            <View>
              <Text className="mb-6 text-xl font-bold text-gray-800">معلومات التواصل</Text>
              <View className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4">
                <Text className=" text-blue-800">
                  <Text className="font-bold">ملاحظة:</Text> يرجى تقديم وسائل التواصل التي تريد أن
                  يراها العملاء على صفحتك
                </Text>
              </View>

              <View className="flex flex-col gap-5">
                <View>
                  <Text className="mb-2  font-medium text-gray-700">
                    رقم الجوال <Text className="text-red-500">*</Text>
                  </Text>
                  <PhoneInputField
                    value={formData.phone}
                    onChangeText={(value) => handleChange('phone', value)}
                    placeholder="أدخل رقم الهاتف"
                  />
                </View>

                <View>
                  <Text className="mb-2  font-medium text-gray-700">رقم الواتساب (إختياري)</Text>
                  <PhoneInputField
                    value={formData.whatsapp}
                    onChangeText={(value) => handleChange('whatsapp', value)}
                    placeholder="05XXXXXXXX"
                  />
                </View>

                <View>
                  <Text className="mb-2  font-medium text-gray-700">
                    البريد الإلكتروني <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    value={formData.email}
                    onChangeText={(value) => handleChange('email', value)}
                    placeholder="example@email.com"
                    keyboardType="email-address"
                    className="w-full rounded-xl border border-gray-300 bg-white p-4  text-gray-800"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View>
                  <Text className="mb-2  font-medium text-gray-700">
                    الموقع الإلكتروني (إختياري)
                  </Text>
                  <TextInput
                    value={formData.website}
                    onChangeText={(value) => handleChange('website', value)}
                    placeholder="https://example.com"
                    className="w-full rounded-xl border border-gray-300 bg-white p-4  text-gray-800"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View>
                  <Text className="mb-2  font-medium text-gray-700">
                    كلمة المرور <Text className="text-red-500">*</Text>
                  </Text>
                  <TextInput
                    value={formData.password}
                    onChangeText={(value) => handleChange('password', value)}
                    secureTextEntry
                    placeholder="*&%^899"
                    className="w-full rounded-xl border border-gray-300 bg-white p-4  text-gray-800"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View>
                  <View>
                    <Text className="mb-2  font-medium text-gray-700">
                      تأكيد كلمة المرور <Text className="text-red-500">*</Text>
                    </Text>
                    <TextInput
                      value={formData.confpassword}
                      onChangeText={(value) => handleChange('confpassword', value)}
                      secureTextEntry
                      placeholder="*&%^899"
                      className="w-full rounded-xl border border-gray-300 bg-white p-4  text-gray-800"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  {formData.password !== formData.confpassword && (
                    <Text className=" text-sm text-red-600">
                      * كلمة المرور وتأكيد كلمة المرور غير متطابقتان
                    </Text>
                  )}
                </View>

                <View>
                  <Text className="mb-2  font-medium text-gray-700">حساب إنستجرام (إختياري)</Text>
                  <TextInput
                    value={formData.instagram}
                    onChangeText={(value) => handleChange('instagram', value)}
                    placeholder="@username"
                    className="w-full rounded-xl border border-gray-300 bg-white p-4  text-gray-800"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>
            </View>

            <View className="flex-row gap-4">
              <TouchableOpacity
                onPress={prevStep}
                className="flex-1 rounded-xl border border-gray-300 py-4">
                <Text className="text-center font-bold text-gray-700">السابق</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={nextStep}
                disabled={!isStep2Valid()}
                className={`flex-1 rounded-xl py-4 ${isStep2Valid() ? 'bg-[#CAA453]' : 'bg-gray-300'}`}>
                <Text className="text-center font-bold text-white">التالي</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Step 3: Documents & Additional Info */}
        {currentStep === 3 && (
          <View className="flex flex-col gap-8">
            <View>
              <Text className="mb-6 text-xl font-bold text-gray-800">
                المستندات والمعلومات الإضافية
              </Text>

              <View className="mb-6 rounded-xl border border-amber-100 bg-amber-50 p-4">
                <Text className=" text-amber-800">
                  <Text className="font-bold">ملاحظة:</Text> يرجى تحميل المستند المطلوب حسب نوع
                  النشاط.
                </Text>
              </View>

              <View className="flex flex-col gap-5">
                <View style={{ gap: 6 }}>
                  {/* Label */}
                  <View style={{ flexDirection: 'row', gap: 4 }}>
                    <Text style={{ fontWeight: '700', color: '#374151' }}>نوع المستند</Text>
                    <Text style={{ fontSize: 12, color: '#374151' }}>* إجباري</Text>
                  </View>

                  {/* Picker */}
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
                    style={{
                      borderRadius: 10,
                      backgroundColor: 'transparent',
                    }}
                  />
                </View>
                <View>
                  <ImageUpload
                    label="رفع المستند *"
                    value={formData.verificationDocument}
                    onChange={handleDocumentUrlChange}
                    type="document"
                    folder="/merchants/logos"
                  />
                </View>

                <View>
                  <Text className="mb-2  font-medium text-gray-700">ملاحظات إضافية (إختياري)</Text>
                  <TextInput
                    value={formData.additionalNotes}
                    onChangeText={(value) => handleChange('additionalNotes', value)}
                    multiline
                    numberOfLines={3}
                    placeholder="أوقات العمل، مميزات إضافية، معلومات أخرى..."
                    className="w-full rounded-xl border border-gray-300 bg-white p-4  text-gray-800"
                    placeholderTextColor="#9CA3AF"
                    textAlignVertical="top"
                  />
                </View>

                <View className="rounded-xl bg-gray-50 p-4">
                  <TouchableOpacity
                    onPress={() => setIsAgreed(!isAgreed)}
                    className="flex-row items-start">
                    <View
                      className={`mt-1 h-6 w-6 items-center justify-center rounded border ${
                        isAgreed ? 'border-[#CAA453] bg-[#CAA453]' : 'border-gray-400 bg-white'
                      }`}>
                      {isAgreed && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                    <View className="mr-3 flex-1">
                      <Text className=" text-gray-700">
                        أوافق على
                        <Text className="font-bold text-[#CAA453]">الشروط والأحكام العامة</Text>
                        لمنصة بيتنا
                      </Text>
                      <Text className="mt-1  text-sm text-gray-500">
                        بموافقتي، أقر بأني قد قرأت وفهمت جميع الشروط والأحكام المذكورة
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View className="space-y-4">
              <View className="flex-row gap-4">
                <TouchableOpacity
                  onPress={prevStep}
                  className="flex-1 rounded-xl border border-gray-300 py-4">
                  <Text className="text-center font-bold text-gray-700">السابق</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading || !isStep3Valid()}
                  className={`flex-1 rounded-xl py-4 ${
                    loading || !isStep3Valid() ? 'bg-gray-300' : 'bg-[#CAA453]'
                  }`}>
                  {loading ? (
                    <View className="flex-row items-center justify-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="mr-2 font-bold text-white">جاري التسجيل...</Text>
                    </View>
                  ) : (
                    <Text className="text-center font-bold text-white">تقديم طلب التسجيل</Text>
                  )}
                </TouchableOpacity>
              </View>

              <Text className="text-center text-sm text-gray-600">
                بعد تقديم الطلب، سيتم مراجعته من قبل الإدارة وسيتم إشعارك عند الموافقة
              </Text>
            </View>
          </View>
        )}
      </View>

      {/* Bottom padding for scroll */}
      <View className="h-20" />
    </ScrollView>
  );
}
