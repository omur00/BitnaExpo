import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Trash2, Image as ImageIcon } from 'lucide-react-native';
import { GET_IMAGEKIT_AUTH } from '@/utils/queries';
import imagekit from '@/lib/imagekit';
import { useLazyQuery } from '@apollo/client/react';


// Configuration for each type
const TYPE_CONFIG = {
  logo: {
    containerClass: 'h-40 w-40',
    imageClass: 'h-40 w-40 rounded-xl',
    resizeMode: 'contain',
    placeholderText: 'Upload Logo',
    hint: 'Square (1:1) • PNG/SVG Recommended',
    icon: ImageIcon,
    maxSize: 2, // MB
    multiple: false,
    showHint: true,
    maxCount: 1,
    aspect: [1, 1],
  },
  cover: {
    containerClass: 'h-56 w-full',
    imageClass: 'h-56 w-full rounded-xl',
    resizeMode: 'cover',
    placeholderText: 'Upload Cover',
    hint: 'Landscape (16:9) • Min 1200×675px',
    icon: ImageIcon,
    maxSize: 5,
    multiple: false,
    showHint: true,
    maxCount: 1,
    aspect: [16, 9],
  },
  gallery: {
    containerClass: 'h-48 w-full',
    imageClass: 'h-48 w-full rounded-lg',
    resizeMode: 'cover',
    placeholderText: 'Add Gallery Images',
    hint: 'Standard (4:3) • Max 5 images',
    icon: ImageIcon,
    maxSize: 5,
    multiple: true,
    showHint: true,
    maxCount: 5,
    aspect: [4, 3],
  },
  document: {
    containerClass: 'h-40 w-full',
    imageClass: 'h-40 w-full rounded-lg',
    resizeMode: 'contain',
    placeholderText: 'Upload Document Image',
    hint: 'JPG/PNG only • Max 10MB',
    icon: ImageIcon,
    maxSize: 10,
    multiple: false,
    showHint: true,
    maxCount: 1,
    aspect: undefined, // Free crop for documents
  },
};

