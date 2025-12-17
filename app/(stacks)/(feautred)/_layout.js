import { Stack } from 'expo-router';

export default function RegisterLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="merchant"
        options={{
          headerTitle: 'تاجر مميز',
        }}
      />
      <Stack.Screen
        name="trainer"
        options={{
          headerTitle: 'مدرب مميز',
        }}
      />
    </Stack>
  );
}
