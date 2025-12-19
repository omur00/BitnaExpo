// app/featured-trainers.jsx
import React, { useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { GET_ALL_FEATURED_TRAINERS } from '@/utils/queries';
import { useQuery } from '@apollo/client/react';
import Loading from '@/components/Loading';

const ITEMS_PER_PAGE = 12;

export default function FeaturedTrainersPage() {
  const router = useRouter();
  const [offset, setOffset] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  // Use ref to prevent duplicate onEndReached calls
  const isFetchingRef = useRef(false);

  const { data, loading, error, fetchMore, refetch } = useQuery(GET_ALL_FEATURED_TRAINERS, {
    variables: {
      limit: ITEMS_PER_PAGE,
      offset: 0, // Start from offset 0
    },
    notifyOnNetworkStatusChange: true,
  });

  const trainers = data?.getAllFeaturedTrainers?.trainers || [];
  const hasNextPage = data?.getAllFeaturedTrainers?.hasNextPage || false;
  const totalCount = data?.getAllFeaturedTrainers?.totalCount || 0;

  const loadMoreTrainers = useCallback(async () => {
    // Prevent multiple calls
    if (!hasNextPage || isLoadingMore || isFetchingRef.current || trainers.length === 0) {
      return;
    }

    try {
      isFetchingRef.current = true;
      setIsLoadingMore(true);

      const newOffset = offset + trainers.length;

      const { data: moreData } = await fetchMore({
        variables: {
          limit: ITEMS_PER_PAGE,
          offset: newOffset,
        },
        updateQuery: (prevResult, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prevResult;

          return {
            getAllFeaturedTrainers: {
              ...fetchMoreResult.getAllFeaturedTrainers,
              trainers: [
                ...prevResult.getAllFeaturedTrainers.trainers,
                ...fetchMoreResult.getAllFeaturedTrainers.trainers,
              ],
            },
          };
        },
      });

      if (moreData?.getAllFeaturedTrainers?.trainers) {
        setOffset(newOffset);
      }
    } catch (error) {
      console.error('Error loading more trainers:', error);
    } finally {
      isFetchingRef.current = false;
      setIsLoadingMore(false);
    }
  }, [hasNextPage, isLoadingMore, trainers.length, offset, fetchMore]);

  const onRefresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      await refetch({ limit: ITEMS_PER_PAGE, offset: 0 });
      setOffset(0);
    } finally {
      setIsRefreshing(false);
    }
  }, [refetch]);

  const renderTrainerCard = ({ item: trainer, index }) => (
    <TouchableOpacity
      onPress={() => router.push(`/(stacks)/category/trainer/${trainer.slug}`)}
      className="mx-4 my-2 rounded-xl border border-[#E5E7EB] bg-white"
      activeOpacity={0.7}>
      <View className="flex-row items-center p-4">
        {/* Logo Container */}
        <View className="mr-4">
          {trainer.logo ? (
            <Image
              source={{ uri: trainer.logo }}
              className="h-16 w-16 rounded-lg"
              resizeMode="cover"
            />
          ) : (
            <View className="h-16 w-16 items-center justify-center rounded-lg bg-[#1E2053]">
              <Ionicons name="person-outline" size={24} color="white" />
            </View>
          )}
        </View>

        {/* Trainer Info */}
        <View className="flex-1">
          <View className="mb-2 flex-row items-center justify-between">
            <Text className="font-poppins text-lg font-bold text-[#18344A]" numberOfLines={1}>
              {trainer.fullName}
            </Text>
            <View className="flex-row items-center gap-1 rounded-full bg-[#F7F9FA] px-2 py-1">
              <Text className="font-inter text-xs text-[#7A8699]">#{offset + index + 1}</Text>
            </View>
          </View>

          <Text className="font-inter mb-1 text-sm font-medium text-[#CAA453]" numberOfLines={1}>
            {trainer.specialization}
          </Text>

          <Text className="font-inter mb-2 text-sm text-[#4E6882]" numberOfLines={2}>
            {trainer.description}
          </Text>

          <View className="flex-row items-center gap-3">
            <View className="flex-row items-center gap-1">
              <Ionicons name="business-outline" size={12} color="#7A8699" />
              <Text className="font-inter text-xs text-[#7A8699]">
                {trainer.category?.nameAr || 'غير محدد'}
              </Text>
            </View>
            <View className="flex-row items-center gap-1">
              <Ionicons name="location-outline" size={12} color="#7A8699" />
              <Text className="font-inter text-xs text-[#7A8699]">
                {trainer.city?.nameAr || 'غير محدد'}
              </Text>
            </View>
          </View>
        </View>

        {/* Arrow Icon */}
        <View className="ml-2">
          <Ionicons name="chevron-back" size={20} color="#CBD0D6" />
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFooter = () => {
    if (!hasNextPage && trainers.length > 0) {
      return (
        <View className="py-4">
          <Text className="text-center text-sm text-[#7A8699]">
            تم عرض جميع المدربين المميزين ({trainers.length} من {totalCount})
          </Text>
        </View>
      );
    }

    if (isLoadingMore) {
      return (
        <View className="py-4">
          <ActivityIndicator size="small" color="#1E2053" />
        </View>
      );
    }

    return null;
  };

  const renderEmptyState = () => {
    if (loading) return null;

    return (
      <View className="flex-1 items-center justify-center py-12">
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-[#F7F9FA]">
          <Ionicons name="people-outline" size={32} color="#CBD0D6" />
        </View>
        <Text className="font-poppins mb-2 text-xl font-bold text-[#18344A]">
          لا توجد مدربون مميزون حالياً
        </Text>
        <Text className="font-inter mb-6 text-center text-sm text-[#4E6882]">
          لم يتم إضافة أي مدربين مميزين بعد. سيتم إضافتها قريباً.
        </Text>
      </View>
    );
  };

  if (loading && trainers.length === 0) {
    return <Loading />;
  }

  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-white p-4">
        <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-[#F7F9FA]">
          <Ionicons name="alert-circle-outline" size={32} color="#EF4444" />
        </View>
        <Text className="font-poppins mb-2 text-xl font-bold text-[#18344A]">حدث خطأ</Text>
        <Text className="font-inter mb-6 text-center text-sm text-[#4E6882]">
          {error.message || 'حدث خطأ في تحميل المدربين المميزين'}
        </Text>
        <TouchableOpacity onPress={() => refetch()} className="rounded-lg bg-[#1E2053] px-6 py-3">
          <Text className="font-inter text-sm font-semibold text-white">إعادة المحاولة</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={trainers}
        renderItem={renderTrainerCard}
        keyExtractor={(item) => item.id}
        contentContainerClassName="pb-4"
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderFooter}
        ListEmptyComponent={renderEmptyState}
        onEndReached={loadMoreTrainers}
        onEndReachedThreshold={0.5}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={onRefresh}
            colors={['#1E2053']}
            tintColor="#1E2053"
          />
        }
        // Prevent duplicate calls
        onMomentumScrollBegin={() => {
          isFetchingRef.current = false;
        }}
      />
    </View>
  );
}
