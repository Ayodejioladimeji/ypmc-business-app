import React from "react";
import { View } from "react-native";

import { Avatar } from "@/components/Avatar";
import { Text } from "@/components/ui";

export const OrgRiderMessages = ({
  riderName,
  message,
  time,
}: {
  riderName: string;
  message: string;
  time: string;
}) => {
  return (
    <View
      style={{
        borderRadius: 12,
        marginTop: 20,
        marginBottom: 20
      }}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            gap: 8,
          }}
        >
          <Avatar
            size={40}
            source={{
              uri: "",
            }}
          />
          <View
            style={{
              gap: 3,
            }}
          >
            <Text
              style={{
                fontSize: 17,
                fontWeight: 600,
              }}
            >
              {riderName}
            </Text>
            <Text
              style={{
                fontSize: 15,
                color: "gray",
              }}
            >
              {message.slice(0, 40)}...
            </Text>
          </View>
        </View>

        <Text
          style={{
            fontSize: 14,
            color: "#797979",
            fontWeight: 600,
          }}
        >
          {time}
        </Text>
      </View>
    </View>
  );
};
