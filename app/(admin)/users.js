import { useState, useEffect } from 'react';
import { GET_ALL_USERS, TOGGLE_USER_STATUS } from '@/utils/queries';
import { Ionicons } from '@expo/vector-icons';
// import { useModal } from '@/contexts/ModalContext';
// import UserEditModal from '@/components/modals/UserEditModal';
import { formatDate } from '@/utils/formatDate';
import { useRouter } from 'expo-router';
// import UserViewModal from '@/components/modals/UserViewModal';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Alert,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMutation, useQuery } from '@apollo/client/react';
import { useNotification } from '@/context/notification-context';
import Loading from '@/components/Loading';

export default function UserManagement() {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [isMobile, setIsMobile] = useState(false);
  const { showSuccess } = useNotification();
  const router = useRouter();

  useEffect(() => {
    const { width } = Dimensions.get('window');
    setIsMobile(width < 768);

    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setIsMobile(window.width < 768);
    });

    return () => subscription?.remove();
  }, []);

  const { data, loading, refetch } = useQuery(GET_ALL_USERS, {
    variables: { page: currentPage, limit: pageSize },
  });

  const [toggleUserStatus] = useMutation(TOGGLE_USER_STATUS, {
    onCompleted: async () => {
      refetch();
      showSuccess('تم تغيير حالة المستخدم بنجاح!');
    },
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  //   const { openModal } = useModal();

  if (loading) {
    return <Loading />;
  }

  const usersData = data?.users;
  const users = usersData?.users || [];
  const totalCount = usersData?.totalCount || 0;
  const totalPages = usersData?.totalPages || 1;
  const hasNextPage = usersData?.hasNextPage || false;
  const hasPreviousPage = usersData?.hasPreviousPage || false;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const handleToggleStatus = (userId, currentStatus) => {
    Alert.alert(
      'تأكيد تغيير الحالة',
      `هل أنت متأكد من ${currentStatus ? 'تعطيل' : 'تفعيل'} هذا المستخدم؟`,
      [
        {
          text: 'إلغاء',
          style: 'cancel',
        },
        {
          text: 'تأكيد',
          onPress: () =>
            toggleUserStatus({
              variables: {
                id: userId,
                isActive: !currentStatus,
              },
            }),
        },
      ]
    );
  };

  const getRoleBadge = (role) => {
    const roles = {
      admin: {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        label: 'مشرف',
        icon: 'shield-checkmark-outline',
      },
      merchant: {
        bg: 'bg-amber-50',
        border: 'border-amber-200',
        text: 'text-amber-700',
        label: 'تاجر',
        icon: 'storefront-outline',
      },
      trainer: {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        label: 'مدرب',
        icon: 'school-outline',
      },
      user: {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-700',
        label: 'مستخدم',
        icon: 'person-outline',
      },
    };

    const roleInfo = roles[role] || roles.user;

    return (
      <View
        className={`flex-row items-center rounded-full border px-2 py-1 ${roleInfo.bg} ${roleInfo.border}`}>
        <Text className={`text-xs ${roleInfo.text} mr-1`}>{roleInfo.label}</Text>
        <Ionicons name={roleInfo.icon} size={12} className={roleInfo.text} />
      </View>
    );
  };

  const getActivityIcon = (user) => {
    if (user.merchant) return 'storefront-outline';
    if (user.trainer) return 'school-outline';
    return 'person-outline';
  };

  const adminCount = users.filter((u) => u.role === 'admin').length;
  const merchantCount = users.filter((u) => u.role === 'merchant').length;
  const trainerCount = users.filter((u) => u.role === 'trainer').length;
  const activeCount = users.filter((u) => u.isActive).length;
  const inactiveCount = users.filter((u) => !u.isActive).length;

  const handleOpenEditModal = (user) => {
    // openModal(UserEditModal, {
    //   user: user,
    //   refetch: refetch,
    //   showSuccess: showSuccess,
    // });
  };

  const handleViewUserModal = (user) => {
    // openModal(UserViewModal, {
    //   userId: user.id,
    // });
  };

  const handleOpenViewUserModal = (user) => {
    router.push(`/admin/users/${user.id}`);
  };

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;

    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let page = startPage; page <= endPage; page++) {
      buttons.push(
        <TouchableOpacity
          key={page}
          onPress={() => handlePageChange(page)}
          className={`rounded px-2 py-1 ${
            currentPage === page ? 'bg-[#CAA453]' : 'border border-gray-300 bg-white'
          }`}>
          <Text className={`text-xs ${currentPage === page ? 'text-white' : 'text-gray-700'}`}>
            {page}
          </Text>
        </TouchableOpacity>
      );
    }

    return buttons;
  };

  const getFilterText = () => {
    switch (roleFilter) {
      case 'admin':
        return 'المشرفون';
      case 'merchant':
        return 'التجار';
      case 'trainer':
        return 'المدربون';
      case 'user':
        return 'مستخدم عادي';
      default:
        return 'جميع المستخدمين';
    }
  };

  return (
    <ScrollView className="flex-1 px-4">
      {/* Header */}
      <View className="mb-2 py-3">
        <View className="items-start">
          <Text className="mt-1 text-right text-xs text-gray-600 sm:text-sm">
            إدارة جميع مستخدمي المنصة والتحكم في صلاحياتهم
          </Text>
        </View>
      </View>

      {/* Stats Cards */}
      <View className="mb-4">
        <View className="flex-row flex-wrap gap-2">
          {[
            {
              count: totalCount,
              label: 'إجمالي المستخدمين',
              icon: 'people-outline',
              color: 'text-gray-900',
            },
            {
              count: adminCount,
              label: 'المشرفون',
              icon: 'shield-checkmark-outline',
              color: 'text-red-600',
            },
            {
              count: merchantCount,
              label: 'التجار',
              icon: 'storefront-outline',
              color: 'text-amber-600',
            },
            {
              count: trainerCount,
              label: 'المدربون',
              icon: 'school-outline',
              color: 'text-blue-600',
            },
            {
              count: activeCount,
              label: 'النشطاء',
              icon: 'checkmark-circle-outline',
              color: 'text-emerald-600',
            },
            {
              count: inactiveCount,
              label: 'المعطلون',
              icon: 'close-circle-outline',
              color: 'text-red-600',
            },
          ].map((stat, index) => (
            <View
              key={index}
              className="min-w-[48%] flex-1 rounded-lg border border-gray-200 bg-white p-3">
              <View className="flex-row items-center justify-between">
                <View className="items-end">
                  <Text className="mb-1 text-xs text-gray-600">{stat.label}</Text>
                  <Text className={`text-base font-bold sm:text-lg ${stat.color}`}>
                    {stat.count}
                  </Text>
                </View>
                <Ionicons name={stat.icon} size={20} className="text-gray-400" />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Filters and Search */}
      <View className="mb-4 rounded-lg border border-gray-200 bg-white p-4">
        <View className="space-y-4">
          <View>
            <View className="mb-2 flex-row items-center gap-2">
              <Ionicons name="search-outline" size={16} className="text-gray-500" />
              <Text className="text-sm font-medium text-gray-700">بحث</Text>
            </View>
            <TextInput
              value={searchTerm}
              onChangeText={setSearchTerm}
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-sm text-gray-500"
            />
          </View>

          <View>
            <View className="mb-2 flex-row items-center gap-2">
              <Ionicons name="filter-outline" size={16} className="text-gray-500" />
              <Text className="text-sm font-medium text-gray-700">نوع المستخدم</Text>
            </View>
            <View className="relative">
              <TouchableOpacity
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-500"
                onPress={() => {
                  /* Implement dropdown */
                }}>
                <Text className="text-right text-sm">{getFilterText()}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-2">
            <Text className="text-right text-xs text-gray-700">
              عرض <Text className="font-bold">{filteredUsers.length}</Text> من أصل
              <Text className="font-bold">{totalCount}</Text> مستخدم (الصفحة {currentPage} من
              {totalPages})
            </Text>
          </View>
        </View>
      </View>

      {/* Users List */}
      <View className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
        {filteredUsers.length === 0 ? (
          <View className="items-center py-8">
            <Ionicons name="people-outline" size={40} className="mb-3 text-gray-300" />
            <Text className="text-sm text-gray-500">لا توجد مستخدمين في هذه الصفحة</Text>
          </View>
        ) : (
          <View className="divide-y divide-gray-200">
            {filteredUsers.map((user) => {
              const activityIcon = getActivityIcon(user);
              return (
                <View key={user.id} className="p-4">
                  {/* User Info */}
                  <View className="mb-3 flex-row items-start justify-between">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="person-circle-outline" size={32} className="text-gray-400" />
                      <View className="items-end">
                        <Text className="text-right text-sm font-semibold text-gray-900">
                          {user.fullName}
                        </Text>
                        <View className="mt-1 flex-row items-center gap-2">
                          <Ionicons name="mail-outline" size={12} className="text-gray-500" />
                          <Text className="text-xs text-gray-500">{user.email}</Text>
                        </View>
                      </View>
                    </View>
                    {getRoleBadge(user.role)}
                  </View>

                  {/* Additional Info */}
                  <View className="mb-3 flex-row gap-4">
                    <View className="flex-row items-center gap-2">
                      <Ionicons name={activityIcon} size={12} className="text-gray-400" />
                      <Text className="text-xs text-gray-600">
                        {user.merchant && 'تاجر'}
                        {user.trainer && 'مدرب'}
                        {!user.merchant && !user.trainer && 'مستخدم عادي'}
                      </Text>
                    </View>
                    <View className="flex-row items-center gap-2">
                      <Ionicons name="calendar-outline" size={12} className="text-gray-500" />
                      <Text className="text-xs text-gray-600">{formatDate(user.createdAt)}</Text>
                    </View>
                  </View>

                  {/* Status and Actions */}
                  <View className="space-y-2">
                    <View className="flex-row items-center justify-between border-t border-gray-100 pt-2">
                      <View
                        className={`flex-row items-center rounded-full border px-2 py-1 ${
                          user.isActive
                            ? 'border-emerald-200 bg-emerald-50'
                            : 'border-red-200 bg-red-50'
                        }`}>
                        <Text
                          className={`text-xs ${user.isActive ? 'text-emerald-700' : 'text-red-700'} mr-1`}>
                          {user.isActive ? 'نشط' : 'معطل'}
                        </Text>
                        <Ionicons
                          name={user.isActive ? 'checkmark-circle-outline' : 'close-circle-outline'}
                          size={12}
                          className={user.isActive ? 'text-emerald-700' : 'text-red-700'}
                        />
                      </View>

                      <View className="flex-row gap-2">
                        <TouchableOpacity
                          onPress={() => handleOpenViewUserModal(user)}
                          className="flex-row items-center rounded bg-gray-100 px-2 py-1.5">
                          <Ionicons name="eye-outline" size={12} className="ml-1 text-gray-600" />
                          <Text className="text-xs text-gray-600">عرض</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() => handleOpenEditModal(user)}
                          className="flex-row items-center rounded bg-gray-100 px-2 py-1.5">
                          <Ionicons
                            name="pencil-outline"
                            size={12}
                            className="ml-1 text-gray-600"
                          />
                          <Text className="text-xs text-gray-600">تعديل</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Toggle Status Button */}
                    <TouchableOpacity
                      onPress={() => handleToggleStatus(user.id, user.isActive)}
                      className={`flex-row items-center justify-center rounded px-2 py-1.5 ${
                        user.isActive
                          ? 'border border-red-200 bg-red-50'
                          : 'border border-emerald-200 bg-emerald-50'
                      }`}>
                      <Text
                        className={`text-xs font-medium ${user.isActive ? 'text-red-700' : 'text-emerald-700'} mr-1`}>
                        {user.isActive ? 'تعطيل' : 'تفعيل'}
                      </Text>
                      <Ionicons
                        name={user.isActive ? 'close-circle-outline' : 'checkmark-circle-outline'}
                        size={12}
                        className={user.isActive ? 'text-red-700' : 'text-emerald-700'}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        )}
      </View>

      {/* Pagination */}
      {totalPages > 1 && (
        <View className="mb-8 rounded-lg border border-gray-200 bg-white p-4">
          <View className="flex-col items-center justify-between gap-3 sm:flex-row">
            <Text className="text-right text-xs text-gray-600">
              عرض {filteredUsers.length} مستخدم في الصفحة {currentPage} من {totalPages}
            </Text>

            <View className="flex-row items-center gap-2">
              <TouchableOpacity
                onPress={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className={`flex-row items-center gap-1 rounded border border-gray-300 bg-white px-3 py-2 ${!hasNextPage ? 'opacity-50' : ''}`}>
                <Text className="text-sm font-medium text-gray-700">التالي</Text>
                <Ionicons name="chevron-forward-outline" size={16} className="text-gray-700" />
              </TouchableOpacity>

              <View className="flex-row gap-1">{renderPaginationButtons()}</View>

              <TouchableOpacity
                onPress={() => handlePageChange(currentPage - 1)}
                disabled={!hasPreviousPage}
                className={`flex-row items-center gap-1 rounded border border-gray-300 bg-white px-3 py-2 ${!hasPreviousPage ? 'opacity-50' : ''}`}>
                <Ionicons name="chevron-back-outline" size={16} className="text-gray-700" />
                <Text className="text-sm font-medium text-gray-700">السابق</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </ScrollView>
  );
}
