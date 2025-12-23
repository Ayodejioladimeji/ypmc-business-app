import React from "react";

import { Stack } from "expo-router";

const Layout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="verify-otp" options={{ headerShown: false }} />
      <Stack.Screen name="create-new-password" options={{ headerShown: false }} />
    </Stack>
  );
};

export default Layout;
