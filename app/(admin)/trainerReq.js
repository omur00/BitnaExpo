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
    <ScrollView className="flex-1">
      {/* Header */}

      <View className="mb-2 px-4 py-3">
        <Text className="mt-1 text-xs text-gray-600 sm:text-sm">
          مراجعة وموافقة على طلبات التسجيل للمدربين ومقدمي الخدمات
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
              <Ionicons name="school-outline" size={20} className="text-gray-400" />
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
              <Text className="text-right text-sm font-medium text-gray-700">حالة الطلبات</Text>
            </View>

            <View className="relative">
              <TouchableOpacity
                onPress={() => setShowFilterDropdown(!showFilterDropdown)}
                className="rounded-lg border border-gray-300 px-3 py-2 text-gray-700">
                <Text className="text-right text-sm">{getFilterText()}</Text>
              </TouchableOpacity>

              {showFilterDropdown && (
                <View className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-gray-300 bg-white shadow-lg">
                  <TouchableOpacity
                    onPress={() => {
                      setStatusFilter('pending');
                      setShowFilterDropdown(false);
                    }}
                    className="border-b border-gray-100 px-3 py-3">
                    <Text className="text-right text-sm text-gray-700">قيد المراجعة</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setStatusFilter('approved');
                      setShowFilterDropdown(false);
                    }}
                    className="border-b border-gray-100 px-3 py-3">
                    <Text className="text-right text-sm text-gray-700">المقبولون</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setStatusFilter('rejected');
                      setShowFilterDropdown(false);
                    }}
                    className="border-b border-gray-100 px-3 py-3">
                    <Text className="text-right text-sm text-gray-700">المرفوضون</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      setStatusFilter('');
                      setShowFilterDropdown(false);
                    }}
                    className="px-3 py-3">
                    <Text className="text-right text-sm text-gray-700">جميع الطلبات</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
        </View>
      </View>

      {/* Trainers List */}
      <View className="mb-8 px-4">
        <View className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          {trainersList.length === 0 ? (
            <View className="items-center py-8">
              <Ionicons name="school-outline" size={40} className="mb-3 text-gray-300" />
              <Text className="mb-2 text-lg font-semibold text-gray-900">لا توجد طلبات</Text>
              <Text className="px-4 text-center text-sm text-gray-600">
                لا توجد طلبات مدربين تطابق الفلتر المحدد
              </Text>
            </View>
          ) : (
            <View className="divide-y divide-gray-200">
              {trainersList.map((trainer) => {
                const statusInfo = getStatusBadge(trainer.status);

                return (
                  <View key={trainer.id} className="p-4 hover:bg-gray-50">
                    {/* Header with Trainer Name and Status */}
                    <View className="mb-3 flex-row items-start justify-between">
                      <TouchableOpacity
                        className="mr-2 flex-1"
                        onPress={() => router.push(`/admin/users/${trainer.userId}`)}>
                        <View className="flex-row items-center justify-end gap-2">
                          <Ionicons
                            name="person-circle-outline"
                            size={16}
                            className="shrink-0 text-gray-400"
                          />
                          <Text className="flex-1 text-right text-sm font-semibold text-gray-900">
                            {trainer.fullName}
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

                    {/* Contact Info */}
                    <View className="mb-3 space-y-1">
                      <View className="flex-row items-center justify-start">
                        <Ionicons name="call-outline" size={12} className="mr-1 text-gray-500" />
                        <Text className="text-xs text-gray-600">{trainer.phone}</Text>
                      </View>
                      {trainer.email && (
                        <View className="flex-row items-center justify-start">
                          <Ionicons name="mail-outline" size={12} className="mr-1 text-gray-500" />
                          <Text className="text-xs text-gray-600">{trainer.email}</Text>
                        </View>
                      )}
                    </View>

                    {/* Specialization and Location */}
                    <View className="mb-3 space-y-1">
                      <View className="flex-row items-center justify-start">
                        <Ionicons
                          name="pricetag-outline"
                          size={12}
                          className="mr-1 text-gray-400"
                        />
                        <Text className="text-xs text-gray-900">{trainer.specialization}</Text>
                      </View>
                      <View className="flex-row items-center justify-start">
                        <Ionicons name="school-outline" size={12} className="mr-1 text-gray-400" />
                        <Text className="text-xs text-gray-600">{trainer.category.nameAr}</Text>
                      </View>
                      <View className="flex-row items-center justify-start">
                        <Ionicons
                          name="location-outline"
                          size={12}
                          className="mr-1 text-gray-500"
                        />
                        <Text className="text-xs text-gray-500">{trainer.city.nameAr}</Text>
                      </View>
                    </View>

                    {/* Date and Actions */}
                    <View className="border-t border-gray-100 pt-3">
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center gap-2">
                          <Ionicons name="calendar-outline" size={12} className="text-gray-500" />
                          <Text className="text-xs text-gray-500">
                            {formatDate(trainer.createdAt)}
                          </Text>
                        </View>

                        <View className="flex-row gap-2">
                          <TouchableOpacity
                            onPress={() => router.push(`/admin/users/${trainer.userId}`)}
                            className="flex-row items-center rounded bg-gray-600 px-3 py-1.5">
                            <Ionicons name="eye-outline" size={12} className="mr-1 text-white" />
                            <Text className="text-xs text-white">عرض</Text>
                          </TouchableOpacity>

                          {trainer.status === 'pending' && (
                            <>
                              <TouchableOpacity
                                onPress={() => handleApprove(trainer.id)}
                                className="flex-row items-center rounded bg-emerald-600 px-3 py-1.5">
                                <Ionicons
                                  name="checkmark-circle-outline"
                                  size={12}
                                  className="mr-1 text-white"
                                />
                                <Text className="text-xs text-white">قبول</Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={() => handleReject(trainer.id)}
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
                          {trainer.status !== 'pending' && (
                            <TouchableOpacity className="flex-row items-center rounded bg-gray-600 px-3 py-1.5">
                              <Ionicons
                                name="pencil-outline"
                                size={12}
                                className="mr-1 text-white"
                              />
                              <Text className="text-xs text-white">تعديل</Text>
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
    </ScrollView>
  );
}
