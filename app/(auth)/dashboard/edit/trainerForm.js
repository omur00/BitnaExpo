import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { UPDATE_MY_TRAINER, GET_MY_TRAINER } from '@/utils/queries';
import { useMutation } from '@apollo/client/react';
import { useNotification } from '@/context/notification-context';
import PhoneInput from 'react-native-international-phone-number';
import { useLocalSearchParams, useRouter } from 'expo-router';
import ImageUpload from '@/components/ui/ImageUpload';
import { Picker } from '@/components/ui/picker';

const TrainerFormModal = ({ trainer, refetch }) => {
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [selectedPCountry, setSelectedPCountry] = useState(null);
  const [selectedWCountry, setSelectedWCountry] = useState(null);
  const { showSuccess, showError } = useNotification();
  const params = useLocalSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState({
    fullName: '',
    specialization: '',
    description: '',
    phone: '',
    whatsapp: '',
    email: '',
    website: '',
    instagram: '',
    profileImage: '',
    galleryImages: [],
    courses: [
      {
        name: '',
        description: '',
        duration: '',
        price: '',
        sessions: '',
        level: '',
        includes: [],
      },
    ],
    documentType: '',
    additionalNotes: '',
    categoryId: '',
    cityId: '',
    logo: '',
    coverImage: '',
  });

  const [touchedFields, setTouchedFields] = useState(new Set());
  const [formErrors, setFormErrors] = useState({});

  // Initialize form with trainer data if editing
  useEffect(() => {
    if (params.trainer) {
      try {
        const parsedTrainer = JSON.parse(params.trainer);
        setFormData({
          fullName: parsedTrainer.fullName || '',
          specialization: parsedTrainer.specialization || '',
          description: parsedTrainer.description || '',
          phone: parsedTrainer.phone || '',
          whatsapp: parsedTrainer.whatsapp || '',
          email: parsedTrainer.email || '',
          website: parsedTrainer.website || '',
          instagram: parsedTrainer.instagram || '',
          profileImage: parsedTrainer.profileImage || parsedTrainer.logo?.url || '',
          galleryImages: parsedTrainer.galleryImages || [],
          courses:
            parsedTrainer.courses && parsedTrainer.courses.length > 0
              ? parsedTrainer.courses.map((course) => ({
                  name: course.name || '',
                  description: course.description || '',
                  duration: course.duration || '',
                  price: course.price || '',
                  sessions: course.sessions || '',
                  level: course.level || '',
                  includes: course.includes || [],
                }))
              : [
                  {
                    name: '',
                    description: '',
                    duration: '',
                    price: '',
                    sessions: '',
                    level: '',
                    includes: [],
                  },
                ],
          documentType: parsedTrainer.documentType || '',
          additionalNotes: parsedTrainer.additionalNotes || '',
          categoryId: parsedTrainer.category?.id || '',
          cityId: parsedTrainer.city?.id || '',
          logo: parsedTrainer.logo?.url || '',
          coverImage: parsedTrainer.coverImage?.url || '',
        });
      } catch (error) {
        console.error('Error parsing merchant:', error);
      }
    }
  }, [params.trainer]);

  const [updateTrainer, { loading: updateLoading, error: updateError }] = useMutation(
    UPDATE_MY_TRAINER,
    {
      refetchQueries: [{ query: GET_MY_TRAINER }],
    }
  );

  const loading = updateLoading;
  const error = updateError;

  const validateForm = () => {
    const errors = {};

    // Required fields validation
    if (!formData.fullName.trim()) {
      errors.fullName = 'الاسم الكامل مطلوب';
    }
    if (!formData.specialization.trim()) {
      errors.specialization = 'التخصص مطلوب';
    }
    if (!formData.description.trim()) {
      errors.description = 'الوصف مطلوب';
    }
    if (!formData.phone.trim()) {
      errors.phone = 'رقم الجوال مطلوب';
    }
    if (!formData.documentType.trim()) {
      errors.documentType = 'نوع المستند مطلوب';
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

    // Phone validation
    if (formData.phone && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.phone)) {
      errors.phone = 'يرجى إدخال رقم هاتف صحيح';
    }

    // WhatsApp validation if provided
    if (formData.whatsapp && !/^[\+]?[0-9\s\-\(\)]+$/.test(formData.whatsapp)) {
      errors.whatsapp = 'يرجى إدخال رقم واتساب صحيح';
    }
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    // Mark all fields as touched on submit
    const allFields = Object.keys(formData);
    setTouchedFields(new Set(allFields));

    // Validate form
    if (!validateForm()) {
      showError('يرجى تصحيح الأخطاء في النموذج قبل الإرسال');
      return;
    }

    const input = {
      ...formData,
      profileImage: profileImageUrl || formData.profileImage,
      courses: formData.courses
        .filter(
          (course) =>
            course.name.trim() !== '' ||
            course.description.trim() !== '' ||
            course.duration.trim() !== '' ||
            course.price.trim() !== ''
        )
        .map((course) => ({
          ...course,
          price: course.price ? Number(course.price) : null,
          sessions: course.sessions ? Number(course.sessions) : null,
          duration: course.duration ? Number(course.duration) : null,
          includes: course.includes.filter((item) => item.trim() !== ''),
        })),
    };

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
      if (params.trainer) {
        const { galleryImages, ...filteredInput } = input;
        await updateTrainer({
          variables: { input: filteredInput },
        });
        showSuccess('تم تحديث بيانات المدرب بنجاح!');
        router.push('/(auth)/dashboard');
      }
    } catch (err) {
      console.error('Failed to save trainer:', err);
      showError(`فشل في حفظ البيانات: ${err.message}`);
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (formErrors[field]) {
      setFormErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleCourseChange = (index, field, value) => {
    const updatedCourses = [...formData.courses];
    updatedCourses[index] = {
      ...updatedCourses[index],
      [field]: value,
    };
    setFormData((prev) => ({
      ...prev,
      courses: updatedCourses,
    }));
  };

  const handleIncludeChange = (courseIndex, includeIndex, value) => {
    const updatedCourses = [...formData.courses];
    const updatedIncludes = [...updatedCourses[courseIndex].includes];
    updatedIncludes[includeIndex] = value;

    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      includes: updatedIncludes,
    };

    setFormData((prev) => ({
      ...prev,
      courses: updatedCourses,
    }));
  };

  const addIncludeItem = (courseIndex) => {
    const updatedCourses = [...formData.courses];
    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      includes: [...updatedCourses[courseIndex].includes, ''],
    };

    setFormData((prev) => ({
      ...prev,
      courses: updatedCourses,
    }));
  };

  const removeIncludeItem = (courseIndex, includeIndex) => {
    const updatedCourses = [...formData.courses];
    const updatedIncludes = updatedCourses[courseIndex].includes.filter(
      (_, i) => i !== includeIndex
    );

    updatedCourses[courseIndex] = {
      ...updatedCourses[courseIndex],
      includes: updatedIncludes,
    };

    setFormData((prev) => ({
      ...prev,
      courses: updatedCourses,
    }));
  };

  const addCourse = () => {
    setFormData((prev) => ({
      ...prev,
      courses: [
        ...prev.courses,
        {
          name: '',
          description: '',
          duration: '',
          price: '',
          sessions: '',
          level: '',
          includes: [],
        },
      ],
    }));
  };

  const removeCourse = (index) => {
    if (formData.courses.length > 1) {
      setFormData((prev) => ({
        ...prev,
        courses: prev.courses.filter((_, i) => i !== index),
      }));
    }
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

  const handleProfileImageChange = (url) => {
    setFormData((prev) => ({
      ...prev,
      profileImage: url,
    }));
  };

  const handleCoverImageChange = (url) => {
    setFormData((prev) => ({
      ...prev,
      coverImage: url,
    }));
  };

  return (
    <ScrollView className="bg-gray-50">
      {/* Header */}
      <View className="px-4 py-6">
        <Text className="text-2xl font-bold text-gray-900">
          {trainer ? 'تحديث بيانات المدرب' : 'إضافة مدرب جديد'}
        </Text>
        <Text className="mt-1 text-blue-500">
          {trainer ? 'قم بتحديث معلومات مدربك' : 'املأ النموذج لإضافة مدرب جديد'}
        </Text>
      </View>

      {/* Form content */}
      <View className="px-4 pb-6">
        {/* Basic Information Card */}
        <View className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <View className="border-b border-gray-200 bg-blue-50 px-4 py-3">
            <Text className="text-lg font-bold text-blue-700">المعلومات الأساسية</Text>
            <Text className="text-sm text-gray-600">معلومات المدرب الشخصية والتخصص</Text>
          </View>

          <View className="p-4">
            <View className="mb-4">
              <View className="mb-1 flex-row items-center">
                <Text className="font-semibold text-gray-700">الاسم الكامل</Text>
                <Text className="mr-1 text-red-500">*</Text>
              </View>
              <TextInput
                value={formData.fullName}
                onChangeText={(value) => handleChange('fullName', value)}
                onBlur={() => handleBlur('fullName')}
                placeholder="أدخل الاسم الكامل"
                className={`h-12 rounded-lg border px-4 ${
                  isFieldValid('fullName')
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-red-400 bg-red-50'
                }`}
              />
              {!isFieldValid('fullName') && (
                <Text className="mt-1 text-xs text-red-500">{getFieldError('fullName')}</Text>
              )}
            </View>

            <View className="mb-4">
              <View className="mb-1 flex-row items-center">
                <Text className="font-semibold text-gray-700">التخصص</Text>
                <Text className="mr-1 text-red-500">*</Text>
              </View>
              <TextInput
                value={formData.specialization}
                onChangeText={(value) => handleChange('specialization', value)}
                onBlur={() => handleBlur('specialization')}
                placeholder="أدخل التخصص"
                className={`h-12 rounded-lg border px-4 ${
                  isFieldValid('specialization')
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-red-400 bg-red-50'
                }`}
              />
              {!isFieldValid('specialization') && (
                <Text className="mt-1 text-xs text-red-500">{getFieldError('specialization')}</Text>
              )}
            </View>

            <View className="mb-4">
              <View className="mb-1 flex-row items-center">
                <Text className="font-semibold text-gray-700">الوصف</Text>
                <Text className="mr-1 text-red-500">*</Text>
              </View>
              <TextInput
                value={formData.description}
                onChangeText={(value) => handleChange('description', value)}
                onBlur={() => handleBlur('description')}
                placeholder="صف خبراتك ومؤهلاتك وأسلوب التدريب..."
                multiline
                numberOfLines={4}
                className={`min-h-[120px] rounded-lg border px-4 py-3 text-right ${
                  isFieldValid('description')
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-red-400 bg-red-50'
                }`}
                textAlignVertical="top"
              />
              {!isFieldValid('description') && (
                <Text className="mt-1 text-xs text-red-500">{getFieldError('description')}</Text>
              )}
            </View>

            <View className="mb-4">
              <ImageUpload
                label="صورة الملف الشخصي"
                value={formData.profileImage}
                onChange={handleProfileImageChange}
                type="logo"
                folder="/merchants/logos"
              />
            </View>
            <View className="mb-4">
              <ImageUpload
                label="صورة الغلاف"
                value={formData.coverImage}
                onChange={handleCoverImageChange}
                type="cover"
                folder="/merchants/covers"
              />
            </View>
          </View>
        </View>

        {/* Contact Information Card */}
        <View className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <View className="border-b border-gray-200 bg-green-50 px-4 py-3">
            <Text className="text-lg font-bold text-green-700">معلومات الاتصال</Text>
            <Text className="text-sm text-gray-600">كيف يمكن للعملاء التواصل معك</Text>
          </View>

          <View className="p-4">
            <View className="mb-4">
              <View className="mb-1 flex-row items-center">
                <Text className="font-semibold text-gray-700">رقم الجوال</Text>
                <Text className="mr-1 text-red-500">*</Text>
              </View>
              <View className="overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
                <PhoneInput
                  value={formData.phone}
                  onChangePhoneNumber={(value) => handleChange('phone', value)}
                  selectedCountry={selectedPCountry}
                  onChangeSelectedCountry={setSelectedPCountry}
                  placeholder="ادخل رقم الجوال"
                  inputStyle={{ height: 48, paddingHorizontal: 16 }}
                />
              </View>
              {!isFieldValid('phone') && (
                <Text className="mt-1 text-xs text-red-500">{getFieldError('phone')}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="mb-1 font-semibold text-gray-700">رقم الواتساب</Text>
              <View className="overflow-hidden rounded-lg border border-gray-300 bg-gray-50">
                <PhoneInput
                  value={formData.whatsapp}
                  onChangePhoneNumber={(value) => handleChange('whatsapp', value)}
                  selectedCountry={selectedWCountry}
                  onChangeSelectedCountry={setSelectedWCountry}
                  placeholder="ادخل رقم الواتساب"
                  inputStyle={{ height: 48, paddingHorizontal: 16 }}
                />
              </View>
              {!isFieldValid('whatsapp') && (
                <Text className="mt-1 text-xs text-red-500">{getFieldError('whatsapp')}</Text>
              )}
            </View>

            <View className="mb-4">
              <Text className="mb-1 font-semibold text-gray-700">البريد الإلكتروني</Text>
              <TextInput
                value={formData.email}
                onChangeText={(value) => handleChange('email', value)}
                onBlur={() => handleBlur('email')}
                placeholder="email@example.com"
                keyboardType="email-address"
                className={`h-12 rounded-lg border px-4 ${
                  isFieldValid('email') ? 'border-gray-300 bg-gray-50' : 'border-red-400 bg-red-50'
                }`}
              />
              {!isFieldValid('email') && (
                <Text className="mt-1 text-xs text-red-500">{getFieldError('email')}</Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="mb-1 font-semibold text-gray-700">الموقع الإلكتروني</Text>
              <TextInput
                value={formData.website}
                onChangeText={(value) => handleChange('website', value)}
                onBlur={() => handleBlur('website')}
                placeholder="https://example.com"
                keyboardType="url"
                className={`h-12 rounded-lg border px-4 ${
                  isFieldValid('website')
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-red-400 bg-red-50'
                }`}
              />
              {!isFieldValid('website') && (
                <Text className="mt-1 text-xs text-red-500">{getFieldError('website')}</Text>
              )}
            </View>
            <View className="mb-4">
              <Text className="mb-1 font-semibold text-gray-700">حساب انستغرام</Text>
              <TextInput
                value={formData.instagram}
                onChangeText={(value) => handleChange('instagram', value)}
                onBlur={() => handleBlur('instagram')}
                placeholder="@username"
                keyboardType=""
                className={`h-12 rounded-lg border px-4 ${
                  isFieldValid('instagram')
                    ? 'border-gray-300 bg-gray-50'
                    : 'border-red-400 bg-red-50'
                }`}
              />
              {!isFieldValid('instagram') && (
                <Text className="mt-1 text-xs text-red-500">{getFieldError('instagram')}</Text>
              )}
            </View>
          </View>
        </View>

        {/* Courses Section Card */}
        <View className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <View className="border-b border-gray-200 bg-purple-50 px-4 py-3">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-lg font-bold text-purple-700">الدورات التدريبية</Text>
                <Text className="text-sm text-gray-600">الدورات والبرامج التدريبية المقدمة</Text>
              </View>
              <TouchableOpacity
                onPress={addCourse}
                className="flex-row items-center rounded-lg bg-purple-600 px-3 py-2">
                <Text className="ml-1 text-white">+</Text>
                <Text className="font-semibold text-white">إضافة دورة</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="p-4">
            {formData.courses.map((course, index) => (
              <View
                key={index}
                className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50">
                <View className="border-b border-gray-200 bg-white px-3 py-2">
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="mr-2 h-7 w-7 items-center justify-center rounded-full bg-purple-100">
                        <Text className="font-bold text-purple-600">{index + 1}</Text>
                      </View>
                      <Text className="font-bold text-gray-700">
                        {course.name.trim() || `الدورة ${index + 1}`}
                      </Text>
                    </View>
                    {formData.courses.length > 1 && (
                      <TouchableOpacity
                        onPress={() => removeCourse(index)}
                        className="rounded bg-red-100 px-2 py-1">
                        <Text className="text-sm font-semibold text-red-600">حذف</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                <View className="p-3">
                  <View className="mb-3">
                    <Text className="mb-1 text-sm font-medium text-gray-600">اسم الدورة</Text>
                    <TextInput
                      value={course.name}
                      onChangeText={(value) => handleCourseChange(index, 'name', value)}
                      placeholder="اسم الدورة"
                      className="h-12 rounded-lg border border-gray-300 bg-white px-3"
                      scrollEnabled={false}
                    />
                  </View>

                  <View className="mb-3">
                    <Text className="mb-1 text-sm font-medium text-gray-600">وصف الدورة</Text>
                    <TextInput
                      value={course.description}
                      onChangeText={(value) => handleCourseChange(index, 'description', value)}
                      placeholder="وصف مفصل للدورة..."
                      multiline
                      numberOfLines={2}
                      className="min-h-[80px] rounded-lg border border-gray-300 bg-white px-3 py-2"
                      textAlignVertical="top"
                      scrollEnabled={false}
                    />
                  </View>

                  <View className="-mx-1 flex-row flex-wrap">
                    <View className="mb-3 w-1/2 px-1">
                      <Text className="mb-1 text-sm font-medium text-gray-600">المدة</Text>
                      <TextInput
                        value={course.duration}
                        onChangeText={(value) => handleCourseChange(index, 'duration', value)}
                        placeholder="3 أشهر"
                        keyboardType="numeric"
                        className="h-12 rounded-lg border border-gray-300 bg-white px-3"
                        scrollEnabled={false}
                      />
                    </View>

                    <View className="mb-3 w-1/2 px-1">
                      <Text className="mb-1 text-sm font-medium text-gray-600">عدد الجلسات</Text>
                      <TextInput
                        value={course.sessions}
                        onChangeText={(value) => handleCourseChange(index, 'sessions', value)}
                        placeholder="12"
                        keyboardType="numeric"
                        className="h-12 rounded-lg border border-gray-300 bg-white px-3"
                        scrollEnabled={false}
                      />
                    </View>

                    <View className="mb-3 w-1/2 px-1">
                      <Text className="mb-1 text-sm font-medium text-gray-600">
                        السعر (دينار كويتي)
                      </Text>
                      <TextInput
                        value={course.price}
                        onChangeText={(value) => handleCourseChange(index, 'price', value)}
                        placeholder="250"
                        keyboardType="numeric"
                        className="h-12 rounded-lg border border-gray-300 bg-white px-3"
                        scrollEnabled={false}
                      />
                    </View>

                    <View className="mb-3 w-1/2 px-1">
                      <Text className="mb-1 text-sm font-medium text-gray-600">المستوى</Text>
                      <Picker
                        options={[
                          { label: 'اختر المستوى', value: '' },
                          { label: 'مبتدئ', value: 'Beginner' },
                          { label: 'متوسط', value: 'Intermediate' },
                          { label: 'متقدم', value: 'Advanced' },
                          { label: 'جميع المستويات', value: 'All Levels' },
                        ]}
                        value={course.level || ''}
                        onValueChange={(value) => handleCourseChange(index, 'level', value)}
                        placeholder="اختر المستوى"
                        style={{
                          borderColor: '#D1D5DB',
                          backgroundColor: 'white',
                          borderRadius: 8,
                        }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Additional Notes Card */}
        <View className="mb-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <View className="border-b border-gray-200 bg-amber-50 px-4 py-3">
            <Text className="text-lg font-bold text-amber-700">ملاحظات إضافية</Text>
            <Text className="text-sm text-gray-600">أي معلومات إضافية تريد إضافتها</Text>
          </View>

          <View className="p-4">
            <TextInput
              value={formData.additionalNotes}
              onChangeText={(value) => handleChange('additionalNotes', value)}
              placeholder="مثل: الشهادات، الخبرات السابقة، طريقة التدريب..."
              multiline
              numberOfLines={3}
              className="min-h-[100px] rounded-lg border border-gray-300 bg-gray-50 px-4 py-3"
              textAlignVertical="top"
            />
          </View>
        </View>

        {/* Error Display */}
        {error && (
          <View className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
            <View className="flex-row items-center">
              <View className="mr-2 h-6 w-6 items-center justify-center rounded-full bg-red-100">
                <Text className="font-bold text-red-600">!</Text>
              </View>
              <Text className="font-semibold text-red-700">فشل في حفظ البيانات</Text>
            </View>
            <Text className="mt-2 text-red-600">{error.message}</Text>
          </View>
        )}

        {/* Submit Button */}
        <View className="flex-row justify-between pt-4">
          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className="flex-1 rounded-lg bg-blue-600 py-4">
            {loading ? (
              <View className="items-center">
                <View className="h-6 w-6 animate-spin rounded-full border-2 border-white border-t-transparent" />
              </View>
            ) : trainer ? (
              <Text className="text-center text-lg font-bold text-white">تحديث البيانات</Text>
            ) : (
              <Text className="text-center text-lg font-bold text-white">إضافة المدرب</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

export default TrainerFormModal;
