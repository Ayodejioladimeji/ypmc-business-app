import React from "react";
import { View } from "react-native";

import {
  Ionicons,
  SimpleLineIcons,
} from "@expo/vector-icons";

import { Text } from "@/components/ui";
import { s } from "react-native-size-matters";

 const PaymentLinks = () => {
  const paymentLinks = [
    {
      icon: <Ionicons name="card-outline" size={20} />,
      label: "Manage withdrawal method",
    },
  ];

  return (
    <View
      style={{
        backgroundColor: "white",
        padding: 14,
        gap: 4,
      }}
    >
      {paymentLinks.map((option, index) => (
        <View
          key={index}
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingVertical: 16,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 18 }}>
            {option.icon}
            <Text style={{ fontSize: s(13), fontWeight: 500 }}>
              {option.label}
            </Text>
          </View>
          <SimpleLineIcons name="arrow-right" size={12} />
        </View>
      ))}
    </View>
  );
};

export default PaymentLinks