import React from "react";
import { Text } from "react-native";

export const ErrorText = ({ message }: { message: any }) => {
  return <Text style={{ color: "red", fontSize: 12, marginLeft:5 }}>{message}</Text>;
};
