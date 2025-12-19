import { useEffect, useState } from 'react';
import { GET_TRAINERS_ADMIN, APPROVE_TRAINER, REJECT_TRAINER } from '@/utils/queries';
import Loading from '@/components/Loading';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { formatDate } from '@/utils/formatDate';
import { View, Text, ScrollView, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQuery } from '@apollo/client/react';
import { useNotification } from '@/context/notification-context';

export default function TrainerApprovals() {
  const [statusFilter, setStatusFilter] = useState('pending');
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const router = useRouter();
  const { showSuccess } = useNotification();

  useEffect(() => {
    const { width } = Dimensions.get('window');
    setIsMobile(width < 768);

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsMobile(window.width < 768);
    });

    return () => subscription?.remove();
  }, []);

  const { data, loading, refetch } = useQuery(GET_TRAINERS_ADMIN, {
    variables: {
      status: statusFilter === '' ? null : statusFilter,
    },
  });

  const [approveTrainer] = useMutation(APPROVE_TRAINER, {
    onCompleted: async () => {
      refetch();
      showSuccess('تم قبول الطلب بنجاح!');
    },
  });

  const [rejectTrainer] = useMutation(REJECT_TRAINER, {
    onCompleted: async () => {
      refetch();
      showSuccess('تم رفض الطلب بنجاح!');
    },
  });

  const handleApprove = (trainerId) => {
    Alert.alert('تأكيد الموافقة', 'هل أنت متأكد من الموافقة على هذا المدرب؟', [
      {
        text: 'إلغاء',
        style: 'cancel',
      },
      {
        text: 'موافقة',
        onPress: () => approveTrainer({ variables: { id: trainerId } }),
      },
    ]);
  };

  const handleReject = (trainerId) => {
    Alert.alert('تأكيد الرفض', 'هل أنت متأكد من رفض هذا المدرب؟', [
      {
        text: 'إلغاء',
        style: 'cancel',
      },
      {
        text: 'رفض',
        onPress: () => rejectTrainer({ variables: { id: trainerId } }),
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

  const pendingCount = data?.trainers?.pendingCount || 0;
  const approvedCount = data?.trainers?.approvedCount || 0;
  const rejectedCount = data?.trainers?.rejectedCount || 0;
  const totalCount = data?.trainers?.totalCount || 0;
  const trainersList = data?.trainers?.trainers || [];

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
            مراجعة وموافقة على طلبات التسجيل للمدربين ومقدمي الخدمات
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
                <Ionicons name="school-outline" size={24} color="#9CA3AF" />
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

        {/* Trainers List */}
        <View className="mb-8">
          <View className="overflow-hidden rounded-xl border border-gray-200 bg-white">
            {trainersList.length === 0 ? (
              <View className="items-center gap-3 py-12">
                <Ionicons name="school-outline" size={48} color="#D1D5DB" />
                <Text className="text-lg font-semibold text-gray-900">لا توجد طلبات</Text>
                <Text className="px-4 text-center text-sm text-gray-600">
                  لا توجد طلبات مدربين تطابق الفلتر المحدد
                </Text>
              </View>
            ) : (
              <View className="divide-y divide-gray-200">
                {trainersList.map((trainer) => {
                  const statusInfo = getStatusBadge(trainer.status);

                  return (
                    <View key={trainer.id} className="p-4">
                      {/* Header with Trainer Name and Status */}
                      <View className="mb-3 flex-row items-start justify-between">
                        <TouchableOpacity
                          className="flex-1"
                          onPress={() => router.push(`/admin/users/${trainer.userId}`)}>
                          <View className="flex-row items-center gap-2">
                            <Ionicons name="person-circle-outline" size={18} color="#6B7280" />
                            <Text className="flex-1 text-sm font-semibold text-gray-900">
                              {trainer.fullName}
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

                      {/* Contact Info */}
                      <View className="mb-3 gap-2">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="call-outline" size={14} color="#6B7280" />
                          <Text className="text-xs text-gray-600">{trainer.phone}</Text>
                        </View>
                        {trainer.email && (
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="mail-outline" size={14} color="#6B7280" />
                            <Text className="text-xs text-gray-600">{trainer.email}</Text>
                          </View>
                        )}
                      </View>

                      {/* Specialization and Location */}
                      <View className="mb-3 gap-2">
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="pricetag-outline" size={14} color="#6B7280" />
                          <Text className="text-xs text-gray-900">{trainer.specialization}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="school-outline" size={14} color="#6B7280" />
                          <Text className="text-xs text-gray-600">{trainer.category.nameAr}</Text>
                        </View>
                        <View className="flex-row items-center gap-1">
                          <Ionicons name="location-outline" size={14} color="#6B7280" />
                          <Text className="text-xs text-gray-500">{trainer.city.nameAr}</Text>
                        </View>
                      </View>

                      {/* Date and Actions */}
                      <View className="border-t border-gray-100 pt-3">
                        <View className="flex-row items-center justify-between">
                          <View className="flex-row items-center gap-1">
                            <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                            <Text className="text-xs text-gray-500">
                              {formatDate(trainer.createdAt)}
                            </Text>
                          </View>

                          <View className="flex-row gap-2">
                            <TouchableOpacity
                              onPress={() => router.push(`/(admin)/user/${trainer.userId}`)}
                              className="flex-row items-center gap-1 rounded-lg bg-gray-600 px-3 py-2">
                              <Ionicons name="eye-outline" size={14} color="white" />
                              <Text className="text-xs font-medium text-white">عرض</Text>
                            </TouchableOpacity>

                            {trainer.status === 'pending' && (
                              <>
                                <TouchableOpacity
                                  onPress={() => handleApprove(trainer.id)}
                                  className="flex-row items-center gap-1 rounded-lg bg-emerald-600 px-3 py-2">
                                  <Ionicons
                                    name="checkmark-circle-outline"
                                    size={14}
                                    color="white"
                                  />
                                  <Text className="text-xs font-medium text-white">قبول</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                  onPress={() => handleReject(trainer.id)}
                                  className="flex-row items-center gap-1 rounded-lg bg-red-600 px-3 py-2">
                                  <Ionicons name="close-circle-outline" size={14} color="white" />
                                  <Text className="text-xs font-medium text-white">رفض</Text>
                                </TouchableOpacity>
                              </>
                            )}
                            {trainer.status !== 'pending' && (
                              <TouchableOpacity className="flex-row items-center gap-1 rounded-lg bg-gray-600 px-3 py-2">
                                <Ionicons name="pencil-outline" size={14} color="white" />
                                <Text className="text-xs font-medium text-white">تعديل</Text>
                              </TouchableOpacity>
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
