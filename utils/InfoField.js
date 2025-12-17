import { View, Text, TouchableOpacity, Linking } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const InfoField = ({ icon, label, value, href, isImage = false }) => (
  <View className="flex-row items-start gap-3 border-b border-[#F7F9FA] py-2 last:border-b-0">
    <Ionicons name="information-circle-outline" size={16} color="#4E6882" />
    <View className="min-w-0 flex-1">
      <Text className="font-inter mb-1 text-xs font-medium text-[#7A8699]">{label}</Text>
      {isImage ? (
        <Image
          source={{ uri: value }}
          className="h-12 w-12 rounded-lg border border-[#CBD0D6]"
          resizeMode="cover"
        />
      ) : href ? (
        <TouchableOpacity onPress={() => Linking.openURL(href)}>
          <Text className="text-sm font-medium text-[#2A4F68]">{value}</Text>
        </TouchableOpacity>
      ) : (
        <Text
          className="text-right text-sm font-medium text-[#18344A]"
          style={{ direction: 'ltr' }}>
          {value || 'غير محدد'}
        </Text>
      )}
    </View>
  </View>
);

export default InfoField;
