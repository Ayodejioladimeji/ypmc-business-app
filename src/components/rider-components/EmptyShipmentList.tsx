import React from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { emptyShipment } from "@/assets/svgs";
import { Text } from "../ui";


export const EmptyShipmentList = ({ message }: { message: string }) => {
  return (
    <View
      style={{
        minHeight: 400,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SvgXml xml={emptyShipment} />
      <Text
        style={{
          fontSize: 17,
          color: "gray",
        }}
      >
        {message}
      </Text>
    </View>
  );
};
