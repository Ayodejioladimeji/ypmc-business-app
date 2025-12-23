import React from "react";
import { Pressable, View } from "react-native";
import { router } from "expo-router";
import { Appbar } from "react-native-paper";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Avatar } from "./Avatar";
import { Text } from "./ui";

export const ChatAppBar = () => {
  return (
    <Appbar.Header
      mode="center-aligned"
      style={{
        height: 90,
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
      <Pressable onPress={() => router.back()}>
        <MaterialCommunityIcons name="close" size={25} />
      </Pressable>
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <Avatar
          size={48}
          source={{
            uri: "",
          }}
        />
        <Text style={{marginTop: 12, fontSize: 17, fontWeight: 600}}>ABC Logistics</Text>
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
    </Appbar.Header>
  );
};
