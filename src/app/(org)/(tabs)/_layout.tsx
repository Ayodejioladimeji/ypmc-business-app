import React from "react";

import { Tabs } from "expo-router";

import { AppBar, TabBarIcon } from "@/components";
import { colors } from "@/theme";
import { Platform, Pressable } from "react-native";
import { SocketClient } from "@/components/rider-components/socket-client";

export default function TabLayout() {
  return (
    <>
      <SocketClient />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: colors.primary,
          tabBarStyle: {
            shadowColor: "transparent",
            borderTopWidth: 0.7, height: Platform.OS === 'ios' ? 95 : 80,
            paddingBottom: 4,
            paddingTop: 10,
            elevation: 2,
          },
          tabBarLabelStyle: {
            fontSize: 14,
          },
        }}
      >
        <Tabs.Screen
          name="home"
          options={{
            title: "Home",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="Home" icon="home-outline" color={color} />
            ),
            tabBarButton: (props) => (
              <Pressable
                {...props}
                android_ripple={{ color: "transparent" }}
              />
            ),
           
          }}
        />
        <Tabs.Screen
          name="shippings"
          options={{
            title: "Shippings",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="Shippings" icon="bike-fast" color={color} />
            ),
            tabBarButton: (props) => (
              <Pressable
                {...props}
                android_ripple={{ color: "transparent" }}
              />
            ),
            
          }}
        />
        <Tabs.Screen
          name="wallet"
          options={{
            title: "Wallet",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="Wallet" icon="wallet-outline" color={color} />
            ),
            tabBarButton: (props) => (
              <Pressable
                {...props}
                android_ripple={{ color: "transparent" }}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="riders"
          options={{
            title: "Riders",
            tabBarIcon: ({ color }) => (
              <TabBarIcon name="Riders" icon="racing-helmet" color={color} />
            ),
            tabBarButton: (props) => (
              <Pressable
                {...props}
                android_ripple={{ color: "transparent" }}
              />
            ),
          }}

        />
      </Tabs>
    </>
  );
}
