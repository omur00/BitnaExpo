import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { REGISTER_TRAINER, GET_CATEGORIES, GET_CITIES } from '@/utils/queries';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@/components/ui/picker';
import { PhoneInputField } from '@/components/ui/phone-input';
import { useMutation, useQuery } from '@apollo/client/react';
import { useAuth } from '@/context/auth-context';
import ImageUpload from '@/components/ui/ImageUpload';

const levelOptions = [
  { value: '', label: 'اختر المستوى' },
  { value: 'Beginner', label: 'مبتدئ' },
  { value: 'Intermediate', label: 'متوسط' },
  { value: 'Advanced', label: 'متقدم' },
  { value: 'All Levels', label: 'جميع المستويات' },
];

const documentTypes = [
  { value: 'صورة البطاقة المدنية', label: 'صورة البطاقة المدنية' },
  { value: 'شهادة التأمينات', label: 'شهادة التأمينات' },
  { value: 'شهادة من الشؤون', label: 'شهادة من الشؤون' },
  { value: 'شهادة وزارة التجارة', label: 'شهادة وزارة التجارة' },
  { value: 'شهادة إعاقة', label: 'شهادة إعاقة' },
  { value: 'شهادة هيئة البدون', label: 'شهادة هيئة البدون' },
];

export default function TrainerRegistration() {
  const { login } = useAuth();
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [isAgreed, setIsAgreed] = useState(false);

  const [formData, setFormData] = useState({
    fullName: 'aaaaa',
    specialization: 'asddsad',
    description: 'asdsadasdadasdasd',
    categoryId: '',
    cityId: '',
    phone: '223323333',
    whatsapp: '223323333',
    email: 'asdasd@dasda.com',
    website: '',
    instagram: '',
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
    password: '123123123',
    confpassword: '123123123',
    additionalNotes: '',
    documentType: '',
    verificationDocument: null,
  });

  const { data: categoriesData } = useQuery(GET_CATEGORIES);
  const { data: citiesData } = useQuery(GET_CITIES);

  const [registerTrainer, { loading, error }] = useMutation(REGISTER_TRAINER, {
    onCompleted: async (data) => {
      if (data?.registerTrainer?.user) {
        login(data.registerTrainer.user);
        router.push('/dashboard');
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

      await registerTrainer({
        variables: {
          input: {
            ...formData,
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
          },
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
    return (
      formData.fullName &&
      formData.specialization &&
      formData.description &&
      formData.categoryId &&
      formData.cityId
    );
  };

  const isStep2Valid = () => {
    return formData.phone && formData.email && formData.password === formData.confpassword;
  };

  const isStep3Valid = () => {
    return formData.documentType && formData.verificationDocument;
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

  // Progress bar steps
  const steps = [
    { number: 1, title: 'المعلومات الشخصية' },
    { number: 2, title: 'معلومات التواصل' },
    { number: 3, title: 'المستندات' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header with Progress Bar */}
      <View className="border-b border-gray-200 bg-white px-6 pb-6 pt-8">
        <View className="mb-4">
          <Text className="font-arabic-regular mt-1 text-sm text-gray-600">
            املأ البيانات التالية لعرض خدماتك على المنصة
          </Text>
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
                    className={`font-arabic-semibold ${
                      currentStep >= step.number ? 'text-white' : 'text-gray-500'
                    }`}>
                    {step.number}
                  </Text>
                </View>
                {currentStep === step.number && (
                  <Text className="font-arabic-semibold text-sm text-[#CAA453]">{step.title}</Text>
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
              <Text className="font-arabic-regular flex-1 text-sm text-red-700">
                {error.message}
              </Text>
            </View>
          </View>
        )}

        {/* Step 1: Personal Information */}
        {currentStep === 1 && (
          <View className="gap-6">
            <View className="gap-1">
              <View className="flex-row items-center gap-2">
                <Ionicons name="person-circle-outline" size={20} color="#374151" />
                <Text className="font-arabic-bold text-base text-gray-800">المعلومات الشخصية</Text>
              </View>
              <Text className="font-arabic-regular text-sm text-gray-600">
                البيانات الأساسية لملفك التدريبي
              </Text>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-arabic-semibold text-sm text-gray-700">الإسم الكامل</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <TextInput
                  value={formData.fullName}
                  onChangeText={(value) => handleChange('fullName', value)}
                  placeholder="الاسم الكامل"
                  className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-arabic-semibold text-sm text-gray-700">التخصص</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <TextInput
                  value={formData.specialization}
                  onChangeText={(value) => handleChange('specialization', value)}
                  placeholder="مثال: تطوير الذات، البرمجة، التسويق"
                  className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-arabic-semibold text-sm text-gray-700">مجال التدريب</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <Picker
                  options={[
                    { label: 'اختر المجال', value: '' },
                    ...(categoriesData?.categories?.map((category) => ({
                      label: category.nameAr,
                      value: category.id,
                    })) || []),
                  ]}
                  value={formData.categoryId}
                  onValueChange={(value) => handleChange('categoryId', value)}
                  placeholder="اختر المجال"
                  style={{ backgroundColor: 'white', borderRadius: 10 }}
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-arabic-semibold text-sm text-gray-700">المدينة</Text>
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
                  <Text className="font-arabic-semibold text-sm text-gray-700">نبذة عنك</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <TextInput
                  value={formData.description}
                  onChangeText={(value) => handleChange('description', value)}
                  multiline
                  numberOfLines={4}
                  placeholder="اخبرنا عن نفسك، خبراتك، مؤهلاتك، وأسلوبك في التدريب..."
                  className="font-arabic-regular h-56 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                  textAlignVertical="top"
                />
                <Text className="font-arabic-regular text-xs text-gray-500">
                  اكتب نبذة شاملة عن خبراتك ومؤهلاتك
                </Text>
              </View>
            </View>

            <TouchableOpacity
              onPress={nextStep}
              disabled={!isStep1Valid()}
              className={`flex-row items-center justify-center gap-2 rounded-lg py-3 ${
                isStep1Valid() ? 'bg-[#CAA453]' : 'bg-gray-300'
              }`}>
              <Text className="font-arabic-bold text-base text-white">التالي</Text>
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
                <Text className="font-arabic-bold text-base text-gray-800">معلومات التواصل</Text>
              </View>
              <Text className="font-arabic-regular text-sm text-gray-600">
                وسائل التواصل التي سيظهر للعملاء
              </Text>
            </View>

            <View className="mb-2 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <View className="flex-row items-start gap-2">
                <Ionicons name="information-circle-outline" size={20} color="#1D4ED8" />
                <Text className="font-arabic-regular flex-1 text-sm text-blue-800">
                  <Text className="font-arabic-bold">ملاحظة:</Text> يرجى تقديم وسائل التواصل التي
                  تريد أن يراها العملاء على صفحتك
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-arabic-semibold text-sm text-gray-700">رقم الجوال</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <PhoneInputField
                  value={formData.phone}
                  onChangeText={(value) => handleChange('phone', value)}
                  placeholder="أدخل رقم الهاتف"
                />
              </View>

              <View className="gap-2">
                <Text className="font-arabic-semibold text-sm text-gray-700">
                  رقم الواتساب (إختياري)
                </Text>
                <PhoneInputField
                  value={formData.whatsapp}
                  onChangeText={(value) => handleChange('whatsapp', value)}
                  placeholder="05XXXXXXXX"
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-arabic-semibold text-sm text-gray-700">
                    البريد الإلكتروني
                  </Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <TextInput
                  value={formData.email}
                  onChangeText={(value) => handleChange('email', value)}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
              </View>

              <View className="gap-2">
                <Text className="font-arabic-semibold text-sm text-gray-700">
                  الموقع الإلكتروني (إختياري)
                </Text>
                <TextInput
                  value={formData.website}
                  onChangeText={(value) => handleChange('website', value)}
                  placeholder="https://example.com"
                  className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-arabic-semibold text-sm text-gray-700" numberOfLines={1}>
                    كلمة المرور
                  </Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <TextInput
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry
                  placeholder="أدخل كلمة المرور"
                  className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-arabic-semibold text-sm text-gray-700" numberOfLines={1}>
                    تأكيد كلمة المرور
                  </Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <TextInput
                  value={formData.confpassword}
                  onChangeText={(value) => handleChange('confpassword', value)}
                  secureTextEntry
                  placeholder="أعد إدخال كلمة المرور"
                  className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
                {formData.password !== formData.confpassword && (
                  <View className="flex-row items-center gap-1">
                    <Ionicons name="alert-circle-outline" size={16} color="#DC2626" />
                    <Text className="font-arabic-regular text-sm text-red-600">
                      كلمة المرور وتأكيد كلمة المرور غير متطابقتان
                    </Text>
                  </View>
                )}
              </View>

              <View className="gap-2">
                <Text className="font-arabic-semibold text-sm text-gray-700">
                  حساب إنستجرام (إختياري)
                </Text>
                <TextInput
                  value={formData.instagram}
                  onChangeText={(value) => handleChange('instagram', value)}
                  placeholder="@username"
                  className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                  placeholderTextColor="#9CA3AF"
                  textAlign="right"
                />
              </View>

              {/* Courses Section */}
              <View className="gap-3">
                <View className="flex-row items-center justify-between">
                  <View className="gap-1">
                    <Text className="font-arabic-semibold text-sm text-gray-700">
                      الدورات والخدمات
                    </Text>
                    <Text className="font-arabic-regular text-xs text-gray-500">إختياري</Text>
                  </View>
                  <TouchableOpacity
                    onPress={addCourse}
                    className="flex-row items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2">
                    <Ionicons name="add-circle-outline" size={16} color="white" />
                    <Text className="font-arabic-semibold text-sm text-white">إضافة دورة</Text>
                  </TouchableOpacity>
                </View>

                {formData.courses.map((course, index) => (
                  <View
                    key={index}
                    className="gap-4 rounded-xl border border-gray-200 bg-white p-4">
                    <View className="flex-row items-center justify-between">
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="school-outline" size={18} color="#374151" />
                        <Text className="font-arabic-semibold text-sm text-gray-700">
                          الدورة {index + 1}
                        </Text>
                      </View>
                      {formData.courses.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeCourse(index)}
                          className="flex-row items-center gap-1 rounded-lg bg-red-100 px-3 py-1.5">
                          <Ionicons name="trash-outline" size={14} color="#DC2626" />
                          <Text className="font-arabic-semibold text-sm text-red-600">حذف</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View className="gap-4">
                      <View className="gap-3">
                        <View className="gap-2">
                          <Text className="font-arabic-regular text-xs text-gray-600">
                            اسم الدورة
                          </Text>
                          <TextInput
                            value={course.name}
                            onChangeText={(value) => handleCourseChange(index, 'name', value)}
                            placeholder="اسم الدورة"
                            className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                            textAlign="right"
                          />
                        </View>

                        <View className="flex-row gap-3">
                          <View className="flex-1 gap-1">
                            <Text className="font-arabic-regular text-xs text-gray-600">
                              المدة (أشهر)
                            </Text>
                            <TextInput
                              value={course.duration}
                              onChangeText={(value) => handleCourseChange(index, 'duration', value)}
                              placeholder="3"
                              keyboardType="numeric"
                              className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                              textAlign="right"
                            />
                          </View>
                          <View className="flex-1 gap-1">
                            <Text className="font-arabic-regular text-xs text-gray-600">
                              عدد الجلسات
                            </Text>
                            <TextInput
                              value={course.sessions}
                              onChangeText={(value) => handleCourseChange(index, 'sessions', value)}
                              placeholder="8"
                              keyboardType="numeric"
                              className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                              textAlign="right"
                            />
                          </View>
                        </View>

                        <View className="flex-row gap-3">
                          <View className="flex-1 gap-1">
                            <Text className="font-arabic-regular text-xs text-gray-600">
                              السعر (دينار كويتي)
                            </Text>
                            <TextInput
                              value={course.price}
                              onChangeText={(value) => handleCourseChange(index, 'price', value)}
                              placeholder="1000"
                              keyboardType="numeric"
                              className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                              textAlign="right"
                            />
                          </View>
                          <View className="flex-1 gap-1">
                            <Text className="font-arabic-regular text-xs text-gray-600">
                              المستوى
                            </Text>
                            <Picker
                              options={levelOptions}
                              value={course.level}
                              onValueChange={(value) => handleCourseChange(index, 'level', value)}
                              placeholder="اختر المستوى"
                              style={{ backgroundColor: 'white', borderRadius: 10 }}
                            />
                          </View>
                        </View>

                        <View className="gap-1">
                          <Text className="font-arabic-regular text-xs text-gray-600">الوصف</Text>
                          <TextInput
                            value={course.description}
                            onChangeText={(value) =>
                              handleCourseChange(index, 'description', value)
                            }
                            placeholder="وصف الدورة والمحتوى"
                            multiline
                            numberOfLines={3}
                            className="font-arabic-regular h-32 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                            textAlign="right"
                            textAlignVertical="top"
                          />
                        </View>

                        <View className="gap-2">
                          <View className="flex-row items-center justify-between">
                            <Text className="font-arabic-regular text-xs text-gray-600">
                              ما يشمل البرنامج
                            </Text>
                            <TouchableOpacity
                              onPress={() => addIncludeItem(index)}
                              className="flex-row items-center gap-1 rounded-lg bg-blue-100 px-3 py-1.5">
                              <Ionicons name="add-circle-outline" size={14} color="#2563EB" />
                              <Text className="font-arabic-semibold text-xs text-blue-600">
                                إضافة عنصر
                              </Text>
                            </TouchableOpacity>
                          </View>
                          <View className="gap-2">
                            {course.includes.map((include, includeIndex) => (
                              <View key={includeIndex} className="flex-row gap-2">
                                <TextInput
                                  value={include}
                                  onChangeText={(value) =>
                                    handleIncludeChange(index, includeIndex, value)
                                  }
                                  placeholder="مثال: التقييم الشخصي، متابعة التقدم..."
                                  className="font-arabic-regular flex-1 rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
                                  textAlign="right"
                                />
                                <TouchableOpacity
                                  onPress={() => removeIncludeItem(index, includeIndex)}
                                  className="flex-row items-center gap-1 rounded-lg bg-red-100 px-3 py-2">
                                  <Ionicons name="trash-outline" size={14} color="#DC2626" />
                                  <Text className="font-arabic-semibold text-red-600">حذف</Text>
                                </TouchableOpacity>
                              </View>
                            ))}
                            {course.includes.length === 0 && (
                              <View className="items-center py-3">
                                <Ionicons name="list-outline" size={24} color="#9CA3AF" />
                                <Text className="font-arabic-regular mt-1 text-xs text-gray-500">
                                  لا توجد عناصر مضافة
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            </View>

            <View className="flex-row gap-3">
              <TouchableOpacity
                onPress={prevStep}
                className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white py-3">
                <Ionicons name="arrow-forward" size={20} color="#374151" />
                <Text className="font-arabic-bold text-sm text-gray-700">السابق</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={nextStep}
                disabled={!isStep2Valid()}
                className={`flex-1 flex-row items-center justify-center gap-2 rounded-lg py-3 ${
                  isStep2Valid() ? 'bg-[#CAA453]' : 'bg-gray-300'
                }`}>
                <Text className="font-arabic-bold text-base text-white">التالي</Text>
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
                <Text className="font-arabic-bold text-base text-gray-800">
                  المستندات والمعلومات الإضافية
                </Text>
              </View>
              <Text className="font-arabic-regular text-sm text-gray-600">
                المستندات المطلوبة للتحقق
              </Text>
            </View>

            <View className="mb-2 rounded-xl border border-amber-200 bg-amber-50 p-4">
              <View className="flex-row items-start gap-2">
                <Ionicons name="information-circle-outline" size={20} color="#D97706" />
                <Text className="font-arabic-regular flex-1 text-sm text-amber-800">
                  <Text className="font-arabic-bold">ملاحظة:</Text> يرجى تحميل المستند المطلوب حسب
                  نوع النشاط.
                </Text>
              </View>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-arabic-semibold text-sm text-gray-700">نوع المستند</Text>
                  <Text className="text-red-500">*</Text>
                </View>
                <Picker
                  options={[
                    { label: 'اختر نوع المستند', value: '' },
                    ...documentTypes.map((doc) => ({
                      label: doc.label,
                      value: doc.value,
                    })),
                  ]}
                  value={formData.documentType}
                  onValueChange={(value) => handleChange('documentType', value)}
                  placeholder="اختر نوع المستند"
                  style={{ backgroundColor: 'white', borderRadius: 10 }}
                />
              </View>

              <View className="gap-2">
                <View className="flex-row items-center gap-1">
                  <Text className="font-arabic-semibold text-sm text-gray-700">رفع المستند</Text>
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
                <Text className="font-arabic-semibold text-sm text-gray-700">
                  ملاحظات إضافية (إختياري)
                </Text>
                <TextInput
                  value={formData.additionalNotes}
                  onChangeText={(value) => handleChange('additionalNotes', value)}
                  placeholder="أوقات العمل، مميزات إضافية، معلومات أخرى..."
                  multiline
                  numberOfLines={3}
                  className="font-arabic-regular h-56 w-full rounded-lg border border-gray-300 bg-white p-3 text-sm text-gray-900"
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
                    <Text className="font-arabic-regular text-gray-700">
                      أوافق على{' '}
                      <Text
                        className="font-arabic-bold text-[#CAA453]"
                        onPress={(e) => {
                          e.stopPropagation();
                          router.push('/(stacks)/termsAndConditions');
                        }}
                        suppressHighlighting={true}>
                        الشروط والأحكام العامة
                      </Text>{' '}
                      لمنصة بيتنا
                    </Text>
                    <Text className="font-arabic-regular text-sm text-gray-500">
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
                  <Text className="font-arabic-bold text-sm text-gray-700">السابق</Text>
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
                      <Text className="font-arabic-bold text-sm text-white">جاري التسجيل...</Text>
                    </>
                  ) : (
                    <>
                      <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                      <Text className="font-arabic-bold text-base text-white">تقديم الطلب</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>

              <View className="rounded-lg bg-gray-100 p-3">
                <View className="flex-row items-start gap-2">
                  <Ionicons name="time-outline" size={16} color="#6B7280" />
                  <Text className="font-arabic-regular flex-1 text-sm text-gray-600">
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
