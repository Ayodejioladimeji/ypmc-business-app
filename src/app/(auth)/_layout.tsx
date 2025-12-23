import React, { useContext, useEffect } from "react";
import { Stack } from "expo-router";
import { SocketClient } from "@/components/rider-components/socket-client";
import { DataContext } from "@/store/GlobalState";
import * as Location from "expo-location";

const AuthLayout = () => {

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

    })();
  }, []);

  // 

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: "#fff" },
        }}
      >
        <Stack.Screen name="sign-up" options={{ headerShown: false }} />
        <Stack.Screen name="sign-in" options={{ headerShown: false }} />
      </Stack>
    </>
  );
};

export default AuthLayout;
