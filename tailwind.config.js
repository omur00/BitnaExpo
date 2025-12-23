/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'arabic-black': ['NotoKufiArabicBlack'],
        'arabic-bold': ['NotoKufiArabicBold'],
        'arabic-extrabold': ['NotoKufiArabicExtraBold'],
        'arabic-extralight': ['NotoKufiArabicExtraLight'],
        'arabic-light': ['NotoKufiArabicLight'],
        'arabic-medium': ['NotoKufiArabicMedium'],
        'arabic-regular': ['NotoKufiArabicRegular'],
        'arabic-semibold': ['NotoKufiArabicSemiBold'],
        'arabic-thin': ['NotoKufiArabicThin'],
      },
    },
  },
  plugins: [],
  rtl: true,
};
