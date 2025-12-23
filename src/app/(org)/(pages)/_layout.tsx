import React from "react";

import { Stack } from "expo-router";

import { AppBar } from "@/components";

const OrgPagesLayout = () => {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="rider-profile/[riderId]"
          options={{
            header: () => <AppBar title="Rider profile" />,
          }}
        />
        <Stack.Screen
          name="rider-history/[id]"
          options={{
            header: () => <AppBar title="Rider history" />,
          }}
        />
        <Stack.Screen
          name="shipment-order"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="order-success"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="order-reject"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="delete-rider"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="org-profile/index"
          options={{
            header: () => <AppBar title="Company profile" />,
          }}
        />
        <Stack.Screen
          name="org-profile-details"
          options={{
            header: () => <AppBar title="Profile details" />,
          }}
        />
        <Stack.Screen
          name="business-hours"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="delivery-rate"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="change-password"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="support"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="case-request"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="faqs"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="notifications"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="notification-settings"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="delivery-details"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="invite-rider"
          options={{
            header: () => <AppBar title="Invite Rider" />,
          }}
        />
        <Stack.Screen
          name="transactions"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="transaction-details"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="riders-earnings"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="request-withdrawal"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="track-shipment"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="kyc"
          options={{
            headerShown: false
          }}
        />
        <Stack.Screen
          name="kyc-success"
          options={{
            headerShown: false
          }}
        />
      </Stack>
    </>
  );
};

export default OrgPagesLayout;
