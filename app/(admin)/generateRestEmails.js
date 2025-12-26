import { useState } from 'react';
import {} from '@apollo/client';
import { REQUEST_PASSWORD_RESET } from '@/utils/queries';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation } from '@apollo/client/react';
import * as Clipboard from 'expo-clipboard';

export default function GenerateResetLink() {
  const [email, setEmail] = useState('');
  const [result, setResult] = useState(null);

  const [requestPasswordReset, { loading }] = useMutation(REQUEST_PASSWORD_RESET, {
    onCompleted: (data) => {
      setResult(data.requestPasswordReset);
      if (data.requestPasswordReset.url) {
        setEmail('');
      }
    },
    onError: (error) => {
      setResult({
        success: false,
        message: 'خطأ: ' + error.message,
      });
    },
  });

  const handleSubmit = async () => {
    if (!email) return;

    setResult(null);

    await requestPasswordReset({
      variables: { email: email.toLowerCase().trim() },
    });
  };

  const copyToClipboard = async () => {
    if (result?.url) {
      await Clipboard.setStringAsync(result.url);
      Alert.alert('تم النسخ', 'تم نسخ الرابط إلى الحافظة!');
    }
  };

  return (
    <ScrollView className="flex-1 px-4 py-6">
      <View className="mx-auto w-full max-w-2xl">
        <View className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
          <Text className="font-arabic-semibold mb-2 text-sm text-gray-700">
            البريد الإلكتروني للمستخدم
          </Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="أدخل البريد الإلكتروني للمستخدم"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            className="font-arabic-regular w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900"
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          onPress={handleSubmit}
          disabled={loading || !email}
          className={`rounded-lg px-4 py-3 ${loading || !email ? 'bg-gray-400' : 'bg-blue-600'}`}>
          <Text className="font-arabic-bold text-center text-base text-white">
            {loading ? 'جاري الإنشاء...' : 'إنشاء رابط إعادة التعيين'}
          </Text>
        </TouchableOpacity>

        {result && (
          <View
            className={`mt-4 rounded-lg p-4 ${result.success ? 'border border-blue-200 bg-blue-50' : 'border border-red-200 bg-red-50'}`}>
            <Text
              className={`font-arabic-bold mb-2 text-sm ${result.success ? 'text-blue-800' : 'text-red-800'}`}>
              {result.message}
            </Text>

            {result.url && (
              <View>
                <Text className="font-arabic-bold mb-2 text-sm text-green-700">
                  تم إنشاء رابط إعادة التعيين:
                </Text>
                <View className="mb-3 rounded-lg border border-gray-200 bg-gray-50 p-3">
                  <Text className="font-arabic-regular text-sm text-gray-900" selectable={true}>
                    {result.url}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={copyToClipboard}
                  className="rounded-lg bg-green-600 px-4 py-2">
                  <Text className="font-arabic-bold text-center text-sm text-white">
                    نسخ الرابط إلى الحافظة
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        <View className="mt-6 rounded-lg border border-gray-200 bg-gray-50 p-4">
          <Text className="font-arabic-bold mb-3 text-sm text-gray-800">كيفية العمل:</Text>
          <View className="space-y-2">
            <View className="flex-row items-start">
              <Text className="font-arabic-regular ml-2 text-xs text-gray-900">•</Text>
              <Text className="font-arabic-regular flex-1 text-xs text-gray-600">
                أدخل عنوان البريد الإلكتروني للمستخدم
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="font-arabic-regular ml-2 text-xs text-gray-900">•</Text>
              <Text className="font-arabic-regular flex-1 text-xs text-gray-600">
                إذا كان المستخدم موجوداً، سيتم إنشاء رابط إعادة التعيين وعرضه
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="font-arabic-regular ml-2 text-xs text-gray-900">•</Text>
              <Text className="font-arabic-regular flex-1 text-xs text-gray-600">
                يمكنك نسخ الرابط ومشاركته مع المستخدم
              </Text>
            </View>
            <View className="flex-row items-start">
              <Text className="font-arabic-regular ml-2 text-xs text-gray-900">•</Text>
              <Text className="font-arabic-regular flex-1 text-xs text-gray-600">
                إذا لم يكن المستخدم موجوداً، ستظهر رسالة نجاح ولكن بدون رابط
              </Text>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
