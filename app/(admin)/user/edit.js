// app/(admin)/user/edit/index.js
import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@apollo/client/react';
import { UPDATE_USER } from '@/utils/queries';
import Loading from '@/components/Loading';

export default function EditUserScreen() {
  const params = useLocalSearchParams();
  const router = useRouter();

  // Parse the user data from params
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    role: '',
    isActive: true,
    isFeatured: false,
  });

  useEffect(() => {
    if (params.user) {
      try {
        const parsedUser = JSON.parse(params.user);
        setUser(parsedUser);
        setFormData({
          fullName: parsedUser.fullName || '',
          email: parsedUser.email || '',
          role: parsedUser.role || '',
          isActive: parsedUser.isActive !== undefined ? parsedUser.isActive : true,
          isFeatured: parsedUser.isFeatured !== undefined ? parsedUser.isFeatured : false,
        });
      } catch (error) {
        console.error('Error parsing user data:', error);
        Alert.alert('خطأ', 'تعذر تحميل بيانات المستخدم');
      }
    }
  }, [params.user]);

  const [updateUser, { loading }] = useMutation(UPDATE_USER, {
    onCompleted: (data) => {
      Alert.alert('نجاح', 'تم تعديل بيانات المستخدم بنجاح!');
      router.back();
    },
    onError: (error) => {
      Alert.alert('خطأ', error.message || 'حدث خطأ أثناء التحديث');
    },
  });

  const handleSubmit = () => {
    if (!user) return;

    updateUser({
      variables: {
        id: user.id,
        input: formData,
      },
    });
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const roleOptions = [
    { value: 'admin', label: 'مشرف', icon: 'shield-checkmark-outline' },
    { value: 'merchant', label: 'تاجر / أسرة منتجة', icon: 'storefront-outline' },
    { value: 'trainer', label: 'مدرب / مقدم خدمة', icon: 'school-outline' },
    { value: 'user', label: 'مستخدم', icon: 'person-outline' },
  ];

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50 p-8">
        <Ionicons name="alert-circle-outline" size={48} color="#6B7280" />
        <Text className="mt-4 text-lg text-gray-900">لم يتم العثور على بيانات المستخدم</Text>
        <TouchableOpacity
          onPress={() => router.back()}
          className="mt-4 flex-row items-center gap-2 rounded-lg bg-gray-900 px-6 py-3">
          <Ionicons name="arrow-back" size={20} color="white" />
          <Text className="font-medium text-white">العودة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Loading />
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <View className="mb-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2">
              <TouchableOpacity onPress={() => router.back()} className="p-1">
                <Ionicons name="arrow-back" size={24} color="#374151" />
              </TouchableOpacity>
              <View className="flex-row items-center gap-2">
                <Ionicons name="person-circle-outline" size={24} color="#374151" />
                <Text className="text-2xl font-bold text-gray-800">تعديل المستخدم</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="person-outline" size={16} color="#6B7280" />
              <Text className="text-sm text-gray-600">ID: {user.id.substring(0, 8)}...</Text>
            </View>
          </View>
        </View>

        {/* User Info Card */}
        <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <View className="mb-3 flex-row items-center gap-3">
            <Ionicons name="person-circle-outline" size={36} color="#9CA3AF" />
            <View>
              <Text className="text-sm font-semibold text-gray-900">{user.fullName}</Text>
              <Text className="text-xs text-gray-500">{user.email}</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-2">
            <View
              className={`flex-row items-center gap-1 rounded-full px-3 py-1 ${
                user.isActive
                  ? 'border border-emerald-200 bg-emerald-50'
                  : 'border border-red-200 bg-red-50'
              }`}>
              <Ionicons
                name={user.isActive ? 'checkmark-circle-outline' : 'close-circle-outline'}
                size={14}
                color={user.isActive ? '#047857' : '#DC2626'}
              />
              <Text
                className={`text-xs font-medium ${
                  user.isActive ? 'text-emerald-700' : 'text-red-700'
                }`}>
                {user.isActive ? 'نشط' : 'معطل'}
              </Text>
            </View>
            {user.isFeatured && (
              <View className="flex-row items-center gap-1 rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1">
                <Ionicons name="star-outline" size={14} color="#92400E" />
                <Text className="text-xs font-medium text-yellow-700">مميز</Text>
              </View>
            )}
          </View>
        </View>

        {/* Form */}
        <View className="gap-6">
          <View className="rounded-xl border border-gray-200 bg-white p-4">
            <View className="mb-4 flex-row items-center gap-2">
              <Ionicons name="create-outline" size={20} color="#374151" />
              <Text className="text-lg font-bold text-gray-800">تعديل البيانات</Text>
            </View>

            <View className="gap-4">
              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700">الاسم الكامل *</Text>
                <TextInput
                  value={formData.fullName}
                  onChangeText={(text) => handleChange('fullName', text)}
                  placeholder="أدخل الاسم الكامل"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                  textAlign="right"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700">البريد الإلكتروني *</Text>
                <TextInput
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  placeholder="أدخل البريد الإلكتروني"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-gray-900"
                  textAlign="right"
                />
              </View>

              <View className="gap-2">
                <Text className="text-sm font-medium text-gray-700">نوع المستخدم *</Text>
                <View className="overflow-hidden rounded-lg border border-gray-300">
                  {roleOptions.map((option) => (
                    <TouchableOpacity
                      key={option.value}
                      onPress={() => handleChange('role', option.value)}
                      className={`flex-row items-center justify-between border-b border-gray-200 px-3 py-3 last:border-b-0 ${
                        formData.role === option.value ? 'bg-gray-50' : 'bg-white'
                      }`}>
                      <View className="flex-row items-center gap-2">
                        <Ionicons
                          name={option.icon}
                          size={18}
                          color={formData.role === option.value ? '#374151' : '#6B7280'}
                        />
                        <Text
                          className={`text-sm ${
                            formData.role === option.value
                              ? 'font-medium text-gray-900'
                              : 'text-gray-700'
                          }`}>
                          {option.label}
                        </Text>
                      </View>
                      {formData.role === option.value && (
                        <Ionicons name="checkmark-circle" size={20} color="#10B981" />
                      )}
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
                <Text className="text-sm font-medium text-gray-700">الحساب مفعل</Text>
                <Switch
                  value={formData.isActive}
                  onValueChange={(value) => handleChange('isActive', value)}
                  trackColor={{ false: '#D1D5DB', true: '#10B981' }}
                  thumbColor={formData.isActive ? '#ffffff' : '#ffffff'}
                />
              </View>

              <View className="flex-row items-center justify-between rounded-lg bg-gray-50 p-3">
                <Text className="text-sm font-medium text-gray-700">الحساب مميز</Text>
                <Switch
                  value={formData.isFeatured}
                  onValueChange={(value) => handleChange('isFeatured', value)}
                  trackColor={{ false: '#D1D5DB', true: '#F59E0B' }}
                  thumbColor={formData.isFeatured ? '#ffffff' : '#ffffff'}
                />
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View className="gap-3">
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={loading}
              className="flex-row items-center justify-center gap-2 rounded-lg bg-emerald-600 py-4">
              {loading ? (
                <>
                  <Ionicons name="refresh" size={20} color="white" />
                  <Text className="font-medium text-white">جاري الحفظ...</Text>
                </>
              ) : (
                <>
                  <Ionicons name="checkmark-circle-outline" size={20} color="white" />
                  <Text className="font-medium text-white">حفظ التغييرات</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.back()}
              disabled={loading}
              className="flex-row items-center justify-center gap-2 rounded-lg bg-gray-500 py-4">
              <Ionicons name="close-circle-outline" size={20} color="white" />
              <Text className="font-medium text-white">إلغاء</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
