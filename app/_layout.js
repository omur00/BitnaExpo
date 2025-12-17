import { SafeAreaProvider, useSafeAreaInsets } from 'react-native-safe-area-context';
import '../global.css';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import Drawer from 'expo-router/drawer';
import { ThemeProvider } from '@/theme/theme-provider';
import { ApolloProvider } from '@apollo/client/react';
import client from '@/utils/apollo-client';
import { AuthProvider } from '@/context/auth-context';
import { useEffect, useState } from 'react';
import { I18nManager, Image, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import logo from '@/assets/logo.png';
import { NotificationProvider } from '@/context/notification-context';
import RouteGuard from '@/components/RouteGuard';
import NotificationContainer from '@/components/notification/NotificationContainer';
import CustomDrawerContent from '@/components/CustomDrawerContent';
import Loading from '@/components/Loading';

SplashScreen.preventAutoHideAsync();

export default function Layout() {
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
      if (appIsReady) {
        await SplashScreen.hideAsync();
      }
    }

    hideSplashScreen();
  }, [appIsReady]);

  if (!appIsReady) {
    return <Loading />;
  }
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ThemeProvider>
          <ApolloProvider client={client}>
            <AuthProvider>
              <NotificationProvider>
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
              </NotificationProvider>
            </AuthProvider>
          </ApolloProvider>
        </ThemeProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
