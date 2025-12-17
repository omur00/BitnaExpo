import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { REQUEST_PASSWORD_RESET } from '@/utils/queries';
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useMutation } from '@apollo/client/react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [requestPasswordReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: (data) => {
      if (data.requestPasswordReset.success) {
        setIsSubmitted(true);
        setMessage('');
      }
    },
    onError: (error) => {
      setMessage(error.message || 'حدث خطأ أثناء إرسال طلب إعادة تعيين كلمة المرور.');
    },
  });

  const handleSubmit = async () => {
    setMessage('');

    if (!email) {
      setMessage('يرجى إدخال البريد الإلكتروني.');
      return;
    }

    try {
      await requestPasswordReset({
        variables: { email: email.trim().toLowerCase() },
      });
    } catch (error) {
      // Error is handled in onError callback
    }
  };

  if (isSubmitted) {
    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 bg-gray-50">
        <ScrollView contentContainerClassName="flex-grow justify-center px-4 py-12">
          <View className="mx-auto w-full max-w-md items-center rounded-lg bg-white p-8 shadow-md">
            <View className="mb-4 h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <Ionicons name="checkmark-circle" size={24} color="#16a34a" />
            </View>
            <Text className="mt-4 text-center text-2xl font-bold text-gray-900">
              تم إرسال رابط التعيين
            </Text>
            <Text className="mt-4 text-center leading-6 text-gray-600">
              إذا كان البريد الإلكتروني <Text className="font-semibold">{email}</Text> مرتبطاً
              بحساب، فسيتم إرسال رابط لإعادة تعيين كلمة المرور إليه.
            </Text>
            <View className="mt-6 w-full">
              <View className="mb-4 rounded-md border border-yellow-200 bg-yellow-50 p-3">
                <Text className="text-center text-sm text-yellow-800">
                  ⚠️ يرجى التحقق من مجلد البريد العشوائي (Spam) إذا لم تجد البريد في صندوق الوارد.
                </Text>
              </View>
              <Link href="/login" asChild>
                <TouchableOpacity className="w-full items-center justify-center rounded-md bg-blue-600 px-4 py-3">
                  <Text className="text-sm font-medium text-white">العودة إلى تسجيل الدخول</Text>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-gray-50">
      <ScrollView
        contentContainerClassName="flex-grow justify-center px-4 py-12"
        keyboardShouldPersistTaps="handled">
        <View className="mx-auto w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <View>
            <Text className="text-3xl font-bold text-gray-900">نسيت كلمة المرور؟</Text>
            <Text className="mt-2 leading-6 text-gray-600">
              أدخل بريدك الإلكتروني وسنرسل لك رابطاً لإعادة تعيين كلمة المرور.
            </Text>
          </View>

          <View className="mt-8">
            <Text className="mb-1 text-sm font-medium text-gray-700">البريد الإلكتروني</Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="example@email.com"
              placeholderTextColor="#9ca3af"
              autoComplete="email"
              keyboardType="email-address"
              textAlign="right"
              className="w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-400"
            />
          </View>

          {message ? (
            <View className="mt-4 rounded-md border border-red-200 bg-red-50 p-3">
              <Text className="text-red-700 ">{message}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            onPress={handleSubmit}
            disabled={loading}
            className={`mt-6 w-full items-center justify-center rounded-md px-4 py-3 ${loading ? 'bg-gray-400' : 'bg-gray-600'}`}>
            <Text className="text-sm font-medium text-white">
              {loading ? 'جاري الإرسال...' : 'إرسال رابط التعيين'}
            </Text>
          </TouchableOpacity>

          <View className="mt-6 items-center">
            <Link href="/login" asChild>
              <TouchableOpacity>
                <Text className="text-sm font-medium text-gray-600">العودة إلى تسجيل الدخول</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
