import { useState } from 'react';
import { GET_MERCHANTS_ADMIN, APPROVE_MERCHANT, REJECT_MERCHANT } from '@/utils/queries';
import Loading from '@/components/Loading';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '@/utils/formatDate';
import { useRouter } from 'expo-router';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNotification } from '@/context/notification-context';
import { useMutation, useQuery } from '@apollo/client/react';

export default function MerchantApprovals() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const { showSuccess } = useNotification();
  const router = useRouter();

  const { data, loading, refetch } = useQuery(GET_MERCHANTS_ADMIN, {
    variables: {
      status: statusFilter === '' ? null : statusFilter,
    },
  });

  const [approveMerchant] = useMutation(APPROVE_MERCHANT, {
    onCompleted: async () => {
      refetch();
      showSuccess('تم قبول الطلب بنجاح!');
    },
  });

  const [rejectMerchant] = useMutation(REJECT_MERCHANT, {
    onCompleted: async () => {
      refetch();
      showSuccess('تم رفض الطلب بنجاح!');
    },
  });

  const handleApprove = (merchantId) => {
    Alert.alert('تأكيد الموافقة', 'هل أنت متأكد من الموافقة على هذا التاجر؟', [
      {
        text: 'إلغاء',
        style: 'cancel',
      },
      {
        text: 'موافقة',
        onPress: () => approveMerchant({ variables: { id: merchantId } }),
      },
    ]);
  };

  const handleReject = (merchantId) => {
    Alert.alert('تأكيد الرفض', 'هل أنت متأكد من رفض هذا التاجر؟', [
      {
        text: 'إلغاء',
        style: 'cancel',
      },
      {
        text: 'رفض',
        onPress: () => rejectMerchant({ variables: { id: merchantId } }),
      },
    ]);
  };

  if (loading) {
    return <Loading />;
  }

  const getStatusBadge = (status) => {
    const statuses = {
      pending: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        label: 'قيد المراجعة',
        icon: 'time-outline',
      },
      approved: {
        bg: 'bg-emerald-50',
        border: 'border-emerald-200',
        text: 'text-emerald-700',
        label: 'مقبول',
        icon: 'checkmark-circle-outline',
      },
      rejected: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        label: 'مرفوض',
        icon: 'close-circle-outline',
      },
    };
    return statuses[status] || statuses.pending;
  };

  const pendingCount = data?.merchants?.pendingCount || 0;
  const approvedCount = data?.merchants?.approvedCount || 0;
  const rejectedCount = data?.merchants?.rejectedCount || 0;
  const totalCount = data?.merchants?.totalCount || 0;
  const merchantsList = data?.merchants?.merchants || [];

  const getFilterText = () => {
    switch (statusFilter) {
      case 'pending':
        return 'قيد المراجعة';
      case 'approved':
        return 'المقبولون';
      case 'rejected':
        return 'المرفوضون';
      default:
        return 'جميع الطلبات';
    }
  };

  return (
    <ScrollView className="flex-1 bg-gray-50" showsVerticalScrollIndicator={false}>
      <View className="px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-sm text-gray-600">
            مراجعة وموافقة على طلبات التسجيل للتجار والأسر المنتجة
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="mb-6">
          <View className="flex-row flex-wrap gap-3">
            {/* Total */}
            <View className="min-w-[48%] flex-1 rounded-xl border border-gray-200 bg-white p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="mb-1 text-xs text-gray-600">إجمالي الطلبات</Text>
                  <Text className="text-2xl font-bold text-gray-900">{totalCount}</Text>
                </View>
                <Ionicons name="storefront-outline" size={24} color="#9CA3AF" />
              </View>
            </View>

            {/* Pending */}
            <View className="min-w-[48%] flex-1 rounded-xl border border-gray-200 bg-white p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="mb-1 text-xs text-gray-600">قيد المراجعة</Text>
                  <Text className="text-2xl font-bold text-amber-600">{pendingCount}</Text>
                </View>
                <Ionicons name="time-outline" size={24} color="#F59E0B" />
              </View>
            </View>

            {/* Approved */}
            <View className="min-w-[48%] flex-1 rounded-xl border border-gray-200 bg-white p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="mb-1 text-xs text-gray-600">مقبول</Text>
                  <Text className="text-2xl font-bold text-emerald-600">{approvedCount}</Text>
                </View>
                <Ionicons name="checkmark-circle-outline" size={24} color="#10B981" />
              </View>
            </View>

            {/* Rejected */}
            <View className="min-w-[48%] flex-1 rounded-xl border border-gray-200 bg-white p-4">
              <View className="flex-row items-center justify-between">
                <View>
                  <Text className="mb-1 text-xs text-gray-600">مرفوض</Text>
                  <Text className="text-2xl font-bold text-red-600">{rejectedCount}</Text>
                </View>
                <Ionicons name="close-circle-outline" size={24} color="#EF4444" />
              </View>
            </View>
          </View>
        </View>

        {/* Filters */}
        <View className="mb-6">
          <View className="rounded-xl border border-gray-200 bg-white p-4">
            <View className="gap-4">
              <View className="flex-row items-center gap-2">
                <Ionicons name="filter-outline" size={18} color="#6B7280" />
                <Text className="text-sm font-medium text-gray-700">حالة الطلبات</Text>
              </View>

              <View className="relative">
                <TouchableOpacity
                  onPress={() => setShowFilterDropdown(!showFilterDropdown)}
                  className="flex-row items-center justify-between rounded-lg border border-gray-300 px-3 py-3">
                  <Text className="text-sm text-gray-700">{getFilterText()}</Text>
                  <Ionicons
                    name={showFilterDropdown ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>

                {showFilterDropdown && (
                  <View className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-gray-300 bg-white shadow-lg">
                    <TouchableOpacity
                      onPress={() => {
                        setStatusFilter('pending');
                        setShowFilterDropdown(false);
                      }}
                      className="border-b border-gray-100 px-3 py-3">
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="time-outline" size={16} color="#6B7280" />
                        <Text className="text-sm text-gray-700">قيد المراجعة</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setStatusFilter('approved');
                        setShowFilterDropdown(false);
                      }}
                      className="border-b border-gray-100 px-3 py-3">
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="checkmark-circle-outline" size={16} color="#6B7280" />
                        <Text className="text-sm text-gray-700">المقبولون</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setStatusFilter('rejected');
                        setShowFilterDropdown(false);
                      }}
                      className="border-b border-gray-100 px-3 py-3">
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="close-circle-outline" size={16} color="#6B7280" />
                        <Text className="text-sm text-gray-700">المرفوضون</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => {
                        setStatusFilter('');
                        setShowFilterDropdown(false);
                      }}
                      className="px-3 py-3">
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="list-outline" size={16} color="#6B7280" />
                        <Text className="text-sm text-gray-700">جميع الطلبات</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>
          </View>
        </View>

        {/* Merchants List */}
        <View className="mb-8">
          <View className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {merchantsList.length === 0 ? (
              <View className="items-center gap-3 py-12">
                <Ionicons name="storefront-outline" size={48} color="#D1D5DB" />
                <Text className="text-lg font-semibold text-gray-900">لا توجد طلبات</Text>
                <Text className="px-4 text-center text-sm text-gray-600">
                  لا توجد طلبات تجار تطابق الفلتر المحدد
                </Text>
              </View>
            ) : (
              <View className="divide-y divide-gray-200">
                {merchantsList.map((merchant) => {
                  const statusInfo = getStatusBadge(merchant.status);

                  return (
                    <View key={merchant.id} className="p-4">
                      {/* Header with Business Name and Status */}
                      <View className="mb-3 flex-row items-start justify-between">
                        <TouchableOpacity
                          className="flex-1"
                          onPress={() => router.push(`/admin/users/${merchant.userId}`)}>
                          <View className="flex-row items-center gap-2">
                            <Ionicons name="storefront-outline" size={18} color="#6B7280" />
                            <Text className="flex-1 text-sm font-semibold text-gray-900">
                              {merchant.businessName}
                            </Text>
                          </View>
                        </TouchableOpacity>
                        <View
                          className={`flex-row items-center gap-1 rounded-full border px-3 py-1.5 ${statusInfo.bg} ${statusInfo.border}`}>
                          <Ionicons name={statusInfo.icon} size={14} className={statusInfo.text} />
                          <Text className={`text-xs font-medium ${statusInfo.text}`}>
                            {statusInfo.label}
                          </Text>
                        </View>
                      </View>

                      {/* Compact Info Row */}
                      <View className="mb-3 flex-row items-center gap-4">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="call-outline" size={14} color="#6B7280" />
                          <Text className="text-xs text-gray-600">{merchant.phone}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="location-outline" size={14} color="#6B7280" />
                          <Text className="text-xs text-gray-600">{merchant.category.nameAr}</Text>
                        </View>
                      </View>

                      {/* Date and Actions */}
                      <View className="border-t border-gray-100 pt-3">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                            <Text className="text-xs text-gray-500">
                              {formatDate(merchant.createdAt)}
                            </Text>
                          </View>

                          <View className="flex-row gap-2">
                            <TouchableOpacity
                              onPress={() => router.push(`/(admin)/user/${merchant.userId}`)}
                              className="flex-row items-center gap-1 rounded-lg bg-gray-600 px-3 py-2">
                              <Ionicons name="eye-outline" size={14} color="white" />
                              <Text className="text-xs font-medium text-white">عرض</Text>
                            </TouchableOpacity>

                            {merchant.status === 'pending' && (
                              <>
                                <TouchableOpacity
                                  onPress={() => handleApprove(merchant.id)}
                                  className="flex-row items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2">
                                  <Ionicons
                                    name="checkmark-circle-outline"
                                    size={14}
                                    color="white"
                                  />
                                  <Text className="text-xs font-medium text-white">قبول</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleReject(merchant.id)}
                                  className="flex-row items-center gap-1 rounded-lg bg-red-600 px-3 py-2">
                                  <Ionicons name="close-circle-outline" size={14} color="white" />
                                  <Text className="text-xs font-medium text-white">رفض</Text>
                                </TouchableOpacity>
                              </>
                            )}
                          </View>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
