import * as React from "react";
import { View } from "react-native";

import { Text } from "./ui";

export const TransitBadge = () => (
  <View
    style={{
      width: 65,
      backgroundColor: "#e8f3f9",
      padding: 4,
      borderRadius: 20,
      justifyContent: 'center',
      alignItems: 'center'
    }}
  >
    <Text style={{ color: "#2788c7" }}>In transit</Text>
  </View>
);
