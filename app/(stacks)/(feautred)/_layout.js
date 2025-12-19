import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: true,
      }}>
      <Stack.Screen
        name="merchants"
        options={{
          headerTitle: 'التجار والأسر المنتجة',
        }}
      />
      <Stack.Screen
        name="trainers"
        options={{
          headerTitle: 'المدربون',
        }}
      />
    </Stack>
  );
}
