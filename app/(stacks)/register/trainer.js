// app/register/trainer.jsx
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
import { FilePicker } from '@/components/ui/file-picker';
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

  const steps = [
    { number: 1, title: 'المعلومات الشخصية' },
    { number: 2, title: 'معلومات التواصل' },
    { number: 3, title: 'المستندات' },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="container mx-auto max-w-2xl px-4 py-8">
        <View className="rounded-2xl bg-white p-8 shadow-lg">
          {/* Header */}
          <View className="mb-8 text-center">
            <Text className="text-gray-600">املأ البيانات التالية لعرض خدماتك على المنصة</Text>
          </View>

          {error && (
            <View className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4">
              <Text className="text-red-700">{error.message}</Text>
            </View>
          )}

          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <View className="flex flex-col gap-8">
              <View className="mb-4 border-r-4 border-blue-600 pr-3">
                <Text className="text-xl font-bold text-gray-800">المعلومات الشخصية</Text>
              </View>

              <View className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <View>
                  <View className="mb-2 flex-row gap-1">
                    <Text className="font-bold text-gray-700">الإسم الكامل</Text>
                    <Text className="text-[12px] text-gray-700">* إجباري</Text>
                  </View>
                  <TextInput
                    value={formData.fullName}
                    onChangeText={(value) => handleChange('fullName', value)}
                    placeholder="الاسم الكامل"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>

                <View>
                  <View className="mb-2 flex-row gap-1">
                    <Text className="font-bold text-gray-700">التخصص</Text>
                    <Text className="text-[12px] text-gray-700">* إجباري</Text>
                  </View>
                  <TextInput
                    value={formData.specialization}
                    onChangeText={(value) => handleChange('specialization', value)}
                    placeholder="مثال: تطوير الذات، البرمجة، التسويق"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
              </View>

              <View className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <View>
                  <View className="mb-2 flex-row gap-1">
                    <Text className="font-bold text-gray-700">مجال التدريب</Text>
                    <Text className="text-[12px] text-gray-700">* إجباري</Text>
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
                    style={{ borderRadius: 8 }}
                  />
                </View>

                <View>
                  <View className="mb-2 flex-row gap-1">
                    <Text className="font-bold text-gray-700">الدولة</Text>
                    <Text className="text-[12px] text-gray-700">* إجباري</Text>
                  </View>
                  <Picker
                    options={[
                      { label: 'اختر الدولة', value: '' },
                      ...(citiesData?.cities?.map((city) => ({
                        label: city.nameAr,
                        value: city.id,
                      })) || []),
                    ]}
                    value={formData.cityId}
                    onValueChange={(value) => handleChange('cityId', value)}
                    placeholder="اختر المدينة"
                    style={{ borderRadius: 8 }}
                  />
                </View>
              </View>

              <View>
                <View className="mb-2 flex-row gap-1">
                  <Text className="font-bold text-gray-700">نبذة عنك</Text>
                  <Text className="text-[12px] text-gray-700">* إجباري</Text>
                </View>
                <TextInput
                  value={formData.description}
                  onChangeText={(value) => handleChange('description', value)}
                  multiline
                  numberOfLines={4}
                  placeholder="اخبرنا عن نفسك، خبراتك، مؤهلاتك، وأسلوبك في التدريب..."
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500"
                  placeholderTextColor="#9CA3AF"
                  textAlignVertical="top"
                />
                <Text className="mt-1 text-sm text-gray-500">
                  اكتب نبذة شاملة عن خبراتك ومؤهلاتك
                </Text>
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
                <View className="mb-4 border-r-4 border-blue-600 pr-3">
                  <Text className="text-xl font-bold text-gray-800">معلومات التواصل</Text>
                </View>

                <View className="mb-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                  <Text className="text-sm text-blue-800">
                    <Text className="font-bold">ملاحظة:</Text> يرجى تقديم وسائل التواصل التي تريد أن
                    يراها العملاء على صفحتك
                  </Text>
                </View>
              </View>

              <View className="flex flex-col gap-5">
                <View>
                  <View className="mb-2 flex-row gap-1">
                    <Text className="font-bold text-gray-700">رقم الجوال</Text>
                    <Text className="text-[12px] text-gray-700">* إجباري</Text>
                  </View>
                  <PhoneInputField
                    value={formData.phone}
                    onChangeText={(value) => handleChange('phone', value)}
                    placeholder="أدخل رقم الهاتف"
                  />
                </View>

                <View>
                  <View className="mb-2 flex-row gap-1">
                    <Text className="font-bold text-gray-700">رقم الواتساب</Text>
                    <Text className="text-[12px] text-gray-700">(إختياري)</Text>
                  </View>
                  <PhoneInputField
                    value={formData.whatsapp}
                    onChangeText={(value) => handleChange('whatsapp', value)}
                    placeholder="05XXXXXXXX"
                  />
                </View>
              </View>

              <View>
                <View className="mb-2 flex-row gap-1">
                  <Text className="font-bold text-gray-700">البريد الإلكتروني</Text>
                  <Text className="text-[12px] text-gray-700">* إجباري</Text>
                </View>
                <TextInput
                  value={formData.email}
                  onChangeText={(value) => handleChange('email', value)}
                  placeholder="example@email.com"
                  keyboardType="email-address"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View>
                <View className="mb-2 flex-row gap-1">
                  <Text className="font-bold text-gray-700">الموقع الإلكتروني</Text>
                  <Text className="text-[12px] text-gray-700">إختياري</Text>
                </View>
                <TextInput
                  value={formData.website}
                  onChangeText={(value) => handleChange('website', value)}
                  placeholder="https://example.com"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View>
                <View className="mb-2 flex-row gap-1">
                  <Text className="text-gray-700">
                    <Text className="font-bold">كلمة المرور</Text>
                    <Text className="text-[12px]"> * إجباري</Text>
                  </Text>
                </View>
                <TextInput
                  value={formData.password}
                  onChangeText={(value) => handleChange('password', value)}
                  secureTextEntry
                  placeholder="*&%^899"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View>
                <View className="flex">
                  <View className="mb-2 flex-row gap-1">
                    <Text className="text-gray-700">
                      <Text className="font-bold">تاكيد كلمة المرور</Text>
                      <Text className="text-[12px]"> * إجباري</Text>
                    </Text>
                  </View>
                  <TextInput
                    value={formData.confpassword}
                    onChangeText={(value) => handleChange('confpassword', value)}
                    secureTextEntry
                    placeholder="*&%^899"
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500"
                    placeholderTextColor="#9CA3AF"
                  />
                </View>
                {formData.password !== formData.confpassword && (
                  <Text className="text-red-800">
                    * كلمة المرور وتأكيد كلمة المرور غير متطابقتان
                  </Text>
                )}
              </View>

              <View>
                <View className="mb-2 flex-row gap-1">
                  <Text className="font-bold text-gray-700">حساب الإنستقرام</Text>
                  <Text className="text-[12px] text-gray-700">إختياري</Text>
                </View>
                <TextInput
                  value={formData.instagram}
                  onChangeText={(value) => handleChange('instagram', value)}
                  placeholder="@username"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900"
                  placeholderTextColor="#9CA3AF"
                />
              </View>

              <View>
                <View className="mb-2 flex-row items-center justify-between">
                  <View className="flex-row gap-1">
                    <Text className="font-bold text-gray-700">الدورات والخدمات</Text>
                    <Text className="text-[12px] text-gray-700">إختياري</Text>
                  </View>
                  <TouchableOpacity
                    onPress={addCourse}
                    className="rounded-lg bg-green-500 px-3 py-1">
                    <Text className="text-sm text-white">+ إضافة دورة</Text>
                  </TouchableOpacity>
                </View>

                {formData.courses.map((course, index) => (
                  <View
                    key={index}
                    className="mb-4 space-y-4 rounded-lg border border-gray-200 p-4">
                    <View className="flex-row items-center justify-between">
                      <Text className="font-semibold text-gray-700">الدورة {index + 1}</Text>
                      {formData.courses.length > 1 && (
                        <TouchableOpacity
                          onPress={() => removeCourse(index)}
                          className="rounded bg-red-100 px-2 py-1">
                          <Text className="text-sm text-red-600">حذف</Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <View className="gap-4">
                      <View className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <View>
                          <Text className="mb-1 text-xs text-gray-600">اسم الدورة</Text>
                          <TextInput
                            value={course.name}
                            onChangeText={(value) => handleCourseChange(index, 'name', value)}
                            placeholder="اسم الدورة"
                            className="w-full rounded-lg border border-gray-300 p-2 text-black"
                          />
                        </View>
                        <View>
                          <Text className="mb-1 text-xs text-gray-600">المدة</Text>
                          <TextInput
                            value={course.duration}
                            onChangeText={(value) => handleCourseChange(index, 'duration', value)}
                            placeholder="3 أشهر، 40 ساعة..."
                            keyboardType="numeric"
                            className="w-full rounded-lg border border-gray-300 p-2 text-black"
                          />
                        </View>
                        <View>
                          <Text className="mb-1 text-xs text-gray-600">عدد الجلسات</Text>
                          <TextInput
                            value={course.sessions}
                            onChangeText={(value) => handleCourseChange(index, 'sessions', value)}
                            placeholder="8"
                            keyboardType="numeric"
                            className="w-full rounded-lg border border-gray-300 p-2 text-black"
                          />
                        </View>
                        <View>
                          <Text className="mb-1 text-xs text-gray-600">السعر (دينار كويتي)</Text>
                          <TextInput
                            value={course.price}
                            onChangeText={(value) => handleCourseChange(index, 'price', value)}
                            placeholder="1000"
                            keyboardType="numeric"
                            className="w-full rounded-lg border border-gray-300 p-2 text-black"
                          />
                        </View>
                      </View>

                      <View>
                        <Text className="mb-1 text-xs text-gray-600">المستوى</Text>
                        <Picker
                          options={levelOptions}
                          value={course.level}
                          onValueChange={(value) => handleCourseChange(index, 'level', value)}
                          placeholder="اختر المستوى"
                          style={{ borderRadius: 8 }}
                        />
                      </View>

                      <View>
                        <Text className="mb-1 text-xs text-gray-600">الوصف</Text>
                        <TextInput
                          value={course.description}
                          onChangeText={(value) => handleCourseChange(index, 'description', value)}
                          placeholder="وصف الدورة والمحتوى"
                          multiline
                          numberOfLines={2}
                          className="w-full rounded-lg border border-gray-300 p-2 text-black"
                        />
                      </View>

                      <View>
                        <View className="mb-2 flex-row items-center justify-between">
                          <Text className="text-xs text-gray-600">ما يشمل البرنامج</Text>
                          <TouchableOpacity
                            onPress={() => addIncludeItem(index)}
                            className="rounded bg-blue-100 px-2 py-1">
                            <Text className="text-xs text-blue-600">+ إضافة عنصر</Text>
                          </TouchableOpacity>
                        </View>
                        <View className="space-y-2">
                          {course.includes.map((include, includeIndex) => (
                            <View key={includeIndex} className="flex-row gap-2">
                              <TextInput
                                value={include}
                                onChangeText={(value) =>
                                  handleIncludeChange(index, includeIndex, value)
                                }
                                placeholder="مثال: التقييم الشخصي، متابعة التقدم..."
                                className="flex-1 rounded-lg border border-gray-300 p-2 text-black"
                              />
                              <TouchableOpacity
                                onPress={() => removeIncludeItem(index, includeIndex)}
                                className="rounded-lg bg-red-100 px-3 py-2">
                                <Text className="text-red-600">حذف</Text>
                              </TouchableOpacity>
                            </View>
                          ))}
                          {course.includes.length === 0 && (
                            <Text className="py-2 text-center text-xs text-gray-500">
                              لا توجد عناصر مضافة. اضغط على "إضافة عنصر" لإضافة ما يشمل البرنامج.
                            </Text>
                          )}
                        </View>
                      </View>
                    </View>
                  </View>
                ))}
              </View>

              <View className="flex-row justify-between pt-4">
                <TouchableOpacity
                  onPress={prevStep}
                  className="flex-row items-center rounded-lg bg-gray-500 px-4 py-2">
                  <Text className="mr-1 font-bold text-white">السابق</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={nextStep}
                  disabled={!isStep2Valid()}
                  className={`flex-row items-center rounded-lg px-4 py-2 font-bold ${
                    isStep2Valid() ? 'bg-blue-600' : 'bg-gray-300'
                  }`}>
                  <Text className="font-bold text-white">التالي</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Step 3: Documents & Additional Info */}
          {currentStep === 3 && (
            <View className="flex flex-col gap-8">
              <View>
                <View className="mb-4 border-r-4 border-amber-600 pr-3">
                  <Text className="text-xl font-bold text-gray-800">
                    المستندات والمعلومات الإضافية
                  </Text>
                </View>

                <View className="mb-6 rounded-lg border border-amber-200 bg-amber-50 p-4">
                  <Text className="text-sm text-amber-800">
                    <Text className="font-bold">ملاحظة:</Text> يرجى تحميل المستند المطلوب حسب نوع
                    النشاط. المستندات تساعدنا في التحقق من صحة المعلومات وتأكيد هويتك.
                  </Text>
                </View>
              </View>

              <View className="flex flex-col gap-5">
                <View>
                  <View className="mb-2 flex-row gap-1">
                    <Text className="font-bold text-gray-700">نوع المستند</Text>
                    <Text className="text-[12px] text-gray-700">* إجباري</Text>
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
                    style={{ borderRadius: 8 }}
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
                  <View className="mb-2 flex-row gap-1">
                    <Text className="font-bold text-gray-700">ملاحظات إضافية</Text>
                    <Text className="text-[12px] text-gray-700">إختياري</Text>
                  </View>
                  <TextInput
                    value={formData.additionalNotes}
                    onChangeText={(value) => handleChange('additionalNotes', value)}
                    placeholder="أوقات العمل، مميزات إضافية، معلومات أخرى..."
                    multiline
                    numberOfLines={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-500"
                    placeholderTextColor="#9CA3AF"
                    textAlignVertical="top"
                  />
                </View>

                <View className="flex-row items-start">
                  <TouchableOpacity
                    onPress={() => setIsAgreed(!isAgreed)}
                    className="flex-row items-start gap-2">
                    <View
                      className={`mt-1 h-6 w-6 items-center justify-center rounded border ${
                        isAgreed ? 'border-green-600 bg-green-600' : 'border-gray-300 bg-white'
                      }`}>
                      {isAgreed && <Ionicons name="checkmark" size={16} color="white" />}
                    </View>
                    <View className="mr-3 flex-1">
                      <Text className="text-sm text-gray-700">
                        أوافق على
                        <Text className="font-medium text-green-600">الشروط والأحكام العامة</Text>
                        لمنصة بيتنا
                      </Text>
                      <Text className="mt-1 text-sm text-gray-500">
                        بموافقتي، أقر بأني قد قرأت وفهمت جميع الشروط والأحكام المذكورة
                      </Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View className="flex-row justify-between pt-6">
                <TouchableOpacity
                  onPress={prevStep}
                  className="flex-row items-center rounded-lg bg-gray-500 px-4 py-2">
                  <Text className="mr-1 font-bold text-white">السابق</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={handleSubmit}
                  disabled={loading || !isStep3Valid()}
                  className={`flex-row items-center rounded-lg px-4 py-2 font-bold ${
                    loading || !isStep3Valid() ? 'bg-gray-300' : 'bg-amber-600'
                  }`}>
                  {loading ? (
                    <View className="flex-row items-center">
                      <ActivityIndicator size="small" color="white" />
                      <Text className="mr-2 font-bold text-white">جاري التسجيل...</Text>
                    </View>
                  ) : (
                    <Text className="font-bold text-white">تقديم طلب التسجيل</Text>
                  )}
                </TouchableOpacity>
              </View>

              <Text className="mt-4 text-center text-sm text-gray-600">
                بعد تقديم الطلب، سيتم مراجعته من قبل الإدارة وسيتم إشعارك عند الموافقة
              </Text>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
