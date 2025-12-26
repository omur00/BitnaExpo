import { View, Text } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const InfoCard = ({ title, icon, children, className = '' }) => (
  <View className={`rounded-xl border border-[#E5E7EB] bg-white p-4 ${className}`}>
    <View className="mb-3 flex-row items-center gap-2 border-b border-[#F7F9FA] pb-2">
      <Ionicons name="information-circle-outline" size={16} color="#4E6882" />
      {/* Use arabic-bold for Arabic titles */}
      <Text className="font-arabic-bold text-sm text-[#18344A]">{title}</Text>
    </View>
    {children}
  </View>
);

export default InfoCard;
