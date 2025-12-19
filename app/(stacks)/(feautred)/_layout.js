import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="merchants"
        options={{
          headerTitle: 'تاجر مميز',
        }}
      />
      <Stack.Screen
        name="trainers"
        options={{
          headerTitle: 'مدرب مميز',
        }}
      />
    </Stack>
  );
}
