// lib/imagekit.js
import ImageKit from 'imagekit-javascript';
import 'react-native-url-polyfill/auto';

// Initialize with your public key and endpoint
const imagekit = new ImageKit({
  publicKey: process.env.EXPO_PUBLIC_IMAGEKIT_PUBLIC_KEY,
  urlEndpoint: process.env.EXPO_PUBLIC_IMAGEKIT_URL_ENDPOINT,
});

export default imagekit;