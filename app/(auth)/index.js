import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { LOGIN_USER } from '@/utils/queries';
import { useAuth } from '@/context/auth-context';
import { hasAnyPermission, PERMISSION_GROUPS } from '@/utils/permissions';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@apollo/client/react';

export default function LoginScreen() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: 'omur0070@gmail.com',
    password: '123123123',
  });
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const [loginUser] = useMutation(LOGIN_USER, {
    onCompleted: (data) => {
      setLoading(false);
      if (data?.loginUser?.user) {
        login(data.loginUser.user);

        // Check permissions and redirect
        if (
          data.loginUser.user.role === 'admin' ||
          hasAnyPermission(data.loginUser.user, PERMISSION_GROUPS.ALL)
        ) {
          router.push('/(admin)');
        } else {
          router.push('/(auth)/dashboard');
        }
      }
    },
    onError: (error) => {
      setLoading(false);
      Alert.alert('خطأ', error.message || 'حدث خطأ أثناء تسجيل الدخول');
    },
  });

  const handleSubmit = async () => {
    if (!formData.email || !formData.password) {
      Alert.alert('خطأ', 'الرجاء إدخال البريد الإلكتروني وكلمة المرور');
      return;
    }

    setLoading(true);
    try {
      await loginUser({
        variables: {
          input: formData,
        },
      });
    } catch (err) {
      setLoading(false);
      console.error('Login error:', err);
    }
  };

  const handleChange = (field, value) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-white"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
        className="p-5"
        keyboardShouldPersistTaps="handled">
        <View className="rounded-xl border border-gray-200 bg-white p-5 shadow-lg">
          {/* Header */}
          <View className="mb-6 items-center">
            <Text className="font-arabic-bold mb-2 text-2xl text-[#1E2053]">تسجيل الدخول</Text>
            <Text className="font-arabic-regular text-base text-gray-600">ادخل إلى حسابك</Text>
          </View>

          {/* Form */}
          <View className="gap-4">
            {/* Email Input */}
            <View className="gap-2">
              <Text className="font-arabic-semibold text-sm text-gray-800">
                البريد الإلكتروني *
              </Text>
              <View className="flex-row-reverse items-center rounded-lg border border-gray-300 bg-white">
                <Ionicons name="mail-outline" size={20} color="#4E6882" className="mx-3" />
                <TextInput
                  className="font-arabic-regular flex-1 px-4 py-3 text-sm text-gray-800"
                  placeholder="example@email.com"
                  placeholderTextColor="#9CA3AF"
                  value={formData.email}
                  onChangeText={(text) => handleChange('email', text)}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            </View>

            {/* Password Input */}
            <View className="gap-2">
              <Text className="font-arabic-semibold text-sm text-gray-800">كلمة المرور *</Text>
              <View className="flex-row-reverse items-center rounded-lg border border-gray-300 bg-white">
                <Ionicons name="lock-closed-outline" size={20} color="#4E6882" className="mx-3" />
                <TextInput
                  className="font-arabic-regular flex-1 px-4 py-3 text-sm text-gray-800"
                  placeholder="أدخل كلمة المرور"
                  placeholderTextColor="#9CA3AF"
                  value={formData.password}
                  onChangeText={(text) => handleChange('password', text)}
                  secureTextEntry
                />
              </View>
            </View>

            {/* Login Button */}
            <TouchableOpacity
              className={`mt-2 rounded-lg py-4 ${loading ? 'bg-gray-400' : 'bg-[#1E2053]'}`}
              onPress={handleSubmit}
              disabled={loading}>
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text className="font-arabic-semibold text-center text-base text-white">
                  تسجيل الدخول
                </Text>
              )}
            </TouchableOpacity>

            {/* Links */}
            <View className="mt-4 items-center gap-3">
              <TouchableOpacity onPress={() => router.push('/(stacks)/register')} className="py-1">
                <Text className="font-arabic-regular text-center text-sm text-gray-600">
                  <Text>لا تملك حساب؟ </Text>
                  <Text className="font-arabic-semibold text-[#1E2053]">أنشئ حساب جديد</Text>
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => router.push('/(auth)/forgotPassword')}
                className="py-1">
                <Text className="font-arabic-regular text-center text-sm text-gray-600">
                  نسيت كلمة المرور؟
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
