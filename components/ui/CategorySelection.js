import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { GET_CATEGORIES } from '@/utils/queries';
import { Picker } from '@/components/ui/picker';
import { useQuery } from '@apollo/client/react';

const CategorySelection = ({ formData, onChange, onBlur, error, required = false }) => {
  const { data, loading, error: queryError } = useQuery(GET_CATEGORIES);

  const handleCategoryChange = (selectedValue) => {
    if (!selectedValue) {
      onChange('categoryId', '');
      onChange('category', '');
      return;
    }

    const selectedCategory = data?.categories?.find((category) => category.id === selectedValue);

    onChange('categoryId', selectedValue);

    if (selectedCategory) {
      onChange('category', selectedCategory.nameAr);
    } else {
      onChange('category', '');
    }

    if (onBlur) {
      onBlur('categoryId');
    }
  };

  const categoryOptions = [
    { label: 'اختر القسم', value: '' },
    ...(data?.categories?.map((category) => ({
      label: category.nameAr,
      value: category.id,
    })) || []),
  ];

  return (
    <View className="w-full">
      <Picker
        options={categoryOptions}
        value={formData.categoryId || ''}
        onValueChange={handleCategoryChange}
        placeholder="اختر القسم"
        disabled={loading}
        style={{
          borderColor: error ? '#EF4444' : '#D1D5DB',
          backgroundColor: loading ? '#F3F4F6' : 'white',
          borderRadius: 7,
        }}
      />

      {loading && (
        <View className="mt-1 flex-row items-center">
          <ActivityIndicator size="small" color="#6B7280" />
          <Text className="mr-1 text-sm text-gray-500">جاري تحميل الأقسام...</Text>
        </View>
      )}

      {queryError && (
        <Text className="mt-1 text-sm text-red-500">
          حدث خطأ في تحميل الأقسام. يرجى المحاولة مرة أخرى.
        </Text>
      )}

      {error && !queryError && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};

export default CategorySelection;
