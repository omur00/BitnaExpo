import { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { GET_ALL_CATEGORIES } from '@/utils/queries';
import { useQuery } from '@apollo/client/react';
import Loading from '@/components/Loading';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function CategoriesPage() {
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_ALL_CATEGORIES, {
    variables: { page: 1, limit: 10 }, // Load 10 items per page
  });

  // Handle refreshing
  const onRefresh = async () => {
    setRefreshing(true);
    setHasMore(true);
    setPage(1);
    await refetch({ page: 1 });
    setRefreshing(false);
  };

  // Handle loading more data
  const loadMore = () => {
    if (!hasMore || loading) return;

    const nextPage = page + 1;
    setPage(nextPage);

    fetchMore({
      variables: {
        page: nextPage,
        limit: 10,
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult?.getAllCategories?.categories?.length) {
          setHasMore(false);
          return prevResult;
        }

        const newCategories = [
          ...prevResult.getAllCategories.categories,
          ...fetchMoreResult.getAllCategories.categories,
        ];

        return {
          getAllCategories: {
            ...prevResult.getAllCategories,
            categories: newCategories,
            hasNextPage: fetchMoreResult.getAllCategories.hasNextPage,
          },
        };
      },
    });
  };

  if (loading && !data) return <Loading />;

  if (error)
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F9FA]">
        <View className="items-center">
          <Text className="text-red-600">حدث خطأ في تحميل الأقسام</Text>
        </View>
      </View>
    );

  const { categories } = data?.getAllCategories || {};

  // Render footer loader
  const renderFooter = () => {
    if (!hasMore) return null;

    return (
      <View className="items-center py-8">
        <ActivityIndicator size="small" color="#CAA453" />
        <Text className="mt-2 text-sm text-[#4E6882]">جاري تحميل المزيد...</Text>
      </View>
    );
  };

  // Render each category item
  const renderItem = ({ item: category, index }) => (
    <TouchableOpacity
      key={category.id}
      onPress={() => router.push(`/(stacks)/category/${category.id}`)}
      className="mb-4 w-full px-4"
      activeOpacity={0.7}>
      <View className="flex-row items-center rounded-2xl border border-gray-100 bg-white p-6">
        {/* Icon Container with Counter */}
        <View className="relative mr-4">
          <View className="h-16 w-16 items-center justify-center rounded-2xl bg-[#1E2053]">
            <Ionicons name="grid-outline" size={28} color="#FFFFFF" />
          </View>
          <View className="absolute -right-2 -top-2 h-8 w-8 items-center justify-center rounded-full bg-[#CAA453]">
            <Text className="font-arabic-bold text-xs text-white">{index + 1}</Text>
          </View>
        </View>

        {/* Text Content - Takes remaining space */}
        <View className="flex-1">
          <View className="mb-2">
            <Text className="font-arabic-bold text-base text-[#1E2053]" numberOfLines={1}>
              {category.nameAr}
            </Text>
          </View>
          <View className="flex-row items-center gap-1">
            <Text className="font-arabic-semibold text-sm text-[#CAA453]">
              {category.merchantsCount}
            </Text>
            <Text className="font-arabic-regular text-xs text-[#7A8699]">نشاط تجاري</Text>
          </View>
        </View>

        {/* Arrow Icon */}
        <View className="ml-4">
          <Ionicons name="chevron-back" size={20} color="#CAA453" />
        </View>
      </View>
    </TouchableOpacity>
  );

  // Render empty state
  const renderEmpty = () => (
    <View className="flex-1 items-center justify-center py-20">
      <View className="mb-4 h-24 w-24 items-center justify-center rounded-full bg-gray-100">
        <Ionicons name="grid-outline" size={40} color="#7A8699" />
      </View>
      <Text className="text-lg font-semibold text-[#1E2053]">لا توجد أقسام متاحة</Text>
      <Text className="mt-2 text-sm text-[#7A8699]">سيتم إضافة الأقسام قريباً</Text>
    </View>
  );

  return (
    <View className="flex-1 bg-[#F7F9FA]">
      {/* Header */}
      <View className="bg-white px-4 py-8">
        <View className="container mx-auto">
          <Text className="font-arabic-regular text-center text-sm text-[#4E6882]">
            اكتشف جميع الأقسام والأنشطة المتاحة على المنصة
          </Text>
        </View>
      </View>

      {/* Categories List */}
      <FlatList
        data={categories}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        onEndReached={loadMore}
        onEndReachedThreshold={0.3}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmpty}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#CAA453']}
            tintColor="#CAA453"
          />
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
