import { View, Text } from 'react-native';
import React from 'react';
import { Ionicons } from '@expo/vector-icons';

const StatusBadge = ({ status }) => {
  const statusConfig = {
    approved: {
      label: 'مفعل',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: 'checkmark-circle-outline',
    },
    pending: {
      label: 'قيد المراجعة',
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      icon: 'time-outline',
    },
    rejected: {
      label: 'مرفوض',
      color: 'bg-red-50 text-red-700 border-red-200',
      icon: 'warning-outline',
    },
  };

  const config = statusConfig[status] || statusConfig.pending;

  return (
    <View className={`flex-row items-center gap-1 rounded-full border px-3 py-1 ${config.color}`}>
      <Ionicons name={config.icon} size={12} color="currentColor" />
      <Text className="text-xs font-medium">{config.label}</Text>
    </View>
  );
};

export default StatusBadge;
