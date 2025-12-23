import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Text } from "./ui";

interface BoxInputProps {
  icon: any;
  header: string;
  text: string;
  isSelected: boolean;
  onPress: () => void;
}

export const BoxInput = ({
  icon,
  header,
  text,
  isSelected,
  onPress,
}: BoxInputProps) => {
  return (
    <Pressable
      style={[styles.box, isSelected && styles.selectedBox]}
      onPress={onPress}
    >
      <MaterialCommunityIcons
        name={icon}
        size={20}
        color={isSelected ? "orange" : "black"}
      />
      <View style={styles.texts}>
        <Text style={{ fontWeight: "bold", fontSize: 16 }}>{header}</Text>
        <Text>{text}</Text>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  box: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 12,
    padding: 12,
    gap: 24,
  },
  selectedBox: {
    display: "flex",
    backgroundColor: "#fefaf8",
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "orange",
    borderRadius: 12,
    padding: 12,
    gap: 24,
  },
  texts: {
    display: "flex",
    gap: 8,
  },
});
