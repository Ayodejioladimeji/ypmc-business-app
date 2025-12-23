import React from "react";
import { Pressable, StyleSheet, TouchableOpacity } from "react-native";

import { useNavigation } from "expo-router";
import { SvgXml } from "react-native-svg";
import { arrowBack } from "@/assets/svgs";



export const GoBackButton = ({ onPress }: { onPress?: () => void }) => {
  const navigation = useNavigation();

  const handlePress = onPress || (() => navigation.goBack());

  return (
    <TouchableOpacity style={styles.backButton} onPress={handlePress}>
      <SvgXml xml={arrowBack} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  backButton: {
    borderWidth:0.2,
    width: 40,
    height: 40,
    borderRadius: 9999,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#00000",
    shadowOffset: {
      width: 100,
      height: 100,
    },
  },
});