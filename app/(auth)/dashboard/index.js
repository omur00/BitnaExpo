import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { GET_MY_MERCHANT, GET_MY_TRAINER } from '@/utils/queries';
import Loading from '@/components/Loading';
import { useAuth } from '@/context/auth-context';
import { useQuery } from '@apollo/client/react';
import AccessDenied from '@/components/AccessDenied';
import { Ionicons } from '@expo/vector-icons';
import MerchantProfile from '@/components/MerchantProfile';
import TrainerProfile from '@/components/TrainerProfile';
import UserProfile from '@/components/UserProfile';

const UserDashboard = () => {
  const { user } = useAuth();
  const router = useRouter();

  const { data: merchantData, loading: merchantLoading } = useQuery(GET_MY_MERCHANT, {
    skip: !user || user.role !== 'merchant',
  });

  const { data: trainerData, loading: trainerLoading } = useQuery(GET_MY_TRAINER, {
    skip: !user || user.role !== 'trainer',
  });

  if (!user?.role && (user?.role !== 'trainer' || user?.role !== 'merchant')) {
    return (
      <>
        <AccessDenied
          message="هذه الصفحة مخصصة للتجار والأسر المنتجة والمدربين."
          title="مساحة التجار والمدربين"
        />
      </>
    );
  }

  if (!user) {
    return <Loading />;
  }

  const loading = merchantLoading || trainerLoading;
  const merchant = merchantData?.myMerchant;
  const trainer = trainerData?.myTrainer;

  const getRoleDisplay = (role) => {
    const roles = {
      admin: {
        label: 'مشرف',
        color: 'bg-[#F7F9FA] text-[#1E2053] border-[#CBD0D6]',
        icon: 'UserCircleIcon',
      },
      merchant: {
        label: 'تاجر / أسرة منتجة',
        color: 'bg-[#F7F9FA] text-[#1E2053] border-[#CBD0D6]',
        icon: 'BuildingStorefrontIcon',
      },
      trainer: {
        label: 'مدرب / مقدم خدمة',
        color: 'bg-[#F7F9FA] text-[#1E2053] border-[#CBD0D6]',
        icon: 'AcademicCapIcon',
      },
      user: {
        label: 'مستخدم',
        color: 'bg-[#F7F9FA] text-[#1E2053] border-[#CBD0D6]',
        icon: 'UserIcon',
      },
    };
    return roles[role] || roles.user;
  };

  const roleInfo = getRoleDisplay(user.role);

  return (
    <ScrollView className="flex-1 bg-white">
      {/* Modern Header */}
      <View className="bg-[#1E2053] py-6">
        <View className="container mx-auto max-w-7xl px-4">
          <View className="flex-row items-start justify-between gap-4 sm:flex-row sm:items-center">
            <View>
              <Text className="font-arabic-bold mb-1 text-lg text-white">
                مرحباً بك، {user.fullName}
              </Text>
              <Text className="font-arabic-regular text-sm text-gray-300">
                لوحة تحكم حسابك الشخصي
              </Text>
            </View>
            <View className="flex-row items-center gap-2 rounded-lg border border-white/20 bg-white/10 px-3 py-2">
              <View>
                <Text className="font-arabic-regular text-xs text-gray-300">نوع الحساب</Text>
                <Text className="font-arabic-semibold text-sm text-white">{roleInfo.label}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Main Content */}
      <View className="container mx-auto max-w-7xl px-4 py-6">
        <View className="flex-col gap-6 lg:flex-row">
          {/* Main Content */}
          <View className="space-y-6 lg:flex-1">
            {/* Role Specific Content */}
            {user.role === 'merchant' && <MerchantProfile merchant={merchant} loading={loading} />}
            {user.role === 'trainer' && <TrainerProfile trainer={trainer} loading={loading} />}
            {user.role === 'user' && <UserProfile />}
          </View>

          <View className="w-full space-y-4 lg:w-80">
            {/* User Info Card */}
            <View className="flex-col gap-4 rounded-xl border border-[#E5E7EB] bg-white p-4">
              <View className="flex-row items-center gap-2 border-b border-[#F7F9FA] pb-2">
                <Ionicons name="person-circle-outline" size={16} color="#CAA453" />
                <Text className="font-arabic-semibold text-sm text-[#18344A]">معلومات الحساب</Text>
              </View>
              <View className="gap-4">
                <View className="rounded-lg bg-[#F7F9FA] p-3">
                  <Text className="font-arabic-regular mb-1 text-xs text-[#7A8699]">
                    الاسم الكامل
                  </Text>
                  <Text className="font-arabic-semibold text-sm text-[#18344A]">
                    {user.fullName}
                  </Text>
                </View>
                <View className="rounded-lg bg-[#F7F9FA] p-3">
                  <Text className="font-arabic-regular mb-1 text-xs text-[#7A8699]">
                    البريد الإلكتروني
                  </Text>
                  <Text className="font-arabic-semibold text-sm text-[#18344A]">{user.email}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={() => router.push('/(auth)/dashboard/profile/edit')}
                className="rounded-lg bg-[#1E2053] px-6 py-4">
                <Text className="font-arabic-semibold text-center text-sm text-white">
                  تعديل البيانات الشخصية
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default UserDashboard;
