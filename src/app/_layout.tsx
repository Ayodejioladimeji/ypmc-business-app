import React, { useEffect } from "react";

import {
  Inter_700Bold as interBold,
  Inter_500Medium as interMedium,
  Inter_400Regular as interRegular,
  Inter_600SemiBold as interSemiBold,
} from "@expo-google-fonts/inter";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import "react-native-reanimated";

import { StatusBar } from "expo-status-bar";
import { Provider } from "react-redux";

import { store } from "@/redux/store";
import { DataProvider } from "@/store/GlobalState";
import { Toaster } from "sonner-native";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import { Toasts } from "@/components/ui/Toasts";


// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded] = useFonts({
    interRegular,
    interMedium,
    interBold,
    interSemiBold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);


  if (!loaded) {
    return null;
  }

  return (
    <DataProvider>
      <Toasts />
      <Provider store={store}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack screenOptions={{ headerShown:false, gestureEnabled: false }}>
              <Stack.Screen
                name="index"
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen
                name="(auth)"
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen
                name="(org)"
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen
                name="(rider)"
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen
                name="(chat)/[id]"
                options={{ headerShown: false, gestureEnabled: false }}
              />
              <Stack.Screen name="+not-found" />
            </Stack>

            <StatusBar style="dark" />
            <Toaster position="top-center" />
          </BottomSheetModalProvider>
        </GestureHandlerRootView>
      </Provider>
    </DataProvider>
  );
}