const ImageUpload = ({ label, value, onChange, type = 'logo', folder = '/merchants/' }) => {
  const [loading, setLoading] = useState(false);
  const [uploadingCount, setUploadingCount] = useState(0);
  const config = TYPE_CONFIG[type] || TYPE_CONFIG.logo;
  const [getImageKitAuth] = useLazyQuery(GET_IMAGEKIT_AUTH);

  // Ensure value is array for gallery, string for others
  const normalizedValue = type === 'gallery' ? (Array.isArray(value) ? value : []) : value;

  const pickImage = async () => {
    // Check if gallery has reached max count
    if (type === 'gallery' && normalizedValue.length >= config.maxCount) {
      Alert.alert('Limit Reached', `Maximum ${config.maxCount} images allowed in gallery.`);
      return;
    }

    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (status !== 'granted') {
      Alert.alert(
        'Permission required',
        'Sorry, we need camera roll permissions to upload images.'
      );
      return;
    }

    const options = {
      mediaTypes: ['images'], // Images only, no PDFs
      allowsEditing: type !== 'gallery', // Only allow editing for single images
      aspect: config.aspect,
      quality: 0.6,
      base64: true,
      allowsMultipleSelection: config.multiple && type === 'gallery',
      selectionLimit:
        type === 'gallery'
          ? Math.min(config.maxCount - normalizedValue.length, 5) // Limit to remaining slots
          : 1,
    };

    const result = await ImagePicker.launchImageLibraryAsync(options);

    if (!result.canceled) {
      if (config.multiple && result.assets.length > 1) {
        await uploadMultipleImages(result.assets);
      } else {
        await uploadImage(result.assets[0].uri);
      }
    }
  };

  const uploadMultipleImages = async (assets) => {
    setLoading(true);
    setUploadingCount(assets.length);

    const uploadedUrls = [...normalizedValue];
    let successfulUploads = 0;

    for (const asset of assets) {
      try {
        // Check current count before each upload
        if (uploadedUrls.length >= config.maxCount) {
          Alert.alert(
            'Limit Reached',
            `Only ${config.maxCount} images allowed. Uploaded ${uploadedUrls.length} images.`
          );
          break;
        }

        const url = await uploadImage(asset.uri, true);
        if (url) {
          uploadedUrls.push(url);
          successfulUploads++;
        }
      } catch (error) {
        console.error('Upload error:', error);
      }
      setUploadingCount((prev) => prev - 1);
    }

    if (successfulUploads > 0) {
      onChange(uploadedUrls);

      if (successfulUploads > 1) {
        Alert.alert('Success', `Uploaded ${successfulUploads} images to gallery.`);
      }
    }

    setLoading(false);
    setUploadingCount(0);
  };

  // In your ImageUpload component - REPLACE the uploadImage function
  const uploadImage = async (uri, silent = false) => {
    setLoading(true);

    try {
      console.log('📸 Starting upload...');

      // 1. Convert image URI to base64
      const response = await fetch(uri);
      const blob = await response.blob();

      const base64 = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log('✅ Base64 conversion complete');
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });

      const fileName = `${type}_${Date.now()}.jpg`;
      console.log('📝 File name:', fileName);

      // 2. Get auth from backend using useLazyQuery
      console.log('🔐 Getting ImageKit auth...');
      const { data, error } = await getImageKitAuth();

      if (error) {
        console.error('❌ Auth error:', error);
        throw error;
      }

      console.log('✅ Auth received');
      const { token, expire, signature } = data.getImageKitAuth;

      // 3. Upload DIRECTLY to ImageKit
      console.log('🔼 Uploading to ImageKit...');
      const result = await new Promise((resolve, reject) => {
        imagekit.upload(
          {
            file: base64,
            fileName: fileName,
            folder: folder,
            useUniqueFileName: true,
            token,
            expire,
            signature,
          },
          (error, result) => {
            if (error) {
              console.error('❌ ImageKit upload error:', error);
              reject(error);
            } else {
              console.log('✅ ImageKit upload successful!');
              console.log('📊 URL:', result.url);
              resolve(result);
            }
          }
        );
      });

      // 4. Handle result
      if (type === 'gallery') {
        return result.url;
      } else {
        onChange(result.url);
        if (!silent) {
          Alert.alert('Success', `${config.placeholderText} uploaded successfully!`);
        }
      }
    } catch (error) {
      console.error('🔥 Upload error:', error);
      if (!silent) {
        Alert.alert('Upload Failed', error.message || 'Failed to upload image');
      }
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeImage = (index = null) => {
    const title = type === 'gallery' ? 'Remove Image' : `Remove ${label}`;
    const message =
      type === 'gallery'
        ? 'Are you sure you want to remove this image from gallery?'
        : 'Are you sure you want to remove this image?';

    Alert.alert(title, message, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        onPress: () => {
          if (type === 'gallery' && index !== null) {
            const newValue = [...normalizedValue];
            newValue.splice(index, 1);
            onChange(newValue);
          } else {
            onChange(type === 'gallery' ? [] : '');
          }
        },
        style: 'destructive',
      },
    ]);
  };

  const renderPlaceholder = () => {
    const Icon = config.icon;
    const remainingSlots = type === 'gallery' ? config.maxCount - normalizedValue.length : 0;

    return (
      <TouchableOpacity
        onPress={pickImage}
        disabled={loading || (type === 'gallery' && normalizedValue.length >= config.maxCount)}
        className={`
          ${config.containerClass}
          items-center justify-center
          rounded-xl border-2 border-dashed border-gray-300 
          bg-gradient-to-br from-gray-50 to-gray-100
          ${loading ? 'opacity-50' : 'active:border-amber-400 active:opacity-70'}
          ${type === 'gallery' && normalizedValue.length >= config.maxCount ? 'opacity-50' : ''}
          overflow-hidden
        `}
        activeOpacity={0.7}>
        {loading ? (
          <View className="items-center">
            <ActivityIndicator size="large" color="#d97706" />
            {uploadingCount > 0 && (
              <Text className="mt-2 text-xs text-gray-500">
                Uploading {uploadingCount} image{uploadingCount > 1 ? 's' : ''}...
              </Text>
            )}
          </View>
        ) : (
          <View className="items-center p-6">
            <View className="mb-4 h-16 w-16 items-center justify-center rounded-full border-2 border-amber-200 bg-gradient-to-br from-amber-100 to-amber-50">
              <Icon size={28} color="#d97706" />
            </View>
            <Text className="mb-1 text-base font-semibold text-gray-700">
              {config.placeholderText}
            </Text>
            {config.showHint && (
              <Text className="px-4 text-center text-xs text-gray-400">{config.hint}</Text>
            )}
            {type === 'gallery' && (
              <View className="mt-2 flex-row items-center space-x-1">
                <Text className="text-xs font-medium text-amber-600">
                  {normalizedValue.length} / {config.maxCount}
                </Text>
                {remainingSlots > 0 && (
                  <Text className="text-xs text-gray-500">({remainingSlots} remaining)</Text>
                )}
              </View>
            )}
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderSingleImage = () => {
    if (!normalizedValue || normalizedValue === '') return null;

    return (
      <View className="relative">
        <Image
          source={{ uri: normalizedValue }}
          className={config.imageClass}
          resizeMode={config.resizeMode}
        />

        <TouchableOpacity
          onPress={() => removeImage()}
          className={`
            absolute -right-2 -top-2 h-8 w-8 items-center justify-center 
            rounded-full border-2 border-white bg-gray-500
            bg-gradient-to-br from-red-500 to-red-600
            shadow-lg active:scale-95
          `}>
          <Trash2 size={16} color="white" />
        </TouchableOpacity>
      </View>
    );
  };

  const renderGallery = () => {
    if (!Array.isArray(normalizedValue) || normalizedValue.length === 0) {
      return renderPlaceholder();
    }

    return (
      <View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="py-2">
          <View className="flex-row gap-2">
            {normalizedValue.map((imageUrl, index) => (
              <View key={index} className="relative">
                <Image
                  source={{ uri: imageUrl }}
                  className="h-48 w-48 rounded-lg"
                  resizeMode="cover"
                />
                <TouchableOpacity
                  onPress={() => removeImage(index)}
                  className="absolute -right-2 -top-2 h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-red-500">
                  <Text className="font-bold text-white">×</Text>
                </TouchableOpacity>
              </View>
            ))}

            {normalizedValue.length < config.maxCount && (
              <TouchableOpacity
                onPress={pickImage}
                disabled={loading}
                className="h-48 w-48 items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50">
                {loading ? (
                  <ActivityIndicator size="large" color="#d97706" />
                ) : (
                  <>
                    <View className="mb-3 h-12 w-12 items-center justify-center rounded-full bg-amber-100">
                      <Text className="text-2xl text-amber-600">+</Text>
                    </View>
                    <Text className="text-sm font-medium text-gray-600">إضافة المزيد</Text>
                    <Text className="mt-1 text-xs text-gray-400">
                      {config.maxCount - normalizedValue.length} متبقي
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        <Text className="mt-2 text-center text-xs text-gray-500">
          {normalizedValue.length} من {config.maxCount} صور مرفوعه
        </Text>
      </View>
    );
  };

  return (
    <View className="mb-6">
      <View className="mb-3 flex-row items-center justify-between">
        <Text className="w-full font-arabic-bold text-amber-600">{label}</Text>
        {type === 'gallery' && Array.isArray(normalizedValue) && (
          <Text className="text-sm text-gray-500">
            {normalizedValue.length} / {config.maxCount}
          </Text>
        )}
      </View>

      {type === 'gallery'
        ? renderGallery()
        : normalizedValue && normalizedValue !== ''
          ? renderSingleImage()
          : renderPlaceholder()}

      {type !== 'gallery' && normalizedValue && normalizedValue !== '' && (
        <TouchableOpacity
          onPress={pickImage}
          className="mt-3 self-start rounded-lg border border-amber-200 bg-amber-50 px-4 py-2 active:bg-amber-100">
          <Text className="text-sm font-medium text-amber-700">
            Change {type === 'logo' ? 'Logo' : type === 'cover' ? 'Cover' : 'Document'}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageUpload;
