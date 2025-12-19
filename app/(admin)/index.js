import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GET_ADMIN_STATS, GET_PENDING_APPROVALS } from '@/utils/queries';
import { formatDate } from '@/utils/formatDate';
import { useQuery } from '@apollo/client/react';
import Loading from '@/components/Loading';

export default function AdminDashboard() {
  const router = useRouter();

  const { data: statsData, loading: statsLoading } = useQuery(GET_ADMIN_STATS);
  const { data: approvalsData, loading: approvalsLoading } = useQuery(GET_PENDING_APPROVALS);

  if (statsLoading || approvalsLoading) {
    return <Loading />;
  }

  const stats = {
    pendingMerchants: statsData?.pendingMerchantsCount?.totalCount || 0,
    pendingTrainers: statsData?.pendingTrainersCount?.totalCount || 0,
    totalMerchants: statsData?.totalMerchants?.totalCount || 0,
    totalTrainers: statsData?.totalTrainers?.totalCount || 0,
    totalUsers: statsData?.totalUsers?.totalCount || 0,
  };

  const totalPending = stats.pendingMerchants + stats.pendingTrainers;

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      {/* Header */}
      <View className="px-4 pb-4 pt-6">
        <View className="rounded-xl border border-gray-200 bg-white px-4 py-5">
          <View className="flex-1">
            <Text className="mb-1 text-2xl font-bold text-gray-900">لوحة تحكم المشرف</Text>
            <Text className="text-sm text-gray-600">إدارة المنصة والموافقة على الطلبات</Text>
          </View>
        </View>
      </View>

      <View className="px-4 pb-6">
        {/* Stats Cards */}
        <View className="mb-8">
          <View className="-mx-1 flex-row flex-wrap">
            {/* Pending Merchants */}
            <TouchableOpacity
              className="mb-3 w-1/2 px-1"
              onPress={() => router.push('/(admin)/merchantReq')}>
              <View className="rounded-xl border border-gray-200 bg-white p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="mb-1 text-xs text-gray-600">طلبات التجار المعلقة</Text>
                    <Text className="text-2xl font-bold text-gray-900">
                      {stats.pendingMerchants}
                    </Text>
                  </View>
                  <View className="mr-2 rounded-lg bg-gray-100 p-2">
                    <Ionicons name="storefront-outline" size={20} color="#6B7280" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Pending Trainers */}
            <TouchableOpacity
              className="mb-3 w-1/2 px-1"
              onPress={() => router.push('/(admin)/trainerReq')}>
              <View className="rounded-xl border border-gray-200 bg-white p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="mb-1 text-xs text-gray-600">طلبات المدربين المعلقة</Text>
                    <Text className="text-2xl font-bold text-gray-900">
                      {stats.pendingTrainers}
                    </Text>
                  </View>
                  <View className="mr-2 rounded-lg bg-gray-100 p-2">
                    <Ionicons name="school-outline" size={20} color="#6B7280" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Total Users */}
            <TouchableOpacity
              className="mb-3 w-1/2 px-1"
              onPress={() => router.push('/(admin)/users')}>
              <View className="rounded-xl border border-gray-200 bg-white p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="mb-1 text-xs text-gray-600">إجمالي المستخدمين</Text>
                    <Text className="text-2xl font-bold text-gray-900">{stats.totalUsers}</Text>
                  </View>
                  <View className="mr-2 rounded-lg bg-gray-100 p-2">
                    <Ionicons name="people-outline" size={20} color="#6B7280" />
                  </View>
                </View>
              </View>
            </TouchableOpacity>

            {/* Total Activities */}
            <View className="mb-3 w-1/2 px-1">
              <View className="rounded-xl border border-gray-200 bg-white p-4">
                <View className="flex-row items-start justify-between">
                  <View className="flex-1">
                    <Text className="mb-1 text-xs text-gray-600">الأنشطة النشطة</Text>
                    <Text className="text-2xl font-bold text-gray-900">
                      {stats.totalMerchants + stats.totalTrainers}
                    </Text>
                  </View>
                  <View className="mr-2 rounded-lg bg-gray-100 p-2">
                    <Ionicons name="bar-chart-outline" size={20} color="#6B7280" />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Main Content */}
        <View className="gap-6">
          {/* Pending Approvals */}
          <View className="rounded-xl border border-gray-200 bg-white">
            <View className="border-b border-gray-100 p-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-lg font-bold text-gray-900">الطلبات المعلقة للموافقة</Text>
                <View className="flex-row items-center gap-1 rounded-full bg-gray-100 px-3 py-1.5">
                  <Ionicons name="time-outline" size={14} color="#374151" />
                  <Text className="text-xs text-gray-700">{totalPending} طلب</Text>
                </View>
              </View>
            </View>

            <View className="gap-3 p-4">
              {/* Pending Merchants */}
              {approvalsData?.pendingMerchants?.slice(0, 3).map((merchant) => (
                <View key={merchant.id} className="rounded-lg border border-gray-200 p-4">
                  <View className="mb-3 flex-row items-start">
                    <Ionicons
                      name="storefront-outline"
                      size={18}
                      color="#9CA3AF"
                      style={{ marginTop: 2 }}
                    />
                    <View className="mr-3 flex-1">
                      <Text
                        onPress={() => router.push(`/(admin)/user/${merchant.userId}`)}
                        className="mb-1 text-sm font-semibold text-gray-900">
                        {merchant.businessName}
                      </Text>
                      <View className="mb-1 flex-row items-center">
                        <Ionicons name="location-outline" size={12} color="#6B7280" />
                        <Text className="mr-1 text-xs text-gray-600">
                          {merchant.category?.nameAr} - {merchant.city?.nameAr}
                        </Text>
                      </View>
                      <View className="flex-row items-center">
                        <Ionicons name="calendar-outline" size={12} color="#6B7280" />
                        <Text className="mr-1 text-xs text-gray-500">
                          {formatDate(merchant.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push(`/(admin)/user/${merchant.userId}`)}
                    className="flex-row items-center justify-center gap-1 rounded-lg bg-gray-900 py-2.5">
                    <Ionicons name="eye-outline" size={14} color="white" />
                    <Text className="text-xs font-medium text-white">مراجعة</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {/* Pending Trainers */}
              {approvalsData?.pendingTrainers?.slice(0, 3).map((trainer) => (
                <View key={trainer.id} className="rounded-lg border border-gray-200 p-4">
                  <View className="mb-3 flex-row gap-1">
                    <Ionicons
                      name="school-outline"
                      size={18}
                      color="#9CA3AF"
                      style={{ marginTop: 2 }}
                    />
                    <View className="mr-3 flex-1">
                      <Text
                        onPress={() => router.push(`/(admin)/user/${trainer.userId}`)}
                        className="mb-1 text-sm font-semibold text-gray-900">
                        {trainer.fullName}
                      </Text>
                      <Text className="mb-1 text-xs text-gray-600">{trainer.specialization}</Text>
                      <View className="flex-row items-center gap-1">
                        <Ionicons name="calendar-outline" size={12} color="#6B7280" />
                        <Text className="text-xs text-gray-500">
                          {formatDate(trainer.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                  <TouchableOpacity
                    onPress={() => router.push(`/(admin)/user/${trainer.userId}`)}
                    className="flex-row items-center justify-center gap-1 rounded-lg bg-gray-900 py-2.5">
                    <Ionicons name="eye-outline" size={14} color="white" />
                    <Text className="text-xs font-medium text-white">مراجعة</Text>
                  </TouchableOpacity>
                </View>
              ))}

              {approvalsData?.pendingMerchants?.length === 0 &&
                approvalsData?.pendingTrainers?.length === 0 && (
                  <View className="items-center gap-2 py-6">
                    <Ionicons name="time-outline" size={32} color="#D1D5DB" />
                    <Text className="text-sm text-gray-500">لا توجد طلبات معلقة للمراجعة</Text>
                  </View>
                )}

              {(approvalsData?.pendingMerchants?.length > 3 ||
                approvalsData?.pendingTrainers?.length > 3) && (
                <View className="pt-2">
                  <TouchableOpacity
                    onPress={() => router.push('/admin/users')}
                    className="flex-row items-center justify-center py-3">
                    <Text className="text-sm font-medium text-gray-700">
                      عرض جميع الطلبات المعلقة ({totalPending})
                    </Text>
                    <Ionicons name="chevron-forward" size={14} color="#374151" className="mr-1" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>

          {/* Admin Navigation */}
          <View className="rounded-xl border border-gray-200 bg-white">
            <View className="border-b border-gray-100 p-4">
              <View className="flex-row items-center">
                <Ionicons name="cog-outline" size={20} color="#6B7280" className="ml-2" />
                <Text className="text-lg font-bold text-gray-900">الإدارة السريعة</Text>
              </View>
            </View>

            <View className="p-4">
              <View className="-mx-1.5 flex-row flex-wrap">
                <View className="mb-3 w-1/2 px-1.5">
                  <TouchableOpacity
                    onPress={() => router.push('/(admin)/generateRestEmails')}
                    className="items-center rounded-lg border border-gray-200 p-4">
                    <View className="mb-2 rounded-lg bg-gray-100 p-2">
                      <Ionicons name="person-outline" size={22} color="#6B7280" />
                    </View>
                    <Text className="mb-1 text-center text-xs font-semibold text-gray-900">
                      توليد رسائل استرجاع كلمة مرور
                    </Text>
                    <Text className="text-xs text-gray-600">إدارة المستخدمين</Text>
                  </TouchableOpacity>
                </View>

                <View className="mb-3 w-1/2 px-1.5">
                  <TouchableOpacity
                    onPress={() => router.push('/(admin)/merchantReq')}
                    className="items-center rounded-lg border border-gray-200 p-4">
                    <View className="mb-2 rounded-lg bg-gray-100 p-2">
                      <Ionicons name="storefront-outline" size={22} color="#6B7280" />
                    </View>
                    <Text className="mb-1 text-center text-xs font-semibold text-gray-900">
                      إدارة التجار
                    </Text>
                    <Text className="text-xs text-gray-600">{stats.totalMerchants} تاجر</Text>
                  </TouchableOpacity>
                </View>

                <View className="mb-3 w-1/2 px-1.5">
                  <TouchableOpacity
                    onPress={() => router.push('/(admin)/trainerReq')}
                    className="items-center rounded-lg border border-gray-200 p-4">
                    <View className="mb-2 rounded-lg bg-gray-100 p-2">
                      <Ionicons name="school-outline" size={22} color="#6B7280" />
                    </View>
                    <Text className="mb-1 text-center text-xs font-semibold text-gray-900">
                      إدارة المدربين
                    </Text>
                    <Text className="text-xs text-gray-600">{stats.totalTrainers} مدرب</Text>
                  </TouchableOpacity>
                </View>

                <View className="mb-3 w-1/2 px-1.5">
                  <TouchableOpacity
                    onPress={() => router.push('/(admin)/users')}
                    className="items-center rounded-lg border border-gray-200 p-4">
                    <View className="mb-2 rounded-lg bg-gray-100 p-2">
                      <Ionicons name="people-outline" size={22} color="#6B7280" />
                    </View>
                    <Text className="mb-1 text-center text-xs font-semibold text-gray-900">
                      إدارة المستخدمين
                    </Text>
                    <Text className="text-xs text-gray-600">{stats.totalUsers} مستخدم</Text>
                  </TouchableOpacity>
                </View>

                <View className="mb-3 w-1/2 px-1.5">
                  <TouchableOpacity
                    onPress={() => router.push('/(admin)/categories')}
                    className="items-center rounded-lg border border-gray-200 p-4">
                    <View className="mb-2 rounded-lg bg-gray-100 p-2">
                      <Ionicons name="location-outline" size={22} color="#6B7280" />
                    </View>
                    <Text className="mb-1 text-center text-xs font-semibold text-gray-900">
                      الأقسام والمدن
                    </Text>
                    <Text className="text-xs text-gray-600">إدارة المحتوى</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
