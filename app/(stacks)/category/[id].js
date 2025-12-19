// app/categories/[id].jsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
  RefreshControl,
  Dimensions
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import {
  GET_APPROVED_MERCHANTS_BY_CATEGORY,
  GET_CATEGORIES,
  GET_APPROVED_TRAINERS_BY_CATEGORY,
} from '@/utils/queries';
import { useAuth } from '@/context/auth-context';
import { useQuery } from '@apollo/client/react';
import Loading from '@/components/Loading';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_WIDTH = SCREEN_WIDTH - 64; // 32px padding on each side

export default function CategoryDirectoryPage() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { user } = useAuth();
  const [categoryId, setCategoryId] = useState(id);
  const [merchantPage, setMerchantPage] = useState(1);
  const [trainerPage, setTrainerPage] = useState(1);
  const [refreshing, setRefreshing] = useState(false);
  const [hasMoreMerchants, setHasMoreMerchants] = useState(true);
  const [hasMoreTrainers, setHasMoreTrainers] = useState(true);

  // Fetch categories
  const { data: categoriesData } = useQuery(GET_CATEGORIES);

  // Fetch merchants with pagination
  const {
    data: merchantsData,
    loading: merchantsLoading,
    fetchMore: fetchMoreMerchants,
    refetch: refetchMerchants
  } = useQuery(
    GET_APPROVED_MERCHANTS_BY_CATEGORY,
    {
      variables: { 
        categoryId: categoryId,
        page: 1,
        limit: 10 
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  // Fetch trainers with pagination
  const {
    data: trainersData,
    loading: trainersLoading,
    fetchMore: fetchMoreTrainers,
    refetch: refetchTrainers
  } = useQuery(
    GET_APPROVED_TRAINERS_BY_CATEGORY,
    {
      variables: { 
        categoryId: categoryId,
        page: 1,
        limit: 10 
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const currentCategory = categoriesData?.categories?.find((cat) => cat.id === categoryId);

  const merchants = merchantsData?.approvedMerchantsByCategory?.merchants || [];
  const trainers = trainersData?.approvedTrainersByCategory?.trainers || [];
  const categories = categoriesData?.categories || [];

  const totalMerchants = merchantsData?.approvedMerchantsByCategory?.total || 0;
  const totalTrainers = trainersData?.approvedTrainersByCategory?.total || 0;

  useEffect(() => {
    setMerchantPage(1);
    setTrainerPage(1);
    setHasMoreMerchants(true);
    setHasMoreTrainers(true);
  }, [categoryId]);

  useEffect(() => {
    if (merchants.length >= totalMerchants && totalMerchants > 0) {
      setHasMoreMerchants(false);
    }
  }, [merchants.length, totalMerchants]);

  useEffect(() => {
    if (trainers.length >= totalTrainers && totalTrainers > 0) {
      setHasMoreTrainers(false);
    }
  }, [trainers.length, totalTrainers]);

  const loadMoreMerchants = () => {
    if (!hasMoreMerchants || merchantsLoading) return;

    const nextPage = merchantPage + 1;
    
    fetchMoreMerchants({
      variables: {
        page: nextPage,
        limit: 10
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;
        
        return {
          approvedMerchantsByCategory: {
            ...fetchMoreResult.approvedMerchantsByCategory,
            merchants: [
              ...prevResult.approvedMerchantsByCategory.merchants,
              ...fetchMoreResult.approvedMerchantsByCategory.merchants
            ]
          }
        };
      }
    });
    
    setMerchantPage(nextPage);
  };

  const loadMoreTrainers = () => {
    if (!hasMoreTrainers || trainersLoading) return;

    const nextPage = trainerPage + 1;
    
    fetchMoreTrainers({
      variables: {
        page: nextPage,
        limit: 10
      },
      updateQuery: (prevResult, { fetchMoreResult }) => {
        if (!fetchMoreResult) return prevResult;
        
        return {
          approvedTrainersByCategory: {
            ...fetchMoreResult.approvedTrainersByCategory,
            trainers: [
              ...prevResult.approvedTrainersByCategory.trainers,
              ...fetchMoreResult.approvedTrainersByCategory.trainers
            ]
          }
        };
      }
    });
    
    setTrainerPage(nextPage);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([refetchMerchants(), refetchTrainers()]);
      setMerchantPage(1);
      setTrainerPage(1);
      setHasMoreMerchants(true);
      setHasMoreTrainers(true);
    } finally {
      setRefreshing(false);
    }
  };

  const renderMerchantCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/category/merchant/${item.slug}`)}
      className="rounded-xl border border-[#E5E7EB] bg-white shadow-lg mr-4"
      style={{
        width: CARD_WIDTH,
        shadowColor: 'rgba(24,52,74,0.10)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 18,
        elevation: 4,
      }}>
      <View className="h-32 items-center justify-center bg-[#F7F9FA] rounded-t-xl">
        {item.logo?.url ? (
          <Image
            source={{ uri: item.logo.url }}
            className="h-16 w-16 rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <View className="h-16 w-16 items-center justify-center rounded-lg bg-[#1E2053]">
            <Ionicons name="storefront-outline" size={24} color="white" />
          </View>
        )}
      </View>
      <View className="border-l-4 border-[#CAA453] p-3">
        <Text className="font-inter mb-1 text-base font-bold text-[#18344A]" numberOfLines={1}>
          {item.businessName}
        </Text>
        <Text className="font-inter mb-2 text-xs text-[#4E6882]" numberOfLines={2}>
          {item.description}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={12} color="#7A8699" />
            <Text className="font-inter text-xs text-[#7A8699]">
              {item.city.nameAr}
            </Text>
          </View>
          {item.whatsapp && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="chatbubble-outline" size={12} color="#2A4F68" />
              <Text className="font-inter text-xs text-[#2A4F68]">واتساب</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTrainerCard = ({ item }) => (
    <TouchableOpacity
      onPress={() => router.push(`/trainer/${item.slug}`)}
      className="rounded-xl border border-[#E5E7EB] bg-white shadow-lg mr-4"
      style={{
        width: CARD_WIDTH,
        shadowColor: 'rgba(24,52,74,0.10)',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 1,
        shadowRadius: 18,
        elevation: 4,
      }}>
      <View className="h-32 items-center justify-center bg-[#F7F9FA] rounded-t-xl">
        {item.logo?.url ? (
          <Image
            source={{ uri: item.logo.url }}
            className="h-16 w-16 rounded-lg"
            resizeMode="cover"
          />
        ) : (
          <View className="h-16 w-16 items-center justify-center rounded-lg bg-[#1E2053]">
            <Ionicons name="school-outline" size={24} color="white" />
          </View>
        )}
      </View>
      <View className="border-l-4 border-[#CAA453] p-3">
        <Text className="font-inter mb-1 text-base font-bold text-[#18344A]" numberOfLines={1}>
          {item.fullName}
        </Text>
        <Text className="font-inter mb-1 text-xs text-[#4E6882]">
          {item.specialization}
        </Text>
        <Text className="font-inter mb-2 text-xs text-[#4E6882]" numberOfLines={2}>
          {item.description}
        </Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-1">
            <Ionicons name="location-outline" size={12} color="#7A8699" />
            <Text className="font-inter text-xs text-[#7A8699]">
              {item.city.nameAr}
            </Text>
          </View>
          {item.whatsapp && (
            <View className="flex-row items-center gap-1">
              <Ionicons name="chatbubble-outline" size={12} color="#2A4F68" />
              <Text className="font-inter text-xs text-[#2A4F68]">واتساب</Text>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderMerchantFooter = () => {
    if (!hasMoreMerchants) return null;
    
    return (
      <View className="items-center justify-center" style={{ width: CARD_WIDTH, marginRight: 16 }}>
        <ActivityIndicator size="small" color="#1E2053" />
        <Text className="mt-2 text-xs text-[#4E6882]">جاري تحميل المزيد...</Text>
      </View>
    );
  };

  const renderTrainerFooter = () => {
    if (!hasMoreTrainers) return null;
    
    return (
      <View className="items-center justify-center" style={{ width: CARD_WIDTH, marginRight: 16 }}>
        <ActivityIndicator size="small" color="#1E2053" />
        <Text className="mt-2 text-xs text-[#4E6882]">جاري تحميل المزيد...</Text>
      </View>
    );
  };

  const loading = merchantsLoading && merchantPage === 1;

  return (
    <ScrollView 
      className="flex-1 bg-white" 
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
          colors={['#1E2053']}
          tintColor="#1E2053"
        />
      }>
      {/* Compact Header */}
      <View className="bg-white px-4 py-4 border-b border-[#E5E7EB]">        
        <View className="flex-row items-center justify-between">
          <View className="flex-1">
            <Text className="font-poppins text-xl font-bold text-[#1E2053]">
              {currentCategory?.nameAr || ''}
            </Text>
            <Text className="font-inter mt-1 text-sm text-[#4E6882]" numberOfLines={3}>
              {currentCategory?.description || ''}
            </Text>
          </View>
        </View>
      </View>

      {/* Categories Navigation */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="border-b border-[#E5E7EB] bg-white"
        contentContainerClassName="px-4 py-3 flex-row gap-2">
        {categories.map((category) => (
          <TouchableOpacity
            key={category.id}
            onPress={() => setCategoryId(category.id)}
            className={`rounded-full px-4 py-2 ${
              category.id === categoryId 
                ? 'bg-[#1E2053]' 
                : 'bg-[#F7F9FA] border border-[#E5E7EB]'
            }`}>
            <Text
              className={`font-inter text-sm ${
                category.id === categoryId ? 'text-white' : 'text-[#4E6882]'
              }`}>
              {category.nameAr}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      {loading ? (
        <Loading />
      ) : (
        <View className="py-6">
          {/* Merchants Section */}
          {merchants.length > 0 && (
            <View className="mb-8">
              <View className="mb-4 flex-row items-center justify-between px-4">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="storefront-outline" size={20} color="#1E2053" />
                  <Text className="font-poppins text-lg font-bold text-[#18344A]">
                    التجار والأسر المنتجة
                  </Text>
                </View>
                <View className="rounded-full bg-[#F7F9FA] px-3 py-1">
                  <Text className="font-inter text-xs font-medium text-[#1E2053]">
                    {merchants.length} من {totalMerchants}
                  </Text>
                </View>
              </View>

              <FlatList
                data={merchants}
                renderItem={renderMerchantCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={renderMerchantFooter}
                onEndReached={loadMoreMerchants}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                getItemLayout={(data, index) => ({
                  length: CARD_WIDTH + 16, // 16 is the marginRight
                  offset: (CARD_WIDTH + 16) * index,
                  index,
                })}
              />
            </View>
          )}

          {/* Trainers Section */}
          {trainers.length > 0 && (
            <View className="mb-8">
              <View className="mb-4 flex-row items-center justify-between px-4">
                <View className="flex-row items-center gap-2">
                  <Ionicons name="school-outline" size={20} color="#1E2053" />
                  <Text className="font-poppins text-lg font-bold text-[#18344A]">
                    المدربون ومقدمو الخدمات
                  </Text>
                </View>
                <View className="rounded-full bg-[#F7F9FA] px-3 py-1">
                  <Text className="font-inter text-xs font-medium text-[#1E2053]">
                    {trainers.length} من {totalTrainers}
                  </Text>
                </View>
              </View>

              <FlatList
                data={trainers}
                renderItem={renderTrainerCard}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                ListFooterComponent={renderTrainerFooter}
                onEndReached={loadMoreTrainers}
                onEndReachedThreshold={0.5}
                contentContainerStyle={{ paddingHorizontal: 16 }}
                getItemLayout={(data, index) => ({
                  length: CARD_WIDTH + 16, // 16 is the marginRight
                  offset: (CARD_WIDTH + 16) * index,
                  index,
                })}
              />
            </View>
          )}

          {/* Empty State */}
          {merchants.length === 0 && trainers.length === 0 && !loading && (
            <View className="items-center py-12 px-4">
              <View className="mb-4 h-20 w-20 items-center justify-center rounded-full bg-[#F7F9FA]">
                <Ionicons name="file-tray-outline" size={32} color="#1E2053" />
              </View>
              <Text className="font-poppins mb-2 text-xl font-bold text-[#18344A]">
                لا توجد أنشطة
              </Text>
              <Text className="font-inter mb-6 text-center text-sm text-[#4E6882]">
                لا توجد أنشطة مسجلة في هذا القسم بعد
              </Text>
              {!user && (
                <TouchableOpacity
                  onPress={() => router.push('/register')}
                  className="rounded-lg bg-[#1E2053] px-6 py-3">
                  <Text className="font-inter text-sm font-semibold text-white">
                    كن أول من يسجل في هذا القسم
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )}
    </ScrollView>
  );
}