import { Stack } from 'expo-router';
import React from 'react';

function EditLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name="merchantForm"
        options={{
          title: 'تحديث بيانات المتجر',
          headerBackTitle: 'رجوع',
        }}
      />

      <Stack.Screen
        name="trainerForm"
        options={{
          title: 'تحديث بيانات المدرب',
          headerBackTitle: 'رجوع',
        }}
      />
    </Stack>
  );
}

export default EditLayout;
