// components/WorkingHours.js
import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import TimePicker from './TimePicker';

const WorkingHours = ({ workHours, onWorkHoursChange }) => {
  const days = [
    { value: 'saturday', label: 'السبت' },
    { value: 'sunday', label: 'الأحد' },
    { value: 'monday', label: 'الإثنين' },
    { value: 'tuesday', label: 'الثلاثاء' },
    { value: 'wednesday', label: 'الأربعاء' },
    { value: 'thursday', label: 'الخميس' },
    { value: 'friday', label: 'الجمعة' },
  ];

  const toggleDay = (dayValue) => {
    const newDays = workHours.days.includes(dayValue)
      ? workHours.days.filter((d) => d !== dayValue)
      : [...workHours.days, dayValue];

    onWorkHoursChange('days', newDays);
  };

  const handleTimeChange = (field, time) => {
    onWorkHoursChange(field, time);
  };

  return (
    <View className="mb-6">
      <Text className="mb-4 text-sm font-semibold uppercase tracking-wide text-amber-600">
        أوقات العمل
      </Text>

      {/* Time Selection */}
      <View className="mb-6">
        <View className="flex-row items-center space-x-4">
          <TimePicker
            label="من"
            value={workHours.from}
            onChange={(time) => handleTimeChange('from', time)}
            testID="time-picker-from"
          />

          <View className="w-10 items-center">
            <Text className="font-medium text-gray-600">إلى</Text>
          </View>

          <TimePicker
            label="إلى"
            value={workHours.to}
            onChange={(time) => handleTimeChange('to', time)}
            testID="time-picker-to"
          />
        </View>
      </View>

      {/* Days Selection */}
      <View>
        <Text className="mb-2 text-xs font-medium text-gray-600">أيام العمل</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 4 }}>
          <View className="flex-row">
            {days.map((day) => {
              const isSelected = workHours.days.includes(day.value);
              return (
                <TouchableOpacity
                  key={day.value}
                  className={`mx-1 rounded-lg border px-4 py-2 ${
                    isSelected ? 'border-amber-300 bg-amber-100' : 'border-gray-300 bg-gray-50'
                  }`}
                  onPress={() => toggleDay(day.value)}
                  activeOpacity={0.7}>
                  <Text
                    className={`text-sm ${
                      isSelected ? 'font-semibold text-amber-800' : 'text-gray-700'
                    }`}>
                    {day.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default WorkingHours;
