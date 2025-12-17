import { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Pressable,
} from 'react-native';
import { Link, useRouter } from 'expo-router';
import { GET_ALL_CATEGORIES } from '@/utils/queries';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react-native';
import { useQuery } from '@apollo/client/react';
import Loading from '@/components/Loading';

export default function CategoriesPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();
  const { data, loading, error } = useQuery(GET_ALL_CATEGORIES, {
    variables: { page: currentPage, limit: 12 },
  });

  if (loading) return <Loading />;

  if (error)
    return (
      <View className="flex-1 items-center justify-center bg-[#F7F9FA]">
        <View className="items-center">
          <Text className="text-red-600">حدث خطأ في تحميل الأقسام</Text>
        </View>
      </View>
    );

  const { categories, totalPages, hasNextPage, hasPreviousPage } = data?.getAllCategories || {};

  return (
    <ScrollView className="flex-1 bg-[#F7F9FA]">
      {/* Header */}
      <View className="bg-white shadow-sm">
        <View className="container mx-auto px-4 py-6">
          <View className="flex-row items-center gap-4">
            <Pressable onPress={() => router.back()} className="flex-row items-center gap-2">
              <ArrowRight size={20} color="#CAA453" />
              <Text className="font-semibold text-[#CAA453]">العودة للرئيسية</Text>
            </Pressable>
            <Text className="border-b-2 border-[#CAA453] pb-2 text-2xl font-bold text-[#1E2053]">
              جميع الأقسام
            </Text>
          </View>
        </View>
      </View>

      {/* Categories Grid */}
      <View className="bg-white py-12">
        <View className="container mx-auto px-4">
          <View className="mb-12 items-center">
            <Text className="mx-auto max-w-2xl text-center text-lg text-[#4E6882]">
              اكتشف جميع الأقسام والأنشطة المتاحة على المنصة
            </Text>
          </View>

          <View className="-mx-2 flex-row flex-wrap">
            {categories?.map((category, index) => (
              <Link key={category.id} href={`/category/${category.id}`} asChild>
                <TouchableOpacity className="w-1/2 p-2 lg:w-1/3 xl:w-1/5">
                  <View className="rounded-2xl border border-gray-100 bg-white p-6 transition-all active:scale-95">
                    {/* Content */}
                    <View className="relative">
                      {/* Icon Container */}
                      <View className="relative mb-4">
                        <View className="mx-auto h-16 w-16 items-center justify-center rounded-2xl bg-[#1E2053] shadow-lg">
                          <Ionicons name="grid-outline" size={28} color="#FFFFFF" />
                        </View>

                        {/* Floating Counter */}
                        <View className="absolute -right-2 -top-2 h-8 w-8 items-center justify-center rounded-full bg-[#CAA453] shadow-lg">
                          <Text className="text-xs font-bold text-white">{index + 1}</Text>
                        </View>
                      </View>

                      {/* Text Content */}
                      <Text
                        className="mb-2 text-center text-base font-bold text-[#1E2053]"
                        numberOfLines={1}>
                        {category.nameAr}
                      </Text>

                      <View className="flex-row items-center justify-center gap-2">
                        <Text className="text-sm font-semibold text-[#CAA453]">
                          {category.merchantsCount}
                        </Text>
                        <Text className="text-sm text-[#7A8699]">نشاط</Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              </Link>
            ))}
          </View>

          {/* Pagination */}
          {totalPages > 1 && (
            <View className="mt-16 flex-row items-center justify-center gap-3">
              <TouchableOpacity
                onPress={() => setCurrentPage((prev) => prev - 1)}
                disabled={!hasPreviousPage}
                className={`flex-row items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 ${
                  !hasPreviousPage ? 'opacity-50' : ''
                }`}>
                <ChevronRight size={16} color="#1E2053" />
                <Text className="text-sm font-semibold text-[#1E2053]">السابق</Text>
              </TouchableOpacity>

              <View className="flex-row gap-2">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <TouchableOpacity
                    key={page}
                    onPress={() => setCurrentPage(page)}
                    className={`h-12 w-12 items-center justify-center rounded-xl ${
                      currentPage === page ? 'bg-[#CAA453]' : 'border border-gray-200 bg-white'
                    }`}>
                    <Text
                      className={`text-sm font-semibold ${
                        currentPage === page ? 'text-white' : 'text-[#1E2053]'
                      }`}>
                      {page}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              <TouchableOpacity
                onPress={() => setCurrentPage((prev) => prev + 1)}
                disabled={!hasNextPage}
                className={`flex-row items-center gap-2 rounded-xl border border-gray-200 bg-white px-6 py-3 ${
                  !hasNextPage ? 'opacity-50' : ''
                }`}>
                <Text className="text-sm font-semibold text-[#1E2053]">التالي</Text>
                <ChevronLeft size={16} color="#1E2053" />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </ScrollView>
  );
}
