import React from "react";
import { ActivityIndicator } from "react-native";

export const Loader = () => {
  return <ActivityIndicator style={{ flex: 1 }} size='large' color="#f97216" />;
};
