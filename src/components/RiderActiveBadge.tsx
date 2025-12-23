import React, { useContext } from "react";
import { View } from "react-native";

import { Text } from "./ui";
import { s } from "react-native-size-matters";
import { DataContext } from "@/store/GlobalState";



export const RiderActiveBadge = () => {
  const {state} = useContext(DataContext)

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
      }}
    >
      <View
        style={{
          height: 8,
          width: 8,
          backgroundColor: state?.user?.status === "INACTIVE" ? "gray" : "#4fb948",
          borderRadius: 40,
        }}
      />
      <Text
        style={{
          fontSize:s(10)
        }}
      >
        {state?.user?.status === "INACTIVE" ? "Offline" : "Online"}
      </Text>
    </View>
  );
};
