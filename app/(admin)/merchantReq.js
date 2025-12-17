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
    <ScrollView className="flex-1">
      {/* Header */}
      <View className="mb-2 px-4 py-3">
        <Text className="mt-1 text-xs text-gray-600 sm:text-sm">
          مراجعة وموافقة على طلبات التسجيل للتجار والأسر المنتجة
        </Text>
      </View>

      {/* Stats Cards */}
      <View className="mb-4 px-4">
        <View className="flex-row flex-wrap gap-2">
          {/* Total */}
          <View className="min-w-[48%] flex-1 rounded-lg border border-gray-200 bg-white p-3">
            <View className="flex-row items-center justify-between">
              <View className="items-end">
                <Text className="mb-1 text-xs text-gray-600">إجمالي الطلبات</Text>
                <Text className="text-base font-bold text-gray-900 sm:text-lg">{totalCount}</Text>
              </View>
              <Ionicons name="storefront-outline" size={20} className="text-gray-400" />
            </View>
          </View>

          {/* Pending */}
          <View className="min-w-[48%] flex-1 rounded-lg border border-gray-200 bg-white p-3">
            <View className="flex-row items-center justify-between">
              <View className="items-end">
                <Text className="mb-1 text-xs text-gray-600">قيد المراجعة</Text>
                <Text className="text-base font-bold text-amber-600 sm:text-lg">
                  {pendingCount}
                </Text>
              </View>
              <Ionicons name="time-outline" size={20} className="text-amber-400" />
            </View>
          </View>

          {/* Approved */}
          <View className="min-w-[48%] flex-1 rounded-lg border border-gray-200 bg-white p-3">
            <View className="flex-row items-center justify-between">
              <View className="items-end">
                <Text className="mb-1 text-xs text-gray-600">مقبول</Text>
                <Text className="text-base font-bold text-emerald-600 sm:text-lg">
                  {approvedCount}
                </Text>
              </View>
              <Ionicons name="checkmark-circle-outline" size={20} className="text-emerald-400" />
            </View>
          </View>

          {/* Rejected */}
          <View className="min-w-[48%] flex-1 rounded-lg border border-gray-200 bg-white p-3">
            <View className="flex-row items-center justify-between">
              <View className="items-end">
                <Text className="mb-1 text-xs text-gray-600">مرفوض</Text>
                <Text className="text-base font-bold text-red-600 sm:text-lg">{rejectedCount}</Text>
              </View>
              <Ionicons name="close-circle-outline" size={20} className="text-red-400" />
            </View>
          </View>
        </View>
      </View>

      {/* Filters */}
      <View className="mb-4 px-4">
        <View className="rounded-lg border border-gray-200 bg-white p-4">
          <View className="flex-col space-y-3">
            <View className="flex-row items-center justify-start gap-2">
              <Ionicons name="filter-outline" size={16} className="text-gray-400" />
              <Text className="text-sm font-medium text-gray-700">حالة الطلبات</Text>
            </View>

            <View className="relative">
              <TouchableOpacity
                onPress={() => setShowFilterDropdown(!showFilterDropdown)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700">
                <Text className="text-sm">{getFilterText()}</Text>
              </TouchableOpacity>

              {showFilterDropdown && (
                <View className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-gray-300 bg-white shadow-lg">
                  <TouchableOpacity
                    onPress={() => {
                      setStatusFilter('pending');
                      setShowFilterDropdown(false);
                    }}
                    className="border-b border-gray-100 px-3 py-3">
                    <Text className="text-sm text-gray-700">قيد المراجعة</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setStatusFilter('approved');
                      setShowFilterDropdown(false);
                    }}
                    className="border-b border-gray-100 px-3 py-3">
                    <Text className="text-sm text-gray-700">المقبولون</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setStatusFilter('rejected');
                      setShowFilterDropdown(false);
                    }}
                    className="border-b border-gray-100 px-3 py-3">
                    <Text className="text-sm text-gray-700">المرفوضون</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setStatusFilter('');
                      setShowFilterDropdown(false);
                    }}
                    className="px-3 py-3">
                    <Text className="text-sm text-gray-700">جميع الطلبات</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Merchants List */}
      <View className="mb-8 px-4">
        <View className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {merchantsList.length === 0 ? (
            <View className="items-center py-8">
              <Ionicons name="storefront-outline" size={40} className="mb-3 text-gray-300" />
              <Text className="mb-2 text-lg font-semibold text-gray-900">لا توجد طلبات</Text>
              <Text className="px-4 text-center text-sm text-gray-600">
                لا توجد طلبات تجار تطابق الفلتر المحدد
              </Text>
            </View>
          ) : (
            <View className="divide-y divide-gray-200">
              {merchantsList.map((merchant) => {
                const statusInfo = getStatusBadge(merchant.status);

                return (
                  <View key={merchant.id} className="p-4 hover:bg-gray-50">
                    {/* Header with Business Name and Status */}
                    <View className="mb-3 flex-row items-start justify-between">
                      <TouchableOpacity
                        className="mr-2 flex-1"
                        onPress={() => router.push(`/admin/users/${merchant.userId}`)}>
                        <View className="flex-row items-center justify-end gap-2">
                          <Ionicons
                            name="storefront-outline"
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          <Text className="flex-1 text-sm font-semibold text-gray-900">
                            {merchant.businessName}
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <View
                        className={`flex-row items-center rounded-full px-2 py-1 text-xs ${statusInfo.bg} ${statusInfo.border} border`}>
                        <Ionicons
                          name={statusInfo.icon}
                          size={12}
                          className={`mr-1 ${statusInfo.text}`}
                        />
                        <Text className={`${statusInfo.text} text-xs`}>{statusInfo.label}</Text>
                      </View>
                    </View>

                    {/* Compact Info Row */}
                    <View className="mb-3 flex-row gap-4">
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="call-outline" size={12} className="text-gray-500" />
                        <Text className="text-xs text-gray-600">{merchant.phone}</Text>
                      </View>
                      <View className="flex-row items-center gap-2">
                        <Ionicons name="location-outline" size={12} className="text-gray-500" />
                        <Text className="text-xs text-gray-600">{merchant.category.nameAr}</Text>
                      </View>
                    </View>

                    {/* Date and Actions */}
                    <View className="border-t border-gray-100 pt-3">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="calendar-outline" size={12} className="text-gray-500" />
                          <Text className="text-xs text-gray-500">
                            {formatDate(merchant.createdAt)}
                          </Text>
                        </View>

                        <View className="flex-row gap-2">
                          <TouchableOpacity
                            onPress={() => router.push(`/admin/users/${merchant.userId}`)}
                            className="flex-row items-center rounded bg-gray-600 px-3 py-1.5">
                            <Ionicons name="eye-outline" size={12} className="mr-1 text-white" />
                            <Text className="text-xs text-white">عرض</Text>
                          </TouchableOpacity>

                          {merchant.status === 'pending' && (
                            <>
                              <TouchableOpacity
                                onPress={() => handleApprove(merchant.id)}
                                className="flex-row items-center rounded bg-emerald-600 px-3 py-1.5">
                                <Ionicons
                                  name="checkmark-circle-outline"
                                  size={12}
                                  className="mr-1 text-white"
                                />
                                <Text className="text-xs text-white">قبول</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleReject(merchant.id)}
                                className="flex-row items-center rounded bg-red-600 px-3 py-1.5">
                                <Ionicons
                                  name="close-circle-outline"
                                  size={12}
                                  className="mr-1 text-white"
                                />
                                <Text className="text-xs text-white">رفض</Text>
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
    </ScrollView>
  );
}
