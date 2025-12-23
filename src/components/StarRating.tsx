import React from "react";
import { View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

import { Text } from "./ui";

export const StarRating = ({ rating }: { rating: any }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        backgroundColor: "#F3F3F3", paddingHorizontal: 5, paddingVertical: 3, borderRadius: 20,
        justifyContent: "center",
        alignItems: "center",
        gap: 4,
      }}
    >
      <Ionicons name="star" color="#f97216" size={10} />
      <Text
        style={{
          // color: "gray",
          fontSize: 12,
          marginTop: 1,
          fontFamily: "interSemiBold",
        }}
      >
        {rating}
      </Text>
    </View>
  );
};
