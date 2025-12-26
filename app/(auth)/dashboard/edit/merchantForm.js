import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { UPDATE_MY_MERCHANT, GET_MY_MERCHANT, UPDATE_MERCHANT_GALLERY } from '@/utils/queries';
import { useMutation } from '@apollo/client/react';
import { useNotification } from '@/context/notification-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import PhoneInput from 'react-native-international-phone-number';
import CitySelection from '@/components/ui/CitySelection';
import WorkingHours from '@/components/ui/WorkingHours';
import ImageUpload from '@/components/ui/ImageUpload';
import CategorySelection from '@/components/ui/CategorySelection';

const defaultFormData = {
  businessName: '',
  description: '',
  phone: '',
  whatsapp: '',
  email: '',
  website: '',
  instagram: '',
  logo: '',
  coverImage: '',
  galleryImages: [],
  workHours: { from: '09:00', to: '17:00', days: [] },
  address: '',
  documentType: '',
  additionalNotes: '',
  categoryId: '',
  category: '',
  cityId: '',
  city: '',
};

const merchantForm = () => {
  const { showSuccess, showError } = useNotification();
  const params = useLocalSearchParams();
  const [formData, setFormData] = useState(defaultFormData);
  const [touchedFields, setTouchedFields] = useState(new Set());
  const [formErrors, setFormErrors] = useState({});
  const [selectedPCountry, setSelectedPCountry] = useState(null);
  const [selectedWCountry, setSelectedWCountry] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (params.merchant) {
      try {
        const parsedMerchant = JSON.parse(params.merchant);

        // Transform merchant to formData directly
        setFormData({
          businessName: parsedMerchant.businessName || '',
          description: parsedMerchant.description || '',
          phone: parsedMerchant.phone || '',
          whatsapp: parsedMerchant.whatsapp || '',
          email: parsedMerchant.email || '',
          website: parsedMerchant.website || '',
          instagram: parsedMerchant.instagram || '',
          logo: parsedMerchant.logo?.url || '',
          coverImage: parsedMerchant.coverImage?.url || '',
          galleryImages: parsedMerchant.galleryImages || [],
          workHours: parsedMerchant.workHours
            ? {
                from: parsedMerchant.workHours.from || '09:00',
                to: parsedMerchant.workHours.to || '17:00',
                days: parsedMerchant.workHours.days || [],
              }
            : { from: '09:00', to: '17:00', days: [] },
          address: parsedMerchant.address || '',
          documentType: parsedMerchant.documentType || '',
          additionalNotes: parsedMerchant.additionalNotes || '',
          categoryId: parsedMerchant.category?.id || '',
          category: parsedMerchant.category?.nameAr || '',
          cityId: parsedMerchant.city?.id || '',
          city: parsedMerchant.city?.nameAr || '',
        });
      } catch (error) {
        console.error('Error parsing merchant:', error);
      }
    }
  }, [params.merchant]);

  const [updateMerchant, { loading: updateLoading, error: updateError }] = useMutation(
    UPDATE_MY_MERCHANT,
    {
      refetchQueries: [{ query: GET_MY_MERCHANT }],
    }
  );

  const loading = updateLoading;
  const error = updateError;

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.businessName.trim()) {
      errors.businessName = 'اسم النشاط مطلوب';
    }
    if (!formData.description.trim()) {
      errors.description = 'وصف النشاط مطلوب';
    }
    if (!formData.phone) {
      errors.phone = 'رقم الجوال مطلوب';
    }
    if (!formData.categoryId) {
      errors.categoryId = 'القسم الرئيسي مطلوب';
    }
    if (!formData.cityId) {
      errors.cityId = 'المدينة مطلوبة';
    }

    // Email validation if provided
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    // Website validation if provided
    if (formData.website && !/^https?:\/\/.+\..+/.test(formData.website)) {
      errors.website = 'يرجى إدخال رابط موقع صحيح';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return false;
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    const phone = selectedPCountry?.idd?.root
      ? `${selectedPCountry.idd.root}${formData.phone}`
      : formData.phone;

    const whatsapp = selectedWCountry?.idd?.root
      ? `${selectedWCountry.idd.root}${formData.whatsapp}`
      : formData.whatsapp;

    const allFields = Object.keys(formData);
    setTouchedFields(new Set(allFields));

    // Validate form
    if (!validateForm()) {
      showError('يرجى تصحيح الأخطاء في النموذج قبل الإرسال');
      return;
    }
    const { galleryImages, ...formDataWithoutGallery } = formData;

    const input = { ...formDataWithoutGallery, phone, whatsapp };

    // Remove empty strings and trim values
    Object.keys(input).forEach((key) => {
      const value = input[key];
      if (typeof value === 'string' && value.trim() === '') {
        input[key] = null;
      } else if (typeof value === 'string') {
        input[key] = value.trim();
      }
    });

    try {
      if (params.merchant) {
        // Update existing merchant

        await updateMerchant({
          variables: { input },
        });

        showSuccess('تم تحديث بيانات المتجر بنجاح!');
        router.push('/(auth)/dashboard');
      }
    } catch (err) {
      console.error('Failed to save merchant:', err);
      showError(`فشل في حفظ البيانات: ${err.message}`);
    }
  };

  const handleChange = (name, value) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (formErrors[name]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleWorkHoursChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      workHours: {
        ...prev.workHours,
        [field]: value,
      },
    }));
  };

  const handleBlur = (fieldName) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
    validateForm();
  };

  const isFieldValid = (fieldName) => {
    if (!touchedFields.has(fieldName)) return true;
    return !formErrors[fieldName];
  };

  const getFieldError = (fieldName) => {
    return formErrors[fieldName];
  };

  const handleLogoChange = (url) => {
    setFormData((prev) => ({
      ...prev,
      logo: url,
    }));
  };

  const handleCoverImageChange = (url) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: url,
    }));
  };

  const [updateGallery] = useMutation(UPDATE_MERCHANT_GALLERY, {
    onCompleted: (data) => {
      // If server returns the complete updated gallery array
      if (data?.updateMerchantGallery?.galleryImages) {
        setFormData((prev) => ({
          ...prev,
          galleryImages: data.updateMerchantGallery.galleryImages,
        }));
      }
      setUploading(false);
    },
    onError: (error) => {
      setError(error.message);
      setUploading(false);
    },
  });

  const handleGalleryImagesChange = (url) => {
    if (!url) return;

    setFormData((prev) => ({
      ...prev,
      galleryImages: [...prev.galleryImages, url],
    }));

    updateGallery({
      variables: {
        input: {
          newImages: [url],
          removedImageIds: [],
        },
      },
    });
  };

  return (
    <ScrollView className="rounded-2xl border border-gray-200 bg-white">
      {/* Form content */}
      <View className="p-6">
        {/* Basic Information */}
        <View className="-mx-2 mb-4 flex-row flex-wrap">
          <View className="mb-4 w-full px-2 md:w-1/2">
            {/* Form labels - use arabic-bold for emphasis */}
            <Text className="font-arabic-bold mb-2 text-sm uppercase tracking-wide text-amber-600">
              اسم النشاط *
            </Text>
            <TextInput
              value={formData.businessName}
              onChangeText={(value) => handleChange('businessName', value)}
              onBlur={() => handleBlur('businessName')}
              placeholder="أدخل اسم النشاط التجاري"
              className={`w-full rounded-lg border p-3 focus:border-amber-500 ${
                isFieldValid('businessName') ? 'border-gray-300' : 'border-red-500'
              }`}
            />
            {/* Error messages - use arabic-medium */}
            {!isFieldValid('businessName') && (
              <Text className="font-arabic-medium mt-1 text-sm text-red-500">
                {getFieldError('businessName')}
              </Text>
            )}
          </View>
        </View>
        {/* Description */}
        <View className="mb-4">
          <Text className="font-arabic-bold mb-2 text-sm uppercase tracking-wide text-amber-600">
            وصف النشاط *
          </Text>
          <TextInput
            value={formData.description}
            onChangeText={(value) => handleChange('description', value)}
            onBlur={() => handleBlur('description')}
            placeholder="صف نشاطك التجاري بالتفصيل"
            multiline
            numberOfLines={4}
            className={`w-full rounded-lg border p-3 focus:border-amber-500 ${
              isFieldValid('description') ? 'border-gray-300' : 'border-red-500'
            }`}
          />
          {!isFieldValid('description') && (
            <Text className="font-arabic-medium mt-1 text-sm text-red-500">
              {getFieldError('description')}
            </Text>
          )}
        </View>
        <View className="mb-4">
          <Text className="font-arabic-bold mb-2 text-sm uppercase tracking-wide text-amber-600">
            رقم هاتف*
          </Text>
          {/* PhoneInput component would go here */}

          <View style={{ direction: 'ltr' }}>
            <PhoneInput
              value={formData.phone}
              onChangePhoneNumber={(value) => {
                handleChange('phone', value);
              }}
              selectedCountry={selectedPCountry}
              onChangeSelectedCountry={setSelectedPCountry}
              placeholder="ادخل رقم الجوال"
            />
          </View>

          {!isFieldValid('phone') && (
            <Text className="font-arabic-medium mt-1 text-sm text-red-500">
              {getFieldError('phone')}
            </Text>
          )}
        </View>
        <View className="mb-4">
          <Text className="font-arabic-bold mb-2 text-sm uppercase tracking-wide text-amber-600">
            رقم الواتساب
          </Text>
          <View style={{ direction: 'ltr' }}>
            <PhoneInput
              value={formData.whatsapp}
              onChangePhoneNumber={(value) => {
                handleChange('whatsapp', value);
              }}
              selectedCountry={selectedWCountry}
              onChangeSelectedCountry={setSelectedWCountry}
              placeholder="ادخل رقم الواتساب"
            />
          </View>

          {!isFieldValid('whatsapp') && (
            <Text className="font-arabic-medium mt-1 text-sm text-red-500">
              {getFieldError('whatsapp')}
            </Text>
          )}
        </View>
        {/* Contact Information */}
        <View className="-mx-2 mb-4 flex-row flex-wrap">
          <View className="mb-4 w-full px-2 md:w-1/2">
            <Text className="font-arabic-bold mb-2 text-sm uppercase tracking-wide text-amber-600">
              البريد الإلكتروني
            </Text>
            <TextInput
              value={formData.email}
              onChangeText={(value) => handleChange('email', value)}
              onBlur={() => handleBlur('email')}
              placeholder="email@example.com"
              keyboardType="email-address"
              className={`w-full rounded-lg border p-3 focus:border-amber-500 ${
                isFieldValid('email') ? 'border-gray-300' : 'border-red-500'
              }`}
            />
            {!isFieldValid('email') && (
              <Text className="font-arabic-medium mt-1 text-sm text-red-500">
                {getFieldError('email')}
              </Text>
            )}
          </View>

          <View className="mb-4 w-full px-2 md:w-1/2">
            <Text className="font-arabic-bold mb-2 text-sm uppercase tracking-wide text-amber-600">
              الموقع الإلكتروني
            </Text>
            <TextInput
              value={formData.website}
              onChangeText={(value) => handleChange('website', value)}
              onBlur={() => handleBlur('website')}
              placeholder="https://example.com"
              keyboardType="url"
              className={`w-full rounded-lg border p-3 focus:border-amber-500 ${
                isFieldValid('website') ? 'border-gray-300' : 'border-red-500'
              }`}
            />
            {!isFieldValid('website') && (
              <Text className="font-arabic-medium mt-1 text-sm text-red-500">
                {getFieldError('website')}
              </Text>
            )}
          </View>
          <View className="mb-4 w-full px-2 md:w-1/2">
            <Text className="font-arabic-bold mb-2 text-sm uppercase tracking-wide text-amber-600">
              حساب انستغرام
            </Text>
            <TextInput
              value={formData.instagram}
              onChangeText={(value) => handleChange('instagram', value)}
              onBlur={() => handleBlur('instagram')}
              placeholder="@username"
              className={`w-full rounded-lg border p-3 focus:border-amber-500 ${
                isFieldValid('instagram') ? 'border-gray-300' : 'border-red-500'
              }`}
            />
            {!isFieldValid('instagram') && (
              <Text className="font-arabic-medium mt-1 text-sm text-red-500">
                {getFieldError('website')}
              </Text>
            )}
          </View>
        </View>

        {/* ImageUpload components - assuming they have their own Text components */}
        {/* Keep as is if they're separate components */}
        <ImageUpload
          label="شعار المتجر"
          value={formData.logo}
          onChange={handleLogoChange}
          type="logo"
          folder="/merchants/logos"
        />

        <ImageUpload
          label="صورة الغلاف"
          value={formData.coverImage}
          onChange={handleCoverImageChange}
          type="cover"
          folder="/merchants/covers"
        />

        {/* Gallery Images Upload */}
        <View>
          <ImageUpload
            label="معرض الصور"
            value={formData.galleryImages.map((img) => img.url)}
            onChange={handleGalleryImagesChange}
            type="gallery"
            folder="/merchants/gallery"
          />
        </View>

        {/* City and Category */}
        <View className="-mx-2 mb-4 flex-row flex-wrap">
          <View className="mb-4 w-full px-2 md:w-1/2">
            <Text className="font-arabic-bold mb-2 text-sm uppercase tracking-wide text-amber-600">
              الدولة
            </Text>
            <CitySelection
              formData={formData}
              onChange={handleChange}
              onBlur={handleBlur}
              required={true}
            />
            {!isFieldValid('cityId') && (
              <Text className="font-arabic-medium mt-1 text-sm text-red-500">
                {getFieldError('cityId')}
              </Text>
            )}
          </View>

          <View className="mb-4 w-full px-2 md:w-1/2">
            <Text className="font-arabic-bold mb-2 text-sm uppercase tracking-wide text-amber-600">
              القسم
            </Text>
            <CategorySelection
              formData={formData}
              onChange={handleChange}
              onBlur={handleBlur}
              required={true}
              className={`w-full rounded-lg border p-3 focus:border-amber-500 ${
                isFieldValid('categoryId') ? 'border-gray-300' : 'border-red-500'
              }`}
            />
            {!isFieldValid('categoryId') && (
              <Text className="font-arabic-medium mt-1 text-sm text-red-500">
                {getFieldError('categoryId')}
              </Text>
            )}
          </View>
        </View>
        {/* Address */}
        <View className="mb-4">
          <Text className="font-arabic-bold mb-2 text-sm uppercase tracking-wide text-amber-600">
            العنوان
          </Text>
          <TextInput
            value={formData.address}
            onChangeText={(value) => handleChange('address', value)}
            placeholder="أدخل العنوان التفصيلي"
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-amber-500"
          />
        </View>
        {/* Additional Notes */}
        <View className="mb-4">
          <Text className="font-arabic-bold mb-2 text-sm uppercase tracking-wide text-amber-600">
            ملاحظات إضافية
          </Text>
          <TextInput
            value={formData.additionalNotes}
            onChangeText={(value) => handleChange('additionalNotes', value)}
            placeholder="أي ملاحظات إضافية تريد إضافتها..."
            multiline
            numberOfLines={2}
            className="w-full rounded-lg border border-gray-300 p-3 focus:border-amber-500"
          />
        </View>

        <WorkingHours workHours={formData.workHours} onWorkHoursChange={handleWorkHoursChange} />

        {/* Error Display */}
        {error && (
          <View className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3">
            {/* Error messages - use arabic-medium for readability */}
            <Text className="font-arabic-medium text-red-700">
              فشل في حفظ البيانات: {error.message}
            </Text>
          </View>
        )}
        {/* Submit Button */}
        <View className="flex-row justify-end border-t border-gray-200 pt-6">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="rounded-lg bg-amber-600 px-6 py-2">
            {loading ? (
              <View className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
            ) : params.merchant ? (
              <Text className="font-arabic-bold text-white">تحديث البيانات</Text>
            ) : (
              <Text className="font-arabic-bold text-white">إضافة المتجر</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default merchantForm;
