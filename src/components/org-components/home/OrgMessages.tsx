import React, { useContext } from "react";
import { Pressable, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";
import { DataContext } from "@/store/GlobalState";

export const OrgMessages = () => { 
  const {state} = useContext(DataContext)

  // 

  return (
    <Pressable
      onPress={() => router.push("/(org)/messages")}
      style={{ position: "relative" }}
    >
      <MaterialCommunityIcons name="message-reply-text-outline" size={22} />
      {state?.newChats && <View
        style={{
          position: "absolute",
          right: -5,
          top: -5,
          height: 10,
          width: 10,
          backgroundColor: "#f97216",
          borderRadius: 20,
          alignItems: "center",
          justifyContent:'center'
        }}
      >
      </View>}
    </Pressable>
  );
};
