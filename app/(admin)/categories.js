import { useState } from 'react';
import {
  GET_CATEGORIES,
  GET_CITIES,
  CREATE_CATEGORY,
  UPDATE_CATEGORY,
  DELETE_CATEGORY,
  CREATE_CITY,
  UPDATE_CITY,
  DELETE_CITY,
} from '@/utils/queries';
import { Ionicons } from '@expo/vector-icons';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  Modal,
  Linking,
} from 'react-native';
import { useMutation, useQuery } from '@apollo/client/react';
import Loading from '@/components/Loading';

export default function CategoryManagement() {
  const {
    data: categoriesData,
    loading: categoriesLoading,
    refetch: refetchCategories,
  } = useQuery(GET_CATEGORIES);
  const { data: citiesData, loading: citiesLoading, refetch: refetchCities } = useQuery(GET_CITIES);

  const [activeTab, setActiveTab] = useState('categories');
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showCityForm, setShowCityForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingCity, setEditingCity] = useState(null);
  const [showIconsInfo, setShowIconsInfo] = useState(false);

  const [createCategory] = useMutation(CREATE_CATEGORY, {
    onCompleted: () => {
      refetchCategories();
      setShowCategoryForm(false);
      setEditingCategory(null);
      resetCategoryForm();
    },
  });

  const [updateCategory] = useMutation(UPDATE_CATEGORY, {
    onCompleted: () => {
      refetchCategories();
      setShowCategoryForm(false);
      setEditingCategory(null);
      resetCategoryForm();
    },
  });

  const [deleteCategory] = useMutation(DELETE_CATEGORY, {
    onCompleted: () => refetchCategories(),
  });

  const [createCity] = useMutation(CREATE_CITY, {
    onCompleted: () => {
      refetchCities();
      setShowCityForm(false);
      setEditingCity(null);
      resetCityForm();
    },
  });

  const [updateCity] = useMutation(UPDATE_CITY, {
    onCompleted: () => {
      refetchCities();
      setShowCityForm(false);
      setEditingCity(null);
      resetCityForm();
    },
  });

  const [deleteCity] = useMutation(DELETE_CITY, {
    onCompleted: () => refetchCities(),
  });

  // Category Form
  const [categoryForm, setCategoryForm] = useState({
    name: '',
    nameAr: '',
    description: '',
    icon: '',
    order: 0,
    isActive: true,
  });

  // City Form
  const [cityForm, setCityForm] = useState({
    name: '',
    nameAr: '',
    isActive: true,
  });

  const resetCategoryForm = () => {
    setCategoryForm({
      name: '',
      nameAr: '',
      description: '',
      icon: '',
      order: 0,
      isActive: true,
    });
  };

  const resetCityForm = () => {
    setCityForm({ name: '', nameAr: '', isActive: true });
  };

  const handleCategorySubmit = () => {
    const variables = { input: categoryForm };

    if (editingCategory) {
      updateCategory({
        variables: { id: editingCategory.id, input: categoryForm },
      });
    } else {
      createCategory({ variables });
    }
  };

  const handleCitySubmit = () => {
    const variables = { input: cityForm };

    if (editingCity) {
      updateCity({ variables: { id: editingCity.id, input: cityForm } });
    } else {
      createCity({ variables });
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      nameAr: category.nameAr,
      description: category.description || '',
      icon: category.icon || '',
      order: category.order,
      isActive: category.isActive,
    });
    setShowCategoryForm(true);
  };

  const handleEditCity = (city) => {
    setEditingCity(city);
    setCityForm({
      name: city.name,
      nameAr: city.nameAr,
      isActive: city.isActive,
    });
    setShowCityForm(true);
  };

  const handleDeleteCategory = (category) => {
    Alert.alert('تأكيد الحذف', `هل أنت متأكد من حذف القسم "${category.nameAr}"؟`, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: () => deleteCategory({ variables: { id: category.id } }),
      },
    ]);
  };

  const handleDeleteCity = (city) => {
    Alert.alert('تأكيد الحذف', `هل أنت متأكد من حذف المدينة "${city.nameAr}"؟`, [
      { text: 'إلغاء', style: 'cancel' },
      {
        text: 'حذف',
        style: 'destructive',
        onPress: () => deleteCity({ variables: { id: city.id } }),
      },
    ]);
  };

  if (categoriesLoading || citiesLoading) {
    return <Loading />;
  }

  const categories = categoriesData?.categories || [];
  const cities = citiesData?.cities || [];

  return (
    <>
      <Modal
        visible={showIconsInfo}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowIconsInfo(false)}>
        <View className="flex-1 justify-center bg-black/50 p-4">
          <View className="rounded-xl bg-white p-6">
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-lg font-bold text-gray-900">معلومات الأيقونات</Text>
              <TouchableOpacity onPress={() => setShowIconsInfo(false)}>
                <Ionicons name="close" size={24} className="text-gray-500" />
              </TouchableOpacity>
            </View>
            <Text className="mb-4 text-gray-700">
              يمكنك الحصول على أسماء الأيقونات من موقع Heroicons
            </Text>
            <TouchableOpacity
              onPress={() => Linking.openURL('https://heroicons.dev/')}
              className="rounded-lg bg-blue-600 py-3">
              <Text className="text-center font-bold text-white">فتح موقع Heroicons</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView className="flex-1 px-4 py-6">
        {/* Header */}
        <View className="mb-6">
          <Text className="text-gray-600">إدارة التصنيفات والمدن المتاحة في المنصة</Text>
        </View>

        {/* Tabs */}
        <View className="mb-4 flex-row rounded-xl border border-gray-200 bg-white">
          <TouchableOpacity
            onPress={() => setActiveTab('categories')}
            className={`flex-1 items-center border-b-2 py-4 ${
              activeTab === 'categories' ? 'border-gray-900' : 'border-transparent'
            }`}>
            <View className="flex-row items-center">
              <Ionicons
                name="folder-outline"
                size={20}
                className={`ml-2 ${activeTab === 'categories' ? 'text-gray-900' : 'text-gray-500'}`}
              />
              <Text
                className={`font-medium ${
                  activeTab === 'categories' ? 'text-gray-900' : 'text-gray-500'
                }`}>
                الأقسام ({categories.length})
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('cities')}
            className={`flex-1 items-center border-b-2 py-4 ${
              activeTab === 'cities' ? 'border-gray-900' : 'border-transparent'
            }`}>
            <View className="flex-row items-center">
              <Ionicons
                name="location-outline"
                size={20}
                className={`ml-2 ${activeTab === 'cities' ? 'text-gray-900' : 'text-gray-500'}`}
              />
              <Text
                className={`font-medium ${
                  activeTab === 'cities' ? 'text-gray-900' : 'text-gray-500'
                }`}>
                المدن ({cities.length})
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="rounded-xl border border-gray-200 bg-white p-4">
          {/* Categories Tab */}
          {activeTab === 'categories' && (
            <View>
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-right text-lg font-bold text-gray-900">الأقسام الرئيسية</Text>
                <TouchableOpacity
                  onPress={() => {
                    resetCategoryForm();
                    setEditingCategory(null);
                    setShowCategoryForm(!showCategoryForm);
                  }}
                  className="rounded-lg bg-gray-900 px-3 py-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name={showCategoryForm ? 'close' : 'add'}
                      size={16}
                      color="white"
                      className="ml-2"
                    />
                    <Text className="text-white">
                      {showCategoryForm ? 'إغلاق النموذج' : 'إضافة قسم جديد'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* Category Form */}
              {showCategoryForm && (
                <View className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <Text className="mb-4 flex-row items-center text-lg font-bold text-gray-900">
                    <Ionicons name="folder-outline" size={20} className="ml-2 text-gray-700" />
                    <Text>{editingCategory ? 'تعديل القسم' : 'إضافة قسم جديد'}</Text>
                  </Text>

                  <View className="space-y-4">
                    <View>
                      <Text className="mb-2 text-right text-sm font-medium text-gray-700">
                        الاسم بالإنجليزية
                      </Text>
                      <TextInput
                        value={categoryForm.name}
                        onChangeText={(text) => setCategoryForm({ ...categoryForm, name: text })}
                        placeholder="الاسم بالانجليزية"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-gray-900"
                      />
                    </View>

                    <View>
                      <Text className="mb-2 text-right text-sm font-medium text-gray-700">
                        الاسم بالعربية *
                      </Text>
                      <TextInput
                        value={categoryForm.nameAr}
                        onChangeText={(text) => setCategoryForm({ ...categoryForm, nameAr: text })}
                        placeholder="الاسم بالعربية"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-gray-900"
                      />
                    </View>

                    <View>
                      <Text className="mb-2 text-right text-sm font-medium text-gray-700">
                        الوصف
                      </Text>
                      <TextInput
                        value={categoryForm.description}
                        onChangeText={(text) =>
                          setCategoryForm({ ...categoryForm, description: text })
                        }
                        placeholder="الوصف"
                        multiline
                        numberOfLines={3}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-gray-900"
                      />
                    </View>

                    <View>
                      <Text className="mb-2 text-right text-sm font-medium text-gray-700">
                        الأيقونة
                      </Text>
                      <TextInput
                        value={categoryForm.icon}
                        onChangeText={(text) => setCategoryForm({ ...categoryForm, icon: text })}
                        placeholder="📦"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-gray-900"
                      />
                      <TouchableOpacity onPress={() => setShowIconsInfo(true)} className="mt-2">
                        <Text className="text-right text-red-700">الحصول على أسماء أيقونات</Text>
                      </TouchableOpacity>
                    </View>

                    <View>
                      <Text className="mb-2 text-right text-sm font-medium text-gray-700">
                        ترتيب العرض
                      </Text>
                      <TextInput
                        value={categoryForm.order.toString()}
                        onChangeText={(text) =>
                          setCategoryForm({
                            ...categoryForm,
                            order: parseInt(text) || 0,
                          })
                        }
                        keyboardType="numeric"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-gray-900"
                      />
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-medium text-gray-700">نشط</Text>
                      <Switch
                        value={categoryForm.isActive}
                        onValueChange={(value) =>
                          setCategoryForm({ ...categoryForm, isActive: value })
                        }
                      />
                    </View>

                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={handleCategorySubmit}
                        className="flex-1 flex-row items-center justify-center rounded-lg bg-gray-900 py-3">
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={16}
                          color="white"
                          className="ml-2"
                        />
                        <Text className="text-white">{editingCategory ? 'تحديث' : 'إضافة'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowCategoryForm(false);
                          resetCategoryForm();
                          setEditingCategory(null);
                        }}
                        className="flex-1 flex-row items-center justify-center rounded-lg bg-gray-500 py-3">
                        <Ionicons
                          name="close-circle-outline"
                          size={16}
                          color="white"
                          className="ml-2"
                        />
                        <Text className="text-white">إلغاء</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {/* Categories List */}
              <View className="space-y-3">
                {categories.map((category) => (
                  <View
                    key={category.id}
                    className="rounded-xl border border-gray-200 bg-white p-4">
                    <View className="mb-3 flex-row items-start justify-between">
                      <View className="flex-row items-start">
                        <Ionicons name="folder-outline" size={24} className="ml-3 text-gray-400" />
                        <View>
                          <Text className="text-right text-lg font-semibold text-gray-900">
                            {category.nameAr}
                          </Text>
                          <Text className="text-right text-sm text-gray-600">{category.name}</Text>
                        </View>
                      </View>
                      <View
                        className={`flex-row items-center rounded-full px-2 py-1 ${
                          category.isActive
                            ? 'border border-emerald-200 bg-emerald-50'
                            : 'border border-red-200 bg-red-50'
                        }`}>
                        <Ionicons
                          name={
                            category.isActive ? 'checkmark-circle-outline' : 'close-circle-outline'
                          }
                          size={12}
                          className={`ml-1 ${
                            category.isActive ? 'text-emerald-700' : 'text-red-700'
                          }`}
                        />
                        <Text
                          className={`text-xs ${
                            category.isActive ? 'text-emerald-700' : 'text-red-700'
                          }`}>
                          {category.isActive ? 'نشط' : 'معطل'}
                        </Text>
                      </View>
                    </View>

                    {category.description && (
                      <Text className="mb-3 text-right text-sm text-gray-600">
                        {category.description}
                      </Text>
                    )}

                    <View className="mb-3 flex-row items-center justify-between">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="pricetag-outline"
                          size={16}
                          className="ml-2 text-gray-500"
                        />
                        <Text className="text-sm text-gray-500">الترتيب: {category.order}</Text>
                      </View>
                      <View className="flex-row items-center space-x-4">
                        <View className="flex-row items-center">
                          <Ionicons
                            name="storefront-outline"
                            size={16}
                            className="ml-2 text-gray-500"
                          />
                          <Text className="text-sm text-gray-500">{category.merchantsCount}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons
                            name="school-outline"
                            size={16}
                            className="ml-2 text-gray-500"
                          />
                          <Text className="text-sm text-gray-500">{category.trainersCount}</Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleEditCategory(category)}
                        className="flex-1 flex-row items-center justify-center rounded-lg bg-gray-100 py-2">
                        <Ionicons name="pencil-outline" size={16} className="ml-2 text-gray-700" />
                        <Text className="text-gray-700">تعديل</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteCategory(category)}
                        className="flex-1 flex-row items-center justify-center rounded-lg bg-red-100 py-2">
                        <Ionicons name="trash-outline" size={16} className="ml-2 text-red-700" />
                        <Text className="text-red-700">حذف</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Cities Tab */}
          {activeTab === 'cities' && (
            <View>
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-right text-lg font-bold text-gray-900">المدن المتاحة</Text>
                <TouchableOpacity
                  onPress={() => {
                    resetCityForm();
                    setEditingCity(null);
                    setShowCityForm(!showCityForm);
                  }}
                  className="rounded-lg bg-gray-900 px-3 py-2">
                  <View className="flex-row items-center">
                    <Ionicons
                      name={showCityForm ? 'close' : 'add'}
                      size={16}
                      color="white"
                      className="ml-2"
                    />
                    <Text className="text-white">
                      {showCityForm ? 'إغلاق النموذج' : 'إضافة مدينة جديدة'}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>

              {/* City Form */}
              {showCityForm && (
                <View className="mb-6 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <Text className="mb-4 flex-row items-center text-lg font-bold text-gray-900">
                    <Ionicons name="location-outline" size={20} className="ml-2 text-gray-700" />
                    <Text>{editingCity ? 'تعديل المدينة' : 'إضافة مدينة جديدة'}</Text>
                  </Text>

                  <View className="space-y-4">
                    <View>
                      <Text className="mb-2 text-right text-sm font-medium text-gray-700">
                        الاسم بالإنجليزية
                      </Text>
                      <TextInput
                        value={cityForm.name}
                        onChangeText={(text) => setCityForm({ ...cityForm, name: text })}
                        placeholder="الاسم بالانجليزية"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-gray-900"
                      />
                    </View>

                    <View>
                      <Text className="mb-2 text-right text-sm font-medium text-gray-700">
                        الاسم بالعربية *
                      </Text>
                      <TextInput
                        value={cityForm.nameAr}
                        onChangeText={(text) => setCityForm({ ...cityForm, nameAr: text })}
                        placeholder="الاسم بالعربية"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-right text-gray-900"
                      />
                    </View>

                    <View className="flex-row items-center justify-between">
                      <Text className="text-sm font-medium text-gray-700">نشط</Text>
                      <Switch
                        value={cityForm.isActive}
                        onValueChange={(value) => setCityForm({ ...cityForm, isActive: value })}
                      />
                    </View>

                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={handleCitySubmit}
                        className="flex-1 flex-row items-center justify-center rounded-lg bg-gray-900 py-3">
                        <Ionicons
                          name="checkmark-circle-outline"
                          size={16}
                          color="white"
                          className="ml-2"
                        />
                        <Text className="text-white">{editingCity ? 'تحديث' : 'إضافة'}</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setShowCityForm(false);
                          resetCityForm();
                          setEditingCity(null);
                        }}
                        className="flex-1 flex-row items-center justify-center rounded-lg bg-gray-500 py-3">
                        <Ionicons
                          name="close-circle-outline"
                          size={16}
                          color="white"
                          className="ml-2"
                        />
                        <Text className="text-white">إلغاء</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )}

              {/* Cities List */}
              <View className="space-y-3">
                {cities.map((city) => (
                  <View key={city.id} className="rounded-xl border border-gray-200 bg-white p-4">
                    <View className="mb-3 flex-row items-start justify-between">
                      <View className="flex-row items-start">
                        <Ionicons
                          name="location-outline"
                          size={24}
                          className="ml-3 text-gray-400"
                        />
                        <View>
                          <Text className="text-right text-lg font-semibold text-gray-900">
                            {city.nameAr}
                          </Text>
                          <Text className="text-right text-sm text-gray-600">{city.name}</Text>
                        </View>
                      </View>
                      <View
                        className={`flex-row items-center rounded-full px-2 py-1 ${
                          city.isActive
                            ? 'border border-emerald-200 bg-emerald-50'
                            : 'border border-red-200 bg-red-50'
                        }`}>
                        <Ionicons
                          name={city.isActive ? 'checkmark-circle-outline' : 'close-circle-outline'}
                          size={12}
                          className={`ml-1 ${city.isActive ? 'text-emerald-700' : 'text-red-700'}`}
                        />
                        <Text
                          className={`text-xs ${
                            city.isActive ? 'text-emerald-700' : 'text-red-700'
                          }`}>
                          {city.isActive ? 'نشط' : 'معطل'}
                        </Text>
                      </View>
                    </View>

                    <View className="mb-3 flex-row items-center justify-between">
                      <View className="flex-row items-center space-x-4">
                        <View className="flex-row items-center">
                          <Ionicons
                            name="storefront-outline"
                            size={16}
                            className="ml-2 text-gray-500"
                          />
                          <Text className="text-sm text-gray-500">{city.merchantsCount} تاجر</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons
                            name="school-outline"
                            size={16}
                            className="ml-2 text-gray-500"
                          />
                          <Text className="text-sm text-gray-500">{city.trainersCount} مدرب</Text>
                        </View>
                      </View>
                    </View>

                    <View className="flex-row gap-2">
                      <TouchableOpacity
                        onPress={() => handleEditCity(city)}
                        className="flex-1 flex-row items-center justify-center rounded-lg bg-gray-100 py-2">
                        <Ionicons name="pencil-outline" size={16} className="ml-2 text-gray-700" />
                        <Text className="text-gray-700">تعديل</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeleteCity(city)}
                        className="flex-1 flex-row items-center justify-center rounded-lg bg-red-100 py-2">
                        <Ionicons name="trash-outline" size={16} className="ml-2 text-red-700" />
                        <Text className="text-red-700">حذف</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </>
  );
}
