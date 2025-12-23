import * as React from "react";
import { View } from "react-native";

import { Text } from "./ui";
import { s } from "react-native-size-matters";

export const RiderBadge = ({ status }: { status: string }) => {
  const getBackgroundColor = () => {
    if (status === "AWAY") return "orange";
    if (status === "ACTIVE") return "#e6f5e6";
    if (status === "INACTIVE") return "#e6e6e6";
    return "#f0f0f0"; // Default color for unexpected statuses
  };

  const getDotColor = () => {
    if (status === "AWAY") return "orange";
    if (status === "ACTIVE") return "green";
    if (status === "INACTIVE") return "gray";
    return "gray"; // Default color for unexpected statuses
  };

  return (
    <View
      style={{
        backgroundColor: getBackgroundColor(),
        minWidth: 80,
        padding: 4,
        borderRadius: 20,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        gap: 6,
      }}
    >
      <View
        style={{
          backgroundColor: getDotColor(),
          width: 7,
          height: 7,
          borderRadius: 40,
        }}
      />
      <Text style={{fontSize:s(12), fontFamily:'interMedium', textTransform:'capitalize'}}>{status}</Text>
    </View>
  );
};
