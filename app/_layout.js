import { SafeAreaProvider } from 'react-native-safe-area-context';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from 'expo-router/drawer';
import { ThemeProvider } from '@/theme/theme-provider';
import { ApolloProvider } from '@apollo/client/react';
import client from '@/utils/apollo-client';
import { AuthProvider } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { I18nManager } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import { NotificationProvider } from '@/context/notification-context';
import RouteGuard from '@/components/RouteGuard';
import NotificationContainer from '@/components/notification/NotificationContainer';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import Loading from '@/components/Loading';
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: 'https://a3f249b45b143d83de76fbf4c8034adc@o4509946261864448.ingest.de.sentry.io/4510581251178576',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // Configure Session Replay
  replaysSessionSampleRate: 0.1,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration(), Sentry.feedbackIntegration()],
  

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

SplashScreen.setOptions({
  duration: 1000,
  fade: true,
});
SplashScreen.preventAutoHideAsync();

const AppWrapper = ({ children }) => {
  const [fontsLoaded] = useFonts({
    NotoKufiArabicBlack: require('../assets/fonts/NotoKufiArabic-Black.ttf'),
    NotoKufiArabicBold: require('../assets/fonts/NotoKufiArabic-Bold.ttf'),
    NotoKufiArabicExtraBold: require('../assets/fonts/NotoKufiArabic-ExtraBold.ttf'),
    NotoKufiArabicExtraLight: require('../assets/fonts/NotoKufiArabic-ExtraLight.ttf'),
    NotoKufiArabicLight: require('../assets/fonts/NotoKufiArabic-Light.ttf'),
    NotoKufiArabicMedium: require('../assets/fonts/NotoKufiArabic-Medium.ttf'),
    NotoKufiArabicRegular: require('../assets/fonts/NotoKufiArabic-Regular.ttf'),
    NotoKufiArabicSemiBold: require('../assets/fonts/NotoKufiArabic-SemiBold.ttf'),
    NotoKufiArabicThin: require('../assets/fonts/NotoKufiArabic-Thin.ttf'),
  });

  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        I18nManager.forceRTL(true);
        I18nManager.allowRTL(true);
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  useEffect(() => {
    async function hideSplashScreen() {
      if (fontsLoaded && appIsReady) {
        await SplashScreen.hideAsync();
      }
    }

    hideSplashScreen();
  }, [fontsLoaded, appIsReady]);

  if (!fontsLoaded || !appIsReady) {
    return <Loading />;
  }

  return children;
};

export default Sentry.wrap(function Layout() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <ApolloProvider client={client}>
            <AuthProvider>
              <NotificationProvider>
                <AppWrapper>
                  <RouteGuard>
                    <Drawer
                      initialRouteName="index"
                      drawerContent={(props) => <CustomDrawerContent {...props} />}
                      screenOptions={{
                        headerShown: false,
                        drawerPosition: 'right',
                        drawerLabelStyle: {
                          fontSize: 16,
                          fontWeight: '500',
                        },
                      }}
                    />
                  </RouteGuard>
                  <NotificationContainer />
                </AppWrapper>
              </NotificationProvider>
            </AuthProvider>
          </ApolloProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
});