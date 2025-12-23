import React from "react";
import { Pressable, StyleSheet, View } from "react-native";

import { FontAwesome6 } from "@expo/vector-icons";

import { Text } from "./ui";

export const LinkWithLabel = ({
  label,
  icon,
  text,
  onPress,
}: {
  label: string;
  icon: any;
  text: string;
  onPress: any;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <Text style={styles.label}>{label}</Text>
      </View>

      <Pressable style={styles.semiContainer} onPress={onPress}>
        <FontAwesome6 name={icon} />
        <Text style={styles.text}>{text}</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    paddingVertical: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000000",
  },
  semiContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    // backgroundColor: "#f3f3f3",
    borderRadius: 10,
    gap: 8,
    padding: 8,
    height: 55,
  },
  text: {
    fontSize: 15,
  },
});
