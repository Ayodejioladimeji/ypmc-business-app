import React from "react";

import { Stack } from "expo-router";

const RiderLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="rider-sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="rider-sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="additional-details" options={{ headerShown: false }} />
      <Stack.Screen name="business-hours" options={{ headerShown: false }} />
      <Stack.Screen name="delivery-rate" options={{ headerShown: false }} />
      <Stack.Screen name="upload-profile-photo" options={{ headerShown: false }} />
    </Stack>
  );
};

export default RiderLayout;
