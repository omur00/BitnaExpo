import { Stack } from 'expo-router';
import React from 'react';

function DashboardLayout() {
  return (
    <Stack>
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
