import React from "react";
import { View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

export const VerifiedCheckMark = () => {
  return (
    <View
      style={{
        backgroundColor: "#4fb948",
        height: 16,
        width:  16,
        borderRadius: 40,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <MaterialCommunityIcons name="check" color='white' />
    </View>
  );
};
