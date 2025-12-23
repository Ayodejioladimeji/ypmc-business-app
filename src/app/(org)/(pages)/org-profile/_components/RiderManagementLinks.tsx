import React from "react";
import { TouchableOpacity, View } from "react-native";

import {
  MaterialCommunityIcons,
  SimpleLineIcons,
} from "@expo/vector-icons";

import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";
import { useRouter } from "expo-router";

const RiderManagementLinks = () => {
  const router = useRouter()

  const riderManagementLinks = [
    {
      icon: <MaterialCommunityIcons name="chat-outline" size={20} />,
      label: "Messages",
      link: "/(org)/messages"
    },
    {
      icon: <MaterialCommunityIcons name="racing-helmet" size={20} />,
      label: "Invite rider",
      link: "/invite-rider"
    },
  ];

  // 

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 14,
        gap: 4,
      }}
    >
      {riderManagementLinks.map((option, index) => (
        <TouchableOpacity onPress={() => router.push(option?.link)}
          key={index}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
            {option.icon}
            <Text style={{ fontSize: s(13), fontWeight: 500 }}>
              {option.label}
            </Text>
          </View>
          <SimpleLineIcons name="arrow-right" size={12} />
        </TouchableOpacity>
      ))}
    </View>
  );
};

export default RiderManagementLinks