import React from "react";

import { Stack } from "expo-router";

import { AppBar } from "@/components";

const AuthLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="org-sign-up" options={{ headerShown: false }} />
      <Stack.Screen name="org-sign-in" options={{ headerShown: false }} />
      <Stack.Screen name="take-picture" options={{ headerShown: false }} />
      <Stack.Screen
        name="verify-identity"
        options={{ header: () => <AppBar title={""} /> }}
      />
      <Stack.Screen name="additional-details" options={{ headerShown: false }} />
      <Stack.Screen name="business-hours" options={{ headerShown: false }} />
      <Stack.Screen name="delivery-rate" options={{ headerShown: false }} />
    </Stack>
  );
};

export default AuthLayout;
