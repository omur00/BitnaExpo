import { Stack } from 'expo-router';
import React from 'react';

function DashboardLayout() {
  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: 'NotoKufiArabicMedium',
          fontSize: 16,
        },
      }}>
      <Stack.Screen
        name="edit"
        options={{
          headerShown: false,
          title: 'تعديل البيانات الشخصية',
        }}
      />
    </Stack>
  );
}

export default DashboardLayout;
