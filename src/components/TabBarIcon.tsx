import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { TabIconProps } from "@/types/type";

export const TabBarIcon = ({ icon, color, name }: TabIconProps) => {

  return (
    <View style={styles.container}>
      <MaterialCommunityIcons name={icon} size={icon === "home-outline" ? 29 : 25} color={color} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 2,
  },
  label: {
    fontSize: 12,
    color: "white",
  },
});
