import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { UPDATE_PROFILE } from '@/utils/queries';
import { useAuth } from '@/context/auth-context';
import { Ionicons } from '@expo/vector-icons';
import { useNotification } from '@/context/notification-context';
import { useMutation } from '@apollo/client/react';

export default function EditProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useNotification();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [updateProfile] = useMutation(UPDATE_PROFILE, {
    onCompleted: (data) => {
      if (data.updateProfile.success) {
        showSuccess('تم تحديث الملف الشخصي بنجاح');
        logout();
        showSuccess('رجاءاً قم بتسجيل الدخول مرة أخرى');
        router.replace('/login');
      }
    },
    onError: (error) => {
      setErrors({ submit: error.message });
      setIsSubmitting(false);
      showError(error.message);
    },
  });

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'الاسم الكامل مطلوب';
    } else if (formData.fullName.trim().length < 2) {
      newErrors.fullName = 'الاسم يجب أن يكون على الأقل حرفين';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'البريد الإلكتروني مطلوب';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'يرجى إدخال بريد إلكتروني صحيح';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    setErrors({});

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await updateProfile({
        variables: {
          input: {
            fullName: formData.fullName.trim(),
            email: formData.email.trim().toLowerCase(),
          },
        },
      });
    } catch (error) {
      console.error('Update profile error:', error);
      showError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="mb-4 text-sm text-red-800">
          * يجب عليك تسجيل الدخول مرة اخرى بعد تعديل البيانات
        </Text>

        {/* Full Name Field */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-gray-700">الاسم الكامل</Text>
          <TextInput
            value={formData.fullName}
            onChangeText={(value) => handleChange('fullName', value)}
            placeholder="أدخل اسمك الكامل"
            className={`w-full rounded-lg border p-3 ${
              errors.fullName ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
            }`}
          />
          {errors.fullName && <Text className="mt-1 text-sm text-red-600">{errors.fullName}</Text>}
        </View>

        {/* Email Field */}
        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-gray-700">البريد الإلكتروني</Text>
          <TextInput
            value={formData.email}
            onChangeText={(value) => handleChange('email', value)}
            placeholder="أدخل بريدك الإلكتروني"
            keyboardType="email-address"
            autoCapitalize="none"
            className={`w-full rounded-lg border p-3 ${
              errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white'
            }`}
          />
          {errors.email && <Text className="mt-1 text-sm text-red-600">{errors.email}</Text>}
        </View>

        {/* Submit Error */}
        {errors.submit && (
          <View className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4">
            <Text className="text-sm text-red-600">{errors.submit}</Text>
          </View>
        )}

        {/* Buttons */}
        <View className="flex-row gap-3 border-t border-gray-200 pt-4">
          <TouchableOpacity
            onPress={handleBack}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-gray-200 px-4 py-3">
            <Text className="text-center font-semibold text-gray-700">إلغاء</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={isSubmitting}
            className="flex-1 rounded-lg bg-blue-950 px-4 py-3">
            {isSubmitting ? (
              <View className="flex-row items-center justify-center">
                <View className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <Text className="font-semibold text-white">جاري التحديث...</Text>
              </View>
            ) : (
              <Text className="text-center font-semibold text-white">تحديث</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
