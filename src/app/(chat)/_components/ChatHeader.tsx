import React from "react";
import { Pressable, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Avatar } from "@/components";
import { Text } from "@/components/ui";

 const ChatHeader = () => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "white",
        paddingHorizontal: 12,
        justifyContent: "space-between",
        alignItems: "center",
        shadowColor: "#00000",
        shadowOffset: {
          width: 100,
          height: 100,
        },
      }}
    >
      <Pressable
        onPress={() => router.back()}
        style={{
          backgroundColor: "white",
          padding: 12,
          borderRadius: 20,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
      >
        <MaterialCommunityIcons name="close" size={20} />
      </Pressable>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Avatar
          size={48}
          source={{
            uri: "",
          }}
        />
        <Text style={{ marginTop: 12, fontSize: 17, fontWeight: 600 }}>
          ABC Logistics
        </Text>
      </View>
      <Pressable
        style={{
          backgroundColor: "white",
          padding: 12,
          borderRadius: 20,
          shadowColor: "black",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 4,
        }}
      >
        <MaterialCommunityIcons name="phone-outline" size={20} />
      </Pressable>
    </View>
  );
};

export default ChatHeader