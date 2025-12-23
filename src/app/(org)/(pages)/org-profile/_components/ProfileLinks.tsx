import React from "react";
import { Pressable, View } from "react-native";

import {
  FontAwesome6,
  Ionicons,
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";

import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";

 const ProfileLinks = () => {
  const profileLinks = [
    {
      icon: <MaterialCommunityIcons name="account-circle-outline" size={20} />,
      label: "Profile details",
      href: "/org-profile-details",
    },
    {
      icon: <Ionicons name="time-outline" size={20} />,
      label: "Business hours",
      href: "/business-hours",
    },
    {
      icon: <FontAwesome6 name="naira-sign" size={20} />,
      label: "Delivery rate",
      href: "/delivery-rate",
    },
  ];

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 14,
        gap: 4,
      }}
    >
      {profileLinks.map((option, index) => (
        <Pressable
          onPress={() => router.push(option?.href)}
          key={index}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 16,
          }}
        >
          <View
            style={{ flexDirection: "row", alignItems: "center", gap: 18 }}
          >
            {option.icon}
            <Text style={{ fontSize: s(13), fontWeight: 500 }}>
              {option.label}
            </Text>
          </View>
          <SimpleLineIcons name="arrow-right" size={12} />
        </Pressable>
      ))}
    </View>
  );
};

export default ProfileLinks