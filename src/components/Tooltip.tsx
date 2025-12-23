import React from "react";
import { View } from "react-native";

import { Feather } from "@expo/vector-icons";

import { Text } from "./ui/Text";

export const Tooltip = ({ text }: { text: string }) => {
  return (
    <View style={{ display: "flex", flexDirection: "row", gap: 5, margin: 5 }}>
      <Feather name="info" size={12} color="#636363" />
      <Text style={{ color: "#636363", fontSize: 12 }}>{text}</Text>
    </View>
  );
};
