import React from "react";
import { View } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

import { Text } from "@/components/ui";

export const NotificationComponent = ({ date, time, message }) => {
  return (
    <View
      style={{
        borderRadius: 12,
      }}
    >
      <Text
        style={{
          fontSize: 14,
          marginTop: 12,
          fontWeight: "bold",
        }}
      >
        {date}
      </Text>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 14,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 6,
          }}
        >
          <View
            style={{
              marginTop: 2,
              backgroundColor: "#f3f3f3",
              height: 28,
              padding: 6,
              borderRadius: 40,
            }}
          >
            <MaterialCommunityIcons
              name="bell-outline"
              size={16}
              color="#797979"
            />
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 4,
            }}
          >
            <Text
              style={{
                fontSize: 16,
                maxWidth: 250,
                lineHeight: 28,
              }}
            >
              {message}
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 15,
            color: "#797979",
          }}
        >
          {time}
        </Text>
      </View>
    </View>
  );
};
