import { useState, useCallback } from 'react';
import { GET_ALL_USERS, TOGGLE_USER_STATUS } from '@/utils/queries';
import { Ionicons } from '@expo/vector-icons';
import { formatDate } from '@/utils/formatDate';
import { useRouter } from 'expo-router';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
} from 'react-native';
import { useMutation, useQuery } from '@apollo/client/react';
import { useNotification } from '@/context/notification-context';
import Loading from '@/components/Loading';

export default function UserManagement() {
  const [pageSize] = useState(10);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const { showSuccess } = useNotification();
  const router = useRouter();
  const [users, setUsers] = useState([]);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const { data, loading, refetch, fetchMore } = useQuery(GET_ALL_USERS, {
    variables: { page: 1, limit: pageSize },
    onCompleted: (data) => {
      if (data?.users?.users) {
        setUsers(data.users.users);
        setHasMore(data.users.hasNextPage);
      }
    },
  });

  const [toggleUserStatus] = useMutation(TOGGLE_USER_STATUS, {
    onCompleted: async () => {
      await refetch();
      showSuccess('تم تغيير حالة المستخدم بنجاح!');
    },
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const usersData = data?.users;
  const totalCount = usersData?.totalCount || 0;
  const currentPage = usersData?.currentPage || 1;
  const hasNextPage = usersData?.hasNextPage || false;

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
        className={`flex-row items-center gap-1 rounded-full border px-3 py-1.5 ${roleInfo.bg} ${roleInfo.border}`}>
        <Ionicons name={roleInfo.icon} size={14} color={getIconColor(role)} />
        <Text className={`text-xs font-medium ${roleInfo.text}`}>{roleInfo.label}</Text>
      </View>
    );
  };

  const getIconColor = (role) => {
    switch (role) {
      case 'admin':
        return '#DC2626';
      case 'merchant':
        return '#B45309';
      case 'trainer':
        return '#1D4ED8';
      default:
        return '#4B5563';
    }
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

  const roleOptions = [
    { value: '', label: 'جميع المستخدمين', icon: 'people-outline' },
    { value: 'admin', label: 'المشرفون', icon: 'shield-checkmark-outline' },
    { value: 'merchant', label: 'التجار', icon: 'storefront-outline' },
    { value: 'trainer', label: 'المدربون', icon: 'school-outline' },
    { value: 'user', label: 'مستخدم عادي', icon: 'person-outline' },
  ];

  // Handle pull-to-refresh
  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch({ page: 1, limit: pageSize });
      setHasMore(true);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch, pageSize]);

  // Handle load more
  const handleLoadMore = useCallback(async () => {
    if (isLoadingMore || !hasMore || !hasNextPage) return;

    setIsLoadingMore(true);
    try {
      const nextPage = currentPage + 1;
      const { data: moreData } = await fetchMore({
        variables: {
          page: nextPage,
          limit: pageSize,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          return {
            users: {
              ...fetchMoreResult.users,
              users: [...prevResult.users.users, ...fetchMoreResult.users.users],
            },
          };
        },
      });

      if (moreData?.users) {
        setUsers((prev) => [...prev, ...moreData.users.users]);
        setHasMore(moreData.users.hasNextPage);
      }
    } catch (error) {
      console.error('Error loading more users:', error);
    } finally {
      setIsLoadingMore(false);
    }
  }, [isLoadingMore, hasMore, hasNextPage, currentPage, fetchMore, pageSize]);

  // Render header with stats and filters
  const renderHeader = () => {
    const statCards = [
      {
        count: totalCount,
        label: 'إجمالي المستخدمين',
        icon: 'people-outline',
        color: 'text-gray-900',
        iconColor: '#6B7280',
      },
      {
        count: adminCount,
        label: 'المشرفون',
        icon: 'shield-checkmark-outline',
        color: 'text-red-600',
        iconColor: '#DC2626',
      },
      {
        count: merchantCount,
        label: 'التجار',
        icon: 'storefront-outline',
        color: 'text-amber-600',
        iconColor: '#D97706',
      },
      {
        count: trainerCount,
        label: 'المدربون',
        icon: 'school-outline',
        color: 'text-blue-600',
        iconColor: '#2563EB',
      },
      {
        count: activeCount,
        label: 'النشطاء',
        icon: 'checkmark-circle-outline',
        color: 'text-emerald-600',
        iconColor: '#059669',
      },
      {
        count: inactiveCount,
        label: 'المعطلون',
        icon: 'close-circle-outline',
        color: 'text-red-600',
        iconColor: '#DC2626',
      },
    ];

    return (
      <View className="px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="font-arabic-regular text-sm text-gray-600">
            إدارة جميع مستخدمي المنصة والتحكم في صلاحياتهم
          </Text>
        </View>

        {/* Stats Cards */}
        <View className="mb-6">
          <View className="flex-row flex-wrap gap-3">
            {statCards.map((stat, index) => (
              <View
                key={index}
                className="min-w-[48%] flex-1 rounded-xl border border-gray-200 bg-white p-4">
                <View className="flex-row items-center justify-between">
                  <View>
                    <Text className="font-arabic-regular mb-1 text-xs text-gray-600">
                      {stat.label}
                    </Text>
                    <Text className={`font-arabic-extrabold text-xl ${stat.color}`}>
                      {stat.count}
                    </Text>
                  </View>
                  <Ionicons name={stat.icon} size={24} color={stat.iconColor} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Filters and Search */}
        <View className="mb-6 rounded-xl border border-gray-200 bg-white p-4">
          <View className="gap-4">
            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="search-outline" size={18} color="#6B7280" />
                <Text className="font-arabic-semibold text-sm text-gray-700">بحث</Text>
              </View>
              <TextInput
                value={searchTerm}
                onChangeText={setSearchTerm}
                placeholder="ابحث بالاسم أو البريد الإلكتروني..."
                className="font-arabic-regular w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-900"
                textAlign="right"
              />
            </View>

            <View className="gap-2">
              <View className="flex-row items-center gap-2">
                <Ionicons name="filter-outline" size={18} color="#6B7280" />
                <Text className="font-arabic-semibold text-sm text-gray-700">نوع المستخدم</Text>
              </View>
              <View className="relative">
                <TouchableOpacity
                  className="flex-row items-center justify-between rounded-lg border border-gray-300 bg-white px-3 py-3"
                  onPress={() => setShowRoleDropdown(!showRoleDropdown)}>
                  <Text className="font-arabic-regular text-sm text-gray-900">
                    {getFilterText()}
                  </Text>
                  <Ionicons
                    name={showRoleDropdown ? 'chevron-up' : 'chevron-down'}
                    size={16}
                    color="#6B7280"
                  />
                </TouchableOpacity>

                {showRoleDropdown && (
                  <View className="absolute left-0 right-0 top-full z-10 mt-1 rounded-lg border border-gray-300 bg-white shadow-lg">
                    {roleOptions.map((option) => (
                      <TouchableOpacity
                        key={option.value}
                        onPress={() => {
                          setRoleFilter(option.value);
                          setShowRoleDropdown(false);
                        }}
                        className="flex-row items-center gap-2 border-b border-gray-100 px-3 py-3 last:border-b-0">
                        <Ionicons name={option.icon} size={16} color="#6B7280" />
                        <Text className="font-arabic-regular flex-1 text-sm text-gray-900">
                          {option.label}
                        </Text>
                        {roleFilter === option.value && (
                          <Ionicons name="checkmark" size={16} color="#10B981" />
                        )}
                      </TouchableOpacity>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View className="rounded-lg bg-gray-50 px-3 py-3">
              <Text className="font-arabic-regular text-center text-xs text-gray-700">
                عرض <Text className="font-arabic-bold">{filteredUsers.length}</Text> من أصل
                <Text className="font-arabic-bold">{totalCount}</Text> مستخدم
              </Text>
            </View>
          </View>
        </View>

        {/* Users List Header */}
        <View>
          <Text className="font-arabic-semibold text-base text-gray-900">المستخدمين</Text>
        </View>
      </View>
    );
  };

  // Render footer with loading indicator
  const renderFooter = () => {
    if (isLoadingMore) {
      return (
        <View className="py-4">
          <ActivityIndicator size="small" color="#CAA453" />
        </View>
      );
    }

    if (!hasMore && filteredUsers.length > 0) {
      return (
        <View className="items-center py-4">
          <Text className="font-arabic-regular text-sm text-gray-500">تم عرض جميع المستخدمين</Text>
        </View>
      );
    }

    return null;
  };

  // Render empty state
  const renderEmptyState = () => (
    <View className="px-4 py-12">
      <View className="items-center gap-3">
        <Ionicons name="people-outline" size={48} color="#D1D5DB" />
        <Text className="font-arabic-semibold text-base text-gray-900">لا توجد مستخدمين</Text>
        <Text className="font-arabic-regular text-center text-sm text-gray-600">
          {searchTerm || roleFilter
            ? 'لا توجد نتائج تطابق البحث'
            : 'لا توجد مستخدمين في هذه الصفحة'}
        </Text>
      </View>
    </View>
  );

  // Render each user item
  const renderUserItem = ({ item: user }) => {
    const activityIcon = getActivityIcon(user);

    return (
      <View className="mb-4 rounded-xl border border-gray-200 bg-white">
        <View className="p-4">
          {/* User Info */}
          <View className="mb-3 flex-row items-start justify-between">
            <View className="flex-row items-center gap-3">
              <Ionicons name="person-circle-outline" size={36} color="#9CA3AF" />
              <View>
                <Text className="font-arabic-semibold text-sm text-gray-900">{user.fullName}</Text>
                <View className="mt-1 flex-row items-center gap-1">
                  <Ionicons name="mail-outline" size={14} color="#6B7280" />
                  <Text className="font-arabic-regular text-xs text-gray-500">{user.email}</Text>
                </View>
              </View>
            </View>
            {getRoleBadge(user.role)}
          </View>

          {/* Additional Info */}
          <View className="mb-3 flex-row items-center gap-4">
            <View className="flex-row items-center gap-1">
              <Ionicons name={activityIcon} size={14} color="#6B7280" />
              <Text className="font-arabic-regular text-xs text-gray-600">
                {user.merchant && 'تاجر'}
                {user.trainer && 'مدرب'}
                {!user.merchant && !user.trainer && 'مستخدم عادي'}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="calendar-outline" size={14} color="#6B7280" />
              <Text className="font-arabic-regular text-xs text-gray-600">
                {formatDate(user.createdAt)}
              </Text>
            </View>
          </View>

          {/* Status and Actions */}
          <View className="gap-2">
            <View className="flex-row items-center justify-between border-t border-gray-100 pt-3">
              <View
                className={`flex-row items-center gap-1 rounded-full border px-3 py-1.5 ${
                  user.isActive ? 'border-emerald-200 bg-emerald-50' : 'border-red-200 bg-red-50'
                }`}>
                <Ionicons
                  name={user.isActive ? 'checkmark-circle-outline' : 'close-circle-outline'}
                  size={14}
                  color={user.isActive ? '#047857' : '#DC2626'}
                />
                <Text
                  className={`font-arabic-semibold text-xs ${
                    user.isActive ? 'text-emerald-700' : 'text-red-700'
                  }`}>
                  {user.isActive ? 'نشط' : 'معطل'}
                </Text>
              </View>

              <View className="flex-row gap-2">
                <TouchableOpacity
                  onPress={() => router.push(`/(admin)/user/${user.id}`)}
                  className="flex-row items-center gap-1 rounded-lg bg-gray-100 px-3 py-2">
                  <Ionicons name="eye-outline" size={14} color="#374151" />
                  <Text className="font-arabic-semibold text-xs text-gray-700">عرض</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    const userJson = JSON.stringify(user);
                    router.push({
                      pathname: '/(admin)/user/edit',
                      params: { user: userJson },
                    });
                  }}
                  className="flex-row items-center gap-1 rounded-lg bg-gray-100 px-3 py-2">
                  <Ionicons name="pencil-outline" size={14} color="#374151" />
                  <Text className="font-arabic-semibold text-xs text-gray-700">تعديل</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Toggle Status Button */}
            <TouchableOpacity
              onPress={() => handleToggleStatus(user.id, user.isActive)}
              className={`flex-row items-center justify-center gap-1 rounded-lg px-3 py-2.5 ${
                user.isActive
                  ? 'border border-red-200 bg-red-50'
                  : 'border border-emerald-200 bg-emerald-50'
              }`}>
              <Text
                className={`font-arabic-semibold text-sm ${
                  user.isActive ? 'text-red-700' : 'text-emerald-700'
                }`}>
                {user.isActive ? 'تعطيل المستخدم' : 'تفعيل المستخدم'}
              </Text>
              <Ionicons
                name={user.isActive ? 'close-circle-outline' : 'checkmark-circle-outline'}
                size={16}
                color={user.isActive ? '#DC2626' : '#047857'}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  if (loading && users.length === 0) {
    return <Loading />;
  }

  return (
    <View className="flex-1 bg-gray-50">
      <FlatList
        data={filteredUsers}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={renderEmptyState}
        ListFooterComponent={renderFooter}
        contentContainerStyle={{
          paddingBottom: 20,
          flexGrow: filteredUsers.length === 0 ? 1 : 0,
        }}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handleRefresh}
            colors={['#CAA453']}
            tintColor="#CAA453"
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        showsVerticalScrollIndicator={false}
        // Performance optimizations
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={21}
        removeClippedSubviews={true}
        keyboardShouldPersistTaps="handled"
        // For sticky header if needed
      />
    </View>
  );
}
