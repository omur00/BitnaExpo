import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { GET_CITIES } from '@/utils/queries';
import { Picker } from '@/components/ui/picker';
import { useQuery } from '@apollo/client/react';

const CitySelection = ({ formData, onChange, onBlur, error, required = false }) => {
  const { data, loading, error: queryError } = useQuery(GET_CITIES);

  const handleCityChange = (selectedValue) => {
    if (!selectedValue) {
      onChange('cityId', '');
      onChange('city', '');
      return;
    }

    const selectedCity = data?.cities?.find((city) => city.id === selectedValue);

    onChange('cityId', selectedValue);

    if (selectedCity) {
      onChange('city', selectedCity.nameAr);
    } else {
      onChange('city', '');
    }

    if (onBlur) {
      onBlur('cityId');
    }
  };

  const cityOptions = [
    { label: 'اختر المدينة', value: '' },
    ...(data?.cities?.map((city) => ({
      label: city.nameAr,
      value: city.id,
    })) || []),
  ];

  return (
    <View className="w-full">
      <Picker
        options={cityOptions}
        value={formData.cityId || ''}
        onValueChange={handleCityChange}
        placeholder="اختر المدينة"
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
          <Text className="mr-1 text-sm text-gray-500">جاري تحميل المدن...</Text>
        </View>
      )}

      {queryError && (
        <Text className="mt-1 text-sm text-red-500">
          حدث خطأ في تحميل المدن. يرجى المحاولة مرة أخرى.
        </Text>
      )}

      {error && !queryError && <Text className="mt-1 text-sm text-red-500">{error}</Text>}
    </View>
  );
};

export default CitySelection;
