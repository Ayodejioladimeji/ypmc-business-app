import React from "react";
import { View } from "react-native";
import { SvgXml } from "react-native-svg";
import { rider } from "@/assets/svgs";
import { Text } from "../ui";
import { s } from "react-native-size-matters";

// 

export const EmptyRiderList = ({ message }: { message: string }) => {
  return (
    <View
      style={{
        flex:1,
        // minHeight: 500,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <SvgXml xml={rider} />
      <Text
        style={{
          fontSize: s(14),
          color: "gray",
        }}
      >
        {message}
      </Text>
    </View>
  );
};
