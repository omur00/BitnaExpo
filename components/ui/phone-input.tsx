import React from 'react';
import { View, Text } from 'react-native';
import PhoneInput from 'react-native-international-phone-number';

interface CustomPhoneInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
}

export function PhoneInputField({
  value,
  onChangeText,
  placeholder = 'أدخل رقم الهاتف',
  className,
  disabled = false,
  label,
  error,
}: CustomPhoneInputProps) {
  return (
    <View className={`w-full ${className || ''}`}>
      {label && <Text className="mb-2 text-sm font-medium text-gray-700">{label}</Text>}

      <View className={`${error ? 'border-red-500' : ''}`}>
        <PhoneInput
          value={value}
          onChangePhoneNumber={onChangeText}
          placeholder={placeholder}
          disabled={disabled}
          language="ara"
          rtl={true}
          defaultValue={value}
          phoneInputPlaceholderTextColor="#9CA3AF"
        />
      </View>

      {error && <Text className="mt-1 text-right text-sm text-red-500">{error}</Text>}
    </View>
  );
}
