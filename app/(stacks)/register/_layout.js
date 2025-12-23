import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
        headerTitleStyle: {
          fontFamily: 'NotoKufiArabicMedium',
          fontSize: 16,
        },
      }}>
      <Stack.Screen name="index" options={{ title: 'اختر نوع الحساب' }} />
      <Stack.Screen name="merchant" options={{ title: 'تسجيل متجر' }} />
      <Stack.Screen name="trainer" options={{ title: 'تسجيل مدرب' }} />
    </Stack>
  );
}
